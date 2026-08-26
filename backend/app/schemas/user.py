from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr = Field(..., description="User's valid normalized email address")


class UserCreate(UserBase):
    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Plaintext password, minimum 8 characters"
    )


class UserLogin(UserBase):
    password: str = Field(..., description="Plaintext password for authentication")


class UserInDB(UserBase):
    model_config = ConfigDict(populate_by_name=True, arbitrary_types_allowed=True)

    user_id: str = Field(..., description="Public unique identifier prefixed with usr_")
    password_hash: str = Field(..., description="Bcrypt password hash")
    is_active: bool = Field(default=True, description="Account active status")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    is_active: bool
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_seconds: int = 3600
    user: UserResponse


class TokenPayload(BaseModel):
    sub: str = Field(..., description="User ID corresponding to user_id")
    email: EmailStr
    iat: int
    exp: int
