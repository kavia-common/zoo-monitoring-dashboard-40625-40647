import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * Rounded-pill buttons with variants 'refresh' and 'logout' using theme tokens.
 * Props:
 * - variant: 'refresh' | 'logout'
 * - children: React.ReactNode
 * - onClick?: () => void
 * - ariaLabel?: string
 */
function Button({ variant, children, onClick, ariaLabel }) {
  const className = `btn-pill ${variant === 'refresh' ? 'btn-refresh' : 'btn-logout'}`;
  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {children}
    </button>
  );
}

export default Button;
