# Zoo Monitoring Dashboard Frontend

This frontend implements the UI for the Zoo Monitoring Dashboard with the Ocean Professional theme.

## Pages and Routes (VizAi flow)

- /register — Registration (VizAi brand). On success → /login
- /login — Login Page (VizAi brand). On success sets auth and → /species
- /species — Animal Species Selection (no navbar; selecting Giant Anteater sets gate and → /dashboard/giant-anteater)
- /dashboard/giant-anteater — Species Dashboard (header card; behavior charts; heatmap; clicking charts → /timeline with filters)
- /timeline — Timeline with left filter panel; clickable events open video modal with metadata
- /reports — Report builder and export actions
- /chat — Simple chat interface with action buttons
- /analytics — Analytics dashboard with smart filters and data table

Top Navigation is gated and visible only after a species has been selected. The floating VizAi Chat Bot button appears on all pages except login/register.

## Theme

Global CSS variables are defined in src/App.css:

- --bg, --surface, --border, --shadow, --text, --primary, --primary-600, --secondary, --muted, --card-hover, --table-header-bg, --table-row-hover, --error.

These are used consistently across components (cards, buttons, inputs, tables). Avoid introducing other palettes; use these variables.

## Development

- npm start — run the app at http://localhost:3000
- npm test — run tests
- npm run build — production build

No .env variables are required for the current UI-only implementation. If REACT_APP_* variables exist, the app will ignore them unless you wire APIs later.

## Accessibility and Responsiveness

- All controls include aria-labels where appropriate.
- Layout is responsive using simple grid utilities and media queries.
