import React, { useState, useEffect } from 'react';
import { riskAPI, DiabetesRiskData, metricsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { translateTexts } from '../services/translationService';
import RiskRing from '../components/RiskRing';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const BASE_TEXTS = {
  title: 'Diabetes Risk Assessment',
  healthInfo: 'Health Information',
  glucoseLevel: 'Glucose Level (mg/dL)',
  measurementContext: 'Measurement Context',
  fasting: 'Fasting',
  postMeal: 'Post-Meal',
  age: 'Age',
  weight: 'Weight (kg)',
  height: 'Height (cm)',
  trend: 'Trend',
  improving: 'Improving',
  stable: 'Stable',
  worsening: 'Worsening',
  symptoms: 'Symptoms',
  none: 'None',
  mild: 'Mild',
  severe: 'Severe',
  medicationType: 'Medication Type',
  oral: 'Oral',
  insulin: 'Insulin',
  mealType: 'Meal Type',
  lowCarb: 'Low Carb',
  balanced: 'Balanced',
  highCarb: 'High Carb',
  physicalActivity: 'Physical Activity',
  active: 'Active',
  sometimes: 'Sometimes',
  never: 'Never',
  diabetesStatus: 'Diabetes Status',
  nonDiabetic: 'Non-Diabetic',
  prediabetic: 'Prediabetic',
  type1: 'Type 1',
  type2: 'Type 2',
  familyHistory: 'Family History of Diabetes',
  calculating: 'Calculating...',
  calculateRisk: 'Calculate Risk',
  analysisCharts: '📊 Analysis Charts',
  explanation: '🔍 Explanation',
  recommendations: '💡 Recommendations',
  riskBreakdown: 'Risk Factor Breakdown',
  glucoseTrend: 'Glucose Level Trend',
  bmiAnalysis: 'BMI Analysis',
  understandingRisk: 'Understanding Your Risk',
  personalizedRec: 'Personalized Recommendations',
  noRecommendations: 'No recommendations available.',
  disclaimer: '⚠️ Disclaimer',
  disclaimerText1: 'This assessment is for informational purposes only and does not constitute medical advice. Please consult with a healthcare professional for proper diagnosis and treatment.',
  disclaimerText2: 'These recommendations are general guidelines based on your input. Always consult with a qualified healthcare provider before making any changes to your diet, exercise, or medication regimen.',
  failedCalculate: 'Failed to calculate risk.',
  glucoseFactors: 'Glucose Factors',
  treatmentSymptoms: 'Treatment & Symptoms',
  baselineHealth: 'Baseline Health',
  current: 'Current',
  target: 'Target',
  yourBMI: 'Your BMI',
  healthyRange: 'Healthy Range'
};

const getCurrentLanguage = () => localStorage.getItem('language') || 'en';

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'charts' | 'explanation' | 'recommendations'>('charts');
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

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === 'checkbox'
          ? e.target.checked
          : type === 'number'
          ? parseFloat(value) || 0
          : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await riskAPI.calculateDiabetesRisk(formData);
      const riskResult = response.data;
      
      // Fetch explanation
      const expResponse = await riskAPI.getDiabetesExplanation(riskResult);
      riskResult.explanation = expResponse.data.explanation;
      riskResult.summary = expResponse.data.summary;
      
      // Fetch recommendations
      const recResponse = await riskAPI.getDiabetesRecommendations(riskResult);
      riskResult.recommendations = recResponse.data.recommendations;
      
      setResult(riskResult);
      setShowModal(true);

      await metricsAPI.createMetrics({
        ...formData,
        disease_type: 'diabetes'
      });

      window.dispatchEvent(new CustomEvent('metrics:updated'));

    } catch (err) {
      console.error(err);
      setError(texts.failedCalculate);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">{texts.title}</h1>

      <div className="card">
        <div className="card-header">{texts.healthInfo}</div>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{texts.glucoseLevel}</label>
              <input type="number" name="glucose_value" className="form-input" onChange={handleChange} required placeholder="e.g., 120" />
            </div>
            <div className="form-group">
              <label className="form-label">{texts.measurementContext}</label>
              <select name="measurement_context" className="form-select" onChange={handleChange} value={formData.measurement_context}>
                <option value="fasting">{texts.fasting}</option>
                <option value="post-meal">{texts.postMeal}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{texts.age}</label>
              <input type="number" name="age" className="form-input" onChange={handleChange} required placeholder="e.g., 35" />
            </div>
            <div className="form-group">
              <label className="form-label">{texts.weight}</label>
              <input type="number" name="weight_kg" className="form-input" onChange={handleChange} required placeholder="e.g., 70" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{texts.height}</label>
              <input type="number" name="height_cm" className="form-input" onChange={handleChange} required placeholder="e.g., 170" />
            </div>
            <div className="form-group">
              <label className="form-label">{texts.trend}</label>
              <select name="trend" className="form-select" onChange={handleChange} value={formData.trend}>
                <option value="improving">{texts.improving}</option>
                <option value="stable">{texts.stable}</option>
                <option value="worsening">{texts.worsening}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{texts.symptoms}</label>
              <select name="symptoms" className="form-select" onChange={handleChange} value={formData.symptoms}>
                <option value="none">{texts.none}</option>
                <option value="mild">{texts.mild}</option>
                <option value="severe">{texts.severe}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{texts.medicationType}</label>
              <select name="medication_type" className="form-select" onChange={handleChange} value={formData.medication_type}>
                <option value="none">{texts.none}</option>
                <option value="oral">{texts.oral}</option>
                <option value="insulin">{texts.insulin}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{texts.mealType}</label>
              <select name="meal_type" className="form-select" onChange={handleChange} value={formData.meal_type}>
                <option value="low-carb">{texts.lowCarb}</option>
                <option value="balanced">{texts.balanced}</option>
                <option value="high-carb">{texts.highCarb}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{texts.physicalActivity}</label>
              <select name="physical_activity" className="form-select" onChange={handleChange} value={formData.physical_activity}>
                <option value="active">{texts.active}</option>
                <option value="sometimes">{texts.sometimes}</option>
                <option value="never">{texts.never}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{texts.diabetesStatus}</label>
              <select name="diabetes_status" className="form-select" onChange={handleChange} value={formData.diabetes_status}>
                <option value="non-diabetic">{texts.nonDiabetic}</option>
                <option value="prediabetic">{texts.prediabetic}</option>
                <option value="type1">{texts.type1}</option>
                <option value="type2">{texts.type2}</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" name="family_history" onChange={handleChange} checked={formData.family_history} />
                {texts.familyHistory}
              </label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? texts.calculating : texts.calculateRisk}
          </button>
        </form>
      </div>

      {showModal && result && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Risk Score Summary */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <RiskRing
                  score={Number(result.risk_score)}
                  size={160}
                  label={result.risk_level}
                />
              </div>
              {result.summary && (
                <div style={{ textAlign: 'center', padding: '1rem', background: '#F0F9FF', borderRadius: '0.5rem', margin: '1rem 0' }}>
                  <p style={{ fontSize: '1.125rem', fontWeight: '500', color: '#0F172A' }}>{result.summary}</p>
                </div>
              )}
            </div>

            {/* Tabbed Card */}
            <div className="card">
              {/* Tab Buttons */}
              <div style={{ display: 'flex', borderBottom: '2px solid #E2E8F0', marginBottom: '1.5rem' }}>
                <button
                  onClick={() => setActiveTab('charts')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'charts' ? '3px solid #0EA5E9' : '3px solid transparent',
                    color: activeTab === 'charts' ? '#0EA5E9' : '#64748B',
                    fontWeight: activeTab === 'charts' ? '600' : '500',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {texts.analysisCharts}
                </button>
                <button
                  onClick={() => setActiveTab('explanation')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'explanation' ? '3px solid #0EA5E9' : '3px solid transparent',
                    color: activeTab === 'explanation' ? '#0EA5E9' : '#64748B',
                    fontWeight: activeTab === 'explanation' ? '600' : '500',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {texts.explanation}
                </button>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: activeTab === 'recommendations' ? '3px solid #0EA5E9' : '3px solid transparent',
                    color: activeTab === 'recommendations' ? '#0EA5E9' : '#64748B',
                    fontWeight: activeTab === 'recommendations' ? '600' : '500',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {texts.recommendations}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'charts' && (
                <div>
                  {/* Risk Breakdown Pie Chart */}
                  {result.percentage_breakdown && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>{texts.riskBreakdown}</h3>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <PieChart width={400} height={300}>
                          <Pie
                            data={[
                              { name: texts.glucoseFactors, value: result.percentage_breakdown.immediate_glycemic_percentage },
                              { name: texts.treatmentSymptoms, value: result.percentage_breakdown.treatment_symptom_percentage },
                              { name: texts.baselineHealth, value: result.percentage_breakdown.baseline_vulnerability_percentage }
                            ]}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            <Cell fill="#0EA5E9" />
                            <Cell fill="#F59E0B" />
                            <Cell fill="#10B981" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </div>
                    </div>
                  )}

                  {/* Glucose Level Line Chart */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>{texts.glucoseTrend}</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart
                        data={[
                          { time: texts.current, glucose: formData.glucose_value },
                          { time: texts.target, glucose: formData.measurement_context === 'fasting' ? 100 : 140 }
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="glucose" stroke="#0EA5E9" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* BMI Chart */}
                  {formData.weight_kg && formData.height_cm && (
                    <div>
                      <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>{texts.bmiAnalysis}</h3>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: texts.yourBMI, value: (formData.weight_kg / ((formData.height_cm / 100) ** 2)).toFixed(1) },
                              { name: texts.healthyRange, value: 22.5 }
                            ]}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            <Cell fill="#F59E0B" />
                            <Cell fill="#10B981" />
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'explanation' && (
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>{texts.understandingRisk}</h3>
                  {result.explanation && (
                    <>
                      {result.explanation.priority_explanations && result.explanation.priority_explanations.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          {result.explanation.priority_explanations.map((exp: string, i: number) => (
                            <div key={i} style={{ 
                              padding: '1rem', 
                              background: '#FEF3C7', 
                              borderLeft: '4px solid #F59E0B',
                              borderRadius: '0.5rem',
                              marginBottom: '0.75rem',
                              color: '#78350F'
                            }}>
                              {exp}
                            </div>
                          ))}
                        </div>
                      )}
                      {result.explanation.remaining_explanations && result.explanation.remaining_explanations.length > 0 && (
                        <div style={{ marginBottom: '1.5rem' }}>
                          {result.explanation.remaining_explanations.map((exp: string, i: number) => (
                            <div key={i} style={{ 
                              padding: '1rem', 
                              background: '#F0F9FF', 
                              borderLeft: '4px solid #0EA5E9',
                              borderRadius: '0.5rem',
                              marginBottom: '0.75rem',
                              color: '#0C4A6E'
                            }}>
                              {exp}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <div style={{ 
                    padding: '1rem', 
                    background: '#FEE2E2', 
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #EF4444',
                    marginTop: '1.5rem'
                  }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#7F1D1D' }}>{texts.disclaimer}</p>
                    <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                      {texts.disclaimerText1}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'recommendations' && (
                <div>
                  <h3 style={{ marginBottom: '1rem', color: '#0F172A' }}>{texts.personalizedRec}</h3>
                  {result.recommendations && result.recommendations.length > 0 ? (
                    <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
                      {result.recommendations.map((rec: string, i: number) => (
                        <div key={i} style={{
                          padding: '1rem',
                          background: '#F0FDF4',
                          borderLeft: '4px solid #10B981',
                          borderRadius: '0.5rem',
                          display: 'flex',
                          alignItems: 'start',
                          color: '#064E3B'
                        }}>
                          <span style={{ marginRight: '0.75rem', fontSize: '1.25rem' }}>💡</span>
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#64748B', textAlign: 'center', padding: '2rem' }}>{texts.noRecommendations}</p>
                  )}
                  <div style={{ 
                    padding: '1rem', 
                    background: '#FEE2E2', 
                    borderRadius: '0.5rem',
                    borderLeft: '4px solid #EF4444'
                  }}>
                    <p style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#7F1D1D' }}>{texts.disclaimer}</p>
                    <p style={{ fontSize: '0.875rem', color: '#991B1B' }}>
                      {texts.disclaimerText2}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiabetesAssessment;
