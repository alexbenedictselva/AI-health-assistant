import React, { useState, useEffect } from 'react';

const ExerciseTimer = ({ duration, onComplete, isActive, isPaused }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isPaused, onComplete]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = ((duration - timeLeft) / duration) * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{ position: 'relative' }}>
        <svg width="140" height="140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#F5F7FA"
            strokeWidth="6"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#66BB6A"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            transform="rotate(-90 70 70)"
            style={{ 
              transition: 'stroke-dashoffset 1s linear',
              strokeLinecap: 'round'
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '24px',
          fontWeight: '600',
          color: '#333'
        }}>
          {timeLeft}s
        </div>
      </div>
    </div>
  );
};

export default ExerciseTimer;