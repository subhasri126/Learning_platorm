import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createRoom, joinRoom, updateRoomStatus, submitAnswer, endRoom } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/create', authenticate, createRoom);
router.post('/join', authenticate, joinRoom);
router.post('/status', authenticate, updateRoomStatus);
router.post('/answer', authenticate, submitAnswer);
router.post('/end', authenticate, endRoom);

export default router;
