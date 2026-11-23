import express from 'express';
import { getAnalytics, getUsers, setUserActive } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Owners get analytics scoped to their own fleet
router.get('/analytics', authorize('admin', 'owner'), getAnalytics);

router.get('/users', authorize('admin'), getUsers);
router.patch('/users/:id/status', authorize('admin'), setUserActive);

export default router;
