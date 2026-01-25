import React from 'react';

interface Props {
  title?: string;
  height?: number;
}

const TrendChartPlaceholder: React.FC<Props> = ({ title = 'Trend', height = 120 }) => {
  return (
    <div style={{ background: 'linear-gradient(180deg,#fff,#fbfff9)', borderRadius: 10, padding: '0.75rem', boxShadow: '0 6px 18px rgba(47,111,68,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, color: 'var(--muted-green)' }}>{title}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>Weekly</div>
      </div>
      <div style={{ height, marginTop: '0.75rem', borderRadius: 8, background: 'linear-gradient(90deg,#f6fff6,#ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
        {/* Placeholder for small sparkline or chart */}
        <span>Chart preview</span>
      </div>
    </div>
  );
};

export default TrendChartPlaceholder;
