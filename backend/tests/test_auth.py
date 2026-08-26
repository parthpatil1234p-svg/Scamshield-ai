import pytest
from httpx import AsyncClient, ASGITransport
import mongomock_motor
from app.main import app
from app.api.deps import get_db


@pytest.fixture
def mock_db():
    client = mongomock_motor.AsyncMongoMockClient()
    return client["test_scamshield_db"]


@pytest.mark.asyncio
async def test_auth_flow_register_login_me(mock_db):
    app.dependency_overrides[get_db] = lambda: mock_db
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            # 1. Register new user
            reg_resp = await ac.post("/api/v1/auth/register", json={
                "email": "testuser@scamshield.ai",
                "password": "SecurePassword123!"
            })
            assert reg_resp.status_code == 201
            reg_data = reg_resp.json()
            assert reg_data["success"] is True
            assert "access_token" in reg_data["data"]
            user_id = reg_data["data"]["user"]["user_id"]
            token = reg_data["data"]["access_token"]

            # 2. Duplicate registration should fail
            dup_resp = await ac.post("/api/v1/auth/register", json={
                "email": "testuser@scamshield.ai",
                "password": "AnotherPassword123!"
            })
            assert dup_resp.status_code == 409

            # 3. Login with correct password
            login_resp = await ac.post("/api/v1/auth/login", json={
                "email": "testuser@scamshield.ai",
                "password": "SecurePassword123!"
            })
            assert login_resp.status_code == 200
            assert "access_token" in login_resp.json()["data"]

            # 4. Login with wrong password
            wrong_login = await ac.post("/api/v1/auth/login", json={
                "email": "testuser@scamshield.ai",
                "password": "WrongPassword!"
            })
            assert wrong_login.status_code == 401

            # 5. Access /auth/me with Bearer token
            me_resp = await ac.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
            assert me_resp.status_code == 200
            assert me_resp.json()["user_id"] == user_id
            assert me_resp.json()["email"] == "testuser@scamshield.ai"

            # 6. Access /auth/me without token
            unauth_resp = await ac.get("/api/v1/auth/me")
            assert unauth_resp.status_code == 401
    finally:
        app.dependency_overrides.clear()
