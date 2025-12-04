import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import NavigationBar from './components/NavigationBar';
import LoginPage from './pages/LoginPage';
import AnimalSelectionPage from './pages/AnimalSelectionPage';
import GiantAnteaterDashboard from './pages/GiantAnteaterDashboard';
import TimelinePage from './pages/TimelinePage';
import ReportsPage from './pages/ReportsPage';
import ChatPage from './pages/ChatPage';
import AnalyticsPage from './pages/AnalyticsPage';

// PUBLIC_INTERFACE
function Shell() {
  /** Renders the navigation bar on all routes except /login */
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  return (
    <>
      {!hideNav && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/animals" element={<AnimalSelectionPage />} />
        <Route path="/dashboard/giant-anteater" element={<GiantAnteaterDashboard />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entry - wraps Shell in BrowserRouter */
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  );
}

export default App;
