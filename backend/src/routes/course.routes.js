import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseProgress
} from '../controllers/course.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Public/authenticated routes
router.get('/', authenticate, getAllCourses);
router.get('/:id', authenticate, getCourseById);
router.get('/:id/progress', authenticate, authorize('LEARNER'), getCourseProgress);

// Instructor/Admin only routes
router.post('/', authenticate, authorize('INSTRUCTOR', 'ADMIN'), createCourse);
router.put('/:id', authenticate, authorize('INSTRUCTOR', 'ADMIN'), updateCourse);
router.delete('/:id', authenticate, authorize('INSTRUCTOR', 'ADMIN'), deleteCourse);

export default router;
