/**
 * src/components/layout/AppLayout.tsx
 * Premium Cybersecurity App Shell.
 * Desktop: Fixed 240px Left Navigation with active glow pills.
 * Mobile: Glassmorphism header + floating bottom navigation bar.
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
import { CyberBackground } from '../ui/CyberBackground';

const PRIMARY_NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/scanner',   icon: ScanSearch,      label: 'Scanner'   },
  { to: '/history',   icon: History,          label: 'Scan History' },
];

const SECONDARY_NAV = [
  { to: '/profile', icon: User, label: 'Profile' },
  { to: '/about',   icon: Info, label: 'Methodology' },
];

function NavItem({
  to, icon: Icon, label, onClick,
}: { to: string; icon: React.ElementType; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => [
        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all',
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
      ].join(' ')}
    >
      <Icon size={18} aria-hidden="true" />
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
    <div className="flex min-h-screen relative" style={{ background: 'var(--color-bg-base)' }}>
      <CyberBackground />

      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 border-r z-20"
        style={{
          background: 'rgba(13, 19, 33, 0.75)',
          backdropFilter: 'blur(20px)',
          borderColor: 'var(--color-border)',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Brand Header */}
        <div
          className="flex items-center gap-3 px-6 h-18 border-b flex-shrink-0"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <div className="p-1.5 rounded-xl bg-blue-950/80 border border-blue-600/40 text-sky-400">
            <ShieldCheck size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white">
              ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
            </span>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>ONLINE</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5" aria-label="Main application navigation">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 mb-2">
            Threat Engine
          </div>
          {PRIMARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 pt-6 mb-2">
            System &amp; Account
          </div>
          {SECONDARY_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>

        {/* Footer User Info & Sign Out */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-950/80 border border-blue-600/40 text-sky-400 flex items-center justify-center font-bold text-xs">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">{user?.email?.split('@')[0]}</p>
                <p className="text-[10px] text-slate-500 truncate font-mono">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-all border border-transparent hover:border-rose-900/40"
            aria-label="Sign out"
          >
            <LogOut size={15} aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Mobile Layout ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 z-10">
        {/* Top Header */}
        <header
          className="md:hidden flex items-center justify-between px-5 h-16 border-b flex-shrink-0 sticky top-0 z-40"
          style={{
            background: 'rgba(7, 11, 20, 0.88)',
            backdropFilter: 'blur(16px)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            <span className="text-base font-bold tracking-tight text-white">
              ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Open mobile menu"
          >
            <Menu size={20} />
          </button>
        </header>

        {/* Slide-in Mobile Drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm md:hidden animate-fade-in"
              onClick={closeMobile}
              aria-hidden="true"
            />
            <nav
              className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col md:hidden border-r animate-fade-in"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              aria-label="Mobile navigation drawer"
            >
              <div
                className="flex items-center justify-between px-6 h-16 border-b"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <span className="text-base font-bold text-white">
                  ScamShield <span style={{ color: 'var(--color-accent)' }}>AI</span>
                </span>
                <button onClick={closeMobile} aria-label="Close menu" className="text-slate-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 px-4 py-6 space-y-2">
                {PRIMARY_NAV.map((item) => (
                  <NavItem key={item.to} {...item} onClick={closeMobile} />
                ))}
                {SECONDARY_NAV.map((item) => (
                  <NavItem key={item.to} {...item} onClick={closeMobile} />
                ))}
              </div>
              <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  onClick={() => { handleLogout(); closeMobile(); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </nav>
          </>
        )}

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 flex border-t z-30"
          style={{
            background: 'rgba(13, 19, 33, 0.92)',
            backdropFilter: 'blur(16px)',
            borderColor: 'var(--color-border)',
            height: '60px',
          }}
          aria-label="Mobile bottom navigation"
        >
          {[...PRIMARY_NAV, { to: '/profile', icon: User, label: 'Profile' }].map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-all ${
                  isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              <span>{label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
