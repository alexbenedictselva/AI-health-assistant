import React from 'react';
import RiskScoreCard from '../components/RiskScoreCard';
import CoachingMessage from '../components/CoachingMessage';

const Dashboard = ({ onNavigate, userProfile, assessmentData, onRunAssessment, healthMetrics, assessmentHistory }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
                if (tab === 'Health Metrics') onNavigate('healthMetrics');
                else if (tab === 'Assessments') onNavigate('assessments');
                else if (tab === 'Exercises') onNavigate('exercises');
                else if (tab === 'Assistant') onNavigate('assistant');
                else if (tab === 'Settings') onNavigate('settings');
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: tab === 'Dashboard' ? '#1E88E5' : '#666',
                cursor: 'pointer',
                borderBottom: tab === 'Dashboard' ? '2px solid #1E88E5' : 'none',
                paddingBottom: '4px'
              }}
            >
              {tab}
            </span>
          ))}
          <button
            onClick={() => onNavigate('login')}
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

  const DashboardHeader = () => (
    <div style={{
      marginBottom: '32px',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '600',
        color: '#333',
        margin: '0 0 8px 0'
      }}>
        {getGreeting()}, {userProfile?.fullName || 'User'} 👋
      </h1>
      <p style={{
        fontSize: '16px',
        color: '#666',
        margin: 0
      }}>
        Here's your health overview for today
      </p>
    </div>
  );

  const RiskScoreSection = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      {assessmentData ? (
        <RiskScoreCard
          riskScore={assessmentData.riskScore}
          riskLevel={assessmentData.riskLevel}
        />
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#333', marginBottom: '12px' }}>No assessment yet</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Complete your first health assessment to see your risk score</p>
          <button
            onClick={onRunAssessment}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Run Assessment
          </button>
        </div>
      )}
    </div>
  );

  const RecommendationSection = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: '#333', marginBottom: '16px' }}>Today's Recommendation</h3>
      {assessmentData ? (
        <CoachingMessage
          message={assessmentData.coachingMessage}
          tone={assessmentData.tone}
        />
      ) : (
        <div>
          <p style={{ color: '#666', marginBottom: '16px' }}>Complete your health assessment to receive personalized recommendations</p>
          <button
            onClick={onRunAssessment}
            style={{
              padding: '10px 20px',
              backgroundColor: '#66BB6A',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Get Started
          </button>
        </div>
      )}
    </div>
  );

  const MetricsSection = () => {
    const getLatestMetric = (type) => {
      if (!healthMetrics || healthMetrics.length === 0) return 'No data';
      const metric = healthMetrics.filter(m => m.type === type).slice(-1)[0];
      return metric ? `${metric.value} ${metric.unit}` : 'No data';
    };

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {[
          { title: 'Latest Glucose', value: getLatestMetric('Blood Glucose'), unit: '(mg/dL)' },
          { title: 'Latest Blood Pressure', value: getLatestMetric('Blood Pressure'), unit: '(mmHg)' },
          { title: 'Latest Activity', value: getLatestMetric('Activity'), unit: '(minutes)' }
        ].map((metric) => (
          <div key={metric.title} style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#666', fontSize: '14px', margin: '0 0 8px 0' }}>{metric.title} {metric.unit}</h4>
            <p style={{ color: '#333', fontSize: '18px', fontWeight: '600', margin: 0 }}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const ProfileSection = () => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ color: '#333', marginBottom: '16px' }}>Profile Summary</h3>
      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '4px 0', color: '#666' }}><strong>Name:</strong> {userProfile?.fullName || 'Not set'}</p>
        <p style={{ margin: '4px 0', color: '#666' }}><strong>Age:</strong> {userProfile?.age || 'Not set'}</p>
        <p style={{ margin: '4px 0', color: '#666' }}><strong>Condition:</strong> {userProfile?.healthCondition || 'Not set'}</p>
        <p style={{ margin: '4px 0', color: '#666' }}><strong>Activity Level:</strong> {userProfile?.activityLevel || 'Not set'}</p>
      </div>
      <button
        onClick={() => onNavigate('settings')}
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
        Edit Profile
      </button>
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
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        <DashboardHeader />
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px'
        }}>
          <div>
            <RiskScoreSection />
            <RecommendationSection />
            <MetricsSection />
          </div>
          
          <div>
            <ProfileSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;