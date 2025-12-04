import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import VideoPlayerModal from '../components/VideoPlayerModal';

/**
 * PUBLIC_INTERFACE
 * TimelinePage
 * Displays filters and an events timeline with table and video modal.
 * Guarantees the exact number of events for selected behavior to match the Dashboard bar chart:
 * - Pacing 12, Moving 25, Scratching 22, Recumbent 15, Non-Recumbent 20
 * Clicking from heatmap also filters by hour. Table columns: Timestamp, Duration, Camera, Video.
 */
function TimelinePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialBehavior = params.get('behavior') || 'All';
  const hourFilter = params.get('hour'); // "00".."23" or null

  // Applied filter echo from Dashboard (range, camera) for consistency (not altering sample counts)
  const range = params.get('range') || 'Today';
  const camera = params.get('camera') || 'All Cameras';

  // Behavior-specific required counts
  const requiredCounts = {
    Pacing: 12,
    Moving: 25,
    Scratching: 22,
    Recumbent: 15,
    'Non-Recumbent': 20
  };

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

  // Generate events deterministically to exactly match counts when a single behavior is selected/navigated
  const genEventsFor = (behavior, exactCount) => {
    const out = [];
    for (let i = 0; i < exactCount; i++) {
      const hour = hourFilter ? Number(hourFilter) : (8 + Math.floor(i / 2)) % 24;
      const minute = (i * 2) % 60;
      out.push({
        id: `${behavior}-${i + 1}`,
        label: behavior,
        timestamp: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
        durationSec: 10 + (i % 50),
        camera: ['Cam A', 'Cam B', 'Cam C'][i % 3],
        start: (i * 3.2) % 90,
        width: 6 + (i % 10) * 0.6,
      });
    }
    return out;
  };

  const listEvents = useMemo(() => {
    const behaviors = Object.keys(requiredCounts);
    if (behaviors.includes(initialBehavior)) {
      // Exact match for a single selected behavior
      return genEventsFor(initialBehavior, requiredCounts[initialBehavior]);
    }
    // Mixed sample across all (does not need to match totals strictly when not filtered from a bar)
    return [
      ...genEventsFor('Pacing', 5),
      ...genEventsFor('Moving', 6),
      ...genEventsFor('Scratching', 5),
      ...genEventsFor('Recumbent', 4),
      ...genEventsFor('Non-Recumbent', 5),
    ];
  }, [initialBehavior, hourFilter]);

  const filteredEvents = useMemo(() => {
    const enabledBehaviors = Object.keys(behaviorsPalette).filter(b => filters[b]);
    const byBehavior = enabledBehaviors.length ? listEvents.filter(e => enabledBehaviors.includes(e.label)) : listEvents;
    // Additional hour filter from heatmap navigation
    if (hourFilter) {
      return byBehavior.filter(e => e.timestamp.startsWith(`${hourFilter.padStart(2, '0')}:`));
    }
    // Apply duration and time-of-day filters locally
    let result = byBehavior.filter(e => (filters.duration ? e.durationSec >= filters.duration : true));
    if (filters.timeOfDay !== 'All') {
      result = result.filter(e => {
        const hh = Number(e.timestamp.slice(0, 2));
        if (filters.timeOfDay === 'Morning') return hh >= 6 && hh < 12;
        if (filters.timeOfDay === 'Afternoon') return hh >= 12 && hh < 18;
        if (filters.timeOfDay === 'Evening') return hh >= 18 && hh < 22;
        if (filters.timeOfDay === 'Night') return hh >= 22 || hh < 6;
        return true;
      });
    }
    // Camera param display only; do not mutate sample counts (but could filter if wanted)
    if (camera && camera !== 'All Cameras') {
      result = result.filter(e => e.camera === camera);
    }
    return result;
  }, [listEvents, filters, hourFilter, camera, behaviorsPalette]);

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
            <div className="muted" style={{ marginBottom: 8 }}>From Dashboard — Range: {range}, Camera: {camera}</div>
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
            {/* Timeline bars */}
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
          Behavior: modal.event.label,
          Timestamp: modal.event.timestamp || '—',
          Duration: modal.event.durationSec ? `${modal.event.durationSec}s` : '—',
          Confidence: '0.92',
          Camera: modal.event.camera || '—'
        } : undefined}
      />
    </div>
  );
}

export default TimelinePage;
