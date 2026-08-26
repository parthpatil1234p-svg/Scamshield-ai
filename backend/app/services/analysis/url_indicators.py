"""
backend/app/services/analysis/url_indicators.py
Lexical and structural URL indicator engine for UI-01 through UI-10.
Following TRD Section 19 and BACKEND-SCHEMA Section 5.1.

SIGNAL CATALOG:
  UI-01: Unencrypted HTTP Protocol      (Weight:  3, Severity: LOW)
  UI-02: Raw IP Hostname                (Weight: 15, Severity: HIGH)
  UI-03: Suspicious Financial Keywords  (Weight:  8, Severity: MEDIUM)
  UI-04: Excessive URL Length (>100)    (Weight:  3, Severity: LOW)
  UI-05: Excessive Subdomain Depth >=3  (Weight:  8, Severity: MEDIUM)
  UI-06: High-Abuse / Suspicious TLD    (Weight: 15, Severity: HIGH)
  UI-07: URL Shortener Domain           (Weight:  8, Severity: MEDIUM)
  UI-08: Numeric / Random Domain String (Weight: 15, Severity: HIGH)
  UI-09: Excessive Hyphenation >=3      (Weight:  3, Severity: LOW)
  UI-10: Suspicious Query Parameters    (Weight:  3, Severity: LOW)
"""
import ipaddress
import re
from dataclasses import dataclass
from typing import List
from urllib.parse import urlparse, parse_qs


@dataclass
class DetectedUrlSignal:
    code: str
    name: str
    severity: str
    weight: int
    evidence: str
    explanation: str


# High-abuse TLDs commonly used in scam infrastructure
HIGH_ABUSE_TLDS = {
    ".top", ".xyz", ".biz", ".info", ".click", ".link", ".download",
    ".loan", ".win", ".gq", ".ml", ".cf", ".tk", ".ga", ".pw",
    ".bid", ".trade", ".review", ".accountant", ".date", ".faith",
    ".racing", ".science", ".party", ".stream", ".gdn", ".men",
    ".work", ".cam", ".icu", ".monster", ".cyou", ".shop"
}

# Known URL shortener domains
URL_SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
    "buff.ly", "adf.ly", "bitly.com", "short.io", "rb.gy", "cutt.ly",
    "tiny.cc", "lnkd.in", "tr.im", "clck.ru", "qps.ru"
}

# Suspicious financial/promotional keywords in URL path or domain
SUSPICIOUS_FINANCIAL_KEYWORDS = [
    "profit", "earn", "invest", "trading", "forex", "crypto", "bitcoin",
    "btc", "eth", "usdt", "bonus", "guaranteed", "returns", "income",
    "money", "rich", "millionaire", "passive", "wealth", "reward",
    "prize", "winner", "jackpot", "lottery", "fund", "scheme", "roi",
    "yield", "dividend", "gain", "vip", "exclusive", "premium"
]

# Suspicious query parameter names
SUSPICIOUS_PARAMS = {
    "ref", "affiliate", "bonus", "promo", "code", "invite", "referral",
    "campaign", "source", "utm_source", "utm_campaign", "partner",
    "aff", "pid", "cid", "sid", "rid"
}


def _is_ip_hostname(hostname: str) -> bool:
    """Check if the hostname is a raw IP address."""
    try:
        ipaddress.ip_address(hostname)
        return True
    except ValueError:
        return False


