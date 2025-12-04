import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * AnalyticsPage
 * Shows smart filters card, export CSV button, a table with header bg and row hover, and a left sidebar.
 */
function AnalyticsPage() {
  const [usePrimaryExport, setUsePrimaryExport] = useState(false);

  const rows = [
    { behavior: 'Pacing', count: 12, avgDuration: '00:35', hourPeak: '10:00' },
    { behavior: 'Moving', count: 20, avgDuration: '01:05', hourPeak: '14:00' },
    { behavior: 'Scratching', count: 8, avgDuration: '00:20', hourPeak: '16:00' },
    { behavior: 'Recumbent', count: 18, avgDuration: '02:10', hourPeak: '03:00' },
  ];

  const exportStyle = {
    background: usePrimaryExport ? 'var(--primary)' : 'var(--secondary)',
    color: usePrimaryExport ? '#fff' : 'var(--text)'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <aside className="card" style={{ padding: 12 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Sidebar</div>
          <div className="row" style={{ flexDirection: 'column' }}>
            {['Overview', 'Behaviors', 'Anomalies', 'Exports'].map((item, idx) => (
              <button
                key={item}
                className="btn"
                style={{
                  justifyContent: 'flex-start',
                  background: idx === 0 ? 'var(--primary)' : 'var(--surface)',
                  color: idx === 0 ? '#fff' : 'var(--text)',
                  borderColor: 'var(--border)'
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>
        <main>
          <div className="card" style={{ padding: 12, marginBottom: 12 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="section-title">Smart Filters</div>
                <div className="muted">Adjust filters to refine analytics</div>
              </div>
              <div className="row">
                <button className="btn btn-outline" aria-label="Clear filters">Clear All</button>
                <button
                  className="btn"
                  aria-label="Export CSV"
                  onClick={() => setUsePrimaryExport(p => !p)}
                  title="Toggle color per spec (lime or primary)"
                  style={exportStyle}
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0 }}>
            <table className="table" aria-label="Analytics table">
              <thead>
                <tr>
                  <th>Behavior</th>
                  <th>Count</th>
                  <th>Avg Duration</th>
                  <th>Peak Hour</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.behavior}</td>
                    <td>{r.count}</td>
                    <td>{r.avgDuration}</td>
                    <td>{r.hourPeak}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnalyticsPage;
