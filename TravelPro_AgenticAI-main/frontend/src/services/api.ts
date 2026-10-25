import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://travel-pro-backend-i0xi.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  register: async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  login: async (credentials: any) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  updatePreferences: async (preferences: any) => {
    const response = await api.put('/api/auth/preferences', preferences);
    return response.data;
  },
};

export const tripService = {
  save: async (tripData: any) => {
    const response = await api.post('/api/trips', tripData);
    return response.data;
  },
  list: async () => {
    const response = await api.get('/api/trips');
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/api/trips/${id}`);
    return response.data;
  },
  update: async (id: string, tripData: any) => {
    const response = await api.put(`/api/trips/${id}`, tripData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/trips/${id}`);
    return response.data;
  },
};

export const agentService = {
  plan: async (planRequest: any) => {
    const response = await api.post('/api/agent/plan', planRequest);
    return response.data;
  },
  getSvgVisual: async (data: any) => {
    const response = await api.post('/api/agent/svg-visual', data);
    return response.data;
  },
  replan: async (replanRequest: any) => {
    const response = await api.post('/api/agent/replan', replanRequest);
    return response.data;
  },
  optimize: async (optimizeRequest: any) => {
    const response = await api.post('/api/agent/optimize', optimizeRequest);
    return response.data;
  },
  assistant: async (message: string, history: any[] = []) => {
    const response = await api.post('/api/agent/assistant', { message, history });
    return response.data;
  },


};


export const weatherService = {
  getForecast: async (destination: string, dates: string[] = []) => {
    const response = await api.get('/api/weather', {
      params: { destination, dates: dates.join(',') }
    });
    return response.data;
  },
};

export default api;
