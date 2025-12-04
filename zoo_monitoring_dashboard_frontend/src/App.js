import React, { useMemo } from 'react';
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
import RegisterPage from './pages/RegisterPage';
import FloatingChatBot from './components/FloatingChatBot';

/**
 * PUBLIC_INTERFACE
 * Shell
 * Controls app-level chrome:
 * - Hides nav on unauthenticated routes (/register, /login, /species)
 * - Shows nav only after species selection is made (gated by localStorage flag)
 * - Provides app routes per spec
 */
function Shell() {
  const location = useLocation();

  const authenticated = useMemo(() => {
    // For mock UI: mark authenticated if localStorage flag exists
    return localStorage.getItem('vizai_authed') === '1';
  }, [location.key]);

  const speciesSelected = useMemo(() => {
    return localStorage.getItem('vizai_species') === 'giant-anteater';
  }, [location.key]);

  // Hide nav on register/login/species selection pages
  const hideNavRoutes = ['/register', '/login', '/species'];
  const isHideRoute = hideNavRoutes.includes(location.pathname);
  const showNav = authenticated && speciesSelected && !isHideRoute;

  return (
    <>
      {showNav && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/register" replace />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Species selection page - no top nav; VizAi brand */}
        <Route path="/species" element={<AnimalSelectionPage />} />
        {/* Dashboard, Timeline, Reports, Analytics appear after a species is selected */}
        <Route path="/dashboard/giant-anteater" element={<GiantAnteaterDashboard />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>

      {/* Floating AI Chat Bot - appears on all pages except login/register to avoid distraction */}
      {!isHideRoute && <FloatingChatBot />}
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
