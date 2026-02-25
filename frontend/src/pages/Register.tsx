import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

const AUTH_BG_IMAGE =
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2000&q=80';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password
      });
      setSuccess('Registration successful! Please sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          setError(err.response.data.detail);
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
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
            Create Your Account
          </h1>

          <p style={{ fontSize: '16px', opacity: 0.9, lineHeight: 1.6 }}>
            Sign up to start tracking your health and access AI-driven diabetes insights.
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
            Create Account
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

          {success && (
            <div
              style={{
                marginBottom: '20px',
                padding: '12px',
                borderRadius: '8px',
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                fontSize: '14px'
              }}
            >
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full name"
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                fontSize: '15px'
              }}
            />

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
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              required
              placeholder="Phone number"
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

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm password"
              style={{
                padding: '14px 16px',
                borderRadius: '10px',
                border: '1px solid #E5E7EB',
                fontSize: '15px'
              }}
            />

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
              {loading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
