import React, { useState } from 'react';
import { riskAPI, CardiacRiskData, metricsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CardiacAssessment: React.FC = () => {
  const { getUserId } = useAuth();
  const [formData, setFormData] = useState<CardiacRiskData>({
    user_id: getUserId(),
    chest_pain: 'none',
    shortness_of_breath: 'none',
    heart_rate: undefined,
    blood_pressure: 'normal',
    smoking: 'never',
    physical_activity: 'sometimes',
    diet: 'mixed',
    diabetes: false,
    age: 0,
    bmi_category: 'normal',
    family_history: false
  });
  
  const [result, setResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value ? parseInt(value) : undefined) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate risk with explanation and store metrics
      const response = await riskAPI.calculateCardiacRisk(formData);
      setResult(response.data);

      // Get recommendations
      const recResponse = await riskAPI.getCardiacRecommendations(response.data);
      setRecommendations(recResponse.data);

      // Store user metrics
      const metricsData = {
        ...formData,
        disease_type: 'cardiac'
      };
      await metricsAPI.createMetrics(metricsData);
    } catch (err: any) {
      console.error('Assessment error:', err);
      setError('Network error. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskClass = (score: number) => {
    if (score <= 25) return 'low';
    if (score <= 50) return 'moderate';
    if (score <= 75) return 'high';
    return 'critical';
  };

  return (
    <div className="container">
      <h1 className="page-title">Cardiac Risk Assessment</h1>
      
      <div className="card">
        <div className="card-header">Heart Health Information</div>
        
        {error && <div className="error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Chest Pain</label>
              <select
                name="chest_pain"
                className="form-select"
                value={formData.chest_pain}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="sometimes">Sometimes</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Shortness of Breath</label>
              <select
                name="shortness_of_breath"
                className="form-select"
                value={formData.shortness_of_breath}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="exertion">On Exertion</option>
                <option value="rest">At Rest</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Heart Rate (BPM) - Optional</label>
              <input
                type="number"
                name="heart_rate"
                className="form-input"
                value={formData.heart_rate || ''}
                onChange={handleChange}
                min="40"
                max="200"
                placeholder="Enter heart rate"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Blood Pressure</label>
              <select
                name="blood_pressure"
                className="form-select"
                value={formData.blood_pressure}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Smoking Status</label>
              <select
                name="smoking"
                className="form-select"
                value={formData.smoking}
                onChange={handleChange}
              >
                <option value="never">Never</option>
                <option value="former">Former</option>
                <option value="current">Current</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Physical Activity</label>
              <select
                name="physical_activity"
                className="form-select"
                value={formData.physical_activity}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="sometimes">Sometimes</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Diet</label>
              <select
                name="diet"
                className="form-select"
                value={formData.diet}
                onChange={handleChange}
              >
                <option value="healthy">Healthy</option>
                <option value="mixed">Mixed</option>
                <option value="high_fat">High Fat</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="120"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">BMI Category</label>
              <select
                name="bmi_category"
                className="form-select"
                value={formData.bmi_category}
                onChange={handleChange}
              >
                <option value="normal">Normal</option>
                <option value="overweight">Overweight</option>
                <option value="obese">Obese</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">
                <input
                  type="checkbox"
                  name="diabetes"
                  checked={formData.diabetes}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Have Diabetes
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                name="family_history"
                checked={formData.family_history}
                onChange={handleChange}
                style={{ marginRight: '0.5rem' }}
              />
              Family History of Heart Disease
            </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Calculating Risk...' : 'Calculate Cardiac Risk'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <div className="card-header">Cardiac Assessment Results</div>
          
          <div className={`risk-score ${getRiskClass(result.risk_score)}`}>
            <div className="risk-number">{result.risk_score}</div>
            <div className="risk-level">{result.risk_level}</div>
          </div>

          {result.summary && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--pale-green)', borderRadius: '5px' }}>
              <strong>Summary:</strong> {result.summary}
            </div>
          )}

          {result.explanation && (
            <div>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '1rem' }}>Key Explanations:</h4>
              {result.explanation.priority_explanations?.map((exp: string, index: number) => (
                <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: 'white', borderLeft: '4px solid var(--light-green)' }}>
                  {exp}
                </div>
              ))}
              
              {result.explanation.show_more_available && result.explanation.remaining_explanations?.length > 0 && (
                <details style={{ marginTop: '1rem' }}>
                  <summary style={{ cursor: 'pointer', color: 'var(--light-green)', fontWeight: 'bold' }}>
                    Show More Details ({result.explanation.remaining_explanations.length} more)
                  </summary>
                  <div style={{ marginTop: '1rem' }}>
                    {result.explanation.remaining_explanations.map((exp: string, index: number) => (
                      <div key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: 'var(--gray-light)', borderLeft: '4px solid var(--very-light-green)' }}>
                        {exp}
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}

          {result.percentage_breakdown && (
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '1rem' }}>Risk Factor Breakdown:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', backgroundColor: 'var(--pale-green)', borderRadius: '5px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    {result.percentage_breakdown.immediate_cardiac_percentage}%
                  </div>
                  <div>Immediate Symptoms</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--pale-green)', borderRadius: '5px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    {result.percentage_breakdown.lifestyle_percentage}%
                  </div>
                  <div>Lifestyle Factors</div>
                </div>
                <div style={{ padding: '1rem', backgroundColor: 'var(--pale-green)', borderRadius: '5px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                    {result.percentage_breakdown.baseline_percentage}%
                  </div>
                  <div>Baseline Health</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {recommendations && (
        <div className="card">
          <div className="card-header">Personalized Recommendations</div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {recommendations.recommendations?.map((rec: string, index: number) => (
              <div key={index} style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--pale-green)', 
                borderRadius: '5px',
                borderLeft: '4px solid var(--primary-green)'
              }}>
                {rec}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardiacAssessment;