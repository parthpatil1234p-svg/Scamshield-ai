/**
 * src/components/ui/AnimatedRiskGauge.tsx
 * Animated circular risk score meter with number count-up (0 -> final score)
 * and smooth SVG circular stroke animation.
 */
import { useEffect, useState } from 'react';
import type { RiskLevel } from '../../types';

interface AnimatedRiskGaugeProps {
  score: number;
  level: RiskLevel;
  size?: number;
}

const RISK_COLORS: Record<RiskLevel, { stroke: string; glow: string }> = {
  LOW:      { stroke: 'var(--color-risk-low)',      glow: 'ring-glow-low' },
  MEDIUM:   { stroke: 'var(--color-risk-medium)',   glow: 'ring-glow-medium' },
  HIGH:     { stroke: 'var(--color-risk-high)',     glow: 'ring-glow-high' },
  CRITICAL: { stroke: 'var(--color-risk-critical)', glow: 'ring-glow-critical' },
};

export function AnimatedRiskGauge({ score, level, size = 140 }: AnimatedRiskGaugeProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score || 0)));
  const safeLevel = (level?.toUpperCase() || 'LOW') as RiskLevel;
  const [displayedScore, setDisplayedScore] = useState(0);
  const [progressOffset, setProgressOffset] = useState(1);

  const radius = size * 0.4;
  const strokeWidth = size * 0.085;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (safeScore / 100) * circumference;

  const cfg = RISK_COLORS[safeLevel] || RISK_COLORS.LOW;

  // Number counting effect (ease-out)
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(easeOut * score);

      setDisplayedScore(currentScore);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayedScore(score);
      }
    };

    const animId = window.requestAnimationFrame(step);
    // Trigger stroke fill
    const timer = setTimeout(() => {
      setProgressOffset(targetOffset);
    }, 100);

    return () => {
      window.cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [score, targetOffset]);

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
      aria-label={`Risk score: ${score} out of 100, Level: ${level}`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={`transform -rotate-90 ${cfg.glow}`}
      >
        {/* Track Background Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          opacity={0.6}
        />
        {/* Animated Progress Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={cfg.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      {/* Center Number & Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-bold tracking-tight leading-none"
          style={{
            fontSize: size * 0.28,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {displayedScore}
        </span>
        <span
          className="text-xs font-semibold tracking-wider uppercase mt-1 opacity-70"
          style={{ fontSize: size * 0.08, color: 'var(--color-text-muted)' }}
        >
          / 100
        </span>
      </div>
    </div>
  );
}
