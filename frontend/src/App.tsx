import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DiabetesAssessment from './pages/DiabetesAssessment';
import CardiacAssessment from './pages/CardiacAssessment';
import UserMetrics from './pages/UserMetrics';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Router>
      {/* Auth listener watches for auth:invalid events (dispatched by API interceptor) */}
      <AuthListener />
      <div className="App">
        {isAuthenticated && <Header />}
        <Routes>
          <Route 
            path="/login" 
            element={
              !isAuthenticated ? 
              <Login /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/register" 
            element={
              !isAuthenticated ? 
              <Register /> : 
              <Navigate to="/dashboard" />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/diabetes" 
            element={
              isAuthenticated ? 
              <DiabetesAssessment /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/cardiac" 
            element={
              isAuthenticated ? 
              <CardiacAssessment /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/metrics" 
            element={
              isAuthenticated ? 
              <UserMetrics /> : 
              <Navigate to="/login" />
            } 
          />
          <Route
            path="/admin"
            element={
              isAuthenticated && user?.is_admin ?
              <AdminDashboard /> :
              <Navigate to="/dashboard" />
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

// A small component that listens for the global `auth:invalid` event.
// When triggered, it calls logout() and navigates to /login.
function AuthListener() {
  const { logout } = useAuth();
  const nav = useNavigate();

  React.useEffect(() => {
    const handler = () => {
      logout();
      nav('/login');
    };
    window.addEventListener('auth:invalid', handler);
    return () => window.removeEventListener('auth:invalid', handler);
  }, [logout, nav]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
