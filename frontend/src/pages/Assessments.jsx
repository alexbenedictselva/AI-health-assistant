import React from 'react';

const Assessments = ({ onNavigate, assessmentHistory, onRunNewAssessment }) => {
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
          {['Dashboard', 'Health Metrics', 'Assessments', 'Assistant', 'Settings'].map((tab) => (
            <span
              key={tab}
              onClick={() => {
                if (tab === 'Dashboard') onNavigate('dashboard');
                else if (tab === 'Health Metrics') onNavigate('healthMetrics');
                else if (tab === 'Assistant') onNavigate('assistant');
                else if (tab === 'Settings') onNavigate('settings');
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

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return '#66BB6A';
      case 'medium': return '#FB8C00';
      case 'high': return '#E53935';
      default: return '#666';
    }
  };

  const handleRunNewAssessment = () => {
    onRunNewAssessment();
    onNavigate('dashboard');
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 8px 0'
            }}>
              Assessment History
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: 0
            }}>
              Track your risk assessments over time
            </p>
          </div>
          <button
            onClick={handleRunNewAssessment}
            style={{
              padding: '12px 20px',
              backgroundColor: '#1E88E5',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Run New Assessment
          </button>
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
              data={assessmentHistory?.map(a => ({ value: a.riskLevel, date: a.date }))}
              title="Tracking your risk category"
              yAxisLabels={['High', 'Medium', 'Low']}
            />
          </div>
        </div>

        {/* All Assessments Table */}
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
            All Assessments
          </h2>
          
          {assessmentHistory && assessmentHistory.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      Date
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      Risk Score
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      Risk Level
                    </th>
                    <th style={{
                      textAlign: 'left',
                      padding: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assessmentHistory.slice().reverse().map((assessment, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e0e0e0' }}>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>
                        {assessment.date}
                      </td>
                      <td style={{ padding: '12px', fontSize: '14px', color: '#333' }}>
                        {assessment.riskScore}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                          backgroundColor: getRiskLevelColor(assessment.riskLevel),
                          textTransform: 'capitalize'
                        }}>
                          {assessment.riskLevel}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button style={{
                          padding: '6px 12px',
                          backgroundColor: 'transparent',
                          color: '#1E88E5',
                          border: '1px solid #1E88E5',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              border: '2px dashed #ddd',
              borderRadius: '8px',
              padding: '40px',
              textAlign: 'center',
              color: '#666'
            }}>
              No assessments completed yet. Run your first assessment to see your health insights.
            </div>
          )}
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