import { apiClient } from './api';

/**
 * Authentication Service
 * Communicates with backend /api/auth endpoints
 */
export const authService = {
  /**
   * Log in user with credentials
   */
  async login(email, password, role) {
    const response = await apiClient('/auth/login', {
      method: 'POST',
      body: { email, password, role }
    });

    if (response?.data?.token) {
      localStorage.setItem('dronehub_token', response.data.token);
    }

    return response.data;
  },

  /**
   * Register a new user
   */
  async register(userData) {
    const payload = {
      name: userData.fullName || userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      role: userData.role || 'customer'
    };

    const response = await apiClient('/auth/register', {
      method: 'POST',
      body: payload
    });

    if (response?.data?.token) {
      localStorage.setItem('dronehub_token', response.data.token);
    }

    return response.data;
  },

  /**
   * Fetch current authenticated user's profile from database
   */
  async getProfile() {
    const response = await apiClient('/auth/me', {
      method: 'GET'
    });
    return response.data?.user;
  },

  /**
   * Signed-in user cached in localStorage (or null)
   */
  getStoredUser() {
    try {
      return JSON.parse(localStorage.getItem('dronehub_user') || 'null');
    } catch {
      return null;
    }
  },

  /**
   * Log out user & clear saved token
   */
  async logout() {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('dronehub_token');
      localStorage.removeItem('dronehub_user');
    }
  }
};

export default authService;

