import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddMetric = ({ onAddMetric }) => {
  const navigate = useNavigate();
  const [newMetric, setNewMetric] = useState({
    type: 'Blood Glucose',
    value: '',
    date: new Date().toISOString().slice(0, 16)
  });

  const metricOptions = [
    { type: 'Blood Glucose', unit: 'mg/dL' },
    { type: 'Blood Pressure', unit: 'mmHg' },
    { type: 'Activity', unit: 'minutes' },
    { type: 'BMI', unit: 'kg/m²' }
  ];

  const handleSave = () => {
    if (!newMetric.value) return;
    
    const selectedMetric = metricOptions.find(m => m.type === newMetric.type);
    const metric = {
      id: Date.now(),
      type: newMetric.type,
      value: newMetric.value,
      unit: selectedMetric.unit,
      date: new Date(newMetric.date).toLocaleDateString()
    };
    
    onAddMetric(metric, navigate);
    // Navigation will be handled by App.js
  };

  const NavigationBar = () => (
    <div style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e0e0e0',
      padding: '0 24px',
      marginBottom: '24px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1E88E5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            color: 'white',
            marginRight: '12px'
          }}>
            ❤️
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1E88E5'
          }}>
            VitaCare AI
          </span>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '32px',
          alignItems: 'center'
        }}>
          {['Dashboard', 'Health Metrics', 'Assessments', 'Exercises', 'Assistant', 'Settings'].map((tab) => (
            <span
              key={tab}
              onClick={() => {
                if (tab === 'Dashboard') navigate('/dashboard');
                else if (tab === 'Health Metrics') navigate('/health-metrics');
                else if (tab === 'Assessments') navigate('/assessments');
                else if (tab === 'Exercises') navigate('/exercises');
                else if (tab === 'Assistant') navigate('/assistant');
                else if (tab === 'Settings') navigate('/settings');
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: tab === 'Health Metrics' ? '#1E88E5' : '#666',
                cursor: 'pointer',
                borderBottom: tab === 'Health Metrics' ? '2px solid #1E88E5' : 'none',
                paddingBottom: '4px'
              }}
            >
              {tab}
            </span>
          ))}
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <NavigationBar />
      
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#1E88E5',
            fontSize: '14px',
            cursor: 'pointer',
            marginBottom: '24px'
          }}
        >
          ← Back
        </button>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 8px 0'
          }}>
            Add Health Metric
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: '0 0 32px 0'
          }}>
            Record a new health measurement
          </p>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Metric Type
            </label>
            <select
              value={newMetric.type}
              onChange={(e) => setNewMetric(prev => ({ ...prev, type: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              {metricOptions.map(option => (
                <option key={option.type} value={option.type}>{option.type}</option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Value
            </label>
            <input
              type="number"
              value={newMetric.value}
              onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Enter measurement value"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={newMetric.date}
              onChange={(e) => setNewMetric(prev => ({ ...prev, date: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            backgroundColor: '#E3F2FD',
            border: '1px solid #BBDEFB',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '32px',
            textAlign: 'left'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#1565C0',
              margin: 0,
              lineHeight: '1.4'
            }}>
              <strong>Info:</strong> Values can be estimated or simulated for tracking purposes. This data is for wellness monitoring only.
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 24px',
                backgroundColor: 'transparent',
                color: '#666',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!newMetric.value}
              style={{
                padding: '12px 24px',
                backgroundColor: newMetric.value ? '#1E88E5' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: newMetric.value ? 'pointer' : 'not-allowed'
              }}
            >
              + Save Metric
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMetric;