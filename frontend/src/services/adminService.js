import { apiClient } from './api';

export const adminService = {
  async getAnalytics(months = 6) {
    const response = await apiClient.get('/admin/analytics', { params: { months } });
    return response.data;
  },

  async getUsers(params = {}) {
    const response = await apiClient.get('/admin/users', { params });
    return response.data?.users || [];
  },

  async setUserActive(id, isActive) {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { isActive });
    return response.data?.user;
  }
};

export default adminService;
