"""
Comprehensive End-to-End System & Security Verification Script
"""
import json
import urllib.error
import urllib.request
import time

BASE = "http://127.0.0.1:8000/api/v1"

def req(url: str, method: str = "GET", data: dict = None, token: str = None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data is not None else None
    r = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            return status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            return e.code, json.loads(content)
        except Exception:
            return e.code, {"error": content}

def run():
    print("=" * 60)
    print("STARTING SCAMSHIELD AI COMPREHENSIVE E2E VERIFICATION")
    print("=" * 60)

    ts = int(time.time())
    email_a = f"test_e2e_a_{ts}@scamshield.ai"
    email_b = f"test_e2e_b_{ts}@scamshield.ai"
    pwd = "StrongPassword123!"

    # 1. Startup & Health
    status, health = req(f"{BASE}/health")
    assert status == 200 and health.get("data", {}).get("status") == "healthy", f"Health failed: {health}"
    print("[PASS] 1. Backend Startup & Database Connection: HEALTHY")

    # 2. Registration
    status, reg_a = req(f"{BASE}/auth/register", "POST", {"email": email_a, "password": pwd})
    assert status == 201, f"Registration failed: {reg_a}"
    token_a = reg_a["data"]["access_token"]
    user_id_a = reg_a["data"]["user"]["user_id"]
    print(f"[PASS] 2. User A Registered ({user_id_a})")

    # 3. Duplicate Registration Check
    status, dup = req(f"{BASE}/auth/register", "POST", {"email": email_a, "password": pwd})
    assert status == 409, f"Expected 409 for duplicate, got {status}"
    print("[PASS] 3. Duplicate Registration Prevention: PASSED (409 Conflict)")

    # 4. Login with Bad Credentials
    status, bad_login = req(f"{BASE}/auth/login", "POST", {"email": email_a, "password": "WrongPassword"})
    assert status == 401, f"Expected 401 for bad password, got {status}"
    print("[PASS] 4. Invalid Password Rejection: PASSED (401 Unauthorized)")

    # 5. Login with Good Credentials
    status, login_a = req(f"{BASE}/auth/login", "POST", {"email": email_a, "password": pwd})
    assert status == 200 and "access_token" in login_a["data"]
    print("[PASS] 5. Valid User Login: PASSED (200 OK)")

    # 6. Current User Profile
    status, me_a = req(f"{BASE}/auth/me", "GET", token=token_a)
    assert status == 200 and me_a["email"] == email_a
    print("[PASS] 6. User Profile Retrieval (/auth/me): PASSED")

    # 7. Low Risk Text Scan
    status, scan_low = req(
        f"{BASE}/scans",
        "POST",
        {"analysis_type": "text", "text": "This is a quarterly corporate financial statement for review."},
        token=token_a
    )
    assert status == 201 and scan_low["risk_level"] == "LOW"
    print(f"[PASS] 7. Low Risk Text Scan: Score {scan_low['risk_score']} ({scan_low['risk_level']})")

    # 8. High/Critical Risk Text Scan (Scam indicators)
    status, scan_high = req(
        f"{BASE}/scans",
        "POST",
        {
            "analysis_type": "text",
            "text": "100% GUARANTEED PROFIT! 500% profit monthly with zero risk. Endorsed by RBI. Act now, limited slots! Send USDT to crypto wallet."
        },
        token=token_a
    )
    assert status == 201 and scan_high["risk_score"] >= 50
    assert len(scan_high["detected_indicators"]) >= 3
    assert len(scan_high["recommendations"]) >= 1
    scan_id_high = scan_high["scan_id"]
    print(f"[PASS] 8. Threat Text Scan: Score {scan_high['risk_score']} ({scan_high['risk_level']}) with {len(scan_high['detected_indicators'])} signals & {len(scan_high['recommendations'])} safety actions")

    # 9. URL Security Scan
    status, scan_url = req(
        f"{BASE}/scans",
        "POST",
        {"analysis_type": "url", "url": "http://crypto-profit-bonus.xyz/claim?ref=1234"},
        token=token_a
    )
    assert status == 201 and scan_url["risk_score"] > 0
    print(f"[PASS] 9. URL Security Scan: Score {scan_url['risk_score']} ({scan_url['risk_level']})")

    # 10. SSRF Protection on Dangerous URLs
    for bad_url in ["http://127.0.0.1:8000/internal", "http://169.254.169.254/meta", "http://10.0.0.1"]:
        status, ssrf_resp = req(f"{BASE}/scans", "POST", {"analysis_type": "url", "url": bad_url}, token=token_a)
        assert status == 422, f"Expected 422 for SSRF {bad_url}, got {status}"
    print("[PASS] 10. SSRF Attack Neutralization: PASSED (Loopback, Cloud Metadata, Private IPs blocked with 422)")

    # 11. Combined Scan (Text + URL)
    status, scan_comb = req(
        f"{BASE}/scans",
        "POST",
        {
            "analysis_type": "combined",
            "text": "100% guaranteed profit deposit now",
            "url": "http://earn-fast-crypto.top/invest"
        },
        token=token_a
    )
    assert status == 201
    assert scan_comb["text_sub_score"] is not None and scan_comb["url_sub_score"] is not None
    print(f"[PASS] 11. Combined Mode Fusion: Score {scan_comb['risk_score']} (Text: {scan_comb['text_sub_score']}, URL: {scan_comb['url_sub_score']})")

    # 12. Retrieve Scan by ID
    status, fetched_scan = req(f"{BASE}/scans/{scan_id_high}", "GET", token=token_a)
    assert status == 200 and fetched_scan["scan_id"] == scan_id_high
    print("[PASS] 12. Retrieve Scan by ID: PASSED")

    # 13. Scan History & Pagination
    status, hist = req(f"{BASE}/scans?page=1&limit=10", "GET", token=token_a)
    assert status == 200 and hist["pagination"]["total"] >= 3
    print(f"[PASS] 13. Scan History & Pagination: PASSED ({hist['pagination']['total']} scans recorded)")

    # 14. Dashboard Statistics
    status, stats = req(f"{BASE}/scans/dashboard/stats", "GET", token=token_a)
    assert status == 200 and stats["total_scans"] >= 3
    print(f"[PASS] 14. Dashboard Statistics: PASSED (Total: {stats['total_scans']}, Low: {stats['low_risk_scans']}, Medium: {stats['medium_risk_scans']}, High: {stats['high_risk_scans']}, Critical: {stats['critical_risk_scans']})")

    # 15. Cross-User IDOR Protection
    # Create User B
    _, reg_b = req(f"{BASE}/auth/register", "POST", {"email": email_b, "password": pwd})
    token_b = reg_b["data"]["access_token"]
    
    # User B tries to fetch User A's scan
    status, idor_get = req(f"{BASE}/scans/{scan_id_high}", "GET", token=token_b)
    assert status == 404, f"Expected 404 for IDOR get, got {status}"
    
    # User B tries to delete User A's scan
    status, idor_del = req(f"{BASE}/scans/{scan_id_high}", "DELETE", token=token_b)
    assert status in [403, 404], f"Expected 403/404 for IDOR delete, got {status}"
    
    # User B's list should be empty
    status, hist_b = req(f"{BASE}/scans", "GET", token=token_b)
    assert status == 200 and len(hist_b["data"]) == 0
    print("[PASS] 15. IDOR Access Control & User Data Isolation: PASSED (Zero data leakage)")

    # 16. Scan Deletion by Owner
    status, del_resp = req(f"{BASE}/scans/{scan_id_high}", "DELETE", token=token_a)
    assert status == 204, f"Expected 204 for delete, got {status}"
    
    # Verify scan is gone
    status, re_fetch = req(f"{BASE}/scans/{scan_id_high}", "GET", token=token_a)
    assert status == 404
    print("[PASS] 16. Scan Deletion & Verification: PASSED (Record permanently erased)")

    print("=" * 60)
    print("ALL 16 E2E INTEGRATION & SECURITY VERIFICATIONS PASSED 100%!")
    print("=" * 60)

if __name__ == "__main__":
    run()
