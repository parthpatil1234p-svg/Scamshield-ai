/**
 * src/pages/LoginPage.tsx
 * Login page per UI-UX-DESIGN.md §14.
 * Full-viewport centered card with shield logo, email/password inputs, and error state.
 */
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
      const redirect = params.get('redirect') || '/dashboard';
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, #0D1A3A 0%, #070B14 100%)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <ShieldCheck size={36} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        <span className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl border p-10"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1 className="text-2xl font-bold mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
          Sign In to Your Account
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Manage your scans and history
        </p>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 mb-6 px-4 py-3 rounded-lg border text-sm"
            style={{
              background: 'var(--color-risk-critical-bg)',
              borderColor: 'var(--color-risk-critical)',
              color: 'var(--color-risk-critical)',
            }}
          >
            <XCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--color-text-muted)' }}
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-lg border text-sm transition-colors"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--color-text-muted)' }}
                aria-hidden="true"
              />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 pl-10 pr-11 rounded-lg border text-sm transition-colors"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                onClick={() => setShowPwd((v) => !v)}
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: isLoading || !email || !password ? 'var(--color-brand-subtle)' : 'var(--color-brand)',
              color: isLoading || !email || !password ? 'var(--color-text-muted)' : '#ffffff',
              cursor: isLoading || !email || !password ? 'not-allowed' : 'pointer',
            }}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin-fast" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium transition-colors"
            style={{ color: 'var(--color-accent)' }}
          >
            Create Account →
          </Link>
        </p>
      </div>
    </div>
  );
}
