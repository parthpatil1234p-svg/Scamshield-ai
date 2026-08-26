/**
 * src/pages/ResultPage.tsx
 * Premium Explainable AI Result Screen.
 * Staggered cascading reveal: Animated Gauge (0 -> Score) -> Badge -> Summary -> Evidence Cards -> Safety Guidance.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft,
  Trash2,
  Clock,
  Info,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Quote,
  MessageSquare,
  Shield,
  ScanSearch,
  XCircle,
  Copy,
  Check,
  ChevronDown,
} from 'lucide-react';
import { scansApi, extractErrorMessage } from '../api/client';
import type { ScanResponse, IndicatorDetail, RiskLevel } from '../types';
import { AnimatedRiskGauge } from '../components/ui/AnimatedRiskGauge';

/* ── Risk Level Styling ─────────────────────────────────────────────────── */
const RISK_STYLES: Record<RiskLevel, { fg: string; bg: string; border: string; label: string; icon: React.ElementType }> = {
  LOW: {
    fg: 'var(--color-risk-low)',
    bg: 'rgba(5, 46, 22, 0.7)',
    border: 'rgba(52, 211, 153, 0.4)',
    label: 'LOW Risk',
    icon: CheckCircle,
  },
  MEDIUM: {
    fg: 'var(--color-risk-medium)',
    bg: 'rgba(45, 27, 0, 0.7)',
    border: 'rgba(251, 191, 36, 0.4)',
    label: 'MEDIUM Risk',
    icon: AlertTriangle,
  },
  HIGH: {
    fg: 'var(--color-risk-high)',
    bg: 'rgba(44, 16, 8, 0.7)',
    border: 'rgba(251, 146, 60, 0.4)',
    label: 'HIGH Risk',
    icon: AlertOctagon,
  },
  CRITICAL: {
    fg: 'var(--color-risk-critical)',
    bg: 'rgba(45, 10, 10, 0.7)',
    border: 'rgba(248, 113, 113, 0.4)',
    label: 'CRITICAL Threat',
    icon: ShieldAlert,
  },
};

