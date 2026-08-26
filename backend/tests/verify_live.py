import urllib.request
import json
import time

BASE = "http://localhost:8000/api/v1"

def post(url, data, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers=headers,
        method="POST"
    )
    with urllib.request.urlopen(req) as response:
        return response.status, json.loads(response.read().decode("utf-8"))

def get(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers, method="GET")
    with urllib.request.urlopen(req) as response:
        return response.status, json.loads(response.read().decode("utf-8"))

def delete(url, token=None):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, headers=headers, method="DELETE")
    with urllib.request.urlopen(req) as response:
        return response.status, None

def run_tests():
    email = f"live_test_{int(time.time())}@scamshield.ai"
    password = "SecurePassword123!"

    print("[1] Testing Registration...")
    status, reg = post(f"{BASE}/auth/register", {"email": email, "password": password})
    assert status == 201, f"Expected 201, got {status}"
    assert reg["success"] is True
    token = reg["data"]["access_token"]
    user_id = reg["data"]["user"]["user_id"]
    print(f"    SUCCESS: Registered user {user_id}")

    print("[2] Testing Login...")
    status, log = post(f"{BASE}/auth/login", {"email": email, "password": password})
    assert status == 200, f"Expected 200, got {status}"
    assert bool(log["data"]["access_token"])
    print("    SUCCESS: Logged in successfully")

    print("[3] Testing User Profile (/auth/me)...")
    status, me = get(f"{BASE}/auth/me", token=token)
    assert status == 200
    assert me["email"] == email
    print(f"    SUCCESS: Profile confirmed for {me['email']}")

    print("[4] Testing Scan Creation (Combined Analysis)...")
    payload = {
        "analysis_type": "combined",
        "text": "GUARANTEED 500% profit in 24 hours! Send USDT to activate wallet now! Endorsed by Elon Musk.",
        "url": "http://free-crypto-bonus.xyz/claim?ref=999"
    }
    status, scan = post(f"{BASE}/scans", payload, token=token)
    assert status == 201
    scan_id = scan["scan_id"]
    print(f"    SUCCESS: Created scan {scan_id}")
    print(f"    Risk Score: {scan['risk_score']}/100 | Risk Level: {scan['risk_level']}")
    print(f"    Detected Indicators ({len(scan['detected_indicators'])}):")
    for ind in scan["detected_indicators"]:
        print(f"      * [{ind['code']}] {ind['name']} (Severity: {ind['severity']}, Weight: {ind['weight']})")
    print(f"    Summary: {scan['summary'][:80]}...")
    print(f"    Recommendations ({len(scan['recommendations'])}):")
    for rec in scan["recommendations"]:
        print(f"      * {rec}")

    print("[5] Testing Get Scan by ID...")
    status, fetched = get(f"{BASE}/scans/{scan_id}", token=token)
    assert status == 200
    assert fetched["scan_id"] == scan_id
    print("    SUCCESS: Retrieved scan by ID")

    print("[6] Testing Scan List & Pagination...")
    status, history = get(f"{BASE}/scans?page=1&limit=10", token=token)
    assert status == 200
    assert history["success"] is True
    assert history["pagination"]["total"] >= 1
    print(f"    SUCCESS: List returned {len(history['data'])} scans (Total: {history['pagination']['total']})")

    print("[7] Testing Dashboard Stats...")
    status, stats = get(f"{BASE}/scans/dashboard/stats", token=token)
    assert status == 200
    assert stats["total_scans"] >= 1
    print(f"    SUCCESS: Dashboard stats: {stats}")

    print("[8] Testing Scan Deletion...")
    status, _ = delete(f"{BASE}/scans/{scan_id}", token=token)
    assert status == 204
    print(f"    SUCCESS: Deleted scan {scan_id}")

    print("\n==========================================")
    print(" ALL 8 LIVE INTEGRATION VERIFICATIONS PASSED!")
    print("==========================================")

if __name__ == "__main__":
    run_tests()
