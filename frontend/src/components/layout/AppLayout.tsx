/**
 * src/components/layout/AppLayout.tsx
 * Main app shell per UI-UX-DESIGN.md §12.
 * Desktop: 240px fixed left sidebar.
 * Mobile: Top bar + bottom navigation bar (4 icons).
 */
import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  ScanSearch,
  History,
  User,
  Info,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRIMARY_NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scanner',   icon: ScanSearch,      label: 'Scanner'   },
  { to: '/history',   icon: History,          label: 'History'   },
];

const BOTTOM_NAV = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/about',   icon: Info, label: 'About'   },
];

function NavItem({
  to, icon: Icon, label, onClick,
}: { to: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => [
        'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
        isActive
          ? 'border-l-[3px] bg-[--color-brand-subtle] text-[--color-text-primary]'
          : 'border-l-[3px] border-transparent text-[--color-text-muted] hover:bg-[--color-surface-raised] hover:text-[--color-text-secondary]',
      ].join(' ')}
      style={({ isActive }) => ({
        borderLeftColor: isActive ? 'var(--color-brand)' : 'transparent',
        backgroundColor: isActive ? 'var(--color-brand-subtle)' : undefined,
      })}
    >
      <Icon size={20} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  );
}

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg-base)' }}>
      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-60 flex-shrink-0 border-r"
        style={{
          background: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 h-16 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <ShieldCheck size={26} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
          <span className="text-base font-bold" style={{ color: 'var(--color-text-primary)' }}>
            ScamShield{' '}
            <span style={{ color: 'var(--color-accent)' }}>AI</span>
          </span>
        </div>

        {/* Primary Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Main navigation">
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Bottom Nav */}
        <div className="px-3 pb-3 space-y-1 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
          {BOTTOM_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          {/* User info */}
          <div
            className="flex items-center gap-2 px-4 py-2 text-xs rounded-lg mt-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <User size={14} aria-hidden="true" />
            <span className="truncate">{user?.email}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border-l-[3px] border-transparent"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--color-surface-raised)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-secondary)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--color-text-muted)';
            }}
            aria-label="Sign out"
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ───────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        <header
          className="md:hidden flex items-center justify-between px-4 h-14 border-b flex-shrink-0 sticky top-0 z-40"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
              ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
        </header>

        {/* ── Mobile Slide-in Menu ───────────────────────────────────────── */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/60 md:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />
            <nav
              className="fixed top-0 left-0 h-full w-64 z-50 flex flex-col md:hidden"
              style={{ background: 'var(--color-surface)' }}
              aria-label="Mobile navigation"
            >
              <div
                className="flex items-center justify-between px-5 h-14 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
                </span>
                <button onClick={closeMobile} aria-label="Close menu" style={{ color: 'var(--color-text-muted)' }}>
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 px-3 py-4 space-y-1">
                {PRIMARY_NAV.map((item) => (
                  <NavItem key={item.to} {...item} onClick={closeMobile} />
                ))}
                {BOTTOM_NAV.map((item) => (
                  <NavItem key={item.to} {...item} onClick={closeMobile} />
                ))}
              </div>
              <div className="px-3 pb-4 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={() => { handleLogout(); closeMobile(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm"
                  style={{ color: 'var(--color-risk-critical)' }}
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </nav>
          </>
        )}

        {/* ── Main Content ──────────────────────────────────────────────── */}
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          <Outlet />
        </main>

        {/* ── Mobile Bottom Navigation Bar ─────────────────────────────── */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex border-t z-30"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            height: '56px',
          }}
          aria-label="Bottom navigation"
        >
          {[...PRIMARY_NAV, { to: '/profile', icon: User, label: 'Profile' }].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors ${
                  isActive ? '' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-brand)' : 'var(--color-text-muted)',
              })}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
