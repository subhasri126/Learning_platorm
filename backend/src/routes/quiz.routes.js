import express from 'express';
import {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  addQuestion,
  submitQuizAttempt,
  getQuizAttempts,
  scoreQuiz
} from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All authenticated users
router.get('/course/:courseId', authenticate, getQuizzesByCourse);
router.get('/:id', authenticate, getQuizById);
router.get('/:id/attempts', authenticate, authorize('user', 'instructor', 'admin'), getQuizAttempts);

// Quiz taking routes - accessible to all roles for testing/learning
router.post('/:id/attempt', authenticate, authorize('user', 'instructor', 'admin'), submitQuizAttempt);
router.post('/:id/score', authenticate, authorize('user', 'instructor', 'admin'), scoreQuiz);

// Instructor/Admin only routes
router.post('/', authenticate, authorize('instructor', 'admin'), createQuiz);
router.post('/:id/questions', authenticate, authorize('instructor', 'admin'), addQuestion);

export default router;
