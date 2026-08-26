/**
 * src/pages/HistoryPage.tsx
 * Paginated scan history with risk filter per UI-UX-DESIGN.md §26.
 */
import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  History, SearchX, Trash2, ExternalLink,
  CheckCircle, AlertTriangle, AlertOctagon, ShieldAlert, Loader2,
} from 'lucide-react';
import { scansApi, extractErrorMessage } from '../api/client';
import type { ScanSummaryItem, RiskLevel } from '../types';

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

const FILTERS: Array<{ label: string; value: RiskLevel | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Critical', value: 'CRITICAL' },
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'Low', value: 'LOW' },
];

export function HistoryPage() {
  const [scans, setScans] = useState<ScanSummaryItem[]>([]);
  const [filter, setFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
    } catch { /* silent */ }
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
          style={{ background: 'rgba(7,11,20,0.85)' }}
          role="dialog" aria-modal="true" aria-labelledby="del-title"
        >
          <div
            className="w-full max-w-sm p-6 rounded-2xl border"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <h3 id="del-title" className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
              Delete Scan?
            </h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              This will permanently delete the scan record. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 h-10 rounded-lg border text-sm font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!!deletingId}
                className="flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: 'var(--color-risk-critical)', color: '#ffffff' }}
              >
                {deletingId ? <Loader2 size={14} className="animate-spin-fast" /> : null}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <History size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Scan History</h1>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by risk level">
        {FILTERS.map(({ label, value }) => {
          const isActive = filter === value;
          const fg = value !== 'ALL' ? RISK_FG[value as RiskLevel] : 'var(--color-brand)';
          const bg = value !== 'ALL' ? RISK_BG[value as RiskLevel] : 'var(--color-brand-subtle)';
          return (
            <button
              key={value}
              onClick={() => changeFilter(value)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={{
                background: isActive ? bg : 'transparent',
                color: isActive ? fg : 'var(--color-text-muted)',
                borderColor: isActive ? (fg + '60') : 'var(--color-border)',
              }}
              aria-pressed={isActive}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="skeleton rounded-xl" style={{ height: '64px' }} />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <div className="py-20 text-center">
          <SearchX size={52} style={{ color: 'var(--color-text-muted)' }} className="mx-auto mb-4" aria-hidden="true" />
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>No scans found</p>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
            {filter !== 'ALL' ? `No ${filter} risk scans in your history.` : 'Start your first scan to see results here.'}
          </p>
          <Link
            to="/scanner"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--color-brand)', color: '#ffffff' }}
          >
            New Scan
          </Link>
        </div>
      ) : (
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <ul>
            {scans.map((scan, idx) => {
              const level = scan.risk_level as RiskLevel;
              const Icon = RISK_ICON[level];
              return (
                <li
                  key={scan.scan_id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors"
                  style={{
                    borderTop: idx > 0 ? `1px solid var(--color-border)` : undefined,
                  }}
                >
                  {/* Risk badge */}
                  <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ color: RISK_FG[level], background: RISK_BG[level] }}
                  >
                    <Icon size={11} aria-hidden="true" />
                    {level}
                  </span>

                  {/* Summary */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>
                      {scan.summary_preview || 'Scan completed'}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      Score: {scan.risk_score} · {scan.indicator_count} signal{scan.indicator_count !== 1 ? 's' : ''} · {scan.analysis_type} · {new Date(scan.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => navigate(`/results/${scan.scan_id}`)}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)'; e.currentTarget.style.background = 'var(--color-brand-subtle)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                      aria-label={`View scan result`}
                    >
                      <ExternalLink size={15} aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(scan)}
                      disabled={deletingId === scan.scan_id}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: 'var(--color-text-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-risk-critical)'; e.currentTarget.style.background = 'var(--color-risk-critical-bg)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                      aria-label="Delete scan"
                    >
                      {deletingId === scan.scan_id
                        ? <Loader2 size={15} className="animate-spin-fast" aria-hidden="true" />
                        : <Trash2 size={15} aria-hidden="true" />}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg text-sm border transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            ← Previous
          </button>
          <span className="text-sm px-3" style={{ color: 'var(--color-text-muted)' }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg text-sm border transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
