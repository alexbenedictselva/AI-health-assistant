import React, { useState } from 'react';

const HealthMetrics = ({ onNavigate, healthMetrics, onAddMetric }) => {
  const [metricFilter, setMetricFilter] = useState('All Metrics');
  const [timeRange, setTimeRange] = useState('Last 30 days');

  const filterOptions = ['All Metrics', 'Blood Glucose', 'Blood Pressure', 'Activity', 'BMI'];
  const timeRangeOptions = ['Last 7 days', 'Last 30 days', 'Last 90 days'];

  const getFilteredMetrics = () => {
    if (!healthMetrics) return [];
    
    let filtered = healthMetrics;
    
    // Filter by metric type
    if (metricFilter !== 'All Metrics') {
      filtered = filtered.filter(m => m.type === metricFilter);
    }
    
    // Filter by time range (simplified for demo)
    const days = timeRange === 'Last 7 days' ? 7 : timeRange === 'Last 30 days' ? 30 : 90;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return filtered;
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
          {['Dashboard', 'Health Metrics', 'Assessments', 'Assistant', 'Settings'].map((tab) => (
            <span
              key={tab}
              onClick={() => {
                if (tab === 'Dashboard') onNavigate('dashboard');
                else if (tab === 'Assessments') onNavigate('assessments');
                else if (tab === 'Assistant') onNavigate('assistant');
                else if (tab === 'Settings') onNavigate('settings');
              }}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: tab === 'Health Metrics' ? '#1E88E5' : '#666',
                cursor: 'pointer',
                borderBottom: tab === 'Health Metrics' ? '2px solid #1E88E5' : 'none',
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

  const TrendChart = ({ data, title, subtitle, color, normalValue, normalLabel }) => {
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
          No data available
        </div>
      );
    }

    const chartWidth = 400;
    const chartHeight = 150;
    const padding = 40;
    const maxValue = Math.max(...data.map(d => parseFloat(d.value)), normalValue || 0);
    const minValue = Math.min(...data.map(d => parseFloat(d.value)), normalValue || 0) - 10;

    return (
      <div>
        <svg width={chartWidth + padding * 2} height={chartHeight + padding * 2}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1={padding} y1={padding + (chartHeight / 4) * i} x2={padding + chartWidth} y2={padding + (chartHeight / 4) * i} stroke="#f0f0f0" strokeWidth="1" />
          ))}
          
          {/* Normal reference line */}
          {normalValue && (
            <g>
              <line 
                x1={padding} 
                y1={padding + chartHeight - ((normalValue - minValue) / (maxValue - minValue)) * chartHeight}
                x2={padding + chartWidth} 
                y2={padding + chartHeight - ((normalValue - minValue) / (maxValue - minValue)) * chartHeight}
                stroke="#ddd" 
                strokeWidth="2" 
                strokeDasharray="5,5" 
              />
              <text 
                x={padding + chartWidth - 10} 
                y={padding + chartHeight - ((normalValue - minValue) / (maxValue - minValue)) * chartHeight - 5}
                textAnchor="end" 
                fontSize="12" 
                fill="#666"
              >
                {normalLabel}
              </text>
            </g>
          )}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((point, i) => {
              const x = padding + (chartWidth / (data.length - 1)) * i;
              const y = padding + chartHeight - ((parseFloat(point.value) - minValue) / (maxValue - minValue)) * chartHeight;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, i) => {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            const y = padding + chartHeight - ((parseFloat(point.value) - minValue) / (maxValue - minValue)) * chartHeight;
            return <circle key={i} cx={x} cy={y} r="4" fill={color} />;
          })}
        </svg>
      </div>
    );
  };

  const filteredMetrics = getFilteredMetrics();
  const glucoseData = filteredMetrics.filter(m => m.type === 'Blood Glucose');
  const bpData = filteredMetrics.filter(m => m.type === 'Blood Pressure');

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
              Health Metrics Timeline
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#666',
              margin: 0
            }}>
              Track your health measurements over time
            </p>
          </div>
          <button
            onClick={() => onNavigate('addMetric')}
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
            + Add Metric
          </button>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginBottom: '24px',
          display: 'flex',
          gap: '24px',
          alignItems: 'center'
        }}>
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Filter by metric
            </label>
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              {filterOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              Time range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                minWidth: '150px'
              }}
            >
              {timeRangeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Glucose Trend Chart */}
          {(metricFilter === 'All Metrics' || metricFilter === 'Blood Glucose') && (
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
                margin: '0 0 4px 0'
              }}>
                Glucose Trend
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 20px 0'
              }}>
                Blood glucose levels over time (mg/dL)
              </p>
              <TrendChart 
                data={glucoseData}
                title="Glucose Trend"
                color="#1E88E5"
                normalValue={100}
                normalLabel="Normal (100 mg/dL)"
              />
            </div>
          )}

          {/* Blood Pressure Trend Chart */}
          {(metricFilter === 'All Metrics' || metricFilter === 'Blood Pressure') && (
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
                margin: '0 0 4px 0'
              }}>
                Blood Pressure Trend
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#666',
                margin: '0 0 20px 0'
              }}>
                Systolic blood pressure over time (mmHg)
              </p>
              <TrendChart 
                data={bpData}
                title="Blood Pressure Trend"
                color="#E53935"
                normalValue={120}
                normalLabel="Normal (<120 mmHg)"
              />
            </div>
          )}
        </div>

        {/* Measurements Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#333',
              margin: '0 0 4px 0'
            }}>
              All Measurements
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: 0
            }}>
              Showing {filteredMetrics.length} measurements
            </p>
          </div>
          
          {filteredMetrics.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>Date</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>Metric</th>
                    <th style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#333'
                    }}>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetrics.slice().reverse().map((metric, index) => (
                    <tr key={metric.id} style={{
                      backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                      borderBottom: '1px solid #e0e0e0'
                    }}>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333'
                      }}>{metric.date}</td>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333'
                      }}>{metric.type}</td>
                      <td style={{
                        padding: '12px',
                        fontSize: '14px',
                        color: '#333',
                        fontWeight: '600'
                      }}>{metric.value} {metric.unit}</td>
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
              No measurements found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthMetrics;