import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader';

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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ margin: 16 }} className="surface-card">
        <div style={{ padding: 16 }}>
          <SectionHeader title="Report Builder" />
        </div>
      </div>

      <div className="surface-card" style={{ padding: 16, margin: 16 }}>
        <div className="grid grid-2" style={{ marginBottom: 12 }}>
          <label>
            <div className="subtle-text">Report Type</div>
            <select
              value={form.type}
              onChange={e => setForm(prev => ({ ...prev, type: e.target.value }))}
              style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
            >
              <option>Daily Summary</option>
              <option>Weekly Trends</option>
              <option>Monthly Overview</option>
              <option>Custom Analysis</option>
            </select>
          </label>
          <div style={{ display: 'flex', gap: 12 }}>
            <label style={{ flex: 1 }}>
              <div className="subtle-text">From</div>
              <input
                type="date"
                value={form.from}
                onChange={e => setForm(prev => ({ ...prev, from: e.target.value }))}
                style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
              />
            </label>
            <label style={{ flex: 1 }}>
              <div className="subtle-text">To</div>
              <input
                type="date"
                value={form.to}
                onChange={e => setForm(prev => ({ ...prev, to: e.target.value }))}
                style={{ width: '100%', padding: 10, borderRadius: 10, border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
              />
            </label>
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <div className="subtle-text" style={{ marginBottom: 8 }}>Behaviors</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {behaviors.map(b => {
              const selected = form.behaviors.includes(b);
              return (
                <button
                  key={b}
                  className="btn-pill"
                  aria-label={`Toggle ${b}`}
                  onClick={() => toggleBehavior(b)}
                  style={{
                    background: selected ? 'var(--color-primary-soft)' : 'var(--color-surface)',
                    color: selected ? 'var(--color-primary)' : 'var(--color-text-heading)',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>

        <div className="surface-flat" style={{ padding: 12, whiteSpace: 'pre-wrap', marginBottom: 12, minHeight: 80 }}>
          {preview}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn-pill" onClick={generate} aria-label="Generate report" style={{ background: 'var(--color-primary)', color: '#fff' }}>
            Generate
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-pill" style={{ background: '#F9FAFB', border: '1px solid var(--color-border)' }} aria-label="Export PDF">Export PDF</button>
            <button className="btn-pill" style={{ background: 'var(--color-primary)', color: '#fff' }} aria-label="Export Excel">Export Excel</button>
            <button className="btn-pill" style={{ background: 'var(--color-primary)', color: '#fff' }} aria-label="Export PowerPoint">Export PowerPoint</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
