import express from 'express';
import { getTheme, updateTheme, themeStream } from '../controllers/theme.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getTheme);
router.post('/', authenticate, updateTheme);
router.get('/stream', authenticate, themeStream);

export default router;
