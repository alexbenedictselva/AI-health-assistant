import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface DiabetesRiskData {
  user_id: number;
  glucose_value: number;
  measurement_context: string;
  trend: string;
  symptoms: string;
  medication_type: string;
  meal_type: string;
  physical_activity: string;
  diabetes_status: string;
  age: number;
  weight_kg: number;
  height_cm: number;
  family_history: boolean;
}

export interface CardiacRiskData {
  user_id: number;
  chest_pain: string;
  shortness_of_breath: string;
  heart_rate?: number;
  blood_pressure: string;
  smoking: string;
  physical_activity: string;
  diet: string;
  diabetes: boolean;
  age: number;
  bmi_category: string;
  family_history: boolean;
}

export interface UserMetricsData {
  user_id: number;
  disease_type: string;
  [key: string]: any;
}

// Auth API
export const authAPI = {
  login: (data: LoginData) => api.post('/login', data),
  register: (data: RegisterData) => api.post('/register', data),
};

// Risk Assessment API
export const riskAPI = {
  calculateDiabetesRisk: (data: DiabetesRiskData) => api.post('/diabetes-risk', data),
  calculateCardiacRisk: (data: CardiacRiskData) => api.post('/cardiac-risk', data),
  getDiabetesExplanation: (data: any) => api.post('/explain', data),
  getCardiacExplanation: (data: any) => api.post('/explain-cardiac', data),
  getDiabetesRecommendations: (data: any) => api.post('/diabetes-recommendations', data),
  getCardiacRecommendations: (data: any) => api.post('/cardiac-recommendations', data),
};

// User Metrics API
export const metricsAPI = {
  createMetrics: (data: UserMetricsData) => api.post('/user-metrics', data),
  getUserMetrics: (userId: number, diseaseType?: string) => {
    const params = diseaseType ? `?disease_type=${diseaseType}` : '';
    return api.get(`/user-metrics/${userId}${params}`);
  },
};

// Health Check API
export const healthAPI = {
  checkStatus: () => api.get('/'),
  checkDatabase: () => api.get('/db-test'),
};

export default api;