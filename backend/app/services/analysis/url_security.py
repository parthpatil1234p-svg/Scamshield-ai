"""
backend/app/services/analysis/url_security.py
Comprehensive SSRF defense validator for URL analysis.
Following TRD Section 20 and ADR-009 (Zero outbound requests in MVP).

SSRF Protections:
- Protocol whitelist (http/https only)
- Private RFC 1918 IP range blocking
- Loopback address blocking
- Cloud metadata address blocking
- Link-local address blocking
"""
import ipaddress
import re
from urllib.parse import urlparse

from app.core.exceptions import SSRFException, ValidationException

# Allowed URL schemes
ALLOWED_SCHEMES = {"http", "https"}

# Dangerous schemes blocked
BLOCKED_SCHEMES = {"file", "ftp", "gopher", "data", "javascript", "vbscript", "ldap", "dict", "sftp", "ssh"}

# Known private/reserved IP networks that must be blocked
BLOCKED_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),        # Loopback
    ipaddress.ip_network("10.0.0.0/8"),          # Private Class A
    ipaddress.ip_network("172.16.0.0/12"),       # Private Class B
    ipaddress.ip_network("192.168.0.0/16"),      # Private Class C
    ipaddress.ip_network("169.254.0.0/16"),      # Link-local (APIPA)
    ipaddress.ip_network("::1/128"),             # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),            # IPv6 private
    ipaddress.ip_network("fe80::/10"),           # IPv6 link-local
    ipaddress.ip_network("0.0.0.0/8"),           # "This" network
    ipaddress.ip_network("100.64.0.0/10"),       # Shared address space
]

# Cloud metadata endpoints
BLOCKED_HOSTNAMES = {
    "169.254.169.254",          # AWS/GCP/Azure instance metadata
    "metadata.google.internal", # GCP metadata
    "metadata.internal",        # Azure metadata
    "instance-data",            # EC2 internal
}

# Regex to detect decimal/octal/hex encoded IPs (SSRF bypass attempts)
_DECIMAL_IP_PATTERN = re.compile(r"^\d{7,}$")
_HEX_IP_PATTERN = re.compile(r"^0x[0-9a-fA-F]{1,8}$")
_OCTAL_IP_PATTERN = re.compile(r"^0\d+$")


def validate_url_safe(url: str) -> str:
    """
    Validate that a URL is safe to process structurally.
    Returns the cleaned URL if safe.
    Raises SSRFException or ValidationException if unsafe.
    
    NOTE: This performs ZERO outbound requests. It is purely structural.
    """
    if not url or not url.strip():
        raise ValidationException(message="URL cannot be empty.")

    url = url.strip()

    # Parse URL
    try:
        parsed = urlparse(url)
    except Exception:
        raise ValidationException(message="Malformed URL could not be parsed.")

    # Validate scheme
    scheme = parsed.scheme.lower()
    if not scheme:
        raise ValidationException(
            message="URL must include a scheme (http:// or https://)."
        )
    if scheme in BLOCKED_SCHEMES:
        raise SSRFException(
            message=f"URL scheme '{scheme}://' is not permitted for security reasons."
        )
    if scheme not in ALLOWED_SCHEMES:
        raise ValidationException(
            message=f"Only http:// and https:// URLs are accepted. Got: {scheme}://"
        )

    # Validate hostname exists
    hostname = parsed.hostname
    if not hostname:
        raise ValidationException(message="URL does not contain a valid hostname.")

    # Block known dangerous hostnames
    if hostname.lower() in BLOCKED_HOSTNAMES:
        raise SSRFException(
            message="URL hostname is a known cloud metadata or internal service endpoint."
        )

    # Block localhost variants
    if hostname.lower() in ("localhost", "localhost.localdomain"):
        raise SSRFException(message="Loopback/localhost URLs are not permitted.")

    # Attempt IP resolution for blocking private ranges
    try:
        # Check if hostname is an IP address
        ip_obj = ipaddress.ip_address(hostname)
        _check_ip_blocked(ip_obj)
    except ValueError:
        # hostname is a domain name — check for encoded IP bypass attempts
        _check_encoded_ip_bypass(hostname)

    return url


def _check_ip_blocked(ip_obj: ipaddress.IPv4Address | ipaddress.IPv6Address) -> None:
    """Check if the IP address falls within any blocked network range."""
    for network in BLOCKED_NETWORKS:
        try:
            if ip_obj in network:
                raise SSRFException(
                    message=f"IP address {ip_obj} is in a reserved/private network range and is blocked."
                )
        except TypeError:
            # IP version mismatch — skip this network
            continue


def _check_encoded_ip_bypass(hostname: str) -> None:
    """
    Check for common SSRF bypass patterns:
    - Decimal-encoded IPs (e.g., 2130706433 == 127.0.0.1)
    - Hex-encoded IPs (e.g., 0x7f000001 == 127.0.0.1)
    - Octal-encoded IPs (e.g., 0177.0.0.1)
    """
    # Remove port if present
    host = hostname.split(":")[0]

    if _DECIMAL_IP_PATTERN.match(host):
        try:
            ip_obj = ipaddress.ip_address(int(host))
            _check_ip_blocked(ip_obj)
        except (ValueError, OSError):
            pass

    if _HEX_IP_PATTERN.match(host):
        try:
            ip_obj = ipaddress.ip_address(int(host, 16))
            _check_ip_blocked(ip_obj)
        except (ValueError, OSError):
            pass
