"""
backend/app/schemas/scan.py
Pydantic v2 schemas for Scan analysis requests, indicator models, and API responses.
Matches docs/BACKEND-SCHEMA.md Section 4.4.
"""
from datetime import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class AnalysisTypeEnum(str, Enum):
    TEXT = "text"
    URL = "url"
    COMBINED = "combined"


class RiskLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class IndicatorSeverityEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class IndicatorDetailSchema(BaseModel):
    code: str = Field(..., description="Indicator identifier, e.g., TI-01 or UI-03")
    name: str = Field(..., description="Human-readable title of the indicator")
    severity: IndicatorSeverityEnum = Field(..., description="Indicator severity tier")
    weight: int = Field(..., ge=0, le=100, description="Calculated indicator point weight")
    evidence: str = Field(..., description="Verbatim matched text or URL snippet")
    explanation: str = Field(..., description="Plain-language educational context")


class ModelMetadataSchema(BaseModel):
    analysis_version: str = Field(..., description="Version of the analysis rule pipeline")
    model_version: str = Field(..., description="Classifier artifact identifier")
    inference_latency_ms: int = Field(..., ge=0, description="Execution duration in milliseconds")


class ScanCreateRequest(BaseModel):
    analysis_type: AnalysisTypeEnum = Field(..., description="Analysis mode: text, url, or combined")
    text: Optional[str] = Field(None, max_length=5000, description="Text content to scan")
    url: Optional[str] = Field(None, max_length=2048, description="Target URL to analyze")

    @model_validator(mode="after")
    def validate_inputs_match_type(self) -> "ScanCreateRequest":
        if self.analysis_type == AnalysisTypeEnum.TEXT:
            if not self.text or not self.text.strip():
                raise ValueError("Field 'text' is required when analysis_type is 'text'.")
        if self.analysis_type == AnalysisTypeEnum.URL:
            if not self.url or not self.url.strip():
                raise ValueError("Field 'url' is required when analysis_type is 'url'.")
        if self.analysis_type == AnalysisTypeEnum.COMBINED:
            if not self.text or not self.text.strip():
                raise ValueError("Field 'text' is required when analysis_type is 'combined'.")
            if not self.url or not self.url.strip():
                raise ValueError("Field 'url' is required when analysis_type is 'combined'.")
        return self


class ScanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    scan_id: str
    user_id: str
    analysis_type: AnalysisTypeEnum
    submitted_text: Optional[str] = None
    submitted_url: Optional[str] = None
    risk_score: int = Field(..., ge=0, le=100)
    risk_level: RiskLevelEnum
    low_confidence: bool = False
    text_sub_score: Optional[int] = None
    url_sub_score: Optional[int] = None
    detected_indicators: List[IndicatorDetailSchema] = []
    summary: str
    recommendations: List[str] = []
    model_metadata: ModelMetadataSchema
    created_at: datetime


class ScanSummaryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    scan_id: str
    analysis_type: AnalysisTypeEnum
    risk_score: int
    risk_level: RiskLevelEnum
    indicator_count: int
    summary_preview: str
    created_at: datetime


class ScanListPagination(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int


class ScanListResponse(BaseModel):
    success: bool = True
    data: List[ScanSummaryItem]
    pagination: ScanListPagination


class DashboardStatsResponse(BaseModel):
    total_scans: int
    low_risk_scans: int
    medium_risk_scans: int
    high_risk_scans: int
    critical_risk_scans: int
