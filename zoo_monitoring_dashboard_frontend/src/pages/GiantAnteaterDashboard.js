import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * GiantAnteaterDashboard
 * Implements interactive charts and a 24-hour heatmap.
 * - Behavior Count Bar Chart: fixed 40px bars, 20px gaps, labels above, tooltip with count and percentage.
 *   Hover: lighten ~10%. Click: navigate to /timeline filtered by behavior.
 * - Behavior Duration Chart: stacked bar (60px wide) and optional pie view with percentage labels.
 *   Hover: lighten ~10%. Click: navigate to /timeline filtered by behavior.
 * - 24-hour Heatmap: rows=behaviors, columns=00–23. Color scale from --table-row-hover to --primary.
 *   Tooltip shows behavior, hour, intensity, duration. Click: navigate with behavior & hour filter.
 * - Behavior/Date Range/Camera filters drive all charts/heatmap reactively (mocked locally).
 * - No new libs; SVG/Div-based rendering. Use theme CSS vars exclusively, except #3B82F6 for Non-Recumbent.
 */
function GiantAnteaterDashboard() {
  const navigate = useNavigate();

  // Filters state
  const [range, setRange] = useState('Last 7 days');
  const [camera, setCamera] = useState('All Cameras');
  const [behaviorFilter, setBehaviorFilter] = useState('All');
  const [showPie, setShowPie] = useState(false);

  // Behavior palette (theme variables only). Non-Recumbent must keep #3B82F6.
  const behaviorPalette = {
    Pacing: 'var(--primary)',
    Moving: 'var(--primary-600)',
    Scratching: 'var(--secondary)',
    Recumbent: 'var(--muted)',
    'Non-Recumbent': '#3B82F6', // exception allowed by spec
  };

  // Sample base data; will be filtered reactively by behavior/date/camera selections
  const baseCounts = useMemo(
    () => [
      { key: 'Pacing', count: 15 },
      { key: 'Moving', count: 28 },
      { key: 'Scratching', count: 9 },
      { key: 'Recumbent', count: 22 },
      { key: 'Non-Recumbent', count: 18 },
    ],
    []
  );

  const baseDurations = useMemo(
    () => [
      { key: 'Pacing', mins: 52 },
      { key: 'Moving', mins: 81 },
      { key: 'Scratching', mins: 18 },
      { key: 'Recumbent', mins: 160 },
      { key: 'Non-Recumbent', mins: 104 },
    ],
    []
  );

  // Mock heatmap intensity (0..1) and duration (mins) for 24 hours per behavior
  const baseHeatmap = useMemo(() => {
    const behaviors = ['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'];
    const rows = {};
    behaviors.forEach((b, bi) => {
      const hours = [];
      for (let h = 0; h < 24; h++) {
        const intensity = Math.max(
          0,
          Math.min(
            1,
            (Math.sin((h + bi * 2) / 3) + 1) / 2 * (0.6 + (bi % 3) * 0.15)
          )
        );
        const duration = Math.round(intensity * (b === 'Recumbent' ? 12 : 6)); // arbitrary minutes bucket
        hours.push({ hour: h, intensity, duration });
      }
      rows[b] = hours;
    });
    return rows;
  }, []);

  // Helper: % lighten color by mixing with white using inline filter (approximate by opacity overlay)
  const lighten = (color, amount = 0.1) => {
    // Use CSS color-mix if supported; fallback to overlay via background with gradient
    return `color-mix(in srgb, ${color} ${Math.round((1 - amount) * 100)}%, white ${Math.round(amount * 100)}%)`;
  };

  // Apply filters (behavior selection narrows to a single behavior)
  const filteredKeys = useMemo(() => {
    const only = behaviorFilter !== 'All' ? [behaviorFilter] : [
      'Pacing',
      'Moving',
      'Scratching',
      'Recumbent',
      'Non-Recumbent',
    ];
    return only;
  }, [behaviorFilter]);

  // Simple reactive scaling based on range/camera just to demonstrate reactivity
  const scaleByRange = useMemo(() => {
    switch (range) {
      case 'Last 24 hours':
        return 0.5;
      case 'Last 7 days':
        return 1;
      case 'Last 30 days':
        return 1.6;
      default:
        return 1;
    }
  }, [range]);

  const scaleByCamera = useMemo(() => {
    // Cameras: All Cameras=1, Cam A=1.0, Cam B=0.8, Cam C=1.2
    if (camera === 'Cam B') return 0.8;
    if (camera === 'Cam C') return 1.2;
    return 1.0;
  }, [camera]);

  const counts = useMemo(() => {
    return baseCounts
      .filter(b => filteredKeys.includes(b.key))
      .map(b => ({ ...b, count: Math.max(0, Math.round(b.count * scaleByRange * scaleByCamera)) }));
  }, [baseCounts, filteredKeys, scaleByRange, scaleByCamera]);

  const durations = useMemo(() => {
    return baseDurations
      .filter(d => filteredKeys.includes(d.key))
      .map(d => ({ ...d, mins: Math.max(0, Math.round(d.mins * scaleByRange * scaleByCamera)) }));
  }, [baseDurations, filteredKeys, scaleByRange, scaleByCamera]);

  const totalCount = counts.reduce((s, c) => s + c.count, 0) || 1;
  const totalDuration = durations.reduce((s, d) => s + d.mins, 0) || 1;
  const maxCount = Math.max(...counts.map(b => b.count), 1);
  const maxMins = Math.max(...durations.map(d => d.mins), 1);

  const gotoTimeline = (opts) => {
    const qp = new URLSearchParams({
      ...(opts.behavior ? { behavior: opts.behavior } : {}),
      ...(opts.hour !== undefined ? { hour: String(opts.hour).padStart(2, '0') } : {}),
      range,
      camera,
    });
    navigate(`/timeline?${qp.toString()}`);
  };

  // Tooltip helper string builders
  const fmtPct = (value, total) => `${Math.round((value / total) * 100)}%`;

  // Duration stacked bar segments data
  const stackedSegments = useMemo(() => {
    let acc = 0;
    return durations.map(d => {
      const w = (d.mins / totalDuration) * 100;
      const segment = { key: d.key, start: acc, width: w, mins: d.mins };
      acc += w;
      return segment;
    });
  }, [durations, totalDuration]);

  // Pie chart geometry (SVG, centered labels as %)
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

  const polarToCartesian = (cx, cy, r, angle) => {
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Heatmap rows after filters (behavior filter narrows rows)
  const heatmapRows = useMemo(() => {
    return filteredKeys.map(k => ({ key: k, hours: baseHeatmap[k] || [] }));
  }, [filteredKeys, baseHeatmap]);

  // Heatmap color scale: from --table-row-hover at 0 to --primary at high.
  const heatColor = (intensity, key) => {
    if (intensity <= 0.02) return 'var(--table-row-hover)';
    const base = key === 'Non-Recumbent' ? '#3B82F6' : behaviorPalette[key] || 'var(--primary)';
    // mix base with table-row-hover depending on intensity
    const pctBase = Math.round(intensity * 100);
    const pctBaseClamped = Math.max(10, Math.min(100, pctBase));
    return `color-mix(in srgb, ${base} ${pctBaseClamped}%, var(--table-row-hover) ${100 - pctBaseClamped}%)`;
  };

  const barHover = (color) => ({
    background: lighten(color, 0.1),
    filter: 'saturate(1.02)',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">
        {/* Header and Filters */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0 }}>Giant Anteater</h2>
              <div className="muted">
                Status: <span className="badge" aria-label="Healthy status">Healthy</span>
              </div>
            </div>
            <div className="row" style={{ gap: 12 }}>
              <label style={{ minWidth: 160 }}>
                <div className="subtle">Behavior</div>
                <select
                  aria-label="Behavior Filter"
                  className="input"
                  value={behaviorFilter}
                  onChange={(e) => setBehaviorFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Pacing</option>
                  <option>Moving</option>
                  <option>Scratching</option>
                  <option>Recumbent</option>
                  <option>Non-Recumbent</option>
                </select>
              </label>
              <label style={{ minWidth: 160 }}>
                <div className="subtle">Date Range</div>
                <select
                  id="date-range"
                  className="input"
                  aria-label="Date Range"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                >
                  <option>Last 24 hours</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                </select>
              </label>
              <label style={{ minWidth: 160 }}>
                <div className="subtle">Camera</div>
                <select
                  aria-label="Camera Filter"
                  className="input"
                  value={camera}
                  onChange={(e) => setCamera(e.target.value)}
                >
                  <option>All Cameras</option>
                  <option>Cam A</option>
                  <option>Cam B</option>
                  <option>Cam C</option>
                </select>
              </label>
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
              height: 280,
              padding: 16,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflowX: 'auto',
              background: 'var(--surface)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%' }}>
              {counts.map((b, idx) => {
                const height = (b.count / maxCount) * 200; // 200px chart area
                const color = behaviorPalette[b.key] || 'var(--primary)';
                const pct = fmtPct(b.count, totalCount);
                const tooltip = `${b.key} • Count: ${b.count} • ${pct}`;
                return (
                  <div key={b.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: idx === 0 ? 0 : 20 }}>
                    <div
                      style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}
                      aria-hidden
                    >
                      {b.count}
                    </div>
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

        {/* Behavior Duration Chart: stacked bar and optional pie */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className="section-title">Behavior Duration</div>
            <div className="row" style={{ alignItems: 'center', gap: 12 }}>
              <div className="muted">Total: {totalDuration} mins</div>
              <button
                className="btn btn-outline"
                aria-label="Toggle pie view"
                onClick={() => setShowPie((v) => !v)}
              >
                {showPie ? 'Show Stacked Bar' : 'Show Pie'}
              </button>
            </div>
          </div>

          {!showPie ? (
            <div role="figure" aria-label="Behavior duration stacked bar" style={{ padding: 16 }}>
              <div
                style={{
                  position: 'relative',
                  height: 80,
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
                {stackedSegments.map((seg) => {
                  const color = behaviorPalette[seg.key] || 'var(--primary)';
                  const tooltip = `${seg.key} • Duration: ${seg.mins} mins • ${fmtPct(seg.mins, totalDuration)}`;
                  return (
                    <button
                      key={seg.key}
                      aria-label={`Open timeline for ${seg.key}`}
                      onClick={() => gotoTimeline({ behavior: seg.key })}
                      onMouseEnter={(e) => { e.currentTarget.style.background = lighten(color, 0.1); }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = color; }}
                      title={tooltip}
                      style={{
                        width: `${seg.width}%`,
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
                  const tooltip = `${p.key} • Duration: ${p.mins} mins • ${pctText}`;
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

        {/* 24-Hour Heatmap: rows behaviors, columns hours */}
        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Daily 24-Hour Heatmap</div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px repeat(24, 1fr)', gap: 6, alignItems: 'center' }}>
              {/* Header row */}
              <div />
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={`h-${h}`} style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)' }}>
                  {String(h).padStart(2, '0')}
                </div>
              ))}
              {/* Rows */}
              {heatmapRows.map((row) => (
                <React.Fragment key={row.key}>
                  <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>{row.key}</div>
                  {row.hours.map((cell) => {
                    const bg = heatColor(cell.intensity, row.key);
                    const tooltip = `${row.key} • ${String(cell.hour).padStart(2, '0')}:00 • intensity ${cell.intensity.toFixed(2)} • duration ${cell.duration}m`;
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
          <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>Color scale from low (var(--table-row-hover)) to high (var(--primary)).</div>
        </div>
      </div>
    </div>
  );
}

export default GiantAnteaterDashboard;
