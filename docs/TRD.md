# ScamShield AI — Technical Requirements Document (TRD)

**Version:** 1.0.0  
**Status:** DRAFT — Technical Blueprint  
**Created:** 2026-08-20  
**Project:** ScamShield AI  
**Problem Statement Code:** CS-2 (AI-Based Detection of Fake Investment and Trading Scams on Social Media)  
**Parent Document:** [docs/PRD.md](./PRD.md)  
**Tagline:** Detect. Understand. Stay Safe.

> **CRITICAL ARCHITECTURAL DIRECTIVE:**  
> This TRD translates the approved functional and product requirements from docs/PRD.md into concrete, implementation-ready engineering specifications.  
> It defines software architecture, interface contracts, database schemas, AI pipeline abstractions, scoring algorithms, and security boundaries.  
> No application source code is to be created or deployed until the Architecture Review phase is officially completed.  
> All technical choices not explicitly mandated by the official problem statement are marked **[PROPOSED]**.

---

## Table of Contents

1. [Source of Truth & Architectural Principles](#1-source-of-truth--architectural-principles)
2. [Technology Stack & Compatibility Matrix](#2-technology-stack--compatibility-matrix)
3. [System Architecture & Component Diagram](#3-system-architecture--component-diagram)
4. [File and Module Architecture](#4-file-and-module-architecture)
5. [Frontend Architecture & Design System](#5-frontend-architecture--design-system)
6. [Frontend Routing & Route Guards](#6-frontend-routing--route-guards)
7. [Frontend Component Architecture](#7-frontend-component-architecture)
8. [Frontend API & State Management Layer](#8-frontend-api--state-management-layer)
9. [Backend Architecture & Layered Design](#9-backend-architecture--layered-design)
10. [Complete REST API Design & Contracts](#10-complete-rest-api-design--contracts)
11. [Authentication & Authorization Architecture](#11-authentication--authorization-architecture)
12. [Database Architecture & Schema Definitions](#12-database-architecture--schema-definitions)
13. [Database Indexing & Query Strategy](#13-database-indexing--query-strategy)
14. [Text Analysis Engine Architecture](#14-text-analysis-engine-architecture)
15. [Text Indicator Engine (TI-01 to TI-09)](#15-text-indicator-engine-ti-01-to-ti-09)
16. [NLP Classifier Architecture & Abstraction](#16-nlp-classifier-architecture--abstraction)
17. [Model Versioning & Metadata Pipeline](#17-model-versioning--metadata-pipeline)
18. [URL Analysis Engine & Structural Parser](#18-url-analysis-engine--structural-parser)
19. [URL Feature Extraction & Signals (UI-01 to UI-10)](#19-url-feature-extraction--signals-ui-01-to-ui-10)
20. [URL Security & Comprehensive SSRF Defense](#20-url-security--comprehensive-ssrf-defense)
21. [Risk Engine Math & Scoring Algorithms](#21-risk-engine-math--scoring-algorithms)
22. [Combined Risk Engine & Scoring Fusion](#22-combined-risk-engine--scoring-fusion)
23. [Explainability Engine & Dynamic Synthesis](#23-explainability-engine--dynamic-synthesis)
24. [Recommendation Engine & Safety Rules](#24-recommendation-engine--safety-rules)
25. [Analysis Orchestrator & Execution Pipeline](#25-analysis-orchestrator--execution-pipeline)
26. [Synchronous vs. Asynchronous Strategy](#26-synchronous-vs-asynchronous-strategy)
27. [Standardized Error Handling Architecture](#27-standardized-error-handling-architecture)
28. [Security Architecture & Threat Mitigation](#28-security-architecture--threat-mitigation)
29. [Frontend Security Architecture](#29-frontend-security-architecture)
30. [API Security Architecture](#30-api-security-architecture)
31. [AI Security & Defense Against Prompt Injection](#31-ai-security--defense-against-prompt-injection)
32. [Environment Configuration & Secrets Management](#32-environment-configuration--secrets-management)
33. [Structured Logging Architecture](#33-structured-logging-architecture)
34. [Observability, Metrics & Health Checks](#34-observability-metrics--health-checks)
35. [Comprehensive Testing Architecture](#35-comprehensive-testing-architecture)
36. [AI Model Evaluation Methodology](#36-ai-model-evaluation-methodology)
37. [Performance Targets & Benchmark Architecture](#37-performance-targets--benchmark-architecture)
38. [Scalability Architecture & Growth Path](#38-scalability-architecture--growth-path)
39. [Deployment Architecture & Infrastructure](#39-deployment-architecture--infrastructure)
40. [CI/CD Automation Pipeline](#40-cicd-automation-pipeline)
41. [Data Flow Diagrams (Mermaid)](#41-data-flow-diagrams-mermaid)
42. [Sequence Diagrams (Mermaid)](#42-sequence-diagrams-mermaid)
43. [Threat Model & Risk Matrix](#43-threat-model--risk-matrix)
44. [Traceability Matrix (PRD to TRD)](#44-traceability-matrix-prd-to-trd)
45. [Technical Acceptance Criteria](#45-technical-acceptance-criteria)
46. [Phased Technical Roadmap](#46-phased-technical-roadmap)
47. [Open Technical Questions](#47-open-technical-questions)
48. [Technical Risk Register & Mitigations](#48-technical-risk-register--mitigations)
49. [TRD Quality Verification](#49-trd-quality-verification)

---

## 1. Source of Truth & Architectural Principles

### 1.1 Source of Truth Hierarchy
1. **Official Problem Statement CS-2:** Foundational mandate (AI-based detection of investment/trading scams on social media with explainable risk assessment, not binary label).
2. **docs/PRD.md:** Primary Product Source of Truth defining functional requirements, user personas, risk levels, indicators, workflows, and non-goals.
3. **docs/TRD.md (This Document):** Primary Technical Source of Truth defining implementation architecture, data contracts, schemas, interfaces, algorithms, and security controls.
4. **docs/technical-decisions.md:** Architecture Decision Records (ADRs) capturing rationale, tradeoffs, and technical options considered.

### 1.2 Core Architectural Principles

| Principle | Technical Meaning & Enforcement |
|---|---|
| **Modular Architecture** | Every domain (auth, scanning, risk scoring, explainability, persistence) is isolated into independent modules behind strict interfaces. |
| **Separation of Concerns** | UI components do not call DB; route handlers do not execute business logic; NLP models do not generate UI text directly. |
| **API-First Design** | All client-server interactions are governed by typed, versioned, RESTful OpenAPI schemas before UI or backend coding begins. |
| **Secure-by-Default** | Zero trust input validation; parameter-bound DB queries; strict CORS; password hashing with bcrypt; zero outbound HTTP requests in MVP. |
| **Explainable AI** | The system produces deterministic evidence snippets and plain-English reasoning for all risk factors. No black-box unexplained verdicts. |
| **Replaceable AI Models** | ML/NLP classifiers sit behind an abstract ScamClassifier base class; switching from TF-IDF to transformer requires zero route/UI changes. |
| **Configuration-Driven Scoring** | All indicator weights, risk level boundaries, and combination ratios are driven by configuration variables, not hardcoded constants. |
| **Testability & Determinism** | Analysis algorithms are pure functions decoupled from I/O, enabling deterministic unit testing and golden-dataset validation. |
| **Least Privilege & Privacy** | MongoDB user has DB-only scoped permissions; user-submitted content is isolated by ownership guards; passwords never logged or returned. |
| **Graceful Degradation** | If an ML inference component fails or throws, the pipeline degrades gracefully to the rule-based baseline without crashing the API. |

---

## 2. Technology Stack & Compatibility Matrix

**[PROPOSED TECHNICAL STACK]**

### 2.1 Core Stack Selection

`	ext
+-------------------------------------------------------------------------------+
| FRONTEND:  React 18+ (TypeScript) + Vite + Tailwind CSS + Lucide React + Axios|
| BACKEND:   FastAPI (Python 3.11+) + Pydantic v2 + Uvicorn (ASGI)              |
| DATABASE:  MongoDB 6.0+ / 7.0+ (Motor AsyncIO Driver / MongoDB Atlas)         |
| AUTH:      JWT (PyJWT HS256) + Passlib / Bcrypt (Work Factor >= 12)           |
| AI / NLP:  Python 3.11 + scikit-learn (TF-IDF + LogReg/SVM) + Regex Engine    |
| TESTING:   Pytest + HTTPX (Backend), Vitest + React Testing Library (Frontend)|
+-------------------------------------------------------------------------------+
`

### 2.2 Technical Compatibility Matrix

| Layer | Package / Technology | Version Target | Purpose / Technical Rationale |
|---|---|---|---|
| **Frontend Runtime** | Node.js | v20.x LTS | Stable runtime for frontend tooling, Vite, and testing. |
| **Frontend Framework** | React | ^18.3.1 | Component-based UI with declarative state and concurrent rendering. |
| **Type System** | TypeScript | ^5.4.0 | End-to-end static typing matching backend Pydantic models. |
| **Bundler / Build** | Vite | ^5.2.0 | Instant HMR (<50ms), Rollup optimized tree-shaken production bundles. |
| **Routing** | React Router DOM | ^6.23.0 | Client-side declarative routing with nested layout and auth guards. |
| **Styling** | Tailwind CSS | ^3.4.3 | Utility-first CSS, dark-mode design tokens, WCAG 2.1 AA contrast palette. |
| **HTTP Client** | Axios | ^1.6.8 | Request/response interceptors for automatic JWT injection and error wrapping. |
| **Iconography** | Lucide React | ^0.378.0 | Lightweight tree-shakeable SVG icons for risk levels and indicators. |
| **Backend Runtime** | Python | 3.11.x | High performance CPython speedups, native async/await, modern type hints. |
| **Web Framework** | FastAPI | ^0.111.0 | Asynchronous REST framework with native Pydantic v2 integration & OpenAPI. |
| **ASGI Server** | Uvicorn (Standard) | ^0.29.0 | High-speed production ASGI server using uvloop and httptools. |
| **Validation / Schema** | Pydantic | ^2.7.1 | C-compiled data validation, parsing, and serialization. |
| **Database Driver** | Motor (Async MongoDB) | ^3.4.0 | Non-blocking async MongoDB client natively integrated with asyncio loop. |
| **Password Hashing** | Passlib (Bcrypt) / bcrypt | ^4.1.2 | Industry standard adaptive salted password hashing (rounds=12). |
| **Token Handling** | PyJWT | ^2.8.0 | RFC 7519 JSON Web Token encoding, signing, and cryptographic decoding. |
| **NLP / ML Library** | scikit-learn | ^1.4.2 | Feature extraction (TF-IDF), model training, evaluation metrics. |
| **Text Processing** | regex / standard re | Python built-in | High-efficiency regex pattern matching engine for indicators TI-01 to TI-09. |
| **Testing Backend** | Pytest + pytest-asyncio | ^8.1.1 | Async API test suite, fixtures, mock database, and coverage reporting. |
| **Testing Frontend** | Vitest + RTL | ^1.5.0 | High-speed component rendering, user-event testing, and mock Axios client. |

---

## 3. System Architecture & Component Diagram

### 3.1 High-Level Architecture Overview (Current vs. Future)

`	ext
===================================================================================
CURRENT SYSTEM ARCHITECTURE (HACKATHON MVP: PHASES 1–3)
===================================================================================

[ USER / CLIENT BROWSER ]
       │
       ▼
[ REACT 18 + TYPESCRIPT SPA ] ── (Tailwind UI, Route Guards, Axios Interceptors)
       │
       ▼ HTTPS / JSON REST
[ FASTAPI ASGI BACKEND ] ─────── (CORS, Rate Limiter, JWT Auth, Pydantic Validator)
       │
       ▼
[ ANALYSIS ORCHESTRATOR ]
 ├── [TEXT ANALYZER] ──────────> [Regex Engine + TF-IDF Classifier] ──> Indicators (TI-01..09)
 ├── [URL ANALYZER] ───────────> [Lexical Parser + Structural Engine] ─> Signals (UI-01..10)
 ├── [RISK ENGINE] ────────────> [Sub-score Fusion + Ceiling Governor] ─> Risk Score (0-100)
 ├── [EXPLAINABILITY ENGINE] ──> [5-Questions Template Synthesizer] ───> Plain-English Summary
 └── [RECOMMENDATION ENGINE] ──> [Contextual Action Rules] ────────────> Defensive Guidance
       │
       ▼ Motor Async Driver
[ MONGODB DATABASE ] ──────────> Collections: users, scans

===================================================================================
FUTURE EXTENSIONS ARCHITECTURE (POST-HACKATHON: PHASES 4–6)
===================================================================================
 ├── [PHASE 4: OCR / IMAGE ENGINE] ──> [Tesseract / Vision API] ──> Text Extractor
 ├── [PHASE 5: THREAT INTEL CLIENT] ─> [Secure Outbound SSRF Proxy] ─> VirusTotal / WHOIS API
 └── [PHASE 6: TRANSFORMER NLP] ─────> [DistilBERT / RoBERTa Inference Service]
`

---

## 4. File and Module Architecture

### 4.1 Monorepo Project Structure

`	ext
scamshield-ai/
│
├── frontend/                        # React + TypeScript Client Application
│   ├── public/                      # Static assets (favicons, robots.txt)
│   ├── src/
│   │   ├── api/                     # Axios client, interceptors, API endpoints
│   │   ├── assets/                  # Images, SVGs, brand illustrations
│   │   ├── components/              # Reusable UI component library
│   │   │   ├── common/              # Buttons, Cards, Inputs, Badges, Modals
│   │   │   ├── layout/              # Navbar, Sidebar, Footer, AppLayout
│   │   │   ├── scanner/             # TextScanner, UrlScanner, CombinedScanner
│   │   │   └── results/             # RiskScoreCard, IndicatorCard, EvidenceCard
│   │   ├── contexts/                # AuthContext, ThemeContext
│   │   ├── hooks/                   # useAuth, useScan, useDebounce, useMediaQuery
│   │   ├── layouts/                 # RootLayout, AuthLayout, DashboardLayout
│   │   ├── pages/                   # Landing, Login, Register, Dashboard, Scanner, Result, History, Profile, About
│   │   ├── routes/                  # AppRouter, ProtectedRoute, PublicRoute
│   │   ├── types/                   # TypeScript interfaces (User, Scan, Indicator, API)
│   │   ├── utils/                   # Formatters, riskColorMap, validator helpers
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Application entry point
│   │   └── index.css                # Tailwind directives & design token variables
│   ├── package.json                 # Frontend dependencies and scripts
│   ├── tsconfig.json                # TypeScript compiler configuration
│   ├── vite.config.ts               # Vite configuration (proxy, build options)
│   └── tailwind.config.js           # Tailwind design tokens & theme configuration
│
├── backend/                         # FastAPI Python Backend Application
│   ├── app/
│   │   ├── api/                     # API route endpoints
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── auth.py      # /auth/register, /auth/login
│   │   │   │   │   ├── users.py     # /users/me, user profiles
│   │   │   │   │   ├── scans.py     # /scans (POST, GET, GET by ID, DELETE)
│   │   │   │   │   └── health.py    # /health (Liveness, DB, AI engine status)
│   │   │   │   └── api_router.py    # Main v1 router aggregator
│   │   │   └── deps.py              # FastAPI dependency injections (current_user, db)
│   │   ├── core/                    # Core configuration & application events
│   │   │   ├── config.py            # Pydantic BaseSettings (.env loader)
│   │   │   ├── security.py          # Password hashing, JWT token creation/decoding
│   │   │   └── events.py            # App startup/shutdown event handlers
│   │   ├── db/                      # Database connection & repository layer
│   │   │   ├── mongodb.py           # Motor client initialization & connection pooling
│   │   │   └── repositories/
│   │   │       ├── user_repo.py     # User CRUD operations
│   │   │       └── scan_repo.py     # Scan CRUD operations & history pagination
│   │   ├── models/                  # Database domain models (MongoDB BSON schemas)
│   │   │   ├── user_model.py        # User document model
│   │   │   └── scan_model.py        # Scan document model
│   │   ├── schemas/                 # Pydantic request/response validation schemas
│   │   │   ├── auth_schema.py       # Login/Register request & token response
│   │   │   ├── user_schema.py       # User profile & metrics response
│   │   │   ├── scan_schema.py       # Scan submission & full scan result response
│   │   │   └── common_schema.py     # Standard envelope & error schemas
│   │   ├── services/                # Business logic & orchestration
│   │   │   ├── auth_service.py      # Registration, authentication business logic
│   │   │   ├── scan_service.py      # Scan orchestration, persistence, user ownership
│   │   │   └── analysis/            # AI / Analysis Engine modules
│   │   │       ├── orchestrator.py  # Central scan orchestrator
│   │   │       ├── text_analyzer.py # Text indicator pattern matcher & NLP caller
│   │   │       ├── url_analyzer.py  # URL lexical & structural signal extractor
│   │   │       ├── risk_engine.py   # Normalized scoring & fusion algorithms
│   │   │       ├── explainer.py     # 5-questions plain-English summary generator
│   │   │       ├── recommender.py   # Contextual defensive advice engine
│   │   │       ├── nlp/             # ML / Classifier abstraction layer
│   │   │       │   ├── base.py      # Abstract ScamClassifier base class
│   │   │       │   ├── rule_clf.py  # Deterministic rule classifier implementation
│   │   │       │   └── tfidf_clf.py # TF-IDF + Logistic Regression implementation
│   │   │       └── data/            # Indicator dictionaries, pattern regexes, TLD lists
│   │   ├── utils/                   # Shared backend utility functions
│   │   │   ├── logger.py            # Structured JSON logger
│   │   │   └── sanitizers.py        # String sanitizers & input bounds enforcement
│   │   └── main.py                  # FastAPI application entrypoint & middleware setup
│   ├── tests/                       # Automated backend test suite
│   │   ├── conftest.py              # Pytest fixtures (test client, mock DB, test users)
│   │   ├── test_auth.py             # Auth endpoints & JWT unit/integration tests
│   │   ├── test_scans.py            # Scan submission, ownership, history tests
│   │   ├── test_text_analyzer.py    # Unit tests for indicators TI-01 to TI-09
│   │   ├── test_url_analyzer.py     # Unit tests for URL signals UI-01 to UI-10
│   │   ├── test_risk_engine.py      # Unit tests for scoring math & fusion logic
│   │   └── test_security.py         # Rate limit, CORS, and injection attack tests
│   ├── requirements.txt             # Backend Python dependencies
│   └── .env.example                 # Template for environment configuration
│
├── docs/                            # Project Documentation Repository
│   ├── PRD.md                       # Product Requirements Document
│   ├── TRD.md                       # Technical Requirements Document (This File)
│   └── technical-decisions.md       # Architecture Decision Records (ADRs)
│
├── .gitignore                       # Universal gitignore file
└── README.md                        # Master project documentation
`


---

## 5. Frontend Architecture & Design System

### 5.1 Design Philosophy & Visual Language
The frontend visual language prioritizes **Trust, Clarity, Readability, Professionalism, and Accessibility** over flashy animations.
- **Background Canvas:** Deep slate/navy dark theme (#0B0F19) providing visual depth.
- **Card Surfaces:** Elevated dark gray (#111827) with subtle slate borders (#1F2937).
- **Typography:** High-legibility sans-serif (Inter, system-ui) with minimum 16px base body font.
- **Spatial Grid:** Strict 8px grid system (4px for micro-spacing, 16/24px component padding, 32/48px section margins).

### 5.2 Color Tokens & Risk Badging (WCAG 2.1 AA Compliant)

| Category | Token / Class | Hex Code | Contrast Ratio | Usage Description |
|---|---|---|---|---|
| **Canvas Background** | g-brand-bg | #0B0F19 | N/A | Base application canvas |
| **Card Surface** | g-brand-surface | #111827 | N/A | Modal and card container surfaces |
| **Text Primary** | 	ext-slate-100 | #F1F5F9 | 15.2:1 | High-contrast main headings and body text |
| **Text Muted** | 	ext-slate-400 | #94A3B8 | 7.1:1 | Secondary labels, descriptions, timestamps |
| **Risk: LOW** | 	ext-emerald-400 / bg-emerald-950/40 | #34D399 | 8.4:1 | Low signal density / baseline notification |
| **Risk: MEDIUM** | 	ext-amber-400 / bg-amber-950/40 | #FBBF24 | 9.1:1 | Elevated signals, verification required |
| **Risk: HIGH** | 	ext-orange-400 / bg-orange-950/40 | #FB923C | 7.8:1 | Multiple scam indicators detected |
| **Risk: CRITICAL** | 	ext-rose-400 / bg-rose-950/40 | #FB7185 | 7.5:1 | Severe scam signature (e.g. payment request) |

> **Accessibility Rule:** Color alone is NEVER the sole carrier of information. Every risk badge pairs color with explicit text labels (CRITICAL, HIGH, MEDIUM, LOW) and distinct icon glyphs.

---

## 6. Frontend Routing & Route Guards

### 6.1 Route Table & Access Controls

| Path | Layout | Route Guard | Purpose / View |
|---|---|---|---|
| / | RootLayout | PublicOnly | Product landing page, feature showcase, CTA buttons. |
| /login | AuthLayout | PublicOnly | User login form. Redirects to /dashboard if authenticated. |
| /register | AuthLayout | PublicOnly | User registration form. Redirects to /dashboard if authenticated. |
| /about | RootLayout | Public | Methodology, AI limitations, and legal disclaimers. |
| /dashboard | DashboardLayout | ProtectedRoute | User scan activity statistics, quick actions, recent scan card. |
| /scanner | DashboardLayout | ProtectedRoute | Interactive scanner form (Text, URL, Combined analysis). |
| /results/:scanId | DashboardLayout | ProtectedRoute | Detailed explainability view for an individual scan. |
| /history | DashboardLayout | ProtectedRoute | Paginated list of past scans with search, filter, and delete actions. |
| /profile | DashboardLayout | ProtectedRoute | User account metadata and session logout. |
| * | RootLayout | Public | 404 Not Found page with navigation back to safety. |

### 6.2 Route Guard Mechanics
- ProtectedRoute: Evaluates isAuthenticated state from AuthContext. If false and authentication check has resolved, saves target URL in session and redirects to /login.
- PublicOnly: Redirects already authenticated users directly to /dashboard.
- AuthVerification: Displays a lightweight top-level loading skeleton until the initial /api/v1/users/me JWT verification completes.

---

## 7. Frontend Component Architecture

### 7.1 Key Component Specifications

#### 1. ScannerForm
- **Responsibility:** Multi-tab scan submission controller.
- **Props:** onScanComplete: (scanId: string) => void
- **State:** nalysisType: 'text' | 'url' | 'combined', 	ext: string, url: string, isSubmitting: boolean, errors: Record<string, string>.
- **Validation:** Live character counter (10–5,000 chars for text); client-side regex check for http:// / https:// protocol.

#### 2. RiskScoreCard
- **Responsibility:** Displays numeric score (0–100), risk level badge, and confidence indicator.
- **Props:** score: number, iskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL', lowConfidence: boolean, nalysisType: string.
- **Accessibility:** ria-label="Risk score: {score} out of 100, Level: {riskLevel}".

#### 3. IndicatorList & IndicatorCard
- **Responsibility:** Expandable accordion rendering detected indicators, severity badges, verbatim evidence excerpts, and educational explanations.
- **Props:** indicators: IndicatorItem[].
- **Features:** Highlighted evidence snippets wrapped in monospaced code styling.

#### 4. SafetyRecommendationBlock
- **Responsibility:** Renders actionable, defensive next steps based on risk tier.
- **Props:** ecommendations: string[], iskLevel: string.
- **Visuals:** Shield/Alert icons with clear numbered action items.

#### 5. ScanHistoryTable
- **Responsibility:** Paginated, filterable table/card list of user's past scans.
- **Props:** onDeleteScan: (scanId: string) => Promise<void>.
- **Features:** Responsive collapsing from data table on desktop to stacked cards on mobile screens (<768px).

---

## 8. Frontend API & State Management Layer

### 8.1 State Management Strategy
- **Global Auth State:** Managed via lightweight React AuthContext (Token, CurrentUser, Login, Logout, AuthLoading).
- **Server Cache & Scan State:** Managed via dedicated custom hooks (useScans, useScanDetail) utilizing React state and Axios interceptors with automatic cache busting.
- **Form State:** Local component state with controlled inputs to avoid heavy third-party form library overhead.

### 8.2 Axios Client Configuration & Interceptors
`	ypescript
// Proposed Axios Client Architecture
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Injects JWT Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scamshield_token');
    if (token && config.headers) {
      config.headers.Authorization = Bearer ;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalizes Errors and Handles 401 Expirations
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('scamshield_token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const normalizedError = {
      code: error.response?.data?.error?.code || 'NETWORK_ERROR',
      message: error.response?.data?.error?.message || 'An unexpected network error occurred.',
      status: error.response?.status || 500,
    };
    return Promise.reject(normalizedError);
  }
);
`

---

## 9. Backend Architecture & Layered Design

### 9.1 Layered Separation of Responsibilities

`	ext
[ CLIENT HTTP REQUEST ]
          │
          ▼
[ 1. API ROUTER LAYER ] ──────> Parses URL routes, handles HTTP parameters, invokes dependencies.
          │                     (backend/app/api/v1/endpoints/*.py)
          ▼
[ 2. SCHEMA VALIDATION ] ────> Pydantic models validate input types, length bounds, regex syntax.
          │                     (backend/app/schemas/*.py)
          ▼
[ 3. SERVICE LAYER ] ────────> Orchestrates business workflow, ownership checks, transaction boundaries.
          │                     (backend/app/services/*.py)
          ▼
[ 4. AI & ANALYSIS ENGINE ] ─> Performs feature extraction, indicator matching, risk scoring, explanations.
          │                     (backend/app/services/analysis/*.py)
          ▼
[ 5. REPOSITORY / DB LAYER ] > Executes structured async MongoDB queries via Motor driver.
          │                     (backend/app/db/repositories/*.py)
          ▼
[ MONGODB DATABASE ]
`

> **Strict Architectural Rule:** Business logic and analysis calculations MUST NEVER reside inside route handlers. Route handlers are purely responsible for request dispatch, dependency injection, and response status serialization.

---

## 10. Complete REST API Design & Contracts

### 10.1 Standardized API Contract Schemas

#### 1. GET /api/v1/health
- **Auth:** None (Public)
- **Status:** 200 OK, 503 Service Unavailable
- **Response Schema:**
`json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "database": "connected",
    "ai_engine": "ready",
    "active_model": "rule_based_v1"
  },
  "metadata": { "timestamp": "2026-08-20T19:30:00Z" }
}
`

---

#### 2. POST /api/v1/auth/register
- **Auth:** None (Public)
- **Rate Limit:** 5 requests/min per IP
- **Request Schema:**
`json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
`
- **Response Schema (201 Created):**
`json
{
  "success": true,
  "data": {
    "user_id": "usr_9b1deb4d3b7d4e8b",
    "email": "user@example.com",
    "created_at": "2026-08-20T19:30:00Z"
  }
}
`
- **Error Responses:** 400 Bad Request (Invalid email/weak password), 409 Conflict (Email already registered).

---

#### 3. POST /api/v1/auth/login
- **Auth:** None (Public)
- **Rate Limit:** 10 requests/min per IP
- **Request Schema:**
`json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
`
- **Response Schema (200 OK):**
`json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "expires_in": 3600,
    "user": {
      "user_id": "usr_9b1deb4d3b7d4e8b",
      "email": "user@example.com"
    }
  }
}
`
- **Error Responses:** 401 Unauthorized (Generic error message: "Invalid email or password").

---

#### 4. GET /api/v1/users/me
- **Auth:** Required (Bearer <JWT>)
- **Response Schema (200 OK):**
`json
{
  "success": true,
  "data": {
    "user_id": "usr_9b1deb4d3b7d4e8b",
    "email": "user@example.com",
    "created_at": "2026-08-20T19:30:00Z",
    "total_scans": 12,
    "scan_breakdown": {
      "low": 3,
      "medium": 2,
      "high": 5,
      "critical": 2
    }
  }
}
`

---

#### 5. POST /api/v1/scans
- **Auth:** Required (Bearer <JWT>)
- **Rate Limit:** 20 requests/min per user
- **Request Schema:**
`json
{
  "analysis_type": "combined",
  "text": "Guaranteed 500% monthly profit! Send  USDT to activate your VIP trading account.",
  "url": "http://guaranteed-profit-trading.invest-now.biz/join?bonus=500"
}
`
- **Response Schema (201 Created):**
`json
{
  "success": true,
  "data": {
    "scan_id": "scn_5a2f8c9e1d3b4a6f",
    "user_id": "usr_9b1deb4d3b7d4e8b",
    "analysis_type": "combined",
    "submitted_text": "Guaranteed 500% monthly profit! Send  USDT to activate your VIP trading account.",
    "submitted_url": "http://guaranteed-profit-trading.invest-now.biz/join?bonus=500",
    "risk_score": 88,
    "risk_level": "CRITICAL",
    "low_confidence": false,
    "text_sub_score": 90,
    "url_sub_score": 75,
    "detected_indicators": [
      {
        "code": "TI-01",
        "name": "Guaranteed Return Claim",
        "severity": "HIGH",
        "weight": 15,
        "evidence": "Guaranteed 500% monthly profit",
        "explanation": "This content promises guaranteed returns. Regulated financial products cannot legally guarantee profits."
      },
      {
        "code": "TI-06",
        "name": "Payment Solicitation",
        "severity": "CRITICAL",
        "weight": 25,
        "evidence": "Send  USDT to activate",
        "explanation": "Direct requests to transfer cryptocurrency or deposit funds to activate accounts are a primary hallmark of investment scams."
      },
      {
        "code": "UI-01",
        "name": "Unencrypted HTTP Protocol",
        "severity": "LOW",
        "weight": 3,
        "evidence": "http://",
        "explanation": "The URL uses unencrypted HTTP instead of HTTPS, failing standard transport encryption."
      },
      {
        "code": "UI-03",
        "name": "Suspicious Financial Terms in URL",
        "severity": "MEDIUM",
        "weight": 8,
        "evidence": "profit-trading, bonus=500",
        "explanation": "The URL contains aggressive promotional terms commonly found in scam landing pages."
      }
    ],
    "summary": "The submitted content exhibits multiple critical scam signatures, including direct cryptocurrency payment solicitation and unrealistic guaranteed profit claims.",
    "recommendations": [
      "Do NOT send cryptocurrency, USDT, or money under any circumstances.",
      "Do NOT enter credentials or deposit funds on the linked website.",
      "Report this message and domain to relevant social media platforms and consumer protection authorities."
    ],
    "model_metadata": {
      "analysis_version": "v1.0.0-rules-baseline",
      "model_version": "baseline-heuristic-v1",
      "inference_latency_ms": 115
    },
    "created_at": "2026-08-20T19:30:05Z"
  }
}
`

---

#### 6. GET /api/v1/scans
- **Auth:** Required (Bearer <JWT>)
- **Query Parameters:** page (int >= 1, default 1), limit (int 1..100, default 20), isk_level (optional enum)
- **Response Schema (200 OK):**
`json
{
  "success": true,
  "data": [
    {
      "scan_id": "scn_5a2f8c9e1d3b4a6f",
      "analysis_type": "combined",
      "risk_score": 88,
      "risk_level": "CRITICAL",
      "indicator_count": 4,
      "summary_preview": "The submitted content exhibits multiple critical scam signatures...",
      "created_at": "2026-08-20T19:30:05Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "total_pages": 1
  }
}
`

---

#### 7. GET /api/v1/scans/{scan_id}
- **Auth:** Required (Bearer <JWT>)
- **Response Schema (200 OK):** Identical to POST /api/v1/scans full result object.
- **Error Codes:** 401 Unauthorized, 403 Forbidden (Resource owned by another user), 404 Not Found.

---

#### 8. DELETE /api/v1/scans/{scan_id}
- **Auth:** Required (Bearer <JWT>)
- **Response Schema (200 OK):**
`json
{
  "success": true,
  "data": {
    "scan_id": "scn_5a2f8c9e1d3b4a6f",
    "deleted": true
  }
}
`

---

## 11. Authentication & Authorization Architecture

### 11.1 Authentication Flow Mechanics
- **Password Hashing:** passlib.context.CryptContext(schemes=["bcrypt"], deprecated="auto"). Salting is automatically generated with bcrypt cost factor = 12. Plaintext passwords are never logged, stored, or returned.
- **JWT Cryptographic Signing:** Algorithm HS256 signed using JWT_SECRET_KEY (minimum 256 bits entropy).
- **JWT Payload Structure:**
`json
{
  "sub": "usr_9b1deb4d3b7d4e8b",
  "email": "user@example.com",
  "iat": 1755715200,
  "exp": 1755718800
}
`
- **Token Invalidation / Expiry:** Access tokens strictly expire in 60 minutes (JWT_EXPIRE_MINUTES=60). Tokens are validated stateless on every request via FastAPI dependency get_current_user.

### 11.2 Strict User Authorization & Ownership Enforcement
To enforce strict data privacy and isolation:
1. Every scan document persisted in MongoDB contains an immutable user_id field.
2. In all query repositories (get_scan_by_id, delete_scan, get_user_scans), queries enforce:
   `python
   query = {"scan_id": scan_id, "user_id": current_user.user_id}
   `
3. If a scan exists in the database under a different user_id, the API returns 403 Forbidden (or 404 Not Found to prevent resource enumeration).
4. No user can view, list, modify, or delete another user's scan records under any circumstance.


---

## 12. Database Architecture & Schema Definitions

**[MONGODB ARCHITECTURAL SPECIFICATIONS]**

### 12.1 Database Overview
- **Database Name:** scamshield_db
- **Driver:** motor.motor_asyncio.AsyncIOMotorClient
- **Connection Configuration:**
  - minPoolSize: 10
  - maxPoolSize: 50
  - serverSelectionTimeoutMS: 5000
  - connectTimeoutMS: 10000
  - etryWrites: true

---

### 12.2 Collection: users
Stores user profile credentials, creation timestamps, and active status.

`	ypescript
// BSON Document Schema: users
interface UserDocument {
  _id: ObjectId;                     // Auto-generated MongoDB ObjectId
  user_id: string;                   // UUIDv4 prefixed "usr_..." (Indexed, Unique)
  email: string;                     // Trimmed lowercased email (Indexed, Unique)
  password_hash: string;             // Bcrypt hash (Cost factor 12)
  created_at: Date;                  // UTC Timestamp
  updated_at: Date;                  // UTC Timestamp
  is_active: boolean;                // Account active status (Default: true)
}
`

---

### 12.3 Collection: scans
Stores all scan analysis records, granular indicator detections, raw input texts/URLs, sub-scores, and dynamic explanations.

`	ypescript
// BSON Document Schema: scans
interface IndicatorDetail {
  code: string;                      // e.g., "TI-01", "UI-03"
  name: string;                      // Human-readable title
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  weight: number;                    // Numeric weight applied (3, 8, 15, 25)
  evidence: string;                  // Verbatim snippet matched
  explanation: string;               // Plain-language educational explanation
}

interface ScanDocument {
  _id: ObjectId;                     // Auto-generated MongoDB ObjectId
  scan_id: string;                   // UUIDv4 prefixed "scn_..." (Indexed, Unique)
  user_id: string;                   // Reference to user_id in 'users' (Indexed)
  analysis_type: "text" | "url" | "combined";
  submitted_text?: string;           // Present if type == "text" or "combined"
  submitted_url?: string;            // Present if type == "url" or "combined"
  risk_score: number;                // Normalized score (0 - 100)
  risk_level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  low_confidence: boolean;           // True if ML or heuristic confidence is below threshold
  text_sub_score?: number;           // Sub-score for text component (0 - 100)
  url_sub_score?: number;            // Sub-score for URL component (0 - 100)
  detected_indicators: IndicatorDetail[];
  summary: string;                   // Plain-English synthesis
  recommendations: string[];         // Actionable defensive guidelines
  model_metadata: {
    analysis_version: string;        // e.g. "phase-2-text-v1"
    model_version: string;           // e.g. "baseline-heuristic-v1"
    inference_latency_ms: number;    // Processing duration in ms
  };
  created_at: Date;                  // UTC Timestamp (Indexed)
  updated_at: Date;                  // UTC Timestamp
}
`

---

### 12.4 Future Collections (Post-Hackathon)
- model_versions: Registry tracking trained ML models, dataset versions, precision/recall/F1 metrics, and active flags.
- 	hreat_intelligence: Cache store for domain reputation lookups (VirusTotal, WHOIS) with 24-hour TTL.
- udit_events: Security event log for tracking authentication failures, rate-limiting violations, and SSRF trigger attempts.

---

## 13. Database Indexing & Query Strategy

### 13.1 Index Registry & Technical Justification

| Collection | Index Key Definition | Unique | Technical Rationale & Query Pattern |
|---|---|---|---|
| users | { email: 1 } | **Yes** | Accelerates user lookup on login (POST /auth/login) and guarantees email uniqueness on registration (POST /auth/register). |
| users | { user_id: 1 } | **Yes** | High-speed O(1) user verification during JWT bearer authentication middleware. |
| scans | { scan_id: 1 } | **Yes** | Enables direct O(1) scan retrieval by ID (GET /scans/{scan_id}) and delete operations. |
| scans | { user_id: 1, created_at: -1 } | No | **Compound Index:** Powers user history listing (GET /scans?page=1&limit=20) with zero in-memory sorting. |
| scans | { user_id: 1, risk_level: 1 } | No | Powers dashboard aggregation pipeline calculating scan breakdown counts per risk tier. |

---

## 14. Text Analysis Engine Architecture

### 14.1 Pipeline Architecture

`	ext
Raw Text Input (10 - 5,000 chars)
       │
       ▼
[ 1. Input Validation & Bounds Check ] ──> Rejects empty/oversized payloads
       │
       ▼
[ 2. Text Normalizer & Cleaner ] ────────> Lowercases, strips zero-width chars, normalizes unicode
       │
       ▼
[ 3. Feature Extractor & Tokenizer ] ────> Extracts n-grams, financial entities, currency tokens
       │
       ├───► [ Deterministic Regex Engine ] ──> Matches indicators TI-01 to TI-09 + extracts evidence
       │
       └───► [ Statistical ScamClassifier ] ──> Computes ML probability & anomaly vector
       │
       ▼
[ 4. Indicator Scorer & Aggregator ] ────> Combines indicator weights & normalizes text sub-score (0-100)
       │
       ▼
Text Sub-Score (0-100) + Matched Indicators List + Excerpts
`

---

## 15. Text Indicator Engine (TI-01 to TI-09)

**[TECHNICAL INDICATOR IMPLEMENTATION]**

Every indicator is defined by a distinct code, severity, numerical weight, regex pattern, and educational rationale.

`python
# Technical Indicator Registry Specification
INDICATORS_CONFIG = {
    "TI-01": {
        "code": "TI-01",
        "name": "Guaranteed Return Claim",
        "severity": "HIGH",
        "weight": 15,
        "regex": r"(?i)\b(guaranteed\s+(\w+\s+)?(returns?|profits?|income)|100%\s+safe|risk[- ]free|sure\s+returns?|assured\s+profit)\b",
        "explanation": "This content contains language suggesting that investment returns are guaranteed. Legitimate regulated investment products generally cannot guarantee returns."
    },
    "TI-02": {
        "code": "TI-02",
        "name": "Unrealistic Profit Multiplier",
        "severity": "HIGH",
        "weight": 15,
        "regex": r"(?i)\b((\d{2,4}%|(\d{1,3}x))\s+(in|within|daily|monthly|in\s+\d+\s+(days?|weeks?|hours?))|turn\s+\True\d+\s+into\s+\True\d+)\b",
        "explanation": "This content claims unusually high or rapid profits from an investment. Returns of this magnitude within short periods are extremely rare in legitimate markets."
    },
    "TI-03": {
        "code": "TI-03",
        "name": "Urgency / Pressure Tactic",
        "severity": "MEDIUM",
        "weight": 8,
        "regex": r"(?i)\b(limited\s+slots?|only\s+\d+\s+(spots?|slots?|left)|act\s+now|hurry\s+up|expires?\s+today|before\s+midnight|closing\s+soon)\b",
        "explanation": "This content uses artificial urgency to pressure you into making a fast financial decision without conducting proper due diligence."
    },
    "TI-04": {
        "code": "TI-04",
        "name": "FOMO (Fear of Missing Out)",
        "severity": "MEDIUM",
        "weight": 8,
        "regex": r"(?i)\b(don['’]?t\s+(be\s+left\s+behind|miss\s+out)|everyone\s+is\s+profiting|join\s+thousands\s+who\s+made|financial\s+freedom\s+today)\b",
        "explanation": "This content appeals to fear of being excluded from wealth that others are supposedly making, a common emotional manipulation tactic."
    },
    "TI-05": {
        "code": "TI-05",
        "name": "False Authority / Celebrity Endorsement",
        "severity": "HIGH",
        "weight": 15,
        "regex": r"(?i)\b(endorsed\s+by|backed\s+by|partnered\s+with|wall\s+street\s+insider|elon\s+musk\s+approved|licensed\s+by\s+sec|certified\s+trader)\b",
        "explanation": "This content claims affiliation with prominent figures or institutions. Fabricated endorsements are frequently used to establish unearned trust."
    },
    "TI-06": {
        "code": "TI-06",
        "name": "Payment / Crypto Solicitation",
        "severity": "CRITICAL",
        "weight": 25,
        "regex": r"(?i)\b(send|deposit|transfer|pay)\s+(\True\d+|0\.\d+|\d+)\s*(usdt|btc|eth|crypto|wallet|to\s+activate)\b",
        "explanation": "This content requests direct transfers of money or cryptocurrency to activate an account. This is the primary operational pattern in online investment scams."
    },
    "TI-07": {
        "code": "TI-07",
        "name": "Private Channel Redirection",
        "severity": "MEDIUM",
        "weight": 8,
        "regex": r"(?i)\b(join\s+(our\s+)?(private|vip|exclusive)?\s*(telegram|whatsapp|signal)\s*(group|channel)?|dm\s+for\s+signals?|t\.me\/[a-zA-Z0-9_]+)\b",
        "explanation": "This content attempts to move investment discussions off public platforms into private messaging groups, eliminating transparency."
    },
    "TI-08": {
        "code": "TI-08",
        "name": "Testimonial / Social Proof Claim",
        "severity": "LOW",
        "weight": 3,
        "regex": r"(?i)\b(\d{2,}\+?\s*members?\s+(profiting|joined)|millions?\s+withdrawn|real\s+testimonials?|proof\s+of\s+withdrawal)\b",
        "explanation": "This content cites unverifiable withdrawal proofs and member counts to fabricate an impression of legitimacy."
    },
    "TI-09": {
        "code": "TI-09",
        "name": "Unregistered Investment Solicitation",
        "severity": "MEDIUM",
        "weight": 8,
        "regex": r"(?i)\b(invest\s+(with\s+us|now)|trading\s+opportunity|start\s+earning\s+today)\b",
        "explanation": "This content solicits investment participation while omitting mandatory regulatory risk disclosures."
    }
}
`

---

## 16. NLP Classifier Architecture & Abstraction

### 16.1 Abstract ScamClassifier Base Class
All ML classifiers implement this abstract interface, ensuring zero tight coupling:

`python
from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple

class ScamClassifier(ABC):
    @property
    @abstractmethod
    def model_version(self) -> str:
        """Returns the semantic model version string."""
        pass

    @abstractmethod
    def predict_proba(self, text: str) -> float:
        """
        Returns the probability (0.0 to 1.0) that the text is scam/suspicious.
        """
        pass

    @abstractmethod
    def get_top_features(self, text: str, top_n: int = 5) -> Dict[str, float]:
        """
        Returns the top contributing feature tokens and their weights.
        """
        pass
`

### 16.2 Baseline TF-IDF + Logistic Regression Implementation
- **Vectorization:** TfidfVectorizer(ngram_range=(1, 2), max_features=5000, sublinear_tf=True).
- **Estimator:** LogisticRegression(C=1.0, class_weight='balanced', max_iter=1000).
- **Fallback Policy:** If model weights cannot be loaded or inference raises an exception, the system automatically logs a warning and falls back to deterministic rule scoring without interrupting API execution.

---

## 17. Model Versioning & Metadata Pipeline

Every scan record explicitly saves audit metadata:
- nalysis_version: Codebase pipeline version (e.g. phase-2-text-v1).
- model_version: Exact active classifier artifact version (e.g. aseline-tfidf-logreg-v1 or ules-only-v1).
- inference_latency_ms: Duration of analysis in milliseconds.

---

## 18. URL Analysis Engine & Structural Parser

### 18.1 Operational Boundary
The URL Analysis Engine parses URLs using deterministic syntactic and lexical algorithms. In strict accordance with Non-Goals (NG-05, NG-08), **NO outbound network requests, DNS lookups, or web page scraping are executed during the MVP phase.**

`	ext
Raw URL String
       │
       ▼
[ 1. Protocol & Syntax Validation ] ──> Rejects non-HTTP/HTTPS (422)
       │
       ▼
[ 2. URL Normalization & Parser ] ────> Decomposes scheme, host, port, path, query, fragment
       │
       ▼
[ 3. Lexical Signal Extractor ] ──────> Evaluates signals UI-01 to UI-10
       │
       ▼
[ 4. URL Scorer & Aggregator ] ───────> Computes URL sub-score (0 - 100) + signals list
`

---

## 19. URL Feature Extraction & Signals (UI-01 to UI-10)

| Signal Code | Signal Name | Severity | Weight | Technical Extraction Rule |
|---|---|---|---|---|
| **UI-01** | Unencrypted HTTP Protocol | LOW | 3 pts | parsed_url.scheme.lower() == 'http' |
| **UI-02** | IP Address as Hostname | MEDIUM | 8 pts | e.match(r'^\d{1,3}(\.\d{1,3}){3}$', hostname) is not None |
| **UI-03** | Suspicious Financial Terms in URL | MEDIUM | 8 pts | Path or query contains keywords: ['invest', 'profit', 'bonus', 'trade', 'crypto', 'wealth', 'wallet', 'vip', 'forex', 'withdraw'] |
| **UI-04** | Excessive URL Length | LOW | 3 pts | len(raw_url) > 150 characters |
| **UI-05** | Excessive Subdomain Nesting | LOW | 3 pts | len(hostname.split('.')) > 4 (e.g. ip.secure.login.crypto.invest.com) |
| **UI-06** | High-Abuse TLD Extension | LOW | 3 pts | TLD in abuse watchlist: ['.top', '.xyz', '.buzz', '.monster', '.icu', '.click', '.tk', '.fit', '.cfd'] |
| **UI-07** | Shortener Domain Match | MEDIUM | 8 pts | Hostname matches known shorteners: ['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'cutt.ly', 'rb.gy'] |
| **UI-08** | Predominantly Numeric Domain | LOW | 3 pts | Hostname contains > 60% numeric digit characters |
| **UI-09** | Special Characters / Hyphenation | LOW | 3 pts | Hostname contains >= 3 hyphens or underscores (e.g. ast-crypto-trading-profit.com) |
| **UI-10** | Excessive Query Parameters | LOW | 3 pts | len(urllib.parse.parse_qs(parsed_url.query)) > 5 |

---

## 20. URL Security & Comprehensive SSRF Defense

### 20.1 Protocol Allowlist
Only http:// and https:// schemes are accepted. All dangerous schemes (javascript:, data:, ile:, tp:, gopher:, php:) are rejected immediately during Pydantic schema validation with HTTP 422 Unprocessable Entity.

### 20.2 SSRF Defense Architecture (For Future Threat Intel Integration)
If external URL verification is enabled in Phase 5, all outgoing HTTP calls MUST pass through a dedicated SecureURLFetcher module enforcing:
1. **Pre-Request DNS Resolution:** Resolve hostname before connection; compare IP against RFC 1918 private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8, 169.254.0.0/16).
2. **Cloud Metadata IP Blocking:** Explicit hardcoded block for 169.254.169.254 (AWS/GCP/Azure instance metadata service).
3. **Redirect Limits:** Maximum 3 redirects; each target URL is recursively validated against the IP blacklist before following.
4. **Timeouts & Response Capping:** Connection timeout 3.0s, read timeout 5.0s, max body read capped at 1MB.


---

## 21. Risk Engine Math & Scoring Algorithms

**[TECHNICAL SCORING FORMULATION]**

### 21.1 Sub-Score Normalization Formula
Each detected indicator $ contributes its severity weight (i) \in \{3, 8, 15, 25\}$.
The raw accumulated score {\text{raw}}$ is the sum of unique matched indicator weights:
S_{\text{raw}} = \sum_{i \in I_{\text{detected}}} w(i)

The normalized sub-score {\text{sub}} \in [0, 100]$ is computed as:
S_{\text{sub}} = \min\left(100, \text{round}\left(\frac{S_{\text{raw}}}{W_{\text{baseline\_max}}} \times 100\right)\right)

Where {\text{baseline\_max}}$ is configuration-driven:
- **Text Baseline Max:** {T,\text{max}} = 60$ points.
- **URL Baseline Max:** {U,\text{max}} = 30$ points.

### 21.2 Configurable Risk Tier Mapping

| Score Range | Risk Level Tier | Color Indicator Token | Behavioral Meaning |
|---|---|---|---|
| **0 – 24** | LOW | emerald-500 | No significant suspicious promotional patterns detected. |
| **25 – 49** | MEDIUM | mber-500 | Moderate promotional or urgency signals detected; warrants independent verification. |
| **50 – 74** | HIGH | orange-500 | Multiple high-severity indicators present (e.g. guaranteed profit, fake authority). |
| **75 – 100** | CRITICAL | ose-600 | Dangerous scam signature present (e.g. direct crypto payment solicitation). |

---

## 22. Combined Risk Engine & Scoring Fusion

### 22.1 Weighted Linear Fusion
When both text and URL are provided (nalysis_type == 'combined'), the preliminary combined score is:
S_{\text{preliminary}} = \text{round}\left(S_{\text{text}} \cdot \alpha + S_{\text{url}} \cdot \beta\right)
Where default calibrated weights are:
\alpha = 0.60 \quad (\text{Text Weight}), \quad \beta = 0.40 \quad (\text{URL Weight}), \quad \alpha + \beta = 1.0

### 22.2 Critical Score Ceiling Governor (Non-Dilution Override)
To prevent a clean URL from diluting a blatantly fraudulent text message (or vice-versa), the risk engine enforces a non-linear ceiling governor:
\text{If } \max(S_{\text{text}}, S_{\text{url}}) \ge 75 \text{ (CRITICAL)}, \quad \text{then } S_{\text{combined}} = \max\left(S_{\text{preliminary}}, 75\right)
\text{If } \max(S_{\text{text}}, S_{\text{url}}) \ge 50 \text{ (HIGH)}, \quad \text{then } S_{\text{combined}} = \max\left(S_{\text{preliminary}}, 50\right)

---

## 23. Explainability Engine & Dynamic Synthesis

### 23.1 The 5-Questions Explainability Framework
Every scan result answers 5 structured user questions without relying on opaque, ungrounded generative outputs:

`	ext
+-------------------------------------------------------------------------------+
| 1. WHAT WAS DETECTED?    -> Indicator Code & Name (e.g., TI-01: Guaranteed Return)
| 2. WHY WAS IT FLAGGED?   -> Contextual reason why this signal is risky in finance
| 3. WHAT IS THE EVIDENCE? -> Exact verbatim snippet extracted from submitted input
| 4. HOW SERIOUS IS IT?    -> Severity level (LOW / MEDIUM / HIGH / CRITICAL)
| 5. WHAT SHOULD I DO?     -> Actionable, defensive, non-alarmist safety guidance
+-------------------------------------------------------------------------------+
`

### 23.2 Summary Synthesis Strategy
The plain-English summary is deterministically constructed by evaluating the detected indicator cluster:
1. **Critical Payment Cluster:** Flags direct deposit / cryptocurrency transfer hazards.
2. **High Guarantee Cluster:** Explains why promises of fixed/guaranteed returns violate financial market realities.
3. **Medium Urgency Cluster:** Explains psychological pressure and private channel redirection.
4. **Clean / Low Signal Cluster:** States that no overt red flags were matched while reiterating standard due diligence.

---

## 24. Recommendation Engine & Safety Rules

Recommendations are generated from the detected risk profile:

`python
def generate_recommendations(risk_level: str, indicator_codes: List[str]) -> List[str]:
    advice = []
    if risk_level == "CRITICAL" or "TI-06" in indicator_codes:
        advice.append("Do NOT send money, cryptocurrency (USDT/BTC), or deposit funds under any circumstances.")
        advice.append("Report the message/account immediately to the platform administrators and cybercrime authorities.")
    elif risk_level == "HIGH":
        advice.append("Do NOT commit capital or register on unverified trading portals based on social media tips.")
        advice.append("Independently verify if the provider is registered with official national regulators (e.g., SEC, FCA, SEBI).")
    elif risk_level == "MEDIUM":
        advice.append("Exercise caution regarding claims of rapid wealth; independently research the organization.")
        advice.append("Avoid joining private unmoderated Telegram or WhatsApp groups for financial advice.")
    else:
        advice.append("Continue to verify any investment opportunity through official regulated registries before investing.")
    return advice
`

---

## 25. Analysis Orchestrator & Execution Pipeline

The AnalysisOrchestrator coordinates the workflow:

`	ext
Scan Submission Request
         │
         ▼
[ 1. Input Validation & Dispatcher ] ─── (Determines text, url, or combined mode)
         │
         ├───► [ Text Analyzer ] ───────> Returns Text Sub-Score & Indicators (TI-01..09)
         │
         └───► [ URL Analyzer ] ────────> Returns URL Sub-Score & Signals (UI-01..10)
         │
         ▼
[ 2. Risk Engine Aggregator ] ──────────> Applies fusion math & ceiling governor
         │
         ▼
[ 3. Explainability Engine ] ───────────> Generates verbatim evidence & summary
         │
         ▼
[ 4. Recommendation Engine ] ───────────> Selects safety guidelines
         │
         ▼
[ 5. Persistence via ScanRepository ] ──> Stores record in MongoDB scans collection
         │
         ▼
Structured Scan Response (201 Created)
`

---

## 26. Synchronous vs. Asynchronous Strategy

- **Hackathon MVP (Current):** **Synchronous Processing.** Text and URL lexical analysis execute in < 200ms, well within standard HTTP request-response cycles. No message queue or background worker overhead is required.
- **Future Phase 4–5 (Post-Hackathon):** **Asynchronous Processing via Redis + Celery/ARQ.** When heavy OCR image processing or external threat intelligence network lookups are introduced, scans will return 202 Accepted with a scan_id for client polling or WebSocket push updates.

---

## 27. Standardized Error Handling Architecture

### 27.1 Error Envelope & Standardized Error Codes

`json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The input text must be between 10 and 5,000 characters.",
    "details": [
      {
        "field": "text",
        "issue": "String should have at least 10 characters"
      }
    ]
  },
  "metadata": { "timestamp": "2026-08-20T19:30:00Z" }
}
`

| HTTP Status | Error Code | Technical Description | User Message |
|---|---|---|---|
| 400 | VALIDATION_ERROR | Request payload failed Pydantic schema validation. | "Please check your input values and try again." |
| 401 | AUTHENTICATION_ERROR | Missing, invalid, or expired JWT bearer token. | "Your session has expired. Please log in again." |
| 403 | AUTHORIZATION_ERROR | Attempted access to a resource owned by another user. | "You do not have permission to access this resource." |
| 404 | SCAN_NOT_FOUND | Scan ID does not exist in database. | "The requested scan could not be found." |
| 409 | EMAIL_ALREADY_EXISTS | Registration with an already registered email. | "An account with this email address already exists." |
| 422 | URL_INVALID_PROTOCOL | Submitted URL uses non-HTTP/HTTPS protocol. | "Only HTTP and HTTPS URLs are supported." |
| 429 | RATE_LIMIT_EXCEEDED | Client exceeded IP or user rate limit window. | "Too many requests. Please wait a moment before trying again." |
| 500 | INTERNAL_SERVER_ERROR | Unhandled server exception. Stack traces strictly suppressed. | "An unexpected error occurred. Please try again later." |

---

## 28. Security Architecture & Threat Mitigation

### 28.1 Backend Security Controls
1. **Password Hashing:** Bcrypt algorithm with cost factor 12. Plaintext passwords never stored or returned.
2. **JWT Security:** HS256 algorithm with 256-bit entropy secret; 1-hour expiration; claims validated per request.
3. **CORS Policy:** Strict origin allowlist (CORS_ALLOWED_ORIGINS). Wildcard * rejected in production.
4. **Security Headers:** FastAPI middleware injects:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Content-Security-Policy: default-src 'self'
   - Strict-Transport-Security: max-age=31536000; includeSubDomains


---

## 29. Frontend Security Architecture

1. **XSS Prevention:** React JSX automatically HTML-encodes all dynamic values. No dangerouslySetInnerHTML is used anywhere in the codebase.
2. **Safe Link Handling:** Any external link rendered includes el="noopener noreferrer" and 	arget="_blank".
3. **Token Storage:** Tokens are stored in browser memory with fallback to localStorage for prototype sessions, cleared immediately upon receiving a 401 Unauthorized response.

---

## 30. API Security Architecture

1. **Request Size Limits:** Maximum request payload size strictly capped at 100KB to prevent memory exhaustion / DoS.
2. **Rate Limiting:** In-memory sliding window rate limiter:
   - /auth/login: 10 req/min per IP
   - /auth/register: 5 req/min per IP
   - /scans (POST): 20 req/min per user
3. **Database Parameterization:** Motor queries use typed Python dictionary filters; no dynamic string query construction.

---

## 31. AI Security & Defense Against Prompt Injection

1. **Deterministic Rule Supremacy:** Heuristic pattern matching and mathematical fusion take precedence. External prompt-based inputs cannot override deterministic security indicators.
2. **Input Sanitization:** Control characters and zero-width spaces are stripped before analysis to defeat adversarial evasion techniques.
3. **Grounded Explanations:** Explanations are composed exclusively from verified indicator code mappings, completely preventing hallucinated rationales.

---

## 32. Environment Configuration & Secrets Management

All configuration is loaded via Pydantic BaseSettings from environment variables. No secrets are committed to git.

### Proposed .env.example Template
`ash
# ==============================================================================
# ScamShield AI - Environment Configuration Template
# ==============================================================================

# Application Environment
ENVIRONMENT=development
LOG_LEVEL=INFO
APP_PORT=8000
APP_HOST=0.0.0.0

# Security & Authentication
JWT_SECRET_KEY=CHANGE_THIS_TO_A_SECURE_RANDOM_256BIT_SECRET_IN_PRODUCTION
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

# Database Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=scamshield_db

# CORS Configuration (Comma-separated allowed frontend origins)
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Scoring & Risk Calibration
TEXT_WEIGHT=0.60
URL_WEIGHT=0.40
RISK_THRESHOLD_LOW=24
RISK_THRESHOLD_MEDIUM=49
RISK_THRESHOLD_HIGH=74
MODEL_CONFIDENCE_THRESHOLD=0.50

# Rate Limiting Parameters
RATE_LIMIT_LOGIN=10
RATE_LIMIT_REGISTER=5
RATE_LIMIT_SCAN=20
`

---

## 33. Structured Logging Architecture

Backend logs are structured in JSON format:
`json
{
  "timestamp": "2026-08-20T19:30:05.123Z",
  "level": "INFO",
  "request_id": "req-98f3b6c2",
  "user_id": "usr_9b1deb4d3b7d4e8b",
  "endpoint": "POST /api/v1/scans",
  "status_code": 201,
  "duration_ms": 142.5,
  "analysis_type": "combined",
  "risk_level": "CRITICAL",
  "indicators_matched": ["TI-01", "TI-06", "UI-01", "UI-03"]
}
`

> **Privacy Rule for Logs:** Plaintext passwords, JWT tokens, and user personal text submissions are NEVER written to log outputs.

---

## 34. Observability, Metrics & Health Checks

- **Liveness & Readiness Probe:** GET /api/v1/health verifies:
  1. API server responsiveness.
  2. MongoDB connection ping.
  3. AI model loaded status.
- **Latency Monitoring:** Tracks p50, p95, and p99 latencies for scan endpoints.

---

## 35. Comprehensive Testing Architecture

### 35.1 Testing Matrix

`	ext
+-------------------------------------------------------------------------------+
| TEST LEVEL      | TOOL / RUNNER       | SCOPE / COVERAGE TARGET               |
+-----------------+---------------------+---------------------------------------+
| Unit Tests      | Pytest              | Indicator regexes, URL parser, Math   |
| Integration     | Pytest + HTTPX      | Full API endpoints, DB repo, Auth     |
| Component Tests | Vitest + RTL        | React UI components, Scanner, Badges  |
| Security Tests  | Pytest Security     | SSRF payload rejection, XSS, Rate lim |
| Golden Dataset  | Pytest AI Benchmark | Precision/Recall against test corpus  |
+-------------------------------------------------------------------------------+
`

### 35.2 Sample Automated Test Scenarios

| Test Case ID | Test Target | Input Payload | Expected Output |
|---|---|---|---|
| TC-AI-01 | Text TI-01 (Guaranteed Return) | "Guaranteed 200% monthly profit on our platform" | TI-01 matched, severity HIGH, score contribution >= 15 |
| TC-AI-02 | Text TI-06 (Payment Request) | "Send 0.5 BTC to this wallet to begin trading" | TI-06 matched, severity CRITICAL, overall risk CRITICAL |
| TC-URL-01| URL UI-02 (IP Hostname) | "http://192.168.1.100/trading/login" | UI-02 matched, severity MEDIUM |
| TC-URL-02| Dangerous Scheme Rejection | "javascript:alert(1)" | HTTP 422 Unprocessable Entity |
| TC-SEC-01| Horizontal Access Prevention | User B requesting GET /scans/{scan_id_owned_by_User_A} | HTTP 403 Forbidden / 404 Not Found |
| TC-SEC-02| Rate Limiter Enforcement | 15 rapid POST requests to /auth/login | First 10 succeed/fail with 401; 11th returns 429 |

---

## 36. AI Model Evaluation Methodology

1. **Ground Truth Corpus:** Balanced evaluation dataset labeled with suspicious and 
ot_suspicious.
2. **Metrics Evaluated:** Precision, Recall, F1 Score, Confusion Matrix, False Positive Rate (FPR), False Negative Rate (FNR).
3. **Anti-Hallucination Policy:** No fictional accuracy percentages (e.g. "99.9% accurate") are stated in documentation or UI. All metrics are derived from executed test benchmarks.

---

## 37. Performance Targets & Benchmark Architecture

> **Note:** All figures represent engineering **TARGETS**, not absolute guarantees.

| Metric | Proposed Target | Category |
|---|---|---|
| **Landing Page Load (FCP)** | < 1.5 seconds on broadband | TARGET |
| **API Health Check Latency** | < 50 milliseconds | TARGET |
| **Auth API Latency (Bcrypt)** | < 300 milliseconds | TARGET |
| **Text Analysis Latency** | < 200 milliseconds (Synchronous) | TARGET |
| **URL Analysis Latency** | < 100 milliseconds (Synchronous) | TARGET |
| **Combined Scan Latency** | < 300 milliseconds (Synchronous) | TARGET |
| **History Query Latency** | < 150 milliseconds (Indexed) | TARGET |
| **Frontend Production Bundle** | < 500 KB gzipped | TARGET |

---

## 38. Scalability Architecture & Growth Path

- **Horizontal API Scaling:** FastAPI backend is 100% stateless (session state contained in JWT). Multiple Uvicorn instances can run behind an Nginx or cloud load balancer.
- **Database Scaling:** MongoDB Atlas replica sets with read preference routing for history queries if load increases.
- **Model Decoupling:** AI engine can be isolated into a dedicated microservice container in future production phases without frontend refactoring.

---

## 39. Deployment Architecture & Infrastructure

**[PROPOSED HOSTING OPTIONS]**

| Component | Development Environment | Proposed Production Environment |
|---|---|---|
| **Frontend** | Local Vite Dev Server (localhost:5173) | Vercel / Cloudflare Pages / Netlify |
| **Backend API** | Local Uvicorn ASGI (localhost:8000) | Railway / Render / Google Cloud Run |
| **Database** | Local MongoDB / MongoDB Atlas Dev Cluster | MongoDB Atlas Dedicated / Serverless |
| **TLS / SSL** | Self-signed / HTTP for local dev | Automated Let's Encrypt / Cloudflare HTTPS |

---

## 40. CI/CD Automation Pipeline

`	ext
[ Git Push / PR to Main ]
           │
           ▼
[ 1. LINT & TYPECHECK ] ──────> ESLint + TypeScript 	sc --noEmit, Python lake8
           │
           ▼
[ 2. UNIT & INTEGRATION ] ────> Backend Pytest suite, Frontend Vitest component tests
           │
           ▼
[ 3. SECURITY SCAN ] ─────────> andit (Python security audit), 
pm audit
           │
           ▼
[ 4. DOCKER BUILD & DEPLOY ] ─> Builds frontend static bundle & backend container image
`


---

## 41. Data Flow Diagrams (Mermaid)

### 41.1 Authentication & Scan Data Flow

`mermaid
graph TD
    Client[React Client] -->|1. POST /auth/login| Gateway[FastAPI Router]
    Gateway -->|2. Verify Credentials| AuthServ[Auth Service]
    AuthServ -->|3. Query User| MongoUsers[(MongoDB: users)]
    MongoUsers -->|4. User Doc| AuthServ
    AuthServ -->|5. Return JWT| Client

    Client -->|6. POST /scans + JWT| Gateway
    Gateway -->|7. Authorize & Validate| ScanServ[Scan Service]
    ScanServ -->|8. Raw Text & URL| Orchestrator[Analysis Orchestrator]
    
    Orchestrator -->|9a. Text Signals| TextEngine[Text Analyzer]
    Orchestrator -->|9b. URL Signals| URLEngine[URL Analyzer]
    
    TextEngine -->|10a. Indicators TI-01..09| RiskEngine[Risk Engine]
    URLEngine -->|10b. Signals UI-01..10| RiskEngine
    
    RiskEngine -->|11. Sub-scores & Risk Tier| Explainer[Explainability Engine]
    Explainer -->|12. Summary & Evidence| Recommender[Recommendation Engine]
    Recommender -->|13. Result Package| ScanServ
    
    ScanServ -->|14. Persist Scan Doc| MongoScans[(MongoDB: scans)]
    MongoScans -->|15. Acknowledge| ScanServ
    ScanServ -->|16. JSON 201 Response| Client
`

---

## 42. Sequence Diagrams (Mermaid)

### 42.1 User Login Sequence

`mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React Frontend
    participant API as FastAPI Router
    participant Auth as Auth Service
    participant DB as MongoDB (users)

    User->>Frontend: Enters Email & Password
    Frontend->>API: POST /api/v1/auth/login
    API->>Auth: authenticate_user(email, password)
    Auth->>DB: find_one({"email": email})
    DB-->>Auth: User Document (password_hash)
    Auth->>Auth: bcrypt.verify(password, password_hash)
    Auth->>Auth: create_access_token(user_id)
    Auth-->>API: JWT Token + User Info
    API-->>Frontend: 200 OK { access_token, user }
    Frontend->>Frontend: Save token in memory/storage
    Frontend-->>User: Redirect to /dashboard
`

### 42.2 Combined Scan Analysis Sequence

`mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React Frontend
    participant API as FastAPI Router
    participant Orchestrator as Analysis Orchestrator
    participant TextAnalyzer as Text Analyzer
    participant URLAnalyzer as URL Analyzer
    participant RiskEngine as Risk Engine
    participant DB as MongoDB (scans)

    User->>Frontend: Submits Text & URL
    Frontend->>API: POST /api/v1/scans (Bearer JWT)
    API->>API: Validate Token & Pydantic Schema
    API->>Orchestrator: execute_scan(text, url, user_id)
    
    par Parallel Signal Extraction
        Orchestrator->>TextAnalyzer: extract_text_indicators(text)
        TextAnalyzer-->>Orchestrator: Indicators (TI-01..09) + Sub-Score
    and
        Orchestrator->>URLAnalyzer: extract_url_signals(url)
        URLAnalyzer-->>Orchestrator: Signals (UI-01..10) + Sub-Score
    end

    Orchestrator->>RiskEngine: calculate_combined_risk(text_score, url_score, indicators)
    RiskEngine-->>Orchestrator: Final Score (0-100), Tier, Summary, Advice
    Orchestrator->>DB: insert_one(scan_document)
    DB-->>Orchestrator: Acknowledged (scan_id)
    Orchestrator-->>API: Full Scan Result Object
    API-->>Frontend: 201 Created { scan_id, score, indicators, explanation }
    Frontend-->>User: Displays Explainability Dashboard
`

---

## 43. Threat Model & Risk Matrix

| Threat Category | Attack Vector / Surface | Impact | Technical Mitigation in TRD |
|---|---|---|---|
| **Account Takeover** | Credential brute-forcing on /auth/login | Unauthorized user profile & scan history access | Bcrypt hashing (rounds=12), strict rate limiting (10 req/min per IP), generic 401 error message. |
| **Data Breach / Leak** | Horizontal privilege escalation on /scans/{scan_id} | Leakage of another user's submitted scans | Server-side user ownership enforcement on all MongoDB queries (user_id == current_user.user_id). |
| **SSRF (Server-Side Request Forgery)** | Malicious URLs submitted pointing to 169.254.169.254 or internal IP | Compromise of cloud instance credentials | Zero outbound HTTP requests in MVP; strict protocol allowlist (http/https); pre-request DNS validation in Phase 5. |
| **XSS (Cross-Site Scripting)** | Malicious HTML / JS embedded in submitted scam text | Execution of malicious scripts in reviewer browser | React automatic JSX string escaping; zero use of dangerouslySetInnerHTML. |
| **Denial of Service (DoS)** | Giant text payloads / ReDoS payloads | CPU exhaustion / API thread locking | Hard payload length caps (5,000 chars for text, 2,048 chars for URL); atomic regex patterns without nested quantifiers. |
| **Model Evasion** | Zero-width unicode spaces, homoglyphs | Evasion of keyword patterns | Text normalization & unicode NFKC normalization during preprocessing. |

---

## 44. Traceability Matrix (PRD to TRD)

| PRD Req ID | PRD Requirement Description | TRD Architectural Component | Technical Implementation File |
|---|---|---|---|
| **OFF-01** | AI-Powered Web Application | Full-stack FastAPI + React SPA | ackend/app/main.py, rontend/src/App.tsx |
| **OFF-02** | Identify Suspicious Investment Scams | Text & URL Indicator Engines | ackend/app/services/analysis/text_analyzer.py |
| **OFF-05** | Explainable Risk Assessment | 5-Questions Explainability Generator | ackend/app/services/analysis/explainer.py |
| **OFF-06** | Not Just "Scam / Not Scam" | 0–100 Normalized Risk Scoring Engine | ackend/app/services/analysis/risk_engine.py |
| **FR-01..03**| User Registration, Login, JWT Auth | PyJWT + Passlib Bcrypt Module | ackend/app/core/security.py, ackend/app/api/v1/endpoints/auth.py |
| **FR-04..05**| Text Scanning & Indicator Extraction | Heuristic Pattern Matcher (TI-01..09) | ackend/app/services/analysis/text_analyzer.py |
| **FR-11..12**| URL Signal Extraction (UI-01..10) | Syntactic & Lexical URL Parser | ackend/app/services/analysis/url_analyzer.py |
| **FR-13** | Combined Text + URL Analysis | Linear Fusion Math + Ceiling Governor | ackend/app/services/analysis/risk_engine.py |
| **FR-14..16**| Scan History & Dashboard Statistics | MongoDB Repository with Ownership Index | ackend/app/db/repositories/scan_repo.py |
| **NFR-01..08**| Security, Validation, SSRF Protections| Pydantic Schemas, CORS & Rate Limiter | ackend/app/schemas/, ackend/app/utils/sanitizers.py |

---

## 45. Technical Acceptance Criteria

- [ ] **Auth Pipeline:** Registration hashes passwords with Bcrypt; Login generates RFC 7519 JWT tokens with 1-hour expiry.
- [ ] **Protected Routes:** Unauthorized requests to protected endpoints return 401 Unauthorized.
- [ ] **Ownership Enforcement:** Attempting to retrieve or delete another user's scan returns 403 Forbidden / 404 Not Found.
- [ ] **Text Engine:** Correctly matches all 9 indicators (TI-01 to TI-09) on representative test payloads.
- [ ] **URL Engine:** Correctly extracts all 10 signals (UI-01 to UI-10); rejects non-HTTP/HTTPS schemes with 422.
- [ ] **Zero Outbound Execution:** URL analysis performs zero outbound network calls during MVP.
- [ ] **Scoring Engine:** Returns normalized score in range 0–100 matching defined risk tiers (LOW/MED/HIGH/CRITICAL).
- [ ] **Ceiling Governor:** Critical signals (score >= 75) maintain critical floor in combined analysis.
- [ ] **Explainability:** Output includes verbatim evidence snippets and plain-English reasoning for all matched indicators.
- [ ] **Database Integrity:** Scans and users are persisted in MongoDB with verified compound indexing.
- [ ] **Responsive Frontend:** UI operates seamlessly across desktop (>=1280px) and mobile (320px) viewports.
- [ ] **Accessibility (a11y):** Risk levels communicated via text and icons (not color alone); WCAG 2.1 AA contrast verified.
- [ ] **Automated Tests:** Backend Pytest and Frontend Vitest suites execute and pass.

---

## 46. Phased Technical Roadmap

### Phase 1: Core Foundation (Auth, DB, Base Layout)
- MongoDB connection and user repository implementation.
- Bcrypt password hashing & JWT authentication middleware.
- React frontend shell, router, auth context, and responsive navigation layout.

### Phase 2: Text AI & NLP Engine
- Text indicator pattern matcher (TI-01 to TI-09) and evidence extractor.
- Abstract ScamClassifier interface and baseline TF-IDF model.
- Risk engine scoring math, explainability generator, and recommendation engine.
- Scan persistence repository and /api/v1/scans endpoint.

### Phase 3: URL & Combined Analysis Engine
- URL parser and lexical signal extractor (UI-01 to UI-10).
- Combined linear fusion math and ceiling governor.
- Frontend Scanner interface supporting Text, URL, and Combined modes.
- Full results dashboard, history table, and user dashboard statistics.

### Phase 4: Image / Screenshot Analysis + OCR (Future)
- Secure file upload endpoint with MIME-type and size validation.
- OCR text extraction (Tesseract / Vision API) feeding into text pipeline.

### Phase 5: Threat Intelligence & SSRF-Hardened Proxy (Future)
- External reputation lookups (VirusTotal, WHOIS) via isolated SecureURLFetcher.
- 24-hour domain reputation caching in MongoDB.

### Phase 6: Production Hardening & CI/CD (Future)
- Transformer classifier (DistilBERT) integration.
- Automated CI/CD deployment pipelines, containerization, and monitoring alerts.

---

## 47. Open Technical Questions

| ID | Open Technical Question | Architectural Impact | Proposed Direction |
|---|---|---|---|
| **OTQ-01** | Final ML Classifier choice for hackathon demo? | Model loading latency vs. precision | Start with Deterministic Heuristics + TF-IDF Logistic Regression baseline. |
| **OTQ-02** | Training dataset source for TF-IDF? | Legal license & classification accuracy | Use curated synthetic financial scam corpus with clear open licenses. |
| **OTQ-03** | Scan retention & deletion policy? | Database storage costs & privacy | User-initiated soft/hard delete supported; retention policy configurable. |
| **OTQ-04** | Cloud hosting platform for backend demo? | Deployment simplicity & cold starts | Container deployment on Render or Google Cloud Run. |
| **OTQ-05** | Production JWT storage mechanism? | XSS vs. CSRF vulnerability tradeoffs | In-memory token with httpOnly cookie fallback in production hardening. |

---

## 48. Technical Risk Register & Mitigations

| Risk | Impact | Prob. | Technical Mitigation in TRD | Owner |
|---|---|---|---|---|
| **Heuristic False Positives** | High | Med | Calibrate regex patterns to require investment solicitation context; apply non-alarmist hedging language in explanations. | AI Lead |
| **API Latency Spikes** | Med | Low | Keep MVP analysis synchronous and in-memory (<200ms); index all MongoDB history queries. | Backend Lead |
| **Adversarial Obfuscation** | Med | Med | Unicode NFKC normalization, whitespace collapse, and zero-width character stripping during preprocessing. | Security Lead |
| **Database Connection Drops** | High | Low | Implement async connection pooling with auto-reconnect in Motor driver. | Backend Lead |
| **SSRF Vulnerabilities** | Crit | Low | Zero outbound HTTP calls in MVP; strict URL scheme validation (http/https only). | Security Lead |

---

## 49. TRD Quality Verification

- [x] TRD directly translates and complies with docs/PRD.md.
- [x] Official Problem Statement CS-2 mandates are fully preserved.
- [x] Proposed technical stack and architectural patterns are explicitly marked **[PROPOSED]**.
- [x] Complete REST API schemas and JSON contracts are specified without ambiguity.
- [x] AI/NLP abstraction is decoupled from UI and persistence logic.
- [x] URL security and SSRF protection boundaries are strictly documented.
- [x] Zero application source code has been created or run.

---

*End of ScamShield AI Technical Requirements Document (TRD)*  
*Version 1.0.0 — Created 2026-08-20*  
*This document serves as the Technical Blueprint for all subsequent development phases.*
