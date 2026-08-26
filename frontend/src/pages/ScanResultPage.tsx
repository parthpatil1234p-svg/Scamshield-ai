/**
 * src/pages/ScanResultPage.tsx
 * Detailed scan result view showing risk score, indicators, summary, recommendations.
 * Following UI-UX-DESIGN.md §13 Result Detail Screen.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  AlertCircle,
  ChevronLeft,
  Trash2,
  Info,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { scansApi } from '../api/client';
import { extractErrorMessage } from '../context/AuthContext';
import type { ScanResponse, IndicatorDetail, IndicatorSeverity } from '../types';
import { RiskBadge } from '../components/ui/RiskBadge';

// ─── Risk Score Ring ───────────────────────────────────────────────────────
function ScoreRing({ score, level }: { score: number; level: string }) {
  const RADIUS = 40;
  const CIRC = 2 * Math.PI * RADIUS;
  const offset = CIRC - (score / 100) * CIRC;

  const colorMap: Record<string, string> = {
    LOW: '#34D399',
    MEDIUM: '#FBBF24',
    HIGH: '#FB923C',
    CRITICAL: '#F87171',
  };

  return (
    <div className="flex flex-col items-center" aria-label={`Risk score: ${score} out of 100`}>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#1E2D45" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={RADIUS}
          fill="none"
          stroke={colorMap[level] ?? '#64748B'}
          strokeWidth="10"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
        <text x="50" y="54" textAnchor="middle" fontSize="22" fontWeight="700" fill="#F1F5F9">
          {score}
        </text>
      </svg>
      <span className="text-xs text-text-muted mt-1">Risk Score</span>
    </div>
  );
}

// ─── Indicator Card ────────────────────────────────────────────────────────
const SEV_ICON: Record<IndicatorSeverity, React.ElementType> = {
  LOW: Info,
  MEDIUM: AlertTriangle,
  HIGH: AlertCircle,
  CRITICAL: Zap,
};

const SEV_COLOR: Record<IndicatorSeverity, string> = {
  LOW: 'text-risk-low border-risk-low/30 bg-risk-low/5',
  MEDIUM: 'text-risk-medium border-risk-medium/30 bg-risk-medium/5',
  HIGH: 'text-risk-high border-risk-high/30 bg-risk-high/5',
  CRITICAL: 'text-risk-critical border-risk-critical/30 bg-risk-critical/5',
};

function IndicatorCard({ indicator }: { indicator: IndicatorDetail }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = SEV_ICON[indicator.severity];
  const colorClass = SEV_COLOR[indicator.severity];

  return (
    <div className={`rounded-xl border ${colorClass} p-4`}>
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono opacity-60">{indicator.code}</span>
            <span className="text-sm font-semibold">{indicator.name}</span>
            <span className="text-xs opacity-60">+{indicator.weight} pts</span>
          </div>
          <blockquote className="mt-2 text-xs font-mono bg-black/20 px-3 py-2 rounded-lg italic opacity-80 truncate">
            "{indicator.evidence}"
          </blockquote>
          {expanded && (
            <p className="mt-2 text-xs leading-relaxed opacity-80">{indicator.explanation}</p>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs mt-2 underline opacity-60 hover:opacity-100"
            aria-expanded={expanded}
          >
            {expanded ? 'Hide explanation' : 'Show explanation'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export function ScanResultPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const navigate = useNavigate();
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!scanId) return;
    let cancelled = false;

    scansApi
      .getScan(scanId)
      .then((data) => { if (!cancelled) setScan(data); })
      .catch((err) => { if (!cancelled) setError(extractErrorMessage(err)); })
      .finally(() => { if (!cancelled) setIsLoading(false); });

    return () => { cancelled = true; };
  }, [scanId]);

  const handleDelete = async () => {
    if (!scan || !window.confirm('Delete this scan? This action cannot be undone.')) return;
    setIsDeleting(true);
    try {
      await scansApi.deleteScan(scan.scan_id);
      navigate('/history');
    } catch (err) {
      alert(extractErrorMessage(err));
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 bg-elevated rounded-xl border border-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-xl bg-risk-critical/10 border border-risk-critical/30 text-risk-critical"
        >
          <AlertCircle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
          <span>{error ?? 'Scan not found.'}</span>
        </div>
        <Link to="/history" className="inline-flex items-center gap-2 mt-4 text-sm text-brand-accent hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <Link to="/history" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary mb-6">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Back to History
      </Link>

      {/* Hero Card */}
      <div className="bg-elevated rounded-2xl border border-border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Analysis Result</h1>
            <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {new Date(scan.created_at).toLocaleString()}
              &nbsp;·&nbsp;{scan.analysis_type} analysis
              &nbsp;·&nbsp;{scan.model_metadata.inference_latency_ms}ms
            </p>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 rounded-lg text-text-muted hover:text-risk-critical hover:bg-risk-critical/10 transition-colors disabled:opacity-50"
            aria-label="Delete this scan"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center gap-8">
          <ScoreRing score={scan.risk_score} level={scan.risk_level} />
          <div className="flex-1">
            <RiskBadge level={scan.risk_level} score={scan.risk_score} size="lg" />
            {scan.low_confidence && (
              <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                <Info className="h-3 w-3" aria-hidden="true" />
                Low confidence — few signals detected. Manual review recommended.
              </p>
            )}
            {(scan.text_sub_score !== undefined || scan.url_sub_score !== undefined) && (
              <div className="flex gap-4 mt-3">
                {scan.text_sub_score !== undefined && (
                  <span className="text-xs text-text-muted">Text: <strong className="text-text-secondary">{scan.text_sub_score}</strong></span>
                )}
                {scan.url_sub_score !== undefined && (
                  <span className="text-xs text-text-muted">URL: <strong className="text-text-secondary">{scan.url_sub_score}</strong></span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-elevated rounded-xl border border-border p-5 mb-4">
        <h2 className="font-semibold text-text-primary mb-2">Analysis Summary</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{scan.summary}</p>
      </div>

      {/* Detected Indicators */}
      {scan.detected_indicators.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold text-text-primary mb-3">
            Detected Signals ({scan.detected_indicators.length})
          </h2>
          <div className="space-y-3">
            {scan.detected_indicators.map((ind) => (
              <IndicatorCard key={ind.code} indicator={ind} />
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {scan.recommendations.length > 0 && (
        <div className="bg-elevated rounded-xl border border-border p-5 mb-4">
          <h2 className="font-semibold text-text-primary mb-3">Recommendations</h2>
          <ul className="space-y-2">
            {scan.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-risk-low" aria-hidden="true" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submitted Content Preview */}
      {(scan.submitted_text || scan.submitted_url) && (
        <div className="bg-elevated rounded-xl border border-border p-5">
          <h2 className="font-semibold text-text-primary mb-3 text-sm">Submitted Content</h2>
          {scan.submitted_url && (
            <div className="mb-2">
              <span className="text-xs text-text-muted uppercase tracking-wider">URL</span>
              <p className="text-sm font-mono text-brand-accent break-all mt-0.5">{scan.submitted_url}</p>
            </div>
          )}
          {scan.submitted_text && (
            <div>
              <span className="text-xs text-text-muted uppercase tracking-wider">Text</span>
              <p className="text-sm text-text-secondary mt-0.5 line-clamp-4 leading-relaxed">
                {scan.submitted_text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
