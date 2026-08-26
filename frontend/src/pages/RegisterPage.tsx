/**
 * src/pages/RegisterPage.tsx
 * Modern Cybersecurity Registration Screen.
 * Password strength meter with animated segments and live matching validation.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Mail, Lock, Eye, EyeOff, XCircle, Loader2, CheckCircle2, ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { extractErrorMessage } from '../api/client';
import { CyberBackground } from '../components/ui/CyberBackground';

function getStrength(pwd: string): number {
  if (pwd.length < 4) return 0;
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const STRENGTH_LABELS = ['', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      <CyberBackground />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-2.5 mb-8 z-10 group">
        <div className="p-2 rounded-xl bg-blue-950/60 border border-blue-800/40 group-hover:border-blue-500/60 transition-colors">
          <ShieldCheck size={28} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
        </span>
      </Link>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-3xl border p-8 sm:p-10 z-10 card-interactive animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(13, 19, 33, 0.95) 100%)',
          borderColor: 'rgba(30, 45, 69, 0.9)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(37, 99, 235, 0.12)',
        }}
      >
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1.5">
          Create Your Account
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mb-7">
          Start scanning investment pitches and URLs in seconds
        </p>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 mb-6 p-4 rounded-2xl border text-xs sm:text-sm animate-fade-in"
            style={{
              background: 'var(--color-risk-critical-bg)',
              borderColor: 'rgba(248, 113, 113, 0.4)',
              color: 'var(--color-risk-critical)',
            }}
          >
            <XCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-12 pl-11 pr-4 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-sky-400/20"
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
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="password" type={showPwd ? 'text' : 'password'}
                autoComplete="new-password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full h-12 pl-11 pr-11 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-sky-400/20"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {password.length > 0 && (
              <div className="mt-2.5 animate-fade-in" id="pwd-strength">
                <div className="flex gap-1.5 mb-1">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className="h-1.5 flex-1 rounded-full transition-all duration-300"
                      style={{
                        background: i <= strength ? STRENGTH_COLORS[strength] : 'var(--color-border)',
                        boxShadow: i <= strength ? `0 0 8px ${STRENGTH_COLORS[strength]}80` : 'none',
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span style={{ color: STRENGTH_COLORS[strength] || 'var(--color-text-muted)', fontWeight: 600 }}>
                    {STRENGTH_LABELS[strength]}
                  </span>
                  <span className="text-slate-500">Min. 8 chars (Uppercase + Number)</span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Confirm Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="confirm" type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password" required
                value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat password"
                className="w-full h-12 pl-11 pr-11 rounded-xl border text-sm transition-all focus:ring-2 focus:ring-sky-400/20"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: confirmMismatch ? 'var(--color-error)' : confirmMatch ? 'var(--color-success)' : 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  outline: 'none',
                }}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)}
                className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              {confirmMatch && (
                <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400 animate-fade-in" aria-hidden="true" />
              )}
              {confirmMismatch && (
                <XCircle size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-400 animate-fade-in" aria-hidden="true" />
              )}
            </div>
            {confirmMismatch && (
              <p className="text-xs mt-1 text-rose-400 font-medium animate-fade-in">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="btn-primary w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              boxShadow: '0 4px 18px rgba(37, 99, 235, 0.35)',
            }}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                <span>Creating Account…</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight size={15} aria-hidden="true" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm mt-7 text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-400 hover:underline inline-flex items-center gap-1 ml-1">
            <span>Sign In</span>
            <ArrowRight size={13} />
          </Link>
        </p>
      </div>
    </div>
  );
}
