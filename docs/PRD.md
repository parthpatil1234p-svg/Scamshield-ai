# ScamShield AI - Product Requirements Document (PRD)

**Version:** 1.0.0
**Status:** DRAFT - Awaiting Team Approval
**Created:** 2026-08-20
**Project:** ScamShield AI
**Hackathon Problem Statement:** CS-2 - AI-Based Detection of Fake Investment and Trading Scams on Social Media
**Tagline:** Detect. Understand. Stay Safe.

> **DOCUMENT SCOPE:**
> This PRD is the **Single Source of Truth** for all ScamShield AI development.
> No application code, frontend, backend, database, or AI model should be created until this document is reviewed and approved.
> All sections clearly distinguish **Official Problem Requirements** from **Proposed Product Features**.

---

## Table of Contents

1. Executive Summary
2. Official Problem Statement
3. Product Vision
4. Product Goals
5. Non-Goals
6. Target Users
7. User Problems
8. Value Proposition
9. Complete Product Workflow
10. Core Features
11. Text Analysis Requirements
12. URL Analysis Requirements
13. Combined Analysis
14. AI / ML Requirements
15. Dataset Requirements
16. Risk Engine
17. Explainable AI
18. Safety Recommendations
19. Frontend Product Requirements
20. UI/UX Design System
21. Backend Requirements
22. API Requirements
23. Database Requirements
24. Security Requirements
25. Privacy Requirements
26. Performance Requirements
27. Accessibility
28. Testing Strategy
29. AI Evaluation
30. Hackathon Demo
31. Future Roadmap
32. Deployment Requirements
33. Monitoring
34. Limitations
35. Product Disclaimer
36. Requirements Prioritization
37. Functional Requirements Table
38. Non-Functional Requirements Table
39. User Stories
40. Acceptance Criteria
41. Open Questions
42. Risks and Mitigations
43. Traceability Matrix
44. PRD Quality Rules

---

## 1. Executive Summary

### What is ScamShield AI?

ScamShield AI is a proposed AI-powered web application designed to help everyday users identify potentially suspicious investment and trading content appearing on social media platforms, messaging applications, and other digital communication channels.

### What Problem Does It Solve?

The proliferation of fake investment schemes on social media is a growing cybersecurity and financial consumer protection problem. Bad actors publish misleading promotions promising guaranteed returns, unrealistic profits, and urgent deposit opportunities. Many users - especially new investors and non-technical individuals - cannot easily distinguish between legitimate investment information and manipulative or fraudulent content.

ScamShield AI addresses the detection gap by using AI and rule-based natural language analysis to surface suspicious signals in text and URLs, and then explains those signals to the user in plain, human-readable language.

### Why Does the Problem Matter?

- Investment scams cause significant financial harm to individuals with limited resources.
- Social media scale makes manual verification impractical for ordinary users.
- Many victims are not aware of the linguistic and structural patterns used in scam promotions.
- Educational awareness tools that explain risk signals empower users to make safer decisions independently.

### Who Will Use It?

- General social-media users who encounter suspicious investment posts.
- New or retail investors who may be unfamiliar with scam tactics.
- Students studying cybersecurity or financial literacy.
- Hackathon evaluators assessing the feasibility and quality of the AI solution.

### What Does the AI System Do?

The system accepts user-submitted text (investment promotions, social-media posts, chat messages) and optionally a URL. It extracts risk signals using a combination of rule-based features and AI/NLP classification. It then passes those signals through a risk scoring engine that produces: a numeric risk score (0-100), a categorical risk level (LOW / MEDIUM / HIGH / CRITICAL), a list of detected indicators with human-readable explanations, and a set of actionable safety recommendations.

### What Makes the Product Useful?

The core differentiator is **explainability**. Rather than simply returning "SCAM" or "SAFE", ScamShield AI tells the user exactly which signals were detected, why each signal is considered suspicious in the investment context, and what the user should do next. This educational component makes the product valuable even when the AI is uncertain.

### Expected Hackathon Outcome

A functional, demonstrable web application that:
- Accepts investment-related text and URLs.
- Produces an explainable risk assessment.
- Shows a history of past scans.
- Demonstrates a dashboard with usage statistics.
- Presents a clean, professional UI appropriate for a cybersecurity/AI SaaS product.

---

## 2. Official Problem Statement

> **OFFICIAL SOURCE REQUIREMENT**
> The following section reproduces the official problem statement as provided for Hackathon Problem CS-2.
> No paraphrasing or reinterpretation has been applied.
> Requirements derived directly from this statement are marked **[OFFICIAL]** throughout this document.

**Problem Statement Code:** CS-2

**Title:** AI-Based Detection of Fake Investment and Trading Scams on Social Media

**Official Description (as supported by provided source):**

The goal is to design an AI-powered web application that helps users identify potentially suspicious investment and trading scam content appearing on social media and digital communication channels.

The system should analyze available digital signals and provide an explainable risk assessment rather than simply returning "Scam" or "Not Scam".

**Derived Official Requirements:**

| Ref | Requirement |
|-----|-------------|
| OFF-01 | The system shall be an AI-powered web application. |
| OFF-02 | The system shall help users identify potentially suspicious investment and trading scam content. |
| OFF-03 | The target channels include social media and digital communication channels. |
| OFF-04 | The system shall analyze available digital signals. |
| OFF-05 | The system shall provide an explainable risk assessment. |
| OFF-06 | The system shall NOT simply return "Scam" or "Not Scam". |

All other requirements in this PRD are **[PROPOSED]** product decisions made by the development team to satisfy the official requirements.


---

## 3. Product Vision

**[PROPOSED]**

### Long-Term Vision Statement

ScamShield AI aims to be a freely accessible, trusted awareness tool that empowers ordinary users to critically evaluate investment and trading promotions they encounter online before acting on them.

### Vision Pillars

| Pillar | Description |
|--------|-------------|
| **Identify** | Surface signals that may indicate suspicious investment or trading content. |
| **Understand** | Explain detected signals in plain language that non-technical users can comprehend. |
| **Decide Safely** | Give users actionable information to help them pause and independently verify before acting. |
| **Avoid Blind Trust** | Reduce the tendency to trust online investment promotions at face value by showing the signals that professional evaluators look for. |

### System Character

ScamShield AI must remain a **defensive cybersecurity and awareness tool**. It is not a legal authority, a financial advisor, or a fraud prosecution system. It surfaces risk signals and explains them. Final decisions always remain with the user.

---

## 4. Product Goals

**[PROPOSED]**

### PRIMARY GOALS (Must Achieve for Hackathon)

| ID | Goal | Measurable Target |
|----|------|-------------------|
| PG-01 | **Detection** | System successfully extracts and scores at least 5 categories of investment scam indicators from user-submitted text. |
| PG-02 | **Explainability** | Every result includes a human-readable explanation of each detected indicator with evidence. |
| PG-03 | **Usability** | A non-technical user can submit content and read results without any training or documentation. |
| PG-04 | **Security** | All user accounts are protected by JWT authentication. All user inputs are validated and sanitized. |
| PG-05 | **Performance** | Text analysis returns a result within 5 seconds for inputs up to 2,000 characters (target, not guarantee). |
| PG-06 | **Demo Quality** | The product can be demonstrated end-to-end in under 10 minutes during the hackathon presentation. |

### SECONDARY GOALS (Should Achieve)

| ID | Goal | Measurable Target |
|----|------|-------------------|
| SG-01 | **URL Analysis** | System extracts and scores URL-based risk signals for user-submitted URLs. |
| SG-02 | **Combined Analysis** | System accepts and scores combined text + URL inputs. |
| SG-03 | **Scan History** | Users can view their past scans with stored results. |
| SG-04 | **Dashboard** | Users see summary statistics of their scan activity. |
| SG-05 | **Scalability** | Backend API is designed to be horizontally scalable in principle. |
| SG-06 | **Accessibility** | Core user flows meet WCAG 2.1 Level AA requirements. |

### FUTURE GOALS (Post-Hackathon)

| ID | Goal |
|----|------|
| FG-01 | Screenshot and image analysis with OCR. |
| FG-02 | Threat intelligence integration (e.g., VirusTotal, WHOIS). |
| FG-03 | Browser extension for inline social-media scanning. |
| FG-04 | Multi-language support. |
| FG-05 | Model retraining pipeline with user feedback. |
| FG-06 | Public API for third-party integration. |

---

## 5. Non-Goals

**[PROPOSED]**

| ID | Non-Goal |
|----|----------|
| NG-01 | **Guaranteed fraud detection.** The system makes probabilistic assessments, not definitive fraud determinations. |
| NG-02 | **Personalized financial advice.** The system does not recommend or advise on investments. |
| NG-03 | **Legal determinations.** The system does not conclude that a person, company, or URL is committing a crime. |
| NG-04 | **Accusation of individuals or companies.** The system assesses content signals, not the identity or legality of parties. |
| NG-05 | **Unauthorized website exploitation.** The system will not attempt to exploit, crawl, or attack any URL submitted. |
| NG-06 | **Authentication bypass.** The system will not attempt to access protected content behind login walls. |
| NG-07 | **Attacking suspected scam infrastructure.** The system is purely defensive. |
| NG-08 | **Real-time social media monitoring.** The system does not proactively crawl social platforms. |
| NG-09 | **WHOIS or DNS lookup in MVP.** External threat intelligence lookups are deferred to future phases. |
| NG-10 | **Financial compliance certification.** The system makes no compliance or regulatory claims. |

---

## 6. Target Users

**[PROPOSED]**

### Persona 1: General Social-Media User

| Attribute | Detail |
|-----------|--------|
| **Description** | Adult user who regularly uses Facebook, Instagram, Twitter/X, Telegram, or WhatsApp. |
| **Goals** | Avoid being deceived by investment promotions that appear in their feed or inbox. |
| **Problems** | Cannot distinguish between legitimate financial content and scam promotions. No background in finance or cybersecurity. |
| **Behavior** | Encounters investment posts or messages. May forward suspicious content to ScamShield AI for verification. |
| **Expected Interaction** | Pastes suspicious text or copies a URL. Reads the risk explanation. Decides whether to ignore or share the content. |

### Persona 2: New Investor

| Attribute | Detail |
|-----------|--------|
| **Description** | Individual who recently started investing and lacks experience evaluating investment opportunities. |
| **Goals** | Find legitimate investment opportunities without falling for scams. |
| **Problems** | Attracted by high-return promises. Lacks financial literacy to spot red flags. |
| **Behavior** | Actively searches for investment opportunities on social media. May receive unsolicited messages in investment groups. |
| **Expected Interaction** | Submits text from investment tips received on Telegram or WhatsApp. Reads the indicator list and learns what made the content suspicious. |

### Persona 3: Retail Investor

| Attribute | Detail |
|-----------|--------|
| **Description** | Experienced retail investor who is aware scams exist but wants a second opinion tool. |
| **Goals** | Quickly verify if a shared investment opportunity has obvious scam signals before considering it further. |
| **Problems** | Does not always have time to manually research every investment promotion they encounter. |
| **Behavior** | Scans multiple pieces of content during a session. Reviews scan history to track patterns. |
| **Expected Interaction** | Uses the scanner frequently. Expects fast results. Reads the risk score and indicator list. |

### Persona 4: Student

| Attribute | Detail |
|-----------|--------|
| **Description** | University student studying cybersecurity, computer science, or finance. |
| **Goals** | Understand how AI-based scam detection works. Learn what signals indicate suspicious investment content. |
| **Problems** | Wants a practical tool to study scam detection concepts. |
| **Behavior** | Experiments with different inputs. Reads explanations carefully to learn indicator definitions. |
| **Expected Interaction** | Tests the system with varied inputs including edge cases. Reviews the explanation structure. |

### Persona 5: Cybersecurity Learner

| Attribute | Detail |
|-----------|--------|
| **Description** | Professional or learner studying social engineering and digital fraud. |
| **Goals** | Understand the technical signals used to identify investment scams. |
| **Problems** | Existing tools only return binary outputs. Needs an explainable system. |
| **Behavior** | Submits both suspicious and benign content to evaluate the system's performance. |
| **Expected Interaction** | Reviews the indicator list, severity levels, evidence excerpts, and explanation text. Tests edge cases. |

### Persona 6: Hackathon Evaluator

| Attribute | Detail |
|-----------|--------|
| **Description** | Technical judge or domain evaluator reviewing the ScamShield AI project. |
| **Goals** | Evaluate technical correctness, AI quality, UX quality, security, and innovation. |
| **Problems** | Needs to understand the product quickly in a limited demonstration window. |
| **Behavior** | Observes the live demonstration. May submit their own test inputs. |
| **Expected Interaction** | Views the full scan flow. Reviews the AI explanation. Assesses UI quality, security measures, and roadmap. |

---

## 7. User Problems

**[PROPOSED - consistent with Official Problem Statement CS-2]**

| ID | Problem | Example |
|----|---------|---------|
| UP-01 | **Fake guaranteed return claims** | "Earn 50% monthly guaranteed. Join our trading group." |
| UP-02 | **Unrealistic profit claims** | "Turn 100 into 10,000 in 30 days with our proven strategy." |
| UP-03 | **Urgency and pressure tactics** | "Limited slots available. Deposit today before midnight." |
| UP-04 | **FOMO language** | "Everyone is already profiting. Don't be left behind." |
| UP-05 | **False authority or expert claims** | "Endorsed by top Wall Street traders." |
| UP-06 | **Suspicious investment links** | Links to unfamiliar domains with long, complex URL paths. |
| UP-07 | **Payment solicitation** | "Send USDT to this wallet to activate your trading account." |
| UP-08 | **Redirection to private channels** | "Join our private Telegram/WhatsApp group for exclusive signals." |
| UP-09 | **Fake testimonial claims** | "Thousands of members have already made millions." |
| UP-10 | **Investment solicitation without licensing disclosure** | No regulatory disclosure, no risk warning, no official registration information. |

