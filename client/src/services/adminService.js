import api from './api';

export const adminService = {
  /**
   * Fetch aggregate placement metrics, application status breakdown, and recent activity
   */
  async getStats() {
    return api.get('/admin/stats');
  },
};
