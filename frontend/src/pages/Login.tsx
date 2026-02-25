import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const AUTH_BG_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);

      if (!response.data.access_token || !response.data.user) {
        throw new Error('Invalid response from server');
      }

      login(response.data.access_token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(14,165,233,0.72), rgba(56,189,248,0.62)), url(${AUTH_BG_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '40px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1000px',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          display: 'flex',
          boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
        }}
      >

        {/* LEFT PANEL */}
        <div
          style={{
            flex: 1,
            padding: '70px 60px',
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            color: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h1 style={{ fontSize: '36px', fontWeight: 700, marginBottom: '20px' }}>
            Welcome Back!
          </h1>

          <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.6 }}>
            Sign in to access your personalized health dashboard and AI-driven insights.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div
          style={{
            flex: 1,
            padding: '70px 60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2
            style={{
              fontSize: '28px',
              fontWeight: 700,
              marginBottom: '30px',
              color: 'var(--text-primary)'
            }}
          >
            Sign In
          </h2>

          {error && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px',
                borderRadius: '8px',
                background: '#FEE2E2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                fontSize: '14px'
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email address"
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                fontSize: '15px'
              }}
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Password"
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                fontSize: '15px'
              }}
            />

            <div style={{ textAlign: 'right', fontSize: '14px' }}>
              <Link to="#" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 600,
                fontSize: '15px',
                color: '#ffffff',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))'
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p
            style={{
              marginTop: '30px',
              fontSize: '14px',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            Don’t have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
