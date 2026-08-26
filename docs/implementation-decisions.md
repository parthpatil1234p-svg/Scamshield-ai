# ScamShield AI — Implementation Decisions Log

This document records technical trade-offs, package adaptations, and implementation decisions made during the build phase.

---

## Log Entries

### IDR-001: Project Setup & Package Configurations
- **Date:** 2026-08-21
- **Context:** Initializing FastAPI (Python) backend and React 18 (TypeScript + Vite + Tailwind CSS) frontend.
- **Decision:** Use Python built-in venv for backend environment isolation and npm for frontend package management as specified in TRD Section 2.
- **Impact:** Clean reproducible environments for development and testing.

### IDR-002: Bcrypt & Passlib Compatibility on Python 3.12
- **Date:** 2026-08-25
- **Context:** `passlib` has compatibility issues with `bcrypt >= 5.0.0` under Python 3.12.
- **Decision:** Pinned `bcrypt==4.0.1` and added `email-validator>=2.0.0` in `backend/requirements.txt`.
- **Impact:** Robust, zero-warning password hashing and email format validation across all environments.

### IDR-003: Route Structure Harmonization
- **Date:** 2026-08-26
- **Context:** App.tsx had legacy routes `/scan` and `/scan/:scanId`, and a tabbed login/register modal, whereas `APP-FLOW.md` and `UI-UX-DESIGN.md` explicitly required `/scanner`, `/results/:scanId`, standalone `/login`, standalone `/register`, `/profile`, `/about`, and `/`.
- **Decision:** Aligned all React Router routes strictly to `docs/APP-FLOW.md` Section 2, adding automatic redirects from `/scan` → `/scanner` and `/scan/:id` → `/results/:id` for backward compatibility. Separated `/login` and `/register` pages and implemented GuestRoute guards.
- **Impact:** 100% adherence to the user journey and navigation specifications.

### IDR-004: Design System Variable Architecture
- **Date:** 2026-08-26
- **Context:** Tailwind CSS v4 `@theme` directive integration with exact UI/UX design tokens (#070B14 base, #2563EB brand, #38BDF8 accent, risk colors).
- **Decision:** Embedded CSS variables directly into `:root` and `@theme` in `src/index.css` and used standard CSS variable bindings across core components (`RiskBadge`, `ScoreRing`, cards, banners) to prevent styling discrepancies.
- **Impact:** Pixel-perfect theme consistency, high-contrast accessible risk badges, and smooth animations across all desktop and mobile viewports.
