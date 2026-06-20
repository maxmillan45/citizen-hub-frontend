// src/services/api.js
import axios from 'axios';

const API_URL = 'https://citizen-hub-kenya-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to extract data from response
const extractData = (response) => {
  // If response has results array, return it
  if (response.data && response.data.results) {
    return response.data.results;
  }
  // If response is an array, return it
  if (Array.isArray(response.data)) {
    return response.data;
  }
  // Otherwise return empty array
  return [];
};

// ============ AUTHENTICATION ============
export const getToken = (phone_number) => 
  api.post('/api/get-token/', { phone_number });

export const completeProfile = (data) => 
  api.post('/api/auth/complete-profile/', data);

export const getProfile = () => 
  api.get('/api/auth/profile/');

export const updateProfile = (data) => 
  api.patch('/api/auth/profile/', data);

export const logout = () => 
  api.post('/api/auth/logout/', {});

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
  let url = `/api/constitution/search/?q=${query}`;
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
export const getHistoryFacts = (page = 1, pageSize = 20) => 
  api.get(`/api/auth/history/?page=${page}&page_size=${pageSize}`);

export const getHistoryFactsByCategory = (category) => 
  api.get(`/api/auth/history/?category=${category}`);

export const getFAQs = (category = '') => 
  api.get(`/api/auth/faq/${category ? `?category=${category}` : ''}`);

export const getFAQ = (id) => 
  api.get(`/api/auth/faq/${id}/`);

export const getMPs = (party = '', search = '') => {
  let url = '/api/auth/mp/';
  const params = new URLSearchParams();
  if (party) params.append('party', party);
  if (search) params.append('search', search);
  if (params.toString()) url += `?${params.toString()}`;
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