import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { metricsAPI } from '../services/api';
import { translateTexts } from '../services/translationService';
import '../styles/HealthDashboard.css';

const BASE_TEXTS = {
  healthDashboard: 'Health Dashboard',
  trackCondition: 'Track and manage your chronic condition',
  overallRiskScore: 'Overall Health Risk Score',
  glucose: 'Glucose',
  bloodGlucose: 'Blood Glucose',
  hba1cLevel: 'HbA1c Level',
  bodyMassIndex: 'Body Mass Index',
  glucoseTrend: 'Glucose Trend',
  target: 'Target',
  avg: 'Avg',
  monthAverage: '3-month average',
  normal: 'Normal',
  stable: 'Stable',
  monitor: 'Monitor',
  high: 'High',
  critical: 'Critical',
  unknown: 'Unknown',
  lowRisk: 'Low Risk',
  moderateRisk: 'Moderate Risk',
  highRisk: 'High Risk',
  noData: 'No Data',
  noTrendData: 'No trend data available. Start taking assessments to see your glucose trends.',
  metricsGood: 'Your health metrics are looking good. Keep up the great work!',
  metricsAttention: 'Some metrics need attention — consider following the recommended actions.',
  metricsOutside: 'Multiple metrics are outside target ranges. Please consult your clinician.',
  criticalValues: 'Critical values detected — seek immediate medical attention.',
  noSufficientData: 'No sufficient data to compute risk.',
  underweight: 'Underweight',
  normalWeight: 'Normal Weight',
  overweight: 'Overweight',
  obese: 'Obese',
  prediabetic: 'Prediabetic',
  diabetic: 'Diabetic'
};

const getCurrentLanguage = () => localStorage.getItem('language') || 'en';

const HealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState({
    overallRisk: 0,
    riskLevel: 'No Data',
    glucose: { value: 0, status: 'Unknown', unit: 'mg/dL', avg: undefined },
    hba1c: { value: 0, status: 'Unknown', unit: '%' },
    bmi: { value: 0, status: 'Unknown', category: 'Unknown' },
    glucoseTrend: [] as { glucose: number; date: string; bmi: number | null }[]
  });

  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState(getCurrentLanguage());
  const [texts, setTexts] = useState(BASE_TEXTS);

  useEffect(() => {
    const syncLanguage = () => setLanguage(getCurrentLanguage());
    window.addEventListener('storage', syncLanguage);
    window.addEventListener('language:changed', syncLanguage as EventListener);
    return () => {
      window.removeEventListener('storage', syncLanguage);
      window.removeEventListener('language:changed', syncLanguage as EventListener);
    };
  }, []);

  useEffect(() => {
    if (language === 'en') {
      setTexts(BASE_TEXTS);
      return;
    }

    let mounted = true;
    translateTexts(Object.values(BASE_TEXTS), language).then(translated => {
      if (!mounted) return;
      const keys = Object.keys(BASE_TEXTS) as Array<keyof typeof BASE_TEXTS>;
      const newTexts = {} as typeof BASE_TEXTS;
      keys.forEach((key, i) => { newTexts[key] = translated[i]; });
      setTexts(newTexts);
    });

    return () => {
      mounted = false;
    };
  }, [language]);

  // fetchHealthData is defined inside the component; we intentionally run it once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchHealthData();
  }, []);

  // Listen for metrics updates (dispatched after creating metrics) and refresh dashboard
  // Listen for metrics updates (dispatched after creating metrics) and refresh dashboard
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const onMetricsUpdated = () => {
      fetchHealthData();
    };
    window.addEventListener('metrics:updated', onMetricsUpdated);
    return () => window.removeEventListener('metrics:updated', onMetricsUpdated);
  }, []);

  const fetchHealthData = async () => {
    try {
      const userId = user?.id || 1;
      const response = await metricsAPI.getUserMetrics(userId);
      const metrics = response.data || [];

      // Separate diabetes metrics
      const diabetesMetrics = metrics.filter((m: any) => m.disease_type === 'diabetes') || [];

      

      // Helper: sort by timestamp (ms) if available, otherwise fall back to created_at ISO string
      const sortByDateDesc = (arr: any[]) => arr.slice().sort((a,b) => {
        const aTs = (a && a.timestamp) ? Number(a.timestamp) : (a && a.created_at ? new Date(a.created_at).getTime() : 0);
        const bTs = (b && b.timestamp) ? Number(b.timestamp) : (b && b.created_at ? new Date(b.created_at).getTime() : 0);
        return bTs - aTs;
      });

      const latestDiabetes = sortByDateDesc(diabetesMetrics)[0];

      // Build glucose trend with dates from last 7 diabetes entries
      const trendData = sortByDateDesc(diabetesMetrics).slice(0, 7).reverse().map((m: any) => {
        const bmi = m.weight_kg && m.height_cm ? (m.weight_kg / Math.pow(m.height_cm / 100, 2)).toFixed(1) : null;
        return {
          glucose: Number(m.glucose_value),
          date: m.created_at || m.timestamp,
          bmi: bmi ? Number(bmi) : null
        };
      }).filter((item: any) => Number.isFinite(item.glucose));

      const diabetesGlucoseValues = diabetesMetrics.map((m: any) => Number(m.glucose_value)).filter((v: any) => Number.isFinite(v));
      const glucoseAvg = diabetesGlucoseValues.length ? Math.round(diabetesGlucoseValues.reduce((a: number,b: number) => a + b, 0) / diabetesGlucoseValues.length) : null;
      const latestGlucose = latestDiabetes ? Number(latestDiabetes.glucose_value) : (diabetesGlucoseValues.length ? diabetesGlucoseValues[0] : null);

      // Calculate BMI from latest metrics
      const latestWeight = latestDiabetes?.weight_kg || 70;
      const latestHeight = latestDiabetes?.height_cm || 170;
      const bmiValue = latestWeight / Math.pow(latestHeight / 100, 2);
      const bmiCategory = bmiValue < 18.5 ? 'Underweight' : bmiValue < 25 ? 'Normal Weight' : bmiValue < 30 ? 'Overweight' : 'Obese';
      const bmiStatus = bmiValue < 18.5 ? 'Low' : bmiValue < 25 ? 'Normal' : bmiValue < 30 ? 'Monitor' : 'High';

      // HbA1c estimation (simplified)
      const avgGlucose = glucoseAvg || 100;
      const hba1cValue = ((avgGlucose + 46.7) / 28.7);
      const hba1cStatus = hba1cValue < 5.7 ? 'Normal' : hba1cValue < 6.5 ? 'Prediabetic' : 'Diabetic';

      const glucose = latestGlucose ? { value: latestGlucose, avg: glucoseAvg, status: latestDiabetes && latestDiabetes.diabetes_status ? (latestDiabetes.diabetes_status === 'non-diabetic' ? 'Stable' : latestDiabetes.diabetes_status) : 'Stable', unit: latestDiabetes?.unit || 'mg/dL' } : (glucoseAvg ? { value: glucoseAvg, avg: glucoseAvg, status: 'Unknown', unit: 'mg/dL' } : null);

      // Deterministic overall risk calc
      const computeRiskFromMetrics = () => {
        const components: number[] = [];

        if (glucose && typeof glucose.value === 'number') {
          const g = glucose.value;
          if (g <= 100) components.push(20);
          else if (g <= 126) components.push(40);
          else if (g <= 200) components.push(70);
          else components.push(90);
        }

        if (hba1cValue) {
          if (hba1cValue < 5.7) components.push(20);
          else if (hba1cValue < 6.5) components.push(50);
          else components.push(80);
        }

        if (bmiValue) {
          if (bmiValue >= 18.5 && bmiValue < 25) components.push(20);
          else if (bmiValue < 30) components.push(50);
          else components.push(70);
        }

        if (components.length === 0) return { score: 0, level: 'No Data' };
        const avg = Math.round(components.reduce((a,b) => a+b, 0) / components.length);
        let level = 'Low Risk';
        if (avg <= 25) level = 'Low Risk';
        else if (avg <= 50) level = 'Moderate Risk';
        else if (avg <= 75) level = 'High Risk';
        else level = 'Critical';
        return { score: avg, level };
      };

      const computed = computeRiskFromMetrics();

      setHealthData({
        overallRisk: computed.score,
        riskLevel: computed.level,
        glucose: glucose ? { value: glucose.value, avg: (glucose as any).avg ?? null, status: glucose.status, unit: glucose.unit } : { value: 0, avg: null, status: 'Unknown', unit: 'mg/dL' },
        hba1c: { value: parseFloat(hba1cValue.toFixed(1)), status: hba1cStatus, unit: '%' },
        bmi: { value: parseFloat(bmiValue.toFixed(1)), status: bmiStatus, category: bmiCategory },
        glucoseTrend: trendData
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal':
      case 'stable':
        return '#10B981'; // Green
      case 'monitor':
        return '#F59E0B'; // Yellow
      case 'high':
      case 'critical':
        return '#EF4444'; // Red
      default:
        return '#6B7280'; // Gray
    }
  };

  const statusToPillClass = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'normal' || s === 'stable') return 'status-pill status-normal';
    if (s === 'monitor' || s === 'warning') return 'status-pill status-monitor';
    if (s === 'high' || s === 'critical') return 'status-pill status-monitor';
    return 'status-pill';
  };

  const statusToTrendClass = (status: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'normal' || s === 'stable') return 'metric-trend trend-positive';
    if (s === 'monitor' || s === 'warning') return 'metric-trend trend-warning';
    return 'metric-trend trend-stable';
  };

  const riskMessageForLevel = (level: string) => {
    const l = String(level || '').toLowerCase();
    if (l === 'low risk') return texts.metricsGood;
    if (l === 'moderate risk') return texts.metricsAttention;
    if (l === 'high risk') return texts.metricsOutside;
    if (l === 'critical') return texts.criticalValues;
    return texts.noSufficientData;
  };

  const CircularProgress = ({ score, label }: { score: number; label: string }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="circular-progress" style={{ position: 'relative', width: '120px', height: '120px' }}>
        <svg width="120" height="120" className="progress-ring">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#E5F3F0"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            className="progress-circle"
          />
        </svg>
        <div className="progress-content" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div className="progress-score">{score}</div>
          <div className="progress-label">{label}</div>
        </div>
      </div>
    );
  };

  const LineChart = ({ data }: { data: { glucose: number; date: string; bmi: number | null }[] }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

    if (data.length === 0) {
      return (
        <div className="chart-placeholder">
          {texts.noTrendData}
        </div>
      );
    }

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatFullDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const values = data.map(d => d.glucose);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue || 1;
    const denom = Math.max(1, data.length - 1);
    
    const points = data.map((item, index) => {
      const x = (index / denom) * 1000;
      const y = 300 - ((item.glucose - minValue) / range) * 250;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container" style={{ position: 'relative', padding: '2rem 0' }}>
        <svg width="1050" height="320" className="line-chart" style={{ width: '100%', height: 'auto' }}>
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1="60" x2="1000" y2="60" stroke="#E5F3F0" strokeWidth="2"/>
          <line x1="0" y1="140" x2="1000" y2="140" stroke="#E5F3F0" strokeWidth="2"/>
          <line x1="0" y1="220" x2="1000" y2="220" stroke="#E5F3F0" strokeWidth="2"/>
          <line x1="0" y1="300" x2="1000" y2="300" stroke="#E5F3F0" strokeWidth="2"/>
          
          {/* Area under curve */}
          <polygon
            points={`0,300 ${points} 1000,300`}
            fill="url(#chartGradient)"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#10B981"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / denom) * 1000;
            const y = 300 - ((item.glucose - minValue) / range) * 250;
            return (
              <g key={index}>
                <circle
                  cx={String(x)}
                  cy={String(y)}
                  r="8"
                  fill="#10B981"
                  stroke="#ffffff"
                  strokeWidth="4"
                />
                <circle
                  cx={String(x)}
                  cy={String(y)}
                  r="24"
                  fill="transparent"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>
        
        {/* Tooltip */}
        {hoveredIndex !== null && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -120%)',
            background: 'white',
            padding: '12px',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#0F172A', fontSize: '0.875rem' }}>
              {formatFullDate(data[hoveredIndex].date)}
            </p>
            <p style={{ margin: '4px 0', color: '#0EA5E9', fontWeight: '500', fontSize: '0.875rem' }}>
              🩸 Glucose: {data[hoveredIndex].glucose} mg/dL
            </p>
            {data[hoveredIndex].bmi && (
              <p style={{ margin: '4px 0', color: '#10B981', fontWeight: '500', fontSize: '0.875rem' }}>
                📊 BMI: {data[hoveredIndex].bmi}
              </p>
            )}
          </div>
        )}
        
        <div className="chart-labels" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingLeft: '0', paddingRight: '0' }}>
          {data.map((item, index) => {
            const xPos = (index / denom) * 100;
            return (
              <span key={index} style={{ position: 'absolute', left: `${xPos}%`, transform: 'translateX(-50%)' }}>
                {formatDate(item.date)}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <div className="health-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title1">{texts.healthDashboard}</h1>
            <p className="dashboard-subtitle">{texts.trackCondition}</p>
          </div>
          <div className="user-avatar">
            <div className="avatar-circle">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Risk Score Card */}
      <div className="risk-score-card">
        <div className="risk-content">
          <div className="risk-info">
            <h2 className="risk-title">{texts.overallRiskScore}</h2>
            <p className="risk-message">{riskMessageForLevel(healthData.riskLevel)}</p>

            <div className="status-pills">
              <div className={statusToPillClass(healthData.glucose.status)}>
                <span className="status-dot"></span>
                {`${texts.glucose} ${healthData.glucose.status}`}
              </div>
              <div className={statusToPillClass(healthData.hba1c.status)}>
                <span className="status-dot"></span>
                {`HbA1c ${healthData.hba1c.status}`}
              </div>
              <div className={statusToPillClass(healthData.bmi.status)}>
                <span className="status-dot"></span>
                {`BMI ${healthData.bmi.status}`}
              </div>
            </div>
          </div>
          
          <div className="risk-visual">
            <CircularProgress score={healthData.overallRisk} label={healthData.riskLevel} />
          </div>
        </div>
      </div>

      {/* Metrics Cards Section */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon glucose-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className={statusToTrendClass(healthData.glucose.status)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="metric-value">
            {healthData.glucose.value}
            <span className="metric-unit">{healthData.glucose.unit}</span>
            {healthData.glucose.avg ? (
              <div className="metric-subtext">{texts.avg}: {healthData.glucose.avg} {healthData.glucose.unit}</div>
            ) : null}
          </div>
          <div className="metric-label">{texts.bloodGlucose}</div>
          <div className="metric-status" style={{ color: getStatusColor(healthData.glucose.status) }}>
            {healthData.glucose.status}
          </div>
        </div>

        <div className="metric-card metric-card-highlight">
          <div className="metric-header">
            <div className="metric-icon pulse-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={statusToTrendClass(healthData.hba1c.status)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 4v8M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <div className="metric-value">
            {healthData.hba1c.value}
            <span className="metric-unit">{healthData.hba1c.unit}</span>
            <div className="metric-subtext">{texts.monthAverage}</div>
          </div>
          <div className="metric-label">{texts.hba1cLevel}</div>
          <div className="metric-status" style={{ color: getStatusColor(healthData.hba1c.status) }}>
            {healthData.hba1c.status}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon heart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 20v-6M9 12l3-3 3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className={statusToTrendClass(healthData.bmi.status)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="metric-value">
            {healthData.bmi.value}
            <span className="metric-unit">kg/m²</span>
            <div className="metric-subtext">{healthData.bmi.category}</div>
          </div>
          <div className="metric-label">{texts.bodyMassIndex}</div>
          <div className="metric-status" style={{ color: getStatusColor(healthData.bmi.status) }}>
            {healthData.bmi.status}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">{texts.glucoseTrend}</h3>
          <div className="chart-info">
            <span className="chart-range">{texts.target}: 85-110 mg/dL</span>
          </div>
        </div>
        <LineChart data={healthData.glucoseTrend} />
      </div>
    </div>
  );
};

export default HealthDashboard;
