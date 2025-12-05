import React from 'react';
import Button from '../ui/Button';

/**
 * PUBLIC_INTERFACE
 * TopBar
 * White surface with right-aligned user info and Logout button.
 * Props:
 * - onRefresh?: () => void
 * - onLogout?: () => void
 * - userName?: string
 */
function TopBar({ onRefresh, onLogout, userName = 'User' }) {
  return (
    <header className="topbar" aria-label="Top bar">
      <div className="subtle-text" style={{ marginRight: 'auto' }} />
      <div className="subtle-text" aria-label="User name" style={{ marginRight: 8 }}>
        {userName}
      </div>
      <Button variant="refresh" onClick={onRefresh} ariaLabel="Refresh data">
        <span className="icon-bubble" aria-hidden>↻</span>
        Refresh
      </Button>
      <Button variant="logout" onClick={onLogout} ariaLabel="Logout">
        Logout
      </Button>
    </header>
  );
}

export default TopBar;
