import prisma from '../config/database.js';

/**
 * Get all lessons for a course
 * GET /api/lessons/course/:courseId
 */
export const getLessonsByCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { userId, role } = req.user;
    const normalizedRole = (role || '').toLowerCase();

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
    if (normalizedRole === 'user' && !course.isPublished) {
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

import { processPdf } from '../utils/pdfProcessor.js';

// ... (existing imports)

// ... (getLessonsByCourse, getLessonById remain same)

/**
 * Create a new lesson (Instructor/Admin only)
 * POST /api/lessons
 * Supports multipart/form-data for PDF uploads
 */
export const createLesson = async (req, res, next) => {
  try {
    // text fields are in req.body, file in req.file
    let { title, unitTitle, description, content, type, order, duration, courseId, manualContent } = req.body;
    const { userId, role } = req.user;
    const normalizedRole = (role || '').toLowerCase();

    // Type coercion for multipart/form-data
    if (order) order = parseInt(order);
    if (duration) duration = parseInt(duration);
    if (courseId) courseId = parseInt(courseId);

    if (!title || !type || !courseId) {
      console.log('❌ Validation failed:');
      console.log('  title:', title);
      console.log('  type:', type);
      console.log('  courseId:', courseId);
      console.log('  Full body:', req.body);
      return res.status(400).json({
        success: false,
        message: `Title, type, and courseId are required. Missing: ${!title ? 'title ' : ''}${!type ? 'type ' : ''}${!courseId ? 'courseId' : ''}`
      });
    }

    if (type !== 'PDF' && !content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required for non-PDF lessons.'
      });
    }

    // Verify course exists and user has permission
    const course = await prisma.course.findUnique({
      where: { id: courseId }
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
        message: 'You do not have permission to add lessons to this course.'
      });
    }

    let structuredContent = null;
    let finalContent = content || 'file_upload';

    // Handle PDF Upload
    // Handle PDF Upload
    if (type === 'PDF' && req.file) {
      try {
        const pdfResult = await processPdf(req.file.buffer);
        structuredContent = { ...pdfResult, manualContent: manualContent || '' };
        finalContent = req.file.originalname;
      } catch (err) {
        // Even if critical failure (shouldn't happen due to failsafe), save manual content
        console.error("Critical PDF processing error:", err);
        structuredContent = { manualContent: manualContent || '', sections: [] };
        finalContent = req.file.originalname;
      }
    } else if (type === 'PDF' && !req.file && manualContent) {
      // Allow PDF type logic with JUST manual content (edge case)
      structuredContent = { manualContent, sections: [] };
      finalContent = "Manual Content Only";
    } else if (type === 'PDF' && !req.file && !content) {
      return res.status(400).json({
        success: false,
        message: 'PDF file is required.'
      });
    }

    // Get next order number if not provided
    let lessonOrder = order;
    if (!lessonOrder) {
      const lastLesson = await prisma.lesson.findFirst({
        where: { courseId: courseId },
        orderBy: { order: 'desc' }
      });
      lessonOrder = lastLesson ? lastLesson.order + 1 : 1;
    }

    // Map 'PDF' to 'DOCUMENT' for database compatibility
    const dbType = type === 'PDF' ? 'DOCUMENT' : type;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        unitTitle,
        description,
        content: finalContent,
        structuredContent: structuredContent || undefined,
        type: dbType,
        order: lessonOrder,
        duration,
        courseId: courseId
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
    let { title, unitTitle, description, content, type, order, duration, manualContent } = req.body;
    const { userId, role } = req.user;
    const normalizedRole = (role || '').toLowerCase();

    // Type coercion
    if (order) order = parseInt(order);
    if (duration) duration = parseInt(duration);

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

    if (normalizedRole !== 'admin' && lesson.course.instructorId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this lesson.'
      });
    }

    let structuredContent = undefined;

    if (type === 'PDF' && req.file) {
      try {
        console.log(`📂 Processing PDF: ${req.file.originalname} (${req.file.size} bytes)`);
        const pdfResult = await processPdf(req.file.buffer);
        structuredContent = { ...pdfResult, manualContent: manualContent || '' };
        content = req.file.originalname;
      } catch (err) {
        console.error("Update PDF processing error:", err);
        // Save manual content at minimum
        structuredContent = { manualContent: manualContent || '', sections: [] };
        content = req.file.originalname;
      }
    } else if (type === 'PDF' && manualContent) {
      // If updating with manual content but no new file
      // We need to preserve existing structuredContent sections if any?
      // Actually, updateLesson merges fields. But structuredContent is replaced if provided.
      // If we want to UPDATE manual content without re-uploading PDF, we need to handle that.
      // But for now, let's assume manualContent update implies strict override or addition.

      // Fetch existing lesson to merge? expensive.
      // Let's just set structuredContent with manualContent.
      // Wait, if I don't provide file, structuredContent is undefined (line 236).
      // Check line 258 in original file: `...(structuredContent && { structuredContent }),`.
      // So if I don't set it here, it won't update.
      // If I want to update manualContent, I must set structuredContent.

      // Strategy: If manualContent is provided but NO file, we likely want to keep existing sections?
      // OR we just want to update manual content.
      // Since we can't easily merge without fetching, and we fetched lesson at line 217.
      // We can merge!

      const existingStructure = lesson.structuredContent || {};
      structuredContent = { ...existingStructure, manualContent };
    }

    // Map 'PDF' to 'DOCUMENT' for database compatibility
    const dbType = type === 'PDF' ? 'DOCUMENT' : type;

    // Truncate content if it's too long (since schema is VARCHAR(191))
    if (content && content.length > 190) {
      console.warn("⚠️ Truncating content field to 190 chars to avoid DB overflow");
      content = content.substring(0, 190);
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(unitTitle !== undefined && { unitTitle }),
        ...(description !== undefined && { description }),
        ...(content && { content }),
        ...(structuredContent && { structuredContent }),
        ...(type && { type: dbType }),
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
    const normalizedRole = (role || '').toLowerCase();

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

    if (normalizedRole !== 'admin' && lesson.course.instructorId !== userId) {
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
