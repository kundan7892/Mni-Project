import { apiClient } from './api';

/**
 * Booking Management API Service
 * Handles rental reservations, status transitions, approvals, and cancellations
 */
export const bookingService = {
  /**
   * Create a new drone reservation (Customer or Admin)
   */
  async createBooking(bookingData) {
    const response = await apiClient('/bookings', {
      method: 'POST',
      body: bookingData
    });
    return response.data?.booking;
  },

  /**
   * Price a rental and check whether the dates are free
   */
  async getQuote({ droneId, startDate, endDate, selectedAddons = [] }) {
    const response = await apiClient.post('/bookings/quote', { droneId, startDate, endDate, selectedAddons });
    return response.data;
  },

  /**
   * Record payment state (shop owner or admin)
   */
  async updatePaymentStatus(id, paymentStatus) {
    const response = await apiClient.patch(`/bookings/${id}/payment`, { paymentStatus });
    return response.data?.booking;
  },

  /**
   * Get list of bookings scoped by user role (Customer, Shop Owner, or Admin)
   */
  async getBookings(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.status && params.status !== 'All' && params.status !== 'all') {
      queryParams.append('status', params.status);
    }
    if (params.search) queryParams.append('search', params.search);
    if (params.droneId) queryParams.append('droneId', params.droneId);
    if (params.customerId) queryParams.append('customerId', params.customerId);
    if (params.ownerId) queryParams.append('ownerId', params.ownerId);
    if (params.paymentStatus) queryParams.append('paymentStatus', params.paymentStatus);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';

    const response = await apiClient(endpoint, { method: 'GET' });
    return response.data;
  },

  /**
   * Get single booking details by MongoDB ID or bookingNumber (e.g. DRN-8492)
   */
  async getBookingById(id) {
    const response = await apiClient(`/bookings/${id}`, { method: 'GET' });
    return response.data?.booking;
  },

  /**
   * Approve or reject a booking (Shop Owner or Admin)
   */
  async updateBookingStatus(id, status, note = '') {
    const response = await apiClient(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: { status, rejectionReason: note, note }
    });
    return response.data?.booking;
  },

  /**
   * Cancel an eligible reservation
   */
  async cancelBooking(id, reason = 'Cancelled by user') {
    const response = await apiClient(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: { reason }
    });
    return response.data?.booking;
  }
};

export default bookingService;

