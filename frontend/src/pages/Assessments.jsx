import React from 'react';
import { useNavigate } from 'react-router-dom';

const Assessments = ({ assessmentData, assessmentHistory, onRunNewAssessment }) => {
  const navigate = useNavigate();
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
                else if (tab === 'Exercises') navigate('/exercises');
                else if (tab === 'Assistant') navigate('/assistant');
                else if (tab === 'Settings') navigate('/settings');
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: tab === 'Assessments' ? '#1E88E5' : '#666',
                cursor: 'pointer',
                borderBottom: tab === 'Assessments' ? '2px solid #1E88E5' : 'none',
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

  const SimpleChart = ({ data, title, yAxisLabels }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          border: '2px dashed #ddd',
          borderRadius: '8px'
        }}>
          No assessment data yet
        </div>
      );
    }

    const maxValue = yAxisLabels ? 3 : Math.max(...data.map(d => d.value));
    const chartWidth = 400;
    const chartHeight = 150;
    const padding = 40;

    return (
      <div>
        <svg width={chartWidth + padding * 2} height={chartHeight + padding * 2}>
          {/* Chart area */}
          <rect 
            x={padding} 
            y={padding} 
            width={chartWidth} 
            height={chartHeight} 
            fill="none" 
            stroke="#e0e0e0" 
          />
          
          {/* Y-axis labels */}
          {yAxisLabels ? (
            yAxisLabels.map((label, i) => (
              <text 
                key={i}
                x={padding - 10} 
                y={padding + (chartHeight / (yAxisLabels.length - 1)) * i + 5}
                textAnchor="end" 
                fontSize="12" 
                fill="#666"
              >
                {label}
              </text>
            ))
          ) : (
            [0, maxValue/2, maxValue].map((value, i) => (
              <text 
                key={i}
                x={padding - 10} 
                y={padding + chartHeight - (chartHeight / 2) * i + 5}
                textAnchor="end" 
                fontSize="12" 
                fill="#666"
              >
                {Math.round(value)}
              </text>
            ))
          )}
          
          {/* Data points and lines */}
          {data.map((point, i) => {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            const y = yAxisLabels 
              ? padding + chartHeight - (chartHeight / (yAxisLabels.length - 1)) * (yAxisLabels.indexOf(point.value))
              : padding + chartHeight - (point.value / maxValue) * chartHeight;
            
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="4" fill="#1E88E5" />
                {i > 0 && (
                  <line 
                    x1={padding + (chartWidth / (data.length - 1)) * (i - 1)}
                    y1={yAxisLabels 
                      ? padding + chartHeight - (chartHeight / (yAxisLabels.length - 1)) * (yAxisLabels.indexOf(data[i-1].value))
                      : padding + chartHeight - (data[i-1].value / maxValue) * chartHeight}
                    x2={x}
                    y2={y}
                    stroke="#1E88E5"
                    strokeWidth="2"
                  />
                )}
              </g>
            );
          })}
        </svg>
        <p style={{ 
          textAlign: 'center', 
          fontSize: '14px', 
          color: '#666', 
          marginTop: '8px' 
        }}>
          {title}
        </p>
      </div>
    );
  };

  const handleRunNewAssessment = () => {
    onRunNewAssessment();
    // Stay on the assessment result page - no navigation
  };

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
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
          paddingTop: '16px'
        }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#1E88E5',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 0'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#333',
            margin: 0
          }}>
            Your Risk Assessment
          </h1>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Left Column - Risk Score Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderLeft: '4px solid #FFC107',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              backgroundColor: '#E3F2FD',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              position: 'relative'
            }}>
              <span style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#1E88E5'
              }}>
                {assessmentData?.riskScore || 0}
              </span>
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0',
              textTransform: 'capitalize'
            }}>
              {assessmentData?.riskLevel || 'Unknown'} Risk
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {assessmentData?.riskLevel === 'low' && 'Your current health metrics indicate low risk. Keep up the good work!'}
              {assessmentData?.riskLevel === 'medium' && 'Your health metrics show moderate risk. Consider making some lifestyle adjustments.'}
              {assessmentData?.riskLevel === 'high' && 'Your health metrics indicate high risk. Please consult with a healthcare professional.'}
            </p>
          </div>

          {/* Right Column - Contributing Factors */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '16px'
            }}>
              Contributing Factors
            </h3>
            
            {assessmentData?.mainFactors && assessmentData.mainFactors.length > 0 ? (
              <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
                {assessmentData.mainFactors.map((factor, index) => (
                  <li key={index} style={{
                    padding: '8px 0',
                    borderBottom: index < assessmentData.mainFactors.length - 1 ? '1px solid #e0e0e0' : 'none',
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    • {factor}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: 0,
                fontStyle: 'italic'
              }}>
                No specific risk factors identified
              </p>
            )}
          </div>
        </div>

        {/* Understanding Your Assessment Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '32px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '16px'
          }}>
            Understanding Your Assessment
          </h3>
          
          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            Your risk score is calculated based on your health metrics, lifestyle factors, and medical history. 
            This assessment helps you understand your current health status and provides personalized recommendations.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#4CAF50',
                marginBottom: '4px'
              }}>
                Low Risk
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                0–39
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#FF9800',
                marginBottom: '4px'
              }}>
                Medium Risk
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                40–69
              </div>
            </div>
            
            <div style={{
              padding: '12px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#F44336',
                marginBottom: '4px'
              }}>
                High Risk
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                70–100
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            ':hover': { transform: 'translateY(-2px)' }
          }}
          onClick={() => navigate('/assistant')} // Assuming assistant page has recommendations
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#E3F2FD',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              📋
            </div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0'
            }}>
              View Recommendations
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Get personalized health recommendations based on your assessment
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            ':hover': { transform: 'translateY(-2px)' }
          }}
          onClick={handleRunNewAssessment}
          >
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#E8F5E8',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              🔄
            </div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0'
            }}>
              Run New Assessment
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Recalculate your risk score with the latest health data
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Risk Score Progression */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }}>
              Risk Score Progression
            </h2>
            <SimpleChart 
              data={assessmentHistory?.map(a => ({ value: a.riskScore, date: a.date }))}
              title="How your risk score has changed"
            />
          </div>

          {/* Risk Level Over Time */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '20px'
            }}>
              Risk Level Over Time
            </h2>
            <SimpleChart 
              data={assessmentHistory?.map(a => ({ 
                value: a.riskScore >= 70 ? 'High' : a.riskScore >= 50 ? 'Medium' : 'Low', 
                date: a.date,
                score: a.riskScore 
              }))}
              title="Tracking your risk category"
              yAxisLabels={['High', 'Medium', 'Low']}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#666',
            margin: 0,
            fontStyle: 'italic'
          }}>
            This assessment provides preventive insights and is not a medical diagnosis. 
            Always consult your healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Assessments;