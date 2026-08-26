<div align="center">

# 🛡️ ScamShield AI
### *Detect. Understand. Stay Safe.*

**Explainable AI-Powered Investment & Trading Scam Detection System**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

</div>

## 📌 Problem Statement & Overview

Investment scams on social media (Telegram, WhatsApp, Instagram, X, YouTube) cause immense financial distress, specifically targeting new and retail investors who lack the technical means to spot deceptive patterns.

Traditional tools output opaque binary labels (*"Scam"* vs *"Not Scam"*), leaving users confused and vulnerable. **ScamShield AI** bridges this gap by providing **Explainable AI risk scoring (0–100)**:
- 🔍 Multi-signal extraction across **9 Text Indicator categories** and **10 URL Structural/Lexical checks**.
- 💬 **Explainable AI (XAI)** — Every detected indicator highlights **verbatim evidence** directly from the input with a clear reason *why* it is suspicious.
- 🔒 **Zero-Trust Security** — Pure lexical URL analysis with **Zero outbound HTTP requests** (Strict SSRF protection).

---

## ✨ Key Features

- **🎯 3 Analysis Modes**:
  - **Text Scan**: Detects urgency tactics, guaranteed return claims, crypto solicitation, fake authority endorsements, and data harvesting.
  - **URL Scan**: Detects IP-in-URL, high-abuse TLDs, phishing keywords, punycode spoofing, and excessive subdomains.
  - **Combined Scan**: Fused scoring combining text (60%) and URL (40%) with a *Critical Ceiling Governor*.
- **📊 Real-time Risk Gauge & Breakdown**:
  - Animated 0–100 score ring with color-coded severity tiers: `LOW` (0–24), `MEDIUM` (25–49), `HIGH` (50–74), `CRITICAL` (75–100).
  - Sub-scores for both Text and URL components.
- **🛡️ Explainable Findings with Verbatim Evidence**:
  - Highlights exact text snippets and provides plain-language explanations of risks.
  - Generates tailored, actionable safety recommendations.
- **📜 Scan History & Dashboard**:
  - Aggregate statistics (Total, Critical, High, Low threats detected).
  - Paginated history table with risk-level filtering and scan deletion with confirmation.
- **🔐 Enterprise-Grade Security Architecture**:
  - JWT Bearer Authentication with `bcrypt` password hashing.
  - User-isolated queries preventing Insecure Direct Object References (IDOR).
  - Rate limiting on sensitive endpoints.
  - Full Dark-Mode UI engineered with high-contrast accessibility standards.

---

## 🔬 Detection Signal Taxonomy

### 📝 Text Risk Indicators
| Code | Indicator Name | Default Severity | Weight | Example Detection |
| :--- | :--- | :---: | :---: | :--- |
| `TI-01` | Guaranteed Return Claims | `CRITICAL` | 25 | *"100% guaranteed daily profit with zero risk"* |
| `TI-02` | Unrealistic Profit Multipliers | `HIGH` | 15 | *"Turn ₹5,000 into ₹50,000 in just 24 hours"* |
| `TI-03` | Urgency & Scarcity Pressure | `MEDIUM` | 8 | *"Only 2 spots left! Offer expires in 10 minutes"* |
| `TI-04` | Exclusive / Secret Group Access | `LOW` | 4 | *"Join our VIP insider Telegram channel for signals"* |
| `TI-05` | False Authority / Celebrity Endorsement | `HIGH` | 15 | *"Approved by RBI / Endorsed by Ambani"* |
| `TI-06` | Payment / Crypto Solicitation | `CRITICAL` | 25 | *"Deposit USDT to TRC20 wallet address"* |
| `TI-07` | MLM / Referral Recruitment | `MEDIUM` | 8 | *"Earn 20% passive commission for every referral"* |
| `TI-08` | Zero Risk / Capital Protection | `HIGH` | 12 | *"No loss strategy, 100% risk free trading"* |
| `TI-09` | Personal Data Harvesting | `HIGH` | 12 | *"Send Aadhaar, PAN, and OTP for account setup"* |

### 🔗 URL Risk Indicators
| Code | Indicator Name | Default Severity | Weight | Detection Criteria |
| :--- | :--- | :---: | :---: | :--- |
| `UI-01` | Unencrypted HTTP Protocol | `LOW` | 3 | Scheme is plain `http://` |
| `UI-02` | IP Address Used as Hostname | `CRITICAL` | 25 | Host matches raw IPv4 / IPv6 format |
| `UI-03` | Suspicious Financial Keywords | `MEDIUM` | 8 | Domain contains `guaranteed`, `forex-profit`, `crypto-bonus` |
| `UI-04` | Excessive Subdomain Nesting | `MEDIUM` | 8 | Subdomain depth ≥ 4 levels |
| `UI-05` | Suspicious Port Usage | `HIGH` | 12 | Non-standard web ports (e.g., `:8080`, `:8888`, `:3000`) |
| `UI-06` | High-Abuse / Suspicious TLD | `HIGH` | 15 | TLDs such as `.xyz`, `.top`, `.tk`, `.buzz`, `.click` |
| `UI-07` | Punycode / Homograph Attack | `HIGH` | 15 | Internationalized Domain Name starting with `xn--` |
| `UI-08` | URL Shortener Service | `MEDIUM` | 8 | Domains like `bit.ly`, `tinyurl.com`, `t.me` |
| `UI-09` | Excessive URL / Path Length | `LOW` | 4 | Total URL length exceeds 100 characters |
| `UI-10` | Suspicious Query Parameters | `LOW` | 3 | Parameters like `ref=`, `affiliate=`, `token=` |

---

## 🏛️ System Architecture