---

## 8. Value Proposition

**[PROPOSED]**

### Core Value Statement

> "ScamShield AI explains the risk instead of simply saying scam."

### Value Breakdown

| Element | Description |
|---------|-------------|
| **What the user submits** | A piece of investment promotion text, a URL, or both. |
| **What the system analyzes** | Linguistic patterns, structural content signals, URL structure features, and a combination of rule-based and AI-driven classification. |
| **What the user receives** | A numeric risk score (0-100), a categorical risk level, a list of detected signals with evidence excerpts, plain-language explanations, and actionable safety recommendations. |
| **Why explainability matters** | Binary outputs do not help users understand why content is suspicious. Explainability builds trust, educates users about scam tactics, and reduces alarm fatigue by helping users distinguish between genuinely high-risk and borderline content. |

---

## 9. Complete Product Workflow

**[PROPOSED]**

### Primary User Workflow (MVP)

`
Landing Page (/)
       |
       v
Register (/register) OR Login (/login)
       |
       v
Dashboard (/dashboard)
       |
       v
Scanner (/scanner)
       |
       v
Select Analysis Type:
  [A] Text Only
  [B] URL Only
  [C] Text + URL (Combined)
       |
       v
Submit Content
       |
       v
Input Validation and Sanitization (Backend)
       |
       v
AI Analysis Pipeline
  [A] Text Feature Extraction -> Text Classifier -> Indicator Scoring
  [B] URL Feature Extraction -> URL Signal Scoring
  [C] Text Analysis + URL Analysis -> Combined Risk Engine
       |
       v
Risk Engine
  -> Individual signal scores
  -> Combined weighted risk score (0-100)
  -> Risk Level (LOW / MEDIUM / HIGH / CRITICAL)
       |
       v
Explainability Generator
  -> Detected indicator list
  -> Evidence excerpts
  -> Human-readable explanation
       |
       v
Safety Recommendation Engine
  -> Contextual recommendations based on risk level
       |
       v
Result Page (/results/:scanId)
  -> Risk score
  -> Risk level badge
  -> Detected indicators
  -> Explanation
  -> Recommendations
  -> Option: Save / Delete scan
       |
       v
Scan History (/history)
  -> List of past scans
  -> Date, risk level, analysis type
  -> Link to individual result
`

### Future Workflow Additions

- **Screenshot Upload:** User uploads image -> OCR processing -> extracted text routed to text analysis pipeline -> same result page structure.
- **Threat Intelligence Enrichment:** URL Analysis -> External Threat Intelligence API -> enhanced result with domain reputation data.


---

## 10. Core Features

**[PROPOSED]**

### Feature A: Authentication

**Purpose:** Securely identify users so that scan history and personal data are protected and associated with individual accounts.

**User Story:** As a user, I want to create an account and log in securely, so that my scan history is private and accessible only to me.

**Functional Requirements:**
- User can register with email address and password.
- User can log in with email and password.
- System issues a JWT access token on successful login.
- Token is validated on every protected API request.
- User can view their own profile.
- User cannot access another user's data.
- Passwords are hashed before storage (never stored in plaintext).

**Inputs:** Email (string), Password (string)

**Edge Cases:**
- Duplicate email registration -> return 409 Conflict.
- Incorrect credentials -> return 401 Unauthorized (do not specify which field is wrong).
- Expired or invalid JWT -> return 401 Unauthorized.
- Malformed email format -> return 400 Bad Request.

**Acceptance Criteria:**
- [ ] User can register successfully with valid credentials.
- [ ] Duplicate email registration returns an appropriate error.
- [ ] Valid login returns a JWT token.
- [ ] Invalid credentials return a generic 401 error.
- [ ] Protected routes reject requests without a valid JWT.
- [ ] Passwords are never stored or returned in plaintext.

---

### Feature B: Dashboard

**Purpose:** Provide users with a summary view of their scan activity and a navigation hub to the scanner and history.

**User Story:** As a user, I want to see a summary of my scan activity when I log in, so that I can quickly understand my recent usage and navigate to the scanner.

**Functional Requirements:**
- Display total number of scans performed by the user.
- Display a breakdown of scans by risk level (LOW / MEDIUM / HIGH / CRITICAL).
- Display the most recent scan result.
- Provide quick links to the Scanner and History pages.
- Dashboard data is loaded from the user's own scan records only.

**Edge Cases:**
- No scans yet -> display an empty state with a call-to-action to start scanning.
- Database query failure -> display an error state without crashing the page.

**Acceptance Criteria:**
- [ ] Dashboard displays correct total scan count for the logged-in user.
- [ ] Dashboard displays risk-level breakdown counts.
- [ ] Most recent scan is displayed.
- [ ] Empty state is shown when no scans exist.
- [ ] Dashboard is not accessible without a valid login.

---

### Feature C: Text Analysis

**Purpose:** Analyze user-submitted text for signals that may indicate a suspicious investment or trading promotion.

**User Story:** As a user, I want to paste investment promotion text and receive an analysis of its suspicious signals, so that I can decide whether to trust it.

**Functional Requirements:**
- User can submit free-form text (minimum 10 characters, maximum 5,000 characters).
- System extracts risk indicators from the text.
- System produces a risk score and risk level.
- System generates a plain-language explanation of detected indicators.
- System returns the result with evidence excerpts from the submitted text.

**Inputs:** Text (string, 10-5,000 characters)

**Edge Cases:**
- Empty input -> return 400 Bad Request.
- Input exceeds maximum length -> return 400 with length validation error.
- Text with no detected signals -> return LOW risk with appropriate explanation.
- Text in a non-English language -> system processes what it can; result confidence may be lower (flagged in output).

**Acceptance Criteria:**
- [ ] Text input is validated before processing.
- [ ] System detects at least the defined set of risk indicators (see Section 11).
- [ ] Every detected indicator includes a human-readable name and explanation.
- [ ] Evidence excerpt from the original text is included where applicable.
- [ ] Risk score is within the 0-100 range.
- [ ] Risk level matches the defined score-to-level mapping.

---

### Feature D: URL Analysis

**Purpose:** Extract structural and content signals from a submitted URL that may indicate elevated risk in an investment context.

**User Story:** As a user, I want to paste a URL I received in an investment promotion and see an analysis of its suspicious features, so that I can decide whether to visit it.

**Functional Requirements:**
- User can submit a single URL.
- System validates the URL format.
- System extracts URL features (see Section 12).
- System produces a URL risk score and risk level.
- System does NOT fetch, crawl, or execute the URL.
- System does NOT imply that any URL is definitively a fraud site.

**Edge Cases:**
- Malformed URL -> return 400 Bad Request.
- URL using non-HTTP/HTTPS protocol -> reject with 422.
- IP address as host -> flag as signal, do not block.
- URL shortener -> flag as signal (destination unknown).

**Acceptance Criteria:**
- [ ] URL format is validated before processing.
- [ ] Non-HTTP/HTTPS protocols are rejected with 422.
- [ ] System does not make outbound HTTP requests to submitted URLs (MVP).
- [ ] Detected URL signals are explained in plain language.
- [ ] Result does not state that the URL is definitively fraudulent.

---

### Feature E: Combined Text + URL Analysis

**Purpose:** Analyze both text content and a URL together, producing a unified risk assessment.

**User Story:** As a user, I want to submit both the text of an investment promotion and its associated URL together, so that I receive a single, comprehensive risk assessment.

**Functional Requirements:**
- User can submit both text and a URL in a single request.
- System performs text analysis and URL analysis independently.
- A single final risk score, level, explanation, and recommendation is returned.
- Individual text and URL sub-scores are also shown.

**Acceptance Criteria:**
- [ ] Both text and URL are validated before processing.
- [ ] Individual sub-scores are returned.
- [ ] Combined score reflects aggregation logic (see Section 13).
- [ ] Explanation covers indicators from both text and URL analysis.

---

### Feature F: Risk Scoring

**Purpose:** Convert detected signals and their severities into a single interpretable numeric score and categorical risk level.

See Section 16 for complete Risk Engine specification.

---

### Feature G: Explainable Results

**Purpose:** Translate machine-scored results into human-readable explanations that tell the user what was found, why it matters, and what to do.

See Section 17 for complete Explainability specification.

---

### Feature H: Scan History

**Purpose:** Allow users to review all past scans with their results.

**User Story:** As a user, I want to view my past scan results in a list, so that I can reference previous analyses without re-running them.

**Functional Requirements:**
- Authenticated users can view a paginated list of their scans.
- Each scan entry shows: date, analysis type, risk level badge, and a link to the full result.
- User can delete individual scans from their history.
- Users can only see their own scan history.

**Acceptance Criteria:**
- [ ] History is paginated.
- [ ] Only the authenticated user's scans are shown.
- [ ] User can delete a scan.
- [ ] Deleted scan is no longer accessible.
- [ ] Full result page is accessible from history.

---

### Feature I: Safety Recommendations

**Purpose:** Provide actionable, contextual guidance based on the detected risk level.

See Section 18 for complete Safety Recommendation specification.

---

### Feature J (Future): Screenshot / Image Analysis

**[FUTURE - POST-HACKATHON]**

Allow users to upload a screenshot of an investment promotion from social media for analysis. Requires OCR extraction and routing to text analysis pipeline. Requires secure file upload infrastructure and malware scanning.

---

### Feature K (Future): Optical Character Recognition (OCR)

**[FUTURE - POST-HACKATHON]**

Converts image content to machine-readable text for downstream analysis. Depends on Feature J. OCR provider to be selected (see Open Questions).

---

### Feature L (Future): Threat Intelligence

**[FUTURE - POST-HACKATHON]**

Enrich URL analysis with external reputation data (e.g., domain age, blacklist status, WHOIS, VirusTotal). Domain reputation signal added to URL score. Full SSRF protection required before implementation.

---

## 11. Text Analysis Requirements

**[PROPOSED - consistent with Official Problem Statement CS-2]**

The text analysis module extracts a set of defined risk indicators from user-submitted text. The presence of an indicator raises the risk score by a weighted amount. **The presence of one indicator alone is not treated as proof of fraud.**

### TI-01: Guaranteed Return Claim

| Field | Value |
|-------|-------|
| Code | TI-01 |
| Name | Guaranteed Return Claim |
| Description | Text contains explicit or near-explicit assurances that a return, profit, or income is guaranteed or certain. |
| Example | "Guaranteed 20% monthly returns. Your capital is 100% safe." |
| Severity | HIGH |
| Detection Approach | Keyword/phrase pattern matching: "guaranteed", "100% guaranteed", "risk-free", "sure profit", "certain returns". Contextual check: appears in investment solicitation context. |
| Possible False Positives | Government-backed savings accounts. Educational content explaining that no investment is guaranteed. |
| User Explanation | "This content contains language suggesting that investment returns are guaranteed. Legitimate regulated investment products generally cannot guarantee returns. This language is commonly associated with high-risk or fraudulent investment promotions." |

### TI-02: Unrealistic Profit Claim

| Field | Value |
|-------|-------|
| Code | TI-02 |
| Name | Unrealistic Profit Claim |
| Description | Text claims extraordinary profit percentages within short timeframes. |
| Example | "Turn 500 into 50,000 in just 2 weeks." |
| Severity | HIGH |
| Detection Approach | Pattern matching for large percentage figures (>50% per month), multiplier language ("10x", "100x"), combined with short timeframe and profit claims. |
| Possible False Positives | Historical market analysis articles. Academic content about high-performing assets. |
| User Explanation | "This content claims unusually high or rapid profits from an investment. Returns of this magnitude within short periods are extremely rare in legitimate markets and are a commonly used tactic in fraudulent investment promotions." |

### TI-03: Urgency / Pressure Tactic

| Field | Value |
|-------|-------|
| Code | TI-03 |
| Name | Urgency / Pressure Tactic |
| Description | Text creates artificial time pressure or scarcity to discourage critical thinking before acting. |
| Example | "Only 5 spots left. Deposit before midnight or lose your chance." |
| Severity | MEDIUM |
| Detection Approach | Pattern matching for: "limited time", "act now", "hurry", "only X spots left", "expires today", "don't miss out". |
| Possible False Positives | Legitimate limited-time offers from licensed financial platforms. |
| User Explanation | "This content uses urgency language designed to pressure you into making a quick decision. Creating a sense of scarcity or time pressure is a well-documented psychological tactic used to discourage critical evaluation." |

### TI-04: FOMO Language

| Field | Value |
|-------|-------|
| Code | TI-04 |
| Name | FOMO (Fear of Missing Out) Language |
| Description | Text appeals to the fear of being excluded from a profitable opportunity or missing out on something others are benefiting from. |
| Example | "Everyone is making money. Don't be left behind while others get rich." |
| Severity | MEDIUM |
| Detection Approach | Pattern matching for: "everyone is profiting", "don't miss out", "left behind", "others are already", "join the thousands". |
| Possible False Positives | Motivational financial content not associated with a specific solicitation. |
| User Explanation | "This content uses language designed to create a fear of being excluded from profits that others are supposedly making. This emotional appeal is commonly used to reduce critical thinking about investment risks." |

### TI-05: False Authority / Expert Claim

