import React from 'react';

interface Props {
  score: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
}

const RiskRing: React.FC<Props> = ({ score, size = 200, stroke = 16, label }) => {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  // color mapping
  const getColor = () => {
    if (normalized <= 25) return '#16a34a'; // green
    if (normalized <= 50) return '#b45309'; // amber
    if (normalized <= 75) return '#b91c1c'; // red
    return '#7f1d1d'; // critical
  };

  return (
    <div style={{ width: size, height: size, display: 'inline-block', position: 'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="rg" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#C8E6C9" />
            <stop offset="100%" stopColor="#7FD3C3" />
          </linearGradient>
        </defs>
        <g transform={`translate(${size/2}, ${size/2})`}>
          <circle r={radius} fill="none" stroke="#eef6ee" strokeWidth={stroke} />
          <circle
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            transform={`rotate(-90)`}
          />
        </g>
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', fontWeight: 700 }}>
        <div style={{ fontSize: '1.5rem', color: getColor() }}>{normalized}</div>
        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{label ?? 'Risk'}</div>
      </div>
    </div>
  );
};

export default RiskRing;
