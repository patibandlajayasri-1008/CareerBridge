import api, { API_BASE_URL } from './api';

export const userService = {
  /**
   * Fetch profile data of currently authenticated user
   */
  async getProfile() {
    return api.get('/users/profile');
  },

  /**
   * Update student profile fields (college, degree, skills, preferredRole, etc.)
   */
  async updateProfile(profileData) {
    return api.put('/users/profile', profileData);
  },

  /**
   * Upload verified PDF resume file (Student)
   */
  async uploadResume(formData) {
    return api.post('/users/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Remove current resume from student profile
   */
  async deleteResume() {
    return api.delete('/users/resume');
  },

  /**
   * Construct authorized download/streaming URL for resume
   */
  getResumeDownloadUrl(fileName) {
    if (!fileName) return null;
    return `${API_BASE_URL}/users/resume/${encodeURIComponent(fileName)}`;
  },
};
