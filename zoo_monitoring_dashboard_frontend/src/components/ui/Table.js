import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Table
 * Styled table per theme with header background and soft row dividers.
 * Props:
 * - columns: { key: string; header: string }[]
 * - rows: Record<string, React.ReactNode>[]
 */
function Table({ columns, rows }) {
  return (
    <table className="kv-table">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={col.key}>{r[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Table;
