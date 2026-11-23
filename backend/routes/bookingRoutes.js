import express from 'express';
import {
  quoteBooking,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  validateCreateBooking,
  validateUpdateBookingStatus
} from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/quote', validateCreateBooking, quoteBooking);
router.post('/', validateCreateBooking, createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);

router.patch(
  '/:id/status',
  authorize('owner', 'shop-owner', 'admin', 'super-admin'),
  validateUpdateBookingStatus,
  updateBookingStatus
);

router.patch(
  '/:id/payment',
  authorize('owner', 'shop-owner', 'admin', 'super-admin'),
  updatePaymentStatus
);

router.patch('/:id/cancel', cancelBooking);

export default router;
