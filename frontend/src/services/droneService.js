import { apiClient } from './api';

/**
 * Drone Management API Service
 * Handles CRUD operations, filtering, search, and pagination for drones
 */
export const droneService = {
  /**
   * Get all drones with optional search, filters, and pagination
   */
  async getDrones(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.search) queryParams.append('search', params.search);
    if (params.brand && params.brand !== 'All' && params.brand !== 'All Brands') {
      queryParams.append('brand', params.brand);
    }
    if (params.status && params.status !== 'All' && params.status !== 'All Statuses') {
      queryParams.append('status', params.status);
    }
    if (params.category && params.category !== 'All' && params.category !== 'All Categories') {
      queryParams.append('category', params.category);
    }
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.ownerId) queryParams.append('ownerId', params.ownerId);
    if (params.includeUnlisted) queryParams.append('includeUnlisted', 'true');

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/drones?${queryString}` : '/drones';

    const response = await apiClient(endpoint, { method: 'GET' });
    return response.data;
  },

  /**
   * Get single drone by MongoDB ID or Model ID
   */
  async getDroneById(id) {
    const response = await apiClient(`/drones/${id}`, { method: 'GET' });
    return response.data?.drone;
  },

  /**
   * Date ranges already reserved (approved or active rentals)
   */
  async getAvailability(id) {
    const response = await apiClient(`/drones/${id}/availability`, { method: 'GET' });
    return response.data?.reserved || [];
  },

  /**
   * Add a new drone to the fleet (Shop Owner or Admin)
   */
  async createDrone(droneData) {
    const response = await apiClient('/drones', {
      method: 'POST',
      body: droneData
    });
    return response.data?.drone;
  },

  /**
   * Update an existing drone in the fleet
   */
  async updateDrone(id, droneData) {
    const response = await apiClient(`/drones/${id}`, {
      method: 'PUT',
      body: droneData
    });
    return response.data?.drone;
  },

  /**
   * Delete a drone from the fleet
   */
  async deleteDrone(id) {
    const response = await apiClient(`/drones/${id}`, {
      method: 'DELETE'
    });
    return response;
  }
};

export default droneService;

