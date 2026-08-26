"""
Test suite for edge cases, security controls, and input validation
"""
import pytest
from httpx import AsyncClient, ASGITransport
import mongomock_motor
from app.main import app
from app.api.deps import get_db


@pytest.fixture
def mock_db():
    client = mongomock_motor.AsyncMongoMockClient()
    return client["test_edge_cases_db"]


@pytest.mark.asyncio
async def test_auth_edge_cases(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # 1. Test invalid email formats
            bad_emails = ["notanemail", "missing@domain", "@nodomain.com", "spaces in@email.com"]
            for email in bad_emails:
                res = await client.post("/api/v1/auth/register", json={"email": email, "password": "ValidPassword123!"})
                assert res.status_code == 422, f"Expected 422 for invalid email: {email}"

            # 2. Test short password (< 8 chars)
            res = await client.post("/api/v1/auth/register", json={"email": "valid@example.com", "password": "short"})
            assert res.status_code == 422

            # 3. Test successful registration
            res1 = await client.post("/api/v1/auth/register", json={"email": "caseuser@example.com", "password": "Password123!"})
            assert res1.status_code == 201
            
            # Duplicate registration
            res2 = await client.post("/api/v1/auth/register", json={"email": "caseuser@example.com", "password": "Password123!"})
            assert res2.status_code == 409

            # Login with valid credentials
            res3 = await client.post("/api/v1/auth/login", json={"email": "caseuser@example.com", "password": "Password123!"})
            assert res3.status_code == 200
            assert "access_token" in res3.json()["data"]

            # Login with wrong password
            res4 = await client.post("/api/v1/auth/login", json={"email": "caseuser@example.com", "password": "WrongPassword!"})
            assert res4.status_code == 401
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_scan_input_validation(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            reg = await client.post("/api/v1/auth/register", json={"email": "scanner@test.com", "password": "Password123!"})
            token = reg.json()["data"]["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Text scan with empty text
            res = await client.post("/api/v1/scans", json={"analysis_type": "text", "text": "   "}, headers=headers)
            assert res.status_code in [400, 422]

            # 2. URL scan with empty URL
            res = await client.post("/api/v1/scans", json={"analysis_type": "url", "url": ""}, headers=headers)
            assert res.status_code in [400, 422]

            # 3. Combined scan missing URL
            res = await client.post("/api/v1/scans", json={"analysis_type": "combined", "text": "Valid message text here"}, headers=headers)
            assert res.status_code in [400, 422]

            # 4. Combined scan missing text
            res = await client.post("/api/v1/scans", json={"analysis_type": "combined", "url": "https://example.com"}, headers=headers)
            assert res.status_code in [400, 422]

            # 5. Invalid analysis type
            res = await client.post("/api/v1/scans", json={"analysis_type": "invalid_type", "text": "Some text"}, headers=headers)
            assert res.status_code == 422
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_ssrf_and_malicious_urls(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            reg = await client.post("/api/v1/auth/register", json={"email": "ssrf_tester@test.com", "password": "Password123!"})
            token = reg.json()["data"]["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            dangerous_urls = [
                "http://127.0.0.1:8000/secret",
                "http://localhost:5000",
                "http://169.254.169.254/latest/meta-data",
                "http://10.0.0.1/admin",
                "http://192.168.1.1/router",
                "file:///etc/passwd",
            ]

            for durl in dangerous_urls:
                res = await client.post("/api/v1/scans", json={"analysis_type": "url", "url": durl}, headers=headers)
                assert res.status_code == 422
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_idor_cross_user_isolation(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            # Create User A & User B
            regA = await client.post("/api/v1/auth/register", json={"email": "userA@test.com", "password": "Password123!"})
            tokenA = regA.json()["data"]["access_token"]
            headersA = {"Authorization": f"Bearer {tokenA}"}

            regB = await client.post("/api/v1/auth/register", json={"email": "userB@test.com", "password": "Password123!"})
            tokenB = regB.json()["data"]["access_token"]
            headersB = {"Authorization": f"Bearer {tokenB}"}

            # User A creates a scan
            scanA = await client.post(
                "/api/v1/scans",
                json={"analysis_type": "text", "text": "100% guaranteed return with zero risk deposit USDT"},
                headers=headersA
            )
            assert scanA.status_code == 201
            scan_id = scanA.json()["scan_id"]

            # User B tries to fetch User A's scan -> MUST be 404 (IDOR protected)
            fetch_by_B = await client.get(f"/api/v1/scans/{scan_id}", headers=headersB)
            assert fetch_by_B.status_code == 404

            # User B tries to delete User A's scan -> MUST be 403 or 404
            delete_by_B = await client.delete(f"/api/v1/scans/{scan_id}", headers=headersB)
            assert delete_by_B.status_code in [403, 404]

            # User B's list must be empty
            list_B = await client.get("/api/v1/scans", headers=headersB)
            assert len(list_B.json()["data"]) == 0
            assert list_B.json()["pagination"]["total"] == 0

            # User B's dashboard stats must be all zeros
            stats_B = await client.get("/api/v1/scans/dashboard/stats", headers=headersB)
            assert stats_B.json()["total_scans"] == 0

            # User A can fetch and delete own scan
            fetch_by_A = await client.get(f"/api/v1/scans/{scan_id}", headers=headersA)
            assert fetch_by_A.status_code == 200

            del_by_A = await client.delete(f"/api/v1/scans/{scan_id}", headers=headersA)
            assert del_by_A.status_code == 204
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_risk_scoring_accuracy_and_ceiling(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            reg = await client.post("/api/v1/auth/register", json={"email": "risk_tester@test.com", "password": "Password123!"})
            token = reg.json()["data"]["access_token"]
            headers = {"Authorization": f"Bearer {token}"}

            # 1. Clean / Low Risk Content
            res_low = await client.post(
                "/api/v1/scans",
                json={"analysis_type": "text", "text": "Here is the annual financial report published by the company for review."},
                headers=headers
            )
            assert res_low.status_code == 201
            data_low = res_low.json()
            assert 0 <= data_low["risk_score"] <= 24
            assert data_low["risk_level"] == "LOW"

            # 2. High Risk Text
            res_high = await client.post(
                "/api/v1/scans",
                json={
                    "analysis_type": "text",
                    "text": "100% guaranteed profit! 500% profit monthly. Endorsed by RBI. Act now! Send usdt to activate."
                },
                headers=headers
            )
            assert res_high.status_code == 201
            data_high = res_high.json()
            assert 50 <= data_high["risk_score"] <= 100
            assert data_high["risk_level"] in ["HIGH", "CRITICAL"]
            assert len(data_high["detected_indicators"]) >= 3
            assert len(data_high["recommendations"]) >= 1

            for ind in data_high["detected_indicators"]:
                assert len(ind["code"]) > 0
                assert len(ind["name"]) > 0
                assert len(ind["evidence"]) > 0
                assert len(ind["explanation"]) > 0
                assert ind["weight"] > 0
    finally:
        app.dependency_overrides.clear()
