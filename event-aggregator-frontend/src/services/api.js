import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token expiration
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const eventAPI = {
  getAll: (filters = {}) => authAPI.get('/events', { params: filters }),
  getById: (id) => authAPI.get(`/events/${id}`),
  create: (eventData) => authAPI.post('/events', eventData),
  update: (id, eventData) => authAPI.put(`/events/${id}`, eventData),
  delete: (id) => authAPI.delete(`/events/${id}`),
  register: (eventId) => authAPI.post(`/events/${eventId}/register`),
  unregister: (eventId) => authAPI.post(`/events/${eventId}/unregister`),
  getMyEvents: () => authAPI.get('/my-events'),
  getFeatured: () => authAPI.get('/events/featured'),
};

export const userAPI = {
  getProfile: () => authAPI.get('/profile'),
  updateProfile: (profileData) => authAPI.put('/profile', profileData),
};

export const notificationAPI = {
  getAll: (unreadOnly = false) => authAPI.get('/notifications', { 
    params: { unread_only: unreadOnly } 
  }),
  markAsRead: (id) => authAPI.put(`/notifications/${id}/read`),
  markAllAsRead: () => authAPI.put('/notifications/read-all'),
};

export const utilAPI = {
  getCategories: () => authAPI.get('/categories'),
  getDepartments: () => authAPI.get('/departments'),
};

export default authAPI;