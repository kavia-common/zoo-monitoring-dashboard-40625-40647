import React from 'react';

/**
 * PUBLIC_INTERFACE
 * SectionHeader
 * Renders a title, optional subtitle, and a teal underline per theme.
 * Props:
 * - title: string
 * - subtitle?: string
 */
function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header" aria-label="Section header">
      <h2 className="section-header-title">{title}</h2>
      {subtitle ? <div className="subtle-text">{subtitle}</div> : null}
      <div className="section-header-underline" />
    </div>
  );
}

export default SectionHeader;
