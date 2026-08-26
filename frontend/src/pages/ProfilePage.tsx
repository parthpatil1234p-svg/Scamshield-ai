/**
 * src/pages/ProfilePage.tsx
 * User profile and session management per UI-UX-DESIGN.md §28.
 */
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, ShieldCheck, ScanSearch } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <User size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Profile</h1>
      </div>

      {/* Profile Card */}
      <div
        className="rounded-2xl border p-6 mb-5"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
            style={{ background: 'var(--color-brand-subtle)', color: 'var(--color-brand)' }}
            aria-hidden="true"
          >
            {user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>
              {user.email.split('@')[0]}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>ScamShield AI User</p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <Mail size={16} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Email Address</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <ShieldCheck size={16} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>User ID</p>
              <p className="text-xs font-mono" style={{ color: 'var(--color-text-disabled)' }}>{user.user_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Calendar size={16} style={{ color: 'var(--color-text-muted)' }} aria-hidden="true" />
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Member Since</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                {new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <Link
          to="/scanner"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
        >
          <ScanSearch size={18} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
          <span className="text-sm font-medium">New Scan</span>
        </Link>
        <Link
          to="/about"
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-colors"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-surface)')}
        >
          <ShieldCheck size={18} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
          <span className="text-sm font-medium">About ScamShield AI</span>
        </Link>
      </div>

      {/* Sign Out */}
      <div
        className="rounded-2xl border p-5"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Session</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
          Signing out will clear your local session. Your scan history remains saved in your account.
        </p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all"
          style={{
            color: 'var(--color-risk-critical)',
            borderColor: 'var(--color-risk-critical)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-risk-critical-bg)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <LogOut size={16} aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
