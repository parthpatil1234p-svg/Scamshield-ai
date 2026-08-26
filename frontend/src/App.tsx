/**
 * src/App.tsx — ScamShield AI Root Router
 * Routes defined per docs/APP-FLOW.md Section 2 (Route Map)
 *
 * Route Map:
 *   /            → Landing Page (public)
 *   /about       → About Page (public)
 *   /login       → Login (guest-only — redirect to /dashboard if authed)
 *   /register    → Register (guest-only)
 *   /dashboard   → Dashboard (protected)
 *   /scanner     → Scanner (protected)
 *   /results/:id → Result Detail (protected, owner-only)
 *   /history     → Scan History (protected)
 *   /profile     → Profile (protected)
 *   /*           → 404 Not Found (public)
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GuestRoute } from './components/GuestRoute';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { ResultPage } from './pages/ResultPage';
import { HistoryPage } from './pages/HistoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public Routes ─────────────────────────────── */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* ── Guest-Only Routes (redirect authed users away) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ── Protected Routes (require valid JWT) ───────── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/scanner" element={<ScannerPage />} />
              <Route path="/results/:scanId" element={<ResultPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* ── Legacy redirects for old paths ─────────────── */}
          <Route path="/scan" element={<Navigate to="/scanner" replace />} />
          <Route path="/scan/:scanId" element={<Navigate to="/results/:scanId" replace />} />

          {/* ── 404 Fallback ────────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
