"""
backend/app/api/v1/endpoints/auth.py
Authentication endpoints: register, login, get current user profile.
Matches TRD API contracts for endpoints 2, 3, 4.
Responses use the standard {success, data} envelope.
"""
from fastapi import APIRouter, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_current_user
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="User Registration",
    description="Register a new user account and return a JWT access token.",
)
async def register(user_in: UserCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    auth_service = AuthService(db)
    token_resp = await auth_service.register_user(user_in)
    return {
        "success": True,
        "data": token_resp.model_dump()
    }


@router.post(
    "/login",
    summary="User Authentication",
    description="Authenticate with email and password, return a JWT access token.",
)
async def login(credentials: UserLogin, db: AsyncIOMotorDatabase = Depends(get_db)):
    auth_service = AuthService(db)
    token_resp = await auth_service.authenticate_user(credentials)
    return {
        "success": True,
        "data": token_resp.model_dump()
    }


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Current User Profile",
    description="Return the profile of the currently authenticated user.",
)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user
