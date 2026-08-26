/**
 * src/pages/HistoryPage.tsx
 * Paginated Scan Audit History with active pill filters, staggered rows, and delete modal.
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History,
  SearchX,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Loader2,
  ScanSearch,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { scansApi, extractErrorMessage } from '../api/client';
import type { ScanSummaryItem, RiskLevel } from '../types';

const RISK_CONFIG: Record<RiskLevel, { fg: string; bg: string; icon: React.ElementType }> = {
  LOW:      { fg: 'var(--color-risk-low)',      bg: 'rgba(5, 46, 22, 0.7)',  icon: CheckCircle },
  MEDIUM:   { fg: 'var(--color-risk-medium)',   bg: 'rgba(45, 27, 0, 0.7)',  icon: AlertTriangle },
  HIGH:     { fg: 'var(--color-risk-high)',     bg: 'rgba(44, 16, 8, 0.7)',  icon: AlertOctagon },
  CRITICAL: { fg: 'var(--color-risk-critical)', bg: 'rgba(45, 10, 10, 0.7)', icon: ShieldAlert },
};

const FILTERS: Array<{ label: string; value: RiskLevel | 'ALL' }> = [
  { label: 'All Scans', value: 'ALL' },
  { label: 'Critical',  value: 'CRITICAL' },
  { label: 'High',      value: 'HIGH' },
  { label: 'Medium',    value: 'MEDIUM' },
  { label: 'Low',       value: 'LOW' },
];

export function HistoryPage() {
  const [scans, setScans] = useState<ScanSummaryItem[]>([]);
  const [filter, setFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ScanSummaryItem | null>(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const risk_level = filter === 'ALL' ? undefined : filter;
      const res = await scansApi.listScans(page, 15, risk_level);
      setScans(res.data);
      setTotalPages(res.pagination.total_pages);
      setTotalCount(res.pagination.total);
    } catch { /* graceful fallback */ }
    finally { setIsLoading(false); }
  }, [filter, page]);

  useEffect(() => { load(); }, [load]);

  const changeFilter = (f: RiskLevel | 'ALL') => {
    setFilter(f);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.scan_id);
    try {
      await scansApi.deleteScan(deleteTarget.scan_id);
      setDeleteTarget(null);
      setScans(prev => prev.filter(s => s.scan_id !== deleteTarget.scan_id));
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      alert(extractErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      {/* Delete Modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(7, 11, 20, 0.88)', backdropFilter: 'blur(12px)' }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md p-7 rounded-3xl border animate-fade-in-scale"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <h3 className="text-lg font-bold text-white mb-2">Delete Scan Record?</h3>
            <p className="text-sm text-slate-400 mb-6">
              This record will be permanently deleted from your scan history.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-11 rounded-xl border text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!!deletingId}
                className="flex-1 h-11 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
              >
                {deletingId && <Loader2 size={16} className="animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 border border-blue-800/40 text-sky-400 mb-2">
            <History size={13} aria-hidden="true" />
            <span>Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Scan History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {totalCount} total analysis report{totalCount !== 1 ? 's' : ''} stored in your account
          </p>
        </div>

        <Link
          to="/scanner"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white transition-all self-start sm:self-auto"
          style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }}
        >
          <ScanSearch size={16} aria-hidden="true" />
          <span>New Scan</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter scans by risk tier">
        {FILTERS.map(({ label, value }) => {
          const isActive = filter === value;
          return (
            <button
              key={value}
              onClick={() => changeFilter(value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Scan List Container */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="py-20 px-6 rounded-3xl border text-center" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <SearchX size={48} className="text-slate-600 mx-auto mb-3" aria-hidden="true" />
          <p className="text-base font-bold text-white mb-1">No matching scans found</p>
          <p className="text-xs text-slate-400 mb-6">
            {filter !== 'ALL' ? `No ${filter} risk scans match this filter.` : 'Start scanning suspicious content to build your history.'}
          </p>
          <Link
            to="/scanner"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500"
          >
            <ScanSearch size={14} /> Scan Content
          </Link>
        </div>
      ) : (
        <div
          className="rounded-3xl border overflow-hidden"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="divide-y divide-slate-800/80">
            {scans.map((scan, idx) => {
              const level = scan.risk_level as RiskLevel;
              const cfg = RISK_CONFIG[level] || RISK_CONFIG.LOW;
              const Icon = cfg.icon;

              return (
                <div
                  key={scan.scan_id}
                  className="flex items-center justify-between gap-4 px-6 py-4.5 transition-all hover:bg-slate-800/40 group animate-fade-in-up"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  {/* Left Risk Badge & Summary */}
                  <div
                    onClick={() => navigate(`/results/${scan.scan_id}`)}
                    className="flex items-center gap-4 min-w-0 flex-1 cursor-pointer"
                  >
                    <span
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono flex-shrink-0"
                      style={{ color: cfg.fg, background: cfg.bg }}
                    >
                      <Icon size={12} aria-hidden="true" />
                      {scan.risk_score}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate group-hover:text-sky-400 transition-colors">
                        {scan.summary_preview || 'Scan report'}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">
                        {scan.indicator_count} signals · {scan.analysis_type} mode · {new Date(scan.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/results/${scan.scan_id}`)}
                      className="p-2 rounded-xl text-slate-400 hover:text-sky-400 hover:bg-blue-950/40 transition-colors"
                      aria-label="View detailed result"
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(scan)}
                      disabled={deletingId === scan.scan_id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      aria-label="Delete scan record"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-mono text-slate-400 px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
