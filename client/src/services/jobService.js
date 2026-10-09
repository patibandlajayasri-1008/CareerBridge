import api from './api';

export const jobService = {
  /**
   * Fetch published campus opportunities with search and filter parameters
   */
  async getJobs(params = {}) {
    return api.get('/jobs', { params });
  },

  /**
   * Fetch single job listing specifications
   */
  async getJobById(id) {
    return api.get(`/jobs/${id}`);
  },

  /**
   * Create a new campus placement drive (Admin)
   */
  async createJob(jobData) {
    return api.post('/jobs', jobData);
  },

  /**
   * Update an existing job listing (Admin)
   */
  async updateJob(id, jobData) {
    return api.put(`/jobs/${id}`, jobData);
  },

  /**
   * Delete or archive a job listing (Admin)
   */
  async deleteJob(id) {
    return api.delete(`/jobs/${id}`);
  },
};
