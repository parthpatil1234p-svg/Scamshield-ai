/**
 * src/pages/DashboardPage.tsx
 * Dashboard per UI-UX-DESIGN.md §16.
 * Stats grid + recent scans feed + new scan CTA.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanSearch, TrendingUp, ShieldAlert, ShieldCheck, AlertTriangle,
  CheckCircle, AlertOctagon, SearchX,
} from 'lucide-react';
import { scansApi } from '../api/client';
import type { DashboardStats, ScanSummaryItem, RiskLevel } from '../types';
import { useAuth } from '../context/AuthContext';

const RISK_FG: Record<RiskLevel, string> = {
  LOW:      'var(--color-risk-low)',
  MEDIUM:   'var(--color-risk-medium)',
  HIGH:     'var(--color-risk-high)',
  CRITICAL: 'var(--color-risk-critical)',
};
const RISK_BG: Record<RiskLevel, string> = {
  LOW:      'var(--color-risk-low-bg)',
  MEDIUM:   'var(--color-risk-medium-bg)',
  HIGH:     'var(--color-risk-high-bg)',
  CRITICAL: 'var(--color-risk-critical-bg)',
};
const RISK_ICON: Record<RiskLevel, React.ElementType> = {
  LOW: CheckCircle, MEDIUM: AlertTriangle, HIGH: AlertOctagon, CRITICAL: ShieldAlert,
};

function RiskChip({ level, score }: { level: RiskLevel; score: number }) {
  const Icon = RISK_ICON[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ color: RISK_FG[level], background: RISK_BG[level] }}
    >
      <Icon size={11} aria-hidden="true" />
      {level} · {score}
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  fg: string;
  bg: string;
  accent: string;
}
function StatCard({ label, value, icon: Icon, fg, bg, accent }: StatCardProps) {
  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderLeftColor: accent,
        borderLeftWidth: '3px',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
        <div className="p-2 rounded-lg" style={{ background: bg }}>
          <Icon size={16} style={{ color: fg }} aria-hidden="true" />
        </div>
      </div>
      <p className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentScans, setRecentScans] = useState<ScanSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          scansApi.getDashboardStats(),
          scansApi.listScans(1, 5),
        ]);
        if (!cancelled) {
          setStats(statsData);
          setRecentScans(historyData.data);
        }
      } catch { /* show zeros */ }
      finally { if (!cancelled) setIsLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const firstName = user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Welcome back, {firstName}!
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your scan activity overview — {user?.email}
        </p>
      </div>

      {/* Quick Action */}
      <Link
        to="/scanner"
        className="flex items-center gap-3 mb-8 px-5 py-4 rounded-xl text-white font-semibold transition-all text-sm"
        style={{ background: 'var(--color-brand)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-brand-hover)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-brand)')}
      >
        <ScanSearch size={20} aria-hidden="true" />
        + New Scan
      </Link>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className="skeleton rounded-xl" style={{ height: '90px' }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Scans"  value={stats?.total_scans ?? 0}
            icon={TrendingUp}
            fg="var(--color-brand)"  bg="var(--color-brand-subtle)"  accent="var(--color-brand)"
          />
          <StatCard
            label="Critical" value={stats?.critical_risk_scans ?? 0}
            icon={ShieldAlert}
            fg="var(--color-risk-critical)"  bg="var(--color-risk-critical-bg)"  accent="var(--color-risk-critical)"
          />
          <StatCard
            label="High Risk" value={stats?.high_risk_scans ?? 0}
            icon={ShieldAlert}
            fg="var(--color-risk-high)"  bg="var(--color-risk-high-bg)"  accent="var(--color-risk-high)"
          />
          <StatCard
            label="Low / Safe" value={stats?.low_risk_scans ?? 0}
            icon={ShieldCheck}
            fg="var(--color-risk-low)"  bg="var(--color-risk-low-bg)"  accent="var(--color-risk-low)"
          />
        </div>
      )}

      {/* Recent Scans */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <h2 className="font-semibold text-base" style={{ color: 'var(--color-text-primary)' }}>
            Recent Scans
          </h2>
          <Link to="/history" className="text-sm transition-colors" style={{ color: 'var(--color-accent)' }}>
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="skeleton rounded-lg" style={{ height: '56px' }} />
            ))}
          </div>
        ) : recentScans.length === 0 ? (
          <div className="p-10 text-center">
            <SearchX size={48} style={{ color: 'var(--color-text-muted)' }} className="mx-auto mb-4" aria-hidden="true" />
            <p className="font-medium mb-1" style={{ color: 'var(--color-text-secondary)' }}>No scans yet.</p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Start your first scan to see your risk analysis history here.
            </p>
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
              style={{ background: 'var(--color-brand)', color: '#ffffff' }}
            >
              <ScanSearch size={15} aria-hidden="true" />
              Start Your First Scan
            </Link>
          </div>
        ) : (
          <ul>
            {recentScans.map((scan, idx) => (
              <li
                key={scan.scan_id}
                style={{ borderTop: idx > 0 ? `1px solid var(--color-border)` : undefined }}
              >
                <Link
                  to={`/results/${scan.scan_id}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors"
                  style={{ display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-raised)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <RiskChip level={scan.risk_level as RiskLevel} score={scan.risk_score} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {scan.summary_preview || 'No summary available'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {scan.indicator_count} signal{scan.indicator_count !== 1 ? 's' : ''} · {scan.analysis_type} ·{' '}
                      {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
                    View →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
