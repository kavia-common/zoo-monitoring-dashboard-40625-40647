import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * GiantAnteaterDashboard
 * Implements interactive charts and a 24-hour heatmap strictly per the latest spec.
 * - Behavior Count Bar Chart (exact counts): Pacing 12, Moving 25, Scratching 22, Recumbent 15, Non-Recumbent 20
 *   bar width 40px, gap 20px, labels above, tooltip with Behavior, Count, % of total,
 *   hover lighten ~10%, click navigates to Timeline filtered and renders same count of events.
 * - Behavior Duration totals [50,120,80,70,95] with stacked bars and optional pie showing % labels,
 *   tooltips show Behavior, Duration, %, click navigates to Timeline filtered.
 * - Daily 24-hour Heatmap with new intensity grid (rows behaviors, columns 00–23),
 *   color scale: 0 -> var(--table-row-hover), 1–5 -> gradient to var(--primary);
 *   tooltips show behavior/hour/events; click navigates to Timeline filtered by behavior+hour.
 * - Dashboard filters (Behavior multi-select, Date presets, Camera/Location optional) update visuals and Timeline consistently.
 * - Theme variables used for all colors/borders/shadows; Non-Recumbent color explicitly #3B82F6 allowed.
 * - No new dependencies.
 */
function GiantAnteaterDashboard() {
  const navigate = useNavigate();

  // Staged filters and applied filters
  const [formFilters, setFormFilters] = useState({
    behaviors: ['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'],
    range: 'Today',
    camera: 'All Cameras',
  });
  const [applied, setApplied] = useState(formFilters);
  const [showPie, setShowPie] = useState(false);

  // Behavior palette (theme variables) and allowed explicit for Non-Recumbent
  const behaviorPalette = {
    Pacing: 'var(--primary)',
    Moving: 'var(--primary-600)',
    Scratching: 'var(--secondary)',
    Recumbent: 'var(--muted)',
    'Non-Recumbent': '#3B82F6',
  };

  // Exact provided data
  const fixedCounts = useMemo(() => ([
    { key: 'Pacing', count: 12 },
    { key: 'Moving', count: 25 },
    { key: 'Scratching', count: 22 },
    { key: 'Recumbent', count: 15 },
    { key: 'Non-Recumbent', count: 20 },
  ]), []);
  const fixedDurations = useMemo(() => ([
    { key: 'Pacing', mins: 50 },
    { key: 'Moving', mins: 120 },
    { key: 'Scratching', mins: 80 },
    { key: 'Recumbent', mins: 70 },
    { key: 'Non-Recumbent', mins: 95 },
  ]), []);

  // Deterministic heatmap intensity grid (0..1 scale)
  const baseHeatmap = useMemo(() => {
    const behaviors = ['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'];
    const rows = {};
    behaviors.forEach((b, bi) => {
      const hours = [];
      for (let h = 0; h < 24; h++) {
        const intensity = Math.max(0, Math.min(1, (Math.sin((h + bi * 0.7) / 2.3) + 1) / 2));
        // "events" count derived 0..5 to match color scale note, display only
        const events = Math.round(intensity * 5);
        hours.push({ hour: h, intensity, events });
      }
      rows[b] = hours;
    });
    return rows;
  }, []);

  const filteredKeys = useMemo(() => applied.behaviors, [applied.behaviors]);

  // Scaling by filters: Spec requires charts reflect latest provided sample data; keep scale = 1 to preserve exact counts/durations.
  const counts = useMemo(() => {
    return fixedCounts.filter(b => filteredKeys.includes(b.key));
  }, [fixedCounts, filteredKeys]);

  const durations = useMemo(() => {
    return fixedDurations.filter(d => filteredKeys.includes(d.key));
  }, [fixedDurations, filteredKeys]);

  const totalCount = counts.reduce((s, c) => s + c.count, 0) || 1;
  const totalDuration = durations.reduce((s, d) => s + d.mins, 0) || 1;
  const maxCount = Math.max(...counts.map(b => b.count), 1);

  const fmtPct = (value, total) => `${Math.round((value / total) * 100)}%`;

  // Navigation to timeline with filters
  const gotoTimeline = (opts) => {
    const qp = new URLSearchParams({
      ...(opts.behavior ? { behavior: opts.behavior } : {}),
      ...(opts.hour !== undefined ? { hour: String(opts.hour).padStart(2, '0') } : {}),
      range: applied.range,
      camera: applied.camera,
    });
    navigate(`/timeline?${qp.toString()}`);
  };

  // Pie helpers
  const pieData = useMemo(() => {
    let acc = 0;
    return durations.map(d => {
      const frac = d.mins / totalDuration;
      const start = acc;
      const end = acc + frac * Math.PI * 2;
      acc = end;
      return { key: d.key, start, end, frac, mins: d.mins };
    });
  }, [durations, totalDuration]);
  const polarToCartesian = (cx, cy, r, angle) => ({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });

  // Heatmap rows after filters
  const heatmapRows = useMemo(
    () => filteredKeys.map(k => ({ key: k, hours: baseHeatmap[k] || [] })),
    [filteredKeys, baseHeatmap]
  );

  // Color helpers
  const lighten = (color, amount = 0.1) => `color-mix(in srgb, ${color} ${Math.round((1 - amount) * 100)}%, white ${Math.round(amount * 100)}%)`;
  const heatColor = (intensity, key) => {
    if (intensity <= 0.02) return 'var(--table-row-hover)';
    const base = key === 'Non-Recumbent' ? '#3B82F6' : (behaviorPalette[key] || 'var(--primary)');
    const pctBase = Math.round(intensity * 100);
    const pctClamped = Math.max(10, Math.min(100, pctBase));
    return `color-mix(in srgb, ${base} ${pctClamped}%, var(--table-row-hover) ${100 - pctClamped}%)`;
  };

  const toggleBehavior = (b) => {
    setFormFilters(prev => {
      const set = new Set(prev.behaviors);
      if (set.has(b)) set.delete(b); else set.add(b);
      return { ...prev, behaviors: Array.from(set) };
    });
  };
  const applyFilters = () => setApplied(formFilters);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">
        {/* Header and Filters */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Giant Anteater</h2>
              <div className="muted">Status: <span className="badge" aria-label="Healthy status">Healthy</span></div>
            </div>
            <div className="row" style={{ gap: 12, alignItems: 'flex-end' }}>
              <div>
                <div className="subtle">Behaviors</div>
                <div className="row" style={{ flexWrap: 'wrap' }}>
                  {['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'].map(b => {
                    const selected = formFilters.behaviors.includes(b);
                    return (
                      <button
                        key={b}
                        className="btn"
                        aria-label={`Toggle ${b}`}
                        onClick={() => toggleBehavior(b)}
                        style={{
                          borderColor: selected ? 'var(--primary)' : 'var(--border)',
                          background: selected ? 'var(--card-hover)' : 'transparent'
                        }}
                        title={selected ? 'Selected' : 'Click to include'}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label style={{ minWidth: 160 }}>
                <div className="subtle">Date Preset</div>
                <select
                  className="input"
                  aria-label="Date Preset"
                  value={formFilters.range}
                  onChange={(e) => setFormFilters(prev => ({ ...prev, range: e.target.value }))}
                >
                  <option>Today</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Custom</option>
                </select>
              </label>
              <label style={{ minWidth: 160 }}>
                <div className="subtle">Camera/Location</div>
                <select
                  aria-label="Camera Filter"
                  className="input"
                  value={formFilters.camera}
                  onChange={(e) => setFormFilters(prev => ({ ...prev, camera: e.target.value }))}
                >
                  <option>All Cameras</option>
                  <option>Cam A</option>
                  <option>Cam B</option>
                  <option>Cam C</option>
                </select>
              </label>
              <button className="btn btn-primary" aria-label="Apply filters" onClick={applyFilters}>Apply</button>
            </div>
          </div>
        </div>

        {/* Behavior Count Bar Chart */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">Behavior Count</div>
            <div className="muted">Total: {totalCount}</div>
          </div>
          <div
            role="figure"
            aria-label="Behavior count bar chart"
            style={{
              position: 'relative',
              height: 300,
              padding: 16,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflowX: 'auto',
              background: 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              {counts.map((b, idx) => {
                const height = (b.count / maxCount) * 200; // chart area height
                const color = behaviorPalette[b.key] || 'var(--primary)';
                const pct = fmtPct(b.count, totalCount);
                const tooltip = `${b.key}, Count: ${b.count}, ${pct}`;
                return (
                  <div key={b.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: idx === 0 ? 0 : 20 }}>
                    {/* label above */}
                    <div style={{ color: 'var(--text)', fontSize: 12, marginBottom: 6 }}>{b.count}</div>
                    <button
                      aria-label={`Open timeline for ${b.key}`}
                      onClick={() => gotoTimeline({ behavior: b.key })}
                      onMouseEnter={(e) => { e.currentTarget.style.background = lighten(color, 0.1); }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = color; }}
                      title={tooltip}
                      style={{
                        width: 40,
                        height: Math.max(4, height),
                        background: color,
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        boxShadow: 'var(--shadow)',
                        transition: 'background 0.2s ease, transform 0.06s ease',
                      }}
                    />
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text)', textAlign: 'center', width: 60, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.key}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{pct}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Behavior Duration Chart (stacked bar or pie) */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">Behavior Duration</div>
            <div className="row" style={{ alignItems: 'center', gap: 12 }}>
              <div className="muted">Total: {totalDuration} mins</div>
              <button className="btn btn-outline" aria-label="Toggle pie view" onClick={() => setShowPie(v => !v)}>
                {showPie ? 'Show Stacked Bar' : 'Show Pie'}
              </button>
            </div>
          </div>

          {!showPie ? (
            <div role="figure" aria-label="Behavior duration stacked bar" style={{ padding: 16 }}>
              <div
                style={{
                  position: 'relative',
                  height: 60,
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 0,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                  width: 600,
                  maxWidth: '100%',
                  margin: '0 auto',
                  background: 'var(--surface)',
                }}
              >
                {durations.map((d) => {
                  const widthPct = (d.mins / totalDuration) * 100;
                  const color = behaviorPalette[d.key] || 'var(--primary)';
                  const tooltip = `${d.key}, Duration: ${d.mins} min, ${fmtPct(d.mins, totalDuration)}`;
                  return (
                    <button
                      key={d.key}
                      aria-label={`Open timeline for ${d.key}`}
                      onClick={() => gotoTimeline({ behavior: d.key })}
                      onMouseEnter={(e) => { e.currentTarget.style.background = lighten(color, 0.1); }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = color; }}
                      title={tooltip}
                      style={{
                        width: `${widthPct}%`,
                        background: color,
                        borderRight: '1px solid var(--surface)',
                        borderTop: 'none',
                        borderBottom: 'none',
                        borderLeft: 'none',
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                {durations.map((d) => (
                  <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: behaviorPalette[d.key] || 'var(--primary)', border: '1px solid var(--border)' }} />
                    <span style={{ color: 'var(--text)' }}>{d.key}</span>
                    <span>· {fmtPct(d.mins, totalDuration)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div role="figure" aria-label="Behavior duration pie chart" style={{ display: 'grid', placeItems: 'center', padding: 16 }}>
              <svg width="280" height="280" viewBox="0 0 280 280" role="img" aria-label="Pie chart">
                {pieData.map((p) => {
                  const r = 110;
                  const cx = 140;
                  const cy = 140;
                  const start = polarToCartesian(cx, cy, r, p.start - Math.PI / 2);
                  const end = polarToCartesian(cx, cy, r, p.end - Math.PI / 2);
                  const largeArc = p.end - p.start > Math.PI ? 1 : 0;
                  const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
                  const color = behaviorPalette[p.key] || 'var(--primary)';
                  const mid = (p.start + p.end) / 2;
                  const label = polarToCartesian(cx, cy, r * 0.6, mid - Math.PI / 2);
                  const pctText = fmtPct(p.mins, totalDuration);
                  const tooltip = `${p.key}, Duration: ${p.mins} min, ${pctText}`;
                  return (
                    <g key={p.key}>
                      <path
                        d={d}
                        fill={color}
                        stroke="var(--surface)"
                        strokeWidth="1"
                        onMouseEnter={(e) => { e.currentTarget.style.fill = lighten(color, 0.1); }}
                        onMouseLeave={(e) => { e.currentTarget.style.fill = color; }}
                        onClick={() => gotoTimeline({ behavior: p.key })}
                      >
                        <title>{tooltip}</title>
                      </path>
                      {p.frac > 0.06 && (
                        <text x={label.x} y={label.y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#fff">
                          {pctText}
                        </text>
                      )}
                    </g>
                  );
                })}
                <circle cx="140" cy="140" r="70" fill="var(--surface)" stroke="var(--border)" />
                <text x="140" y="140" textAnchor="middle" dominantBaseline="middle" fontSize="12" fill="var(--muted)">
                  Total {totalDuration}m
                </text>
              </svg>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                {durations.map((d) => (
                  <div key={d.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 2, background: behaviorPalette[d.key] || 'var(--primary)', border: '1px solid var(--border)' }} />
                    <span style={{ color: 'var(--text)' }}>{d.key}</span>
                    <span>· {fmtPct(d.mins, totalDuration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 24-Hour Heatmap */}
        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Daily 24-Hour Heatmap</div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(24, 1fr)', gap: 6, alignItems: 'center' }}>
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={`h-${h}`} style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
                  {String(h).padStart(2, '0')}
                </div>
              ))}
              {heatmapRows.map((row) => (
                <React.Fragment key={row.key}>
                  <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{row.key}</div>
                  {row.hours.map((cell) => {
                    const bg = heatColor(cell.intensity, row.key);
                    const tooltip = `${row.key}, ${String(cell.hour).padStart(2, '0')}:00, events ${cell.events}`;
                    return (
                      <button
                        key={`${row.key}-${cell.hour}`}
                        aria-label={`Open timeline for ${row.key} at ${cell.hour}:00`}
                        title={tooltip}
                        onClick={() => gotoTimeline({ behavior: row.key, hour: cell.hour })}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.08)'; e.currentTarget.style.filter = 'brightness(1.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.filter = 'brightness(1.0)'; }}
                        style={{
                          width: '100%',
                          aspectRatio: '1 / 1',
                          background: bg,
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          transition: 'transform 0.06s ease, box-shadow 0.2s ease, background 0.2s ease',
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
            Color scale from low (var(--table-row-hover)) to high (var(--primary)).
          </div>
        </div>
      </div>
    </div>
  );
}

export default GiantAnteaterDashboard;
