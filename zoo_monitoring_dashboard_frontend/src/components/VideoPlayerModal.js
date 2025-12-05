import React, { useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * VideoPlayerModal
 * Displays a video with play/pause/speed and +/-10s skip controls and sample AI bounding boxes overlay.
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - src: string (video source URL, optional placeholder used if absent)
 * - metadata: object with simple key/values to display
 */
function VideoPlayerModal({ open, onClose, src, metadata }) {
  const videoRef = useRef(null);
  const [speed, setSpeed] = useState(1);

  if (!open) return null;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const changeSpeed = (s) => {
    const v = videoRef.current;
    if (!v) return;
    v.playbackRate = s;
    setSpeed(s);
  };

  const skip = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    try {
      v.currentTime = Math.max(0, Math.min(v.duration || 0, (v.currentTime || 0) + delta));
    } catch {
      /* no-op */
    }
  };

  // Placeholder rectangles
  const boxes = [
    { left: '20%', top: '30%', width: '20%', height: '18%' },
    { left: '55%', top: '50%', width: '18%', height: '16%' },
  ];

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Video Player Modal">
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottom: '1px solid var(--border)' }}>
          <strong>Event Video</strong>
          <button
            aria-label="Close video"
            className="btn"
            onClick={onClose}
            style={{ borderColor: 'var(--error)', color: 'var(--error)', borderWidth: 1, borderStyle: 'solid', background: 'transparent' }}
          >
            Close
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, padding: 16 }}>
          <div style={{ position: 'relative', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
            <video
              ref={videoRef}
              src={src || ''}
              controls={false}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {/* Overlay boxes */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {boxes.map((b, idx) => (
                <div key={idx} style={{
                  position: 'absolute',
                  left: b.left, top: b.top, width: b.width, height: b.height,
                  border: '2px solid var(--secondary)', borderRadius: 4,
                  boxShadow: '0 0 0 2px rgba(245,158,11,0.2)'
                }} />
              ))}
            </div>
          </div>
          <div>
            <div className="card-flat" style={{ padding: 12, marginBottom: 12 }}>
              <div className="row" style={{ flexWrap: 'wrap' }}>
                <button aria-label="Play/Pause" className="btn btn-primary" onClick={togglePlay}>Play / Pause</button>
                <button aria-label="Skip back 10 seconds" className="btn" onClick={() => skip(-10)} style={{ borderColor: 'var(--border)' }}>-10s</button>
                <button aria-label="Skip forward 10 seconds" className="btn" onClick={() => skip(10)} style={{ borderColor: 'var(--border)' }}>+10s</button>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="subtle">Speed</span>
                  {[0.5, 1, 1.5, 2].map(s => (
                    <button
                      key={s}
                      className="btn"
                      aria-label={`Set speed ${s}x`}
                      onClick={() => changeSpeed(s)}
                      style={{
                        borderColor: 'var(--border)',
                        background: s === speed ? 'var(--table-row-hover)' : 'transparent'
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-flat" style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Metadata</div>
              <div className="muted" style={{ display: 'grid', gap: 4 }}>
                {metadata ? Object.entries(metadata).map(([k, v]) => (
                  <div key={k}><strong style={{ color: 'var(--text)' }}>{k}:</strong> <span className="muted">{String(v)}</span></div>
                )) : (
                  <>
                    <div><strong style={{ color: 'var(--text)' }}>Behavior:</strong> <span className="muted">Pacing</span></div>
                    <div><strong style={{ color: 'var(--text)' }}>Confidence:</strong> <span className="muted">0.92</span></div>
                    <div><strong style={{ color: 'var(--text)' }}>Timestamp:</strong> <span className="muted">12:34:10</span></div>
                    <div><strong style={{ color: 'var(--text)' }}>Duration:</strong> <span className="muted">35s</span></div>
                    <div><strong style={{ color: 'var(--text)' }}>Camera:</strong> <span className="muted">Camera 1</span></div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerModal;
