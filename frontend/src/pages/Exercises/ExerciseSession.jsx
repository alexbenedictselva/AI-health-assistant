import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CoachAnimation from '../../components/Exercise/CoachAnimation';
import ExerciseTimer from '../../components/Exercise/ExerciseTimer';
import ExerciseControls from '../../components/Exercise/ExerciseControls';
import GuidanceMessage from '../../components/Exercise/GuidanceMessage';
import { getGuidanceMessage } from '../../data/chronicWorkouts';

const ExerciseSession = ({ currentWorkout, userProfile, onCompleteExercise }) => {
  const navigate = useNavigate();
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!currentWorkout) {
    return <div>Loading...</div>;
  }

  const exercises = currentWorkout.exercises;
  const exercise = exercises[currentIndex];
  const condition = userProfile?.healthCondition || 'general';

  const handleTimerComplete = () => {
    onCompleteExercise(exercise);
    
    if (currentIndex < exercises.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      navigate('/exercise-ready');
    } else {
      navigate('/exercise-complete');
    }
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      navigate('/exercise-ready');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      navigate('/exercise-ready');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {/* Close button */}
      <button
        onClick={() => navigate('/exercises')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ✕
      </button>

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        fontSize: '14px',
        color: '#666',
        backgroundColor: '#F5F7FA',
        padding: '8px 16px',
        borderRadius: '20px'
      }}>
        {currentIndex + 1} of {exercises.length}
      </div>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '600px',
        width: '100%'
      }}>
        <CoachAnimation 
          pose={exercise.pose} 
          isActive={!isPaused}
        />
        
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          color: '#333',
          margin: '0',
          lineHeight: '1.2'
        }}>
          {exercise.name}
        </h1>
        
        <GuidanceMessage 
          message={getGuidanceMessage(condition, exercise.name)}
          condition={condition}
        />

        <ExerciseTimer
          duration={exercise.duration}
          onComplete={handleTimerComplete}
          isActive={true}
          isPaused={isPaused}
        />

        <ExerciseControls
          onPause={() => setIsPaused(!isPaused)}
          onNext={handleNext}
          onPrevious={handlePrevious}
          isPaused={isPaused}
          canGoPrevious={currentIndex > 0}
          canGoNext={currentIndex < exercises.length - 1}
        />
      </div>

      {/* Breathing reminder */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '14px',
        color: '#66BB6A',
        fontWeight: '500'
      }}>
        Remember to breathe deeply and move slowly
      </div>
    </div>
  );
};

export default ExerciseSession;