import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import VideoPlayerModal from '../components/VideoPlayerModal';

/**
 * PUBLIC_INTERFACE
 * TimelinePage
 * Kaviya-ready vertical timeline with top filter bar, center vertical line with colored dots,
 * and right event cards. Preserves filters and scroll position, integrates with dashboard navigation.
 * Guarantees exact event counts when navigated from Dashboard charts/heatmap:
 * - Pacing 12, Moving 25, Scratching 22, Recumbent 15, Non-Recumbent 20
 * Supports hour filter from heatmap and keeps navbar + floating chat unchanged.
 */
function TimelinePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  // Query params coming from dashboard
  const qpBehavior = params.get('behavior'); // single behavior or null
  const qpHour = params.get('hour'); // "00".."23" or null
  const qpRange = params.get('range') || 'Today';
  const qpCamera = params.get('camera') || 'All Cameras';

  // Scroll position preserve between modal open/close
  const scrollRef = useRef(null);
  const [savedScrollTop, setSavedScrollTop] = useState(0);

  // Behavior palette per spec
  const behaviorPalette = {
    Pacing: 'var(--primary)',
    Moving: 'var(--primary-600)',
    Scratching: 'var(--secondary)',
    Recumbent: 'var(--muted)',
    'Non-Recumbent': '#3B82F6',
  };

  // Required counts for matching dashboard navigation
  const requiredCounts = {
    Pacing: 12,
    Moving: 25,
    Scratching: 22,
    Recumbent: 15,
    'Non-Recumbent': 20,
  };

  // Top filter bar staged values
  const [staged, setStaged] = useState({
    behaviors: qpBehavior ? [qpBehavior] : ['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'],
    datePreset: qpRange, // Today/Last 7 days/Last 30 days/Custom
    customFrom: '',
    customTo: '',
    timeFrom: '00:00',
    timeTo: '23:59',
    camera: qpCamera,
  });

  // Applied filters control the list; clicking Apply updates applied state
  const [applied, setApplied] = useState(staged);

  // Modal state
  const [modal, setModal] = useState({ open: false, event: null });

  // Behavior toggling for multi-select
  const allBehaviors = ['Pacing', 'Moving', 'Scratching', 'Recumbent', 'Non-Recumbent'];
  const toggleBehavior = (b) => {
    setStaged((prev) => {
      const set = new Set(prev.behaviors);
      if (set.has(b)) set.delete(b);
      else set.add(b);
      return { ...prev, behaviors: Array.from(set) };
    });
  };

  // Apply button persists filters and also updates URL minimally for back/forward consistency
  const applyFilters = () => {
    setApplied(staged);
    const qs = new URLSearchParams();
    if (staged.behaviors.length === 1) qs.set('behavior', staged.behaviors[0]);
    if (qpHour) qs.set('hour', qpHour); // preserve incoming hour if present
    if (staged.datePreset) qs.set('range', staged.datePreset);
    if (staged.camera) qs.set('camera', staged.camera);
    navigate(`/timeline?${qs.toString()}`, { replace: true });
  };

  // Generate deterministic events
  const genEventsFor = (behavior, exactCount) => {
    const out = [];
    for (let i = 0; i < exactCount; i++) {
      const hour = qpHour ? Number(qpHour) : (8 + Math.floor(i / 2)) % 24;
      const minute = (i * 3) % 60;
      const ts = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;

      out.push({
        id: `${behavior}-${i + 1}`,
        behavior,
        timestamp: ts,
        durationSec: 10 + (i % 90),
        confidence: 70 + (i % 30), // mock confidence
        camera: ['Cam A', 'Cam B', 'Cam C'][i % 3],
        thumb: '', // placeholder (no asset), we render a mock thumbnail block
      });
    }
    return out;
  };

  // Build base event list such that if a behavior is specified in URL, we match the exact required count for that single behavior
  const baseEvents = useMemo(() => {
    if (qpBehavior && requiredCounts[qpBehavior]) {
      return genEventsFor(qpBehavior, requiredCounts[qpBehavior]);
    }
    // Mixed set when no single behavior requested; do not need to strictly match totals
    return [
      ...genEventsFor('Pacing', 8),
      ...genEventsFor('Moving', 10),
      ...genEventsFor('Scratching', 9),
      ...genEventsFor('Recumbent', 7),
      ...genEventsFor('Non-Recumbent', 8),
    ];
  }, [qpBehavior, qpHour]);

  // Filter by applied behaviors, hour (from heatmap), camera, and time-of-day window
  const filtered = useMemo(() => {
    let list = baseEvents.filter((e) => applied.behaviors.includes(e.behavior));

    if (qpHour) {
      list = list.filter((e) => e.timestamp.startsWith(`${qpHour.padStart(2, '0')}:`));
    }

    if (applied.camera && applied.camera !== 'All Cameras') {
      list = list.filter((e) => e.camera === applied.camera);
    }

    // Time-of-day window filter from staged/applied timeFrom/timeTo (string "HH:MM")
    const parseHM = (s) => {
      const [hh, mm] = s.split(':').map((x) => Number(x));
      return hh * 60 + mm;
    };
    const fromMin = parseHM(applied.timeFrom || '00:00');
    const toMin = parseHM(applied.timeTo || '23:59');
    list = list.filter((e) => {
      const [hh, mm] = e.timestamp.split(':').map((x) => Number(x));
      const m = hh * 60 + mm;
      if (fromMin <= toMin) {
        return m >= fromMin && m <= toMin;
      }
      // overnight wrap
      return m >= fromMin || m <= toMin;
    });

    // Sort newest first (highest time value first); with no date we sort by time desc and then by id desc
    const toVal = (ts) => {
      const [h, m, s] = ts.split(':').map((n) => Number(n));
      return h * 3600 + m * 60 + (s || 0);
    };
    list.sort((a, b) => toVal(b.timestamp) - toVal(a.timestamp) || (b.id > a.id ? 1 : -1));

    return list;
  }, [baseEvents, applied, qpHour]);

  // Preserve scroll on modal close
  useEffect(() => {
    if (!modal.open && scrollRef.current) {
      scrollRef.current.scrollTop = savedScrollTop;
    }
  }, [modal.open, savedScrollTop]);

  const openEvent = (e) => {
    if (scrollRef.current) setSavedScrollTop(scrollRef.current.scrollTop);
    setModal({ open: true, event: e });
  };
  const closeModal = () => setModal({ open: false, event: null });

  // Helper components: filter chip and color badge
  const BehaviorChip = ({ name }) => {
    const selected = staged.behaviors.includes(name);
    return (
      <button
        className="btn"
        onClick={() => toggleBehavior(name)}
        aria-label={`Toggle ${name}`}
        title={selected ? 'Selected' : 'Include in filter'}
        style={{
          borderColor: selected ? 'var(--primary)' : 'var(--border)',
          background: selected ? 'var(--card-hover)' : 'transparent',
        }}
      >
        {name}
      </button>
    );
  };

  // Map for card header color accent
  const behaviorColor = (b) => behaviorPalette[b] || 'var(--primary)';

  // Left column time markers helper: group by hour
  const timeBuckets = useMemo(() => {
    const byHour = {};
    filtered.forEach((e) => {
      const hour = e.timestamp.slice(0, 2);
      if (!byHour[hour]) byHour[hour] = [];
      byHour[hour].push(e);
    });
    // Sort hour keys desc to match newest top
    return Object.entries(byHour)
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([hour, events]) => ({ hour, events }));
  }, [filtered]);

  // Render
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div className="container" style={{ display: 'grid', gap: 16 }}>
        {/* Top filter bar */}
        <div className="card" style={{ padding: 12 }}>
          <div className="row" style={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ minWidth: 260 }}>
              <div className="subtle" style={{ marginBottom: 6 }}>Behavior</div>
              <div className="row" style={{ flexWrap: 'wrap' }}>
                {allBehaviors.map((b) => (
                  <BehaviorChip key={b} name={b} />
                ))}
              </div>
            </div>

            <label style={{ minWidth: 180 }}>
              <div className="subtle" style={{ marginBottom: 6 }}>Date</div>
              <select
                className="input"
                aria-label="Date preset"
                value={staged.datePreset}
                onChange={(e) => setStaged((p) => ({ ...p, datePreset: e.target.value }))}
              >
                <option>Today</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Custom</option>
              </select>
            </label>

            {staged.datePreset === 'Custom' && (
              <div className="row" style={{ minWidth: 260, gap: 12 }}>
                <label style={{ minWidth: 120 }}>
                  <div className="subtle" style={{ marginBottom: 6 }}>From</div>
                  <input
                    className="input"
                    type="date"
                    aria-label="Custom from"
                    value={staged.customFrom}
                    onChange={(e) => setStaged((p) => ({ ...p, customFrom: e.target.value }))}
                  />
                </label>
                <label style={{ minWidth: 120 }}>
                  <div className="subtle" style={{ marginBottom: 6 }}>To</div>
                  <input
                    className="input"
                    type="date"
                    aria-label="Custom to"
                    value={staged.customTo}
                    onChange={(e) => setStaged((p) => ({ ...p, customTo: e.target.value }))}
                  />
                </label>
              </div>
            )}

            <div className="row" style={{ minWidth: 260, gap: 12 }}>
              <label style={{ minWidth: 120 }}>
                <div className="subtle" style={{ marginBottom: 6 }}>From</div>
                <input
                  className="input"
                  type="time"
                  aria-label="Time from"
                  value={staged.timeFrom}
                  onChange={(e) => setStaged((p) => ({ ...p, timeFrom: e.target.value }))}
                />
              </label>
              <label style={{ minWidth: 120 }}>
                <div className="subtle" style={{ marginBottom: 6 }}>To</div>
                <input
                  className="input"
                  type="time"
                  aria-label="Time to"
                  value={staged.timeTo}
                  onChange={(e) => setStaged((p) => ({ ...p, timeTo: e.target.value }))}
                />
              </label>
            </div>

            <label style={{ minWidth: 180 }}>
              <div className="subtle" style={{ marginBottom: 6 }}>Camera/Location</div>
              <select
                className="input"
                aria-label="Camera filter"
                value={staged.camera}
                onChange={(e) => setStaged((p) => ({ ...p, camera: e.target.value }))}
              >
                <option>All Cameras</option>
                <option>Cam A</option>
                <option>Cam B</option>
                <option>Cam C</option>
              </select>
            </label>

            <div style={{ marginLeft: 'auto' }}>
              <button
                className="btn btn-primary"
                aria-label="Apply filters"
                onClick={applyFilters}
                style={{ background: 'var(--primary)' }}
              >
                Apply
              </button>
            </div>
          </div>
          <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
            From Dashboard — Range: {qpRange} · Camera: {qpCamera}
            {qpBehavior ? ` · Behavior: ${qpBehavior}` : ''}{qpHour ? ` · Hour: ${qpHour}:00` : ''}
          </div>
        </div>

        {/* Vertical timeline layout */}
        <div
          ref={scrollRef}
          className="card"
          style={{
            padding: 16,
            display: 'grid',
            gridTemplateColumns: '100px 24px 1fr',
            gap: 16,
            maxHeight: 'calc(100vh - 240px)',
            overflowY: 'auto',
          }}
          aria-label="Vertical timeline"
        >
          {/* Left: time labels (muted) */}
          <div>
            {timeBuckets.map((bucket) => (
              <div key={`hour-${bucket.hour}`} style={{ marginBottom: 16 }}>
                <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>{bucket.hour}:00</div>
                {/* spacer proportional to number of events to align with cards */}
                <div style={{ height: bucket.events.length * 100 }} />
              </div>
            ))}
          </div>

          {/* Center: vertical line and dots */}
          <div style={{ position: 'relative' }}>
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                bottom: 0,
                width: 2,
                transform: 'translateX(-50%)',
                background: 'var(--border)',
                borderRadius: 2,
              }}
            />
            <div>
              {filtered.map((e, idx) => (
                <div key={`dot-${e.id}`} style={{ height: 100, position: 'relative' }}>
                  <div
                    title={`${e.behavior} • ${e.timestamp}`}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 40,
                      transform: 'translate(-50%, -50%)',
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      background: behaviorColor(e.behavior),
                      border: '2px solid var(--surface)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                    }}
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: event cards */}
          <div>
            {filtered.map((e) => {
              const color = behaviorColor(e.behavior);
              return (
                <div
                  key={`card-${e.id}`}
                  className="card-flat"
                  role="button"
                  tabIndex={0}
                  onClick={() => openEvent(e)}
                  onKeyDown={(ev) => { if (ev.key === 'Enter') openEvent(e); }}
                  title={`Open ${e.behavior} at ${e.timestamp}`}
                  style={{
                    marginBottom: 16,
                    padding: 12,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow)',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: 999,
                          background: color,
                          border: '1px solid var(--border)',
                        }}
                        aria-hidden="true"
                      />
                      <div style={{ fontWeight: 700 }}>{e.behavior}</div>
                      <div className="muted">• {e.timestamp}</div>
                      <div className="muted">• {e.durationSec}s</div>
                      {typeof e.confidence === 'number' && (
                        <div className="muted">• {Math.round(e.confidence)}%</div>
                      )}
                    </div>
                    <div className="badge" style={{ background: color }}>
                      {e.camera}
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: 10 }}>
                    {/* Thumbnail placeholder */}
                    <div
                      style={{
                        width: 140,
                        height: 78,
                        borderRadius: 8,
                        background: 'var(--table-row-hover)',
                        border: '1px solid var(--border)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--muted)',
                        fontSize: 12,
                      }}
                    >
                      Thumbnail
                    </div>
                    <div className="muted" style={{ fontSize: 12, alignSelf: 'center' }}>
                      Click to open video with AI overlays and controls
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="card-flat" style={{ padding: 16 }}>
                <div className="muted">No events match the current filters.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <VideoPlayerModal
        open={modal.open}
        onClose={closeModal}
        metadata={
          modal.event
            ? {
                Behavior: modal.event.behavior,
                Timestamp: modal.event.timestamp,
                Duration: modal.event.durationSec ? `${modal.event.durationSec}s` : '—',
                Confidence: typeof modal.event.confidence === 'number' ? `${Math.round(modal.event.confidence)}%` : '—',
                Camera: modal.event.camera || '—',
              }
            : undefined
        }
      />
    </div>
  );
}

export default TimelinePage;
