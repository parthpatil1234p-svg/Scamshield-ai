/**
 * src/pages/ResultPage.tsx
 * Detailed scan result per UI-UX-DESIGN.md §19-25.
 * Shows: Risk Score Ring → Summary → Indicators with Evidence → Recommendations → Submitted Content
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, Trash2, Clock, Info,
  CheckCircle, AlertTriangle, AlertOctagon, ShieldAlert,
  Quote, MessageSquare, Shield, ScanSearch, XCircle,
} from 'lucide-react';
import { scansApi, extractErrorMessage } from '../api/client';
import type { ScanResponse, IndicatorDetail, RiskLevel } from '../types';

/* ── Risk helpers ────────────────────────────────────────────────────────── */
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
  LOW:      CheckCircle,
  MEDIUM:   AlertTriangle,
  HIGH:     AlertOctagon,
  CRITICAL: ShieldAlert,
};
const RISK_LABEL: Record<RiskLevel, string> = {
  LOW:      'LOW Risk',
  MEDIUM:   'MEDIUM Risk',
  HIGH:     'HIGH Risk',
  CRITICAL: 'CRITICAL Risk',
};

/* ── Score Ring ──────────────────────────────────────────────────────────── */
function ScoreRing({ score, level }: { score: number; level: RiskLevel }) {
  const R = 48;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (score / 100) * CIRC;
  const color = RISK_FG[level];
  const glowClass = `ring-glow-${level.toLowerCase()}`;

  return (
    <div className="flex flex-col items-center" aria-label={`Risk score ${score} out of 100`}>
      <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true" className={glowClass}>
        {/* Track */}
        <circle cx="60" cy="60" r={R} fill="none" stroke="var(--color-border)" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="60" cy="60" r={R}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
        {/* Score text */}
        <text x="60" y="65" textAnchor="middle" fontSize="26" fontWeight="700" fill="var(--color-text-primary)">
          {score}
        </text>
      </svg>
      <span className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>/ 100</span>
    </div>
  );
}

/* ── Risk Badge ──────────────────────────────────────────────────────────── */
function RiskBadge({ level }: { level: RiskLevel }) {
  const Icon = RISK_ICON[level];
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border"
      style={{
        color: RISK_FG[level],
        background: RISK_BG[level],
        borderColor: RISK_FG[level] + '50',
      }}
      role="status"
      aria-label={`Risk level: ${RISK_LABEL[level]}`}
    >
      <Icon size={16} aria-hidden="true" />
      {RISK_LABEL[level]}
    </div>
  );
}

