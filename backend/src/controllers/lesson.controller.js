import prisma from '../config/database.js';

/**
 * Get all lessons for a course
 * GET /api/lessons/course/:courseId
 */
export const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId, role } = req.user;
    
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found.'
      });
    }
    
    // Learners can only see published courses
    if (role === 'LEARNER' && !course.isPublished) {
      return res.status(403).json({
        success: false,
        message: 'Course not available.'
      });
    }
    
    const lessons = await prisma.lesson.findMany({
      where: { courseId: parseInt(courseId) },
      include: {
        progress: {
          where: { userId },
          select: { isCompleted: true, completedAt: true }
        }
      },
      orderBy: { order: 'asc' }
    });
    
    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get lesson by ID
 * GET /api/lessons/:id
 */
export const getLessonById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: {
        course: true,
        progress: {
          where: { userId }
        }
      }
    });
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.'
      });
    }
    
    res.json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new lesson (Instructor/Admin only)
 * POST /api/lessons
 */
export const createLesson = async (req, res, next) => {
  try {
    const { title, description, content, type, order, duration, courseId } = req.body;
    const { userId, role } = req.user;
    
    if (!title || !content || !type || !courseId) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, type, and courseId are required.'
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
    
    if (role !== 'ADMIN' && course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to add lessons to this course.'
      });
    }
    
    // Get next order number if not provided
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId: parseInt(courseId) },
        orderBy: { order: 'desc' }
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }
    
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        type,
        order: lessonOrder,
        duration,
        courseId: parseInt(courseId)
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Lesson created successfully.',
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update lesson (Instructor/Admin only)
 * PUT /api/lessons/:id
 */
export const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, content, type, order, duration } = req.body;
    const { userId, role } = req.user;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: { course: true }
    });
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.'
      });
    }
    
    if (role !== 'ADMIN' && lesson.course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this lesson.'
      });
    }
    
    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(content && { content }),
        ...(type && { type }),
        ...(order && { order }),
        ...(duration !== undefined && { duration })
      }
    });
    
    res.json({
      success: true,
      message: 'Lesson updated successfully.',
      data: updatedLesson
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete lesson (Instructor/Admin only)
 * DELETE /api/lessons/:id
 */
export const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(id) },
      include: { course: true }
    });
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found.'
      });
    }
    
    if (role !== 'ADMIN' && lesson.course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this lesson.'
      });
    }
    
    await prisma.lesson.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({
      success: true,
      message: 'Lesson deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