```
                               ┌────────────────────────────────────────┐
                               │           React 18 Frontend            │
                               │  Vite + TypeScript + Tailwind CSS v4   │
                               │    (Landing, Scanner, Results, Stats)  │
                               └──────────────────┬─────────────────────┘
                                                  │ Axios + JWT Bearer
                                                  ▼
                               ┌────────────────────────────────────────┐
                               │         FastAPI Backend (Python)       │
                               │      (Auth, Rate Limit, IDOR Guard)     │
                               └──────────────────┬─────────────────────┘
                                                  │
                 ┌────────────────────────────────┴────────────────────────────────┐
                 │                                                                 │
                 ▼                                                                 ▼
   ┌───────────────────────────┐                                     ┌───────────────────────────┐
   │    AI Detection Engine    │                                     │      Database Layer       │
   │  ├─ Text Preprocessor    │                                     │  ├─ Async Motor Driver   │
   │  ├─ 9 Text Indicators    │                                     │  ├─ MongoDB Atlas / Local │
   │  ├─ 10 URL Indicators    │                                     │  ├─ Users Collection      │
   │  ├─ Fused Risk Engine    │                                     │  └─ Scans Collection      │
   │  └─ Report Synthesizer   │                                     └───────────────────────────┘
   └───────────────────────────┘
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.12+**
- **Node.js 18+** & **npm**
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)

---

### 1. Backend Setup

```powershell
# Navigate to backend
cd backend

# Create & activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # On Linux/macOS: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Configure Environment Variables (`backend/.env`):
```env
PROJECT_NAME="ScamShield AI"
API_V1_STR="/api/v1"
ENVIRONMENT="development"
DEBUG=true

JWT_SECRET_KEY="your-secure-256-bit-random-secret-key"
JWT_ALGORITHM="HS256"
JWT_EXPIRE_MINUTES=1440

# MongoDB (Local or Atlas)
MONGODB_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority"
MONGODB_DB_NAME="scamshield_db"
MONGODB_MIN_POOL_SIZE=5
MONGODB_MAX_POOL_SIZE=20

CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
RATE_LIMIT_AUTH_PER_MINUTE=60
RATE_LIMIT_SCANS_PER_MINUTE=120
```

#### Run Backend Server:
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend runs on **`http://localhost:8000`** with Interactive Docs at **`http://localhost:8000/api/v1/docs`**.*

---

### 2. Frontend Setup

```powershell
# Navigate to frontend
cd frontend

# Install packages
npm install

# Start development server
npm run dev
```
*Frontend runs on **`http://localhost:5173`**.*

---

## 🧪 Testing & Verification

### Running Automated Backend Tests
```powershell
cd backend
pytest tests/ -v
```

### Running Live End-to-End Integration Verification
```powershell
cd backend
python tests/verify_live.py
```
*Verifies Database Connectivity, User Registration, Login Flow, Profile Fetching, Scan Creation with Multi-Signal Detection, IDOR Isolation, Dashboard Stats Aggregation, and Scan Deletion.*

### Building Frontend for Production
```powershell
cd frontend
npm run build
```

---

## 📡 API Reference Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/v1/health` | System health & DB connection status | ❌ |
| `POST` | `/api/v1/auth/register` | Create a new user account | ❌ |
| `POST` | `/api/v1/auth/login` | Authenticate user & return JWT token | ❌ |
| `GET` | `/api/v1/auth/me` | Retrieve active authenticated user profile | ✅ |
| `POST` | `/api/v1/scans` | Create & execute a new risk scan (text/url/combined) | ✅ |
| `GET` | `/api/v1/scans` | Retrieve paginated scans with optional risk filter | ✅ |
| `GET` | `/api/v1/scans/{scan_id}` | Get detailed explainable scan report by ID | ✅ |
| `DELETE`| `/api/v1/scans/{scan_id}` | Delete a specific scan record (IDOR protected) | ✅ |
| `GET` | `/api/v1/scans/dashboard/stats` | Aggregate metrics (Total, Critical, High, Low) | ✅ |

---

## 📁 Repository Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/  # Auth, Scans, Health route controllers
│   │   ├── core/              # Config, Security, JWT, Logging, Exceptions
│   │   ├── db/                # Motor MongoDB session, Index lifecycle, Repositories
│   │   ├── schemas/           # Pydantic validation models (User, Scan)
│   │   ├── services/          # Core Business Logic & AI Detection
│   │   │   └── analysis/      # Text Preprocessor, Indicators, URL Security, Risk Engine
│   │   └── main.py            # FastAPI lifespan, CORS, error handling
│   ├── tests/                 # Pytest test suite & Live integration scripts
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment configuration
├── frontend/
│   ├── src/
│   │   ├── api/               # Axios client with JWT interceptor & Vite proxy
│   │   ├── components/        # ProtectedRoute, GuestRoute, AppLayout, RiskBadge
│   │   ├── context/           # AuthContext (state management & session persistence)
│   │   ├── pages/             # Landing, Scanner, Result, Dashboard, History, Profile, About
│   │   ├── types/             # TypeScript type definitions matching backend schemas
│   │   ├── index.css          # Design tokens & animations
│   │   └── App.tsx            # Root router & layout configuration
│   ├── package.json           # Node dependencies
│   └── vite.config.ts         # Vite configuration with API reverse proxy
├── docs/                      # PRD, TRD, APP-FLOW, UI-UX-DESIGN, BACKEND-SCHEMA
└── README.md                  # Project Documentation
```

---

## ⚖️ Disclaimer

ScamShield AI provides **probabilistic risk assessments** based on detected linguistic and structural signals. Output results do not constitute legal or financial advice. Users should always independently verify investment opportunities through official regulatory registries (e.g., SEBI, RBI, SEC).

---

<div align="center">
  <sub>Built with ❤️ for Cyber Security Hackathon 2026.</sub>
</div>