def detect_url_signals(url: str) -> List[DetectedUrlSignal]:
    """
    Analyze URL structure and extract all matching UI-01 to UI-10 signals.
    Performs zero outbound network requests — purely lexical/structural analysis.
    """
    results: List[DetectedUrlSignal] = []

    try:
        parsed = urlparse(url)
    except Exception:
        return results

    scheme = parsed.scheme.lower()
    hostname = (parsed.hostname or "").lower()
    path = parsed.path or ""
    query = parsed.query or ""
    full_url = url

    # -----------------------------------------------------------------------
    # UI-01: Unencrypted HTTP Protocol
    # -----------------------------------------------------------------------
    if scheme == "http":
        results.append(DetectedUrlSignal(
            code="UI-01",
            name="Unencrypted HTTP Protocol",
            severity="LOW",
            weight=3,
            evidence=f"http://",
            explanation=(
                "The URL uses unencrypted HTTP instead of HTTPS. "
                "Legitimate financial services exclusively use HTTPS for secure connections. "
                "HTTP connections are vulnerable to interception and man-in-the-middle attacks."
            )
        ))

    # -----------------------------------------------------------------------
    # UI-02: Raw IP Hostname
    # -----------------------------------------------------------------------
    if hostname and _is_ip_hostname(hostname):
        results.append(DetectedUrlSignal(
            code="UI-02",
            name="Raw IP Hostname in URL",
            severity="HIGH",
            weight=15,
            evidence=hostname,
            explanation=(
                "The URL uses a raw IP address instead of a registered domain name. "
                "Legitimate investment platforms use registered domain names. "
                "IP-based hosting is commonly associated with phishing infrastructure."
            )
        ))

    # -----------------------------------------------------------------------
    # UI-03: Suspicious Financial Keywords in URL
    # -----------------------------------------------------------------------
    url_lower = full_url.lower()
    matched_keywords = [kw for kw in SUSPICIOUS_FINANCIAL_KEYWORDS if kw in url_lower]
    if matched_keywords:
        results.append(DetectedUrlSignal(
            code="UI-03",
            name="Suspicious Financial Keywords in URL",
            severity="MEDIUM",
            weight=8,
            evidence=", ".join(matched_keywords[:5]),
            explanation=(
                "The URL contains financial promotional terms commonly found in scam landing pages. "
                f"Detected: {', '.join(matched_keywords[:5])}. "
                "Legitimate financial institutions do not use aggressive promotional terms in their URLs."
            )
        ))

    # -----------------------------------------------------------------------
    # UI-04: Excessive URL Length
    # -----------------------------------------------------------------------
    if len(full_url) > 100:
        results.append(DetectedUrlSignal(
            code="UI-04",
            name="Excessive URL Length",
            severity="LOW",
            weight=3,
            evidence=f"URL length: {len(full_url)} characters",
            explanation=(
                f"The URL is {len(full_url)} characters long (threshold: 100). "
                "Excessively long URLs are often used to obscure malicious destinations "
                "or embed tracking parameters that identify specific victims."
            )
        ))

    # -----------------------------------------------------------------------
    # UI-05: Excessive Subdomain Depth
    # -----------------------------------------------------------------------
    if hostname:
        # Exclude the TLD and main domain, count subdomains
        parts = hostname.split(".")
        if len(parts) >= 4:  # e.g., a.b.example.com = 3 subdomains
            subdomain_count = len(parts) - 2
            results.append(DetectedUrlSignal(
                code="UI-05",
                name="Excessive Subdomain Depth",
                severity="MEDIUM",
                weight=8,
                evidence=hostname,
                explanation=(
                    f"The hostname has {subdomain_count} subdomain levels. "
                    "Excessively nested subdomains are used to impersonate trusted domains "
                    "(e.g., paypal.com.evil.example.com) and evade casual inspection."
                )
            ))

    # -----------------------------------------------------------------------
    # UI-06: High-Abuse / Suspicious TLD
    # -----------------------------------------------------------------------
    if hostname:
        for tld in HIGH_ABUSE_TLDS:
            if hostname.endswith(tld):
                results.append(DetectedUrlSignal(
                    code="UI-06",
                    name="High-Abuse / Suspicious TLD",
                    severity="HIGH",
                    weight=15,
                    evidence=tld,
                    explanation=(
                        f"The URL uses the TLD '{tld}', which has historically high rates of malicious use. "
                        "These TLDs are disproportionately used in phishing, fraud, and scam infrastructure "
                        "due to their low registration costs and lax abuse handling."
                    )
                ))
                break

    # -----------------------------------------------------------------------
    # UI-07: URL Shortener Domain
    # -----------------------------------------------------------------------
    if hostname in URL_SHORTENER_DOMAINS:
        results.append(DetectedUrlSignal(
            code="UI-07",
            name="URL Shortener Redirection Domain",
            severity="MEDIUM",
            weight=8,
            evidence=hostname,
            explanation=(
                f"The URL uses the shortener service '{hostname}'. "
                "URL shorteners mask the final destination, preventing users from evaluating the real URL. "
                "Scammers routinely use URL shorteners to hide malicious or misleading destinations."
            )
        ))

    # -----------------------------------------------------------------------
    # UI-08: Numeric / Random-Looking Domain
    # -----------------------------------------------------------------------
    if hostname:
        domain_parts = hostname.split(".")
        main_domain = domain_parts[-2] if len(domain_parts) >= 2 else hostname
        # Check if domain is purely numeric
        if re.match(r"^\d+$", main_domain):
            results.append(DetectedUrlSignal(
                code="UI-08",
                name="Numeric Domain String",
                severity="HIGH",
                weight=15,
                evidence=main_domain,
                explanation=(
                    f"The domain '{main_domain}' is composed entirely of numbers. "
                    "Numeric domains are commonly registered by scam operators as disposable infrastructure "
                    "and are not associated with legitimate financial businesses."
                )
            ))
        # Check for very random-looking domain (high digit/special-char density)
        elif re.match(r".*[0-9]{3,}.*", main_domain) and len(main_domain) > 8:
            results.append(DetectedUrlSignal(
                code="UI-08",
                name="Numerically Dense Domain String",
                severity="HIGH",
                weight=15,
                evidence=main_domain,
                explanation=(
                    f"The domain '{main_domain}' contains an unusually high density of numbers. "
                    "Such domains are often algorithmically generated for short-lived scam infrastructure."
                )
            ))

    # -----------------------------------------------------------------------
    # UI-09: Excessive Hyphenation in Domain
    # -----------------------------------------------------------------------
    if hostname:
        domain_parts = hostname.split(".")
        main_domain = domain_parts[-2] if len(domain_parts) >= 2 else hostname
        hyphen_count = main_domain.count("-")
        if hyphen_count >= 3:
            results.append(DetectedUrlSignal(
                code="UI-09",
                name="Excessive Hyphenation in Domain",
                severity="LOW",
                weight=3,
                evidence=f"{main_domain} ({hyphen_count} hyphens)",
                explanation=(
                    f"The domain '{main_domain}' contains {hyphen_count} hyphens. "
                    "Legitimate financial institutions rarely use heavily hyphenated domains. "
                    "Excessive hyphens are used to create lookalike domains (e.g., secure-paypal-login.com)."
                )
            ))

    # -----------------------------------------------------------------------
    # UI-10: Suspicious Query Parameters
    # -----------------------------------------------------------------------
    if query:
        try:
            params = parse_qs(query)
            matched_params = [p for p in params.keys() if p.lower() in SUSPICIOUS_PARAMS]
            param_count = len(params)
            
            # Trigger if there are suspicious tracking params OR excessive params (>8)
            if matched_params or param_count > 8:
                evidence_parts = []
                if matched_params:
                    evidence_parts.append(f"Suspicious params: {', '.join(matched_params[:5])}")
                if param_count > 8:
                    evidence_parts.append(f"Total parameters: {param_count}")
                
                results.append(DetectedUrlSignal(
                    code="UI-10",
                    name="Suspicious Query Parameters",
                    severity="LOW",
                    weight=3,
                    evidence=" | ".join(evidence_parts),
                    explanation=(
                        "The URL contains query parameters associated with affiliate tracking or excessive parameterization. "
                        "Affiliate parameters identify victims for commission-based referral schemes. "
                        "Legitimate investment platforms do not use aggressive affiliate-tracking URLs in promotional content."
                    )
                ))
        except Exception:
            pass

    return results
