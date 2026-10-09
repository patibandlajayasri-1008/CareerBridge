import api from './api';

export const authService = {
  /**
   * Register a new student account
   */
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('careerbridge_token', res.data.token);
    }
    return res;
  },

  /**
   * Sign in with email and password
   */
  async login(credentials) {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('careerbridge_token', res.data.token);
    }
    return res;
  },

  /**
   * Sign out and clear session
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('careerbridge_token');
    }
  },

  /**
   * Get current authenticated user profile
   */
  async getMe() {
    return api.get('/auth/me');
  },
};
