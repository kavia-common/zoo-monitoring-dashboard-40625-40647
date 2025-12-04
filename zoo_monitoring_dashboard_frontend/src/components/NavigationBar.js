import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NavigationBar
 * Renders the main top navigation bar with links.
 * Tabs are enabled only after a species selection is made.
 */
function NavigationBar() {
  const location = useLocation();
  const speciesSelected = typeof window !== 'undefined' && localStorage.getItem('vizai_species') === 'giant-anteater';

  const tabs = [
    { to: '/species', label: 'Species' },
    { to: '/dashboard/giant-anteater', label: 'Dashboard', gated: true },
    { to: '/timeline', label: 'Timeline', gated: true },
    { to: '/reports', label: 'Reports', gated: true },
    { to: '/chat', label: 'Chat', gated: true },
    { to: '/analytics', label: 'Analytics', gated: true },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-inner">
        <div style={{ fontWeight: 900, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--primary)' }}>Viz</span>
          <span style={{ color: 'var(--secondary)' }}>Ai</span>
          <span className="muted" style={{ marginLeft: 8, fontWeight: 600 }}>| Zoo Monitor</span>
        </div>
        <div className="nav-tabs" role="tablist" aria-label="Primary">
          {tabs.map(tab => {
            const active = location.pathname.startsWith(tab.to);
            const disabled = tab.gated && !speciesSelected;
            const className = `nav-tab ${active ? 'active' : ''}`;
            return disabled ? (
              <span key={tab.to} className={className} aria-disabled="true" title="Select a species first" style={{ opacity: 0.5 }}>
                {tab.label}
              </span>
            ) : (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={className}
                role="tab"
                aria-selected={active}
              >
                {tab.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
