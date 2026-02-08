import express from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const multer = require('multer');
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

// Memory storage for PDF processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// All authenticated users can view lessons
router.get('/course/:courseId', authenticate, getLessonsByCourse);
router.get('/:id', authenticate, getLessonById);

// Instructor/Admin only routes
router.post('/', authenticate, authorize('instructor', 'admin'), upload.single('file'), createLesson);
router.put('/:id', authenticate, authorize('instructor', 'admin'), upload.single('file'), updateLesson);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteLesson);

export default router;
