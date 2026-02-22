import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Scan APIs
export const scanAPI = {
  submitScan: (formData) =>
    api.post('/scans/submit', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getScanHistory: (patientId) => api.get(`/scans/history/${patientId}`),
  getLatestScan: (patientId) => api.get(`/scans/latest/${patientId}`),
};

// Patient APIs
export const patientAPI = {
  createPatient: (data) => api.post('/patients', data),
  getMyPatients: () => api.get('/patients/my-patients'),
  getPatientDetails: (patientId) => api.get(`/patients/${patientId}`),
  updatePatient: (patientId, data) => api.put(`/patients/${patientId}`, data),
};

// Admin APIs
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUserStatus: (userId, data) => api.put(`/admin/users/${userId}`, data),
  getAnalytics: () => api.get('/admin/analytics'),
};

export default api;
