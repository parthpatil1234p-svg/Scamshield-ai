# ScamShield AI — Architecture Decision Records (ADRs)

**Version:** 1.0.0  
**Status:** APPROVED / IN REVIEW  
**Project:** ScamShield AI  
**Problem Statement Code:** CS-2  
**Parent Documents:** [docs/PRD.md](./PRD.md), [docs/TRD.md](./TRD.md)

---

## Table of Decision Records

- [ADR-001: Technology Stack Selection (React + TypeScript, FastAPI, MongoDB)](#adr-001-technology-stack-selection)
- [ADR-002: Stateless JWT Authentication with Bcrypt Password Hashing](#adr-002-stateless-jwt-authentication-with-bcrypt)
- [ADR-003: Modular AI Architecture with Abstract ScamClassifier Base Class](#adr-003-modular-ai-architecture-with-abstract-scamclassifier)
- [ADR-004: Pure Lexical URL Analysis with Zero Outbound HTTP Execution in MVP](#adr-004-pure-lexical-url-analysis-with-zero-outbound-http)
- [ADR-005: Weighted Fusion Risk Engine with Critical Score Ceiling Override](#adr-005-weighted-fusion-risk-engine-with-ceiling-override)
- [ADR-006: Deterministic 5-Questions Explainability Engine](#adr-006-deterministic-5-questions-explainability-engine)
- [ADR-007: Synchronous Request-Response Pipeline for MVP with Async Future Path](#adr-007-synchronous-pipeline-for-mvp-with-async-future-path)
- [ADR-008: Strict Server-Side User Ownership Enforcement on All Scan Access](#adr-008-strict-server-side-user-ownership-enforcement)
- [ADR-009: Multi-Layered SSRF Defense Architecture for Future Outbound Integrations](#adr-009-multi-layered-ssrf-defense-architecture)

---

### ADR-001: Technology Stack Selection

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** ScamShield AI requires a responsive, high-performance web interface paired with a fast, type-safe API backend capable of executing NLP analysis and persisting unstructured/polymorphic scan results.
- **Decision:** 
  - Frontend: **React 18+ (TypeScript)** + **Vite** + **Tailwind CSS**.
  - Backend: **Python 3.11+** + **FastAPI** + **Pydantic v2** + **Uvicorn**.
  - Database: **MongoDB (Motor Async Driver)**.
- **Alternatives Considered:**
  1. *Next.js (Full Stack Node.js):* Good for SSR, but Python provides superior native NLP/ML ecosystem (scikit-learn, PyTorch, NLTK).
  2. *Django / Flask:* Slower than FastAPI, lacks native async I/O and automatic OpenAPI documentation.
  3. *PostgreSQL / Relational DB:* Feasible, but MongoDB's document model naturally accommodates variable indicator counts, sub-scores, and metadata without complex JSONB/relational join overhead.
- **Trade-offs:** MongoDB requires careful application-level schema validation via Pydantic to ensure data integrity.

---

### ADR-002: Stateless JWT Authentication with Bcrypt

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** The system needs secure user identity management and private scan history storage without incurring server-side session memory overhead.
- **Decision:** Implement stateless **JSON Web Tokens (JWT)** using HS256 signed with a 256-bit secret key, paired with **Bcrypt** password hashing (work factor = 12).
- **Alternatives Considered:**
  1. *Server-Side Sessions (Redis/Cookie):* Requires persistent session store infrastructure; increases deployment complexity for hackathon MVP.
  2. *Third-Party Auth (Auth0 / Supabase / Firebase):* Adds external network dependency and API rate limit constraints during judging.
- **Trade-offs:** Token revocation requires waiting for the 60-minute expiration or implementing an in-memory blacklist in future phases.

---

### ADR-003: Modular AI Architecture with Abstract ScamClassifier

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** The AI engine needs to support rapid prototyping (rule-based heuristics), statistical machine learning (TF-IDF + Logistic Regression), and future deep learning (DistilBERT) without altering API contracts or route handlers.
- **Decision:** Define an abstract Python base class ScamClassifier with standard predict_proba() and get_top_features() interfaces. Implement a hybrid engine where deterministic rules and statistical ML feed into a centralized risk engine.
- **Alternatives Considered:**
  1. *Direct End-to-End LLM Prompting:* High latency (2–5s), non-deterministic outputs, API costs, and risk of hallucinations.
  2. *Pure Rule-Based Engine:* 100% explainable, but cannot generalize to novel linguistic variations.
- **Trade-offs:** Requires maintaining both regex indicator dictionaries and ML feature vectorizers.

---

### ADR-004: Pure Lexical URL Analysis with Zero Outbound HTTP

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** Scanning arbitrary user-submitted URLs introduces severe security hazards (SSRF, malicious payloads, IP exposure) and performance bottlenecks.
- **Decision:** The MVP URL Analysis Engine operates **exclusively via deterministic lexical and syntactic parsing** (protocol, IP hostname, path keywords, subdomain depth, TLD abuse lists). **Zero outbound HTTP requests or DNS queries are executed.**
- **Alternatives Considered:**
  1. *Live Web Scraping / Headless Browser:* Extreme security risk, high latency (>5s), resource-intensive, and violates Non-Goal NG-05.
- **Trade-offs:** Cannot inspect actual website HTML content or follow live redirect chains in MVP.

---

### ADR-005: Weighted Fusion Risk Engine with Ceiling Override

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** In combined text + URL analysis, a simple average score would dangerously dilute a critical scam text (e.g. "Send  USDT to activate") if paired with a benign-looking URL.
- **Decision:** Implement a weighted linear combination (\%$ Text, \%$ URL) coupled with a **Critical Score Ceiling Override**: if either component has a score $\ge 75$ (CRITICAL), the combined score cannot fall below 75.
- **Alternatives Considered:**
  1. *Simple Arithmetic Mean:* Dangerous dilution of high-risk signals.
  2. *Worst-Case (Max) Only:* Over-penalizes mild anomalies when other signals are clean.
- **Trade-offs:** Requires configuration tuning to balance false positives against critical alerts.

---

### ADR-006: Deterministic 5-Questions Explainability Engine

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** Problem Statement CS-2 mandates an explainable risk assessment rather than a binary "Scam / Not Scam" verdict.
- **Decision:** Structure every scan result around a deterministic 5-Questions framework: What was detected, Why it was flagged, What is the evidence (verbatim snippet), How serious it is, and What the user should do.
- **Alternatives Considered:**
  1. *Free-form LLM Summarization:* High risk of hallucinating evidence snippets not present in user input.
- **Trade-offs:** Summary templates must be carefully authored to cover all indicator combinations.

---

### ADR-007: Synchronous Pipeline for MVP with Async Future Path

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** Text and URL lexical analysis complete in < 200ms in-memory.
- **Decision:** Use synchronous HTTP request-response processing for MVP. Design the architecture so that Phase 4 (OCR) and Phase 5 (Threat Intel) can transition to Celery/Redis background task polling without frontend redesign.
- **Alternatives Considered:**
  1. *Immediate Queue/Worker Setup (Celery + RabbitMQ):* Unnecessary infrastructure complexity for sub-200ms workloads during hackathon.
- **Trade-offs:** If a future model takes > 2s, client timeout risks emerge until async queue is provisioned.

---

### ADR-008: Strict Server-Side User Ownership Enforcement

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** Users must only be able to view, list, and delete their own scans.
- **Decision:** All database queries for scans enforce {"scan_id": scan_id, "user_id": current_user.user_id} at the repository layer.
- **Alternatives Considered:**
  1. *Client-side filtering:* Insecure, exposes unauthorized records in API responses.
- **Trade-offs:** None. Fundamental security requirement.

---

### ADR-009: Multi-Layered SSRF Defense Architecture

- **Status:** **PROPOSED & ACCEPTED**
- **Context:** Preparing the architecture for Phase 5 external threat intelligence lookups.
- **Decision:** Specify a dedicated SecureURLFetcher module enforcing pre-request DNS resolution, private IP blacklisting (RFC 1918), cloud metadata IP blocking (169.254.169.254), redirect caps (3), and 1MB response size limits.
- **Alternatives Considered:**
  1. *Standard equests.get():* Vulnerable to SSRF and cloud credential harvesting.
- **Trade-offs:** Requires custom socket/transport layer implementation in Phase 5.

---

*End of Architecture Decision Records (ADRs)*
