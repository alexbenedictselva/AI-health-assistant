import React, { useState } from 'react';

const Login = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
    onNavigate('dashboard');
  };

  const handleDemoLogin = () => {
    onLogin({ email: 'demo@vitacare.ai', fullName: 'Demo User' });
    onNavigate('dashboard');
  };

  return (
    <div style={{
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#1E88E5',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            color: 'white'
          }}>
            ❤️
          </div>
          <h1 style={{
            color: '#1E88E5',
            fontSize: '24px',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: 0
          }}>
            Log in to your VitaCare AI account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '30px', textAlign: 'right' }}>
            <span style={{
              color: '#1E88E5',
              fontSize: '14px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleDemoLogin}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#66BB6A',
              border: '2px solid #66BB6A',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            Continue as Demo User
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          margin: 0
        }}>
          Don't have an account?{' '}
          <span
            onClick={() => onNavigate('signup')}
            style={{
              color: '#1E88E5',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;