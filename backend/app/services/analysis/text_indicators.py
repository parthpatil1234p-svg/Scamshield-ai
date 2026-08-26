"""
backend/app/services/analysis/text_indicators.py
Deterministic regex-based indicator engine for TI-01 through TI-09.
All 9 text indicators as specified in TRD Section 15 and BACKEND-SCHEMA Section 5.1.

INDICATOR CATALOG:
  TI-01: Guaranteed Return Claim          (Weight: 15, Severity: HIGH)
  TI-02: Unrealistic Profit Multiplier    (Weight: 15, Severity: HIGH)
  TI-03: Urgency / Pressure Tactic        (Weight:  8, Severity: MEDIUM)
  TI-04: FOMO Language                    (Weight:  8, Severity: MEDIUM)
  TI-05: False Authority / Celebrity      (Weight: 15, Severity: HIGH)
  TI-06: Payment / Crypto Solicitation    (Weight: 25, Severity: CRITICAL)
  TI-07: Private Channel Redirection      (Weight:  8, Severity: MEDIUM)
  TI-08: Testimonial / Social Proof       (Weight:  3, Severity: LOW)
  TI-09: Unregistered Investment Solicit. (Weight:  8, Severity: MEDIUM)
"""
import re
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class DetectedIndicator:
    code: str
    name: str
    severity: str
    weight: int
    evidence: str
    explanation: str


# ---------------------------------------------------------------------------
# Compiled regex pattern definitions
# Each pattern is designed with word-boundary anchors to reduce false positives
# ---------------------------------------------------------------------------

