import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, clear storage and notify app
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      try {
        window.dispatchEvent(new Event('auth:invalid'));
      } catch (e) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

export interface UserProfileData {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  is_admin?: boolean;
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

export interface UserMetricsData {
  user_id: number;
  disease_type: string;
  [key: string]: any;
}

// Auth API
export const authAPI = {
  login: (data: LoginData) => api.post('/login', data),
  register: (data: RegisterData) => api.post('/register', data),
  getMe: () => api.get<UserProfileData>('/me'),
  updateMe: (data: { name: string; email: string; phone_number: string }) => api.post<UserProfileData>('/me', data),
  getUsers: () => api.get('/users'),
  deleteUser: (userId: number) => api.delete(`/users/${userId}`),
  toggleAdmin: (userId: number, isAdmin: boolean) => api.post(`/users/${userId}/admin-toggle`, { is_admin: isAdmin }),
  getAdminStats: () => api.get('/admin/stats'),
  getUserRecommendations: (userId: number) => api.get(`/users/${userId}/recommendations`),
};

// Risk Assessment API
export const riskAPI = {
  calculateDiabetesRisk: (data: any) => api.post('/diabetes-risk', data),
  getDiabetesExplanation: (data: any) => api.post('/explain-diabetes', data),
  getDiabetesRecommendations: (data: any) => api.post('/diabetes-recommendations', data),
};

// User Metrics API
export const metricsAPI = {
  createMetrics: (data: any) => api.post('/user-metrics', data),
  getUserMetrics: (userId?: number, diseaseType?: string) => {
    const params: string[] = [];
    if (userId) params.push(`user_id=${userId}`);
    if (diseaseType) params.push(`disease_type=${diseaseType}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return api.get(`/user-metrics${qs}`);
  },
};

// Health endpoints
export const healthAPI = {
  checkStatus: () => api.get('/'),
  checkDatabase: () => api.get('/db-test'),
};
