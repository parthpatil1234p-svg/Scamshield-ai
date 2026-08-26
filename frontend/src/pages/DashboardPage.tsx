/**
 * src/pages/DashboardPage.tsx
 * Interactive Dashboard with cyber stat cards, activity analytics, and recent scans.
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ScanSearch,
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  AlertOctagon,
  SearchX,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { scansApi } from '../api/client';
import type { DashboardStats, ScanSummaryItem, RiskLevel } from '../types';
import { useAuth } from '../context/AuthContext';

const RISK_CONFIG: Record<RiskLevel, { fg: string; bg: string; icon: React.ElementType }> = {
  LOW:      { fg: 'var(--color-risk-low)',      bg: 'rgba(5, 46, 22, 0.7)',  icon: CheckCircle },
  MEDIUM:   { fg: 'var(--color-risk-medium)',   bg: 'rgba(45, 27, 0, 0.7)',  icon: AlertTriangle },
  HIGH:     { fg: 'var(--color-risk-high)',     bg: 'rgba(44, 16, 8, 0.7)',  icon: AlertOctagon },
  CRITICAL: { fg: 'var(--color-risk-critical)', bg: 'rgba(45, 10, 10, 0.7)', icon: ShieldAlert },
};

function StatCard({
  label,
  value,
  icon: Icon,
  accentColor,
  delayIndex,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  accentColor: string;
  delayIndex: number;
}) {
  return (
    <div
      className="rounded-2xl border p-5 card-interactive animate-fade-in-up"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderLeft: `3px solid ${accentColor}`,
        animationDelay: `${delayIndex * 100}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800" style={{ color: accentColor }}>
          <Icon size={16} aria-hidden="true" />
        </div>
      </div>
      <p className="text-3xl font-extrabold font-mono text-white">
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
      } catch { /* graceful fallback */ }
      finally { if (!cancelled) setIsLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const displayName = user?.email?.split('@')[0] ?? 'User';

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 border border-blue-800/40 text-sky-400 mb-2">
            <Zap size={13} aria-hidden="true" />
            <span>Threat Intelligence Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome, {displayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
            {user?.email}
          </p>
        </div>

        <Link
          to="/scanner"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all self-start sm:self-auto"
          style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            boxShadow: '0 4px 20px rgba(37, 99, 235, 0.4)',
          }}
        >
          <ScanSearch size={16} aria-hidden="true" />
          <span>New Analysis</span>
        </Link>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Scans"
            value={stats?.total_scans ?? 0}
            icon={TrendingUp}
            accentColor="var(--color-brand)"
            delayIndex={1}
          />
          <StatCard
            label="Critical Threats"
            value={stats?.critical_risk_scans ?? 0}
            icon={ShieldAlert}
            accentColor="var(--color-risk-critical)"
            delayIndex={2}
          />
          <StatCard
            label="High Risk"
            value={stats?.high_risk_scans ?? 0}
            icon={ShieldAlert}
            accentColor="var(--color-risk-high)"
            delayIndex={3}
          />
          <StatCard
            label="Safe / Low"
            value={stats?.low_risk_scans ?? 0}
            icon={ShieldCheck}
            accentColor="var(--color-risk-low)"
            delayIndex={4}
          />
        </div>
      )}

      {/* Recent Scans Table */}
      <div
        className="rounded-3xl border overflow-hidden animate-fade-in-up delay-300"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-sky-400" aria-hidden="true" />
            <h2 className="font-bold text-base text-white">Recent Analyses</h2>
          </div>
          <Link to="/history" className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1">
            <span>View all</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : recentScans.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <SearchX size={44} className="text-slate-600 mx-auto mb-3" aria-hidden="true" />
            <p className="font-bold text-sm text-slate-300 mb-1">No scan history recorded</p>
            <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
              Submit your first message or investment link to populate threat analytics.
            </p>
            <Link
              to="/scanner"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
            >
              <ScanSearch size={14} /> Start First Scan
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentScans.map((scan) => {
              const cfg = RISK_CONFIG[scan.risk_level as RiskLevel] || RISK_CONFIG.LOW;
              const Icon = cfg.icon;
              return (
                <Link
                  key={scan.scan_id}
                  to={`/results/${scan.scan_id}`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-all hover:bg-slate-800/40 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono flex-shrink-0"
                      style={{ color: cfg.fg, background: cfg.bg }}
                    >
                      <Icon size={12} aria-hidden="true" />
                      {scan.risk_score}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-sky-400 transition-colors">
                        {scan.summary_preview || 'Analysis completed'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {scan.indicator_count} signals · {scan.analysis_type} · {new Date(scan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <ArrowRight size={15} className="text-slate-600 group-hover:text-sky-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
