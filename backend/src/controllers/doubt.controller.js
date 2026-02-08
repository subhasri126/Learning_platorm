import prisma from '../config/database.js';

let doubts = [];
let nextId = 1;

/**
 * Create a new learner doubt
 * POST /api/doubts
 */
export const createDoubt = async (req, res, next) => {
  try {
    const { courseId, question } = req.body;
    const { userId } = req.user;

    if (!courseId || !question) {
      return res.status(400).json({
        success: false,
        message: 'courseId and question are required.'
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      select: { id: true, title: true, instructorId: true }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    const record = {
      id: nextId++,
      courseId: course.id,
      courseTitle: course.title,
      instructorId: course.instructorId,
      question: question.trim(),
      userId,
      createdAt: new Date().toISOString()
    };

    doubts = [record, ...doubts];

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get doubts for instructor/admin
 * GET /api/doubts
 */
export const getDoubts = async (req, res, next) => {
  try {
    const { role, userId } = req.user;

    let filtered = doubts;
    if (role === 'INSTRUCTOR') {
      filtered = doubts.filter((doubt) => doubt.instructorId === userId);
    }

    res.json({
      success: true,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
};
