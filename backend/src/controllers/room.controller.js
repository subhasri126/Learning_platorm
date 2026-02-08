import prisma from '../config/database.js';
import { getIo } from '../socket.js';

const rooms = new Map();

const normalizeCode = (code) => String(code || '').trim().toUpperCase();

const generateRoomCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `LS-${code}`;
};

const buildRoomResponse = (room) => ({
  code: room.code,
  quizId: room.quizId,
  hostId: room.hostId,
  players: room.players,
  status: room.status,
  createdAt: room.createdAt,
});

const ensureRoomState = (room) => {
  if (!room.answers) {
    room.answers = {};
  }
  if (!room.scores) {
    room.scores = {};
  }
};

export const createRoom = async (req, res) => {
  const { quizId, playerId, playerName } = req.body;

  if (!quizId) {
    return res.status(400).json({
      success: false,
      message: 'Quiz ID is required.',
    });
  }

  let code = generateRoomCode();
  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const hostPlayer = {
    playerId: playerId || `host-${req.user.userId}`,
    name: playerName || 'Host',
    score: 0,
    progress: 0,
  };

  const room = {
    code,
    quizId,
    hostId: req.user.userId,
    players: [hostPlayer],
    status: 'waiting',
    createdAt: Date.now(),
    answers: {},
    scores: { [hostPlayer.playerId]: 0 },
  };

  rooms.set(code, room);

  return res.status(201).json({
    success: true,
    data: buildRoomResponse(room),
  });
};

export const joinRoom = async (req, res) => {
  const { roomCode, code, playerId, playerName } = req.body;
  const normalizedCode = normalizeCode(roomCode || code);

  if (!normalizedCode) {
    return res.status(400).json({
      success: false,
      message: 'Room code is required.',
    });
  }

  const room = rooms.get(normalizedCode);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired room code.',
    });
  }

  if (room.status === 'ended') {
    return res.status(410).json({
      success: false,
      message: 'Room has already ended.',
    });
  }

  ensureRoomState(room);

  const participantId = playerId || `player-${req.user.userId}`;
  const participantName = playerName || 'Player';

  const exists = room.players.some((player) => player.playerId === participantId);
  if (!exists) {
    room.players.push({
      playerId: participantId,
      name: participantName,
      score: 0,
      progress: 0,
    });
  }

  if (!room.scores[participantId]) {
    room.scores[participantId] = 0;
  }

  getIo().to(normalizedCode).emit('playerJoined', {
    playerId: participantId,
    name: participantName,
    score: 0,
    progress: 0,
  });

  return res.json({
    success: true,
    data: buildRoomResponse(room),
  });
};

export const updateRoomStatus = async (req, res) => {
  const { roomCode, status } = req.body;
  const normalizedCode = normalizeCode(roomCode);

  if (!normalizedCode) {
    return res.status(400).json({
      success: false,
      message: 'Room code is required.',
    });
  }

  const room = rooms.get(normalizedCode);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired room code.',
    });
  }

  const allowed = ['waiting', 'active', 'ended'];
  if (!allowed.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid room status.',
    });
  }

  room.status = status;

  if (status === 'active') {
    getIo().to(normalizedCode).emit('quizStarted');
  } else if (status === 'ended') {
    getIo().to(normalizedCode).emit('quizEnded', { players: room.players });
  } else {
    getIo().to(normalizedCode).emit('state', { started: status === 'active', players: room.players });
  }

  return res.json({
    success: true,
    data: buildRoomResponse(room),
  });
};

export const submitAnswer = async (req, res) => {
  try {
    const { roomCode, questionId, selectedOption, playerId, playerName } = req.body;
    const normalizedCode = normalizeCode(roomCode);

    if (!normalizedCode) {
      return res.status(400).json({ success: false, message: 'Room code is required.' });
    }
    if (!questionId) {
      return res.status(400).json({ success: false, message: 'Question ID is required.' });
    }
    if (selectedOption === undefined || selectedOption === null) {
      return res.status(400).json({ success: false, message: 'Selected option is required.' });
    }

    const room = rooms.get(normalizedCode);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Invalid or expired room code.' });
    }

    if (room.status !== 'active') {
      return res.status(409).json({ success: false, message: 'Room has not started yet.' });
    }

    ensureRoomState(room);

    // Fallback if req.user is missing (e.g. slight auth middleware bypass or edge case)
    const userId = req.user?.userId || 'unknown-user';
    const participantId = playerId || `player-${userId}`;
    const participantName = playerName || 'Player';

    // Verify player is in room (Optional but good practice)
    const playerInRoom = room.players.find(p => p.playerId === participantId);
    if (!playerInRoom) {
      // Auto-add if missing? Or reject?
      // For stability, let's allow submission but it's weird.
      // The prompt says "User not part of room" should be an error message.
      return res.status(403).json({ success: false, message: 'User not part of this room.' });
    }

    if (!room.answers[questionId]) {
      room.answers[questionId] = {};
    }

    if (room.answers[questionId][participantId]) {
      return res.json({
        success: true,
        data: {
          alreadyAnswered: true,
          answers: room.answers[questionId],
          scores: room.scores,
        },
      });
    }

    if (isNaN(parseInt(questionId))) {
      return res.status(400).json({ success: false, message: 'Invalid question ID format.' });
    }

    const question = await prisma.question.findUnique({
      where: { id: parseInt(questionId) },
      select: { id: true, quizId: true, correctAnswer: true, points: true },
    });

    if (!question || question.quizId !== room.quizId) {
      return res.status(404).json({ success: false, message: 'Question not found for this room.' });
    }

    const isCorrect = selectedOption === question.correctAnswer;
    const earned = isCorrect ? question.points || 0 : 0;

    room.answers[questionId][participantId] = {
      playerId: participantId,
      name: participantName,
      selectedOption,
      isCorrect,
      timestamp: Date.now(),
    };

    room.scores[participantId] = (room.scores[participantId] || 0) + earned;

    room.players = room.players.map((player) => (
      player.playerId === participantId
        ? { ...player, score: room.scores[participantId], progress: player.progress }
        : player
    ));

    const payload = {
      answer: room.answers[questionId][participantId],
      answers: room.answers[questionId],
      scores: room.scores,
      correctAnswer: question.correctAnswer,
    };

    try {
      getIo().to(normalizedCode).emit('answerSubmitted', {
        questionId,
        answers: payload.answers,
        correctAnswer: payload.correctAnswer,
        players: room.players,
      });
    } catch (socketError) {
      console.error('Socket emission failed:', socketError);
      // Continue execution, don't fail the request just because socket failed
    }

    return res.json({
      success: true,
      data: payload,
    });
  } catch (error) {
    console.error('Submit Answer Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error processing answer.',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const endRoom = async (req, res) => {
  const { roomCode } = req.body;
  const normalizedCode = normalizeCode(roomCode);

  if (!normalizedCode) {
    return res.status(400).json({
      success: false,
      message: 'Room code is required.',
    });
  }

  const room = rooms.get(normalizedCode);
  if (!room) {
    return res.status(404).json({
      success: false,
      message: 'Invalid or expired room code.',
    });
  }

  room.status = 'ended';

  getIo().to(normalizedCode).emit('quizEnded', { players: room.players });

  return res.json({
    success: true,
    data: buildRoomResponse(room),
  });
};
