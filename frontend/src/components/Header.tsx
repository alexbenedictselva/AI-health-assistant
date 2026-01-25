import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" aria-label="AI Health Assistant">
          <div style={{fontSize: '1rem', fontWeight: 700}}>AI Health Assistant</div>
          {/* <div style={{fontSize: '0.8rem', fontWeight: 400, color: 'rgba(255,255,255,0.9)'}}>Clinical risk insights • Clear recommendations</div> */}
        </div>
        <nav>
          <ul className="nav-links">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/diabetes">Diabetes Assessment</Link></li>
            <li><Link to="/cardiac">Cardiac Assessment</Link></li>
            <li><Link to="/metrics">My Metrics</Link></li>
          </ul>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && (
            <span className="welcome">
              Welcome, {user.name}
            </span>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;