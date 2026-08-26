# ScamShield AI — UI/UX Design Specification

**Version:** 1.0.0
**Status:** DRAFT — Design Blueprint
**Created:** 2026-08-20
**Project:** ScamShield AI
**Parent Documents:** docs/PRD.md, docs/TRD.md
**Tagline:** Detect. Understand. Stay Safe.

> **CRITICAL DESIGN DIRECTIVE:**
> This document defines the visual, interaction, and experience design for ScamShield AI.
> No application code, React components, CSS files, or dependencies should be created until
> development phases are formally approved. This document is the sole UI/UX source of truth.
> All design decisions not mandated by PRD/TRD are marked **[PROPOSED DESIGN DECISION]**.

---

## Table of Contents

1. [Design Objective & Brand Direction](#1-design-objective--brand-direction)
2. [Design Personality & Visual Identity](#2-design-personality--visual-identity)
3. [Color System & Semantic Tokens](#3-color-system--semantic-tokens)
4. [Dark Mode & Light Mode Strategy](#4-dark-mode--light-mode-strategy)
5. [Typography System](#5-typography-system)
6. [Spacing System](#6-spacing-system)
7. [Border Radius Tokens](#7-border-radius-tokens)
8. [Shadow System](#8-shadow-system)
9. [Icon System](#9-icon-system)
10. [Button System](#10-button-system)
11. [Form System](#11-form-system)
12. [Navigation Design](#12-navigation-design)
13. [Landing Page Design](#13-landing-page-design)
14. [Login Page Design](#14-login-page-design)
15. [Register Page Design](#15-register-page-design)
16. [Dashboard Design](#16-dashboard-design)
17. [Scanner Page Design](#17-scanner-page-design)
18. [Analysis Loading Experience](#18-analysis-loading-experience)
19. [Result Page Design](#19-result-page-design)
20. [Risk Score Visualization](#20-risk-score-visualization)
21. [Risk Level Design System](#21-risk-level-design-system)
22. [Indicator Card Design](#22-indicator-card-design)
23. [Evidence & Explanation Design](#23-evidence--explanation-design)
24. [Safety Recommendation Design](#24-safety-recommendation-design)
25. [Analysis Details Section](#25-analysis-details-section)
26. [History Page Design](#26-history-page-design)
27. [Empty & Error States System](#27-empty--error-states-system)
28. [Profile & About Page Design](#28-profile--about-page-design)
29. [Responsive Design System](#29-responsive-design-system)
30. [Accessibility Design Standards](#30-accessibility-design-standards)
31. [Animation System](#31-animation-system)
32. [Design Token Registry](#32-design-token-registry)
33. [Component Inventory](#33-component-inventory)
34. [Page Inventory](#34-page-inventory)
35. [UX Principles & Anti-Patterns](#35-ux-principles--anti-patterns)
36. [Hackathon Demo Path](#36-hackathon-demo-path)
37. [Traceability Matrix (PRD to UI)](#37-traceability-matrix-prd-to-ui)
38. [Design Validation Checklist](#38-design-validation-checklist)

---

## 1. Design Objective & Brand Direction

### 1.1 Product Design Mission
ScamShield AI must feel like a professional cybersecurity and consumer-protection intelligence tool.
It is NOT a generic AI chatbot, a game dashboard, or a social media application.

Every screen, every component, and every piece of copy must reinforce:

`
SECURITY  +  AI  +  TRUST  +  EXPLAINABILITY  +  SIMPLICITY
`

### 1.2 Brand Identity Direction

| Element | Direction |
|---|---|
| **Brand Name** | ScamShield AI |
| **Tagline** | Detect. Understand. Stay Safe. |
| **Brand Symbol Concept** | A shield with a subtle intelligence motif (circuit trace, scan line, or eye) integrated into the shield form. Communicates active protection, not passive security. |
| **Wordmark Concept** | ScamShield in a clean geometric sans-serif with AI set in the brand accent color. Slight differentiation between the two parts signals the hybrid human-machine nature of the product. |
| **Logo Placement** | Top-left in navbar on all authenticated pages. Centered on auth pages (Login, Register). Center-left in landing page hero navigation. |
| **Favicon Concept** | Simplified shield monogram — the shield outline at 32x32 with a subtle glyph, visible at small sizes on browser tabs. |
| **Brand Voice** | Calm, clear, authoritative, protective, non-alarmist. Never sensationalist. Speaks like a trusted cybersecurity professional, not a panic-inducing news headline. |

### 1.3 Visual Design Language
The product communicates protection through restraint and intelligence through clarity.

- **Dark canvas:** Deep navy/slate canvas anchors the product in the cybersecurity space without resorting to cyberpunk clichés.
- **Precise typography:** Well-spaced, high-contrast sans-serif text communicates precision and professionalism.
- **Data-driven visuals:** Scan results are structured as information, not entertainment.
- **Explainability-first layout:** The result screen is designed to be read sequentially — score first, reasoning second, action third.

---

## 2. Design Personality & Visual Identity

### 2.1 Personality Scale

| Trait | Measurement | Notes |
|---|---|---|
| Modern ↔ Classic | **Modern (85%)** | Contemporary design language without trend-chasing. |
| Minimal ↔ Dense | **Minimal (75%)** | Sufficient white space. Content density only in scan results. |
| Serious ↔ Playful | **Serious (80%)** | Tone is protective and professional, not cold or sterile. |
| Dark ↔ Light | **Dark (70%)** | Primary dark-mode experience. |
| Geometric ↔ Organic | **Geometric (65%)** | Structured grid, geometric icons, systematic spacing. |

### 2.2 Mood Reference Terms
Precise · Protective · Clear · Authoritative · Trustworthy · Intelligent · Calm · Evidence-based

### 2.3 What to Avoid
- ❌ Excessive neon / glowing text effects
- ❌ Heavy glassmorphism without purpose
- ❌ Animated particle backgrounds or full-screen motion
- ❌ Cyberpunk aesthetic with green-on-black terminal styling
- ❌ Generic dashboard SaaS templates
- ❌ Oversaturated risk badge colors that feel alarming rather than informative

---

## 3. Color System & Semantic Tokens

### 3.1 Core Background & Surface Palette

**[PROPOSED DESIGN DECISION]**

| Token | Name | Hex Value | Usage Context |
|---|---|---|---|
| --color-bg-base | Canvas Base | #070B14 | Root page background — deepest dark canvas |
| --color-bg-elevated | Elevated Background | #0D1321 | Secondary sections, page containers |
| --color-surface-default | Surface Default | #111827 | Cards, panels, sidebar |
| --color-surface-raised | Surface Raised | #162032 | Interactive cards on hover, focused states |
| --color-border-default | Border Default | #1E2D45 | Card borders, input borders, dividers |
| --color-border-subtle | Border Subtle | #1A2438 | Very subtle separators within cards |

### 3.2 Brand Color Palette

| Token | Name | Hex Value | Usage Context |
|---|---|---|---|
| --color-brand-primary | Brand Blue | #2563EB | Primary buttons, active nav links, brand accents |
| --color-brand-primary-hover | Brand Blue Hover | #1D4ED8 | Primary button hover state |
| --color-brand-primary-subtle | Brand Blue Subtle | #1E3A5F | Background tint on brand-highlighted cards |
| --color-brand-accent | Brand Accent | #38BDF8 | AI badge, scanner icon accent, secondary highlights |

### 3.3 Text Color Palette

| Token | Name | Hex Value | Contrast on #070B14 | Usage Context |
|---|---|---|---|---|
| --color-text-primary | Text Primary | #F1F5F9 | **15.4:1** ✅ | Headings, primary content, labels |
| --color-text-secondary | Text Secondary | #CBD5E1 | **9.7:1** ✅ | Sub-headings, descriptions, metadata |
| --color-text-muted | Text Muted | #64748B | **4.6:1** ✅ | Captions, placeholder text, timestamps |
| --color-text-disabled | Text Disabled | #334155 | 2.8:1 | Disabled input labels (not standalone information) |

### 3.4 Semantic Risk Color Palette

> **Critical Accessibility Rule:** Risk level color is NEVER the sole means of communicating severity.
> Every risk state MUST include: color + text label + icon glyph + descriptive text.

| Token | Risk Level | Hex Code | WCAG Contrast | Text Pair | Icon |
|---|---|---|---|---|---|
| --color-risk-low-fg | LOW | #34D399 | **8.3:1** on dark ✅ | 	ext-emerald-400 | CheckCircle icon |
| --color-risk-low-bg | LOW Background | #052E16 | — | g-emerald-950/50 | — |
| --color-risk-medium-fg | MEDIUM | #FBBF24 | **9.0:1** on dark ✅ | 	ext-amber-400 | AlertTriangle icon |
| --color-risk-medium-bg | MEDIUM Background | #2D1B00 | — | g-amber-950/50 | — |
| --color-risk-high-fg | HIGH | #FB923C | **7.8:1** on dark ✅ | 	ext-orange-400 | AlertOctagon icon |
| --color-risk-high-bg | HIGH Background | #2C1008 | — | g-orange-950/50 | — |
| --color-risk-critical-fg | CRITICAL | #F87171 | **7.5:1** on dark ✅ | 	ext-rose-400 | ShieldAlert icon |
| --color-risk-critical-bg | CRITICAL Background | #2D0A0A | — | g-rose-950/50 | — |

### 3.5 System Semantic Colors

| Token | Hex Value | Usage |
|---|---|---|
| --color-success | #22C55E | Successful operations, valid inputs |
| --color-warning | #F59E0B | Warnings, MEDIUM risk state |
| --color-error | #EF4444 | Form errors, critical alerts, danger buttons |
| --color-info | #38BDF8 | Informational tooltips, AI analysis badges |

---

## 4. Dark Mode & Light Mode Strategy

### 4.1 Mode Decision

**[PROPOSED DESIGN DECISION]**

**Recommendation: Dark Mode as Primary Experience, Light Mode Deferred to Post-Hackathon.**

**Rationale:**
1. The cybersecurity/AI product aesthetic is better served by a dark-mode-first design.
2. Dark backgrounds improve the readability of risk color tokens (emerald, amber, orange, rose) which achieve higher perceptual contrast ratios on dark surfaces.
3. Implementing a polished dual-mode system doubles design system complexity for the hackathon MVP.
4. The primary audience (hackathon judges, tech-savvy users) overwhelmingly prefers dark-mode tooling interfaces.

**Post-Hackathon:** A light mode can be introduced in Phase 6 (Production Hardening) using the same semantic token architecture. Tokens are defined as semantic names (not literal color values) enabling straightforward theme switching.

---

## 5. Typography System

### 5.1 Font Selection

**[PROPOSED DESIGN DECISION]**

| Role | Font Family | Fallback Stack |
|---|---|---|
| **Primary Font** | Inter | system-ui, -apple-system, sans-serif |
| **Monospace** | JetBrains Mono | Fira Code, Consolas, monospace |

- **Inter:** Used for all headings, body text, labels, and UI elements. Exceptional legibility at all sizes. Designed for professional UI applications.
- **JetBrains Mono:** Used for evidence excerpts, scan IDs, analysis version strings, and URL displays. Communicates technical precision.

### 5.2 Type Scale (8px Baseline Grid)

| Token | Usage Context | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| --type-h1 | Page hero headlines, landing H1 | 3rem (48px) | 700 Bold | 1.1 | -0.02em |
| --type-h2 | Section headings | 2.25rem (36px) | 700 Bold | 1.2 | -0.02em |
| --type-h3 | Card titles, sub-section headings | 1.5rem (24px) | 600 SemiBold | 1.3 | -0.01em |
| --type-h4 | Widget headings, panel titles | 1.25rem (20px) | 600 SemiBold | 1.4 |   |
| --type-body-lg | Important descriptions, introductions | 1.125rem (18px) | 400 Regular | 1.7 |   |
| --type-body | Standard body text | 1rem (16px) | 400 Regular | 1.6 |   |
| --type-body-sm | Secondary information, card metadata |  .875rem (14px) | 400 Regular | 1.5 |   |
| --type-caption | Timestamps, breadcrumbs, fine print |  .75rem (12px) | 400 Regular | 1.5 | +0.02em |
| --type-label | Form labels, nav items, button labels |  .875rem (14px) | 500 Medium | 1.4 | +0.01em |
| --type-button | Button text |  .9375rem (15px) | 600 SemiBold | 1 | +0.01em |
| --type-badge | Risk badges, status tags |  .75rem (12px) | 700 Bold | 1 | +0.05em |
| --type-code | Evidence excerpts, technical data |  .875rem (14px) | 500 Medium | 1.6 |   |

---

## 6. Spacing System

### 6.1 Base-4 Spacing Scale

| Token | px Value | Usage Context |
|---|---|---|
| --space-1 | 4px | Micro spacing: icon-to-label gap, inline badge padding |
| --space-2 | 8px | Tight spacing: between small elements, input helper text gap |
| --space-3 | 12px | Compact spacing: inside badges, small card internal spacing |
| --space-4 | 16px | Standard spacing: form field label-to-input, button icon-to-label |
| --space-5 | 20px | Component padding: small card inner padding |
| --space-6 | 24px | Card padding: standard card inner padding |
| --space-8 | 32px | Section separation: between card groups, form sections |
| --space-10 | 40px | Large section gap: within a page section |
| --space-12 | 48px | Between major page sections |
| --space-16 | 64px | Section padding on landing page |
| --space-20 | 80px | Hero section vertical padding |
| --space-24 | 96px | Very large section separators on landing page |

---

## 7. Border Radius Tokens

**[PROPOSED DESIGN DECISION]**

| Token | px Value | Usage |
|---|---|---|
| --radius-sm | 4px | Inline badges, small chips, tooltip backgrounds |
| --radius-md | 8px | Input fields, select dropdowns, small buttons |
| --radius-lg | 12px | Cards, panels, modals, standard buttons |
| --radius-xl | 16px | Large feature cards, scanner container, result sections |
| --radius-2xl | 24px | Hero visual containers, large modal backgrounds |
| --radius-full | 9999px | Pill buttons (large CTA), circular avatars, indicator score circles |

---

## 8. Shadow System

**[PROPOSED DESIGN DECISION]**

| Token | CSS Shadow Value | Usage |
|---|---|---|
| --shadow-sm |   1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.5) | Subtle card lift on dark background |
| --shadow-md |   4px 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4) | Interactive card hover, dropdown panels |
| --shadow-lg |   12px 32px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.5) | Modal dialogs, floating panels, scanner card |
| --shadow-brand |   0 20px rgba(37,99,235,0.25) | Focus state glow on primary action buttons |
| --shadow-risk-critical |   0 16px rgba(248,113,113,0.20) | Risk score card when level is CRITICAL |

---

## 9. Icon System

### 9.1 Icon Library & Style

**[PROPOSED DESIGN DECISION]**

**Recommended Library:** Lucide React — outline icon style.
- Stroke weight: 1.5px at 24px standard size.
- Never mix filled and outline styles within the same interface context.
- All icons used alongside labels or with ria-label attributes on standalone usage.

### 9.2 Icon Catalog

| Context | Icon Name (Lucide) | Size | Usage |
|---|---|---|---|
| Navigation: Dashboard | LayoutDashboard | 20px | Sidebar nav item |
| Navigation: Scanner | ScanSearch | 20px | Sidebar nav item |
| Navigation: History | History | 20px | Sidebar nav item |
| Navigation: Profile | User | 20px | Sidebar nav item |
| Navigation: About | Info | 20px | Sidebar nav item / footer |
| Navigation: Logout | LogOut | 20px | User menu |
| Brand Shield | ShieldCheck | Varies | Logo companion, landing hero |
| Risk: LOW | CheckCircle | 16px | Inside LOW risk badge |
| Risk: MEDIUM | AlertTriangle | 16px | Inside MEDIUM risk badge |
| Risk: HIGH | AlertOctagon | 16px | Inside HIGH risk badge |
| Risk: CRITICAL | ShieldAlert | 16px | Inside CRITICAL risk badge |
| AI Analysis | Cpu or BrainCircuit | 20px | Analysis engine badge |
| Text Scan | FileText | 20px | Text scanner tab |
| URL Scan | Link | 20px | URL scanner tab |
| Combined Scan | Layers | 20px | Combined scanner tab |
| Evidence | Quote | 16px | Evidence excerpt header |
| Explanation | MessageSquare | 16px | Why flagged section |
| Recommendation | Shield | 16px | Safety advice card |
| Delete | Trash2 | 16px | Delete scan action |
| View Result | ExternalLink | 16px | Open scan result |
| Loading | Loader2 (spinning) | 20px | Loading states |
| No Results | SearchX | 40px | Empty history state |
| Success | CheckCircle2 | 20px | Form success feedback |
| Error | XCircle | 20px | Form error and alert states |


---

## 10. Button System

**[PROPOSED DESIGN DECISION]**

### 10.1 Button Variants & Specs

#### Primary Button
- **Purpose:** Main call-to-action (Submit Scan, Login, Register, New Scan)
- **Height:** 44px (minimum touch target)
- **Padding:**   24px (horizontal), vertically centered
- **Radius:** --radius-lg (12px)
- **Typography:** --type-button (15px, SemiBold)
- **Background:** --color-brand-primary (#2563EB)
- **Text:** #FFFFFF
- **Hover:** --color-brand-primary-hover (#1D4ED8) + --shadow-brand
- **Focus:** 2px ring #38BDF8 with 2px offset
- **Active:** #1E40AF (slightly deeper)
- **Disabled:** #1E3A5F background, #475569 text, cursor 
ot-allowed
- **Loading:** Icon Loader2 (spinning, left) + "Analyzing..." label, full button disabled

#### Secondary Button
- **Purpose:** Secondary actions (Cancel, Learn More, View Details)
- **Height:** 44px
- **Padding:**   24px
- **Radius:** --radius-lg (12px)
- **Background:** 	ransparent
- **Border:** 1.5px solid --color-border-default
- **Text:** --color-text-secondary
- **Hover:** Background --color-surface-raised, border brightens
- **Focus:** 2px ring #38BDF8

#### Danger Button
- **Purpose:** Destructive actions (Delete Scan, Confirm Delete)
- **Height:** 44px
- **Background:** 	ransparent
- **Border:** 1.5px solid --color-risk-critical-fg
- **Text:** --color-risk-critical-fg
- **Hover:** Background --color-risk-critical-bg, border solid red
- **Confirm Dialog:** Always requires a modal confirmation before executing.

#### Ghost Button
- **Purpose:** Tertiary/contextual actions (Clear input, Sort toggle)
- **Height:** 36px
- **Background:** 	ransparent
- **Text:** --color-text-muted
- **Hover:** Text lightens to --color-text-secondary, background subtle tint
- **No border.**

#### Icon Button
- **Purpose:** Toolbar actions, table row actions (View, Delete)
- **Size:** 36x36px (min touch target)
- **Radius:** --radius-md (8px)
- **Background:** 	ransparent
- **Hover:** --color-surface-raised
- **Focus:** 2px ring
- **Must always have:** ria-label attribute

#### Large CTA Button (Landing Page Only)
- **Height:** 52px
- **Padding:**   32px
- **Radius:** --radius-full (pill shape)
- **Usage:** "Start Scanning" hero button only

---

## 11. Form System

### 11.1 Text Input / Email / URL Input

- **Height:** 44px
- **Padding:**   16px
- **Radius:** --radius-md (8px)
- **Background:** #0D1321
- **Border:** 1.5px solid --color-border-default
- **Text:** --color-text-primary
- **Placeholder:** --color-text-muted
- **Label:** --type-label above the field, --color-text-secondary, always visible (never placeholder-only)
- **Focus:** Border changes to --color-brand-accent (#38BDF8), subtle inner glow
- **Error:** Border --color-error, red helper text below, XCircle icon right of field
- **Success / Valid:** Border --color-success, CheckCircle icon right of field
- **Disabled:** Background #0A1020, text --color-text-disabled, cursor 
ot-allowed
- **Required:** Red asterisk * after label with ria-required="true"
- **Helper Text:** 12px below input, --color-text-muted
- **Error Message:** 12px below input, --color-error, bold, with icon for screen readers

### 11.2 Password Input
- Same as text input but with show/hide toggle (Eye / EyeOff icon button on right)
- Password strength indicator on Register page: subtle colored bar below field
- utocomplete="current-password" for login, utocomplete="new-password" for register

### 11.3 Textarea (Scam Text Input)
- **Min Height:** 180px
- **Max Height:** 320px (scrolls internally after)
- **Padding:** 12px 16px
- **Radius:** --radius-lg (12px)
- **Resize:** Vertical resize allowed
- **Character Counter:** Bottom-right corner, --type-caption, format {current}/{max}, turns amber at 80%, red at 95%
- **Focus:** Same border behavior as text input
- **Paste Button:** Optional icon-button "Paste" using clipboard API
- **Clear Button:** X icon button top-right when content exists

### 11.4 Tabs / Analysis Type Selector
- **Purpose:** Toggle between Text, URL, Combined analysis modes on Scanner page
- **Style:** Pill-tab group inside a --color-surface-default container
- **Active Tab:** --color-brand-primary background, white text, --radius-md
- **Inactive Tab:** 	ransparent, --color-text-muted, hover shows --color-surface-raised
- **Keyboard:** Full arrow-key navigation with ole="tablist" ARIA

---

## 12. Navigation Design

### 12.1 Authenticated Navigation (Desktop — Sidebar)

**[PROPOSED DESIGN DECISION]**

**Layout:** Fixed left sidebar, 240px wide, full viewport height.

`
+------------------------------------------+
|  [Shield Icon]  ScamShield AI            |  ← Logo lockup, 64px tall
+------------------------------------------+
|                                          |
|  [LayoutDashboard]  Dashboard            |  ← Nav item
|  [ScanSearch]       Scanner          ●  |  ← Active state (● accent dot)
|  [History]          History              |
|                                          |
+------------------------------------------+
|  [User]             Profile              |  ← Bottom group
|  [Info]             About                |
|  [LogOut]           Logout               |
+------------------------------------------+
`

- **Item Height:** 44px
- **Item Padding:**   16px
- **Active State:** Left 3px border --color-brand-primary, background --color-brand-primary-subtle, text --color-text-primary
- **Hover State:** Background --color-surface-raised, text --color-text-secondary
- **Typography:** --type-label (14px Medium)
- **Icons:** 20px, same color as label text, aligned left

### 12.2 Authenticated Navigation (Mobile — Top Bar + Bottom Sheet)

- **Top Bar:** 60px height, shows logo left, hamburger Menu icon right
- **Mobile Menu:** Full-screen slide-in overlay from left (250px wide)
- **Bottom Navigation Bar (Alternative):** 56px fixed bar at bottom with 4 core icons + labels (Dashboard, Scanner, History, Profile)

### 12.3 Public Navigation (Landing, About)

`
+------------------------------------------------------------------+
|  [Shield]  ScamShield AI      About    Login    [Start Scanning] |
+------------------------------------------------------------------+
`

- **Height:** 72px
- **Background:** 	ransparent (top of page) → --color-bg-elevated on scroll (backdrop blur)
- **Logo:** Left, with shield symbol + wordmark
- **Links:** About, Login — --type-label ghost style
- **CTA:** "Start Scanning" — Primary button (medium size)
- **Mobile:** Logo left + hamburger right, links in dropdown

---

## 13. Landing Page Design

### 13.1 Section Map

`
[1. Navigation Bar]
[2. Hero Section]
[3. Problem Statement Strip]
[4. How It Works]
[5. Core Features Grid]
[6. Explainable AI Showcase]
[7. Security & Privacy Strip]
[8. Final CTA Banner]
[9. Disclaimer]
[10. Footer]
`

---

### 13.2 Section 1: Navigation Bar
*(See Section 12.3 above)*

---

### 13.3 Section 2: Hero Section

**Layout (Desktop):** Two-column — text left (60%), visual right (40%)

`
+---------------------------------------------+------------------+
|                                             |                  |
|  [Small Label]  AI Cybersecurity Tool       |   [Shield Visual]|
|                                             |   Abstract       |
|  Detect Investment Scams                    |   geometric      |
|  Before They Reach You.                     |   shield with    |
|                                             |   circuit-trace  |
|  Paste text or a URL from any social media  |   glow effect    |
|  post and receive an explainable risk       |                  |
|  assessment in seconds — not just           |                  |
|  "Scam" or "Not Scam."                      |                  |
|                                             |                  |
|  [Start Scanning]   [How It Works ↓]        |                  |
|                                             |                  |
|  ✓ No personal data stored unnecessarily   |                  |
|  ✓ Explainable results, not black-box AI   |                  |
|  ✓ Risk scoring, not guaranteed detection  |                  |
+---------------------------------------------+------------------+
`

- **H1 Size:** --type-h1 (48px, Bold)
- **Headline Copy:** "Detect Investment Scams Before They Reach You." (Example — final copywriting to be confirmed)
- **Subheadline:** --type-body-lg (18px, Regular), --color-text-secondary
- **Trust Indicators:** Three bullet points with Check icons — emphasis on what the product does NOT claim
- **CTA Primary:** "Start Scanning" — Large pill button (--radius-full)
- **CTA Secondary:** "How It Works ↓" — Ghost button with anchor scroll
- **Visual Element:** Abstract geometric shield illustration — NOT a fake screenshot. Vector-based, 400-600px, subtle glow. No fabricated UI inside.
- **Hero Background:** Subtle radial gradient from #0D1A3A center to #070B14 edges. No animated particles.

---

### 13.4 Section 3: Problem Statement Strip

**[PROPOSED DESIGN DECISION]**

Full-width dark strip, 3 data-point callouts using real statistics about investment fraud (sourced from official regulatory body reports — do not fabricate numbers):

`
+------------------------------------------------------------------+
|  Investment fraud grew [X]% last year.   $[X]B lost annually.   |
|  Most victims encounter scams on social media first.            |
|  ScamShield AI helps you identify the signals before it's late. |
+------------------------------------------------------------------+
`

> **Anti-Pattern Rule:** If real official statistics are not available, remove the data points entirely. Do NOT use fabricated numbers.

---

### 13.5 Section 4: How It Works (3-Step Process)

`
[1. Submit]           [2. Analyze]          [3. Understand]
 ↓ Paste text or URL    ↓ AI extracts          ↓ See exactly what
 from any social          signals and            was detected and
 media post or            computes a risk        why, with evidence
 message.                 score.                 from your input.
`

- **Layout:** 3 columns on desktop, stacked on mobile
- **Each Step:** Large step number (64px, Brand Blue, very low opacity background), icon (40px), title (H3), description (body)
- **Connector:** Subtle dashed line between steps on desktop

---

### 13.6 Section 5: Core Features Grid

6 feature cards in a 3×2 grid (desktop) / 2×3 (tablet) / 1×6 (mobile):

| Feature | Icon | Description |
|---|---|---|
| Text Analysis | FileText | Analyze investment promotion text for 9 categories of risk indicators |
| URL Analysis | Link | Inspect URLs for suspicious structural and lexical signals |
| Combined Analysis | Layers | Submit both text and URL for a comprehensive risk picture |
| Explainable Results | MessageSquare | Every flagged signal shows what, why, and what to do |
| Scan History | History | Review all your past scans and access results anytime |
| Privacy First | ShieldCheck | Your data is yours — delete any scan at any time |

- **Card Style:** --color-surface-default background, --radius-xl, 24px padding
- **Icon:** 32px, --color-brand-accent color
- **Title:** --type-h4
- **Description:** --type-body-sm, --color-text-secondary

---

### 13.7 Section 6: Explainable AI Showcase

**[PROPOSED DESIGN DECISION]**

Split layout: left = text explanation, right = a visual mock of a single indicator card.

Left copy:
> "We don't just say 'Scam'. We show you exactly what we found, where we found it, and why it matters."

Right: A rendered mockup of a single IndicatorCard component (see Section 22) showing one example indicator — clearly labeled as "Example Result."

---

### 13.8 Section 7: Security & Privacy Strip

3 security callout items in a row:

- Lock icon — "Your inputs are not stored beyond your account"
- EyeOff icon — "No tracking or behavioral profiling"
- ShieldCheck icon — "No outbound requests made to submitted URLs in analysis"

---

### 13.9 Section 8: Final CTA Banner

Full-width call-to-action section:

`
Ready to scan a suspicious investment post?

[Create Free Account]    [Sign In]
`

---

### 13.10 Section 9: Disclaimer

Small text, --type-caption, --color-text-muted:

> ScamShield AI provides probabilistic risk assessments based on detected signals in submitted content. Results are not guaranteed fraud determinations and do not constitute financial or legal advice. Always independently verify investment opportunities.

---

### 13.11 Section 10: Footer

Three columns: Brand (logo + tagline), Links (Dashboard, Scanner, About), Legal (Disclaimer link, PRD reference):

`
[Shield]  ScamShield AI          Links          Legal
         Detect. Understand.    Dashboard       Disclaimer
         Stay Safe.             Scanner         About
                                History         
`

---

## 14. Login Page Design

**Layout:** Full viewport, centered card. Background uses subtle radial gradient matching hero.

`
+------------------------------------------+
|                                          |
|    [Shield Icon]  ScamShield AI          |
|                                          |
|    Sign In to Your Account               |
|    Manage your scans and history         |
|                                          |
|    Email Address                         |
|    [user@example.com               ]     |
|                                          |
|    Password                              |
|    [••••••••••••••••          [Eye]]     |
|                                          |
|    [         Sign In         ] ← Primary |
|                                          |
|    Don't have an account? [Register →]   |
|                                          |
|  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄   |
|  [Error: Invalid email or password.]     |  ← Error alert (when applicable)
+------------------------------------------+
`

- **Card Width:** 440px (desktop), 100% (mobile with 24px padding)
- **Card Background:** --color-surface-default
- **Card Padding:** 40px
- **Card Radius:** --radius-2xl
- **Logo:** Centered, 40px
- **Heading:** H2
- **Subheading:** Body-sm, muted
- **Error Alert:** Full-width --color-error tinted alert box above button, with XCircle icon
- **Loading State:** Button shows spinner + "Signing in..." text, form disabled during request

---

## 15. Register Page Design

**Layout:** Same full viewport centered card structure as Login.

`
+------------------------------------------+
|                                          |
|    [Shield Icon]  ScamShield AI          |
|                                          |
|    Create Your Account                   |
|                                          |
|    Email Address        *                |
|    [user@example.com               ]     |
|                                          |
|    Password             *                |
|    [••••••••••••••      [Eye]]           |
|    Password must be 8+ characters        |  ← Helper text
|    [■■■■□□□□] Fair                       |  ← Strength indicator
|                                          |
|    Confirm Password     *                |
|    [••••••••••••••      [Eye]]           |
|                                          |
|    [        Create Account      ]        |
|                                          |
|    Already have an account? [Sign In →]  |
+------------------------------------------+
`

- **Password Strength Indicator:** 4-segment bar below password field. Colors progress: Red (Weak) → Orange (Fair) → Amber (Good) → Green (Strong). Label text accompanies the bar.
- **Confirm Password:** Live equality validation on blur — green check or red error immediately visible.
- **Minimal Fields:** Only Email + Password + Confirm Password. No username, phone, or marketing consent required for MVP.


---

## 16. Dashboard Design

**Layout:** Two-column layout (sidebar 240px + main content area).

### 16.1 Layout Structure

`
+--[Sidebar]--+--[Main Content Area]-----------------------------+
|  Logo       |  Welcome back, user@example.com                  |
|             |  Your scan activity overview.                    |
|  Dashboard  |                                                  |
|  > Scanner  |  [+ New Scan]                                    |
|  History    |                                                  |
|  Profile    |  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ |
|  About      |  │ Total   │ │ LOW     │ │ HIGH    │ │CRITICAL│ |
|  Logout     |  │  14     │ │   6     │ │   5     │ │   3   │ |
|             |  │ Scans   │ │ Scans   │ │ Scans   │ │ Scans │ |
|             |  └─────────┘ └─────────┘ └─────────┘ └───────┘ |
|             |                                                  |
|             |  Recent Scans                                    |
|             |  ┌──────────────────────────────────────────┐   |
|             |  │ [CRITICAL]  Text  2 mins ago  [View →]   │   |
|             |  │ [HIGH]      URL   1 hour ago  [View →]   │   |
|             |  └──────────────────────────────────────────┘   |
|             |  [View Full History →]                          |
+-------------+--------------------------------------------------+
`

### 16.2 Stats Cards

4 stat cards in a responsive grid (4-col desktop, 2-col tablet, 1-col mobile):

- **Total Scans Card:** --color-surface-default background, Large number (H2), "Total Scans" label, trend indicator (optional in future)
- **Risk Level Cards (LOW, MEDIUM, HIGH, CRITICAL):** Each card uses the corresponding risk background color subtly on the left border (3px accent bar) + risk icon + count + label. Never uses color as the ONLY differentiator — always shows text label.

### 16.3 Empty State (New Users)

`
+--------------------------------------------------+
|                                                  |
|         [SearchX Icon — 64px, muted]             |
|                                                  |
|         No scans yet.                            |
|         Start your first scan to see your        |
|         risk analysis history here.              |
|                                                  |
|         [   Start Your First Scan   ]            |
|                                                  |
+--------------------------------------------------+
`

---

## 17. Scanner Page Design

**The most important product screen.**

### 17.1 Overall Layout

`
+--[Sidebar]--+--[Scanner Area]---------------------------------+
|             |                                                 |
|             |  Scan Content for Risk Signals                  |
|             |  Paste text, a URL, or both from any           |
|             |  social media post or message.                  |
|             |                                                 |
|             |  ┌─────────────────────────────────────────┐   |
|             |  │  [Text Only]  [URL Only]  [Text + URL]  │   | ← Tab selector
|             |  └─────────────────────────────────────────┘   |
|             |                                                 |
|             |  [Active Tab Content — see below]               |
|             |                                                 |
|             |  [Privacy Note: Your content is analyzed       |
|             |   and stored in your account only.]            |
|             |                                                 |
|             |  [   Analyze Content   ]                       | ← Primary CTA
|             |                                                 |
+-------------+-------------------------------------------------+
`

### 17.2 Text-Only Tab

`
Paste the investment text to analyze

Paste any text from a social media post, message, or investment
promotion below. Content is analyzed for common risk signals.

+-----------------------------------------------------+
| Paste investment promotion text here...             |
|                                                     |
|                                                     |
|                                                [X]  |
+-----------------------------------------------------+  0 / 5,000
                                                ↑ char counter
[Clear]

Examples of text to analyze:
• Investment promotion posts from social media
• Unsolicited messages about trading opportunities
• Forwarded investment advice from group chats
`

### 17.3 URL-Only Tab

`
Enter the URL to analyze

Paste a URL from an investment promotion or suspicious message.
The URL structure and content will be analyzed for risk signals.

+-----------------------------------------------------+
| https://                                            |
+-----------------------------------------------------+
↑ Prefills https:// to guide users

Important: Only http:// and https:// URLs are supported.
The URL is analyzed structurally — ScamShield AI does not
visit or fetch content from submitted URLs.
`

### 17.4 Combined Tab

`
Analyze text and URL together

Submit both the text of a promotion and its associated URL
for a combined risk assessment.

Paste Text
+-----------------------------------------------------+
| Paste the investment text here...               [X] |
+-----------------------------------------------------+  0 / 5,000

Enter URL
+-----------------------------------------------------+
| https://                                            |
+-----------------------------------------------------+

Both sources will be analyzed and a single combined risk
score will be generated.
`

### 17.5 Privacy Guidance Strip

Shown above the Submit button on all scanner tabs:

`
[ LockKeyhole icon ]  Your content is analyzed and stored
                       privately in your account. You can
                       delete any scan at any time.
`

---

## 18. Analysis Loading Experience

**[PROPOSED DESIGN DECISION]**

Loading occurs on the Scanner page (replacing the form) while analysis runs.

### 18.1 Loading Stage Visualization

`
+--------------------------------------------------+
|                                                  |
|   [Animated shield / scan line glyph]            |
|                                                  |
|   Analyzing content...                           |
|                                                  |
|   ● Validating input                   ✓         |
|   ● Extracting signals                 ✓         |
|   ● Analyzing content                  ⟳         | ← current stage
|   ○ Calculating risk                             |
|   ○ Generating explanation                       |
|                                                  |
+--------------------------------------------------+
`

- **Stage Indicators:** Sequential list of analysis stages. Completed = CheckCircle green. Current = animated Loader2 spinner. Pending = empty circle muted.
- **No Fake Percentage:** Do NOT use a fake progress bar like "87% complete". Use stage-based qualitative steps only.
- **Animation:** Subtle pulsing glow on the shield/scan icon using CSS opacity cycle (respects prefers-reduced-motion).
- **Duration:** Loading state shown for the duration of actual API response. If API returns in < 300ms, show briefly (minimum 400ms) to avoid a jarring flash of state.
- **Cancel Option:** Small "Cancel" ghost-button below stages for long-running requests.

---

## 19. Result Page Design

**Second most important screen after Scanner.**

### 19.1 Layout Hierarchy (Desktop, sequential top-to-bottom)

`
┌─────────────────────────────────────────────────────────┐
│  [← Back to Scanner]              [🗑 Delete Scan]       │  ← Top bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│  RISK ASSESSMENT RESULT              [Scan type badge]  │
│  Analyzed on [Date & Time]           [analysis_type]    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Risk Score Gauge — large, prominent, left-center]     │
│  Score: 82 / 100                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [ShieldAlert]  CRITICAL RISK                   │   │
│  │  This content contains multiple high-severity   │   │
│  │  signals commonly found in investment fraud.    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Detected Risk Signals  (4 signals found)               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  [IndicatorCard] TI-06: Payment Solicitation     │   │
│  │  [IndicatorCard] TI-01: Guaranteed Return Claim  │   │
│  │  [IndicatorCard] TI-07: Private Channel Redirect │   │
│  │  [IndicatorCard] UI-01: Unencrypted HTTP Protocol│   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [RecommendationCard]  What Should You Do?              │
│  • Do NOT send cryptocurrency or deposit funds.         │
│  • Report this account to platform administrators.      │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  [Collapsible ▾]  Analysis Technical Details            │
│  Scan ID: scn_5a2f8c...  |  Model: baseline-v1  |  ... │
├─────────────────────────────────────────────────────────┤
│  [Product Disclaimer strip — small, muted text]         │
└─────────────────────────────────────────────────────────┘
`

---

## 20. Risk Score Visualization

**[PROPOSED DESIGN DECISION]**

### 20.1 Primary Score Display

`
         ╭───────────────╮
        ╱                 ╲
       │       82          │   ← Numeric score, H1 size
       │      ────         │
       │      100          │   ← Denominator, caption size
        ╲                 ╱
         ╰───────────────╯
         ▓▓▓▓▓▓▓▓▓░░░░░    ← Colored arc/progress (rose-400 for CRITICAL)
`

- **Visualization Type:** Circular arc progress indicator (SVG-based, semantic)
- **Score Number:** H1 size (48px, bold), center of arc
- **Denominator:** /100 caption beneath score
- **Arc Color:** Matches risk level color token
- **Arc Track Background:** Dark muted arc behind colored arc
- **Label Below:** Risk level badge (see Section 21)
- **Alternative (simpler):** Horizontal progress bar with large score number if circular gauge is complex to implement — acceptable for MVP.
- **No Fake Drama:** The visualization is informational, not alarmist. CRITICAL is red but not flashing, blinking, or pulsing aggressively.

---

## 21. Risk Level Design System

### 21.1 Risk Level Badge Component

Each risk level badge contains: **Icon + Text Label + Background**. Never color alone.

| Risk Level | Badge Appearance | Icon | Text | Background |
|---|---|---|---|---|
| **LOW** | [✓ CheckCircle] LOW RISK | CheckCircle (emerald) | "LOW RISK" (bold, small-caps) | --color-risk-low-bg |
| **MEDIUM** | [⚠ AlertTriangle] MEDIUM RISK | AlertTriangle (amber) | "MEDIUM RISK" | --color-risk-medium-bg |
| **HIGH** | [⊘ AlertOctagon] HIGH RISK | AlertOctagon (orange) | "HIGH RISK" | --color-risk-high-bg |
| **CRITICAL** | [🛡 ShieldAlert] CRITICAL RISK | ShieldAlert (rose) | "CRITICAL RISK" | --color-risk-critical-bg |

### 21.2 Risk Level Descriptor Text

Below the badge, a one-sentence descriptor in --type-body-sm:

| Level | Descriptor |
|---|---|
| LOW | "Limited suspicious signals detected. Always verify investment opportunities independently." |
| MEDIUM | "Some signals detected. Treat this content with caution and verify the source independently." |
| HIGH | "Multiple risk signals detected. Do not commit funds based on this content alone." |
| CRITICAL | "High-severity risk signals present. Take no financial action based on this content." |

---

## 22. Indicator Card Design

### 22.1 Card Structure

`
┌─────────────────────────────────────────────────────────────┐
│  [AlertOctagon] TI-06: Payment / Crypto Solicitation        │  ← Title row
│                                         [HIGH] badge        │  ← Severity badge right
├─────────────────────────────────────────────────────────────┤
│  Evidence Detected                                          │  ← Section label
│  ┌─────────────────────────────────────────────────────┐   │
│  │ "Send  USDT to activate your trading account"   │   │  ← Monospace code block
│  └─────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│  Why This Matters                                           │  ← Section label
│  Direct requests to transfer cryptocurrency to activate     │
│  accounts are the primary operational pattern in online     │
│  investment fraud schemes.                                  │
└─────────────────────────────────────────────────────────────┘
`

- **Card Background:** --color-surface-default
- **Card Border:** 1px solid --color-border-default, left 3px accent border = severity color
- **Card Radius:** --radius-lg
- **Card Padding:** 20px
- **Icon:** 16px, severity color
- **Title:** --type-label (14px, Medium)
- **Evidence Block:** --color-bg-base background, --radius-md, --type-code (monospace, 14px), left border 2px solid --color-brand-accent
- **Explanation Text:** --type-body-sm, --color-text-secondary

---

## 23. Evidence & Explanation Design

### 23.1 Evidence Excerpt Design Rules

1. Evidence is displayed VERBATIM from user-submitted input — no modification.
2. Evidence is wrapped in a distinct monospace code block visually differentiated from body text.
3. Long evidence is truncated with expand/collapse ([Show more ↓] / [Show less ↑]).
4. Evidence is not highlighted or styled in a way that could be confused with a link.

### 23.2 "Why Was This Flagged?" Section

The full explanation is a readable paragraph:

`
┌──────────────────────────────────────────────────────┐
│  [MessageSquare icon]  Why was this flagged?         │
│                                                      │
│  This content requests a direct transfer of          │
│  cryptocurrency to activate a trading account.       │
│  Legitimate investment platforms do not solicit       │
│  direct wallet transfers via social media messages.  │
│  This pattern is strongly associated with advance-   │
│  fee and exit scam schemes.                          │
└──────────────────────────────────────────────────────┘
`

---

## 24. Safety Recommendation Design

**Visually distinct from the indicator cards — uses a different color treatment to signal actionability.**

`
┌──────────────────────────────────────────────────────────────┐
│  [Shield icon — brand blue]  What Should You Do?             │  ← Section header
│                                                              │
│  ⚠ You submitted content with CRITICAL risk indicators.     │  ← Contextual warning
│                                                              │
│  1.  Do NOT send cryptocurrency, USDT, or deposit funds.    │
│  2.  Do NOT join any private trading groups from this post.  │
│  3.  Report this content to the social media platform.      │
│  4.  If you have already sent funds, contact your bank       │
│      and local consumer protection authority immediately.    │
│                                                              │
│  These recommendations are general guidance and do not       │
│  constitute financial or legal advice.                       │
└──────────────────────────────────────────────────────────────┘
`

- **Card Background:** --color-brand-primary-subtle (very dark blue tint, distinct from gray cards)
- **Left Accent Border:** 3px --color-brand-primary
- **Header Icon:** Shield in --color-brand-accent
- **List Items:** Numbered with --type-body text
- **Disclaimer Line:** --type-caption, --color-text-muted

---

## 25. Analysis Details Section

**[PROPOSED DESIGN DECISION]** — Collapsible secondary section, collapsed by default.

`
▸  Analysis Technical Details

(Expands to:)

Scan ID:           scn_5a2f8c9e1d3b4a6f
Analysis Type:     Combined (Text + URL)
Text Sub-Score:    85 / 100
URL Sub-Score:     72 / 100
Analysis Version:  v1.0.0-rules-baseline
Model Version:     baseline-heuristic-v1
Processing Time:   142 ms
Analyzed At:       2026-08-20 at 19:30 UTC
`

- Uses monospace font --type-code for the values
- All values from real API response — no fabricated data
- Collapsed by default to keep focus on the main result

---

## 26. History Page Design

### 26.1 Desktop Table Layout

`
+--[Sidebar]--+--[History]-----------------------------------------+
|             |  Scan History                                       |
|             |  Your past analyses                [filter ▾]       |
|             |                                                     |
|             |  ┌──────┬──────────┬───────────┬───────┬────────┐  |
|             |  │ Date │ Type     │ Risk      │ Score │ Action │  |
|             |  ├──────┼──────────┼───────────┼───────┼────────┤  |
|             |  │ Aug  │ Combined │ [CRITICAL]│  88   │[View][🗑]│ |
|             |  │ 20   │          │           │       │        │  |
|             |  ├──────┼──────────┼───────────┼───────┼────────┤  |
|             |  │ Aug  │ Text     │ [HIGH]    │  62   │[View][🗑]│ |
|             |  │ 19   │          │           │       │        │  |
|             |  └──────┴──────────┴───────────┴───────┴────────┘  |
|             |                                                     |
|             |  ← 1  2  3 →     Showing 1–20 of 47 scans         |
+-------------+-----------------------------------------------------+
`

### 26.2 Mobile Card Layout (below 768px)

Each row becomes an individual card:

`
┌─────────────────────────────────────────────┐
│  [CRITICAL]  Combined        Aug 20, 2026   │
│  Risk Score: 88 / 100                       │
│              [View Result]  [Delete]        │
└─────────────────────────────────────────────┘
`

### 26.3 Filter Bar

`
Filter by risk: [All ▾]   [LOW] [MEDIUM] [HIGH] [CRITICAL]
`

Clicking a risk level filters the list. Active filter uses the risk-level token color as the active state.

### 26.4 Delete Confirmation Modal

`
┌───────────────────────────────────────────┐
│  Delete this scan?                        │
│                                           │
│  This scan result will be permanently    │
│  removed from your history and cannot    │
│  be recovered.                            │
│                                           │
│            [Cancel]  [Delete Scan]        │
│                      ↑ Danger button      │
└───────────────────────────────────────────┘
`

---

## 27. Empty & Error States System

### 27.1 Empty State Components

| Context | Icon | Title | Description | CTA |
|---|---|---|---|---|
| No scan history | SearchX (48px) | "No scans yet" | "Submit your first scan to see your analysis history here." | "Start Scanning" |
| Dashboard no data | LayoutDashboard (48px) | "Nothing to show yet" | "Complete your first scan to see your activity summary." | "Go to Scanner" |
| Filtered history empty | Filter (40px) | "No scans match this filter" | "Try a different risk level filter." | "Clear Filter" |

### 27.2 Error State Components

| Error Type | Icon | Title | User Message | Action |
|---|---|---|---|---|
| 401 Unauthorized | LockKeyhole | "Session Expired" | "Your session has expired. Please sign in again." | "Sign In" |
| 403 Forbidden | ShieldOff | "Access Denied" | "You don't have permission to view this content." | "Go to Dashboard" |
| 404 Not Found | SearchX | "Page Not Found" | "The page or scan you're looking for doesn't exist." | "Go Home" |
| 422 URL Error | LinkOff | "Invalid URL" | "Only http:// and https:// URLs are supported." | Try again |
| 500 Server Error | ServerCrash | "Something Went Wrong" | "An unexpected error occurred. Please try again." | "Retry" |
| Network Error | WifiOff | "Connection Error" | "Check your internet connection and try again." | "Retry" |
| Analysis Failed | AlertTriangle | "Analysis Failed" | "The analysis could not be completed. Please try again." | "Retry" |

### 27.3 Toast Notifications

- **Placement:** Top-right, 16px from edge, stack upward
- **Duration:** Info/Success: 4s. Error: 8s (or manual dismiss)
- **Success Toast:** Green left border, CheckCircle icon
- **Error Toast:** Red left border, XCircle icon
- **Width:** 320px max, 100% on mobile

### 27.4 Inline Form Validation

- Errors appear immediately **below** each field after blur or submit attempt
- Format: XCircle icon + error message text in --color-error
- Field border changes to --color-error
- Screen readers: ria-describedby links field to error message

---

## 28. Profile & About Page Design

### 28.1 Profile Page

`
+--[Sidebar]--+--[Profile]--------------------------------------+
|             |  Your Account                                   |
|             |                                                 |
|             |  ┌─────────────────────────────────────────┐   |
|             |  │  [User Avatar Circle — initials]        │   |
|             |  │  user@example.com                       │   |
|             |  │  Member since August 20, 2026           │   |
|             |  │                                         │   |
|             |  │  [   Sign Out   ] ← Secondary button    │   |
|             |  └─────────────────────────────────────────┘   |
|             |                                                 |
|             |  Account Statistics                             |
|             |  Total Scans: 14                                |
|             |                                                 |
+-------------+-------------------------------------------------+
`

### 28.2 About Page

Sections:
1. **What is ScamShield AI?** — Product description
2. **How the AI Analysis Works** — Plain-language explanation of text indicators, URL signals, risk scoring (no ML jargon)
3. **What ScamShield AI Can and Cannot Do** — Explicit limitations section (False positives exist. Results are probabilistic. Not a legal determination.)
4. **Privacy & Data** — How data is stored, user rights, delete at any time
5. **Safety Disclaimer** — Full disclaimer text (same as PRD Section 35)
6. **Contact / Feedback** — (Future placeholder for feedback mechanism)


---

## 29. Responsive Design System

### 29.1 Breakpoint Definitions

**[PROPOSED DESIGN DECISION]**

| Token | Breakpoint | Min Width | Layout Strategy |
|---|---|---|---|
| xs | Extra Small (Mobile) | 320px | Single column, full-width, stacked layout |
| sm | Small Mobile | 480px | Single column with minor layout adjustments |
| md | Tablet | 768px | 2-column grids, sidebar collapses to top nav |
| lg | Desktop | 1024px | Full sidebar + main content. 3-column feature grids |
| xl | Large Desktop | 1280px | Max content width capped; wider spacing |
| 2xl | Extra Large | 1536px | Same as xl, content remains max-width constrained |

**Maximum Content Width:** 1280px (centered, with horizontal padding)

### 29.2 Responsive Screen Map

| Screen | Desktop (≥1024px) | Tablet (768–1023px) | Mobile (<768px) | Special Behavior |
|---|---|---|---|---|
| **Landing** | 2-col hero, 3-col features | 2-col features, stacked hero | 1-col all sections, hero text stacked | Hero visual hides on <480px |
| **Login** | Centered card (440px) | Centered card (full 90%) | Full-width card (24px margin) | — |
| **Register** | Centered card (440px) | Same | Full-width card | — |
| **Dashboard** | Sidebar + main, 4-col stats | Top nav + main, 2-col stats | Hamburger nav, 1-col stats | Sidebar collapses at md |
| **Scanner** | Sidebar + centered form (700px max) | Top nav + form | Full-width form | Tab bar stays horizontal on all sizes |
| **Result** | Sidebar + result column (800px max) | Top nav + single column | Single column, all cards full-width | Score card above indicator list on all sizes |
| **History** | Sidebar + data table | Top nav + responsive table | Cards instead of table rows | Risk filter becomes a dropdown on mobile |
| **Profile** | Sidebar + centered card | Top nav + card | Full-width card | — |
| **About** | Sidebar + content (720px max) | Top nav + content | Full-width prose | — |

### 29.3 Sidebar Behavior

| Size | Behavior |
|---|---|
| Desktop (≥1024px) | Fixed visible sidebar, 240px wide |
| Tablet (768–1023px) | Sidebar hidden by default, revealed via hamburger as overlay |
| Mobile (<768px) | Sidebar replaced by top navigation bar + hamburger overlay menu |

---

## 30. Accessibility Design Standards

### 30.1 Color Contrast Requirements

All text must meet **WCAG 2.1 Level AA**:
- Normal text (< 18px normal or < 14px bold): minimum **4.5:1** contrast ratio
- Large text (≥ 18px normal or ≥ 14px bold): minimum **3:1** contrast ratio
- UI components and graphical objects: minimum **3:1** contrast ratio

All color tokens in Section 3 are verified against these ratios. Any risk color paired with background meets the minimum requirements.

### 30.2 Keyboard Navigation Requirements

- All interactive elements reachable and operable via keyboard (Tab, Enter, Space, Arrow keys)
- Focus order is logical and follows visual reading order
- Modal dialogs trap focus within the modal; Escape closes the modal
- Tab selector on Scanner uses Arrow keys to switch tabs (ole="tablist")
- Dropdown menus respond to Escape to close

### 30.3 Focus Indicators

- All interactive elements display a **visible focus ring** when focused via keyboard
- Style: outline: 2px solid #38BDF8; outline-offset: 2px
- Focus ring must never be hidden via outline: none without an accessible replacement

### 30.4 ARIA Requirements

| Element | ARIA Requirement |
|---|---|
| Risk Badge | ria-label="Risk level: CRITICAL" |
| Risk Score | ria-label="Risk score: 82 out of 100" |
| Loading Spinner | ole="status" aria-label="Analyzing content, please wait" |
| Icon-only Button | ria-label="Delete scan" |
| Scanner Tabs | ole="tablist", each tab ole="tab" aria-selected="true/false" |
| Form Errors | ria-describedby="field-error-id" on input |
| Modal | ole="dialog" aria-modal="true" aria-labelledby="modal-title" |
| Toast | ole="alert" aria-live="polite" |
| Page Loading | ria-busy="true" on loading regions |

### 30.5 Minimum Touch Target Sizes

- All interactive elements: minimum **44x44px** touch target (as per WCAG 2.5.5)
- Small icon buttons inside cards: minimum 36x36px with additional padding
- Navigation items: minimum 44px height

### 30.6 Non-Color Communication Rule

> **No information is communicated by color alone.**
>
> Every color-coded element MUST also communicate through:
> 1. **Text label** (e.g., "CRITICAL RISK" not just red)
> 2. **Icon** (e.g., ShieldAlert alongside the red badge)
> 3. **Pattern or position** (e.g., risk score number, indicator count)

---

## 31. Animation System

### 31.1 Animation Philosophy

Animations serve **function, not decoration**. Every animated element communicates state, provides feedback, or guides attention. No animation runs continuously unless it represents an active process.

### 31.2 Permitted Animation Catalog

| Animation | Element | Behavior | Duration | Easing |
|---|---|---|---|---|
| **Page Transition** | Main content area | Fade-in opacity: 0 → 1 | 200ms | ease-out |
| **Card Entrance** | Dashboard stats, history cards | Subtle 	ranslateY(8px) → 0 + fade-in | 250ms, staggered 50ms | ease-out |
| **Button Hover** | All buttons | Background color transition | 150ms | ease-in-out |
| **Button Active** | Primary button press | Scale 1 → 0.97 | 80ms | ease-in |
| **Loading Spinner** | Loader2 icon | Continuous rotation | 1000ms | linear |
| **Loading Stage Progress** | Analysis stages | Stage indicator transitions (pending → active → complete) | 300ms | ease-in-out |
| **Risk Score Entry** | Score arc / gauge | Arc draws from 0 to final value | 800ms | ease-out |
| **Accordion Expand** | Analysis Details section | Height   → auto + fade | 250ms | ease-out |
| **Modal Open** | Delete confirmation modal | scale(0.95) opacity(0) → 1 | 200ms | ease-out |
| **Toast Entry** | Notification toasts | 	ranslateX(100%) → 0 + fade | 300ms | ease-out |
| **Focus Ring** | Interactive elements | Instant appearance on focus | 0ms | N/A |

### 31.3 Prefers Reduced Motion

All animations MUST respect @media (prefers-reduced-motion: reduce):
- Duration is set to 0ms (instant transitions)
- Animated loading shield is replaced by a static spinner
- Risk score arc appears instantly at final value
- All 	ranslateY, scale, and opacity transitions are eliminated

---

## 32. Design Token Registry

**[Complete implementation-ready token catalog]**

### 32.1 Color Tokens
`
// Backgrounds
--color-bg-base:             #070B14
--color-bg-elevated:         #0D1321
--color-surface-default:     #111827
--color-surface-raised:      #162032

// Borders
--color-border-default:      #1E2D45
--color-border-subtle:       #1A2438

// Brand
--color-brand-primary:       #2563EB
--color-brand-primary-hover: #1D4ED8
--color-brand-primary-subtle:#1E3A5F
--color-brand-accent:        #38BDF8

// Text
--color-text-primary:        #F1F5F9
--color-text-secondary:      #CBD5E1
--color-text-muted:          #64748B
--color-text-disabled:       #334155

// Risk
--color-risk-low-fg:         #34D399
--color-risk-low-bg:         #052E16
--color-risk-medium-fg:      #FBBF24
--color-risk-medium-bg:      #2D1B00
--color-risk-high-fg:        #FB923C
--color-risk-high-bg:        #2C1008
--color-risk-critical-fg:    #F87171
--color-risk-critical-bg:    #2D0A0A

// System
--color-success:             #22C55E
--color-warning:             #F59E0B
--color-error:               #EF4444
--color-info:                #38BDF8
`

### 32.2 Typography Tokens
`
--font-family-primary:       'Inter', system-ui, sans-serif
--font-family-mono:          'JetBrains Mono', monospace

--type-h1:      3rem / 700 / lh 1.1
--type-h2:      2.25rem / 700 / lh 1.2
--type-h3:      1.5rem / 600 / lh 1.3
--type-h4:      1.25rem / 600 / lh 1.4
--type-body-lg: 1.125rem / 400 / lh 1.7
--type-body:    1rem / 400 / lh 1.6
--type-body-sm: 0.875rem / 400 / lh 1.5
--type-caption: 0.75rem / 400 / lh 1.5
--type-label:   0.875rem / 500 / lh 1.4
--type-button:  0.9375rem / 600 / lh 1
--type-badge:   0.75rem / 700 / lh 1
--type-code:    0.875rem / 500 / lh 1.6 (monospace)
`

### 32.3 Spacing Tokens
`
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 20px  --space-6: 24px  --space-8: 32px  --space-10: 40px
--space-12: 48px --space-16: 64px --space-20: 80px --space-24: 96px
`

### 32.4 Radius Tokens
`
--radius-sm:   4px
--radius-md:   8px
--radius-lg:   12px
--radius-xl:   16px
--radius-2xl:  24px
--radius-full: 9999px
`

### 32.5 Shadow Tokens
`
--shadow-sm:         0 1px 3px rgba(0,0,0,0.4)
--shadow-md:         0 4px 12px rgba(0,0,0,0.5)
--shadow-lg:         0 12px 32px rgba(0,0,0,0.6)
--shadow-brand:      0 0 20px rgba(37,99,235,0.25)
--shadow-critical:   0 0 16px rgba(248,113,113,0.20)
`

### 32.6 Transition Tokens
`
--transition-fast:    150ms ease-in-out
--transition-base:    200ms ease-out
--transition-slow:    300ms ease-out
--transition-score:   800ms ease-out
`

### 32.7 Breakpoint Tokens
`
--bp-xs:  320px
--bp-sm:  480px
--bp-md:  768px
--bp-lg:  1024px
--bp-xl:  1280px
--bp-2xl: 1536px
--max-content-width: 1280px
--sidebar-width: 240px
`

---

## 33. Component Inventory

| Component | Purpose | Variants | States | Accessibility |
|---|---|---|---|---|
| Button | User action trigger | Primary, Secondary, Danger, Ghost, Icon, Large CTA | Default, Hover, Focus, Active, Disabled, Loading | ole="button", focus ring, ria-disabled, ria-busy |
| Input | Text / email / URL entry | Text, Email, URL, Password (with toggle) | Default, Focus, Error, Valid, Disabled | Label required, ria-describedby error, ria-required |
| Textarea | Multi-line text entry | Standard (with char counter) | Default, Focus, Error, Disabled | Label, char limit announced |
| Badge | Status / risk label | LOW, MEDIUM, HIGH, CRITICAL, AnalysisType | Static | Text + icon, ria-label |
| RiskScoreCard | Primary score display | Arc gauge or progress | Final score display | ria-label="Risk score: X out of 100" |
| RiskBadge | Risk level label | LOW, MEDIUM, HIGH, CRITICAL | Static | Text + icon + color, ria-label |
| IndicatorCard | Single risk indicator | Text indicator, URL signal | Expanded, Collapsed | Keyboard expandable if applicable |
| EvidenceBlock | Verbatim evidence display | Text excerpt, URL feature | Static | ole="blockquote" or code element |
| RecommendationCard | Safety advice | By risk level | Static | Numbered actionable items |
| AnalysisDetailsPanel | Technical scan metadata | Collapsible | Collapsed (default), Expanded | ria-expanded on trigger |
| ScanHistoryTable | List of past scans | Desktop table, mobile cards | Loading, Loaded, Empty, Filtered | ole="table" with proper headers |
| Pagination | Page navigation | Standard | Default, Disabled (first/last page) | ria-label="Pagination", current page announced |
| Navbar | Top navigation | Public, Authenticated (sidebar on desktop) | Default, Mobile-open | ole="navigation", skip link |
| Sidebar | Authenticated side navigation | Desktop (fixed), Mobile (overlay) | Default, Active route, Hover | ole="navigation", active ria-current="page" |
| StatCard | Dashboard statistic tile | Total, per risk level | Loading (skeleton), Loaded | Number + label always present |
| ScannerTabGroup | Analysis mode selector | Text, URL, Combined | Active, Inactive | ole="tablist", arrow key navigation |
| LoadingStage | Analysis progress display | Multi-stage | Pending, Active, Complete | ole="status", ria-live="polite" |
| Modal | Confirmation dialogs | Delete confirmation | Default, Loading, Closed | ole="dialog", focus trap, ria-modal |
| Toast | Short status notifications | Success, Error, Info | Visible, Dismissed | ole="alert", ria-live |
| EmptyState | Placeholder for empty content | No scans, filtered empty | Static | Icon + descriptive text + CTA |
| Skeleton | Content loading placeholder | Card, Row, Stat | Animated shimmer | ria-hidden="true" |
| Alert | Inline alert message | Error, Warning, Success, Info | Static, Dismissible | ole="alert" |

---

## 34. Page Inventory

| Page ID | Name | Route | Purpose | Primary CTA | Secondary CTA | States |
|---|---|---|---|---|---|---|
| P-01 | Landing | / | Product introduction, conversion | "Start Scanning" | "Learn More ↓" | Default, Scrolled (sticky nav) |
| P-02 | Login | /login | User authentication | "Sign In" | "Create Account" | Default, Loading, Error, Redirecting |
| P-03 | Register | /register | New account creation | "Create Account" | "Sign In" | Default, Loading, Error (duplicate email), Success |
| P-04 | Dashboard | /dashboard | Scan activity overview | "New Scan" | "View History" | Loading, Loaded, Empty (no scans) |
| P-05 | Scanner | /scanner | Primary analysis tool | "Analyze Content" | "Clear" | Default, Text tab, URL tab, Combined tab, Submitting, Error |
| P-06 | Result | /results/:scanId | Detailed explainability view | "Scan Another" | "Delete Scan" | Loading, Loaded, Not Found, Forbidden |
| P-07 | History | /history | Paginated scan log | "New Scan" | — | Loading, Loaded, Empty, Filtered Empty |
| P-08 | Profile | /profile | Account management | "Sign Out" | — | Default |
| P-09 | About | /about | Product info, limitations, disclaimer | "Start Scanning" | — | Default |
| P-10 | 404 | /* | Not Found fallback | "Go Home" | — | Static |

---

## 35. UX Principles & Anti-Patterns

### 35.1 UX Design Principles

1. **Explain before alarming.** Never show a CRITICAL badge without showing WHY. Score and evidence come before the risk label in the reading hierarchy.
2. **Show evidence.** Every flagged signal must be grounded in verbatim content from the user's submission. No fabricated evidence ever.
3. **Avoid false certainty.** No UI element implies 100% detection, guaranteed safety, or definitive fraud determination. All language uses hedged framing.
4. **Keep scanning simple.** The Scanner page has one job. No unnecessary toggles, settings, or distractions.
5. **Make risk understandable.** A non-technical user must understand the risk level and its implications within 10 seconds of viewing the Result page.
6. **Protect user privacy.** The privacy guidance strip on the Scanner page and the About page both explain data handling clearly and simply.
7. **Make important actions obvious.** The "Analyze Content" CTA is always visible. "Delete Scan" is behind one confirmation click.
8. **Avoid unnecessary complexity.** No settings pages in MVP. No optional toggles for features that have sensible defaults.
9. **Never use color alone.** Stated twice in this document intentionally. Color is always paired with icon and text label.
10. **Keep security communication clear.** Recommendations use plain language. No legal jargon, no alarming capital letters, no urgency-driven copy.

### 35.2 Explicit Design Anti-Patterns (Prohibited)

| Anti-Pattern | Reason |
|---|---|
| Fake statistics ("98.7% detection rate") | Misrepresents probabilistic AI system; undermines trust |
| Fake AI confidence bars | Misleading; creates false certainty |
| "100% Scam Detection" headlines | Unachievable claim; violates PRD disclaimer requirements |
| Flashing/pulsing CRITICAL badges | Alarmist; violates accessible animation standards |
| Color-only risk differentiation | Accessibility failure; WCAG 2.1 violation |
| Generic SaaS dashboard template styling | Misrepresents the cybersecurity identity of the product |
| Dark patterns in delete flow | User must be able to delete their data without coercion |
| Auto-populating suspicious text examples | Could confuse users about what they submitted |
| Excessive glassmorphism | Reduces readability; aesthetically cheap for this product category |
| Hidden disclaimer text | Disclaimer must be visible, not buried in footer fine print |

---

## 36. Hackathon Demo Path

### 36.1 Optimized Demo Flow (Under 10 Minutes)

`
Landing Page (30 sec)
    ↓
Login (20 sec)
    ↓
Dashboard — Show scan stats (30 sec)
    ↓
Scanner — Submit CRITICAL test case text (30 sec)
    ↓
Loading experience (15 sec)
    ↓
Result Page — Walk through risk score, indicators, evidence, explanation, recommendations (3 min)
    ↓
Scanner — Submit URL test case (30 sec)
    ↓
Result Page — URL signals highlighted (1 min)
    ↓
Scanner — Combined submission (30 sec)
    ↓
Result Page — Sub-scores + combined score + aggregated explanation (1 min)
    ↓
History Page — Show list, risk badges, filtering (30 sec)
    ↓
About Page — Explain AI methodology, limitations, security (1 min)
`

### 36.2 Demo-Critical UI Requirements

- **Risk Score:** Must render visually as a prominent number, immediately readable from 3 meters away during screen share presentation.
- **CRITICAL badge:** Must be visually distinct and immediately recognizable.
- **Evidence excerpts:** Must render exactly as submitted — no modification.
- **Indicator count:** Number of signals detected must be visible on the result card header.
- **Back to Scanner:** Single click from Result page to start a new scan.

---

## 37. Traceability Matrix (PRD to UI)

| PRD Requirement | App Flow Screen | UI Page | UI Component | User Interaction |
|---|---|---|---|---|
| OFF-01: AI Web Application | All Screens | All Pages | Full application stack | — |
| OFF-02: Identify Suspicious Content | Scanner → Result | P-05, P-06 | ScannerTabGroup, IndicatorCard, RiskBadge | Submit scan → View detected signals |
| OFF-05: Explainable Risk Assessment | Result Page | P-06 | EvidenceBlock, IndicatorCard, explanation section | Read indicator explanation + evidence |
| OFF-06: Not Binary "Scam/Not Scam" | Result Page | P-06 | RiskScoreCard, RiskBadge, IndicatorCard (multiple) | Read 0–100 score + tier + full indicator list |
| FR-01/02: Auth (Register/Login) | Login, Register | P-02, P-03 | Input, Button, Alert | Fill form → Submit → Dashboard redirect |
| FR-04: Text Analysis | Scanner Text Tab | P-05 | ScannerTabGroup, Textarea, Button | Select Text tab → Paste → Analyze |
| FR-07: Explanation | Result Page | P-06 | Explanation section, EvidenceBlock | Read sequential result |
| FR-08: Safety Recommendations | Result Page | P-06 | RecommendationCard | Read actionable advice |
| FR-11: URL Analysis | Scanner URL Tab | P-05 | Input (URL), Button | Select URL tab → Paste URL → Analyze |
| FR-13: Combined Analysis | Scanner Combined Tab | P-05 | Both Textarea + Input (URL), Button | Select Combined → Fill both → Analyze |
| FR-14/15: Scan History + Dashboard | Dashboard, History | P-04, P-07 | ScanHistoryTable, StatCard, Pagination | View history → Filter → Delete |
| FR-16: Delete Scan | History, Result | P-06, P-07 | Modal, Button (Danger) | Click delete → Confirm modal → Scan removed |
| NFR-14: Accessibility | All Pages | All | All components with ARIA | Keyboard nav, screen reader, color + text |
| FR-35: Product Disclaimer | Result, About | P-06, P-09 | Disclaimer strip, About prose | Read disclaimer on result page |

---

## 38. Design Validation Checklist

- [x] All PRD features (Text, URL, Combined Analysis, Auth, History, Dashboard) have UI coverage.
- [x] All major app screens have layout specifications.
- [x] Loading states defined for all async operations (Scan submission, Page loads, History list).
- [x] Error states defined for all failure scenarios (401, 403, 404, 422, 500, network, invalid URL).
- [x] Empty states defined for Dashboard and History.
- [x] Mobile responsive behavior defined for all pages.
- [x] Accessibility standards (WCAG 2.1 AA) documented with specific ARIA requirements.
- [x] Risk visualization is prominent, immediately readable, and multi-modal (number + color + icon + text).
- [x] Explainability is the primary information hierarchy on Result page.
- [x] Safety recommendations are visually distinct and clearly actionable.
- [x] No fake claims, fake statistics, or fake AI confidence exist anywhere in the design.
- [x] No dark patterns exist (delete requires confirmation; disclaimers are visible).
- [x] Design system is consistent across all pages.
- [x] Component inventory is complete.
- [x] Page inventory is complete.
- [x] Design token registry is complete and implementation-ready.
- [x] Traceability from PRD requirements to UI screens to components is defined.
- [x] Animation system respects prefers-reduced-motion.
- [x] Hackathon demo path is optimized for live presentation.

---

*End of ScamShield AI UI/UX Design Specification*
*Version 1.0.0 — Created 2026-08-20*
*This document is the sole visual and interaction source of truth for frontend implementation.*
*No application code should be created until development phases are formally approved.*
