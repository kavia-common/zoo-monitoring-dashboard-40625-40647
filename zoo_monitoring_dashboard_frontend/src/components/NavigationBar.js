import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * NavigationBar
 * Renders the main top navigation bar with links to Animals, Dashboard, Timeline, Reports, Chat, Analytics.
 * Highlights the active tab with an underline in var(--primary).
 */
function NavigationBar() {
  const location = useLocation();
  const tabs = [
    { to: '/animals', label: 'Animals' },
    { to: '/dashboard/giant-anteater', label: 'Dashboard' },
    { to: '/timeline', label: 'Timeline' },
    { to: '/reports', label: 'Reports' },
    { to: '/chat', label: 'Chat' },
    { to: '/analytics', label: 'Analytics' },
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-inner">
        <div style={{ fontWeight: 800, fontSize: 18 }}>
          🐾 Zoo Monitor
        </div>
        <div className="nav-tabs" role="tablist" aria-label="Primary">
          {tabs.map(tab => {
            const active = location.pathname.startsWith(tab.to);
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={`nav-tab ${active ? 'active' : ''}`}
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
