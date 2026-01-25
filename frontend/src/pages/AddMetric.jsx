import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddMetric = ({ onAddMetric }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedMetric, setSelectedMetric] = useState('');

  const metricConfigs = {
    'Blood Glucose': {
      unit: 'mg/dL',
      fields: [
        { name: 'glucose_value', label: 'Glucose Value', type: 'number', required: true, placeholder: 'e.g., 95' },
        { name: 'measurement_context', label: 'Measurement Context', type: 'select', required: true, options: ['Fasting', 'Post-Meal', 'Random'] },
        { name: 'trend', label: 'Trend', type: 'select', required: true, options: ['Improving', 'Stable', 'Worsening'] },
        { name: 'symptoms', label: 'Symptoms', type: 'select', required: true, options: ['None of them', 'Low Sugar', 'High Sugar', 'Both Low and High Sugar'] },
        { name: 'medication_type', label: 'Medication Type', type: 'select', required: true, options: ['None', 'Oral', 'Insulin'] },
        { name: 'meal_type', label: 'Meal Type', type: 'select', required: true, options: ['Low-Carb', 'Balanced', 'High-Carb'] },
        { name: 'physical_activity', label: 'Physical Activity', type: 'select', required: true, options: ['Active', 'Sometimes', 'Never'] },
        { name: 'diabetes_status', label: 'Diabetes Status', type: 'select', required: true, options: ['Non-Diabetic', 'Prediabetic', 'Type 1', 'Type 2'] },
        { name: 'age', label: 'Age', type: 'number', required: true, placeholder: 'e.g., 35' },
        { name: 'weight_kg', label: 'Weight (kg)', type: 'number', required: true, placeholder: 'e.g., 70' },
        { name: 'height_cm', label: 'Height (cm)', type: 'number', required: true, placeholder: 'e.g., 175' },
        { name: 'family_history', label: 'Family History of Diabetes', type: 'select', required: true, options: ['Yes', 'No'] }
      ]
    },
    'Blood Pressure': {
      unit: 'mmHg',
      fields: [
        { name: 'systolic', label: 'Systolic Pressure', type: 'number', required: true, placeholder: 'e.g., 120' },
        { name: 'diastolic', label: 'Diastolic Pressure', type: 'number', required: true, placeholder: 'e.g., 80' }
      ]
    },
    'Activity': {
      unit: 'minutes',
      fields: [
        { name: 'value', label: 'Duration', type: 'number', required: true, placeholder: 'e.g., 30' },
        { name: 'activityType', label: 'Activity Type', type: 'select', required: true, options: ['Walking', 'Running', 'Cycling', 'Swimming', 'Gym Workout', 'Yoga', 'Sports', 'Other'] }
      ]
    },
    'BMI': {
      unit: 'kg/m²',
      fields: [
        { name: 'weight', label: 'Weight', type: 'number', required: true, placeholder: 'e.g., 70' },
        { name: 'height', label: 'Height', type: 'number', required: true, placeholder: 'e.g., 175' }
      ]
    }
  };

  const fieldsPerPage = 4;
  const currentConfig = metricConfigs[selectedMetric];
  const totalPages = currentConfig ? Math.ceil(currentConfig.fields.length / fieldsPerPage) : 1;
  const currentFields = currentConfig ? currentConfig.fields.slice(
    (currentPage - 1) * fieldsPerPage,
    currentPage * fieldsPerPage
  ) : [];

  const handleMetricSelect = (metricType) => {
    setSelectedMetric(metricType);
    setFormData({});
    setCurrentPage(1);
  };

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const getDiabetesValue = (status) => {
    switch (status) {
      case 'Non-Diabetic':
        return 'non-diabetic';
      case 'Prediabetic':
        return 'prediabetic';
      case 'Type 1':
        return 'type1';
      case 'Type 2':
        return 'type2';
      default:
        return 'non-diabetic';
    }
  };

  const getTrendValue = (trend) => {
    switch (trend) {
      case 'Improving':
        return 'improving';
      case 'Stable':
        return 'stable';
      case 'Worsening':
        return 'worsening';
      default:
        return 'stable';
    }
  };

  const getContextValue = (context) => {
    switch (context) {
      case 'Fasting':
        return 'fasting';
      case 'Post-Meal':
        return 'post-meal';
      case 'Random':
        return 'random';
      default:
        return 'random';
    }
  };

  const getActivityValue = (activity) => {
    switch (activity) {
      case 'Active':
        return 'active';
      case 'Sometimes':
        return 'sometimes';
      case 'Never':
        return 'never';
      default:
        return 'sometimes';
    }
  };

  const getMealValue = (meal) => {
    switch (meal) {
      case 'Low-Carb':
        return 'low-carb';
      case 'Balanced':
        return 'balanced';
      case 'High-Carb':
        return 'high-carb';
      default:
        return 'balanced';
    }
  };

  const getMedicationValue = (medication) => {
    switch (medication) {
      case 'None':
        return 'none';
      case 'Oral':
        return 'oral';
      case 'Insulin':
        return 'insulin';
      default:
        return 'none';
    }
  };

  const getSymptomValue = (symptom) => {
    switch (symptom) {
      case 'Low Sugar':
      case 'High Sugar':
        return 'mild';
      case 'Both Low and High Sugar':
        return 'severe';
      case 'None of them':
      default:
        return 'none';
    }
  };

  const handleSave = async () => {
    if (!selectedMetric || !currentConfig) return;
    
    const requiredFields = currentConfig.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !formData[field.name]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (selectedMetric === 'Blood Glucose') {
      try {
        const token = localStorage.getItem('token');
        const riskData = {
          glucose_value: parseFloat(formData.glucose_value),
          measurement_context: getContextValue(formData.measurement_context),
          trend: getTrendValue(formData.trend),
          symptoms: getSymptomValue(formData.symptoms),
          medication_type: getMedicationValue(formData.medication_type),
          meal_type: getMealValue(formData.meal_type),
          physical_activity: getActivityValue(formData.physical_activity),
          diabetes_status: getDiabetesValue(formData.diabetes_status),
          age: parseInt(formData.age),
          weight_kg: parseFloat(formData.weight_kg),
          height_cm: parseFloat(formData.height_cm),
          family_history: formData.family_history === 'Yes'
        };

        const response = await fetch('http://localhost:8000/metrics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(riskData)
        });

        if (response.ok) {
          navigate('/assessments');
          return;
        } else {
          console.error('Failed to calculate risk');
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    }

    // Fallback for other metric types
    let finalValue = formData.glucose_value || formData.value || formData.systolic;
    if (selectedMetric === 'Blood Pressure') {
      finalValue = `${formData.systolic}/${formData.diastolic}`;
    }
    
    const metric = {
      id: Date.now(),
      type: selectedMetric,
      value: finalValue,
      unit: currentConfig.unit,
      date: new Date().toLocaleDateString(),
      details: formData
    };
    
    onAddMetric(metric, navigate);
  };

  const renderField = (field) => {
    const fieldStyle = {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
      minHeight: '44px'
    };

    const labelStyle = {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '500',
      color: '#333'
    };

    return (
      <div key={field.name} style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          {field.label}
          {field.required && <span style={{ color: '#e53e3e' }}> *</span>}
        </label>
        
        {field.type === 'select' ? (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            style={fieldStyle}
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            style={fieldStyle}
            required={field.required}
          />
        )}
      </div>
    );
  };

  if (!selectedMetric) {
    return (
      <div style={{
        backgroundColor: '#F5F7FA',
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 20px'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <button
            onClick={() => navigate('/health-metrics')}
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
            ← Back to Health Metrics
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
              Select Metric Type
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 32px 0'
            }}>
              Choose the type of health metric you want to record
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {Object.keys(metricConfigs).map(metricType => (
                <button
                  key={metricType}
                  onClick={() => handleMetricSelect(metricType)}
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    border: '2px solid #1E88E5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f0f8ff'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
                >
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1E88E5',
                    marginBottom: '8px'
                  }}>
                    {metricType}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#666',
                    marginBottom: '8px'
                  }}>
                    Unit: {metricConfigs[metricType].unit}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#999'
                  }}>
                    {metricConfigs[metricType].fields.length} fields to fill
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <button
          onClick={() => setSelectedMetric('')}
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
          ← Back to Metric Selection
        </button>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0'
            }}>
              Add {selectedMetric}
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: '0 0 16px 0'
            }}>
              Page {currentPage} of {totalPages}
            </p>
            
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#e0e0e0',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(currentPage / totalPages) * 100}%`,
                height: '100%',
                backgroundColor: '#1E88E5',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            {currentFields.map(renderField)}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '12px 24px',
                backgroundColor: currentPage === 1 ? '#f5f5f5' : 'transparent',
                color: currentPage === 1 ? '#ccc' : '#1E88E5',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>

            <span style={{ fontSize: '14px', color: '#666' }}>
              {currentPage} / {totalPages}
            </span>

            {currentPage < totalPages ? (
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1E88E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Save Metric
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMetric;