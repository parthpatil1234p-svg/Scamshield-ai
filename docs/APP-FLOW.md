# ScamShield AI — Application Flow Specification

**Version:** 1.0.0  
**Status:** APPROVED — Product Architecture  
**Created:** 2026-08-20  
**Project:** ScamShield AI  
**Problem Statement Code:** CS-2 (AI-Based Detection of Fake Investment and Trading Scams on Social Media)  
**Parent Documents:** [docs/PRD.md](./PRD.md), [docs/TRD.md](./TRD.md), [docs/UI-UX-DESIGN.md](./UI-UX-DESIGN.md)  
**Tagline:** Detect. Understand. Stay Safe.

---

## 1. Executive Summary & Flow Philosophy

ScamShield AI provides a seamless, secure, and intuitive journey for users analyzing potential investment fraud from social media platforms (Telegram, WhatsApp, Instagram, X/Twitter, YouTube).

The core philosophy of the application flow is:
1. **Low Friction:** Minimal clicks from landing to active scanning.
2. **Transparent Explainability:** Immediate, sequential breakdown of risk scores, detected evidence, and actionable safety recommendations.
3. **Strict Data Privacy:** Full user ownership of scan records with instant one-click deletion capabilities.

`mermaid
graph TD
    A[Visitor] -->|Public Access| B(Landing Page /)
    A -->|Learn More| C(About Page /about)
    B -->|Click 'Start Scanning'| D(Login /login)
    B -->|Click 'Register'| E(Register /register)
    D -->|Valid JWT Auth| F(Dashboard /dashboard)
    E -->|Account Created| 
    F -->|Quick Action| G(Scanner /scanner)
    G -->|Select Text Tab| H[Submit Text Content]
    G -->|Select URL Tab| I[Submit Domain/URL]
    G -->|Select Combined Tab| J[Submit Text + URL]
    H --> K[Analysis Pipeline]
    I --> K
    J --> K
    K -->|Sync Response 201| L(Result Page /results/:scanId)
    L -->|Review & Action| M[Take Safety Precautions]
    L -->|New Scan| G
    F -->|View All| N(History /history)
    N -->|Select Item| L
    N -->|Delete Item| O[Confirm Deletion Modal]
    F -->|Account Settings| P(Profile /profile)
    P -->|Sign Out| B
`

---

## 2. Global Navigation & Route Map

| Route | Page Name | Access Level | Description |
|---|---|---|---|
| / | Landing Page | Public | Product introduction, core features, how-it-works, disclaimer |
| /about | About Page | Public | Mission, AI detection methodology, limitations, safety advisory |
| /login | Sign In | Public (Guest only) | User authentication via email + password |
| /register | Sign Up | Public (Guest only) | Account creation with live password validation |
| /dashboard | Dashboard | Protected (JWT) | Scan stats summary, recent activity feed, quick-scan launcher |
| /scanner | Scanner | Protected (JWT) | Multi-mode scam analyzer (Text, URL, Combined) |
| /results/:scanId | Result Detail | Protected (Owner only) | Comprehensive explainable risk assessment report |
| /history | Scan History | Protected (JWT) | Paginated list of past scans with risk-level filtering |
| /profile | Profile | Protected (JWT) | User account overview and session sign-out |
| /* | 404 Fallback | Public | Friendly resource not found page |

---

## 3. End-to-End User Journey Workflows

### 3.1 Authentication & Onboarding Flow
1. User lands on / and clicks **"Start Scanning"**.
2. If no valid JWT token is found in localStorage, user is redirected to /login.
3. New users click **"Create Account"** to navigate to /register.
4. User enters valid email and password (minimum 8 characters).
5. On successful registration (HTTP 201), the backend issues a JWT token.
6. The client stores the token, updates auth context, and auto-redirects to /dashboard.

### 3.2 Scam Scanning Flow (Core Journey)
1. User navigates to /scanner.
2. User selects one of three tabs:
   - **Text Scan:** Pastes social media promotional text (up to 5,000 characters).
   - **URL Scan:** Inputs suspicious link (http:// or https://).
   - **Combined Scan:** Submits both text and link for fused risk calculation.
3. User clicks **"Analyze Content"**.
4. Scanner transitions into the **Analysis Loading Experience**:
   - Step 1: Input Validation
   - Step 2: Signal Extraction
   - Step 3: Heuristic & NLP Analysis
   - Step 4: Risk Scoring & Synthesis
5. Upon receiving HTTP 201 from backend, client redirects to /results/:scanId.

### 3.3 Explainable Result Exploration Flow
1. User views the **Risk Score Gauge** (0–100 score + Tier Badge: LOW / MEDIUM / HIGH / CRITICAL).
2. User reads the **Plain-English Summary** explaining the overarching threat assessment.
3. User inspects the **Detected Risk Signals** (Indicator Cards displaying verbatim matched evidence and pedagogical reasoning).
4. User reviews the **Actionable Safety Recommendations** (e.g., "Do NOT transfer crypto", "Report post").
5. (Optional) User expands **Analysis Technical Details** to view model versions and latency metrics.

### 3.4 Scan History & Record Management Flow
1. User navigates to /history.
2. Table displays paginated historical scans (date, analysis type, risk tier, score).
3. User can filter list by risk tier (LOW, MEDIUM, HIGH, CRITICAL).
4. User clicks **"View Result"** to reopen /results/:scanId.
5. User clicks **"Delete"** icon button:
   - Modal prompt requests explicit confirmation.
   - On confirmation, HTTP DELETE /api/v1/scans/:scanId executes.
   - Record is purged and UI list optimistically updates with a success toast.

---

## 4. Error Handling & Edge-Case Flows

`mermaid
sequenceDiagram
    autonumber
    actor User
    participant Browser
    participant Router
    participant API as FastAPI Backend
    participant DB as MongoDB

    User->>Browser: Enters unauthenticated URL (/dashboard)
    Browser->>Router: Check auth status
    Router-->>Browser: No JWT Token -> Redirect /login?redirect=/dashboard
    User->>Browser: Enters credentials & submits
    Browser->>API: POST /api/v1/auth/login
    alt Invalid Credentials
        API-->>Browser: 401 Unauthorized
        Browser->>User: Displays inline error alert
    else Valid Credentials
        API-->>Browser: 200 OK + JWT Token
        Browser->>Browser: Store token in localStorage
        Browser->>Router: Redirect to /dashboard
    end
`

### 4.1 Token Expiration (401 Unauthorized)
- Axios response interceptor intercepts HTTP 401.
- Automatically clears localStorage token.
- Dispatches uth:unauthorized event and redirects user to /login with an informational toast: *"Session expired. Please sign in again."*

### 4.2 Resource Ownership Violation (403 Forbidden / 404 Not Found)
- When a user attempts to manually navigate to /results/:scanId belonging to another user, backend returns 403/404.
- Frontend renders the standard Access Denied error state with a direct button: *"Return to Dashboard"*.

### 4.3 Malicious or Invalid URL Input (422 Unprocessable Entity)
- Client-side validation catches invalid URL schemes (e.g. tp://, javascript:, malformed strings).
- Backend SSRF validation blocks private IP ranges (127.0.0.1, 10.0.0.0/8, 192.168.0.0/16, 169.254.169.254).
- UI renders clear inline validation error without breaking the application.

---

*End of ScamShield AI Application Flow Specification*
