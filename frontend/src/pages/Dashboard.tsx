import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HealthDashboard from '../components/HealthDashboard';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './AdminDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    setIsAdmin(Boolean(user?.is_admin));
  }, [user]);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <div className="modern-dashboard">
      <HealthDashboard />
      
      <div className="action-cards-container">
        <Link to="/diabetes" className="action-card primary-card">
          <div className="card-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h3>Diabetes Assessment</h3>
          <p>Get comprehensive glucose risk evaluation with AI-powered insights</p>
          <span className="card-arrow">→</span>
        </Link>

        <Link to="/metrics" className="action-card secondary-card">
          <div className="card-icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 16l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Health Metrics</h3>
          <p>Track your progress and view detailed health analytics over time</p>
          <span className="card-arrow">→</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;