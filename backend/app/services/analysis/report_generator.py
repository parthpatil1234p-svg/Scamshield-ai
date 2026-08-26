"""
backend/app/services/analysis/report_generator.py
Human-readable summary and recommendations generator based on analysis results.
Following TRD Section 23.
"""
from typing import List

from app.services.analysis.text_indicators import DetectedIndicator
from app.services.analysis.url_indicators import DetectedUrlSignal


_RISK_SUMMARIES = {
    "CRITICAL": (
        "This content contains multiple high-confidence indicators strongly associated with financial fraud. "
        "The combination of detected signals indicates a very high probability of a scam. "
        "We strongly recommend avoiding any financial engagement with this content or its sources."
    ),
    "HIGH": (
        "This content exhibits several suspicious characteristics commonly found in investment fraud. "
        "Multiple risk signals have been detected that warrant serious caution. "
        "Do not share personal or financial information based on this content."
    ),
    "MEDIUM": (
        "This content contains some patterns associated with potentially misleading financial communications. "
        "While not conclusively fraudulent, these signals warrant careful verification before proceeding. "
        "Conduct thorough due diligence before engaging with any financial claims made."
    ),
    "LOW": (
        "This content shows minimal risk indicators. A small number of cautionary signals were detected. "
        "Exercise standard precautions and verify any financial claims through official channels."
    ),
}

_NO_INDICATOR_SUMMARY = (
    "This content does not contain known scam indicators in our current detection catalog. "
    "While no red flags were detected, always exercise caution with unsolicited financial content. "
    "Zero indicators does not constitute a guarantee of legitimacy."
)


def _build_indicator_list_text(
    text_indicators: List[DetectedIndicator],
    url_signals: List[DetectedUrlSignal]
) -> str:
    """Build a comma-separated list of detected indicator names for summary context."""
    all_names = [ind.name for ind in text_indicators] + [sig.name for sig in url_signals]
    if not all_names:
        return ""
    if len(all_names) == 1:
        return all_names[0]
    return f"{', '.join(all_names[:-1])}, and {all_names[-1]}"


def generate_summary(
    risk_level: str,
    text_indicators: List[DetectedIndicator],
    url_signals: List[DetectedUrlSignal],
) -> str:
    """
    Generate a human-readable analysis summary.
    The summary always corresponds to actual detected signals — no fabricated claims.
    """
    total_count = len(text_indicators) + len(url_signals)

    if total_count == 0:
        return _NO_INDICATOR_SUMMARY

    base_summary = _RISK_SUMMARIES.get(risk_level, _NO_INDICATOR_SUMMARY)

    indicator_list = _build_indicator_list_text(text_indicators, url_signals)
    if indicator_list:
        return f"{base_summary} Detected signals: {indicator_list}."

    return base_summary


def generate_recommendations(
    risk_level: str,
    text_indicators: List[DetectedIndicator],
    url_signals: List[DetectedUrlSignal],
) -> List[str]:
    """
    Generate actionable, evidence-grounded recommendation strings.
    Only includes recommendations relevant to the specific detected signals.
    """
    recommendations: List[str] = []
    codes_found = {ind.code for ind in text_indicators} | {sig.code for sig in url_signals}

    # Universal recommendations based on risk level
    if risk_level == "CRITICAL":
        recommendations.append(
            "Do NOT transfer any money, cryptocurrency, or personal financial information to anyone mentioned in this content."
        )
        recommendations.append(
            "Report this content to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or SEBI (scores.sebi.gov.in)."
        )
    elif risk_level == "HIGH":
        recommendations.append(
            "Avoid any financial transactions or personal data sharing based on this content until verified."
        )
        recommendations.append(
            "Verify the identity and SEBI/RBI registration of any investment advisor or platform mentioned."
        )
    elif risk_level == "MEDIUM":
        recommendations.append(
            "Research the company or individual independently using official government registries before engaging."
        )
    else:
        recommendations.append(
            "Always verify investment claims through official regulatory websites such as SEBI (sebi.gov.in) or RBI (rbi.org.in)."
        )

    # Signal-specific recommendations
    if "TI-06" in codes_found:
        recommendations.append(
            "Never send cryptocurrency payments to activate or unlock an investment account — legitimate platforms do not operate this way."
        )

    if "TI-05" in codes_found:
        recommendations.append(
            "Verify celebrity or regulatory endorsements directly on the official website — impersonation is extremely common in investment scams."
        )

    if "TI-07" in codes_found:
        recommendations.append(
            "Be wary of being redirected to private Telegram or WhatsApp groups — these remove accountability and consumer protections."
        )

    if "UI-02" in codes_found:
        recommendations.append(
            "Do not visit IP-based URLs for financial services — legitimate organizations use registered domain names."
        )

    if "UI-07" in codes_found:
        recommendations.append(
            "Expand shortened URLs using a trusted tool (e.g., unshorten.it) to verify the actual destination before clicking."
        )

    if "TI-01" in codes_found or "TI-02" in codes_found:
        recommendations.append(
            "No legitimate regulated investment offers guaranteed or unusually high returns — such promises indicate fraud."
        )

    return recommendations