| Field | Value |
|-------|-------|
| Code | TI-05 |
| Name | False Authority / Expert Claim |
| Description | Text claims endorsement or affiliation with recognized financial authorities, celebrities, or platforms without verifiable evidence. |
| Example | "Backed by Goldman Sachs traders. Endorsed by Elon Musk." |
| Severity | HIGH |
| Detection Approach | Pattern matching for: "endorsed by", "backed by", "recommended by", combined with names of well-known institutions or figures. The system cannot verify the claim - it flags the pattern. |
| Possible False Positives | Legitimate content from financial institutions citing actual partnerships (verifiable through official channels). |
| User Explanation | "This content claims to be endorsed or backed by well-known authorities or celebrities. High-profile endorsements are commonly fabricated in investment scams. Always verify such claims through official channels." |

### TI-06: Payment Solicitation

| Field | Value |
|-------|-------|
| Code | TI-06 |
| Name | Payment Solicitation |
| Description | Text directly requests a payment, deposit, wallet transfer, or cryptocurrency transaction. |
| Example | "Send 200 in USDT to activate your trading account." |
| Severity | CRITICAL |
| Detection Approach | Pattern matching for: "send", "deposit", "transfer", "pay", "wallet", "USDT", "BTC", "ETH", combined with an amount or account reference. |
| Possible False Positives | Legitimate fund transfer confirmations between known parties. |
| User Explanation | "This content contains a request for a monetary payment or transfer. Investment opportunities solicited via social media that require direct deposits - especially to cryptocurrency wallets - are a high-risk pattern commonly associated with investment fraud." |

### TI-07: Private Channel Redirection

| Field | Value |
|-------|-------|
| Code | TI-07 |
| Name | Private Channel Redirection |
| Description | Text directs the user to join a private or semi-private communication channel for investment signals or opportunities. |
| Example | "Join our private Telegram VIP group for exclusive trading signals." |
| Severity | MEDIUM |
| Detection Approach | Pattern matching for: "join our group", "private channel", "Telegram", "WhatsApp", "Signal", "DM me", "exclusive group", "VIP access". |
| Possible False Positives | Legitimate communities (e.g., regulated financial education groups). |
| User Explanation | "This content directs you to a private messaging channel for investment-related information. Moving investment discussions off public platforms and into private channels is a tactic that removes accountability and makes it harder to verify claims or report issues." |

### TI-08: Testimonial / Social Proof Claim

| Field | Value |
|-------|-------|
| Code | TI-08 |
| Name | Testimonial / Social Proof Claim |
| Description | Text includes unverifiable claims of large numbers of satisfied customers, withdrawal success stories, or anonymous testimonials. |
| Example | "Over 50,000 members have already withdrawn millions in profits." |
| Severity | LOW |
| Detection Approach | Pattern matching for: "thousands of members", "millions withdrawn", "success stories", "real testimonials", "join X happy members". |
| Possible False Positives | Legitimate platforms with verified user bases and auditable records. |
| User Explanation | "This content references a large number of satisfied participants or successful withdrawals. These claims are very common in fraudulent investment promotions and cannot be verified through this tool." |

### TI-09: Investment Solicitation Without Disclosure

| Field | Value |
|-------|-------|
| Code | TI-09 |
| Name | Investment Solicitation Without Disclosure |
| Description | Text solicits participation in an investment or trading scheme with no mention of regulatory registration, risk warnings, or licensed status. |
| Example | "Invest with us and start earning today." (No disclosure, no risk warning, no licensing mention.) |
| Severity | MEDIUM |
| Detection Approach | Detect investment solicitation language. Check for absence of disclosure markers: "regulated by", "registered with", "risk warning", "capital at risk". Absence alone does not confirm fraud. |
| Possible False Positives | General educational financial content that is not a solicitation. |
| User Explanation | "This content appears to solicit investment participation without including standard regulatory disclosures or risk warnings. The absence of these disclosures is not proof of fraud, but it is a signal worth noting." |

### Important Analytical Caveat

> The detection of any single indicator does not constitute proof of fraud. The risk engine combines multiple weak signals into a composite assessment. The system's output is always a probabilistic risk signal, not a legal or factual determination.


---

## 12. URL Analysis Requirements

**[PROPOSED]**

### Fundamental URL Analysis Principles

> - **HTTPS does NOT equal safe.** HTTPS only indicates encrypted transport. Fraudulent sites routinely use HTTPS.
> - **HTTP does NOT equal scam.** Some legitimate resources use HTTP.
> - **Unknown domain does NOT equal scam.** New legitimate businesses have new domains.
> - All URL signals are probabilistic, not deterministic.

### URL Validation

| Step | Description |
|------|-------------|
| Format validation | URL must conform to a valid URI format with scheme + host. |
| Protocol allowlist | Only http:// and https:// are accepted. All other protocols (file://, ftp://, javascript:, data:) are rejected with 422. |
| Input sanitization | URL is sanitized before processing to prevent injection. |

### URL Normalization

