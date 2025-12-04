import React, { useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * ReportsPage
 * Report builder with type, date range, behavior multi-select, preview, and export buttons.
 */
function ReportsPage() {
  const [form, setForm] = useState({
    type: 'Daily Summary',
    from: '',
    to: '',
    behaviors: ['Pacing', 'Moving'],
  });

  const [preview, setPreview] = useState('Select options to preview the report.');

  const behaviors = ['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'];

  const toggleBehavior = (b) => {
    setForm(prev => {
      const set = new Set(prev.behaviors);
      if (set.has(b)) set.delete(b); else set.add(b);
      return { ...prev, behaviors: [...set] };
    });
  };

  const generate = () => {
    setPreview(`Report: ${form.type}\nRange: ${form.from || 'N/A'} → ${form.to || 'N/A'}\nBehaviors: ${form.behaviors.join(', ') || 'None'}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">
        <div className="card" style={{ padding: 16 }}>
          <div className="section-title" style={{ marginBottom: 12 }}>Report Builder</div>
          <div className="grid grid-2" style={{ marginBottom: 12 }}>
            <label>
              <div className="subtle">Report Type</div>
              <select className="input" value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}>
                <option>Daily Summary</option>
                <option>Weekly Trends</option>
                <option>Monthly Overview</option>
                <option>Custom Analysis</option>
              </select>
            </label>
            <div className="row" style={{ gap: 12 }}>
              <label style={{ flex: 1 }}>
                <div className="subtle">From</div>
                <input className="input" type="date" value={form.from} onChange={e => setForm(prev => ({ ...prev, from: e.target.value }))} />
              </label>
              <label style={{ flex: 1 }}>
                <div className="subtle">To</div>
                <input className="input" type="date" value={form.to} onChange={e => setForm(prev => ({ ...prev, to: e.target.value }))} />
              </label>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div className="subtle" style={{ marginBottom: 8 }}>Behaviors</div>
            <div className="row" style={{ flexWrap: 'wrap' }}>
              {behaviors.map(b => {
                const selected = form.behaviors.includes(b);
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
                  >
                    {b}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-flat" style={{ padding: 12, whiteSpace: 'pre-wrap', marginBottom: 12, minHeight: 80 }}>
            {preview}
          </div>

          <div className="row" style={{ justifyContent: 'space-between' }}>
            <button className="btn btn-primary" onClick={generate} aria-label="Generate report">Generate</button>
            <div className="row">
              <button className="btn" style={{ background: 'var(--secondary)', color: '#111827' }} aria-label="Export PDF">Export PDF</button>
              <button className="btn" style={{ background: 'var(--primary-600)', color: '#fff' }} aria-label="Export Excel">Export Excel</button>
              <button className="btn btn-primary" aria-label="Export PowerPoint">Export PowerPoint</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
