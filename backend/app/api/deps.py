from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.exceptions import UnauthorizedException
from app.core.security import decode_access_token
from app.db.repositories.user_repo import UserRepository
from app.schemas.user import UserResponse
from app.db.session import get_database

security_bearer = HTTPBearer(auto_error=False)


async def get_db() -> AsyncIOMotorDatabase:
    return get_database()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_bearer),
    db: AsyncIOMotorDatabase = Depends(get_db)
) -> UserResponse:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise UnauthorizedException(message="Authentication credentials were not provided.")

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise UnauthorizedException(message="Invalid or expired authentication token.")

    user_repo = UserRepository(db)
    user_doc = await user_repo.get_by_id(payload["sub"])
    if not user_doc or not user_doc.get("is_active", True):
        raise UnauthorizedException(message="User account does not exist or is inactive.")

    return UserResponse(
        user_id=user_doc["user_id"],
        email=user_doc["email"],
        is_active=user_doc["is_active"],
        created_at=user_doc["created_at"]
    )
