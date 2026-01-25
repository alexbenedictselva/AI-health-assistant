import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

const DashboardCard: React.FC<Props> = ({ icon, title, description, ctaLabel, ctaLink }) => {
  return (
    <div className="dashboard-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <div className="dashboard-icon">{icon}</div>
        </div>
        <div style={{ flex: 1 }}>
          <h3 className="dashboard-title">{title}</h3>
          {description && <p className="dashboard-description">{description}</p>}
          {ctaLink ? (
            <Link to={ctaLink} className="btn btn-primary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>{ctaLabel ?? 'Open'}</Link>
          ) : ctaLabel ? (
            <button className="btn btn-primary" style={{ marginTop: '0.5rem' }}>{ctaLabel}</button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
