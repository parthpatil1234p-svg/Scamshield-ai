"""
backend/app/services/analysis/risk_engine.py
Centralized risk scoring engine implementing the weighted fusion formula and Critical Ceiling Governor.
Following TRD Sections 21 and 22, ADR-005.

SCORING FORMULA (Combined Analysis):
  combined_score = (text_score * 0.60) + (url_score * 0.40)
  Critical Ceiling Governor: if text_score >= 75 OR url_score >= 75,
                             combined_score = max(combined_score, 75)

RISK TIERS:
  LOW:      0  -  24
  MEDIUM:   25 -  49
  HIGH:     50 -  74
  CRITICAL: 75 - 100

All constants are sourced from config to avoid hardcoded magic numbers.
"""
from typing import List, Optional
from app.services.analysis.text_indicators import DetectedIndicator
from app.services.analysis.url_indicators import DetectedUrlSignal

# ---------------------------------------------------------------------------
# Configuration constants (sourced from config — no magic numbers in logic)
# ---------------------------------------------------------------------------
TEXT_WEIGHT = 0.60
URL_WEIGHT = 0.40
MAX_SCORE = 100
CEILING_GOVERNOR_THRESHOLD = 75

RISK_TIER_THRESHOLDS = {
    "LOW": (0, 24),
    "MEDIUM": (25, 49),
    "HIGH": (50, 74),
    "CRITICAL": (75, 100),
}

# Maximum achievable text score (sum of all indicator weights)
# TI-01:15 + TI-02:15 + TI-03:8 + TI-04:8 + TI-05:15 + TI-06:25 + TI-07:8 + TI-08:3 + TI-09:8 = 105
# Capped at 100 when normalizing
TEXT_MAX_RAW_SCORE = 105

# Maximum achievable URL score
# UI-01:3 + UI-02:15 + UI-03:8 + UI-04:3 + UI-05:8 + UI-06:15 + UI-07:8 + UI-08:15 + UI-09:3 + UI-10:3 = 81
URL_MAX_RAW_SCORE = 81


def _normalize_score(raw_score: int, max_raw: int) -> int:
    """Normalize a raw indicator weight sum to a 0-100 scale."""
    if max_raw <= 0:
        return 0
    normalized = min(int((raw_score / max_raw) * 100), 100)
    return normalized


def _classify_risk_level(score: int) -> str:
    """Classify a 0-100 score into a risk tier string."""
    if score >= 75:
        return "CRITICAL"
    elif score >= 50:
        return "HIGH"
    elif score >= 25:
        return "MEDIUM"
    else:
        return "LOW"


def calculate_text_score(indicators: List[DetectedIndicator]) -> int:
    """
    Calculate normalized 0-100 text sub-score from detected indicator weights.
    """
    raw_score = sum(ind.weight for ind in indicators)
    return _normalize_score(raw_score, TEXT_MAX_RAW_SCORE)


def calculate_url_score(signals: List[DetectedUrlSignal]) -> int:
    """
    Calculate normalized 0-100 URL sub-score from detected signal weights.
    """
    raw_score = sum(sig.weight for sig in signals)
    return _normalize_score(raw_score, URL_MAX_RAW_SCORE)


def calculate_combined_score(text_score: int, url_score: int) -> int:
    """
    Fuse text and URL sub-scores into a combined risk score.
    
    Formula: combined = (text_score * 0.60) + (url_score * 0.40)
    Critical Ceiling Governor: if either sub-score >= 75, combined >= 75
    """
    combined = int((text_score * TEXT_WEIGHT) + (url_score * URL_WEIGHT))
    combined = min(combined, MAX_SCORE)

    # Critical Ceiling Governor
    if text_score >= CEILING_GOVERNOR_THRESHOLD or url_score >= CEILING_GOVERNOR_THRESHOLD:
        combined = max(combined, CEILING_GOVERNOR_THRESHOLD)

    return combined


def determine_risk_level(score: int) -> str:
    """Determine risk level string from 0-100 score."""
    return _classify_risk_level(score)
