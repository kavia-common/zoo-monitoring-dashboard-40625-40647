import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TopNav
 * Full-width top navigation bar with 4 items: Dashboard, Timeline, Report, Analytics.
 * No profile/user controls. Applies VizAI-style tokens and active/hover states.
 */
function TopNav() {
  const location = useLocation();

  const items = [
    { to: '/dashboard/giant-anteater', label: 'Dashboard' },
    { to: '/timeline', label: 'Timeline' },
    { to: '/reports', label: 'Report' },
    { to: '/analytics', label: 'Analytics' },
  ];

  return (
    <header
      role="navigation"
      aria-label="Top Navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        height: 64,
        background: '#FFFFFF',
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        borderBottom: '1px solid #E5E7EB',
      }}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 16px',
        }}
      >
        <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#111827' }}>
          VizAI Zoo Monitor
        </div>
        <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {items.map((it) => {
            const active = location.pathname.startsWith(it.to);
            return (
              <NavLink
                key={it.to}
                to={it.to}
                aria-current={active ? 'page' : undefined}
                style={({ isActive }) => ({
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 40,
                  padding: '0 12px',
                  borderRadius: 8,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 500,
                  color: isActive ? '#009688' : '#6B7280',
                  background: 'transparent',
                  textDecoration: 'none',
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E0F2F1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {it.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default TopNav;
