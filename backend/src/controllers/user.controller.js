import prisma from '../config/database.js';
import { calculateBadge } from '../utils/badges.js';

/**
 * Get all users (Admin only)
 * GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totalPoints: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const usersWithBadges = users.map(user => ({
      ...user,
      badge: calculateBadge(user.totalPoints)
    }));
    
    res.json({
      success: true,
      data: usersWithBadges
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (Admin only)
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        totalPoints: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }
    
    res.json({
      success: true,
      data: {
        ...user,
        badge: calculateBadge(user.totalPoints)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get leaderboard (top users by points)
 * GET /api/users/leaderboard
 */
export const getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const topUsers = await prisma.user.findMany({
      where: {
        role: 'LEARNER'
      },
      select: {
        id: true,
        name: true,
        totalPoints: true
      },
      orderBy: {
        totalPoints: 'desc'
      },
      take: parseInt(limit)
    });
    
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      ...user,
      badge: calculateBadge(user.totalPoints)
    }));
    
    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get course enrollment statistics (Admin/Instructor)
 * GET /api/users/courses/:courseId/stats
 */
export const getCourseStats = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId, role } = req.user;
    
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: {
        lessons: {
          include: {
            progress: {
              include: {
                user: {
                  select: { id: true, name: true, email: true }
                }
              }
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
    
    // Only course instructor or admin can view stats
    if (role !== 'ADMIN' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }
    
    // Get unique learners
    const learnerIds = new Set();
    const learnerProgress = new Map();
    
    course.lessons.forEach(lesson => {
      lesson.progress.forEach(progress => {
        learnerIds.add(progress.userId);
        
        if (!learnerProgress.has(progress.userId)) {
          learnerProgress.set(progress.userId, {
            userId: progress.userId,
            userName: progress.user.name,
            userEmail: progress.user.email,
            completedLessons: 0
          });
        }
        
        if (progress.isCompleted) {
          learnerProgress.get(progress.userId).completedLessons++;
        }
      });
    });
    
    const totalLessons = course.lessons.length;
    const learners = Array.from(learnerProgress.values()).map(learner => {
      const progressPercentage = totalLessons > 0 ? Math.round((learner.completedLessons / totalLessons) * 100) : 0;
      let status = 'not_started';
      
      if (learner.completedLessons > 0 && learner.completedLessons < totalLessons) {
        status = 'in_progress';
      } else if (learner.completedLessons === totalLessons) {
        status = 'completed';
      }
      
      return {
        ...learner,
        totalLessons,
        progressPercentage,
        status
      };
    });
    
    const stats = {
      totalLearners: learnerIds.size,
      notStarted: learners.filter(l => l.status === 'not_started').length,
      inProgress: learners.filter(l => l.status === 'in_progress').length,
      completed: learners.filter(l => l.status === 'completed').length
    };
    
    res.json({
      success: true,
      data: {
        courseId: course.id,
        courseTitle: course.title,
        stats,
        learners: learners.sort((a, b) => b.progressPercentage - a.progressPercentage)
      }
    });
  } catch (error) {
    next(error);
  }
};
