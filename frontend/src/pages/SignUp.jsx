import React, { useState } from 'react';

const SignUp = ({ onNavigate, onSignUp }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignUp(formData);
    onNavigate('profile');
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
            Create Your Account
          </h1>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: 0
          }}>
            Join VitaCare AI to start your health journey
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
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

          <div style={{ marginBottom: '20px' }}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
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

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#666',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                name="agreed"
                checked={formData.agreed}
                onChange={handleInputChange}
                style={{ marginRight: '8px' }}
                required
              />
              I understand this app provides preventive guidance only.
            </label>
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
              marginBottom: '20px'
            }}
          >
            Create Account
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: '#666',
          margin: 0
        }}>
          Already have an account?{' '}
          <span
            onClick={() => onNavigate('login')}
            style={{
              color: '#1E88E5',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;