/* ── Indicator Card ───────────────────────────────────────────────────────── */
function IndicatorCard({ ind }: { ind: IndicatorDetail }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = RISK_ICON[ind.severity];
  const fg = RISK_FG[ind.severity];
  const bg = RISK_BG[ind.severity];

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: bg, borderColor: fg + '40' }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Icon size={16} style={{ color: fg, flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {ind.code}
            </code>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              {ind.name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ color: fg, background: 'rgba(0,0,0,0.3)' }}>
              +{ind.weight} pts
            </span>
          </div>

          {/* Evidence excerpt */}
          <div className="mb-2">
            <div className="flex items-center gap-1.5 mb-1" style={{ color: 'var(--color-text-muted)' }}>
              <Quote size={12} aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider">Evidence</span>
            </div>
            <blockquote
              className="text-xs px-3 py-2 rounded-lg italic break-words"
              style={{
                background: 'rgba(0,0,0,0.25)',
                color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-mono)',
                borderLeft: `3px solid ${fg}`,
              }}
            >
              "{ind.evidence}"
            </blockquote>
          </div>

          {/* Explanation toggle */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs flex items-center gap-1.5 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            aria-expanded={expanded}
          >
            <MessageSquare size={11} aria-hidden="true" />
            {expanded ? 'Hide explanation ↑' : 'Why is this suspicious? ↓'}
          </button>

          {expanded && (
            <p className="mt-2 text-xs leading-relaxed animate-fade-in" style={{ color: 'var(--color-text-secondary)' }}>
              {ind.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export function ResultPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!scanId) return;
    let cancelled = false;
    scansApi.getScan(scanId)
      .then(data => { if (!cancelled) setScan(data); })
      .catch(err => { if (!cancelled) setError(extractErrorMessage(err)); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [scanId]);

  const handleDelete = async () => {
    if (!scan) return;
    setIsDeleting(true);
    try {
      await scansApi.deleteScan(scan.scan_id);
      navigate('/history', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err));
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  /* Loading skeleton */
  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-4 animate-fade-in">
        {[200, 120, 100, 80].map((h, i) => (
          <div key={i} className="skeleton rounded-xl" style={{ height: `${h}px` }} />
        ))}
      </div>
    );
  }

  /* Error state */
  if (error || !scan) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-xl border text-sm"
          style={{ background: 'var(--color-risk-critical-bg)', borderColor: 'var(--color-risk-critical)', color: 'var(--color-risk-critical)' }}
        >
          <XCircle size={18} className="flex-shrink-0" aria-hidden="true" />
          {error ?? 'Scan not found or access denied.'}
        </div>
        <Link to="/dashboard" className="inline-flex items-center gap-2 mt-4 text-sm" style={{ color: 'var(--color-accent)' }}>
          <ChevronLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const level = scan.risk_level as RiskLevel;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto animate-fade-in">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(7,11,20,0.85)' }} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
          <div className="w-full max-w-sm p-6 rounded-2xl border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 id="delete-modal-title" className="text-lg font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Delete Scan?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>This action cannot be undone. The scan record will be permanently deleted.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-10 rounded-lg border text-sm font-medium"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-10 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: 'var(--color-risk-critical)', color: '#ffffff', opacity: isDeleting ? 0.7 : 1 }}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back + Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/history"
          className="inline-flex items-center gap-1 text-sm transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <ChevronLeft size={16} aria-hidden="true" /> Back to History
        </Link>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--color-risk-critical)';
            e.currentTarget.style.background = 'var(--color-risk-critical-bg)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--color-text-muted)';
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label="Delete this scan"
        >
          <Trash2 size={16} aria-hidden="true" />
        </button>
      </div>

      {/* ── Hero Risk Card ───────────────────────────────────────── */}
      <div
        className="rounded-2xl border p-6 mb-5"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
              Analysis Result
            </h1>
            <p className="text-xs flex flex-wrap items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1">
                <Clock size={11} aria-hidden="true" />
                {new Date(scan.created_at).toLocaleString()}
              </span>
              <span>·</span>
              <span className="capitalize">{scan.analysis_type} analysis</span>
              <span>·</span>
              <span>{scan.model_metadata.inference_latency_ms}ms</span>
            </p>
          </div>
          <Link
            to="/scanner"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ background: 'var(--color-brand-subtle)', color: 'var(--color-brand)' }}
          >
            <ScanSearch size={14} aria-hidden="true" /> New Scan
          </Link>
        </div>

        {/* Score + Badge */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <ScoreRing score={scan.risk_score} level={level} />
          <div className="flex flex-col items-center sm:items-start gap-3">
            <RiskBadge level={level} />

            {scan.low_confidence && (
              <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                <Info size={12} aria-hidden="true" />
                Low confidence — few signals detected. Perform manual review.
              </p>
            )}

            {/* Sub-scores */}
            {(scan.text_sub_score !== undefined || scan.url_sub_score !== undefined) && (
              <div className="flex gap-4">
                {scan.text_sub_score !== undefined && (
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    Text score: <strong style={{ color: 'var(--color-text-secondary)' }}>{scan.text_sub_score}</strong>
                  </span>
                )}
                {scan.url_sub_score !== undefined && (
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    URL score: <strong style={{ color: 'var(--color-text-secondary)' }}>{scan.url_sub_score}</strong>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Summary ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl border p-5 mb-4"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={16} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
          <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Analysis Summary</h2>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {scan.summary}
        </p>
      </div>

      {/* ── Detected Signals ────────────────────────────────────── */}
      {scan.detected_indicators.length > 0 ? (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} style={{ color: 'var(--color-risk-medium)' }} aria-hidden="true" />
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Detected Risk Signals
              <span className="ml-2 text-sm font-normal" style={{ color: 'var(--color-text-muted)' }}>
                ({scan.detected_indicators.length})
              </span>
            </h2>
          </div>
          <div className="space-y-3">
            {scan.detected_indicators.map(ind => (
              <IndicatorCard key={ind.code} ind={ind} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className="rounded-xl border p-5 mb-4 flex items-center gap-3"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <CheckCircle size={18} style={{ color: 'var(--color-risk-low)' }} aria-hidden="true" />
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            No risk indicators detected in the submitted content.
          </p>
        </div>
      )}

      {/* ── Recommendations ─────────────────────────────────────── */}
      {scan.recommendations.length > 0 && (
        <div
          className="rounded-xl border p-5 mb-4"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Safety Recommendations</h2>
          </div>
          <ul className="space-y-2.5">
            {scan.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <CheckCircle size={14} style={{ color: 'var(--color-risk-low)', flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Submitted Content ───────────────────────────────────── */}
      {(scan.submitted_text || scan.submitted_url) && (
        <div
          className="rounded-xl border p-5 mb-4"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-muted)' }}>
            Submitted Content
          </h2>
          {scan.submitted_url && (
            <div className="mb-3">
              <p className="text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>URL</p>
              <p
                className="text-sm break-all"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-mono)' }}
              >
                {scan.submitted_url}
              </p>
            </div>
          )}
          {scan.submitted_text && (
            <div>
              <p className="text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>Text</p>
              <p className="text-sm leading-relaxed line-clamp-6" style={{ color: 'var(--color-text-secondary)' }}>
                {scan.submitted_text}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Technical Details */}
      <div className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
        Scan ID: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-disabled)' }}>{scan.scan_id}</code>
        {' '}·{' '}Model: {scan.model_metadata.model_version}
        {' '}·{' '}Version: {scan.model_metadata.analysis_version}
      </div>

      {/* Disclaimer */}
      <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--color-text-disabled)' }}>
        Results are probabilistic risk assessments based on detected signals only. They do not constitute
        legal, financial, or regulatory advice. Always independently verify investment opportunities.
      </p>
    </div>
  );
}
