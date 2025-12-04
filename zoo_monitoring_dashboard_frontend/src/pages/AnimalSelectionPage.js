import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * AnimalSelectionPage
 * Displays a grid of animal species cards. Giant Anteater is active; others are disabled with "Coming Soon".
 */
function AnimalSelectionPage() {
  const navigate = useNavigate();
  const animals = [
    { name: 'Giant Anteater', active: true },
    { name: 'Red Panda', active: false },
    { name: 'Snow Leopard', active: false },
    { name: 'River Otter', active: false },
    { name: 'Chimpanzee', active: false },
    { name: 'Giraffe', active: false },
    { name: 'Lion', active: false },
    { name: 'Penguin', active: false },
  ];

  const onClick = (a) => {
    if (a.active) {
      navigate('/dashboard/giant-anteater');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div className="container">
        <div className="row" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h2 className="section-title">Select an Animal</h2>
        </div>

        <div className="grid grid-4">
          {animals.map((a) => {
            const active = a.active;
            return (
              <div
                key={a.name}
                className="card"
                onClick={() => onClick(a)}
                role="button"
                aria-label={active ? `Open ${a.name} dashboard` : `${a.name} coming soon`}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') onClick(a); }}
                style={{
                  padding: 16,
                  borderColor: active ? 'var(--primary)' : 'var(--border)',
                  opacity: active ? 1 : 0.5,
                  position: 'relative',
                  transition: 'transform 0.06s ease, box-shadow 0.2s ease, background 0.2s ease',
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{a.name}</div>
                <div className="muted">Species overview</div>
                {!active && (
                  <div className="badge" style={{ position: 'absolute', top: 12, right: 12, background: 'var(--secondary)', color: '#111827' }}>
                    Coming Soon
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AnimalSelectionPage;
