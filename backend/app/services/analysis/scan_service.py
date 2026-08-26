"""
backend/app/services/analysis/scan_service.py
Main orchestrator for the analysis pipeline. Coordinates text/URL indicators,
risk scoring, and report generation into a unified scan response.
Following TRD Section 24 layered architecture (Service → Engine → Repository).
"""
import time
import uuid
from typing import Optional

from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.exceptions import ValidationException
from app.db.repositories.scan_repo import ScanRepository
from app.schemas.scan import (
    ScanCreateRequest,
    ScanResponse,
    ScanListResponse,
    ScanListPagination,
    ScanSummaryItem,
    DashboardStatsResponse,
    IndicatorDetailSchema,
    ModelMetadataSchema,
    AnalysisTypeEnum,
)
from app.services.analysis.text_preprocessor import normalize_text
from app.services.analysis.text_indicators import detect_text_indicators
from app.services.analysis.url_indicators import detect_url_signals
from app.services.analysis.url_security import validate_url_safe
from app.services.analysis.risk_engine import (
    calculate_text_score,
    calculate_url_score,
    calculate_combined_score,
    determine_risk_level,
)
from app.services.analysis.report_generator import generate_summary, generate_recommendations

_ANALYSIS_VERSION = "1.0.0"
_MODEL_VERSION = "regex-v1.0"

LOW_CONFIDENCE_THRESHOLD = 2  # If < 2 indicators found and score is in MEDIUM+, flag as low confidence


def _generate_scan_id() -> str:
    return f"scn_{uuid.uuid4().hex[:16]}"


