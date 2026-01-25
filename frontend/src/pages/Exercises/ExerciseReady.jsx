import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CoachAnimation from '../../components/Exercise/CoachAnimation';

const ExerciseReady = ({ currentWorkout }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  // Reset countdown when exercise changes
  useEffect(() => {
    setCountdown(3);
  }, [currentWorkout?.exercise?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/exercise-session');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, currentWorkout?.exercise?.id]);

  if (!currentWorkout || !currentWorkout.exercise) {
    return <div>Loading...</div>;
  }

  // Get current exercise from the workout
  const currentExercise = currentWorkout.exercise;

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
        <CoachAnimation 
          pose={currentExercise.pose} 
          isActive={true}
        />
        
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#66BB6A',
          margin: '24px 0 16px 0'
        }}>
          READY TO GO!
        </h1>
        
        <h2 style={{
          fontSize: '22px',
          fontWeight: '600',
          color: '#333',
          margin: '0 0 32px 0'
        }}>
          {currentExercise.name}
        </h2>
        
        <div style={{
          fontSize: '64px',
          fontWeight: '700',
          color: '#1E88E5',
          animation: 'pulse 1s infinite',
          marginBottom: '16px'
        }}>
          {countdown}
        </div>
        
        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: 0
        }}>
          Get into position...
        </p>
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

export default ExerciseReady;