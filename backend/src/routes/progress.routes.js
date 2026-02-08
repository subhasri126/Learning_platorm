import express from 'express';
import {
  markLessonComplete,
  getDashboard,
  getCourseDetailedProgress
} from '../controllers/progress.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Learner routes (also allow instructors/admins for demo purposes)
router.post('/lessons/:lessonId/complete', authenticate, markLessonComplete);
router.get('/dashboard', authenticate, authorize('user'), getDashboard);
router.get('/courses/:courseId', authenticate, getCourseDetailedProgress);

export default router;
