import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, meta }) => {
  const difficulty = meta?.difficulty;
  const duration = meta?.duration;
  const xpPreview = meta?.xpPreview;
  const status = meta?.status;

  return (
    <div className="card hover:shadow-xl transition-shadow">
      {course.thumbnail && (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg -mt-6 -mx-6 mb-4"
        />
      )}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
        {!course.isPublished && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
            Draft
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {course.description || 'Build skills you can apply immediately.'}
      </p>

      {(difficulty || duration || xpPreview || status) && (
        <div className="flex flex-wrap gap-2 text-xs mb-4">
          {difficulty && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {difficulty}
            </span>
          )}
          {duration && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              ⏱️ {duration}
            </span>
          )}
          {xpPreview !== undefined && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              ⚡ {xpPreview} XP
            </span>
          )}
          {status && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {status}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <span className="mr-3">📚 {course._count?.lessons || 0} lessons</span>
          <span>❓ {course._count?.quizzes || 0} quizzes</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          by {course.instructor?.name || 'Instructor'}
        </span>
        <Link
          to={`/courses/${course.id}`}
          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
