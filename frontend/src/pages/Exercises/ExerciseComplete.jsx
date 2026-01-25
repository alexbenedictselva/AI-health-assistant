import React from 'react';
import { useNavigate } from 'react-router-dom';

const ExerciseComplete = ({ completedExercises, currentWorkout }) => {
  const navigate = useNavigate();
  const totalDuration = completedExercises?.reduce((sum, ex) => sum + ex.duration, 0) || 0;
  const exerciseCount = completedExercises?.length || 0;

  return (
    <div style={{
      backgroundColor: '#F5F7FA',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '60px 40px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          fontSize: '80px',
          marginBottom: '24px',
          animation: 'celebrate 2s infinite'
        }}>
          🌿
        </div>
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#66BB6A',
          margin: '0 0 16px 0'
        }}>
          Great start! Results will follow.
        </h1>
        
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 32px 0',
          lineHeight: '1.5'
        }}>
          You've completed your gentle exercise routine. Your body and mind will thank you.
        </p>
        
        <div style={{
          backgroundColor: '#F5F7FA',
          borderRadius: '16px',
          padding: '24px',
          margin: '24px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#1E88E5'
            }}>
              {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '4px'
            }}>
              Total Time
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#1E88E5'
            }}>
              {exerciseCount}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginTop: '4px'
            }}>
              Exercises
            </div>
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '32px'
        }}>
          <button
            onClick={() => navigate('/exercises')}
            style={{
              padding: '16px 24px',
              backgroundColor: '#66BB6A',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Continue
          </button>
          
          <button
            onClick={() => navigate('/exercise-ready')}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              color: '#1E88E5',
              border: '2px solid #1E88E5',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Restart this exercise
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '16px 24px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              borderRadius: '12px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Do it later
          </button>
        </div>
      </div>
      
      <style>
        {`
          @keyframes celebrate {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-5deg) scale(1.05); }
            75% { transform: rotate(5deg) scale(1.05); }
          }
        `}
      </style>
    </div>
  );
};

export default ExerciseComplete;