import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * GiantAnteaterDashboard
 * Shows header, date range dropdown, behavior charts, and a 24-hour heatmap.
 * Clicks on bars/segments/heatmap navigate to /timeline with query parameters.
 */
function GiantAnteaterDashboard() {
  const navigate = useNavigate();
  const [range, setRange] = useState('Last 7 days');

  const behaviors = useMemo(() => ([
    { key: 'Pacing', count: 12, color: 'var(--primary)' },
    { key: 'Moving', count: 20, color: 'var(--primary-600)' },
    { key: 'Scratching', count: 8, color: 'var(--secondary)' },
    { key: 'Recumbent', count: 18, color: 'var(--muted)' },
    { key: 'Non-Recumbent', count: 14, color: '#3B82F6' },
  ]), []);

  const durations = useMemo(() => ([
    { key: 'Pacing', mins: 40, color: 'var(--primary)' },
    { key: 'Moving', mins: 65, color: 'var(--primary-600)' },
    { key: 'Scratching', mins: 15, color: 'var(--secondary)' },
    { key: 'Recumbent', mins: 120, color: 'var(--muted)' },
    { key: 'Non-Recumbent', mins: 90, color: '#3B82F6' },
  ]), []);

  const maxCount = Math.max(...behaviors.map(b => b.count), 1);
  const maxMins = Math.max(...durations.map(d => d.mins), 1);

  const gotoTimeline = (filterKey) => {
    const qp = new URLSearchParams({ behavior: filterKey, range });
    navigate(`/timeline?${qp.toString()}`);
  };

  const heatmapHours = [...Array(24).keys()];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Giant Anteater</h2>
              <div className="muted">Status: <span className="badge" aria-label="Healthy status">Healthy</span></div>
            </div>
            <div>
              <label className="subtle" htmlFor="date-range">Date Range</label>
              <select
                id="date-range"
                className="input"
                aria-label="Date Range"
                value={range}
                onChange={e => setRange(e.target.value)}
              >
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-2" style={{ marginBottom: 16 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Behavior Count</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 240, padding: 12, border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
              {behaviors.map(b => {
                const h = (b.count / maxCount) * 200 + 20;
                return (
                  <div key={b.key} style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
                    <button
                      aria-label={`Filter timeline by ${b.key}`}
                      onClick={() => gotoTimeline(b.key)}
                      style={{
                        width: '100%',
                        height: h,
                        background: `var(${b.color.startsWith('var(') ? b.color.slice(4, -1) : '--primary'})`,
                        backgroundColor: b.color.startsWith('var(') ? undefined : b.color,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                      }}
                      title={`${b.key}: ${b.count}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Behavior Duration (mins)</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {durations.map(d => {
                const w = (d.mins / maxMins) * 100;
                return (
                  <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      aria-label={`Filter timeline by ${d.key}`}
                      onClick={() => gotoTimeline(d.key)}
                      style={{
                        width: `${Math.max(8, w)}%`,
                        height: 28,
                        background: `var(${d.color.startsWith('var(') ? d.color.slice(4, -1) : '--primary'})`,
                        backgroundColor: d.color.startsWith('var(') ? undefined : d.color,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        textAlign: 'left',
                        color: '#fff',
                        padding: '0 8px',
                      }}
                      title={`${d.key}: ${d.mins} mins`}
                    >
                      {d.key}
                    </button>
                    <span className="muted">{d.mins}m</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>24-Hour Heatmap</div>
          <div className="heatmap" aria-label="24 hour heatmap">
            {heatmapHours.map(h => {
              // deterministic intensity for placeholder
              const intensity = (Math.sin(h / 3) + 1) / 2; // 0..1
              const bg = intensity < 0.15 ? '#F3F4F6' : `rgba(37,99,235,${0.15 + intensity * 0.5})`;
              return (
                <button
                  key={h}
                  className="heat-cell"
                  aria-label={`Open timeline hour ${h}:00`}
                  onClick={() => gotoTimeline(`hour-${h}`)}
                  title={`${h}:00`}
                  style={{ background: bg }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiantAnteaterDashboard;
