import React, { useState } from 'react';
import { riskAPI, DiabetesRiskData, metricsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const DiabetesAssessment: React.FC = () => {
  const { getUserId } = useAuth();
  const [formData, setFormData] = useState<DiabetesRiskData>({
    user_id: getUserId(),
    glucose_value: 0,
    measurement_context: 'fasting',
    trend: 'stable',
    symptoms: 'none',
    medication_type: 'none',
    meal_type: 'balanced',
    physical_activity: 'sometimes',
    diabetes_status: 'non-diabetic',
    age: 1,
    weight_kg: 0,
    height_cm: 0,
    family_history: false
  });
  
  const [result, setResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Map symptoms display values to backend values
    if (name === 'symptoms') {
      if (value === 'low-sugar' || value === 'high-sugar') {
        processedValue = 'mild';
      } else if (value === 'both-symptoms') {
        processedValue = 'severe';
      }
    }
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? (value === '' ? '' : parseFloat(value) || 0) : processedValue
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate risk with explanation
      const response = await riskAPI.calculateDiabetesRisk(formData);
      setResult(response.data);

      // Try to get recommendations (don't fail if this fails)
      try {
        const recResponse = await riskAPI.getDiabetesRecommendations(response.data);
        setRecommendations(recResponse.data);
      } catch (recErr) {
        console.warn('Recommendations failed:', recErr);
        // Continue without recommendations
      }

      // Try to store user metrics (don't fail if this fails)
      try {
        const metricsData = {
          ...formData,
          disease_type: 'diabetes'
        };
        await metricsAPI.createMetrics(metricsData);
      } catch (metricsErr) {
        console.warn('Metrics storage failed:', metricsErr);
        // Continue without storing metrics
      }
    } catch (err: any) {
      console.error('Assessment error:', err);
      setError('Failed to calculate risk. Please try again.');
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
      <h1 className="page-title">Diabetes Risk Assessment</h1>
      
      <div className="card">
        <div className="card-header">Health Information</div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Glucose Value (mg/dL)</label>
              <input
                type="number"
                name="glucose_value"
                className="form-input"
                value={formData.glucose_value}
                onChange={handleChange}
                required
                min="1"
                step="0.1"
                placeholder="Enter glucose value"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Measurement Context</label>
              <select
                name="measurement_context"
                className="form-select"
                value={formData.measurement_context}
                onChange={handleChange}
              >
                <option value="fasting">Fasting</option>
                <option value="post-meal">Post-meal</option>
                <option value="random">Random</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Glucose Trend</label>
              <select
                name="trend"
                className="form-select"
                value={formData.trend}
                onChange={handleChange}
              >
                <option value="improving">Improving</option>
                <option value="stable">Stable</option>
                <option value="worsening">Worsening</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Symptoms</label>
              <select
                name="symptoms"
                className="form-select"
                value={formData.symptoms === 'mild' ? 'low-sugar' : formData.symptoms === 'severe' ? 'both-symptoms' : formData.symptoms}
                onChange={handleChange}
              >
                <option value="none">None of these</option>
                <option value="low-sugar">Low sugar symptoms</option>
                <option value="high-sugar">High sugar symptoms</option>
                <option value="both-symptoms">Both low and high sugar</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Medication Type</label>
              <select
                name="medication_type"
                className="form-select"
                value={formData.medication_type}
                onChange={handleChange}
              >
                <option value="none">None</option>
                <option value="oral">Oral</option>
                <option value="insulin">Insulin</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Meal Type</label>
              <select
                name="meal_type"
                className="form-select"
                value={formData.meal_type}
                onChange={handleChange}
              >
                <option value="low-carb">Low-carb</option>
                <option value="balanced">Balanced</option>
                <option value="high-carb">High-carb</option>
              </select>
            </div>
          </div>

          <div className="form-row">
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
            
            <div className="form-group">
              <label className="form-label">Diabetes Status</label>
              <select
                name="diabetes_status"
                className="form-select"
                value={formData.diabetes_status}
                onChange={handleChange}
              >
                <option value="non-diabetic">Non-diabetic</option>
                <option value="prediabetic">Prediabetic</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                placeholder="Enter age"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                className="form-input"
                value={formData.weight_kg}
                onChange={handleChange}
                required
                min="1"
                step="0.1"
                placeholder="Enter weight"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                name="height_cm"
                className="form-input"
                value={formData.height_cm}
                onChange={handleChange}
                required
                min="1"
                step="0.1"
                placeholder="Enter height"
              />
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
                Family History of Diabetes
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Calculating risk...' : 'Calculate risk'}
          </button>
        </form>
      </div>

      {result && (
        <div className="card">
          <div className="card-header">Assessment Results</div>

          <div className={`risk-score ${getRiskClass(result.risk_score)}`}>
            <div className="risk-number">{String(result.risk_score ?? '')}</div>
            <div className="risk-level">{String(result.risk_level ?? '')}</div>
          </div>

          {result.summary && (
            <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'var(--pale-green)', borderRadius: '5px' }}>
              <strong>Summary:</strong> {result.summary}
            </div>
          )}

          {result.detailed_breakdown && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--primary-green)', marginBottom: '1rem' }}>Score Breakdown:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div>Glucose: {result.detailed_breakdown.glucose_points} pts</div>
                <div>Trend: {result.detailed_breakdown.trend_points} pts</div>
                <div>Symptoms: {result.detailed_breakdown.symptom_points} pts</div>
                <div>Medication: {result.detailed_breakdown.medication_points} pts</div>
                <div>Diet: {result.detailed_breakdown.meal_points} pts</div>
                <div>Diabetes Status: {result.detailed_breakdown.diabetes_points} pts</div>
                <div>Age: {result.detailed_breakdown.age_points} pts</div>
                <div>BMI: {result.detailed_breakdown.bmi_points} pts</div>
                <div>Family History: {result.detailed_breakdown.family_points} pts</div>
                <div>Activity: {result.detailed_breakdown.activity_points} pts</div>
              </div>
            </div>
          )}

          {result.explanation && (
            <div>
              <div className="card-small-header">Key Explanations</div>
              <div className="explanation-list">
                {Array.isArray(result.explanation.priority_explanations) && result.explanation.priority_explanations.map((exp: any, index: number) => (
                  <div key={index} className="explanation-item">{String(exp)}</div>
                ))}

                {result.explanation.show_more_available && Array.isArray(result.explanation.remaining_explanations) && result.explanation.remaining_explanations.length > 0 && (
                  <details style={{ marginTop: '0.5rem' }}>
                    <summary style={{ cursor: 'pointer', color: 'var(--light-green)', fontWeight: 600 }}>
                      Show more details ({result.explanation.remaining_explanations.length})
                    </summary>
                    <div style={{ marginTop: '0.75rem' }}>
                      {result.explanation.remaining_explanations.map((exp: any, index: number) => (
                        <div key={index} className="explanation-item" style={{ borderLeft: '4px solid var(--very-light-green)' }}>{String(exp)}</div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {recommendations && (
        <div className="card">
          <div className="card-header">Personalized Recommendations</div>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {Array.isArray(recommendations.recommendations) && recommendations.recommendations.map((rec: any, index: number) => (
              <div key={index} className="recommendation-item">{String(rec)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiabetesAssessment;