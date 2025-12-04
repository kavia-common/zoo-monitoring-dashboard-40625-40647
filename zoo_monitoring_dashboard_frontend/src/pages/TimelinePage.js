import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayerModal from '../components/VideoPlayerModal';

/**
 * PUBLIC_INTERFACE
 * TimelinePage
 * Displays filters on the left and an interactive timeline with clickable events opening a video modal.
 */
function TimelinePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialBehavior = params.get('behavior');

  const [filters, setFilters] = useState({
    Pacing: !!(initialBehavior === 'Pacing'),
    Moving: !!(initialBehavior === 'Moving'),
    Scratching: !!(initialBehavior === 'Scratching'),
    Recumbent: !!(initialBehavior === 'Recumbent'),
    ['Non-Recumbent']: !!(initialBehavior === 'Non-Recumbent'),
    duration: 30,
    timeOfDay: 'All',
    date: '',
  });

  const [modal, setModal] = useState({ open: false, event: null });

  const behaviorsPalette = {
    'Pacing': 'var(--primary)',
    'Moving': 'var(--primary-600)',
    'Scratching': 'var(--secondary)',
    'Recumbent': 'var(--muted)',
    'Non-Recumbent': '#3B82F6',
  };

  const events = useMemo(() => {
    // Generate deterministic mock events across 0..100% width
    const base = [
      { id: 1, label: 'Pacing', start: 5, width: 18 },
      { id: 2, label: 'Moving', start: 26, width: 22 },
      { id: 3, label: 'Scratching', start: 51, width: 10 },
      { id: 4, label: 'Recumbent', start: 63, width: 20 },
      { id: 5, label: 'Non-Recumbent', start: 85, width: 10 },
    ];
    return base.filter(e => !Object.keys(behaviorsPalette).includes(initialBehavior || '') || e.label === initialBehavior);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialBehavior]);

  const onClear = () => {
    setFilters({
      Pacing: false,
      Moving: false,
      Scratching: false,
      Recumbent: false,
      ['Non-Recumbent']: false,
      duration: 30,
      timeOfDay: 'All',
      date: '',
    });
  };

  const openEvent = (e) => {
    setModal({ open: true, event: e });
  };

  const closeModal = () => setModal({ open: false, event: null });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="card" style={{ flex: '0 0 320px', padding: 16 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Filters</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {Object.keys(behaviorsPalette).map(b => (
                <label key={b} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    aria-label={`Filter ${b}`}
                    type="checkbox"
                    checked={filters[b]}
                    onChange={e => setFilters(prev => ({ ...prev, [b]: e.target.checked }))}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>{b}</span>
                </label>
              ))}
              <div>
                <div className="subtle" style={{ marginBottom: 4 }}>Min Duration (sec): {filters.duration}</div>
                <input
                  aria-label="Duration slider"
                  type="range"
                  min="0"
                  max="120"
                  value={filters.duration}
                  onChange={e => setFilters(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <div className="subtle" style={{ marginBottom: 4 }}>Time of Day</div>
                <select
                  aria-label="Time of day"
                  className="input"
                  value={filters.timeOfDay}
                  onChange={e => setFilters(prev => ({ ...prev, timeOfDay: e.target.value }))}
                >
                  <option>All</option>
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div>
                <div className="subtle" style={{ marginBottom: 4 }}>Date</div>
                <input
                  aria-label="Date picker"
                  className="input"
                  type="date"
                  value={filters.date}
                  onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <button className="btn btn-outline" aria-label="Clear filters" onClick={onClear}>
                Clear
              </button>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="timeline" role="figure" aria-label="Events timeline">
              {events.map((e, idx) => (
                <button
                  key={e.id}
                  className="event"
                  aria-label={`Open event ${e.label}`}
                  onClick={() => openEvent(e)}
                  style={{
                    top: 40 + idx * 48,
                    left: `${e.start}%`,
                    width: `${e.width}%`,
                    background: behaviorsPalette[e.label],
                    border: '1px solid var(--border)'
                  }}
                  title={`${e.label}`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <VideoPlayerModal
        open={modal.open}
        onClose={closeModal}
        metadata={modal.event ? { Behavior: modal.event.label, StartOffset: modal.event.start + '%', Width: modal.event.width + '%' } : undefined}
      />
    </div>
  );
}

export default TimelinePage;
