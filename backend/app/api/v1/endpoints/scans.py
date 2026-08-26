"""
backend/app/api/v1/endpoints/scans.py
Scan API endpoints: create, list, retrieve, delete, dashboard stats.
Corresponds to TRD API contract endpoints 5-9.
"""
from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.api.deps import get_db, get_current_user
from app.schemas.user import UserResponse
from app.schemas.scan import (
    ScanCreateRequest,
    ScanResponse,
    ScanListResponse,
    DashboardStatsResponse,
)
from app.services.analysis.scan_service import ScanService

router = APIRouter()


@router.post(
    "",
    response_model=ScanResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Scan",
    description="Submit text and/or URL for scam analysis. Returns a full analysis report.",
)
async def create_scan(
    request: ScanCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    scan_service = ScanService(db)
    return await scan_service.create_scan(request=request, user_id=current_user.user_id)


@router.get(
    "",
    response_model=ScanListResponse,
    summary="List Scans",
    description="Retrieve paginated scan history for the authenticated user.",
)
async def list_scans(
    page: int = Query(default=1, ge=1, description="Page number (1-indexed)"),
    limit: int = Query(default=20, ge=1, le=100, description="Items per page"),
    risk_level: Optional[str] = Query(default=None, description="Filter by risk level: LOW, MEDIUM, HIGH, CRITICAL"),
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    scan_service = ScanService(db)
    return await scan_service.list_scans(
        user_id=current_user.user_id,
        page=page,
        limit=limit,
        risk_level=risk_level,
    )


@router.get(
    "/dashboard/stats",
    response_model=DashboardStatsResponse,
    summary="Dashboard Statistics",
    description="Get aggregated scan statistics for the authenticated user.",
)
async def get_dashboard_stats(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    scan_service = ScanService(db)
    return await scan_service.get_dashboard_stats(user_id=current_user.user_id)


@router.get(
    "/{scan_id}",
    response_model=ScanResponse,
    summary="Get Scan",
    description="Retrieve a specific scan by ID. Enforces ownership check.",
)
async def get_scan(
    scan_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    scan_service = ScanService(db)
    return await scan_service.get_scan(scan_id=scan_id, user_id=current_user.user_id)


@router.delete(
    "/{scan_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Scan",
    description="Delete a scan by ID. Enforces ownership check.",
)
async def delete_scan(
    scan_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    scan_service = ScanService(db)
    await scan_service.delete_scan(scan_id=scan_id, user_id=current_user.user_id)
