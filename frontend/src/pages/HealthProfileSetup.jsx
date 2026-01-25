import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HealthProfileSetup = ({ onCompleteProfile }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    age: '',
    gender: '',
    healthCondition: '',
    activityLevel: '',
    dietQuality: '',
    smoking: '',
    sleepQuality: ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onCompleteProfile(profileData, navigate);
  };

  const StepIndicator = () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '30px'
    }}>
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: step <= currentStep ? '#1E88E5' : '#ddd',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: '600'
          }}>
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div style={{
              width: '60px',
              height: '2px',
              backgroundColor: step < currentStep ? '#1E88E5' : '#ddd',
              margin: '0 10px'
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const Step1 = () => (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Age
        </label>
        <input
          type="number"
          value={profileData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          placeholder="Enter your age"
        />
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Gender
        </label>
        {['Male', 'Female', 'Other'].map((option) => (
          <label key={option} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <input
              type="radio"
              name="gender"
              value={option}
              checked={profileData.gender === option}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              style={{ marginRight: '8px' }}
            />
            {option}
          </label>
        ))}
      </div>

      <button
        onClick={nextStep}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#1E88E5',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}
      >
        Next
      </button>
    </div>
  );

  const Step2 = () => (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Health Condition
        </label>
        
        {[
          { value: 'diabetes', title: 'Diabetes', desc: 'Track glucose levels and receive dietary guidance' },
          { value: 'cardiac', title: 'Cardiac Risk', desc: 'Monitor blood pressure and cardiovascular health' }
        ].map((condition) => (
          <div
            key={condition.value}
            onClick={() => handleInputChange('healthCondition', condition.value)}
            style={{
              border: profileData.healthCondition === condition.value ? '2px solid #1E88E5' : '1px solid #ddd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              cursor: 'pointer',
              backgroundColor: profileData.healthCondition === condition.value ? '#f0f8ff' : 'white'
            }}
          >
            <div style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '4px'
            }}>
              {condition.title}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666'
            }}>
              {condition.desc}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={prevStep}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <button
          onClick={nextStep}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#1E88E5',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );

  const Step3 = () => (
    <div>
      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Activity Level
        </label>
        {[
          { value: 'low', label: 'Low – Sedentary' },
          { value: 'medium', label: 'Medium – Moderate exercise' },
          { value: 'high', label: 'High – Very active' }
        ].map((option) => (
          <label key={option.value} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <input
              type="radio"
              name="activityLevel"
              value={option.value}
              checked={profileData.activityLevel === option.value}
              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
              style={{ marginRight: '8px' }}
            />
            {option.label}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Diet Quality
        </label>
        {['Poor', 'Average', 'Healthy'].map((option) => (
          <label key={option} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <input
              type="radio"
              name="dietQuality"
              value={option}
              checked={profileData.dietQuality === option}
              onChange={(e) => handleInputChange('dietQuality', e.target.value)}
              style={{ marginRight: '8px' }}
            />
            {option}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '25px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Do you smoke?
        </label>
        {['Yes', 'No'].map((option) => (
          <label key={option} style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '10px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <input
              type="radio"
              name="smoking"
              value={option}
              checked={profileData.smoking === option}
              onChange={(e) => handleInputChange('smoking', e.target.value)}
              style={{ marginRight: '8px' }}
            />
            {option}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <label style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333'
        }}>
          Sleep Quality (optional)
        </label>
        <input
          type="text"
          value={profileData.sleepQuality}
          onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
          placeholder="Describe your sleep quality"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={prevStep}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          style={{
            flex: 1,
            padding: '12px',
            backgroundColor: '#66BB6A',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Save Profile & Continue
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Step1 />;
    }
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
        maxWidth: '500px'
      }}>
        <StepIndicator />
        
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#1E88E5',
            fontSize: '24px',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            Health Profile Setup
          </h1>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: 0
          }}>
            Help us personalize your health journey
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default HealthProfileSetup;