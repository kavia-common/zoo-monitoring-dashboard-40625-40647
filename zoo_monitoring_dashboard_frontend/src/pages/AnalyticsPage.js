import React, { useState } from 'react';
import Table from '../components/ui/Table';
import SectionHeader from '../components/SectionHeader';

/**
 * PUBLIC_INTERFACE
 * AnalyticsPage
 * Shows smart filters and a themed table styled with the shared Table component.
 */
function AnalyticsPage() {
  const [usePrimaryExport, setUsePrimaryExport] = useState(false);

  const rows = [
    { behavior: 'Pacing', count: 12, avgDuration: '00:35', hourPeak: '10:00' },
    { behavior: 'Moving', count: 20, avgDuration: '01:05', hourPeak: '14:00' },
    { behavior: 'Scratching', count: 8, avgDuration: '00:20', hourPeak: '16:00' },
    { behavior: 'Recumbent', count: 18, avgDuration: '02:10', hourPeak: '03:00' },
  ];

  const columns = [
    { key: 'behavior', header: 'Behavior' },
    { key: 'count', header: 'Count' },
    { key: 'avgDuration', header: 'Avg Duration' },
    { key: 'hourPeak', header: 'Peak Hour' },
  ];

  const exportStyle = {
    background: usePrimaryExport ? 'var(--color-primary)' : '#F9FAFB',
    color: usePrimaryExport ? '#fff' : 'var(--color-table-header-text)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-pill)',
    padding: '8px 16px',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="surface-card" style={{ padding: 16, margin: 16 }}>
        <SectionHeader title="Analytics" subtitle="Behavior counts and durations" />
      </div>

      <div className="surface-card" style={{ padding: 16, margin: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="subtle-text">Smart Filters</div>
            <div className="subtle-text">Adjust filters to refine analytics</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-pill" style={{ background: '#F9FAFB', border: '1px solid var(--color-border)' }} aria-label="Clear filters">
              Clear All
            </button>
            <button
              className="btn-pill"
              aria-label="Export CSV"
              onClick={() => setUsePrimaryExport(p => !p)}
              title="Toggle color per spec"
              style={exportStyle}
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="surface-card" style={{ padding: 0, margin: 16 }}>
        <Table columns={columns} rows={rows} />
      </div>
    </div>
  );
}

export default AnalyticsPage;
