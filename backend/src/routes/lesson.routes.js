import express from 'express';
import {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} from '../controllers/lesson.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All authenticated users can view lessons
router.get('/course/:courseId', authenticate, getLessonsByCourse);
router.get('/:id', authenticate, getLessonById);

// Instructor/Admin only routes
router.post('/', authenticate, authorize('INSTRUCTOR', 'ADMIN'), createLesson);
router.put('/:id', authenticate, authorize('INSTRUCTOR', 'ADMIN'), updateLesson);
router.delete('/:id', authenticate, authorize('INSTRUCTOR', 'ADMIN'), deleteLesson);

export default router;
