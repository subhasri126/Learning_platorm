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
router.get('/:id/progress', authenticate, authorize('user'), getCourseProgress);

// Instructor/Admin only routes
router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);
router.put('/:id', authenticate, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);

export default router;
