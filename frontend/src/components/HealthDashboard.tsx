import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { metricsAPI, healthAPI } from '../services/api';
import '../styles/HealthDashboard.css';

const HealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState({
    overallRisk: 78,
    riskLevel: 'Low Risk',
    bloodPressure: { systolic: 118, diastolic: 76, status: 'Normal' },
    glucose: { value: 102, status: 'Stable', unit: 'mg/dL', avg: undefined },
    heartRate: { value: 78, status: 'Monitor', unit: 'bpm', avg: undefined },
    glucoseTrend: [95, 98, 102, 99, 105, 101, 102]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const userId = user?.id || 1;
      const response = await metricsAPI.getUserMetrics(userId);
      const metrics = response.data || [];

      // Separate diabetes and cardiac metrics
      const diabetesMetrics = metrics.filter((m: any) => m.disease_type === 'diabetes') || [];
      const cardiacMetrics = metrics.filter((m: any) => m.disease_type === 'cardiac') || [];

      

      // Helper: sort by created_at descending
      const sortByDateDesc = (arr: any[]) => arr.slice().sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      const latestDiabetes = sortByDateDesc(diabetesMetrics)[0];
      const latestCardiac = sortByDateDesc(cardiacMetrics)[0];

      // Build glucose trend from last 7 diabetes entries (oldest -> newest), sanitize values
      const glucoseTrend = sortByDateDesc(diabetesMetrics).slice(0,7).reverse().map((m: any) => Number(m.glucose_value)).filter((v: any) => Number.isFinite(v));

      // parseBP helper and compute BP averages/latest
      const parseBP = (bpStr: any) => {
        if (!bpStr || typeof bpStr !== 'string') return null;
        const parts = bpStr.split('/').map(p => parseInt(p, 10));
        if (parts.length >= 2 && parts.every(n => Number.isFinite(n))) return { systolic: parts[0], diastolic: parts[1] };
        return null;
      };

      const cardiacBPs = cardiacMetrics.map((m: any) => parseBP(m.blood_pressure)).filter(Boolean) as any[];
      const avgSystolic = cardiacBPs.length ? Math.round(cardiacBPs.reduce((a,b) => a + b.systolic, 0) / cardiacBPs.length) : null;
      const avgDiastolic = cardiacBPs.length ? Math.round(cardiacBPs.reduce((a,b) => a + b.diastolic, 0) / cardiacBPs.length) : null;
      const latestBPParsed = latestCardiac ? parseBP(latestCardiac.blood_pressure) : null;

      // Aggregate heart rate and glucose across all metrics
      const allHeartRates = metrics.map((m: any) => Number(m.heart_rate)).filter((v: any) => Number.isFinite(v));
      const heartRateAvg = allHeartRates.length ? Math.round(allHeartRates.reduce((a: number,b: number) => a + b, 0) / allHeartRates.length) : null;
      const latestWithHeartRate = sortByDateDesc(metrics).find((m: any) => m.heart_rate !== undefined && m.heart_rate !== null);
      const latestHeartRate = latestWithHeartRate ? Number(latestWithHeartRate.heart_rate) : (allHeartRates.length ? allHeartRates[0] : null);

      const diabetesGlucoseValues = diabetesMetrics.map((m: any) => Number(m.glucose_value)).filter((v: any) => Number.isFinite(v));
      const glucoseAvg = diabetesGlucoseValues.length ? Math.round(diabetesGlucoseValues.reduce((a: number,b: number) => a + b, 0) / diabetesGlucoseValues.length) : null;
      const latestGlucose = latestDiabetes ? Number(latestDiabetes.glucose_value) : (diabetesGlucoseValues.length ? diabetesGlucoseValues[0] : null);

      // Extract BP and Heart Rate from latest cardiac metric if available (fallback to averages)
      const bp = latestBPParsed ? {
        systolic: latestBPParsed.systolic || avgSystolic || 0,
        diastolic: latestBPParsed.diastolic || avgDiastolic || 0,
        status: latestBPParsed ? (latestBPParsed.systolic < 130 ? 'Normal' : 'High') : (avgSystolic ? (avgSystolic < 130 ? 'Normal' : 'High') : 'Unknown')
      } : (avgSystolic ? { systolic: avgSystolic, diastolic: avgDiastolic || 0, status: avgSystolic < 130 ? 'Normal' : 'High' } : null);

      const heartRate = latestHeartRate ? { value: latestHeartRate, avg: heartRateAvg, status: latestHeartRate > 100 ? 'Monitor' : 'Normal', unit: 'bpm' } : (heartRateAvg ? { value: heartRateAvg, avg: heartRateAvg, status: heartRateAvg > 100 ? 'Monitor' : 'Normal', unit: 'bpm' } : null);

      const glucose = latestGlucose ? { value: latestGlucose, avg: glucoseAvg, status: latestDiabetes && latestDiabetes.diabetes_status ? (latestDiabetes.diabetes_status === 'non-diabetic' ? 'Stable' : latestDiabetes.diabetes_status) : 'Stable', unit: latestDiabetes?.unit || 'mg/dL' } : (glucoseAvg ? { value: glucoseAvg, avg: glucoseAvg, status: 'Unknown', unit: 'mg/dL' } : null);

      // Deterministic overall risk calc (simple heuristic based on latest metrics)
      const computeRiskFromMetrics = () => {
        const components: number[] = [];

        if (glucose && typeof glucose.value === 'number') {
          const g = glucose.value;
          if (g <= 100) components.push(20);
          else if (g <= 126) components.push(40);
          else if (g <= 200) components.push(70);
          else components.push(90);
        }

        if (bp && bp.systolic && bp.diastolic) {
          const s = bp.systolic;
          const d = bp.diastolic;
          if (s < 120 && d < 80) components.push(20);
          else if (s < 130) components.push(40);
          else if (s < 140) components.push(60);
          else components.push(80);
        }

        if (heartRate && typeof heartRate.value === 'number') {
          const hr = heartRate.value;
          if (hr >= 60 && hr <= 100) components.push(30);
          else if (hr > 100) components.push(70);
          else components.push(40);
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
        bloodPressure: {
          systolic: bp?.systolic || 0,
          diastolic: bp?.diastolic || 0,
          status: bp?.systolic ? (bp.systolic < 130 ? 'Normal' : 'High') : 'Unknown'
        },
        glucose: glucose ? { value: glucose.value, avg: (glucose as any).avg ?? null, status: glucose.status, unit: glucose.unit } : { value: 0, avg: null, status: 'Unknown', unit: 'mg/dL' },
        heartRate: heartRate ? { value: heartRate.value, avg: (heartRate as any).avg ?? null, status: heartRate.status, unit: heartRate.unit } : { value: 0, avg: null, status: 'Unknown', unit: 'bpm' },
        glucoseTrend: glucoseTrend.length ? glucoseTrend : [0]
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
    if (l === 'low risk') return 'Your health metrics are looking good. Keep up the great work!';
    if (l === 'moderate risk') return 'Some metrics need attention — consider following the recommended actions.';
    if (l === 'high risk') return 'Multiple metrics are outside target ranges. Please consult your clinician.';
    if (l === 'critical') return 'Critical values detected — seek immediate medical attention.';
    return 'No sufficient data to compute risk.';
  };

  const CircularProgress = ({ score, label }: { score: number; label: string }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="circular-progress">
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
        <div className="progress-content">
          <div className="progress-score">{score}</div>
          <div className="progress-label">{label}</div>
        </div>
      </div>
    );
  };

  const LineChart = ({ data }: { data: number[] }) => {
    const cleanData = (data || []).map(Number).filter(Number.isFinite);
    if (cleanData.length === 0) {
      return (
        <div className="chart-placeholder" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
          No trend data available
        </div>
      );
    }

    const maxValue = Math.max(...cleanData);
    const minValue = Math.min(...cleanData);
    const range = maxValue - minValue || 1;
    const denom = Math.max(1, cleanData.length - 1);
    
    const points = cleanData.map((value, index) => {
      const x = (index / denom) * 280;
      const y = 80 - ((value - minValue) / range) * 60;
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="chart-container">
        <svg width="300" height="100" className="line-chart">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1="0" y1="20" x2="280" y2="20" stroke="#E5F3F0" strokeWidth="1"/>
          <line x1="0" y1="40" x2="280" y2="40" stroke="#E5F3F0" strokeWidth="1"/>
          <line x1="0" y1="60" x2="280" y2="60" stroke="#E5F3F0" strokeWidth="1"/>
          <line x1="0" y1="80" x2="280" y2="80" stroke="#E5F3F0" strokeWidth="1"/>
          
          {/* Area under curve */}
          <polygon
            points={`0,80 ${points} 280,80`}
            fill="url(#chartGradient)"
          />
          
          {/* Line */}
          <polyline
            points={points}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {cleanData.map((value, index) => {
            const x = (index / denom) * 280;
            const y = 80 - ((value - minValue) / range) * 60;
            return (
              <circle
                key={index}
                cx={String(x)}
                cy={String(y)}
                r="4"
                fill="#10B981"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        <div className="chart-labels">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your health dashboard...</p>
      </div>
    );
  }

  return (
    <div className="health-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="dashboard-title1">Health Dashboard</h1>
            <p className="dashboard-subtitle">Track and manage your chronic condition</p>
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
            <h2 className="risk-title">Overall Health Risk Score</h2>
            <p className="risk-message">{riskMessageForLevel(healthData.riskLevel)}</p>

            <div className="status-pills">
              <div className={statusToPillClass(healthData.bloodPressure.status)}>
                <span className="status-dot"></span>
                {`Blood Pressure ${healthData.bloodPressure.status}`}
              </div>
              <div className={statusToPillClass(healthData.glucose.status)}>
                <span className="status-dot"></span>
                {`Glucose ${healthData.glucose.status}`}
              </div>
              <div className={statusToPillClass(healthData.heartRate.status)}>
                <span className="status-dot"></span>
                {`Heart Rate ${healthData.heartRate.status}`}
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
            <div className="metric-icon heart-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className={statusToTrendClass(healthData.bloodPressure.status)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 12V4M4 8l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="metric-value">
            {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
            <span className="metric-unit">mmHg</span>
          </div>
          <div className="metric-label">Blood Pressure</div>
          <div className="metric-status" style={{ color: getStatusColor(healthData.bloodPressure.status) }}>
            {healthData.bloodPressure.status}
          </div>
        </div>

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
                <div className="metric-subtext">Avg: {healthData.glucose.avg} {healthData.glucose.unit}</div>
              ) : null}
          </div>
          <div className="metric-label">Blood Glucose</div>
          <div className="metric-status" style={{ color: getStatusColor(healthData.glucose.status) }}>
            {healthData.glucose.status}
          </div>
        </div>

        <div className="metric-card metric-card-highlight">
          <div className="metric-header">
            <div className="metric-icon pulse-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={statusToTrendClass(healthData.heartRate.status)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 4v4M4 12l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="metric-value">
            {healthData.heartRate.value}
            <span className="metric-unit">{healthData.heartRate.unit}</span>
            {healthData.heartRate.avg ? (
              <div className="metric-subtext">Avg: {healthData.heartRate.avg} {healthData.heartRate.unit}</div>
            ) : null}
          </div>
          <div className="metric-label">Heart Rate</div>
          <div className="metric-status" style={{ color: getStatusColor(healthData.heartRate.status) }}>
            {healthData.heartRate.status}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">7-Day Glucose Trend</h3>
          <div className="chart-info">
            <span className="chart-range">85-110 mg/dL</span>
          </div>
        </div>
        <LineChart data={healthData.glucoseTrend} />
      </div>
    </div>
  );
};

export default HealthDashboard;