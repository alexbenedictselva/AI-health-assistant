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
    weight_kg: 0,
    height_cm: 0,
    family_history: false
  });
  
  const [result, setResult] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string,string>>({});

  const computeBMICategory = (height_cm?: number, weight_kg?: number) => {
    if (!height_cm || !weight_kg || height_cm <= 0) return 'normal';
    const height_m = height_cm / 100;
    const bmi = weight_kg / (height_m * height_m);
    if (bmi >= 30) return 'obese';
    if (bmi >= 25) return 'overweight';
    return 'normal';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                        type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

    setFormData(prev => {
      const updated = { ...prev, [name]: parsedValue } as any;
      // If user provided height or weight, compute BMI category automatically
      if (name === 'height_cm' || name === 'weight_kg') {
        const height = Number(name === 'height_cm' ? parsedValue : updated.height_cm);
        const weight = Number(name === 'weight_kg' ? parsedValue : updated.weight_kg);
        if (height && weight) {
          updated.bmi_category = computeBMICategory(Number(height), Number(weight));
        }
      }
      return updated;
    });

    // Clear field-level error on edit
    setFieldErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate age, height, weight
    const errs: Record<string,string> = {};
    const age = Number(formData.age);
    const height = Number((formData as any).height_cm);
    const weight = Number((formData as any).weight_kg);
    if (!(age > 30 && age < 70)) errs.age = 'Age must be greater than 30 and less than 70.';
    if (!(height > 90)) errs.height_cm = 'Height must be greater than 90 cm.';
    if (!(weight > 40)) errs.weight_kg = 'Weight must be greater than 40 kg.';
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Please correct the highlighted fields.');
      setLoading(false);
      return;
    }

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
      } as any;
      // include weight/height for metrics if present
      if ((formData as any).weight_kg) metricsData.weight_kg = (formData as any).weight_kg;
      if ((formData as any).height_cm) metricsData.height_cm = (formData as any).height_cm;
      await metricsAPI.createMetrics(metricsData);
      // Notify other parts of the app that metrics changed (e.g., dashboard)
      try {
        window.dispatchEvent(new CustomEvent('metrics:updated'));
      } catch (e) {
        // ignore if dispatching fails in restricted environments
      }
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
              {fieldErrors.age && <div className="field-error" style={{ color: 'var(--danger-red)', marginTop: '0.5rem' }}>{fieldErrors.age}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Weight (kg)</label>
              <input
                type="number"
                name="weight_kg"
                className="form-input"
                value={(formData as any).weight_kg || ''}
                onChange={handleChange}
                required
                min="1"
                step="0.1"
                placeholder="Enter weight"
              />
              {fieldErrors.weight_kg && <div className="field-error" style={{ color: 'var(--danger-red)', marginTop: '0.5rem' }}>{fieldErrors.weight_kg}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Height (cm)</label>
              <input
                type="number"
                name="height_cm"
                className="form-input"
                value={(formData as any).height_cm || ''}
                onChange={handleChange}
                required
                min="1"
                step="0.1"
                placeholder="Enter height"
              />
              {fieldErrors.height_cm && <div className="field-error" style={{ color: 'var(--danger-red)', marginTop: '0.5rem' }}>{fieldErrors.height_cm}</div>}
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