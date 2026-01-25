import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { chronicWorkouts } from '../../data/chronicWorkouts';
import CoachAnimation from '../../components/Exercise/CoachAnimation';

const ExercisesHome = ({ onStartWorkout, userProfile }) => {
  const navigate = useNavigate();
  const [isRoutineActive, setIsRoutineActive] = useState(false);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(-1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [completedExercises, setCompletedExercises] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);

  const getRecommendedProgram = () => {
    const condition = userProfile?.healthCondition;
    if (condition === 'diabetes') return 'diabetes';
    if (condition === 'cardiac') return 'cardiac';
    return 'diabetes';
  };

  const program = chronicWorkouts[getRecommendedProgram()];
  const currentDay = program.days[0];
  const totalDuration = currentDay.exercises.reduce((sum, ex) => sum + ex.duration, 0);

  useEffect(() => {
    if (!isRoutineActive || isPaused || activeExerciseIndex === -1) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Exercise completed
          setCompletedExercises(prev => new Set([...prev, activeExerciseIndex]));
          
          if (activeExerciseIndex < currentDay.exercises.length - 1) {
            // Move to next exercise
            const nextIndex = activeExerciseIndex + 1;
            setActiveExerciseIndex(nextIndex);
            return currentDay.exercises[nextIndex].duration;
          } else {
            // Routine completed
            setIsRoutineActive(false);
            setActiveExerciseIndex(-1);
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRoutineActive, isPaused, activeExerciseIndex, currentDay.exercises]);

  const startFullRoutine = () => {
    setIsRoutineActive(true);
    setActiveExerciseIndex(0);
    setTimeRemaining(currentDay.exercises[0].duration);
    setCompletedExercises(new Set());
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleSkip = () => {
    if (activeExerciseIndex < currentDay.exercises.length - 1) {
      const nextIndex = activeExerciseIndex + 1;
      setActiveExerciseIndex(nextIndex);
      setTimeRemaining(currentDay.exercises[nextIndex].duration);
      setCompletedExercises(prev => new Set([...prev, activeExerciseIndex]));
    }
  };

  const handleStartExercise = (exercise) => {
    if (isRoutineActive) return; // Disable individual starts during routine
    onStartWorkout({
      program: getRecommendedProgram(),
      day: currentDay,
      exercise,
      exercises: currentDay.exercises
    });
    navigate('/exercise-ready');
  };

  const getExerciseState = (index) => {
    if (completedExercises.has(index)) return 'completed';
    if (index === activeExerciseIndex) return 'active';
    return 'pending';
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
                else if (tab === 'Assistant') navigate('/assistant');
                else if (tab === 'Settings') navigate('/settings');
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: tab === 'Exercises' ? '#1E88E5' : '#666',
                cursor: 'pointer',
                borderBottom: tab === 'Exercises' ? '2px solid #1E88E5' : 'none',
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
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 8px 0'
          }}>
            {program.title}
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: '0 0 24px 0'
          }}>
            {program.description}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          marginBottom: '24px'
        }}>
          {/* Exercise List */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                margin: 0
              }}>
                Day {currentDay.day} - {currentDay.title}
              </h2>
              <div style={{
                fontSize: '14px',
                color: '#666',
                backgroundColor: '#F5F7FA',
                padding: '6px 12px',
                borderRadius: '20px'
              }}>
                {currentDay.exercises.length} exercises • {Math.round(totalDuration / 60)} min
              </div>
            </div>

            {currentDay.exercises.map((exercise, index) => {
              const state = getExerciseState(index);
              return (
                <div key={exercise.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: state === 'active' ? '#E3F2FD' : index % 2 === 0 ? '#F5F7FA' : 'white',
                  marginBottom: '8px',
                  border: state === 'active' ? '2px solid #1E88E5' : '1px solid #e0e0e0',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: state === 'completed' ? '#66BB6A' : state === 'active' ? '#1E88E5' : '#66BB6A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white',
                    fontWeight: '600'
                  }}>
                    {state === 'completed' ? '✓' : index + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#333',
                      margin: '0 0 4px 0'
                    }}>
                      {exercise.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#666',
                      margin: 0
                    }}>
                      {state === 'active' ? `${timeRemaining}s remaining` : `${exercise.duration} seconds`}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleStartExercise(exercise)}
                    disabled={isRoutineActive}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: isRoutineActive ? '#ccc' : '#1E88E5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isRoutineActive ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {state === 'completed' ? 'Done' : state === 'active' ? 'Active' : 'Start'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Animation Panel */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            {isRoutineActive && activeExerciseIndex >= 0 ? (
              <>
                <CoachAnimation 
                  pose={currentDay.exercises[activeExerciseIndex].pose}
                  isActive={!isPaused}
                />
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  margin: '16px 0 8px 0',
                  textAlign: 'center'
                }}>
                  {currentDay.exercises[activeExerciseIndex].name}
                </h3>
                <div style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#1E88E5',
                  marginBottom: '16px'
                }}>
                  {timeRemaining}s
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px'
                }}>
                  <button
                    onClick={handlePause}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#26A69A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    onClick={handleSkip}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#FB8C00',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Skip
                  </button>
                </div>
              </>
            ) : completedExercises.size === currentDay.exercises.length && !isRoutineActive ? (
              <>
                <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#66BB6A',
                  margin: '0 0 8px 0'
                }}>
                  Routine Complete!
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  textAlign: 'center',
                  marginBottom: '20px'
                }}>
                  Total time: {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => {
                      setCompletedExercises(new Set());
                      setActiveExerciseIndex(-1);
                    }}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#66BB6A',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Done
                  </button>
                  <button
                    onClick={startFullRoutine}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: '#1E88E5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Restart Routine
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '60px', marginBottom: '16px' }}>🧘‍♀️</div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  textAlign: 'center',
                  marginBottom: '8px'
                }}>
                  Ready to Exercise?
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  textAlign: 'center'
                }}>
                  Click "Start Full Routine" to begin
                </p>
              </>
            )}
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <button
            onClick={startFullRoutine}
            disabled={isRoutineActive}
            style={{
              padding: '16px 32px',
              backgroundColor: isRoutineActive ? '#ccc' : '#66BB6A',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: isRoutineActive ? 'not-allowed' : 'pointer',
              boxShadow: isRoutineActive ? 'none' : '0 4px 12px rgba(102, 187, 106, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            {isRoutineActive ? 'Routine in Progress...' : 'Start Full Routine'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExercisesHome;