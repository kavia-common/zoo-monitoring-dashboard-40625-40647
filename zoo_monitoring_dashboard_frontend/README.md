# Zoo Monitoring Dashboard Frontend

This frontend implements the UI for the Zoo Monitoring Dashboard with the Ocean Professional theme.

## Pages and Routes

- /login — Login Page (email, password, role, remember me; navigates to /animals)
- /animals — Animal Selection (Giant Anteater active; others disabled "Coming Soon")
- /dashboard/giant-anteater — Giant Anteater Dashboard (header card, behavior charts, 24h heatmap; clicks route to /timeline with filters)
- /timeline — Timeline with filter panel and clickable events launching video modal
- /reports — Report builder and export actions
- /chat — Simple chat interface with action buttons
- /analytics — Analytics dashboard with smart filters and data table

A shared NavigationBar appears on all routes except /login.

## Theme

Global CSS variables are defined in src/App.css:

- --bg, --surface, --border, --shadow, --text, --primary, --primary-600, --secondary, --muted, --card-hover, --table-header-bg, --table-row-hover, --error.

These are used consistently across components (cards, buttons, inputs, tables).

## Development

- npm start — run the app at http://localhost:3000
- npm test — run tests
- npm run build — production build

No .env variables are required for the current UI-only implementation. If REACT_APP_* variables exist, the app will ignore them unless you wire APIs later.

## Accessibility and Responsiveness

- All controls include aria-labels where appropriate.
- Layout is responsive using simple grid utilities and media queries.
