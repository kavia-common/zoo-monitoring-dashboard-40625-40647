import React, { useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import './styles/theme.css';
import LoginPage from './pages/LoginPage';
import AnimalSelectionPage from './pages/AnimalSelectionPage';
import GiantAnteaterDashboard from './pages/GiantAnteaterDashboard';
import TimelinePage from './pages/TimelinePage';
import ReportsPage from './pages/ReportsPage';
import ChatPage from './pages/ChatPage';
import AnalyticsPage from './pages/AnalyticsPage';
import RegisterPage from './pages/RegisterPage';
import FloatingChatBot from './components/FloatingChatBot';
import Sidebar from './components/Layout/Sidebar';
import TopBar from './components/Layout/TopBar';

/**
 * PUBLIC_INTERFACE
 * Shell
 * Controls app-level chrome with left Sidebar and TopBar:
 * - Hides chrome on unauthenticated routes (/register, /login, /species)
 * - Shows chrome only after species selection is made (gated by localStorage flag)
 * - Provides app routes per spec
 */
function Shell() {
  const location = useLocation();

  const authenticated = useMemo(() => {
    return localStorage.getItem('vizai_authed') === '1';
  }, [location.key]);

  const speciesSelected = useMemo(() => {
    return localStorage.getItem('vizai_species') === 'giant-anteater';
  }, [location.key]);

  const hideNavRoutes = ['/register', '/login', '/species'];
  const isHideRoute = hideNavRoutes.includes(location.pathname);
  const showChrome = authenticated && speciesSelected && !isHideRoute;

  const MainRoutes = (
    <Routes>
      <Route path="/" element={<Navigate to="/register" replace />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/species" element={<AnimalSelectionPage />} />
      <Route path="/dashboard/giant-anteater" element={<GiantAnteaterDashboard />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  );

  if (!showChrome) {
    return (
      <>
        {MainRoutes}
        {!isHideRoute && <FloatingChatBot />}
      </>
    );
  }

  const doRefresh = () => {
    // No-op mock refresh; in future wire to API
  };
  const doLogout = () => {
    localStorage.removeItem('vizai_authed');
    localStorage.removeItem('vizai_species');
    window.location.href = '/login';
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: '100vh' }}>
        <TopBar onRefresh={doRefresh} onLogout={doLogout} userName="Keeper Jane" />
        <div style={{ padding: 16 }}>
          {MainRoutes}
        </div>
      </div>
      {!isHideRoute && <FloatingChatBot />}
    </div>
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
