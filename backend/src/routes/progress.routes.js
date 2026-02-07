import express from 'express';
import {
  markLessonComplete,
  getDashboard,
  getCourseDetailedProgress
} from '../controllers/progress.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Learner routes
router.post('/lessons/:lessonId/complete', authenticate, authorize('LEARNER'), markLessonComplete);
router.get('/dashboard', authenticate, authorize('LEARNER'), getDashboard);
router.get('/courses/:courseId', authenticate, authorize('LEARNER'), getCourseDetailedProgress);

export default router;
