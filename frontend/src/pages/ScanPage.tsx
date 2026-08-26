/**
 * src/pages/ScanPage.tsx
 * Analysis input page: supports text, URL, and combined analysis modes.
 * Following UI-UX-DESIGN.md §12 Scanner Interface specification.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertCircle, FileText, Link as LinkIcon, Layers } from 'lucide-react';
import { scansApi } from '../api/client';
import { extractErrorMessage } from '../context/AuthContext';
import type { AnalysisType } from '../types';

const MODE_OPTIONS: { type: AnalysisType; label: string; icon: React.ElementType; description: string }[] = [
  {
    type: 'text',
    label: 'Text Analysis',
    icon: FileText,
    description: 'Paste message content, investment pitch, or social media post',
  },
  {
    type: 'url',
    label: 'URL Analysis',
    icon: LinkIcon,
    description: 'Analyze a suspicious link or website URL',
  },
  {
    type: 'combined',
    label: 'Combined Analysis',
    icon: Layers,
    description: 'Analyze both text content and a URL together',
  },
];

export function ScanPage() {
  const [mode, setMode] = useState<AnalysisType>('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const canSubmit = () => {
    if (mode === 'text') return text.trim().length > 0;
    if (mode === 'url') return url.trim().length > 0;
    if (mode === 'combined') return text.trim().length > 0 && url.trim().length > 0;
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const req = {
        analysis_type: mode,
        text: (mode === 'text' || mode === 'combined') ? text : undefined,
        url: (mode === 'url' || mode === 'combined') ? url : undefined,
      };
      const scan = await scansApi.createScan(req);
      navigate(`/scan/${scan.scan_id}`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Analyze Content</h1>
        <p className="text-text-muted mt-1">
          Submit suspicious content for AI-powered scam detection.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-3 gap-3 mb-6" role="group" aria-label="Analysis mode">
        {MODE_OPTIONS.map(({ type, label, icon: Icon, description }) => (
          <button
            key={type}
            onClick={() => { setMode(type); setError(null); }}
            className={`flex flex-col items-start gap-1.5 p-4 rounded-xl border text-left transition-all ${
              mode === type
                ? 'border-brand-primary bg-brand-primary/10 text-text-primary'
                : 'border-border bg-elevated text-text-muted hover:border-border/80 hover:bg-surface-raised'
            }`}
            aria-pressed={mode === type}
          >
            <Icon className="h-5 w-5 flex-shrink-0 text-brand-primary" aria-hidden="true" />
            <span className="text-sm font-semibold">{label}</span>
            <span className="text-xs leading-relaxed opacity-70">{description}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        {(mode === 'text' || mode === 'combined') && (
          <div>
            <label htmlFor="text-input" className="block text-sm font-medium text-text-secondary mb-1.5">
              Message / Content
              <span className="text-text-muted font-normal ml-2">(max 5,000 characters)</span>
            </label>
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={8}
              maxLength={5000}
              placeholder="Paste the suspicious message, investment pitch, or social media post here..."
              className="w-full px-4 py-3 bg-elevated border border-border rounded-xl text-text-primary placeholder-text-muted text-sm resize-y focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors"
              aria-label="Text content to analyze"
            />
            <p className="text-right text-xs text-text-muted mt-1">
              {text.length} / 5,000
            </p>
          </div>
        )}

        {/* URL Input */}
        {(mode === 'url' || mode === 'combined') && (
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-text-secondary mb-1.5">
              URL to Analyze
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" aria-hidden="true" />
              <input
                id="url-input"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com or http://suspicious-site.xyz"
                maxLength={2048}
                className="w-full pl-10 pr-4 py-2.5 bg-elevated border border-border rounded-xl text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors"
                aria-label="URL to analyze"
              />
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-risk-critical/10 border border-risk-critical/30 text-risk-critical text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !canSubmit()}
          className="w-full flex items-center justify-center gap-2 py-3 bg-brand-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true" />
              Analyzing…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden="true" />
              Analyze Content
            </>
          )}
        </button>
      </form>

      {/* Disclaimer */}
      <p className="mt-6 text-xs text-text-muted leading-relaxed">
        <strong className="text-text-secondary">How it works:</strong> ScamShield AI performs
        structural and lexical analysis on submitted content. URL analysis is lexical only — no
        outbound connections are made to analyzed URLs. Results reflect detected patterns only
        and do not constitute legal or financial advice.
      </p>
    </div>
  );
}
