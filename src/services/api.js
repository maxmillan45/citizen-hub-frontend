// src/services/api.js
import axios from 'axios';

// Use environment variable or fallback to Render URL
const API_URL = process.env.REACT_APP_API_URL || 'https://citizen-hub-kenya-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============ AUTHENTICATION ============
export const getToken = (phone_number) => 
  api.post('/api/get-token/', { phone_number });

// src/services/api.js - add this function
export const waitForPayment = (checkout_request_id, phone_number) => 
  api.post('/api/auth/stk/wait/', { checkout_request_id, phone_number });

export const completeProfile = (data) => 
  api.post('/api/auth/complete-profile/', data);

export const getProfile = () => 
  api.get('/api/auth/profile/');

export const updateProfile = (data) => 
  api.patch('/api/auth/profile/', data);

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('phone_number');
  return Promise.resolve();
};

// ============ M-PESA ============
export const initiateSTKPush = (phone_number, amount = '1') => 
  api.post('/api/auth/stk/request/', { 
    phone_number, 
    amount,
    account_reference: 'CitizenHubLogin',
    transaction_desc: 'Authentication'
  });

export const checkSTKStatus = (checkout_request_id) => 
  api.get(`/api/auth/stk/status/${checkout_request_id}/`);

export const authenticateWithMPesa = (checkout_request_id, phone_number) => 
  api.post('/api/auth/mpesa/authenticate/', { 
    checkout_request_id, 
    phone_number 
  });

// ============ CONSTITUTION ============
export const searchConstitution = (query, topic = '') => {
  let url = `/api/constitution/search/?q=${encodeURIComponent(query)}`;
  if (topic) url += `&topic=${topic}`;
  return api.get(url);
};

export const getArticle = (number) => 
  api.get(`/api/constitution/article/${number}/`);

// ============ CHATBOT ============
export const askChatbot = (question, language = 'en') => 
  api.post('/api/chatbot/ask/', { question, language });

export const getChatHistory = () => 
  api.get('/api/chatbot/history/');

// ============ FEATURES ============
export const getHistoryFacts = (page = 1, pageSize = 50) => 
  api.get(`/api/auth/history/?page=${page}&page_size=${pageSize}`);

export const getFAQs = (category = '') => 
  api.get(`/api/auth/faq/${category ? `?category=${category}` : ''}`);

export const getFAQ = (id) => 
  api.get(`/api/auth/faq/${id}/`);

export const getMPs = (page = 1, pageSize = 100) => {
  let url = '/api/auth/mp/';
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('page_size', pageSize);
  url += `?${params.toString()}`;
  return api.get(url);
};

export const getEvents = (category = '', location = '') => {
  let url = '/api/auth/events/';
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (location) params.append('location', location);
  if (params.toString()) url += `?${params.toString()}`;
  return api.get(url);
};

// ============ CRIME REPORTS ============
export const submitCrimeReport = (data) => 
  api.post('/api/auth/crime/', data);

export const getMyReports = () => 
  api.get('/api/auth/crime/');

// ============ ADMIN ============
export const getAdminDashboard = () => 
  api.get('/api/auth/admin/dashboard/');

export const getAdminUsers = (page = 1, pageSize = 20) => 
  api.get(`/api/auth/admin/users/?page=${page}&page_size=${pageSize}`);

export const getAdminCrimes = (status = '', page = 1, pageSize = 20) => {
  let url = `/api/auth/admin/crimes/?page=${page}&page_size=${pageSize}`;
  if (status) url += `&status=${status}`;
  return api.get(url);
};

export const updateCrimeStatus = (reportId, status) => 
  api.patch(`/api/auth/admin/crimes/${reportId}/`, { status });

// ============ UTILITY ============
export const healthCheck = () => 
  api.get('/health/');

export default api;