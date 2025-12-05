import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * Very light background, stacked icons, with active indicator bar on the left in var(--color-primary).
 */
function Sidebar() {
  const location = useLocation();

  const items = [
    { to: '/dashboard/giant-anteater', label: 'D', title: 'Dashboard' },
    { to: '/timeline', label: 'T', title: 'Timeline' },
    { to: '/reports', label: 'R', title: 'Reports' },
    { to: '/analytics', label: 'A', title: 'Analytics' },
    { to: '/chat', label: 'C', title: 'Chat' },
  ];

  return (
    <aside className="sidebar" aria-label="Sidebar navigation">
      {items.map((it) => {
        const active = location.pathname.startsWith(it.to);
        const cls = `sidebar-item ${active ? 'active' : ''}`;
        return (
          <NavLink
            key={it.to}
            to={it.to}
            className={cls}
            title={it.title}
            aria-label={it.title}
          >
            <span>{it.label}</span>
          </NavLink>
        );
      })}
    </aside>
  );
}

export default Sidebar;
