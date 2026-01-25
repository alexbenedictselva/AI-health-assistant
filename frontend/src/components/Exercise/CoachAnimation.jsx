import React from 'react';

const CoachAnimation = ({ pose, isActive }) => {
  const getCoachStyle = () => {
    const baseStyle = {
      width: '200px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '120px',
      transition: 'all 0.5s ease',
      filter: isActive ? 'none' : 'grayscale(50%)'
    };

    const animations = {
      'breathing': 'breathe 3s infinite ease-in-out',
      'neck-roll': 'neckRoll 4s infinite ease-in-out',
      'shoulder-squeeze': 'shoulderSqueeze 2s infinite ease-in-out',
      'spinal-twist': 'spinalTwist 3s infinite ease-in-out',
      'ankle-circles': 'ankleCircles 2s infinite linear',
      'forward-fold': 'forwardFold 4s infinite ease-in-out',
      'arm-circles': 'armCircles 3s infinite linear',
      'chest-opening': 'chestOpening 3s infinite ease-in-out',
      'cat-cow': 'catCow 3s infinite ease-in-out',
      'side-bend': 'sideBend 4s infinite ease-in-out',
      'relaxation': 'relaxation 5s infinite ease-in-out'
    };

    return {
      ...baseStyle,
      animation: isActive ? animations[pose] || 'breathe 3s infinite ease-in-out' : 'none'
    };
  };

  const getCoachEmoji = () => {
    const poses = {
      'breathing': '🧘‍♀️',
      'neck-roll': '🤸‍♀️',
      'shoulder-squeeze': '💪',
      'spinal-twist': '🌀',
      'ankle-circles': '🦵',
      'forward-fold': '🙇‍♀️',
      'arm-circles': '🤸‍♀️',
      'chest-opening': '🤗',
      'cat-cow': '🐱',
      'side-bend': '🤸‍♀️',
      'relaxation': '😌'
    };
    return poses[pose] || '🧘‍♀️';
  };

  return (
    <div style={getCoachStyle()}>
      {getCoachEmoji()}
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes neckRoll {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            75% { transform: rotate(-10deg); }
          }
          @keyframes shoulderSqueeze {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(0.9); }
          }
          @keyframes spinalTwist {
            0%, 100% { transform: rotate(0deg); }
            50% { transform: rotate(15deg); }
          }
          @keyframes ankleCircles {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes forwardFold {
            0%, 100% { transform: rotateX(0deg); }
            50% { transform: rotateX(20deg); }
          }
          @keyframes armCircles {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes chestOpening {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1) rotateY(10deg); }
          }
          @keyframes catCow {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(0.9); }
          }
          @keyframes sideBend {
            0%, 100% { transform: skew(0deg); }
            25% { transform: skew(5deg); }
            75% { transform: skew(-5deg); }
          }
          @keyframes relaxation {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

export default CoachAnimation;