/* ── Interactive Evidence Card ────────────────────────────────────────────── */
function EvidenceCard({ ind, delayIndex }: { ind: IndicatorDetail; delayIndex: number }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const style = RISK_STYLES[ind.severity] || RISK_STYLES.LOW;
  const Icon = style.icon;

  const handleCopyEvidence = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ind.evidence);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rounded-2xl border p-5 transition-all card-interactive animate-fade-in-up"
      style={{
        background: 'var(--color-surface)',
        borderColor: style.border,
        animationDelay: `${400 + delayIndex * 120}ms`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-1.5 rounded-lg flex-shrink-0" style={{ background: style.bg, color: style.fg }}>
            <Icon size={16} aria-hidden="true" />
          </div>
          <span className="font-bold text-sm text-white">
            {ind.name}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-md font-mono font-semibold"
            style={{ background: 'rgba(30, 45, 69, 0.6)', color: 'var(--color-accent)' }}
          >
            {ind.code}
          </span>
        </div>

        {/* Severity Weight Tag */}
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
          style={{ background: style.bg, color: style.fg, border: `1px solid ${style.border}` }}
        >
          +{ind.weight} pts
        </span>
      </div>

      {/* Verbatim Evidence Snippet */}
      <div className="mb-3 relative group">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="flex items-center gap-1 uppercase tracking-wider font-semibold">
            <Quote size={11} aria-hidden="true" /> Verbatim Evidence
          </span>
          <button
            onClick={handleCopyEvidence}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            aria-label="Copy evidence excerpt"
          >
            {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        <blockquote
          className="text-xs p-3 rounded-xl italic break-words border-l-4"
          style={{
            background: 'rgba(7, 11, 20, 0.6)',
            borderColor: style.fg,
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          "{ind.evidence}"
        </blockquote>
      </div>

      {/* Expandable Explanation Panel */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between pt-2 border-t text-xs font-medium text-slate-400 hover:text-sky-400 transition-colors"
        style={{ borderColor: 'var(--color-border)' }}
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-1.5">
          <MessageSquare size={13} aria-hidden="true" />
          {expanded ? 'Hide threat rationale' : 'Why is this signal suspicious?'}
        </span>
        <ChevronDown
          size={14}
          className={`transform transition-transform duration-200 ${expanded ? 'rotate-180 text-sky-400' : ''}`}
        />
      </button>

      {expanded && (
        <p className="mt-3 text-xs leading-relaxed text-slate-300 p-3 rounded-xl bg-slate-900/50 border border-slate-800 animate-fade-in">
          {ind.explanation}
        </p>
      )}
    </div>
  );
}

/* ── Main Result Page Component ───────────────────────────────────────────── */
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

  /* Loading Skeleton */
  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-5 animate-fade-in">
        <div className="h-6 w-32 skeleton" />
        <div className="h-48 rounded-3xl skeleton" />
        <div className="h-32 rounded-2xl skeleton" />
        <div className="h-40 rounded-2xl skeleton" />
      </div>
    );
  }

  /* Error State */
  if (error || !scan) {
    return (
      <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in">
        <div
          role="alert"
          className="flex items-center gap-3 p-5 rounded-2xl border text-sm"
          style={{ background: 'var(--color-risk-critical-bg)', borderColor: 'rgba(248, 113, 113, 0.4)', color: 'var(--color-risk-critical)' }}
        >
          <XCircle size={20} className="flex-shrink-0" aria-hidden="true" />
          <span>{error ?? 'Scan report not found or access denied.'}</span>
        </div>
        <Link to="/dashboard" className="inline-flex items-center gap-2 mt-5 text-sm text-sky-400 hover:underline">
          <ChevronLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const level = scan.risk_level as RiskLevel;
  const levelStyle = RISK_STYLES[level] || RISK_STYLES.LOW;
  const LevelIcon = levelStyle.icon;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(7, 11, 20, 0.88)', backdropFilter: 'blur(12px)' }}
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md p-7 rounded-3xl border animate-fade-in-scale" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <h3 className="text-lg font-bold text-white mb-2">Delete Scan Record?</h3>
            <p className="text-sm text-slate-400 mb-6">
              This will permanently delete this analysis report from your account. This action cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 rounded-xl border text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 h-11 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 transition-all disabled:opacity-50"
              >
                {isDeleting ? 'Deleting…' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation & Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/history"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} aria-hidden="true" /> Back to History
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/scanner"
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all"
          >
            <ScanSearch size={14} aria-hidden="true" /> New Scan
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
            aria-label="Delete scan report"
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ── 1. Hero Risk Gauge Card (Cascading Stage 1) ─────────────── */}
      <div
        className="rounded-3xl border p-7 mb-6 relative overflow-hidden card-interactive animate-fade-in-up"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(13, 19, 33, 0.95) 100%)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          {/* Left: Gauge + Level */}
          <div className="flex flex-col sm:flex-row items-center gap-7">
            <AnimatedRiskGauge score={scan.risk_score} level={level} size={150} />

            <div className="flex flex-col items-center sm:items-start gap-2.5 text-center sm:text-left">
              {/* Risk Badge with Staggered Fade */}
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold border animate-fade-in"
                style={{
                  color: levelStyle.fg,
                  background: levelStyle.bg,
                  borderColor: levelStyle.border,
                  boxShadow: `0 0 20px ${levelStyle.fg}30`,
                }}
              >
                <LevelIcon size={18} aria-hidden="true" />
                <span>{levelStyle.label}</span>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-1">
                <span className="flex items-center gap-1 font-mono">
                  <Clock size={12} aria-hidden="true" />
                  {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span>·</span>
                <span className="capitalize">{scan.analysis_type} Mode</span>
                <span>·</span>
                <span className="font-mono">{scan.model_metadata.inference_latency_ms}ms</span>
              </div>

              {scan.low_confidence && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1">
                  <Info size={13} aria-hidden="true" />
                  <span>Few signals detected — manual review recommended</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sub-Score Breakdown (if combined) */}
          {(scan.text_sub_score !== undefined || scan.url_sub_score !== undefined) && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex sm:flex-col gap-4 text-center sm:text-left">
              {scan.text_sub_score !== undefined && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Text Score</span>
                  <p className="text-lg font-bold font-mono text-white">{scan.text_sub_score} <span className="text-xs text-slate-500">/ 100</span></p>
                </div>
              )}
              {scan.url_sub_score !== undefined && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">URL Score</span>
                  <p className="text-lg font-bold font-mono text-sky-400">{scan.url_sub_score} <span className="text-xs text-slate-500">/ 100</span></p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 2. AI Executive Summary (Cascading Stage 2) ─────────────── */}
      <div
        className="rounded-2xl border p-6 mb-6 animate-fade-in-up delay-200"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare size={17} className="text-sky-400" aria-hidden="true" />
          <h2 className="text-base font-bold text-white">AI Threat Summary</h2>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {scan.summary}
        </p>
      </div>

      {/* ── 3. Detected Signals & Evidence (Cascading Stage 3) ──────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-white">
              Detected Risk Signals
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                {scan.detected_indicators.length}
              </span>
            </h2>
          </div>
        </div>

        {scan.detected_indicators.length > 0 ? (
          <div className="space-y-4">
            {scan.detected_indicators.map((ind, idx) => (
              <EvidenceCard key={ind.code} ind={ind} delayIndex={idx} />
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-400" aria-hidden="true" />
            <p className="text-sm text-emerald-200">
              No known risk indicators were detected in the analyzed content.
            </p>
          </div>
        )}
      </div>

      {/* ── 4. Actionable Safety Guidance (Cascading Stage 4) ───────── */}
      {scan.recommendations.length > 0 && (
        <div
          className="rounded-2xl border p-6 mb-6 animate-fade-in-up delay-400"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-emerald-400" aria-hidden="true" />
            <h2 className="text-base font-bold text-white">Recommended Safety Actions</h2>
          </div>
          <ul className="space-y-3">
            {scan.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 text-sm text-slate-300">
                <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 5. Submitted Content Inspector ─────────────────────────── */}
      {(scan.submitted_text || scan.submitted_url) && (
        <div
          className="rounded-2xl border p-6 mb-6 animate-fade-in-up delay-500"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Analyzed Payload
          </h2>
          {scan.submitted_url && (
            <div className="mb-3">
              <span className="text-[11px] font-semibold text-slate-500">URL</span>
              <p className="text-xs font-mono text-sky-400 break-all mt-0.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                {scan.submitted_url}
              </p>
            </div>
          )}
          {scan.submitted_text && (
            <div>
              <span className="text-[11px] font-semibold text-slate-500">Text Content</span>
              <p className="text-xs text-slate-300 leading-relaxed mt-0.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800 line-clamp-6">
                {scan.submitted_text}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Technical Metadata Footer */}
      <div className="text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-800">
        <span>Scan ID: {scan.scan_id}</span>
        <span>Engine: {scan.model_metadata.model_version} · v{scan.model_metadata.analysis_version}</span>
      </div>
    </div>
  );
}