| Step | Description |
|------|-------------|
| Lowercase conversion | Scheme and hostname are lowercased. |
| Trailing slash normalization | Consistent slash handling. |
| Fragment removal | Fragment identifiers (#) are stripped as not relevant to analysis. |

### URL Signal Definitions

| Signal Code | Signal Name | Description | Severity | Possible False Positive |
|-------------|-------------|-------------|----------|------------------------|
| UI-01 | HTTP Protocol | URL uses HTTP rather than HTTPS. | LOW | Legacy internal tools, some developer environments. |
| UI-02 | IP Address as Host | URL hostname is a raw IP address rather than a domain name. | MEDIUM | Internal network tools. Legitimate APIs using IP. |
| UI-03 | Suspicious Keywords in URL | Path or query string contains: "invest", "profit", "trading", "withdraw", "earn", "bonus". | MEDIUM | Legitimate financial platforms. News articles about investment topics. |
| UI-04 | Excessive URL Length | URL exceeds 150 characters. | LOW | Legitimate redirect tracking URLs. Complex legitimate URLs. |
| UI-05 | Excessive Subdomains | Hostname has more than 3 subdomains. | LOW | Complex legitimate enterprise infrastructure. |
| UI-06 | Suspicious TLD | URL uses a TLD associated with high abuse rates (configurable list). | LOW | Legitimate sites on same TLD. |
| UI-07 | URL Shortener Domain | Hostname matches a known URL shortener service. | MEDIUM | Legitimate link shortening for sharing. |
| UI-08 | Numeric Domain | Domain name consists primarily of numbers. | LOW | Some legitimate service providers. |
| UI-09 | Special Characters in Domain | Domain contains excessive hyphens or encoded characters beyond standard. | LOW | Some legitimate internationalized domains. |
| UI-10 | Excessive Query Parameters | URL contains more than 5 query parameters. | LOW | Legitimate tracking URLs, analytics. |

### SSRF Protection Requirements (For Future URL Fetching Phase)

If URL fetching is ever introduced, the following protections MUST be implemented before enabling outbound requests:

| Protection | Requirement |
|------------|-------------|
| Protocol allowlist | Only http and https permitted. |
| Private IP blocking | Block RFC 1918 addresses: 10.x.x.x, 172.16-31.x.x, 192.168.x.x. |
| Localhost blocking | Block 127.0.0.1, ::1, localhost. |
| Link-local blocking | Block 169.254.x.x (AWS/GCP metadata). |
| Cloud metadata blocking | Explicitly block 169.254.169.254. |
| Redirect limit | Maximum 3 redirects. |
| Connection timeout | Maximum 5 seconds. |
| Response size limit | Do not read more than 1 MB of response. |

---

## 13. Combined Analysis

**[PROPOSED]**

### Architecture

`
User Submits: Text + URL
       |
       +---> Text Analysis Module
       |         |
       |         v
       |     Text Indicators + Text Sub-Score (0-100)
       |
       +---> URL Analysis Module
                 |
                 v
             URL Signals + URL Sub-Score (0-100)
       |
       v
Combined Risk Engine
  -> Weighted combination formula
  -> Aggregated indicator list (text + URL)
  -> Conflict handling
  -> Final Combined Risk Score (0-100)
  -> Final Risk Level (LOW / MEDIUM / HIGH / CRITICAL)
       |
       v
Explainability Generator -> Safety Recommendation Engine
       |
       v
Result Object Returned to Frontend
`

### Combination Logic

**[PROPOSED - configurable defaults, not scientifically validated]**

| Element | Default Weighting |
|---------|-------------------|
| Text Sub-Score | 60% |
| URL Sub-Score | 40% |
| Combined Score Formula | (Text Score x 0.60) + (URL Score x 0.40) |

> Weights are proposed defaults. They must be validated against real test cases and made configurable via environment variables.

### Score Ceiling Handling

If either individual score exceeds 75 (CRITICAL threshold), the combined score must not fall below the HIGH threshold (50) regardless of the other score. This prevents a very low URL score from masking a critical text result.

### Explanation Aggregation

The explanation must include:
- A unified summary sentence.
- A labeled "Text Analysis" section with text indicators.
- A labeled "URL Analysis" section with URL signals.
- A final combined risk statement.

### Confidence Handling

If the text classifier returns a low confidence score (below a configurable threshold), the result explanation must include a note indicating that confidence is limited and the user should apply independent judgment.

---

## 14. AI / ML Requirements

**[PROPOSED]**

### Design Principle: Model Abstraction

The AI analysis pipeline must be designed behind an abstract interface so that the underlying model can be swapped or upgraded without changing the API contract or the frontend.

### Approach 1: Rule-Based Baseline (Required for MVP)

| Component | Description |
|-----------|-------------|
| Type | Deterministic pattern matching |
| Technique | Regular expression patterns + keyword/phrase dictionaries per indicator |
| Advantage | Transparent, explainable, no training data required, no false accuracy claims |
| Disadvantage | May miss novel phrasing; no semantic understanding |
| Usage | Fallback when ML model is unavailable; always active as a baseline |

### Approach 2: TF-IDF + Classical Classifier (Proposed Secondary)

| Component | Description |
|-----------|-------------|
| Type | Machine learning classifier |
| Feature Extraction | TF-IDF vectorization of input text |
| Classifiers | Logistic Regression or Linear SVM |
| Advantage | Trained on labeled examples; better generalization than pure rules |
| Disadvantage | Requires annotated training dataset; less interpretable than rules alone |
| Explainability | Feature importance can be extracted to identify top contributing terms |

### Approach 3: Transformer-Based Classifier (Future Phase)

| Component | Description |
|-----------|-------------|
| Type | Deep learning NLP model |
| Base Model | Fine-tuned BERT-like model (e.g., DistilBERT, RoBERTa) |
| Advantage | Semantic understanding; handles paraphrasing and novel phrasing |
| Disadvantage | Larger inference cost; requires more training data |
| Explainability | Requires SHAP, LIME, or attention visualization |
| Status | FUTURE - not for MVP |

### Training Pipeline Requirements

| Requirement | Description |
|-------------|-------------|
| Data ingestion | Load annotated dataset from defined format (see Section 15). |
| Preprocessing | Text cleaning, tokenization, lowercasing, stopword handling (configurable). |
| Feature extraction | TF-IDF or equivalent. Feature extraction code separated from model code. |
| Train/validation split | Defined split ratio (see Section 15). |
| Model training | Train selected classifier. |
| Evaluation | Evaluate on held-out test set. Report precision, recall, F1, confusion matrix. |
| Model persistence | Save trained model artifacts. |
| Model versioning | Each trained model is assigned a version identifier and timestamp. |

### Inference Pipeline Requirements

| Requirement | Description |
|-------------|-------------|
| Input preprocessing | Same preprocessing as training pipeline (must use identical transformations). |
| Feature extraction | Load same vectorizer used during training. |
| Classification | Load versioned model. Run prediction. Return label + confidence score. |
| Indicator mapping | Map classification output to indicator codes. |
| Rule overlay | Apply rule-based indicators on top of ML output. |
| Confidence threshold | If confidence below threshold, mark result as low-confidence. |
| Fallback | If model loading fails, fall back to rule-based baseline only. |

### Model Versioning Fields

| Field | Description |
|-------|-------------|
| model_id | Unique identifier for the trained model. |
| model_version | Semantic version string (e.g., "1.0.0"). |
| training_date | ISO 8601 timestamp of training. |
| evaluation_summary | Brief record of evaluation metrics. |
| dataset_version | Version of dataset used for training. |

---

## 15. Dataset Requirements

**[PROPOSED]**

### Required Dataset Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| text | string | Yes | The raw investment-related text sample. |
| label | string | Yes | "suspicious" or "not_suspicious". |
| category | string | Optional | Sub-category (e.g., "guaranteed_return", "urgency_tactic"). |
| source | string | Optional | Origin (e.g., "synthetic", "public_dataset", "manual"). |
| license | string | Yes | License under which this sample can be used. |
| annotator | string | Optional | Identifier of person or process that annotated this sample. |
| annotation_date | string | Optional | Date of annotation (ISO 8601). |
| language | string | Optional | Language of the text. Assumed "en" if absent. |

### Data Quality Requirements

| Requirement | Description |
|-------------|-------------|
| No duplicates | Duplicate text samples must be removed before training. |
| Label balance | Class imbalance must be measured and documented. Addressed before use. |
| Annotation quality | If human-annotated, inter-annotator agreement must be documented. |
| No PII | Training data must not contain real personal information. |
| Licensing | All training data must have a license compatible with the project's intended use. |

### Dataset Splits

| Split | Proposed Ratio |
|-------|----------------|
| Training | 70% |
| Validation | 15% |
| Test | 15% |

> Splits must be random but reproducible (fixed random seed documented).

### Synthetic Test Data

For MVP demonstration, synthetic test examples may be used. They must be clearly labeled as synthetic and must not be presented as real-world data or as representative of any real scam campaign.

### Data Privacy

- No user-submitted scan content shall be used for training without explicit, documented user consent.
- Consent must be actively given (opt-in), not passively assumed.
- A future optional consent mechanism may be introduced.

### Unknown Labels

If a sample's true label is uncertain, it must be marked with label "unknown" and excluded from training and evaluation splits.

---

## 16. Risk Engine

**[PROPOSED]**

### Risk Score Definition

The risk score is an integer from 0 to 100. It is a **probabilistic composite signal**, not a legally or scientifically validated fraud probability.

### Risk Level Mapping

**[PROPOSED defaults - configurable without code changes]**

| Score Range | Risk Level | Meaning |
|-------------|------------|---------|
| 0 - 24 | LOW | Few or no signals detected. Content appears to have limited obvious risk indicators. |
| 25 - 49 | MEDIUM | Some signals detected. Content warrants independent verification before acting. |
| 50 - 74 | HIGH | Multiple or high-severity signals detected. Content displays several patterns commonly associated with investment fraud. |
| 75 - 100 | CRITICAL | High density of critical signals. Content displays a strong pattern commonly associated with high-risk or fraudulent investment promotions. |

### Signal Severity Weights

**[PROPOSED - must be validated against test cases]**

| Severity | Base Score Contribution |
|----------|------------------------|
| CRITICAL | +25 points |
| HIGH | +15 points |
| MEDIUM | +8 points |
| LOW | +3 points |

Duplicate signals of the same code do not stack. Each indicator code contributes its weight at most once per analysis.

### Score Normalization

`
raw_max = sum of all indicator weights (if all indicators fired)
raw_score = sum of fired indicator weights
normalized_score = min(100, round((raw_score / raw_max) x 100))
`

If raw_max is 0 (no indicators defined), return 0.

### Threshold Configuration

Risk level thresholds must be configurable via environment variables or a configuration file, not hardcoded in application logic.

### Model Uncertainty

If the ML classifier reports low confidence (below configurable threshold):
- The risk score is still returned.
- The result includes a low_confidence flag.
- The explanation includes a plain-language caveat: "This analysis has lower confidence for this input. The indicators shown are based on detected patterns. Please apply additional independent judgment."

### Explanation Output Schema

`
{
  "risk_score": 72,
  "risk_level": "HIGH",
  "low_confidence": false,
  "indicators": [
    {
      "code": "TI-01",
      "name": "Guaranteed Return Claim",
      "severity": "HIGH",
      "evidence": "...guaranteed 20% monthly...",
      "explanation": "This content contains language suggesting that investment returns are guaranteed..."
    }
  ],
  "summary": "The submitted content contains several signals commonly associated with high-risk investment promotions.",
  "recommendation": "..."
}
`

---

## 17. Explainable AI

**[PROPOSED - addressing Official Requirements OFF-05 and OFF-06]**

### Explanation Principles

Every analysis result must answer the following five questions in plain language:

| # | Question | Where Answered |
|---|----------|---------------|
| 1 | What was detected? | Indicator name and code |
| 2 | Why was it detected? | Pattern/rule or model signal description |
| 3 | What evidence supports the signal? | Excerpt from submitted text or URL feature value |
| 4 | How serious is it? | Severity label (LOW / MEDIUM / HIGH / CRITICAL) |
| 5 | What should the user do? | Safety recommendation |

### Explanation Language Rules

- Always use hedging language: "may indicate", "is associated with", "is a common pattern in".
- Never state as fact: "this is a scam", "this is fraud", "you will lose money".
- Always acknowledge that false positives are possible.
- Summary sentences must be in plain English (no technical jargon).
- Evidence excerpts must be taken directly from the submitted content, not modified.

### No-Signal Explanation

When no indicators are detected (risk score is 0 or very low):

> Risk Level: LOW | Risk Score: 0-24
>
> No significant risk indicators were detected in the submitted content.
> This does not mean the content is verified as safe. Always independently
> verify investment opportunities before committing funds.

---

## 18. Safety Recommendations

**[PROPOSED]**

Safety recommendations must be: Defensive, Clear, Actionable, Non-alarmist, Not financial advice.

### LOW (0-24)

> No significant risk signals were detected in this content. Continue to verify investment opportunities independently before committing any funds. No investment should be trusted solely based on a social media post.

### MEDIUM (25-49)

> This content contains some signals worth noting. We recommend:
> - Verify the identity and regulatory registration of any investment service mentioned.
> - Research the product or platform independently using official sources.
> - Do not transfer any money or personal financial information based solely on this communication.
> - Consult a licensed financial advisor if you are considering this investment.

### HIGH (50-74)

> This content contains multiple signals commonly associated with high-risk investment promotions. We recommend:
> - Do not send money, deposit funds, or share financial information with the sender.
> - Do not join private investment groups promoted in this content without thorough independent verification.
> - Report this content to the social media platform where you found it.
> - If you have already sent money, consider contacting your bank and local consumer protection authority.
> - Consult an official financial regulator's website to verify licensing.

### CRITICAL (75-100)

> This content displays a high density of signals strongly associated with fraudulent investment promotions. We strongly recommend:
> - Do not send any money or assets under any circumstances based on this content.
> - Do not share any personal or financial information with the source of this content.
> - Report this content to the platform where it appeared and to your local financial regulatory authority.
> - If you have already made a payment, contact your bank or financial institution immediately and preserve all evidence.
> - Seek advice from a licensed financial advisor or consumer protection body.


---

## 19. Frontend Product Requirements

**[PROPOSED]**

### Page: / (Landing Page)

| Attribute | Detail |
|-----------|--------|
| Purpose | Introduce ScamShield AI, explain its value, and direct users to register or login. |
| Layout | Single-page, vertically scrolled. Hero, features section, how-it-works, CTA, footer. |
| Components | Hero headline + tagline, CTA buttons (Register / Login), feature cards, brief how-it-works steps, footer. |
| User Actions | Click Register, Click Login, Scroll to learn more. |
| States | Default (unauthenticated). If authenticated, redirect to /dashboard. |
| Responsive | Mobile: stacked layout. Desktop: two-column hero. |
| Accessibility | All images have alt text. Buttons have descriptive labels. Semantic heading structure. |

### Page: /login

| Attribute | Detail |
|-----------|--------|
| Purpose | Authenticate existing users. |
| Layout | Centered card on neutral background. |
| Components | Email input, password input, submit button, error alert, link to /register. |
| States | Default, submitting (loading), error (invalid credentials), success (redirect to /dashboard). |
| Loading States | Submit button shows loading state. Form is disabled during submission. |
| Error States | Generic error message for invalid credentials. Network error message. |
| Responsive | Card scales appropriately on all breakpoints. |
| Accessibility | Form fields have labels. Error messages are associated with form. Keyboard navigable. |

### Page: /register

| Attribute | Detail |
|-----------|--------|
| Purpose | Create a new user account. |
| Layout | Centered card on neutral background. |
| Components | Email input, password input, confirm password input, submit button, error alert, link to /login. |
| States | Default, submitting, validation error, duplicate email error, success (redirect to /dashboard). |
| Loading States | Submit button loading state. Form disabled during submission. |
| Error States | Validation errors per field. Duplicate email error. Network error. |
| Accessibility | All inputs labeled. Password requirements communicated before submission. Errors are accessible. |

### Page: /dashboard

| Attribute | Detail |
|-----------|--------|
| Purpose | Overview of user scan activity and navigation hub. |
| Layout | Top navigation bar, main content area with summary cards, recent scan preview. |
| Components | Stats cards (total scans, scans by risk level), recent scan card, quick action buttons (New Scan, View History). |
| User Actions | Navigate to Scanner, navigate to History, click on recent scan. |
| States | Loaded, loading, empty (no scans yet), error. |
| Empty States | "No scans yet. Start your first scan." with CTA button. |
| Loading States | Skeleton placeholders for stat cards. |
| Error States | Error banner with retry option. |
| Responsive | Stats cards stack on mobile. |
| Accessibility | Stats communicated as text, not only visual. |

### Page: /scanner

| Attribute | Detail |
|-----------|--------|
| Purpose | Primary analysis tool. User selects analysis type and submits content. |
| Layout | Analysis type selector (tabs or radio), text area (conditionally shown), URL input (conditionally shown), submit button. |
| Components | Analysis type selector, text area with character counter, URL input field, submit button, inline validation messages. |
| User Actions | Select analysis type, enter text, enter URL, submit. |
| States | Default, typing, submitting (loading), validation error, success (redirect to /results/:scanId). |
| Loading States | Spinner or progress indicator during analysis. Submit button disabled. |
| Error States | Inline validation errors. Server error message. |
| Responsive | Full-width on mobile. Side-by-side layout option on desktop. |
| Accessibility | Labels for all inputs. Character counter is announced. Loading state communicated to screen readers. |

### Page: /results/:scanId

| Attribute | Detail |
|-----------|--------|
| Purpose | Display the full analysis result for a completed scan. |
| Layout | Top: risk level badge + score. Middle: detected indicators list. Bottom: explanation + recommendations. |
| Components | Risk score display, risk level badge, indicator cards, evidence excerpts, explanation text, recommendation block, delete scan button, back to history link. |
| User Actions | Read results, delete scan, navigate back to history. |
| States | Loaded, loading, scan not found (404), unauthorized (403). |
| Error States | 404 for scan not found. 403 for unauthorized. Generic server error. |
| Responsive | Single column on mobile. |
| Accessibility | Risk level communicated as text, not only by color. Indicator list is keyboard navigable. |

### Page: /history

| Attribute | Detail |
|-----------|--------|
| Purpose | List of all past scans for the authenticated user. |
| Layout | Navigation bar, paginated table or card list of scans. |
| Components | Scan list (date, type, risk level badge, link), pagination controls, delete button per scan. |
| User Actions | Click scan to view result, delete scan, paginate. |
| States | Loaded, loading, empty, error. |
| Empty States | "No scan history. Start scanning." with CTA. |
| Loading States | Skeleton list. |
| Responsive | Table collapses to card list on mobile. |
| Accessibility | Table has proper headers. Risk levels are text-labeled, not only color. |

### Page: /profile

| Attribute | Detail |
|-----------|--------|
| Purpose | Display and manage user account information. |
| Components | Email display, account creation date, logout button. |
| User Actions | Logout. |
| Accessibility | Logout button is clearly labeled. |

### Page: /about

| Attribute | Detail |
|-----------|--------|
| Purpose | Explain the product, its AI approach, its limitations, and the disclaimer. |
| Components | How it works section, AI approach section, limitations section, disclaimer block. |
| User Actions | Read, navigate to scanner. |
| Accessibility | Proper heading hierarchy. |

---

## 20. UI/UX Design System

**[PROPOSED]**

### Design Philosophy

Priority: Trust > Clarity > Readability > Professionalism > Accessibility

The UI must NOT be unnecessarily flashy. Avoid excessive animations, bright neon colors, or entertainment-oriented design language.

### Color Palette Direction

| Role | Direction |
|------|-----------|
| Primary | Deep blue or slate blue - conveys trust, technology, security. |
| Background | Very dark navy or near-black for dark areas; near-white or light gray for light areas. |
| Surface | Dark cards on dark backgrounds; light cards on light backgrounds. |
| Risk: LOW | Muted green or teal - not too saturated. |
| Risk: MEDIUM | Amber or yellow - neutral attention, not alarming. |
| Risk: HIGH | Orange - clear warning signal. |
| Risk: CRITICAL | Red - must be accompanied by text label (not color-only). |
| Text Primary | High-contrast relative to background. |
| Text Secondary | Minimum 4.5:1 contrast ratio. |

### Typography Direction

| Element | Direction |
|---------|-----------|
| Headings | Clean sans-serif (e.g., Inter, Geist). Bold weight for primary headings. |
| Body text | Regular weight, minimum 16px base size. |
| Code / technical | Monospace for evidence excerpts, technical fields. |
| Risk labels | Semi-bold, visually distinct from body text. |

### Spacing System

- Consistent 4px or 8px base grid.
- Component internal padding: 16px or 24px.
- Section spacing: 32px or 48px.

### Component Specifications

**Cards:** Rounded corners (8-12px border-radius). Subtle shadow or border to distinguish from background.

**Buttons:**
- Primary: Filled, clear label, minimum touch target 44x44px.
- Secondary: Outlined or ghost style.
- Destructive: Red background or text, confirmation required before delete.
- Loading state: Spinner inside button, button disabled.

**Forms:** All inputs have visible labels (not just placeholder text). Validation errors appear below the relevant field. Required fields are indicated.

**Risk Indicators:** Risk level is always communicated as both a colored badge AND a text label. Color alone must never be the sole indicator of risk level (accessibility requirement).

**Navigation:** Top navigation bar on all authenticated pages. Mobile: hamburger menu or bottom navigation. Active route is visually indicated.

**Tables:** Column headers where applicable. Responsive: collapses to card list on small viewports.

**Charts/Statistics:** Dashboard stats are primarily numeric with text labels. No chart should rely solely on color to communicate information.

**Empty States:** Illustrated or iconographic empty states with a clear CTA. Not just blank space.

**Error States:** Inline for form validation. Banner/toast for network/server errors. Full-page error for critical navigation failures (404, 403, 500).

---

## 21. Backend Requirements

**[PROPOSED]**

### PROPOSED TECHNOLOGY STACK

> The following technology selections are **proposed** and have not been finalized. They represent the team's intended direction for the hackathon.

| Layer | Proposed Technology |
|-------|---------------------|
| Frontend | React + TypeScript |
| Backend API | FastAPI (Python) |
| Database | MongoDB |
| API Style | REST |
| Authentication | JWT (JSON Web Tokens) |
| AI/NLP | Python (scikit-learn / transformers - phase dependent) |
| Environment Config | Environment variables (.env) |

### Backend Architecture Principles

| Principle | Description |
|-----------|-------------|
| Layered Architecture | Route handlers -> Service layer -> Data access layer. Business logic must not be in route handlers. |
| Input Validation | All API inputs are validated before processing. Invalid inputs return structured error responses. |
| Error Handling | Global error handler returns consistent JSON error format. Internal error details are not exposed to the client. |
| Separation of Concerns | Analysis logic, risk engine, explainability generation, and recommendation engine are separate modules. |
| Configuration | All environment-specific values (secrets, thresholds, DB URI) are in environment variables, not hardcoded. |
| Logging | Structured logging for all API requests (without logging user-submitted content unnecessarily). |
| Model Abstraction | The AI analysis service is behind an interface; the underlying model can be swapped. |

### Proposed Directory Structure

`
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration / environment loading
│   ├── auth/                # Authentication module
│   ├── users/               # User routes and services
│   ├── scans/               # Scan routes and services
│   ├── analysis/            # Analysis pipeline modules
│   │   ├── text_analyzer.py
│   │   ├── url_analyzer.py
│   │   ├── risk_engine.py
│   │   ├── explainer.py
│   │   └── recommender.py
│   ├── models/              # Database models / schemas
│   └── utils/               # Shared utilities
├── tests/
├── requirements.txt
└── .env.example
`

---

## 22. API Requirements

**[PROPOSED]**

### API Conventions

| Convention | Standard |
|------------|---------|
| Base path | /api/v1/ |
| Authentication | Bearer token: Authorization: Bearer token |
| Content type | application/json |
| Error format | {"error": {"code": "ERROR_CODE", "message": "Human-readable message"}} |
| Success format | {"data": {...}} or {"data": [...]} |
| Pagination | page and limit query params. Response includes total, page, limit, data. |

### GET /api/v1/health

| Attribute | Detail |
|-----------|--------|
| Purpose | Health check for infrastructure monitoring. |
| Authentication | None required. |
| Request | No body. |
| Response 200 | {"status": "ok", "version": "1.0.0"} |
| Error Cases | None expected. |

### POST /api/v1/auth/register

| Attribute | Detail |
|-----------|--------|
| Purpose | Create a new user account. |
| Authentication | None required. |
| Request Body | {"email": "string", "password": "string"} |
| Validation | Email: valid format. Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit. |
| Response 201 | {"data": {"user_id": "string", "email": "string", "created_at": "ISO8601"}} |
| Error 400 | Validation failure (malformed email, weak password). |
| Error 409 | Email already registered. |

### POST /api/v1/auth/login

| Attribute | Detail |
|-----------|--------|
| Purpose | Authenticate a user and return a JWT access token. |
| Authentication | None required. |
| Request Body | {"email": "string", "password": "string"} |
| Validation | Both fields required. |
| Response 200 | {"data": {"access_token": "string", "token_type": "bearer", "expires_in": 3600}} |
| Error 400 | Validation failure. |
| Error 401 | Invalid credentials. Generic message - do not specify which field is wrong. |

### GET /api/v1/users/me

| Attribute | Detail |
|-----------|--------|
| Purpose | Return the profile of the currently authenticated user. |
| Authentication | Required (JWT). |
| Request | No body. |
| Response 200 | {"data": {"user_id": "string", "email": "string", "created_at": "ISO8601"}} |
| Error 401 | Invalid or missing token. |
| Authorization | User can only see their own profile. |

### POST /api/v1/scans

| Attribute | Detail |
|-----------|--------|
| Purpose | Submit content for analysis and create a new scan record. |
| Authentication | Required (JWT). |
| Request Body | {"analysis_type": "text|url|combined", "text": "string (optional)", "url": "string (optional)"} |
| Validation | analysis_type required. If type is "text" or "combined", text is required. If type is "url" or "combined", url is required. Text: 10-5000 chars. URL: valid http/https format. |
| Processing | Route to appropriate analysis module(s). Store result. |
| Response 201 | Full scan result object (see Section 16 schema). |
| Error 400 | Validation failure. |
| Error 401 | Unauthenticated. |
| Error 422 | Unprocessable entity (e.g., URL protocol not allowed). |
| Error 500 | Analysis pipeline failure (generic message, no internal detail). |
| Authorization | Scan is created for and owned by the authenticated user only. |

### GET /api/v1/scans

| Attribute | Detail |
|-----------|--------|
| Purpose | Retrieve a paginated list of all scans for the authenticated user. |
| Authentication | Required (JWT). |
| Query Parameters | page (default: 1), limit (default: 20, max: 100). |
| Response 200 | {"data": [...scans...], "total": N, "page": N, "limit": N} |
| Error 401 | Unauthenticated. |
| Authorization | Only the authenticated user's scans are returned. Strict ownership enforcement. |

### GET /api/v1/scans/{scan_id}

| Attribute | Detail |
|-----------|--------|
| Purpose | Retrieve the full result of a specific scan. |
| Authentication | Required (JWT). |
| Path Parameter | scan_id (string) |
| Response 200 | Full scan result object. |
| Error 401 | Unauthenticated. |
| Error 403 | Scan exists but belongs to a different user. |
| Error 404 | Scan not found. |
| Authorization | User can only retrieve their own scans. |

### DELETE /api/v1/scans/{scan_id}

| Attribute | Detail |
|-----------|--------|
| Purpose | Delete a specific scan from the user's history. |
| Authentication | Required (JWT). |
| Path Parameter | scan_id (string) |
| Response 200 | {"data": {"deleted": true}} |
| Error 401 | Unauthenticated. |
| Error 403 | Scan belongs to a different user. |
| Error 404 | Scan not found. |
| Authorization | User can only delete their own scans. |

### Future: POST /api/v1/analyze/image

| Attribute | Detail |
|-----------|--------|
| Purpose | Accept an image upload (screenshot) for OCR + analysis. |
| Status | FUTURE - not for MVP implementation. |
| Authentication | Required (JWT). |
| Request | Multipart form data with image file. |
| Processing | OCR text extraction -> text analysis pipeline. |


---

## 23. Database Requirements

**[PROPOSED]**

### Collection: users

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | MongoDB document ID. |
| user_id | string | Yes | Application-level unique identifier (UUID). |
| email | string | Yes | User email address. Unique index. |
| password_hash | string | Yes | Bcrypt hash of password. Never returned in API responses. |
| created_at | datetime | Yes | Account creation timestamp (UTC). |
| updated_at | datetime | Yes | Last update timestamp (UTC). |
| is_active | boolean | Yes | Account active status. Default: true. |

**Indexes:** email (unique index), user_id (unique index).

**Privacy:** password_hash must never be included in API responses. email is PII and must be treated accordingly.

### Collection: scans

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | MongoDB document ID. |
| scan_id | string | Yes | Application-level unique identifier (UUID). |
| user_id | string | Yes | Owning user's user_id. |
| analysis_type | string | Yes | "text", "url", or "combined". |
| submitted_text | string | Optional | The text submitted for analysis. |
| submitted_url | string | Optional | The URL submitted for analysis. |
| risk_score | integer | Yes | Final risk score (0-100). |
| risk_level | string | Yes | "LOW", "MEDIUM", "HIGH", or "CRITICAL". |
| indicators | array | Yes | Array of detected indicator objects. |
| text_sub_score | integer | Optional | Text analysis sub-score (0-100). Present if type is "text" or "combined". |
| url_sub_score | integer | Optional | URL analysis sub-score (0-100). Present if type is "url" or "combined". |
| summary | string | Yes | Plain-language summary explanation. |
| recommendation | string | Yes | Safety recommendation text. |
| low_confidence | boolean | Yes | Whether the AI classifier flagged low confidence. |
| model_version | string | Yes | Version of the analysis model used. |
| created_at | datetime | Yes | Scan creation timestamp (UTC). |

**Indexes:** user_id (index), scan_id (unique index), created_at (index), compound {user_id: 1, created_at: -1} for paginated history queries.

**Data Retention:** Scan data retention policy is an open question (see Section 41). A future cleanup process should be considered.

**Privacy:** submitted_text and submitted_url are user-generated content. Storage must be disclosed to users. Users must be able to delete their own scans.

### Future Collections

- **model_versions** - Track trained model metadata: model_id, model_version, training_date, evaluation_summary, dataset_version, is_active.
- **analysis_events** - Audit logging of analysis pipeline events (model failures, confidence flags, performance anomalies).
- **threat_intelligence** - Caching external threat intelligence lookups on URL domains.

---

## 24. Security Requirements

**[PROPOSED]**

### Authentication Security

| Requirement | Detail |
|-------------|--------|
| Password hashing | Passwords hashed using bcrypt (minimum cost factor 12). Never stored in plaintext. |
| JWT signing | JWT signed with a strong secret (minimum 256-bit entropy) using HS256 or RS256. |
| JWT expiry | Access tokens expire (proposed: 1 hour). Refresh token mechanism is a future enhancement. |
| JWT storage | Frontend stores JWT in memory or secure httpOnly cookie (not localStorage in production). |
| JWT validation | Every protected route validates JWT signature, expiry, and issuer. |
| Brute force | Rate limiting on login and registration endpoints to prevent brute-force attacks. |
| Failed login | Return generic 401. Do not reveal whether the email exists or the password was wrong. |

### Authorization Security

| Requirement | Detail |
|-------------|--------|
| Ownership enforcement | Every scan retrieval, update, and deletion must verify that the requesting user owns the resource. |
| No horizontal access | A user must never be able to access, modify, or delete another user's data. |
| Admin functions | No admin-level endpoints are exposed in the public API for MVP. |

### Input Validation and Sanitization

| Requirement | Detail |
|-------------|--------|
| All inputs validated | Every API endpoint validates all input fields before processing. |
| Validation library | Use schema validation library (e.g., Pydantic for FastAPI). |
| Text input | Enforce minimum and maximum character limits. Strip or reject null bytes. |
| URL input | Enforce protocol allowlist (http/https only). Validate format. |
| Injection prevention | All database queries use parameterized queries / ORM abstractions. No raw string concatenation into queries. |

### CORS

| Requirement | Detail |
|-------------|--------|
| Origin restriction | CORS must only allow the specific frontend origin(s). Wildcard * is not acceptable in production. |
| Methods | Only GET, POST, DELETE, OPTIONS permitted. |
| Headers | Only required headers allowed. |

### Rate Limiting (Proposed Defaults)

| Endpoint | Proposed Limit |
|----------|----------------|
| POST /api/v1/auth/login | 10 requests per minute per IP. |
| POST /api/v1/auth/register | 5 requests per minute per IP. |
| POST /api/v1/scans | 20 requests per minute per authenticated user. |
| GET /api/v1/scans | 60 requests per minute per authenticated user. |

### Secrets Management

| Requirement | Detail |
|-------------|--------|
| No hardcoded secrets | JWT secrets, database URIs, API keys must never be hardcoded in source code. |
| Environment variables | All secrets loaded from environment variables or a secrets manager. |
| .env files | .env files must be in .gitignore and never committed to version control. |
| .env.example | A template file with key names but no values must be provided. |

### MongoDB Security

| Requirement | Detail |
|-------------|--------|
| Authentication required | MongoDB must require authentication. |
| Least privilege | The application database user must have read/write access only to the application database. |
| Connection string | Connection string stored as environment variable. Not logged. |
| IP allowlist | Production MongoDB should allowlist only the backend server's IP. |

### URL Security

| Requirement | Detail |
|-------------|--------|
| Protocol allowlist | Only http:// and https:// accepted. All other protocols rejected with 422. |
| SSRF protection | If outbound URL fetching is introduced, full SSRF protection suite must be implemented (see Section 12). |
| No outbound requests in MVP | The MVP text/URL analyzer must not make outbound HTTP requests to submitted URLs. |

### Logging and Error Handling

| Requirement | Detail |
|-------------|--------|
| Structured logging | All server-side logs are structured (JSON format preferred). |
| No sensitive data in logs | User-submitted content should not be logged. |
| No stack traces in responses | API error responses must not include stack traces or internal error details. |
| Generic error messages | Server errors return a generic 500 message to the client. Internal details are only in server logs. |

---

## 25. Privacy Requirements

**[PROPOSED]**

### Data Collected

| Data Item | Why Collected | How Long Stored |
|-----------|---------------|-----------------|
| Email address | User identity and authentication. | Until account deletion. |
| Password hash | Authentication. | Until account deletion. |
| Submitted text (scan) | Required to perform analysis and display results in history. | Until user deletes the scan or account. |
| Submitted URL (scan) | Required to perform analysis and display results in history. | Until user deletes the scan or account. |
| Scan result (risk score, indicators, explanation) | To allow users to review their scan history. | Until user deletes the scan or account. |
| Scan metadata (timestamp, analysis type) | For dashboard statistics and history. | Until user deletes the scan or account. |

### What Is NOT Collected

- Device fingerprints or identifiers.
- IP addresses (beyond what may be logged by infrastructure).
- Browser or device metadata.
- Behavioral analytics beyond basic scan counts.

### Training Data Consent

- User-submitted scan content will NOT be used for model training without explicit, documented user consent.
- Consent must be actively given (opt-in), not passively assumed.

### Data Access

- Users can view all their scan data through the application.
- Users can delete individual scans.

### Data Retention Policy

- Retention period is an open question (see Section 41).
- A data retention policy must be defined before production deployment.

### Compliance Note

- This document does not claim GDPR, CCPA, or any other regulatory compliance.
- Compliance requirements must be assessed by a qualified legal advisor before production deployment.

---

## 26. Performance Requirements

**[PROPOSED - all values are TARGETS, not guaranteed performance]**

> All targets below are proposed under expected hackathon-scale load. They are not performance guarantees. Actual performance depends on hosting environment, model size, and database indexing.

| Requirement | Target | Category |
|-------------|--------|----------|
| Landing page load (initial) | < 3 seconds on standard broadband | TARGET |
| API response: health check | < 100ms | TARGET |
| API response: login/register | < 500ms | TARGET |
| API response: text analysis (rule-based baseline) | < 2 seconds | TARGET |
| API response: text analysis (ML model inference) | < 5 seconds | TARGET |
| API response: URL analysis | < 1 second | TARGET |
| API response: combined analysis | < 5 seconds | TARGET |
| Database query: scan retrieval by scan_id | < 100ms with proper indexing | TARGET |
| Database query: scan list (paginated) | < 200ms with proper indexing | TARGET |
| Frontend bundle size | < 500KB gzipped | TARGET |

---

## 27. Accessibility

**[PROPOSED - WCAG 2.1 Level AA target]**

| Requirement | Detail |
|-------------|--------|
| Keyboard navigation | All interactive elements (buttons, links, form inputs) must be reachable and operable via keyboard. |
| Screen reader support | All pages must be navigable using a screen reader. Semantic HTML is required. |
| Form labels | Every form input must have an associated label element. Placeholder text is not a substitute for a label. |
| Accessible error messages | Error messages must be programmatically associated with their corresponding input fields (aria-describedby). |
| Focus states | All interactive elements must have a visible focus indicator that meets contrast requirements. |
| Semantic HTML | Use appropriate HTML elements: headings in correct hierarchy, lists for lists, buttons for actions, links for navigation. |
| Risk indicators | Risk level must never be communicated only through color. Every risk indicator must include a text label alongside the color coding. |
| Color contrast | Text and background color combinations must meet WCAG 2.1 AA contrast ratio (minimum 4.5:1 for normal text, 3:1 for large text). |
| Alt text | All images and icons that convey information must have descriptive alt text. |
| Loading states | Loading states must be communicated to screen readers using aria-live regions or equivalent. |


---

## 28. Testing Strategy

**[PROPOSED]**

### Unit Tests

| Target | Examples |
|--------|---------|
| Text indicator extraction | Test each indicator (TI-01 through TI-09) with positive and negative examples. |
| URL feature extraction | Test each URL signal (UI-01 through UI-10) with examples. |
| Risk score calculation | Test score normalization. Test edge cases (0 indicators, all indicators). |
| Combined score formula | Test weighting logic with known inputs. |
| Explanation generation | Test output format and content for each risk level. |
| Recommendation selection | Test correct recommendation for each risk level. |
| Input validation | Test all validation rules (email format, password strength, text length, URL format). |
| JWT generation and validation | Test token issuance and validation. |

### Integration Tests

| Target | Examples |
|--------|---------|
| Analysis pipeline | Submit test text -> verify indicator list + score is correct. |
| Risk engine integration | Verify detected indicators produce expected risk level. |
| API + database | Submit scan via API -> verify scan is saved and retrievable. |
| Auth + protected routes | Verify protected routes reject unauthenticated requests. |

### API Tests

| Test | Expected Outcome |
|------|-----------------|
| POST /auth/register with valid data | 201, user created. |
| POST /auth/register with duplicate email | 409. |
| POST /auth/register with weak password | 400 with validation details. |
| POST /auth/login with valid credentials | 200, JWT returned. |
| POST /auth/login with invalid credentials | 401, generic message. |
| GET /users/me without token | 401. |
| GET /users/me with valid token | 200, user data returned. |
| POST /scans with valid text | 201, scan result returned. |
| POST /scans with non-http URL | 422. |
| POST /scans without authentication | 401. |
| GET /scans/{scan_id} for another user's scan | 403. |
| GET /scans/{scan_id} that doesn't exist | 404. |
| DELETE /scans/{scan_id} for owned scan | 200. |
| DELETE /scans/{scan_id} for another user's scan | 403. |

### Frontend Tests

| Type | Scope |
|------|-------|
| Component tests | Render tests for key UI components (Risk badge, Indicator card, Scanner form). |
| Form validation | Verify that validation errors appear for invalid inputs. |
| Navigation | Verify routing between pages. |
| Authentication flow | Login, register, logout. |
| Scan submission flow | Submit form -> loading state -> result displayed. |

### Security Tests

| Test | Method |
|------|--------|
| JWT manipulation | Submit modified or forged JWT tokens. Verify rejection. |
| Horizontal access | Attempt to access another user's scan by ID. Verify 403. |
| NoSQL injection | Submit injection payloads in text and URL fields. Verify sanitization. |
| Rate limit testing | Exceed rate limits on login endpoint. Verify 429 response. |
| CORS validation | Submit requests from unauthorized origins. Verify rejection. |
| URL protocol injection | Submit javascript://, file://, data:// URLs. Verify 422. |

### URL Security Tests

| Test | Expected Outcome |
|------|-----------------|
| Submit javascript://evil | 422 - protocol not allowed. |
| Submit file:///etc/passwd | 422 - protocol not allowed. |
| Submit ftp://example.com | 422 - protocol not allowed. |
| Submit URL with raw IP (private range) | Accepted for analysis; flagged as UI-02; no outbound request made. |
| Submit extremely long URL (>2000 chars) | 400 or 422 - input too long. |
| Submit URL with no scheme | 400 - invalid URL format. |

### AI Test Scenarios

| Scenario | Input | Expected Risk Level |
|----------|-------|---------------------|
| Strong guaranteed return + urgency | "Guaranteed 500% returns. Only 3 spots left. Join now." | HIGH or CRITICAL |
| Generic educational content | "Learn how to invest in index funds for long-term growth." | LOW |
| Payment solicitation | "Send 0.1 BTC to this wallet to start trading." | CRITICAL |
| Single mild urgency phrase only | "Don't miss today's market opening." | LOW to MEDIUM |
| Multiple FOMO + testimonials | "Join 50,000 members. Everyone is profiting. You're missing out." | MEDIUM to HIGH |

### End-to-End Tests

Full user journey test covering: register -> login -> submit scan -> view result -> view history -> logout.

### Browser Tests

- Chrome (latest)
- Firefox (latest)
- Safari (latest, if feasible)
- Mobile viewport (Chrome DevTools emulation as minimum)

---

## 29. AI Evaluation

**[PROPOSED]**

### Evaluation Principle

> No accuracy score, F1 score, or any other performance metric will be claimed before actual evaluation on a real test set. Any metric mentioned in this document is a target or example, not a reported result.

### Required Evaluation Metrics

| Metric | Description |
|--------|-------------|
| Precision | Of all content the model flagged as suspicious, what fraction was correctly flagged? |
| Recall | Of all truly suspicious content, what fraction did the model correctly detect? |
| F1 Score | Harmonic mean of precision and recall. |
| Confusion Matrix | True positives, false positives, true negatives, false negatives. |
| False Positive Rate | Rate at which legitimate content is incorrectly flagged as suspicious. |
| False Negative Rate | Rate at which suspicious content is missed. |
| Confidence Distribution | Distribution of model confidence scores across the test set. |

### Minimum Evaluation Methodology

1. Reserve a held-out test set not used during training or validation.
2. Run the full analysis pipeline on every test example.
3. Compare predicted labels to ground-truth labels.
4. Calculate all metrics above.
5. Record results in an evaluation report.
6. Document the test set size, composition, and source.
7. Note any known biases or limitations of the test set.
8. Include the evaluation report in the project repository.

### Evaluation Report Template

`
AI Evaluation Report

Model Version: [version]
Evaluation Date: [date]
Dataset Version: [version]
Test Set Size: [N examples]
Test Set Composition: [X% suspicious, Y% not_suspicious]

Metrics Table:
Precision: TBD
Recall: TBD
F1 Score: TBD
FP Rate: TBD
FN Rate: TBD

Confusion Matrix: TBD after evaluation

Notes: [Known limitations, biases, or caveats about this evaluation.]
`

---

## 30. Hackathon Demo

**[PROPOSED - Target: under 10 minutes]**

| Step | Action | What Evaluators See |
|------|--------|---------------------|
| 1 | Introduce the problem | Presenter describes the investment scam problem and why it matters. |
| 2 | Open ScamShield AI | Landing page displayed. Clean, professional design. |
| 3 | Login | Login page -> submit credentials -> redirect to dashboard. |
| 4 | Submit suspicious investment text | Scanner open. Text Analysis selected. Prepared CRITICAL test example pasted. |
| 5 | Show AI analysis in progress | Loading state with spinner. |
| 6 | Show risk score | Result page: numeric score (e.g., 78/100) + CRITICAL badge. |
| 7 | Show detected indicators | Indicator cards: Guaranteed Return Claim, Urgency Tactic, Payment Solicitation. |
| 8 | Show explanation | Explanation text for each indicator. Evidence excerpt highlighted. |
| 9 | Show safety recommendation | CRITICAL recommendation block. |
| 10 | Submit suspicious URL | Return to scanner. URL Analysis selected. Test URL submitted. |
| 11 | Show URL analysis result | Detected signals (IP host, suspicious keywords, URL shortener). |
| 12 | Submit combined text + URL | Combined Analysis selected. Both prepared inputs submitted. |
| 13 | Show combined risk result | Sub-scores shown. Combined score. Aggregated explanation. |
| 14 | Show scan history | Navigate to /history. List of past scans with risk level badges. |
| 15 | Show dashboard | Dashboard with scan counts by risk level. |
| 16 | Explain AI architecture | Rule-based baseline, ML abstraction layer, model versioning. |
| 17 | Explain security and privacy | JWT auth, input validation, no outbound URL requests in MVP, SSRF protection design. |
| 18 | Explain future roadmap | Screenshot analysis, threat intelligence, browser extension. |

### Prepared Demo Test Cases

**Text Demo 1 (CRITICAL expected):**
Guaranteed 500% returns monthly! Join our exclusive VIP trading group on Telegram NOW.
Only 3 spots left. Send 200 USDT to activate your account. 50,000+ members already
profiting. Don't be left behind. Limited time closes at midnight tonight!

**Text Demo 2 (LOW expected):**
Index funds are a popular investment choice for long-term investors seeking diversification.
Past performance does not guarantee future results. Always consult a licensed financial advisor.

**URL Demo 1 (MEDIUM/HIGH expected):**
http://guaranteed-profit-trading.invest-now.biz/join?bonus=500&ref=vip&expires=today

---

## 31. Future Roadmap

**[PROPOSED - all phases are FUTURE and must NOT be implemented before MVP approval]**

### PHASE 1: Foundation

| Element | Detail |
|---------|--------|
| Objective | Establish the core web application infrastructure. |
| Features | User authentication, dashboard skeleton, scanner UI, basic health check API. |
| Dependencies | Technology stack selected. Development environment configured. Database instance provisioned. |
| Deliverables | Working login/register flow. Empty scanner page. Working /api/v1/health endpoint. |
| Acceptance Criteria | User can register, log in, access the dashboard, and navigate to the scanner. All pages are responsive. |

### PHASE 2: Text AI / NLP

| Element | Detail |
|---------|--------|
| Objective | Implement the core text analysis capability. |
| Features | Rule-based indicator extraction (TI-01 through TI-09), risk scoring engine, explainability layer, safety recommendations, scan storage, result page. |
| Dependencies | Phase 1 complete. Dataset available (or synthetic examples for baseline). |
| Deliverables | Working text analysis API endpoint. Result page showing indicators and explanation. Scan history. |
| Acceptance Criteria | All 9 text indicators are detected in appropriate test cases. Risk score and level are correct. Scans are saved and retrievable. |

### PHASE 3: URL Analysis

| Element | Detail |
|---------|--------|
| Objective | Add URL signal extraction to the analysis pipeline. |
| Features | URL validation, normalization, feature extraction (UI-01 through UI-10), URL risk scoring, combined text + URL analysis. |
| Dependencies | Phase 2 complete. |
| Deliverables | Working URL and combined analysis API endpoints. |
| Acceptance Criteria | URL signals detected in appropriate test cases. Combined analysis produces correct aggregated scores. SSRF-related risks documented. |

### PHASE 4: Screenshot / Image Analysis + OCR

| Element | Detail |
|---------|--------|
| Objective | Allow users to upload screenshots of investment promotions. |
| Features | Image upload UI, file type and size validation, OCR text extraction, extracted text routed to text analysis pipeline, image result page. |
| Dependencies | Phase 2 complete. OCR service selected and integrated. Secure file upload infrastructure. |
| Deliverables | Working image analysis endpoint and UI. |
| Acceptance Criteria | User can upload a screenshot. OCR extracts readable text. Text is analyzed by text pipeline. Uploaded files are scanned for malware before processing. |

### PHASE 5: Advanced Threat Intelligence

| Element | Detail |
|---------|--------|
| Objective | Enrich URL analysis with external reputation data. |
| Features | Domain reputation lookup (e.g., VirusTotal API), WHOIS domain age check, blacklist status check, threat intelligence signal added to URL score. |
| Dependencies | Phase 3 complete. External API keys sourced and secured. SSRF protection fully implemented. |
| Deliverables | Enriched URL analysis results with domain reputation data. |
| Acceptance Criteria | Domain reputation data correctly fetched, attributed, and displayed. API failures handled gracefully. Rate limits on external APIs are respected. |

### PHASE 6: Production Hardening and Deployment

| Element | Detail |
|---------|--------|
| Objective | Prepare the application for production deployment at scale. |
| Features | Full SSRF protection, rate limiting hardening, refresh token mechanism, account deletion feature, data retention automation, monitoring and alerting, CI/CD pipeline. |
| Dependencies | Phases 1-5 complete. Production hosting providers selected. |
| Deliverables | Production-ready deployment. Monitoring dashboards. CI/CD pipeline. Security audit completed. |
| Acceptance Criteria | Application passes security review. Monitoring is in place. Data retention policy is automated. |


---

## 32. Deployment Requirements

**[PROPOSED - all providers listed are PROPOSED OPTIONS, not final selections]**

### Proposed Deployment Architecture

| Component | Proposed Option |
|-----------|----------------|
| Frontend | Vercel or equivalent static/SSR hosting. |
| Backend API | Cloud-hosted container (e.g., Railway, Render, Google Cloud Run, or equivalent). |
| Database | MongoDB Atlas (managed cloud MongoDB) or equivalent. |
| AI Model | Local inference within the backend container (CPU-based for MVP). GPU hosting for future transformer model. |

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| JWT_SECRET | Secret key for JWT signing. |
| JWT_EXPIRY_SECONDS | Token expiry duration. |
| MONGODB_URI | MongoDB connection string. |
| MONGODB_DB_NAME | Database name. |
| CORS_ALLOWED_ORIGINS | Comma-separated list of allowed frontend origins. |
| RATE_LIMIT_LOGIN | Rate limit for login endpoint. |
| RISK_THRESHOLD_LOW | Upper bound for LOW risk level. |
| RISK_THRESHOLD_MEDIUM | Upper bound for MEDIUM risk level. |
| RISK_THRESHOLD_HIGH | Upper bound for HIGH risk level. |
| TEXT_WEIGHT | Weight of text sub-score in combined analysis. |
| URL_WEIGHT | Weight of URL sub-score in combined analysis. |
| MODEL_CONFIDENCE_THRESHOLD | Confidence threshold below which low_confidence flag is set. |
| FRONTEND_URL | Frontend URL (for CORS and links). |

### Production Requirements

| Requirement | Detail |
|-------------|--------|
| HTTPS | All production traffic must use HTTPS. |
| CORS | Restrict to specific frontend origin(s). |
| Database security | MongoDB Atlas IP allowlist, strong authentication, encrypted at rest. |
| Secrets | No secrets in version control. Use environment variables or secrets manager. |
| Error tracking | Integrate error tracking (e.g., Sentry or equivalent) in future production deployment. |
| Backups | Database backup policy must be defined before production use. |

---

## 33. Monitoring

**[PROPOSED - for future production deployment]**

| Signal | Description |
|--------|-------------|
| API uptime | Alert if API is unreachable for > 1 minute. |
| API error rate | Alert if 5xx error rate exceeds threshold. |
| Analysis latency | Track p50, p95, p99 latency for scan endpoint. |
| Model failures | Log and alert on model inference failures. Fallback to rule-based baseline. |
| Database failures | Alert on connection failures, high latency. |
| Security events | Log and alert on unusual rate of 401/403 responses, rate limit triggers. |

### Privacy in Monitoring

- Monitoring systems must not log user-submitted content.
- Log metadata only (timestamps, request IDs, status codes, latencies).

---

## 34. Limitations

**[PROPOSED - explicit acknowledgment of system limitations]**

| Limitation | Description |
|------------|-------------|
| AI can make mistakes | The system uses probabilistic methods. It will produce incorrect results on some inputs. |
| False positives occur | Legitimate content may sometimes be flagged with elevated risk scores. |
| False negatives occur | Some genuinely fraudulent content may receive a low risk score. |
| URL signals do not prove fraud | Structural URL features are weak signals. A URL matching multiple patterns is not confirmed as fraudulent. |
| Text indicators do not prove fraud | The presence of investment promotion language does not legally or factually confirm fraud. |
| Model accuracy depends on data | AI classifier performance depends entirely on the quality, size, and representativeness of training data. |
| Language limitation | The MVP is designed for English-language content. Non-English content may produce unreliable results. |
| Results should be verified independently | Users must not rely solely on ScamShield AI results. Independent verification is always required. |
| No real-time threat data in MVP | The MVP does not incorporate live threat intelligence data. |
| No legal authority | ScamShield AI does not have authority to determine whether any content or entity is engaged in illegal activity. |

---

## 35. Product Disclaimer

**[PROPOSED DISCLAIMER - to be reviewed by the team and legal advisor before production]**

> ScamShield AI provides automated risk assessment based on detected signals. Results are not guaranteed fraud determinations or financial advice. The system may produce false positives or false negatives. Always independently verify investment opportunities and sources before making any financial decisions. ScamShield AI does not make legal determinations and does not accuse any individual or entity of criminal activity.

This disclaimer must be:
- Displayed on the /about page.
- Displayed below every scan result.
- Included in the product documentation.

---

## 36. Requirements Prioritization

**[PROPOSED]**

| Priority | Label | Meaning |
|----------|-------|---------|
| P0 | Must Have | Required for hackathon demonstration. Product fails without this. |
| P1 | Should Have | Significantly improves product quality. Should be included if time permits. |
| P2 | Could Have | Nice to have. Included only if P0 and P1 are complete. |
| P3 | Future | Post-hackathon future development. |

| ID | Requirement | Priority |
|----|-------------|----------|
| R-01 | User registration and login | P0 |
| R-02 | JWT authentication | P0 |
| R-03 | Text analysis with rule-based indicators | P0 |
| R-04 | Risk scoring engine | P0 |
| R-05 | Explainable result output | P0 |
| R-06 | Safety recommendations | P0 |
| R-07 | Scan result storage | P0 |
| R-08 | Scan result page | P0 |
| R-09 | Input validation and sanitization | P0 |
| R-10 | Password hashing | P0 |
| R-11 | URL analysis | P1 |
| R-12 | Combined text + URL analysis | P1 |
| R-13 | Scan history page | P1 |
| R-14 | Dashboard with statistics | P1 |
| R-15 | Rate limiting | P1 |
| R-16 | CORS configuration | P1 |
| R-17 | ML classifier (TF-IDF + Logistic Regression) | P1 |
| R-18 | Responsive UI | P1 |
| R-19 | Accessibility (WCAG 2.1 AA) | P1 |
| R-20 | Unit tests | P1 |
| R-21 | API tests | P1 |
| R-22 | Low confidence flag | P2 |
| R-23 | Scan deletion | P2 |
| R-24 | Profile page | P2 |
| R-25 | About page with disclaimer | P2 |
| R-26 | AI evaluation report | P2 |
| R-27 | Transformer-based classifier | P3 |
| R-28 | Screenshot / OCR analysis | P3 |
| R-29 | Threat intelligence integration | P3 |
| R-30 | Browser extension | P3 |
| R-31 | Refresh token mechanism | P3 |
| R-32 | Multi-language support | P3 |
| R-33 | Account deletion | P3 |
| R-34 | Public API | P3 |
| R-35 | CI/CD pipeline | P3 |

---

## 37. Functional Requirements Table

| ID | Requirement | Priority | User | Input | Output | Dependencies | Acceptance Criteria |
|----|-------------|----------|------|-------|--------|-------------|---------------------|
| FR-01 | User can register with email and password | P0 | All | Email, Password | User account created | None | Duplicate email rejected. Weak password rejected. |
| FR-02 | User can log in with valid credentials | P0 | All | Email, Password | JWT access token | FR-01 | Invalid credentials return generic 401. |
| FR-03 | Authenticated user can access protected routes | P0 | All | JWT token | Protected resource | FR-02 | Unauthenticated requests return 401. |
| FR-04 | User can submit text for analysis | P0 | All | Text (10-5000 chars) | Risk result | FR-02, FR-03 | At least 9 indicator types evaluated. |
| FR-05 | System extracts text risk indicators | P0 | System | Text | Indicator list | None | Each indicator has code, name, severity, evidence. |
| FR-06 | System calculates risk score and level | P0 | System | Indicators | Score (0-100), Level | FR-05 | Score within range. Level matches threshold. |
| FR-07 | System generates plain-language explanation | P0 | System | Indicators + Score | Explanation text | FR-06 | Explanation answers all 5 explainability questions. |
| FR-08 | System generates safety recommendation | P0 | System | Risk Level | Recommendation text | FR-06 | Recommendation appropriate for risk level. |
| FR-09 | Scan result is stored in database | P0 | System | Scan result object | Persisted scan | FR-06, FR-07, FR-08 | Scan retrievable by scan_id. Owned by submitting user. |
| FR-10 | User can view individual scan result | P0 | All | scan_id (own scan) | Full result page | FR-09 | 403 if not owned by user. 404 if not found. |
| FR-11 | User can submit URL for analysis | P1 | All | URL (http/https) | Risk result | FR-02, FR-03 | Non-http/https protocols rejected with 422. |
| FR-12 | System extracts URL risk signals | P1 | System | URL | URL signal list | None | All defined UI signals evaluated. |
| FR-13 | User can submit text + URL for combined analysis | P1 | All | Text + URL | Combined risk result | FR-04, FR-11 | Sub-scores and combined score returned. |
| FR-14 | User can view scan history | P1 | All | JWT token | Paginated scan list | FR-09 | Only own scans shown. Paginated. |
| FR-15 | User can view dashboard statistics | P1 | All | JWT token | Scan counts by level | FR-09 | Counts are accurate. Empty state shown. |
| FR-16 | User can delete a scan | P2 | All | scan_id (own scan) | Scan deleted | FR-09 | Cannot delete another user's scan. |
| FR-17 | System rejects inputs that fail validation | P0 | System | Invalid input | 400/422 error | None | Structured error response. |
| FR-18 | Passwords are hashed before storage | P0 | System | Plain password | Hashed password | None | Hash is never returned in any API response. |
| FR-19 | User cannot access another user's scans | P0 | System | scan_id (other user) | 403 Forbidden | FR-09 | Strict ownership check. |

---

## 38. Non-Functional Requirements Table

| ID | Category | Requirement | Priority | Acceptance Criteria |
|----|----------|-------------|----------|---------------------|
| NFR-01 | Security | Passwords hashed using bcrypt or equivalent. | P0 | No plaintext password in database or logs. |
| NFR-02 | Security | JWT tokens are signed and validated. | P0 | Modified tokens are rejected. |
| NFR-03 | Security | All inputs are validated and sanitized. | P0 | Injection payloads produce validation errors, not system failures. |
| NFR-04 | Security | CORS is restricted to allowed origins. | P1 | Requests from disallowed origins are rejected. |
| NFR-05 | Security | Rate limiting is applied to sensitive endpoints. | P1 | Exceeding limit returns 429. |
| NFR-06 | Security | No stack traces are exposed in API responses. | P0 | 500 responses contain generic message only. |
| NFR-07 | Security | Secrets are stored in environment variables. | P0 | No secrets in source code or git history. |
| NFR-08 | Security | URL analysis does not make outbound HTTP requests (MVP). | P0 | No outbound requests to submitted URLs. |
| NFR-09 | Performance | Text analysis result returned within 5 seconds (target). | P0 | Target, not guaranteed. |
| NFR-10 | Performance | Page load under 3 seconds (target). | P1 | Target, not guaranteed. |
| NFR-11 | Performance | Database queries use appropriate indexes. | P1 | Query explain plans show index usage. |
| NFR-12 | Scalability | Backend API is stateless and horizontally scalable in design. | P1 | No session state stored in-memory on the server. |
| NFR-13 | Reliability | Analysis pipeline falls back to rule-based baseline if ML model fails. | P1 | Rule-based results returned when model is unavailable. |
| NFR-14 | Accessibility | All pages meet WCAG 2.1 Level AA. | P1 | Manual and automated a11y testing passes. |
| NFR-15 | Privacy | User-submitted content is not used for training without consent. | P0 | No training pipeline reads from live scan data without consent mechanism. |
| NFR-16 | Privacy | Scan data is accessible only to the owning user. | P0 | Authorization check on all scan access. |
| NFR-17 | Maintainability | Risk thresholds and weights are configurable without code changes. | P1 | Configuration via environment variables. |
| NFR-18 | Maintainability | AI model is abstracted behind an interface. | P1 | Model can be swapped without changing API contract. |
| NFR-19 | Reliability | Application handles database connection errors gracefully. | P1 | Error responses are returned; application does not crash. |
| NFR-20 | Privacy | No PII is logged in application logs. | P1 | Log review shows no email addresses or submitted content. |


---

## 39. User Stories

**[PROPOSED]**

### Authentication

**US-01 - Registration**
As a new user, I want to register with my email and password, so that I can create a personal account and access the scanner.

**US-02 - Login**
As a registered user, I want to log in with my email and password, so that I can access my private dashboard and scan history.

**US-03 - Session Persistence**
As a logged-in user, I want my session to remain active for a reasonable period, so that I do not have to log in repeatedly during a single session.

**US-04 - Logout**
As a logged-in user, I want to log out of my account, so that my account is protected on shared devices.

### Scanning

**US-05 - Text Scanning**
As a user, I want to paste investment promotion text into the scanner, so that I can receive an AI-powered risk assessment of that content.

**US-06 - URL Scanning**
As a user, I want to paste a URL from an investment promotion into the scanner, so that I can receive a risk assessment of the URL's suspicious features.

**US-07 - Combined Scanning**
As a user, I want to submit both the text and the URL of an investment promotion together, so that I receive a comprehensive combined risk assessment.

### Results and Understanding

**US-08 - Viewing Results**
As a user, I want to see my scan result on a dedicated page, so that I can read the risk score, detected indicators, and explanation clearly.

**US-09 - Understanding Indicators**
As a user, I want each detected risk indicator to include a plain-language explanation and an excerpt from the submitted content, so that I understand exactly why the system flagged it.

**US-10 - Understanding the Risk Level**
As a user, I want the risk level to be clearly labeled (not just color-coded), so that I can understand the severity of the risk even if I have a color vision deficiency.

**US-11 - Receiving Recommendations**
As a user, I want to receive actionable safety recommendations based on the detected risk level, so that I know what steps to take after receiving the risk assessment.

**US-12 - No-Signal Result**
As a user, when no significant indicators are detected, I want to receive a clear explanation that no signals were found - and a reminder to still verify independently - so that I am not misled into thinking the content is verified safe.

### History and Dashboard

**US-13 - Viewing History**
As a user, I want to view a list of all my past scans with their dates and risk levels, so that I can reference my previous analyses.

**US-14 - Reviewing a Past Scan**
As a user, I want to click on any past scan in my history and view its full result, so that I do not need to re-run the same analysis.

**US-15 - Deleting a Scan**
As a user, I want to delete a scan from my history, so that I can remove content I no longer want stored in my account.

**US-16 - Dashboard Overview**
As a user, I want to see a summary of my scan activity on the dashboard, so that I can quickly understand my recent usage without reading every scan individually.

### Future

**US-17 (Future) - Screenshot Scanning**
As a user, I want to upload a screenshot of an investment promotion from my phone, so that I can analyze content that I cannot easily copy as text.

---

## 40. Acceptance Criteria

**[PROPOSED - final product should eventually satisfy all of the following]**

### Authentication
- [ ] User can register with a valid email and a password meeting strength requirements.
- [ ] Duplicate email registration returns an appropriate error.
- [ ] User can log in with correct credentials and receive a JWT token.
- [ ] Invalid credentials return a generic 401 error without specifying which field is wrong.
- [ ] Protected routes reject requests without a valid JWT.
- [ ] Passwords are never stored or returned in plaintext.

### Scanner
- [ ] Scanner accepts text input (10-5,000 characters).
- [ ] Scanner accepts URL input (http/https only).
- [ ] Scanner accepts combined text + URL input.
- [ ] Invalid inputs produce structured validation error responses.
- [ ] Scan is submitted successfully and returns a result.

### Text Analysis
- [ ] All 9 defined text indicators (TI-01 through TI-09) are evaluable.
- [ ] Each detected indicator includes: code, name, severity, evidence excerpt, explanation.
- [ ] Risk score is within the range 0-100.
- [ ] Risk level matches the defined threshold ranges.

### URL Analysis
- [ ] All 10 defined URL signals (UI-01 through UI-10) are evaluable.
- [ ] Non-http/https URLs are rejected with 422.
- [ ] System does not make outbound HTTP requests to submitted URLs (MVP).
- [ ] Result does not state that the URL is definitively fraudulent.

### Combined Analysis
- [ ] Combined analysis returns individual text and URL sub-scores.
- [ ] Combined score reflects the defined weighting formula.
- [ ] Explanation covers both text and URL findings.

### Risk Scoring
- [ ] Risk score is correct given the set of detected indicators.
- [ ] Risk level is correct for the risk score.
- [ ] Thresholds are configurable without code changes.

### Explainability
- [ ] Every result includes a human-readable summary.
- [ ] Every detected indicator has an explanation in plain language.
- [ ] Explanation language uses appropriate hedging (not "this is a scam").
- [ ] No-signal result includes an explanation that communicates no guarantee of safety.

### Recommendations
- [ ] Recommendations are appropriate for each risk level.
- [ ] Recommendations are actionable and non-alarmist.
- [ ] Recommendations do not constitute financial advice.

### History
- [ ] Authenticated users see only their own scans.
- [ ] Scan list is paginated.
- [ ] Individual scans are accessible from history.
- [ ] Deleted scans are removed from history.

### Dashboard
- [ ] Total scan count is accurate.
- [ ] Risk-level breakdown counts are accurate.
- [ ] Empty state is shown when no scans exist.

### Authorization
- [ ] Users cannot access another user's scans.
- [ ] Attempting to access another user's scan returns 403.

### Security
- [ ] Passwords are hashed using a secure algorithm.
- [ ] JWT tokens expire as configured.
- [ ] CORS is restricted to allowed origins.
- [ ] Rate limiting is applied to sensitive endpoints.
- [ ] No stack traces are in API error responses.
- [ ] No secrets are in source code.

### Responsive UI
- [ ] All pages render correctly on mobile viewport (minimum 320px width).
- [ ] All pages render correctly on desktop viewport (minimum 1280px width).

### Accessibility
- [ ] All form inputs have visible labels.
- [ ] Risk levels are communicated as text, not only color.
- [ ] All interactive elements are keyboard navigable.
- [ ] Color contrast meets WCAG 2.1 AA requirements.

### Tests
- [ ] Unit tests pass for all defined indicator extraction functions.
- [ ] API tests pass for all defined endpoints.
- [ ] At least one end-to-end test covers the full scan flow.

### AI Evaluation
- [ ] An evaluation report exists with defined metrics.
- [ ] No accuracy claim is made without supporting evaluation data.

### Disclaimer
- [ ] Product disclaimer is visible on the result page and the /about page.
- [ ] Disclaimer correctly communicates that results are not guaranteed and are not financial advice.

---

## 41. Open Questions

**[PROPOSED - these decisions are unresolved and must not be silently assumed]**

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| OQ-01 | Final ML model selection? Rule-based only, TF-IDF + Logistic Regression, or TF-IDF + SVM for hackathon? | AI accuracy, development time. | AI Engineer |
| OQ-02 | Training dataset source? Publicly available dataset, curated synthetic dataset, or combination? What is the license? | Training feasibility, legal compliance. | AI Engineer |
| OQ-03 | Data retention period? How long are scan records kept? Is there an automatic deletion policy? | Privacy, storage cost. | Product Manager |
| OQ-04 | Exact production hosting provider? Vercel + Railway? Vercel + Render? GCP? | Deployment cost, configuration. | Technical PM |
| OQ-05 | External threat intelligence provider? VirusTotal? AbuseIPDB? Other? What is the API cost? | Future URL enrichment capability. | AI Engineer |
| OQ-06 | Authentication provider? Self-managed JWT (proposed) or a managed identity provider (e.g., Auth0, Supabase)? | Development time, security posture. | Backend Engineer |
| OQ-07 | OCR provider for future image analysis? Tesseract (open-source)? Google Cloud Vision? AWS Textract? | Future phase cost and accuracy. | AI Engineer |
| OQ-08 | Frontend JWT storage strategy? In-memory? httpOnly cookie? | Security vs. simplicity tradeoff. | Frontend Engineer |
| OQ-09 | Should submitted content be stored in plaintext? Or encrypted at rest? | Privacy and storage complexity. | Security Engineer |
| OQ-10 | Indicator weight values? The proposed weights need validation against real test cases. Who validates them and how? | Risk scoring accuracy. | AI Engineer |
| OQ-11 | Should the MVP include a transformer-based model or only rule-based + TF-IDF? | Development time vs. demo quality. | Whole team |
| OQ-12 | Minimum password requirements? The proposed requirement (8 chars, 1 upper, 1 lower, 1 digit) - is this appropriate? | Security. | Security Engineer |

---

## 42. Risks and Mitigations

**[PROPOSED]**

| Risk | Impact | Probability | Mitigation | Owner | Status |
|------|--------|-------------|------------|-------|--------|
| False positives (legitimate content flagged) | User distrust; incorrect guidance. | HIGH (inherent in any classifier). | Document limitation explicitly. Use hedging language. Enable user feedback in future. | AI Engineer | Open |
| False negatives (scam content missed) | User harmed; product fails at core purpose. | MEDIUM. | Multi-signal approach (rules + ML). Conservative scoring on high-severity indicators. | AI Engineer | Open |
| Poor dataset quality | Model trained on biased data; poor accuracy. | MEDIUM. | Careful dataset curation. Document source, size, and composition. Evaluate before claiming accuracy. | AI Engineer | Open |
| Model bias | System performs differently across demographic groups or languages. | MEDIUM. | Document language limitation (English MVP). Evaluate across diverse examples. Do not overclaim. | AI Engineer | Open |
| Analysis API failure | User cannot complete a scan. | LOW-MEDIUM. | Implement graceful fallback to rule-based baseline. Return meaningful error messages. | Backend Engineer | Open |
| Database failure | Loss of scan history; authentication failure. | LOW. | Use managed database (MongoDB Atlas) with backups. Monitor connectivity. | Backend Engineer | Open |
| SSRF vulnerability (if URL fetching introduced) | Internal infrastructure exposure; data breach. | HIGH impact if introduced without protection. | SSRF protection suite fully documented. MVP must NOT fetch URLs. | Security Engineer | Open |
| Privacy: scan content exposure | User data accessed by unauthorized party. | LOW with proper auth. | Strict ownership enforcement on all scan access. Authorization checked server-side. | Security Engineer | Open |
| Performance degradation (large inputs or many users) | Slow results; poor demo experience. | LOW-MEDIUM at hackathon scale. | Define input size limits. Use efficient inference. Monitor latency during demo. | Backend Engineer | Open |
| Deployment failure before demo | No working product to demonstrate. | LOW-MEDIUM. | Deploy and test production environment well before presentation. Have local demo backup. | Technical PM | Open |
| External service dependency failure (future) | Threat intelligence unavailable in future phases. | MEDIUM for future. | Deferred to Phase 5. Design URL analysis to work without external enrichment. | AI Engineer | Future |
| Legal challenge (naming fraudsters) | Reputational or legal risk. | LOW with correct design. | System assesses content signals, not individuals. Disclaimer clearly stated. | Product Manager | Open |

---

## 43. Traceability Matrix

**[PROPOSED]**

### Official Requirements to Product Features

| Official Requirement | Product Requirement | Feature | Acceptance Criterion |
|---------------------|---------------------|---------|---------------------|
| OFF-01: AI-powered web application | R-03, R-11, R-04 | Text Analysis, URL Analysis, Risk Engine | FR-04, FR-05, FR-06 pass. |
| OFF-02: Identify suspicious investment/trading content | R-03, R-05, R-09 | Text Analysis, Explainability Layer | All 9 indicator types are evaluable. Each result includes detected indicators. |
| OFF-03: Social media and digital communication channels | UP-01 through UP-10 | Scanner accepts text from any source | Scanner accepts pasted text from any social media or messaging content. |
| OFF-04: Analyze available digital signals | R-03, R-11, R-12 | Text indicators, URL signals, Combined Risk Engine | Signal extraction documented and implemented for all defined indicators. |
| OFF-05: Provide explainable risk assessment | R-05 | Explainability Layer | Every result includes indicator names, evidence, explanations, and recommendations. |
| OFF-06: Not just Scam or Not Scam | R-04, R-05, R-06 | Risk Engine, Explainability, Recommendations | Result includes numeric score, level, indicators, explanation, and recommendations - not a binary label. |

### Proposed Features Not From Official Source

| Proposed Feature | Source | Rationale |
|-----------------|--------|-----------|
| User Authentication | Proposed | Required to provide personalized scan history and protect user data. |
| Dashboard | Proposed | Improves usability and provides product context. |
| Scan History | Proposed | Allows users to reference past analyses. |
| Safety Recommendations | Proposed | Extends explainability from "what" to "what to do". |
| Screenshot/OCR Analysis (Future) | Proposed | Extends coverage to visual social media content. |
| Threat Intelligence (Future) | Proposed | Enriches URL analysis with external reputation data. |

---

## 44. PRD Quality Rules

This PRD was created in accordance with the following quality principles:

| Rule | Status |
|------|--------|
| Official requirements are separated from proposed features. | Applied throughout. [OFFICIAL] and [PROPOSED] markers used consistently. |
| No marketing fluff or unsupported claims. | No fake statistics, no unverified accuracy claims anywhere in the document. |
| No fabricated accuracy scores. | All evaluation metrics stated as TBD pending actual evaluation. |
| No fake or invented datasets. | Dataset requirements defined without claiming a specific dataset exists. |
| No ambiguous requirements. | Each requirement has defined inputs, outputs, and acceptance criteria. |
| No contradictory requirements. | Reviewed for consistency throughout all 44 sections. |
| Security requirements documented. | Section 24 covers all required security areas. |
| AI limitations documented. | Section 34 explicitly documents all known system limitations. |
| Future features clearly separated from MVP. | [FUTURE] markers used. Dedicated Roadmap section (31) separates all 6 phases. |
| Implementation-ready but no application source code included. | No source code in this document. Architecture described in natural language and schemas only. |
| Traceability from official requirements to features. | Section 43 provides full traceability matrix. |

---

*End of ScamShield AI Product Requirements Document*

*Version 1.0.0 - Created 2026-08-20*
*This document is the Single Source of Truth for ScamShield AI development.*
*No application code should be created until this document has been reviewed and approved by the team.*
