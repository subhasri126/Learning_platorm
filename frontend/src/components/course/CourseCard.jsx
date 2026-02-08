import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, meta, isInstructor }) => {
  const difficulty = meta?.difficulty;
  const duration = meta?.duration;
  const xpPreview = meta?.xpPreview;
  const status = meta?.status;

  let actionLabel = 'Start';
  if (isInstructor) {
    actionLabel = 'Manage';
  } else if (status === 'Completed') {
    actionLabel = 'Review';
  } else if (status === 'Continue') {
    actionLabel = 'Continue';
  }

  return (
    <div className="card hover:shadow-xl transition-shadow border border-dark-700/70 bg-dark-800/70 flex flex-col h-full group">
      <Link to={`/courses/${course.id}`} className="flex-grow">
        {course.thumbnail && (
          <div className="overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover transition-transform group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
          {!course.isPublished && (
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full flex-shrink-0 ml-2">
              Draft
            </span>
          )}
        </div>
        <p className="text-gray-300 text-sm mb-4 line-clamp-2">
          {course.description || 'Build skills you can apply immediately.'}
        </p>

        {(difficulty || duration || xpPreview || status) && (
          <div className="flex flex-wrap gap-2 text-xs mb-4">
            {difficulty && (
              <span className="px-2 py-1 rounded-full bg-dark-700/80 text-gray-300">
                {difficulty}
              </span>
            )}
            {duration && (
              <span className="px-2 py-1 rounded-full bg-dark-700/80 text-gray-300">
                ⏱️ {duration}
              </span>
            )}
            {xpPreview !== undefined && (
              <span className="px-2 py-1 rounded-full bg-dark-700/80 text-gray-300">
                ⚡ {xpPreview} XP
              </span>
            )}
            {status && !isInstructor && (
              <span className="px-2 py-1 rounded-full bg-dark-700/80 text-gray-300">
                {status}
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-700">
        <div className="text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span>📚 {course._count?.lessons || 0}</span>
            <span>❓ {course._count?.quizzes || 0}</span>
          </div>
        </div>
        <Link
          to={`/courses/${course.id}`}
          className={`text-xs px-4 py-2 font-semibold rounded-lg transition-colors ${isInstructor
            ? 'bg-dark-700 text-white hover:bg-dark-600 border border-dark-600'
            : 'btn-primary'
            }`}
        >
          {actionLabel}
        </Link>
      </div>
      {course.instructor && (
        <div className="text-xs text-gray-500 mt-2 text-right">
          by {course.instructor.name}
        </div>
      )}
    </div>
  );
};

export default CourseCard;
