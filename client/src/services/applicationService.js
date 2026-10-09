import api from './api';

export const applicationService = {
  /**
   * Submit application for a job (Student)
   */
  async apply(jobId) {
    return api.post('/applications', { jobId });
  },

  /**
   * Fetch current student's submitted applications (Student)
   */
  async getMyApplications() {
    return api.get('/applications/my');
  },

  /**
   * Fetch application stats breakdown (Student)
   */
  async getStats() {
    return api.get('/applications/stats');
  },

  /**
   * Fetch all student applications across drives (Admin)
   */
  async getAdminApplications(params = {}) {
    return api.get('/applications/admin', { params });
  },

  /**
   * Update student application recruitment status and append history note (Admin)
   */
  async updateApplicationStatus(id, { status, note }) {
    return api.patch(`/applications/${id}/status`, { status, note });
  },
};
