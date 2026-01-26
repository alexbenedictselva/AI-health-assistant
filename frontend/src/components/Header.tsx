import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = Boolean(user?.is_admin);

  return (
    <header className="dashboard-header">
      <div className="header-content">

        {/* LEFT: Logo */}
        <div className="header-left">
          <Link to="/" className="logo">
            AI Health Assistant
          </Link>
        </div>

        {/* CENTER: Navigation */}
        <nav className="header-nav">
          <ul>
            {!isAdmin && (
              <>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/diabetes">Diabetes Assessment</Link></li>
                <li><Link to="/cardiac">Cardiac Assessment</Link></li>
                <li><Link to="/metrics">My Metrics</Link></li>
              </>
            )}

            {isAdmin && (
              <li><Link to="/admin">Admin</Link></li>
            )}
          </ul>
        </nav>

        {/* RIGHT: User info */}
        <div className="header-right">
          <span className="welcome">
            Welcome, {user?.name || "User"}
          </span>
          <button onClick={logout} className="btn btn-outline">
            Logout
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
