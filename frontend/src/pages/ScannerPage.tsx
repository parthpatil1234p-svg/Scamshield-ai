/**
 * src/pages/ScannerPage.tsx
 * Interactive Scanner with 6-step dynamic animated sequence.
 * Multi-mode selector (Text, URL, Combined) with high-contrast UI.
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Link2,
  Layers,
  ScanSearch,
  XCircle,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  Activity,
  Cpu,
  Fingerprint,
} from 'lucide-react';
import { scansApi, extractErrorMessage } from '../api/client';
import type { AnalysisType } from '../types';

/* ── 6-step dynamic analysis sequence per user spec ──────────────────────── */
const ANALYSIS_STEPS = [
  { label: 'Processing input & payload sanitization', icon: Fingerprint },
  { label: 'Analyzing text patterns & linguistic heuristics', icon: FileText },
  { label: 'Checking URL signals & lexical security', icon: Link2 },
  { label: 'Detecting suspicious scam indicators', icon: ShieldAlert },
  { label: 'Calculating fused risk score & ceiling governor', icon: Cpu },
  { label: 'Synthesizing explainable AI evidence report', icon: Sparkles },
];

/* ── Mode tabs ─────────────────────────────────────────────────────────────── */
const MODES: { type: AnalysisType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'text',     icon: FileText, label: 'Text Scan',     desc: 'Analyze message body, investment pitch, or social media post' },
  { type: 'url',      icon: Link2,    label: 'URL Scan',      desc: 'Inspect a suspicious domain or promotion link (Lexical only)' },
  { type: 'combined', icon: Layers,   label: 'Combined Scan', desc: 'Submit both text and URL for fused risk calculation' },
];

