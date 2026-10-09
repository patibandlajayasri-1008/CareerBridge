import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Centralized Axios Instance
 * withCredentials: true ensures HttpOnly session cookies are transmitted automatically
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second network timeout
});

// Request Interceptor: Attach token fallback if available in localStorage
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('careerbridge_token');
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Ignore localStorage access errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Standardize error extraction
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'Unable to communicate with the server. Please check your connection.',
      status: error.response?.status || 500,
      errors: error.response?.data?.errors || null,
      isNetworkError: !error.response,
    };
    return Promise.reject(customError);
  }
);

export default api;
