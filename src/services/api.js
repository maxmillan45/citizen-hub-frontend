import axios from 'axios';

const API_URL = 'https://citizen-hub-kenya-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  // Public endpoints that don't need authentication
  const publicEndpoints = [
    '/api/auth/history/',
    '/api/auth/faq/',
    '/api/auth/mp/',
    '/api/auth/events/',
    '/api/constitution/',
    '/health/',
    '/api/auth/test-success/',
    '/api/auth/register/',
    '/api/auth/login/',
    '/api/auth/stk/request/',
    '/api/auth/stk/query/'
  ];
  
  const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));
  
  if (!isPublic) {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// STK Push Authentication endpoints (ADD THESE)
export const initiateSTKPush = (phone_number) => 
  api.post('/api/auth/stk/request/', { phone_number });

export const checkSTKStatus = (checkout_request_id) => 
  api.post('/api/auth/stk/query/', { checkout_request_id });

// Authentication endpoints
export const register = (phone_number) => api.post('/api/auth/register/', { phone_number });
export const login = (phone_number) => api.post('/api/auth/login/', { phone_number });
export const getProfile = () => api.get('/api/auth/profile/');
export const testAuth = (phone_number) => api.post('/api/auth/test-success/', { phone_number });

// Constitution endpoints (public)
export const searchConstitution = (query) => api.get(`/api/constitution/search/?q=${query}`);
export const getArticle = (number) => api.get(`/api/constitution/article/${number}/`);

// Chatbot endpoints (requires auth)
export const askChatbot = (question, language) => api.post('/api/chatbot/ask/', { question, language });
export const getChatHistory = () => api.get('/api/chatbot/history/');

// Did You Know - History (public)
export const getHistoryFacts = () => api.get('/api/auth/history/');
export const getRandomFact = () => api.get('/api/auth/history/random/');

// FAQ (public)
export const getFAQs = (category) => api.get(`/api/auth/faq/${category ? `?category=${category}` : ''}`);

// MP Scorecard (public)
export const getMPs = () => api.get('/api/auth/mp/');

// Public Events (public)
export const getEvents = () => api.get('/api/auth/events/');

// Crime Reporting (requires auth)
export const submitCrimeReport = (data) => api.post('/api/auth/crime/', data);
export const getMyReports = () => api.get('/api/auth/crime/');

export default api;