_INDICATOR_PATTERNS = [
    {
        "code": "TI-01",
        "name": "Guaranteed Return Claim",
        "severity": "HIGH",
        "weight": 15,
        "patterns": [
            r"(?i)\bguaranteed?\s+(?:return|profit|income|earning|yield|gain|roi|interest|revenue|dividend)",
            r"(?i)\b(?:100%|hundred\s+percent)\s+(?:guaranteed?|safe|secure|risk[\s-]*free|profit)",
            r"(?i)\bzero\s+risk\b",
            r"(?i)\bright\s+now\s+guaranteed?",
            r"(?i)\bguar[a4]ntee[d]?\s+(?:profit|money|income|return)",
        ],
        "explanation": (
            "This content promises guaranteed returns or risk-free profits. "
            "Regulated financial products cannot legally guarantee profits or returns. "
            "Such claims are a primary marker of fraudulent investment schemes."
        ),
    },
    {
        "code": "TI-02",
        "name": "Unrealistic Profit Multiplier",
        "severity": "HIGH",
        "weight": 15,
        "patterns": [
            r"(?i)\b([2-9]\d{2,}|[1-9]\d{3,})\s*%\s*(?:profit|return|gain|yield|monthly|weekly|daily|roi|interest)",
            r"(?i)\b(?:profit|return|earn|gain|yield|income)\s+(?:of\s+)?[2-9]\d{2,}\s*%",
            r"(?i)\b(?:double|triple|quadruple|10x|20x|50x|100x)\s+(?:your\s+)?(?:money|investment|profit|capital|fund)",
            r"(?i)\b(?:5x|10x|20x|50x|100x)\s+(?:returns?|profits?|gains?)",
            r"(?i)\b(?:earn|make|generate)\s+(?:\$|₹|€|£)?\d+[kKmM]?\+?\s*(?:per\s+(?:day|week|month|hour)|in\s+(?:days?|weeks?|hours?))",
        ],
        "explanation": (
            "This content claims unrealistically high profit multipliers (e.g., 200%+ returns, 10x gains). "
            "Legitimate investments do not routinely offer such returns. "
            "Promises of extraordinary gains are a hallmark of Ponzi and pyramid investment schemes."
        ),
    },
    {
        "code": "TI-03",
        "name": "Urgency / Pressure Tactic",
        "severity": "MEDIUM",
        "weight": 8,
        "patterns": [
            r"(?i)\blimited\s+(?:time|offer|slots?|spots?|seats?|availability)\b",
            r"(?i)\b(?:act|join|register|invest|sign\s+up|hurry)\s+now\b",
            r"(?i)\b(?:last\s+chance|only\s+\d+\s+spots?|expires?\s+(?:soon|today|tonight|in\s+\d+\s+hours?))",
            r"(?i)\bdon['']t\s+miss\b",
            r"(?i)\b(?:closing\s+soon|ending\s+(?:today|tonight|soon)|today\s+only|offer\s+ends)\b",
            r"(?i)\b(?:urgent|urgently)\s+(?:invitation|opportunity|offer)\b",
        ],
        "explanation": (
            "This content employs artificial urgency and time-pressure tactics. "
            "Scammers use these to prevent victims from doing proper due diligence. "
            "Legitimate investment opportunities do not expire within hours."
        ),
    },
    {
        "code": "TI-04",
        "name": "FOMO Language",
        "severity": "MEDIUM",
        "weight": 8,
        "patterns": [
            r"(?i)\b(?:don['']t\s+miss|miss\s+out|missing\s+out)\b",
            r"(?i)\beveryone\s+(?:is|are)\s+(?:making|earning|getting|investing)\b",
            r"(?i)\bwhile\s+(?:you\s+)?(?:sleep|relax)\b",
            r"(?i)\bpassive\s+income\s+(?:secret|opportunity|system|strategy)\b",
            r"(?i)\b(?:people\s+are\s+(?:already\s+)?(?:making|earning)|thousands\s+(?:are\s+)?already)\b",
            r"(?i)\bjoin\s+(?:the\s+)?(?:\d+[\w,]+|thousands?|millions?)\s+(?:of\s+)?(?:people|investors|members|traders)\b",
        ],
        "explanation": (
            "This content uses Fear Of Missing Out (FOMO) language. "
            "Claims that 'everyone is already profiting' create social pressure to act hastily. "
            "This is a documented psychological manipulation technique used in investment fraud."
        ),
    },
    {
        "code": "TI-05",
        "name": "False Authority / Celebrity Endorsement",
        "severity": "HIGH",
        "weight": 15,
        "patterns": [
            r"(?i)\b(?:endorsed?\s+by|approved?\s+by|recommended?\s+by|backed?\s+by)\s+(?:elon|modi|warren|bill|celebrity|bollywood|cricket|rbi|sebi|government)\b",
            r"(?i)\b(?:elon\s+musk|warren\s+buffett|bill\s+gates|narendra\s+modi|mukesh\s+ambani)\s+(?:secret|method|system|formula|investment|strategy|recommends?|approves?|endorses?)\b",
            r"(?i)\b(?:sebi|rbi|sec|fca)\s+(?:approved?|certified?|registered?|endorsed?)\b",
            r"(?i)\bverified?\s+by\s+(?:the\s+)?(?:government|rbi|sebi|sec)\b",
            r"(?i)\b(?:as\s+seen\s+on|featured\s+(?:in|on))\s+(?:bbc|cnn|ndtv|forbes)\b",
        ],
        "explanation": (
            "This content falsely claims endorsements from celebrities, government bodies, or regulatory authorities. "
            "SEBI/RBI do not endorse specific investment schemes. "
            "Celebrities and billionaires are frequently impersonated in investment scams."
        ),
    },
    {
        "code": "TI-06",
        "name": "Payment / Crypto Solicitation",
        "severity": "CRITICAL",
        "weight": 25,
        "patterns": [
            r"(?i)\bsend\s+(?:\$|₹|€|£|usdt|btc|eth|bitcoin|ethereum|crypto|tether|bnb|usdc)\b",
            r"(?i)\b(?:deposit|transfer|pay|send)\s+(?:to\s+)?(?:activate|unlock|start|begin|access|register)\b",
            r"(?i)\b(?:bitcoin|btc|ethereum|eth|usdt|tether|bnb|usdc|crypto)\s+(?:wallet|address|payment|transfer|deposit)\b",
            r"(?i)\bwallet\s+address\s*[:：]\s*[a-zA-Z0-9]{20,}\b",
            r"(?i)\b(?:send|transfer|deposit)\s+(?:\$|₹|€|£)?\d+(?:\.\d+)?\s*(?:to\s+activate|to\s+unlock|to\s+start|to\s+begin|to\s+register)\b",
            r"(?i)\b(?:initial\s+deposit|activation\s+fee|registration\s+fee|membership\s+fee)\s+(?:of\s+)?(?:\$|₹|€|£)?\d+\b",
        ],
        "explanation": (
            "This content directly solicits cryptocurrency or payment transfers to activate an investment account. "
            "Legitimate investment platforms do not request direct wallet transfers via social media messages. "
            "This pattern is strongly associated with advance-fee fraud and exit scam schemes."
        ),
    },
    {
        "code": "TI-07",
        "name": "Private Channel Redirection",
        "severity": "MEDIUM",
        "weight": 8,
        "patterns": [
            r"(?i)\bjoin\s+(?:our|my|the)\s+(?:private|vip|exclusive|secret|telegram|whatsapp)\s+(?:group|channel|chat|community)\b",
            r"(?i)\bdm\s+(?:me|us)\b",
            r"(?i)\b(?:message|text|contact)\s+(?:me|us)\s+(?:on\s+)?(?:whatsapp|telegram|instagram|signal)\b",
            r"(?i)\bt\.me\/\S+",
            r"(?i)\b(?:whatsapp|telegram)\s+(?:me|us|group|channel|link)\b",
            r"(?i)\b(?:private|secret)\s+(?:signal|tip|group|channel|community)\s+(?:for|with)\s+(?:vip|exclusive|premium|members?)\b",
        ],
        "explanation": (
            "This content attempts to redirect victims to unmonitored private channels (Telegram, WhatsApp). "
            "Moving communication to private channels removes consumer protections and platform oversight. "
            "This is a standard tactic to prevent fraud reports and facilitate direct victim extraction."
        ),
    },
    {
        "code": "TI-08",
        "name": "Testimonial / Social Proof Claim",
        "severity": "LOW",
        "weight": 3,
        "patterns": [
            r"(?i)\b(?:i\s+(?:made|earned|withdrew|received)|he\s+(?:made|earned)|she\s+(?:made|earned))\s+(?:\$|₹|€|£)?\d+\b",
            r"(?i)\bproof\s+(?:of\s+)?(?:payment|withdrawal|earnings?|income|profits?)\b",
            r"(?i)\b(?:withdrawal\s+proof|payment\s+proof|earnings?\s+proof)\b",
            r"(?i)\b(?:join|joined)\s+\d+[\w,]+\s+(?:happy\s+)?(?:members?|investors?|traders?|users?)\b",
            r"(?i)\b(?:real\s+)?(?:testimonials?|reviews?|success\s+stor(?:y|ies))\b",
        ],
        "explanation": (
            "This content includes fabricated testimonials or social proof claims. "
            "Scam operations routinely manufacture payment screenshots and success stories. "
            "These claims cannot be independently verified and are frequently fraudulent."
        ),
    },
    {
        "code": "TI-09",
        "name": "Unregistered Investment Solicitation",
        "severity": "MEDIUM",
        "weight": 8,
        "patterns": [
            r"(?i)\b(?:invest|trading)\s+(?:with\s+)?(?:us|me|our\s+(?:platform|firm|company|group))\s+(?:and\s+)?(?:earn|make|get|receive|gain)\b",
            r"(?i)\b(?:fund\s+manager|portfolio\s+manager|trading\s+expert|investment\s+advisor)\s+(?:with\s+)?\d+\s*(?:years?|yrs?)\s+(?:of\s+)?experience\b",
            r"(?i)\b(?:forex|crypto|stock|commodity|binary)\s+(?:trading\s+)?(?:signals?|tips?|strategy|system|robot|algorithm)\s+(?:for\s+)?(?:sale|buy|purchase|subscribe)\b",
            r"(?i)\bproprietary\s+(?:trading\s+)?(?:algorithm|system|strategy|software|bot|ai)\b",
            r"(?i)\b(?:managed\s+)?(?:trading|investment)\s+(?:account|portfolio|fund)\s+(?:with|by)\s+(?:guaranteed?|assured?|fixed)\s+(?:returns?|profits?|yields?)\b",
        ],
        "explanation": (
            "This content solicits investment in an unregulated financial service or product. "
            "Financial advisors and fund managers must be registered with regulatory authorities (SEBI/RBI/SEC). "
            "Unregistered investment solicitation is illegal and a common scam vector."
        ),
    },
]


def _extract_evidence(text: str, pattern: str, max_chars: int = 150) -> Optional[str]:
    """Extract the first matching evidence snippet from text."""
    match = re.search(pattern, text)
    if not match:
        return None
    start = max(0, match.start() - 20)
    end = min(len(text), match.end() + 30)
    snippet = text[start:end].strip()
    if len(snippet) > max_chars:
        snippet = snippet[:max_chars] + "..."
    return snippet


def detect_text_indicators(normalized_text: str) -> List[DetectedIndicator]:
    """
    Run the full indicator engine against normalized text.
    Returns list of DetectedIndicator objects for every matched signal.
    Each indicator is detected only once (first match wins) to avoid duplication.
    """
    results: List[DetectedIndicator] = []

    for indicator in _INDICATOR_PATTERNS:
        evidence: Optional[str] = None

        for pattern in indicator["patterns"]:
            evidence = _extract_evidence(normalized_text, pattern)
            if evidence:
                break

        if evidence:
            results.append(
                DetectedIndicator(
                    code=indicator["code"],
                    name=indicator["name"],
                    severity=indicator["severity"],
                    weight=indicator["weight"],
                    evidence=evidence,
                    explanation=indicator["explanation"],
                )
            )

    return results
