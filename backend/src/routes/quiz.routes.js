import express from 'express';
import {
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  addQuestion,
  submitQuizAttempt,
  getQuizAttempts
} from '../controllers/quiz.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// All authenticated users
router.get('/course/:courseId', authenticate, getQuizzesByCourse);
router.get('/:id', authenticate, getQuizById);
router.get('/:id/attempts', authenticate, authorize('LEARNER'), getQuizAttempts);

// Learner routes
router.post('/:id/attempt', authenticate, authorize('LEARNER'), submitQuizAttempt);

// Instructor/Admin only routes
router.post('/', authenticate, authorize('INSTRUCTOR', 'ADMIN'), createQuiz);
router.post('/:id/questions', authenticate, authorize('INSTRUCTOR', 'ADMIN'), addQuestion);

export default router;
