import express from 'express';
import { createDoubt, getDoubts } from '../controllers/doubt.controller.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

router.post('/', authenticate, authorize('user'), createDoubt);
router.get('/', authenticate, authorize('instructor', 'admin'), getDoubts);

export default router;
