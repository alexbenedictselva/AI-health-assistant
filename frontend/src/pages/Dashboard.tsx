import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HealthDashboard from '../components/HealthDashboard';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Keep an explicit isAdmin state so the UI can react to role changes
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(Boolean(user?.is_admin));
  }, [user]);

  // If an admin is logged in, show only the Admin users list
  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div>
      <HealthDashboard />
      
      {/* Quick Actions Section */}
      <div className="container" style={{ marginTop: '2rem' }}>
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-icon">🩺</div>
            <h3 className="dashboard-title">Diabetes Assessment</h3>
            <p className="dashboard-description">
              Comprehensive glucose risk evaluation with personalized insights and recommendations.
            </p>
            <Link to="/diabetes" className="btn btn-primary">
              Start Assessment
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">❤️</div>
            <h3 className="dashboard-title">Cardiac Assessment</h3>
            <p className="dashboard-description">
              Advanced heart health analysis with risk factors and preventive guidance.
            </p>
            <Link to="/cardiac" className="btn btn-primary">
              Start Assessment
            </Link>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-icon">📊</div>
            <h3 className="dashboard-title">Health Metrics</h3>
            <p className="dashboard-description">
              Track your health data over time and monitor progress with detailed analytics.
            </p>
            <Link to="/metrics" className="btn btn-primary">
              View Metrics
            </Link>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">AI Health Assistant Features</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }}>🔬 Advanced Risk Analysis</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', lineHeight: '1.5' }}>Sophisticated algorithms analyze multiple health factors to provide accurate risk assessments.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }}>🧠 Explainable AI</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', lineHeight: '1.5' }}>Detailed explanations help you understand your health risks and the reasoning behind recommendations.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }}>📊 Trend Monitoring</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', lineHeight: '1.5' }}>Track your health metrics over time to identify patterns and improvements.</p>
            </div>
            <div>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '0.5rem' }}>🎯 Personalized Care</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--gray-medium)', lineHeight: '1.5' }}>Receive tailored recommendations based on your unique health profile and risk factors.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;