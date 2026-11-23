import express from 'express';
import {
  createDrone,
  getDrones,
  getDroneById,
  updateDrone,
  deleteDrone,
  getDroneAvailability
} from '../controllers/droneController.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';
import {
  validateCreateDrone,
  validateUpdateDrone
} from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * Public Routes: Browse and inspect drones
 */
router.get('/', optionalAuth, getDrones);
router.get('/:id/availability', getDroneAvailability);
router.get('/:id', getDroneById);

/**
 * Protected Routes: Manage drone fleet (Shop Owner & Admin only)
 */
router.post(
  '/',
  protect,
  authorize('owner', 'shop-owner', 'admin', 'super-admin'),
  validateCreateDrone,
  createDrone
);

router.put(
  '/:id',
  protect,
  authorize('owner', 'shop-owner', 'admin', 'super-admin'),
  validateUpdateDrone,
  updateDrone
);

router.delete(
  '/:id',
  protect,
  authorize('owner', 'shop-owner', 'admin', 'super-admin'),
  deleteDrone
);

export default router;

