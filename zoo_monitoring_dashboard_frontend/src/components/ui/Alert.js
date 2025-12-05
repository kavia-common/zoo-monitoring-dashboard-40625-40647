import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Alert
 * Error alert banner with specified bg/border/text/icon colors and soft shadow.
 * Props:
 * - children: React.ReactNode (message)
 * - icon?: React.ReactNode (defaults to warning symbol)
 */
function Alert({ children, icon }) {
  return (
    <div role="alert" className="alert">
      <div className="alert-icon" aria-hidden>{icon ?? '⚠'}</div>
      <div>{children}</div>
    </div>
  );
}

export default Alert;
