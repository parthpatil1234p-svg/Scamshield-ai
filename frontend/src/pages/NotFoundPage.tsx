/**
 * src/pages/NotFoundPage.tsx
 * Friendly 404 fallback per APP-FLOW.md route table.
 */
import { Link } from 'react-router-dom';
import { ShieldCheck, Home, ScanSearch } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--color-bg-base)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-12">
        <ShieldCheck size={28} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
          ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      </Link>

      {/* 404 */}
      <div
        className="text-8xl font-bold mb-4"
        style={{ color: 'var(--color-brand-subtle)', letterSpacing: '-0.04em' }}
        aria-hidden="true"
      >
        404
      </div>
      <h1 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>
        Page Not Found
      </h1>
      <p className="text-base mb-10 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          style={{ background: 'var(--color-brand)', color: '#ffffff' }}
        >
          <Home size={16} aria-hidden="true" /> Go Home
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium border"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
        >
          <ScanSearch size={16} aria-hidden="true" /> Dashboard
        </Link>
      </div>
    </div>
  );
}
