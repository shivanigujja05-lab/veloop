import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    // Check for admin token if calling admin route, otherwise user token
    const isAdminRoute = config.url && config.url.includes('/admin');
    const token = isAdminRoute
      ? localStorage.getItem('veloop_admin_token') || localStorage.getItem('veloop_token')
      : localStorage.getItem('veloop_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || error.message || 'Network error occurred';

    // If 401 Unauthorized, dispatch event or handle token cleanup
    if (status === 401) {
      const isCurrentAdmin = window.location.pathname.startsWith('/admin');
      if (isCurrentAdmin) {
        localStorage.removeItem('veloop_admin_token');
        localStorage.removeItem('veloop_admin');
      } else {
        localStorage.removeItem('veloop_token');
        localStorage.removeItem('veloop_user');
      }
    }

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;

