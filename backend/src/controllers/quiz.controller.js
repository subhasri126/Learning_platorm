import prisma from '../config/database.js';

/**
 * Get all quizzes for a course
 * GET /api/quizzes/course/:courseId
 */
export const getQuizzesByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    
    const quizzes = await prisma.quiz.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        _count: {
          select: { questions: true }
        }
      }
    });
    
    res.json({
      success: true,
      data: quizzes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get quiz by ID with questions
 * GET /api/quizzes/:id
 */
export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    const normalizedRole = (role || '').toLowerCase();
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            questionText: true,
            options: true,
            points: true,
            order: true,
            // Don't send correct answer to learners
            ...(normalizedRole !== 'user' && { correctAnswer: true })
          }
        }
      }
    });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.'
      });
    }
    
    res.json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new quiz (Instructor/Admin only)
 * POST /api/quizzes
 */
export const createQuiz = async (req, res, next) => {
  try {
    const { title, description, courseId, maxPoints, questions } = req.body;
    const { userId, role } = req.user;
    const normalizedRole = (role || '').toLowerCase();
    
    if (!title || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Title and courseId are required.'
      });
    }
    
    // Verify course exists and user has permission
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }
    
    if (normalizedRole !== 'admin' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add quizzes to this course.'
      });
    }
    
    // Create quiz with questions
    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        courseId: parseInt(courseId),
        maxPoints: maxPoints || 100,
        ...(questions && questions.length > 0 && {
          questions: {
            create: questions.map((q, index) => ({
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer,
              points: q.points || 10,
              order: q.order || index + 1
            }))
          }
        })
      },
      include: {
        questions: true
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add question to quiz (Instructor/Admin only)
 * POST /api/quizzes/:id/questions
 */
export const addQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionText, options, correctAnswer, points, order } = req.body;
    const { userId, role } = req.user;
    const normalizedRole = (role || '').toLowerCase();
    
    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({
        success: false,
        message: 'Question text, options, and correct answer are required.'
      });
    }
    
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: { course: true, questions: true }
    });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.'
      });
    }
    
    if (normalizedRole !== 'admin' && quiz.course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this quiz.'
      });
    }
    
    // Get next order number if not provided
    let questionOrder = order;
    if (!questionOrder) {
      const lastQuestion = quiz.questions[quiz.questions.length - 1];
      questionOrder = lastQuestion ? lastQuestion.order + 1 : 1;
    }
    
    const question = await prisma.question.create({
      data: {
        questionText,
        options,
        correctAnswer,
        points: points || 10,
        order: questionOrder,
        quizId: parseInt(id)
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Question added successfully.',
      data: question
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit quiz attempt (Learner only)
 * POST /api/quizzes/:id/attempt
 */
export const submitQuizAttempt = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body; // { questionId: answer }
    const { userId } = req.user;
    
    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Answers are required.'
      });
    }
    
    // Get quiz with questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: true
      }
    });
    
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.'
      });
    }
    
    // Get previous attempts count
    const previousAttempts = await prisma.quizAttempt.count({
      where: {
        quizId: parseInt(id),
        userId
      }
    });
    
    const attemptNumber = previousAttempts + 1;
    
    // Calculate score with decreasing points per attempt
    let totalScore = 0;
    const results = [];
    
    for (const question of quiz.questions) {
      const userAnswer = answers[question.id.toString()];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        // Decrease points by 10% for each attempt after the first
        const pointsMultiplier = Math.max(0.5, 1 - ((attemptNumber - 1) * 0.1));
        const earnedPoints = Math.round(question.points * pointsMultiplier);
        totalScore += earnedPoints;
        
        results.push({
          questionId: question.id,
          isCorrect: true,
          earnedPoints
        });
      } else {
        results.push({
          questionId: question.id,
          isCorrect: false,
          earnedPoints: 0
        });
      }
    }
    
    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: parseInt(id),
        userId,
        score: totalScore,
        attemptNumber,
        answers
      }
    });
    
    // Update user's total points
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: {
          increment: totalScore
        }
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Quiz attempt submitted successfully.',
      data: {
        attemptId: attempt.id,
        attemptNumber,
        score: totalScore,
        maxPoints: quiz.maxPoints,
        results
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get quiz attempts for current user
 * GET /api/quizzes/:id/attempts
 */
export const getQuizAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: parseInt(id),
        userId
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: attempts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Score quiz answers without saving attempt
 * POST /api/quizzes/:id/score
 */
export const scoreQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Answers are required.'
      });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: true
      }
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found.'
      });
    }

    let totalScore = 0;
    const results = [];

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id.toString()];
      const isCorrect = userAnswer === question.correctAnswer;

      if (isCorrect) {
        totalScore += question.points;
        results.push({ questionId: question.id, isCorrect: true, earnedPoints: question.points });
      } else {
        results.push({ questionId: question.id, isCorrect: false, earnedPoints: 0 });
      }
    }

    res.json({
      success: true,
      data: {
        score: totalScore,
        maxPoints: quiz.maxPoints,
        results
      }
    });
  } catch (error) {
    next(error);
  }
};
