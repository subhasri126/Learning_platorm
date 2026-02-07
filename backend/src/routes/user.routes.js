import express from 'express';
import {
  getAllUsers,
  getUserById,
  getLeaderboard,
  getCourseStats
} from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Public authenticated routes
router.get('/leaderboard', authenticate, getLeaderboard);

// Admin only routes
router.get('/', authenticate, authorize('ADMIN'), getAllUsers);
router.get('/:id', authenticate, authorize('ADMIN'), getUserById);

// Instructor/Admin routes
router.get('/courses/:courseId/stats', authenticate, authorize('INSTRUCTOR', 'ADMIN'), getCourseStats);

export default router;
