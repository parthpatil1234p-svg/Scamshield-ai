/**
 * src/pages/RegisterPage.tsx
 * Registration page per UI-UX-DESIGN.md §15.
 * Fields: Email, Password (with strength indicator), Confirm Password.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Mail, Lock, Eye, EyeOff, XCircle, Loader2, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';

/** Password strength: returns 0–4 */
function getStrength(pwd: string): number {
  if (pwd.length < 4) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLORS = ['', '#EF4444', '#FB923C', '#FBBF24', '#34D399'];

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = getStrength(password);
  const confirmMatch = confirm.length > 0 && confirm === password;
  const confirmMismatch = confirm.length > 0 && confirm !== password;

  const isValid = email.includes('@') && password.length >= 8 && confirmMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setIsLoading(true);
    try {
      await register(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    background: 'var(--color-bg-elevated)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text-primary)',
    outline: 'none',
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
          Create Your Account
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
          Start scanning for scams in seconds
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
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Email Address <span style={{ color: 'var(--color-error)' }} aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 pl-10 pr-4 rounded-lg border text-sm transition-colors"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                aria-required="true"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Password <span style={{ color: 'var(--color-error)' }} aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                id="password" type={showPwd ? 'text' : 'password'}
                autoComplete="new-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full h-11 pl-10 pr-11 rounded-lg border text-sm transition-colors"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                aria-required="true"
                aria-describedby="pwd-strength"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Strength indicator */}
            {password.length > 0 && (
              <div className="mt-2" id="pwd-strength" aria-live="polite">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-1 flex-1 rounded-full transition-colors"
                      style={{ background: i <= strength ? STRENGTH_COLORS[strength] : 'var(--color-border)' }}
                    />
                  ))}
                </div>
                <p className="text-xs" style={{ color: STRENGTH_COLORS[strength] || 'var(--color-text-muted)' }}>
                  {STRENGTH_LABELS[strength]}
                </p>
              </div>
            )}
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Password must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              Confirm Password <span style={{ color: 'var(--color-error)' }} aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
              <input
                id="confirm" type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password" required
                value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full h-11 pl-10 pr-11 rounded-lg border text-sm transition-colors"
                style={{
                  ...inputStyle,
                  borderColor: confirmMismatch ? 'var(--color-error)' : confirmMatch ? 'var(--color-success)' : 'var(--color-border)',
                }}
                onFocus={e => !confirmMismatch && !confirmMatch && (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => !confirmMismatch && !confirmMatch && (e.target.style.borderColor = 'var(--color-border)')}
                aria-required="true"
                aria-describedby={confirmMismatch ? 'confirm-error' : undefined}
              />
              {/* Toggle */}
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-8 top-1/2 -translate-y-1/2 p-1"
                style={{ color: 'var(--color-text-muted)' }}
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {/* Status icon */}
              {confirmMatch && (
                <CheckCircle2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-success)' }} aria-hidden="true" />
              )}
              {confirmMismatch && (
                <XCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-error)' }} aria-hidden="true" />
              )}
            </div>
            {confirmMismatch && (
              <p id="confirm-error" role="alert" className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: isLoading || !isValid ? 'var(--color-brand-subtle)' : 'var(--color-brand)',
              color: isLoading || !isValid ? 'var(--color-text-muted)' : '#ffffff',
              cursor: isLoading || !isValid ? 'not-allowed' : 'pointer',
            }}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin-fast" aria-hidden="true" />
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium" style={{ color: 'var(--color-accent)' }}>
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}