class ScanService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.scan_repo = ScanRepository(db)

    async def create_scan(self, request: ScanCreateRequest, user_id: str) -> ScanResponse:
        """
        Execute the full analysis pipeline for a scan request.
        Steps:
          1. Validate / SSRF-check URL input
          2. Run text indicator detection
          3. Run URL signal detection
          4. Calculate risk scores via risk engine
          5. Generate human-readable summary and recommendations
          6. Persist scan document to MongoDB
          7. Return structured ScanResponse
        """
        t_start = time.monotonic()

        text_indicators = []
        url_signals = []
        text_sub_score: Optional[int] = None
        url_sub_score: Optional[int] = None

        # ── Text analysis ──────────────────────────────────────────────────
        if request.text and request.analysis_type in (AnalysisTypeEnum.TEXT, AnalysisTypeEnum.COMBINED):
            normalized = normalize_text(request.text)
            text_indicators = detect_text_indicators(normalized)
            text_sub_score = calculate_text_score(text_indicators)

        # ── URL analysis ───────────────────────────────────────────────────
        if request.url and request.analysis_type in (AnalysisTypeEnum.URL, AnalysisTypeEnum.COMBINED):
            # SSRF validation — raises SSRFException / ValidationException if unsafe
            safe_url = validate_url_safe(request.url)
            url_signals = detect_url_signals(safe_url)
            url_sub_score = calculate_url_score(url_signals)

        # ── Risk scoring ───────────────────────────────────────────────────
        if request.analysis_type == AnalysisTypeEnum.TEXT:
            risk_score = text_sub_score if text_sub_score is not None else 0
        elif request.analysis_type == AnalysisTypeEnum.URL:
            risk_score = url_sub_score if url_sub_score is not None else 0
        else:
            # COMBINED: weighted fusion with ceiling governor
            risk_score = calculate_combined_score(
                text_sub_score or 0,
                url_sub_score or 0,
            )

        risk_level = determine_risk_level(risk_score)

        # Low confidence flag: few indicators with non-LOW score
        total_indicators = len(text_indicators) + len(url_signals)
        low_confidence = (
            total_indicators < LOW_CONFIDENCE_THRESHOLD
            and risk_level in ("MEDIUM", "HIGH", "CRITICAL")
        )

        # ── Report generation ──────────────────────────────────────────────
        summary = generate_summary(risk_level, text_indicators, url_signals)
        recommendations = generate_recommendations(risk_level, text_indicators, url_signals)

        # ── Build indicator schemas ────────────────────────────────────────
        detected_schemas = [
            IndicatorDetailSchema(
                code=ind.code,
                name=ind.name,
                severity=ind.severity,  # type: ignore[arg-type]
                weight=ind.weight,
                evidence=ind.evidence,
                explanation=ind.explanation,
            )
            for ind in text_indicators
        ] + [
            IndicatorDetailSchema(
                code=sig.code,
                name=sig.name,
                severity=sig.severity,  # type: ignore[arg-type]
                weight=sig.weight,
                evidence=sig.evidence,
                explanation=sig.explanation,
            )
            for sig in url_signals
        ]

        latency_ms = int((time.monotonic() - t_start) * 1000)

        model_meta = ModelMetadataSchema(
            analysis_version=_ANALYSIS_VERSION,
            model_version=_MODEL_VERSION,
            inference_latency_ms=latency_ms,
        )

        scan_id = _generate_scan_id()

        # ── Persist to database ────────────────────────────────────────────
        scan_doc = await self.scan_repo.create_scan(
            scan_id=scan_id,
            user_id=user_id,
            analysis_type=request.analysis_type.value,
            submitted_text=request.text,
            submitted_url=request.url,
            risk_score=risk_score,
            risk_level=risk_level,
            low_confidence=low_confidence,
            text_sub_score=text_sub_score,
            url_sub_score=url_sub_score,
            detected_indicators=[d.model_dump() for d in detected_schemas],
            summary=summary,
            recommendations=recommendations,
            model_metadata=model_meta.model_dump(),
        )

        return ScanResponse(
            scan_id=scan_doc["scan_id"],
            user_id=scan_doc["user_id"],
            analysis_type=scan_doc["analysis_type"],
            submitted_text=scan_doc.get("submitted_text"),
            submitted_url=scan_doc.get("submitted_url"),
            risk_score=scan_doc["risk_score"],
            risk_level=scan_doc["risk_level"],
            low_confidence=scan_doc["low_confidence"],
            text_sub_score=scan_doc.get("text_sub_score"),
            url_sub_score=scan_doc.get("url_sub_score"),
            detected_indicators=[
                IndicatorDetailSchema(**i) for i in scan_doc["detected_indicators"]
            ],
            summary=scan_doc["summary"],
            recommendations=scan_doc["recommendations"],
            model_metadata=ModelMetadataSchema(**scan_doc["model_metadata"]),
            created_at=scan_doc["created_at"],
        )

    async def get_scan(self, scan_id: str, user_id: str) -> ScanResponse:
        """Get a single scan by ID. Ownership check is enforced by the repository (IDOR prevention)."""
        scan_doc = await self.scan_repo.get_scan_by_id(scan_id=scan_id, user_id=user_id)

        return ScanResponse(
            scan_id=scan_doc["scan_id"],
            user_id=scan_doc["user_id"],
            analysis_type=scan_doc["analysis_type"],
            submitted_text=scan_doc.get("submitted_text"),
            submitted_url=scan_doc.get("submitted_url"),
            risk_score=scan_doc["risk_score"],
            risk_level=scan_doc["risk_level"],
            low_confidence=scan_doc.get("low_confidence", False),
            text_sub_score=scan_doc.get("text_sub_score"),
            url_sub_score=scan_doc.get("url_sub_score"),
            detected_indicators=[
                IndicatorDetailSchema(**i) for i in scan_doc.get("detected_indicators", [])
            ],
            summary=scan_doc["summary"],
            recommendations=scan_doc.get("recommendations", []),
            model_metadata=ModelMetadataSchema(**scan_doc["model_metadata"]),
            created_at=scan_doc["created_at"],
        )

    async def list_scans(
        self,
        user_id: str,
        page: int = 1,
        limit: int = 20,
        risk_level: Optional[str] = None,
    ) -> ScanListResponse:
        """List paginated scans for a user, optionally filtered by risk_level."""
        if limit < 1 or limit > 100:
            raise ValidationException(message="Limit must be between 1 and 100.")
        if page < 1:
            raise ValidationException(message="Page must be >= 1.")

        skip = (page - 1) * limit
        scans, total = await self.scan_repo.list_scans(
            user_id=user_id,
            skip=skip,
            limit=limit,
            risk_level=risk_level,
        )

        items = [
            ScanSummaryItem(
                scan_id=s["scan_id"],
                analysis_type=s["analysis_type"],
                risk_score=s["risk_score"],
                risk_level=s["risk_level"],
                indicator_count=len(s.get("detected_indicators", [])),
                summary_preview=s.get("summary", "")[:120],
                created_at=s["created_at"],
            )
            for s in scans
        ]

        import math
        total_pages = math.ceil(total / limit) if limit > 0 else 0

        return ScanListResponse(
            success=True,
            data=items,
            pagination=ScanListPagination(
                total=total,
                page=page,
                limit=limit,
                total_pages=total_pages,
            ),
        )

    async def delete_scan(self, scan_id: str, user_id: str) -> None:
        """Delete a scan by ID with ownership check (IDOR prevention)."""
        await self.scan_repo.delete_scan(scan_id=scan_id, user_id=user_id)

    async def get_dashboard_stats(self, user_id: str) -> DashboardStatsResponse:
        """Return aggregated risk-tier statistics for the dashboard."""
        stats = await self.scan_repo.get_stats(user_id=user_id)
        return DashboardStatsResponse(
            total_scans=stats.get("total_scans", 0),
            low_risk_scans=stats.get("low_risk_scans", 0),
            medium_risk_scans=stats.get("medium_risk_scans", 0),
            high_risk_scans=stats.get("high_risk_scans", 0),
            critical_risk_scans=stats.get("critical_risk_scans", 0),
        )
