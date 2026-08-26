"""
tests/test_scans.py
Integration tests for scan creation, retrieval, listing, deletion, and dashboard stats.
Uses mongomock_motor for an in-memory MongoDB simulation.
"""
import pytest
from httpx import AsyncClient, ASGITransport
import mongomock_motor
from app.main import app
from app.api.deps import get_db


@pytest.fixture
def mock_db():
    client = mongomock_motor.AsyncMongoMockClient()
    return client["test_scamshield_db"]


async def _register_and_get_token(ac: AsyncClient) -> tuple[str, str]:
    """Helper: Register a user and return (user_id, token)."""
    resp = await ac.post("/api/v1/auth/register", json={
        "email": "scantest@scamshield.ai",
        "password": "StrongPass123!"
    })
    assert resp.status_code == 201
    data = resp.json()["data"]
    return data["user"]["user_id"], data["access_token"]


@pytest.mark.asyncio
async def test_create_text_scan(mock_db):
    """Test creating a text-only scan with a clearly scam-laden message."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token = await _register_and_get_token(ac)

            resp = await ac.post(
                "/api/v1/scans",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "analysis_type": "text",
                    "text": (
                        "GUARANTEED 500% returns on your investment! "
                        "Send USDT to our wallet to activate your account. "
                        "Limited time offer - act now! Endorsed by Elon Musk."
                    )
                }
            )
            assert resp.status_code == 201
            data = resp.json()
            assert "scan_id" in data
            assert data["scan_id"].startswith("scn_")
            assert data["risk_score"] > 0
            assert data["risk_level"] in ("MEDIUM", "HIGH", "CRITICAL")
            assert len(data["detected_indicators"]) > 0
            assert data["summary"]
            assert len(data["recommendations"]) > 0
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_create_url_scan(mock_db):
    """Test creating a URL-only scan with a suspicious URL."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token = await _register_and_get_token(ac)

            resp = await ac.post(
                "/api/v1/scans",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "analysis_type": "url",
                    "url": "http://earn-profit-crypto-invest.xyz/bonus?ref=12345"
                }
            )
            assert resp.status_code == 201
            data = resp.json()
            assert data["scan_id"].startswith("scn_")
            assert data["risk_score"] >= 0
            assert data["risk_level"] in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_ssrf_blocked(mock_db):
    """Test that SSRF-blocked URLs return 422."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token = await _register_and_get_token(ac)

            for bad_url in [
                "http://127.0.0.1/admin",
                "http://localhost/secret",
                "http://192.168.1.1/",
                "file:///etc/passwd",
            ]:
                resp = await ac.post(
                    "/api/v1/scans",
                    headers={"Authorization": f"Bearer {token}"},
                    json={"analysis_type": "url", "url": bad_url}
                )
                assert resp.status_code == 422, f"Expected 422 for {bad_url}, got {resp.status_code}"
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_list_scans(mock_db):
    """Test listing scan history with pagination."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token = await _register_and_get_token(ac)
            headers = {"Authorization": f"Bearer {token}"}

            # Create 3 scans
            for i in range(3):
                await ac.post("/api/v1/scans", headers=headers, json={
                    "analysis_type": "text",
                    "text": f"Scan number {i}: guaranteed profit investment scheme"
                })

            resp = await ac.get("/api/v1/scans?page=1&limit=10", headers=headers)
            assert resp.status_code == 200
            data = resp.json()
            assert data["success"] is True
            assert len(data["data"]) == 3
            assert data["pagination"]["total"] == 3
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_get_scan_and_idor_protection(mock_db):
    """Test that user cannot access another user's scan (IDOR prevention)."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token1 = await _register_and_get_token(ac)

            # Register second user
            resp2 = await ac.post("/api/v1/auth/register", json={
                "email": "user2@scamshield.ai",
                "password": "StrongPass456!"
            })
            token2 = resp2.json()["data"]["access_token"]

            # User 1 creates a scan
            scan_resp = await ac.post("/api/v1/scans",
                headers={"Authorization": f"Bearer {token1}"},
                json={"analysis_type": "text", "text": "Guaranteed profit investment"}
            )
            scan_id = scan_resp.json()["scan_id"]

            # User 1 can get their own scan
            own_resp = await ac.get(
                f"/api/v1/scans/{scan_id}",
                headers={"Authorization": f"Bearer {token1}"}
            )
            assert own_resp.status_code == 200

            # User 2 cannot get user 1's scan (IDOR protection)
            other_resp = await ac.get(
                f"/api/v1/scans/{scan_id}",
                headers={"Authorization": f"Bearer {token2}"}
            )
            assert other_resp.status_code == 404  # Scan not found (correct — no disclosure)
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_dashboard_stats(mock_db):
    """Test dashboard statistics aggregation."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token = await _register_and_get_token(ac)
            headers = {"Authorization": f"Bearer {token}"}

            # Create 2 scans
            for _ in range(2):
                await ac.post("/api/v1/scans", headers=headers, json={
                    "analysis_type": "text",
                    "text": "Guaranteed return investment scheme"
                })

            resp = await ac.get("/api/v1/scans/dashboard/stats", headers=headers)
            assert resp.status_code == 200
            data = resp.json()
            assert "total_scans" in data
            assert data["total_scans"] == 2
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_delete_scan(mock_db):
    """Test scan deletion with IDOR protection."""
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            _, token = await _register_and_get_token(ac)
            headers = {"Authorization": f"Bearer {token}"}

            # Create a scan
            scan_resp = await ac.post("/api/v1/scans", headers=headers, json={
                "analysis_type": "text",
                "text": "Join our VIP telegram group for guaranteed profits"
            })
            scan_id = scan_resp.json()["scan_id"]

            # Delete it
            del_resp = await ac.delete(f"/api/v1/scans/{scan_id}", headers=headers)
            assert del_resp.status_code == 204

            # Should be gone
            get_resp = await ac.get(f"/api/v1/scans/{scan_id}", headers=headers)
            assert get_resp.status_code == 404
    finally:
        app.dependency_overrides.clear()
