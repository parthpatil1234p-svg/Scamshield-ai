from motor.motor_asyncio import AsyncIOMotorDatabase
from app.core.exceptions import ConflictException, UnauthorizedException, NotFoundException
from app.core.security import verify_password, create_access_token
from app.db.repositories.user_repo import UserRepository
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse


class AuthService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.user_repo = UserRepository(db)

    async def register_user(self, user_in: UserCreate) -> TokenResponse:
        existing = await self.user_repo.get_by_email(user_in.email)
        if existing:
            raise ConflictException(message="An account with this email address already exists.")

        user_doc = await self.user_repo.create_user(user_in.email, user_in.password)
        token = create_access_token(user_id=user_doc["user_id"], email=user_doc["email"])

        user_resp = UserResponse(
            user_id=user_doc["user_id"],
            email=user_doc["email"],
            is_active=user_doc["is_active"],
            created_at=user_doc["created_at"]
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in_seconds=3600,
            user=user_resp
        )

    async def authenticate_user(self, credentials: UserLogin) -> TokenResponse:
        user_doc = await self.user_repo.get_by_email(credentials.email)
        if not user_doc or not verify_password(credentials.password, user_doc["password_hash"]):
            raise UnauthorizedException(message="Invalid email or password.")

        if not user_doc.get("is_active", True):
            raise UnauthorizedException(message="User account is deactivated.")

        token = create_access_token(user_id=user_doc["user_id"], email=user_doc["email"])
        user_resp = UserResponse(
            user_id=user_doc["user_id"],
            email=user_doc["email"],
            is_active=user_doc["is_active"],
            created_at=user_doc["created_at"]
        )

        return TokenResponse(
            access_token=token,
            token_type="bearer",
            expires_in_seconds=3600,
            user=user_resp
        )

    async def get_user_profile(self, user_id: str) -> UserResponse:
        user_doc = await self.user_repo.get_by_id(user_id)
        if not user_doc:
            raise NotFoundException(message="User profile not found.")

        return UserResponse(
            user_id=user_doc["user_id"],
            email=user_doc["email"],
            is_active=user_doc["is_active"],
            created_at=user_doc["created_at"]
        )
