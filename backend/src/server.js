import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import courseRoutes from './routes/course.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import progressRoutes from './routes/progress.routes.js';
import userRoutes from './routes/user.routes.js';
import doubtRoutes from './routes/doubt.routes.js';
import themeRoutes from './routes/theme.routes.js';
import roomRoutes from './routes/room.routes.js';

dotenv.config();

import { createServer } from 'http';
import { initSocket } from './socket.js';

// ... (existing helper imports if any, keeping them) 

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'LearnSphere API is running',
    timestamp: new Date().toISOString()
  });
});

// ... (rest of the file)

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doubts', doubtRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/rooms', roomRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler (must be last)
app.use(errorHandler);

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 BACKEND SERVER RUNNING');
  console.log('='.repeat(60));
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 API Base: http://localhost:${PORT}`);
  console.log(`✅ Health: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📚 Courses: http://localhost:${PORT}/api/courses`);
  console.log('='.repeat(60));
  console.log('💡 Frontend: http://localhost:3000');
  console.log('='.repeat(60) + '\n');
});
