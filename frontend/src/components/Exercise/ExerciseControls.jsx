import React from 'react';

const ExerciseControls = ({ onPause, onNext, onPrevious, isPaused, canGoPrevious, canGoNext }) => {
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '24px'
    }}>
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: canGoPrevious ? '#26A69A' : '#e0e0e0',
          color: canGoPrevious ? 'white' : '#999',
          fontSize: '18px',
          cursor: canGoPrevious ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        ⏮
      </button>
      
      <button
        onClick={onPause}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#1E88E5',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 12px rgba(30, 136, 229, 0.3)'
        }}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
      
      <button
        onClick={onNext}
        disabled={!canGoNext}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: canGoNext ? '#26A69A' : '#e0e0e0',
          color: canGoNext ? 'white' : '#999',
          fontSize: '18px',
          cursor: canGoNext ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        ⏭
      </button>
    </div>
  );
};

export default ExerciseControls;