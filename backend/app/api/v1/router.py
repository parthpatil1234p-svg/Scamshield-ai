from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, scans

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(scans.router, prefix="/scans", tags=["Scans"])
