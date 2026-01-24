import React, { useState } from 'react';

const HealthMetrics = ({ onNavigate, healthMetrics, onAddMetric }) => {
  const [showModal, setShowModal] = useState(false);
  const [newMetric, setNewMetric] = useState({
    type: 'Blood Glucose',
    value: '',
    unit: 'mg/dL'
  });

  const metricUnits = {
    'Blood Glucose': 'mg/dL',
    'Blood Pressure': 'mmHg',
    'BMI': 'kg/m²',
    'Weight': 'kg',
    'Heart Rate': 'bpm'
  };

  const handleMetricTypeChange = (type) => {
    setNewMetric({
      type,
      value: '',
      unit: metricUnits[type]
    });
  };

  const handleSaveMetric = () => {
    if (!newMetric.value) return;
    
    const metric = {
      id: Date.now(),
      type: newMetric.type,
      value: newMetric.value,
      unit: newMetric.unit,
      date: new Date().toLocaleDateString()
    };
    
    onAddMetric(metric);
    setShowModal(false);
    setNewMetric({
      type: 'Blood Glucose',
      value: '',
      unit: 'mg/dL'
    });
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
          {['Dashboard', 'Health Metrics', 'Assessments', 'Assistant', 'Settings'].map((tab) => (
            <span
              key={tab}
              onClick={() => {
                if (tab === 'Dashboard') onNavigate('dashboard');
                else if (tab === 'Assessments') onNavigate('assessments');
                else if (tab === 'Assistant') onNavigate('assistant');
                else if (tab === 'Settings') onNavigate('settings');
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
            onClick={() => onNavigate('signup')}
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

  const Modal = () => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        width: '400px',
        maxWidth: '90vw'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 4px 0'
            }}>
              Add New Measurement
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Record a new health data point
            </p>
          </div>
          <button
            onClick={() => setShowModal(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            Metric Type
          </label>
          <select
            value={newMetric.type}
            onChange={(e) => handleMetricTypeChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          >
            {Object.keys(metricUnits).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
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
            placeholder="e.g. 120"
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

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            Unit
          </label>
          <input
            type="text"
            value={newMetric.unit}
            readOnly
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              backgroundColor: '#f5f5f5',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowModal(false)}
            style={{
              flex: 1,
              padding: '12px',
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
            onClick={handleSaveMetric}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Save Measurement
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0'
            }}>
              Health Metrics
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: 0
            }}>
              Track your vital signs and measurements
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '12px 20px',
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + Add Measurement
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          {/* History Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }}>
              History
            </h2>
            
            {healthMetrics && healthMetrics.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {healthMetrics.slice(-10).reverse().map((metric) => (
                  <div key={metric.id} style={{
                    padding: '16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: '600', color: '#333' }}>{metric.type}</span>
                      <span style={{ color: '#666', marginLeft: '8px' }}>{metric.date}</span>
                    </div>
                    <span style={{ fontWeight: '600', color: '#1E88E5' }}>
                      {metric.value} {metric.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                border: '2px dashed #ddd',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                color: '#666'
              }}>
                No metrics recorded yet.
              </div>
            )}
          </div>

          {/* Healthy Ranges Card */}
          <div style={{
            backgroundColor: '#66BB6A',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            color: 'white'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              color: 'white'
            }}>
              Healthy Ranges
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Blood Glucose</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>70–140 mg/dL (Normal)</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Blood Pressure</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>120/80 mmHg (Normal)</div>
              </div>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>BMI</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>18.5–24.9 (Healthy)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && <Modal />}
    </div>
  );
};

export default HealthMetrics;