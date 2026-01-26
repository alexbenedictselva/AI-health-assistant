import React, { useState, useEffect } from 'react';
import { metricsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const UserMetrics: React.FC = () => {
  const { getUserId } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    // We intentionally call fetchMetrics when selectedType changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchMetrics();
  }, [selectedType]);

  const fetchMetrics = async () => {
    setLoading(true);
    setError('');
    
    try {
      const userId = getUserId();
      const diseaseType = selectedType === 'all' ? undefined : selectedType;
      const response = await metricsAPI.getUserMetrics(userId, diseaseType);
      setMetrics(response.data);
    } catch (err: any) {
      console.error('Metrics error:', err);
      if (err.response?.data?.detail) {
        if (typeof err.response.data.detail === 'string') {
          setError(err.response.data.detail);
        } else {
          setError('Failed to fetch metrics');
        }
      } else {
        setError('Failed to fetch metrics');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateOrTimestamp: string | number | undefined) => {
    if (!dateOrTimestamp) return '—';
    const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : new Date(String(dateOrTimestamp));
    if (isNaN(date.getTime())) return String(dateOrTimestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDiabetesMetrics = (metric: any) => (
    <div className="card" key={metric.metric_id}>
      <div className="card-header">
  🩺 Diabetes Metrics - {formatDate(metric.timestamp ?? metric.created_at)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <strong>Glucose:</strong> {metric.glucose_value} mg/dL ({metric.measurement_context})
        </div>
        <div>
          <strong>Trend:</strong> {metric.trend}
        </div>
        <div>
          <strong>Symptoms:</strong> {metric.symptoms}
        </div>
        <div>
          <strong>Medication:</strong> {metric.medication_type}
        </div>
        <div>
          <strong>Diet:</strong> {metric.meal_type}
        </div>
        <div>
          <strong>Status:</strong> {metric.diabetes_status}
        </div>
        <div>
          <strong>Age:</strong> {metric.age} years
        </div>
        <div>
          <strong>Weight:</strong> {metric.weight_kg} kg
        </div>
        <div>
          <strong>Height:</strong> {metric.height_cm} cm
        </div>
        <div>
          <strong>Activity:</strong> {metric.physical_activity}
        </div>
        <div>
          <strong>Family History:</strong> {metric.family_history ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );

  const renderCardiacMetrics = (metric: any) => (
    <div className="card" key={metric.metric_id}>
      <div className="card-header">
  ❤️ Cardiac Metrics - {formatDate(metric.timestamp ?? metric.created_at)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <strong>Chest Pain:</strong> {metric.chest_pain}
        </div>
        <div>
          <strong>Breathlessness:</strong> {metric.shortness_of_breath}
        </div>
        <div>
          <strong>Heart Rate:</strong> {metric.heart_rate ? `${metric.heart_rate} BPM` : 'Not recorded'}
        </div>
        <div>
          <strong>Blood Pressure:</strong> {metric.blood_pressure}
        </div>
        <div>
          <strong>Smoking:</strong> {metric.smoking}
        </div>
        <div>
          <strong>Diet:</strong> {metric.diet}
        </div>
        <div>
          <strong>Age:</strong> {metric.age} years
        </div>
        <div>
          <strong>Weight:</strong> {metric.weight_kg} kg
        </div>
        <div>
          <strong>Height:</strong> {metric.height_cm} cm
        </div>
        <div>
          <strong>Activity:</strong> {metric.physical_activity}
        </div>
        <div>
          <strong>Family History:</strong> {metric.family_history ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 className="page-title">My Health Metrics</h1>
      
      <div className="card">
        <div className="card-header">Filter Metrics</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label className="form-label">Show:</label>
          <select
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Metrics</option>
            <option value="diabetes">Diabetes Only</option>
            <option value="cardiac">Cardiac Only</option>
          </select>
          <button 
            className="btn btn-secondary"
            onClick={fetchMetrics}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading your health metrics...</div>
      ) : metrics.length === 0 ? (
        <div className="card">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-medium)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3>No Metrics Found</h3>
            <p>You haven't recorded any health metrics yet.</p>
            <p>Start by taking a diabetes or cardiac assessment to build your health history.</p>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '2rem', color: 'var(--gray-medium)' }}>
            Showing {metrics.length} metric{metrics.length !== 1 ? 's' : ''}
          </div>
          
          {metrics.map((metric) => 
            metric.disease_type === 'diabetes' 
              ? renderDiabetesMetrics(metric)
              : renderCardiacMetrics(metric)
          )}
        </div>
      )}
    </div>
  );
};

export default UserMetrics;