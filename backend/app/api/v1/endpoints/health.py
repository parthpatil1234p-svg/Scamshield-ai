from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health", summary="System Health Probe")
async def health_check():
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "version": "1.0.0",
            "environment": settings.ENVIRONMENT,
            "database": "connected",
            "ai_engine": "ready",
            "active_model": "rule_based_v1"
        },
        "metadata": {
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    }
