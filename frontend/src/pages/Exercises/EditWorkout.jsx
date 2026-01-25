import React, { useState } from 'react';
import { chronicWorkouts } from '../../data/chronicWorkouts';

const EditWorkout = ({ onNavigate, userProfile }) => {
  const getRecommendedProgram = () => {
    const condition = userProfile?.healthCondition;
    if (condition === 'diabetes') return 'diabetes';
    if (condition === 'cardiac') return 'cardiac';
    return 'diabetes';
  };

  const program = chronicWorkouts[getRecommendedProgram()];
  const [exercises, setExercises] = useState([...program.days[0].exercises]);

  const updateDuration = (id, change) => {
    setExercises(prev => prev.map(ex => 
      ex.id === id 
        ? { ...ex, duration: Math.max(15, Math.min(60, ex.duration + change)) }
        : ex
    ));
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
                if (tab === 'Dashboard') onNavigate('dashboard');
                else if (tab === 'Health Metrics') onNavigate('healthMetrics');
                else if (tab === 'Assessments') onNavigate('assessments');
                else if (tab === 'Exercises') onNavigate('exercises');
                else if (tab === 'Assistant') onNavigate('assistant');
                else if (tab === 'Settings') onNavigate('settings');
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
          marginBottom: '32px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            margin: '0 0 8px 0'
          }}>
            Edit Workout Plan
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: 0
          }}>
            Customize your exercise duration to match your comfort level
          </p>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          {exercises.map((exercise, index) => (
            <div key={exercise.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '20px',
              borderRadius: '12px',
              backgroundColor: index % 2 === 0 ? '#F5F7FA' : 'white',
              marginBottom: '12px',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#66BB6A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'white',
                fontWeight: '600'
              }}>
                {index + 1}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#333',
                  margin: 0
                }}>
                  {exercise.name}
                </h3>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <button
                  onClick={() => updateDuration(exercise.id, -5)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid #1E88E5',
                    backgroundColor: 'white',
                    color: '#1E88E5',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  -
                </button>
                
                <span style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#333',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {exercise.duration}s
                </span>
                
                <button
                  onClick={() => updateDuration(exercise.id, 5)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid #1E88E5',
                    backgroundColor: 'white',
                    color: '#1E88E5',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center'
        }}>
          <button
            onClick={() => onNavigate('exercises')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: '#666',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onNavigate('exercises')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#66BB6A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkout;