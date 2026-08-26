/**
 * src/components/ui/RiskBadge.tsx
 * Accessible risk level badge — always pairs color + icon + text label.
 * Per UI-UX-DESIGN.md §32: "Color alone cannot communicate risk."
 */
import { AlertTriangle, CheckCircle, AlertOctagon, ShieldAlert } from 'lucide-react';
import type { RiskLevel } from '../../types';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const RISK_CONFIG: Record<RiskLevel, {
  label: string;
  icon: React.ElementType;
  fg: string;
  bg: string;
}> = {
  LOW:      { label: 'Low Risk',      icon: CheckCircle,  fg: 'var(--color-risk-low)',      bg: 'var(--color-risk-low-bg)' },
  MEDIUM:   { label: 'Medium Risk',   icon: AlertTriangle, fg: 'var(--color-risk-medium)',   bg: 'var(--color-risk-medium-bg)' },
  HIGH:     { label: 'High Risk',     icon: AlertOctagon,  fg: 'var(--color-risk-high)',     bg: 'var(--color-risk-high-bg)' },
  CRITICAL: { label: 'Critical Risk', icon: ShieldAlert,   fg: 'var(--color-risk-critical)', bg: 'var(--color-risk-critical-bg)' },
};

const SIZE_MAP = {
  sm: { padding: '0.25rem 0.625rem', fontSize: '0.75rem', gap: '0.25rem', iconSize: 12 },
  md: { padding: '0.375rem 0.875rem', fontSize: '0.8125rem', gap: '0.375rem', iconSize: 14 },
  lg: { padding: '0.5rem 1rem', fontSize: '0.9375rem', gap: '0.5rem', iconSize: 16 },
};

export function RiskBadge({ level, score, size = 'md' }: RiskBadgeProps) {
  const cfg = RISK_CONFIG[level];
  const sz = SIZE_MAP[size];
  const Icon = cfg.icon;

  return (
    <span
      role="status"
      aria-label={`Risk level: ${cfg.label}${score !== undefined ? `, score: ${score}` : ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: sz.gap,
        padding: sz.padding,
        borderRadius: '9999px',
        fontSize: sz.fontSize,
        fontWeight: 700,
        color: cfg.fg,
        background: cfg.bg,
        border: `1px solid ${cfg.fg}40`,
        flexShrink: 0,
      }}
    >
      <Icon size={sz.iconSize} aria-hidden="true" />
      {cfg.label}
      {score !== undefined && (
        <span style={{ opacity: 0.75 }}>({score})</span>
      )}
    </span>
  );
}
