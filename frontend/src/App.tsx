import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import DiabetesAssessment from './pages/DiabetesAssessment';
import CardiacAssessment from './pages/CardiacAssessment';
import UserMetrics from './pages/UserMetrics';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
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
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
