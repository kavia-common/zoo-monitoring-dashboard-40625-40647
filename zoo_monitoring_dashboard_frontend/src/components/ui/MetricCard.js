import React from 'react';

/**
 * PUBLIC_INTERFACE
 * MetricCard
 * Metric display with pastel icon background and progress indicator.
 * Props:
 * - title: string
 * - value: string | number
 * - icon?: React.ReactNode
 * - progressPct?: number (0..100)
 * - progressColor?: string (defaults to var(--color-primary); use var(--color-accent-lime) for Behaviors Detected)
 */
function MetricCard({ title, value, icon, progressPct = 0, progressColor }) {
  const color = progressColor || 'var(--color-primary)';
  const pct = Math.max(0, Math.min(100, progressPct));
  return (
    <div className="metric-card" role="group" aria-label={`${title} metric`}>
      <div className="metric-icon" aria-hidden>
        {icon ?? '📊'}
      </div>
      <div>
        <div className="metric-title">{title}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-progress" aria-label="Progress">
          <span style={{ width: `${pct}%`, background: color }} />
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
