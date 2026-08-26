/**
 * src/pages/ScannerPage.tsx
 * Core scanner per UI-UX-DESIGN.md §17 + §18 (Analysis Loading Experience).
 * Three analysis modes: Text, URL, Combined.
 * Includes multi-step analysis loading animation.
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Link2,
  Layers,
  ScanSearch,
  XCircle,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { scansApi, extractErrorMessage } from '../api/client';
import type { AnalysisType } from '../types';

/* ── Analysis loading steps per UI-UX-DESIGN.md §18 ──────────────────────── */
const ANALYSIS_STEPS = [
  'Input Validation',
  'Signal Extraction',
  'Heuristic & NLP Analysis',
  'Risk Scoring & Synthesis',
];

/* ── Mode tabs ─────────────────────────────────────────────────────────────── */
const MODES: { type: AnalysisType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'text',     icon: FileText, label: 'Text Scan',     desc: 'Paste social media text, investment pitch, or chat message' },
  { type: 'url',      icon: Link2,    label: 'URL Scan',      desc: 'Analyze a suspicious link or website address' },
  { type: 'combined', icon: Layers,   label: 'Combined Scan', desc: 'Submit both text and URL for fused risk calculation' },
];

/* ── Loading overlay ─────────────────────────────────────────────────────── */
function AnalysisLoadingOverlay({ step }: { step: number }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(8px)' }}
      role="status"
      aria-live="polite"
      aria-label="Analyzing content"
    >
      <div
        className="w-full max-w-sm mx-4 p-8 rounded-2xl border text-center"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div
            className="w-14 h-14 rounded-full border-4 animate-spin-fast"
            style={{
              borderColor: 'var(--color-border)',
              borderTopColor: 'var(--color-brand)',
            }}
            aria-hidden="true"
          />
        </div>

        <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Analyzing Content
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
          AI signal extraction in progress…
        </p>

        {/* Steps */}
        <div className="space-y-2.5 text-left">
          {ANALYSIS_STEPS.map((s, i) => {
            const isDone = i < step;
            const isActive = i === step;
            return (
              <div key={s} className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle size={16} style={{ color: 'var(--color-risk-low)', flexShrink: 0 }} aria-hidden="true" />
                ) : isActive ? (
                  <Loader2 size={16} className="animate-spin-fast flex-shrink-0" style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
                ) : (
                  <div
                    className="w-4 h-4 rounded-full border flex-shrink-0"
                    style={{ borderColor: 'var(--color-border)' }}
                    aria-hidden="true"
                  />
                )}
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isDone
                      ? 'var(--color-risk-low)'
                      : isActive
                      ? 'var(--color-accent)'
                      : 'var(--color-text-muted)',
                  }}
                >
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ─────────────────────────────────────────────────────────────── */
export function ScannerPage() {
  const [mode, setMode] = useState<AnalysisType>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const charCount = text.length;
  const MAX_CHARS = 5000;
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

    // Advance loading steps at intervals for UX
    let step = 0;
    stepTimer.current = setInterval(() => {
      step++;
      if (step < ANALYSIS_STEPS.length) {
        setLoadingStep(step);
      } else {
        clearInterval(stepTimer.current!);
      }
    }, 600);

    try {
      const scan = await scansApi.createScan({
        analysis_type: mode,
        text: mode !== 'url' ? text : undefined,
        url: mode !== 'text' ? url : undefined,
      });
      clearInterval(stepTimer.current!);
      navigate(`/results/${scan.scan_id}`);
    } catch (err) {
      clearInterval(stepTimer.current!);
      setError(extractErrorMessage(err));
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <AnalysisLoadingOverlay step={loadingStep} />}

      <div className="p-6 md:p-10 max-w-3xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ScanSearch size={22} style={{ color: 'var(--color-brand)' }} aria-hidden="true" />
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Scan Content for Risk Signals
            </h1>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Paste text, a URL, or both from any social media post or message.
          </p>
        </div>

        {/* Mode Tabs */}
        <div
          className="flex gap-1 p-1 rounded-xl mb-6"
          role="tablist"
          aria-label="Analysis mode"
          style={{ background: 'var(--color-surface)' }}
        >
          {MODES.map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              role="tab"
              aria-selected={mode === type}
              onClick={() => { setMode(type); setError(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all"
              style={{
                background: mode === type ? 'var(--color-brand)' : 'transparent',
                color: mode === type ? '#ffffff' : 'var(--color-text-muted)',
              }}
            >
              <Icon size={15} aria-hidden="true" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Mode description */}
        <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
          {MODES.find(m => m.type === mode)?.desc}
        </p>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6 rounded-2xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {/* Text Textarea */}
          {(mode === 'text' || mode === 'combined') && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="scan-text" className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Message / Post Content
                </label>
                {text.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setText('')}
                    className="text-xs flex items-center gap-1 transition-colors"
                    style={{ color: 'var(--color-text-muted)' }}
                    aria-label="Clear text input"
                  >
                    <XCircle size={12} aria-hidden="true" /> Clear
                  </button>
                )}
              </div>
              <textarea
                id="scan-text"
                value={text}
                onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
                rows={8}
                placeholder="Paste the suspicious message, investment pitch, Telegram post, or social media content here…"
                className="w-full px-4 py-3 rounded-xl border text-sm resize-y transition-colors"
                style={{
                  background: 'var(--color-bg-elevated)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)',
                  minHeight: '180px',
                  maxHeight: '320px',
                  outline: 'none',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--color-accent)')}
                onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                aria-label="Text content to analyze"
                aria-describedby="char-counter"
              />
              <p id="char-counter" className="text-right text-xs mt-1" style={{ color: charColor }}>
                {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </p>
            </div>
          )}

          {/* URL Input */}
          {(mode === 'url' || mode === 'combined') && (
            <div>
              <label htmlFor="scan-url" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                URL to Analyze
              </label>
              <div className="relative">
                <Link2
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-hidden="true"
                />
                <input
                  id="scan-url"
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  maxLength={2048}
                  className="w-full h-11 pl-10 pr-4 rounded-lg border text-sm transition-colors"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
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
              className="flex items-start gap-2.5 px-4 py-3 rounded-lg border text-sm"
              style={{
                background: 'var(--color-risk-critical-bg)',
                borderColor: 'var(--color-risk-critical)',
                color: 'var(--color-risk-critical)',
              }}
            >
              <XCircle size={16} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !canSubmit()}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: isLoading || !canSubmit() ? 'var(--color-brand-subtle)' : 'var(--color-brand)',
              color: isLoading || !canSubmit() ? 'var(--color-text-muted)' : '#ffffff',
              cursor: isLoading || !canSubmit() ? 'not-allowed' : 'pointer',
            }}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin-fast" aria-hidden="true" />
                Analyzing…
              </>
            ) : (
              <>
                <ScanSearch size={16} aria-hidden="true" />
                Analyze Content
              </>
            )}
          </button>
        </form>

        {/* SSRF / Privacy Disclosure */}
        <div
          className="mt-5 px-4 py-3 rounded-xl border text-xs leading-relaxed"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-muted)',
          }}
        >
          <strong style={{ color: 'var(--color-text-secondary)' }}>Privacy Notice:</strong> ScamShield
          AI performs structural and lexical analysis only. <strong>No outbound connections are made
          to analyzed URLs.</strong> Results reflect detected signal patterns and do not constitute
          legal, financial, or regulatory advice.
        </div>
      </div>
    </>
  );
}
