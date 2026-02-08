import prisma from '../config/database.js';

/**
 * Get all courses (published for learners, all for instructors/admin)
 * GET /api/courses
 */
export const getAllCourses = async (req, res, next) => {
  try {
    const { role, userId } = req.user;

    const normalizedRole = role.toLowerCase();
    const where = normalizedRole === 'user' ? { isPublished: true } : {};

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { lessons: true, quizzes: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get course by ID
 * GET /api/courses/:id
 */
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role || 'user';

    if (isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID.'
      });
    }

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        lessons: {
          orderBy: { order: 'asc' }
        },
        quizzes: {
          include: {
            _count: {
              select: { questions: true }
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

    // Learners can only see published courses
    const normalizedRole = userRole.toLowerCase();
    if (normalizedRole === 'user' && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Course not available.'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new course (Instructor/Admin only)
 * POST /api/courses
 */
export const createCourse = async (req, res, next) => {
  try {
    const { title, description, thumbnail } = req.body;
    const { userId } = req.user;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.'
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        instructorId: userId
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully.',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update course (Instructor/Admin only)
 * PUT /api/courses/:id
 */
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, isPublished } = req.body;
    const { userId, role } = req.user;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Only course owner or admin can update
    const normalizedRole = role.toLowerCase();
    if (normalizedRole !== 'admin' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this course.'
      });
    }

    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(isPublished !== undefined && { isPublished })
      },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({
      success: true,
      message: 'Course updated successfully.',
      data: updatedCourse
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete course (Instructor/Admin only)
 * DELETE /api/courses/:id
 */
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }

    // Only course owner or admin can delete
    const normalizedRole = role.toLowerCase();
    if (normalizedRole !== 'admin' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this course.'
      });
    }

    await prisma.course.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Course deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get course progress for current learner
 * GET /api/courses/:id/progress
 */
export const getCourseProgress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
      include: {
        lessons: {
          include: {
            progress: {
              where: { userId }
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

    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(l => l.progress.length > 0 && l.progress[0].isCompleted).length;
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.json({
      success: true,
      data: {
        courseId: course.id,
        totalLessons,
        completedLessons,
        progressPercentage,
        status: completedLessons === 0 ? 'not_started' : completedLessons === totalLessons ? 'completed' : 'in_progress'
      }
    });
  } catch (error) {
    next(error);
  }
};