/* ── Multi-Step Cyber Analysis Overlay ───────────────────────────────────── */
function CyberAnalysisOverlay({ currentStep }: { currentStep: number }) {
  const progressPercent = Math.min(Math.round(((currentStep + 1) / ANALYSIS_STEPS.length) * 100), 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(7, 11, 20, 0.92)', backdropFilter: 'blur(16px)' }}
      role="status"
      aria-live="polite"
      aria-label="Analyzing content"
    >
      <div
        className="w-full max-w-md p-8 rounded-3xl border relative overflow-hidden animate-fade-in-scale"
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(13, 19, 33, 0.95) 100%)',
          borderColor: 'rgba(56, 189, 248, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(37, 99, 235, 0.2)',
        }}
      >
        {/* Top Scanner Radar Glow */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-600/40 flex items-center justify-center text-sky-400">
              <Activity size={20} className="animate-pulse" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">
                Scanning Content
              </h2>
              <p className="text-xs text-sky-400 font-mono">
                AI Engine Active · Multi-Signal Analysis
              </p>
            </div>
          </div>
          <span className="text-sm font-bold font-mono text-sky-400">
            {progressPercent}%
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-slate-800 mb-6 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #2563EB 0%, #38BDF8 100%)',
              boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
            }}
          />
        </div>

        {/* 6 Step Sequence */}
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, idx) => {
            const isDone = idx < currentStep;
            const isActive = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={step.label}
                className={`flex items-center gap-3.5 p-2.5 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-blue-950/40 border-sky-500/40 shadow-sm shadow-blue-500/10'
                    : isDone
                    ? 'bg-slate-900/20 border-slate-800/40 opacity-80'
                    : 'border-transparent opacity-40'
                }`}
              >
                {/* State Indicator */}
                <div className="flex-shrink-0">
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-emerald-400" aria-hidden="true" />
                  ) : isActive ? (
                    <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" aria-hidden="true" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700" aria-hidden="true" />
                  )}
                </div>

                {/* Step Icon & Label */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Icon size={14} className={isActive ? 'text-sky-400' : isDone ? 'text-emerald-400' : 'text-slate-500'} aria-hidden="true" />
                  <span
                    className={`text-xs font-medium truncate ${
                      isActive ? 'text-white font-semibold' : isDone ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main Scanner Page ─────────────────────────────────────────────────────── */
export function ScannerPage() {
  const [mode, setMode] = useState<AnalysisType>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const MAX_CHARS = 5000;
  const charCount = text.length;
  const charPct = charCount / MAX_CHARS;
  const charColor =
    charPct >= 0.95 ? 'var(--color-risk-critical)' :
    charPct >= 0.80 ? 'var(--color-risk-medium)' :
    'var(--color-text-muted)';

  const canSubmit = () => {
    if (mode === 'text') return text.trim().length >= 10;
    if (mode === 'url') return url.trim().length > 0;
    if (mode === 'combined') return text.trim().length >= 10 && url.trim().length > 0;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit()) return;
    setError(null);
    setIsLoading(true);
    setLoadingStep(0);

    // Dynamic 6-step progression
    let currentStep = 0;
    stepIntervalRef.current = setInterval(() => {
      currentStep++;
      if (currentStep < ANALYSIS_STEPS.length) {
        setLoadingStep(currentStep);
      } else {
        if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      }
    }, 450);

    try {
      let normalizedUrl = url.trim();
      if (normalizedUrl && !/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = `https://${normalizedUrl}`;
      }

      const scan = await scansApi.createScan({
        analysis_type: mode,
        text: mode !== 'url' ? text.trim() : undefined,
        url: mode !== 'text' ? normalizedUrl : undefined,
      });
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      // Brief pause to display completion before navigation
      setLoadingStep(ANALYSIS_STEPS.length - 1);
      setTimeout(() => {
        navigate(`/results/${scan.scan_id}`);
      }, 350);
    } catch (err) {
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
      setError(extractErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <CyberAnalysisOverlay currentStep={loadingStep} />}

      <div className="p-6 md:p-10 max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-950/60 border border-blue-800/40 text-sky-400 mb-3">
            <ScanSearch size={13} aria-hidden="true" />
            <span>AI Risk Scanner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Analyze Content for Scam Signals
          </h1>
          <p className="text-sm mt-1 text-slate-400">
            Select a scan mode and submit content for instant multi-signal threat evaluation.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div
          className="flex gap-2 p-1.5 rounded-2xl mb-6 border"
          role="tablist"
          aria-label="Analysis mode"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {MODES.map(({ type, icon: Icon, label }) => {
            const isSelected = mode === type;
            return (
              <button
                key={type}
                role="tab"
                aria-selected={isSelected}
                onClick={() => { setMode(type); setError(null); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Context Banner */}
        <div
          className="p-4 rounded-xl border mb-6 text-xs flex items-center gap-3"
          style={{ background: 'var(--color-bg-elevated)', borderColor: 'var(--color-border)' }}
        >
          <Sparkles size={16} className="text-sky-400 flex-shrink-0" aria-hidden="true" />
          <span className="text-slate-300">
            {MODES.find(m => m.type === mode)?.desc}
          </span>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-7 rounded-3xl border card-interactive"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {/* Text Area */}
          {(mode === 'text' || mode === 'combined') && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="scan-text" className="text-sm font-semibold text-slate-200">
                  Message / Post Content
                </label>
                {text.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setText('')}
                    className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors"
                    aria-label="Clear text input"
                  >
                    <XCircle size={13} aria-hidden="true" /> Clear
                  </button>
                )}
              </div>
              <textarea
                id="scan-text"
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                rows={7}
                placeholder="Paste the suspicious message, Telegram pitch, WhatsApp forward, or investment post here…"
                className="w-full px-4 py-3.5 rounded-2xl border text-sm resize-y transition-all focus:ring-2 focus:ring-sky-400/20"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  minHeight: '160px',
                  maxHeight: '340px',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                aria-label="Text content to analyze"
              />
              <div className="flex justify-between items-center text-xs mt-1.5">
                <span className="text-slate-500">Min. 10 characters</span>
                <span style={{ color: charColor, fontFamily: 'var(--font-mono)' }}>
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* URL Input */}
          {(mode === 'url' || mode === 'combined') && (
            <div>
              <label htmlFor="scan-url" className="block text-sm font-semibold text-slate-200 mb-2">
                URL to Analyze
              </label>
              <div className="relative">
                <Link2
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="scan-url"
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/investment-offer"
                  maxLength={2048}
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border text-sm transition-all focus:ring-2 focus:ring-sky-400/20"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                  onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                  aria-label="URL to analyze"
                />
              </div>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-3 p-4 rounded-2xl border text-sm animate-fade-in"
              style={{
                background: 'var(--color-risk-critical-bg)',
                borderColor: 'rgba(248, 113, 113, 0.4)',
                color: 'var(--color-risk-critical)',
              }}
            >
              <XCircle size={18} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !canSubmit()}
            className="btn-primary w-full h-13 flex items-center justify-center gap-2.5 rounded-2xl text-base font-bold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canSubmit()
                ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)'
                : 'var(--color-brand-subtle)',
            }}
            aria-busy={isLoading}
          >
            <ScanSearch size={18} aria-hidden="true" />
            <span>Analyze Content</span>
          </button>
        </form>

        {/* Security / Privacy Disclosure Strip */}
        <div
          className="mt-6 p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <ShieldAlert size={16} className="text-sky-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <strong className="text-slate-200">Zero-Trust Privacy Protocol:</strong> ScamShield AI performs
            structural and lexical analysis only. <strong>No outbound HTTP requests are ever made to submitted URLs</strong>,
            guaranteeing protection against SSRF vulnerabilities.
          </div>
        </div>
      </div>
    </>
  );
}
