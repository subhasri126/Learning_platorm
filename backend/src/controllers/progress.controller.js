import prisma from '../config/database.js';
import { calculateBadge } from '../utils/badges.js';

/**
 * Mark lesson as completed
 * POST /api/progress/lessons/:lessonId/complete
 */
export const markLessonComplete = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.user;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) }
    });
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.'
      });
    }
    
    // Create or update progress
    const progress = await prisma.lessonProgress.upsert({
      where: {
        lessonId_userId: {
          lessonId: parseInt(lessonId),
          userId
        }
      },
      update: {
        isCompleted: true,
        completedAt: new Date()
      },
      create: {
        lessonId: parseInt(lessonId),
        userId,
        isCompleted: true,
        completedAt: new Date()
      }
    });
    
    res.json({
      success: true,
      message: 'Lesson marked as completed.',
      data: progress
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get learner dashboard with overall progress
 * GET /api/progress/dashboard
 */
export const getDashboard = async (req, res, next) => {
  try {
    const { userId } = req.user;
    
    // Get user with total points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalPoints: true }
    });
    
    // Calculate badge
    const badge = calculateBadge(user.totalPoints);
    
    // Get enrolled courses (courses with progress)
    const enrolledCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
        lessons: {
          some: {
            progress: {
              some: {
                userId
              }
            }
          }
        }
      },
      include: {
        instructor: {
          select: { name: true }
        },
        lessons: {
          include: {
            progress: {
              where: { userId }
            }
          }
        },
        _count: {
          select: { lessons: true }
        }
      }
    });
    
    // Calculate progress for each course
    const coursesWithProgress = enrolledCourses.map(course => {
      const completedLessons = course.lessons.filter(
        l => l.progress.length > 0 && l.progress[0].isCompleted
      ).length;
      const totalLessons = course._count.lessons;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      
      return {
        id: course.id,
        title: course.title,
        instructor: course.instructor.name,
        completedLessons,
        totalLessons,
        progressPercentage,
        status: completedLessons === 0 ? 'not_started' : completedLessons === totalLessons ? 'completed' : 'in_progress'
      };
    });
    
    // Get recent quiz attempts
    const recentAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        quiz: {
          select: {
            title: true,
            maxPoints: true
          }
        }
      }
    });
    
    res.json({
      success: true,
      data: {
        user: {
          totalPoints: user.totalPoints,
          badge
        },
        courses: coursesWithProgress,
        recentQuizAttempts: recentAttempts,
        stats: {
          coursesInProgress: coursesWithProgress.filter(c => c.status === 'in_progress').length,
          coursesCompleted: coursesWithProgress.filter(c => c.status === 'completed').length,
          totalQuizAttempts: recentAttempts.length
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed progress for a specific course
 * GET /api/progress/courses/:courseId
 */
export const getCourseDetailedProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;
    
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        lessons: {
          include: {
            progress: {
              where: { userId }
            }
          },
          orderBy: { order: 'asc' }
        },
        quizzes: {
          include: {
            attempts: {
              where: { userId },
              orderBy: { attemptNumber: 'desc' },
              take: 1
            }
          }
        }
      }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }
    
    const lessonsProgress = course.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      order: lesson.order,
      isCompleted: lesson.progress.length > 0 ? lesson.progress[0].isCompleted : false,
      completedAt: lesson.progress.length > 0 ? lesson.progress[0].completedAt : null
    }));
    
    const quizzesProgress = course.quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      attempts: quiz.attempts.length,
      bestScore: quiz.attempts.length > 0 ? quiz.attempts[0].score : null
    }));
    
    const completedLessons = lessonsProgress.filter(l => l.isCompleted).length;
    const totalLessons = lessonsProgress.length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    
    res.json({
      success: true,
      data: {
        courseId: course.id,
        courseTitle: course.title,
        progressPercentage,
        completedLessons,
        totalLessons,
        lessons: lessonsProgress,
        quizzes: quizzesProgress
      }
    });
  } catch (error) {
    next(error);
  }
};
