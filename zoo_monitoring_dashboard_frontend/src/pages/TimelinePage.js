import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayerModal from '../components/VideoPlayerModal';

/**
 * PUBLIC_INTERFACE
 * TimelinePage
 * Displays filters on the left and an interactive timeline with clickable events opening a video modal.
 * When navigated from Scratching bar/duration/pie, renders exactly 22 Scratching events.
 * Table columns: Timestamp, Duration, Camera, Video Thumbnail.
 */
function TimelinePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialBehavior = params.get('behavior') || 'All';
  const hourFilter = params.get('hour');

  const [filters, setFilters] = useState({
    Pacing: initialBehavior === 'Pacing',
    Moving: initialBehavior === 'Moving',
    Scratching: initialBehavior === 'Scratching',
    Recumbent: initialBehavior === 'Recumbent',
    ['Non-Recumbent']: initialBehavior === 'Non-Recumbent',
    duration: 0,
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

  // Generate events list
  const listEvents = useMemo(() => {
    // If explicitly Scratching, produce exactly 22 events
    if (initialBehavior === 'Scratching') {
      const events = [];
      for (let i = 0; i < 22; i++) {
        const hour = hourFilter ? Number(hourFilter) : (8 + Math.floor(i / 3)) % 24;
        const minute = (i * 3) % 60;
        events.push({
          id: i + 1,
          label: 'Scratching',
          timestamp: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
          durationSec: 15 + (i % 10),
          camera: ['Cam A', 'Cam B', 'Cam C'][i % 3],
          thumb: '',
          start: (i * 4) % 88, // for bar position below
          width: 8 + (i % 6),
        });
      }
      return events;
    }
    // Default mixed small set
    return [
      { id: 1, label: 'Pacing', timestamp: '09:05:00', durationSec: 35, camera: 'Cam A', start: 5, width: 18 },
      { id: 2, label: 'Moving', timestamp: '10:22:00', durationSec: 50, camera: 'Cam B', start: 26, width: 22 },
      { id: 3, label: 'Scratching', timestamp: '14:10:00', durationSec: 25, camera: 'Cam C', start: 51, width: 10 },
      { id: 4, label: 'Recumbent', timestamp: '16:33:00', durationSec: 120, camera: 'Cam A', start: 63, width: 20 },
      { id: 5, label: 'Non-Recumbent', timestamp: '18:05:00', durationSec: 40, camera: 'Cam C', start: 85, width: 10 },
    ];
  }, [initialBehavior, hourFilter]);

  const filteredEvents = useMemo(() => {
    const enabledBehaviors = Object.keys(behaviorsPalette).filter(b => filters[b]);
    const byBehavior = enabledBehaviors.length ? listEvents.filter(e => enabledBehaviors.includes(e.label)) : listEvents;
    if (hourFilter) {
      return byBehavior.filter(e => e.timestamp.startsWith(`${hourFilter.padStart(2, '0')}:`));
    }
    return byBehavior;
  }, [listEvents, filters, hourFilter]);

  const onClear = () => {
    setFilters({
      Pacing: false,
      Moving: false,
      Scratching: false,
      Recumbent: false,
      ['Non-Recumbent']: false,
      duration: 0,
      timeOfDay: 'All',
      date: '',
    });
  };

  const openEvent = (e) => setModal({ open: true, event: e });
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
            {/* Stacked timeline bars visualization */}
            <div className="timeline" role="figure" aria-label="Events timeline">
              {filteredEvents.map((e, idx) => (
                <button
                  key={e.id}
                  className="event"
                  aria-label={`Open event ${e.label}`}
                  onClick={() => openEvent(e)}
                  style={{
                    top: 40 + idx * 36,
                    left: `${e.start}%`,
                    width: `${e.width}%`,
                    background: behaviorsPalette[e.label],
                    border: '1px solid var(--border)'
                  }}
                  title={`${e.label} • ${e.timestamp}`}
                >
                  {e.label}
                </button>
              ))}
            </div>

            {/* Events table */}
            <div className="card" style={{ marginTop: 16, padding: 0 }}>
              <table className="table" aria-label="Events table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Duration</th>
                    <th>Camera</th>
                    <th>Video</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((e) => (
                    <tr key={`row-${e.id}`}>
                      <td>{e.timestamp}</td>
                      <td>{e.durationSec ? `${e.durationSec}s` : '—'}</td>
                      <td>{e.camera || '—'}</td>
                      <td>
                        <button className="btn btn-primary" aria-label="Open Video" onClick={() => openEvent(e)}>Open</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>

      <VideoPlayerModal
        open={modal.open}
        onClose={closeModal}
        metadata={modal.event ? {
          Timestamp: modal.event.timestamp || '—',
          Duration: modal.event.durationSec ? `${modal.event.durationSec}s` : '—',
          Behavior: modal.event.label,
          Confidence: '0.92',
          Camera: modal.event.camera || '—'
        } : undefined}
      />
    </div>
  );
}

export default TimelinePage;
