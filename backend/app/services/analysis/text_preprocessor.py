"""
backend/app/services/analysis/text_preprocessor.py
Unicode NFKC normalization and text cleaning for the text analysis pipeline.
Following TRD Section 14 and IMPLEMENTATION-PLAN Phase 6.
"""
import re
import unicodedata


def normalize_text(text: str) -> str:
    """
    Apply Unicode NFKC normalization, whitespace collapse, and control character removal.
    This prevents homoglyph evasion attacks and normalizes encoding variants.
    """
    if not text:
        return ""

    # Unicode NFKC normalization — collapses homoglyphs and compatibility characters
    text = unicodedata.normalize("NFKC", text)

    # Strip null bytes and non-printable control characters (except standard whitespace)
    text = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)

    # Collapse multiple whitespace into single spaces
    text = re.sub(r"\s+", " ", text)

    return text.strip()
