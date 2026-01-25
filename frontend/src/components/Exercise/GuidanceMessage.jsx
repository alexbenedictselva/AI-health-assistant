import React from 'react';

const GuidanceMessage = ({ message, condition }) => {
  const getConditionColor = () => {
    switch (condition) {
      case 'diabetes': return '#1E88E5';
      case 'cardiac': return '#E53935';
      default: return '#26A69A';
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '12px',
      padding: '16px 20px',
      margin: '16px 0',
      textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: `2px solid ${getConditionColor()}`,
      maxWidth: '400px'
    }}>
      <p style={{
        fontSize: '16px',
        color: '#333',
        margin: 0,
        lineHeight: '1.4',
        fontWeight: '500'
      }}>
        {message}
      </p>
    </div>
  );
};

export default GuidanceMessage;