import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonAPI } from '../../api/lesson.api';
import { progressAPI } from '../../api/progress.api';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

const LessonView = () => {
  const { id } = useParams();
  const { isLearner } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const response = await lessonAPI.getById(id);
      setLesson(response.data.data);
    } catch (err) {
      setError('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      await progressAPI.markLessonComplete(id);
      fetchLesson(); // Refresh to show completion status
      alert('Lesson marked as complete! ✅');
    } catch (err) {
      setError('Failed to mark lesson as complete');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <Loading />;
  if (!lesson) return <div className="text-center py-12">Lesson not found</div>;

  const isCompleted = lesson.progress && lesson.progress.length > 0 && lesson.progress[0].isCompleted;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(`/courses/${lesson.courseId}`)}
        className="text-primary-600 hover:text-primary-700 mb-4 flex items-center"
      >
        ← Back to Course
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {lesson.type}
              </span>
              {lesson.duration && (
                <span className="text-gray-600 text-sm">⏱️ {lesson.duration} minutes</span>
              )}
              {isCompleted && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✅ Completed
                </span>
              )}
            </div>
          </div>
        </div>

        {lesson.description && (
          <p className="text-gray-700 mb-6">{lesson.description}</p>
        )}

        {/* Content Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          {lesson.type === 'VIDEO' && (
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-sm">Video Player</p>
                <a
                  href={lesson.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-300 hover:text-primary-200 text-sm"
                >
                  {lesson.content}
                </a>
              </div>
            </div>
          )}

          {lesson.type === 'DOCUMENT' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-gray-600 mb-4">Document Content</p>
              <a
                href={lesson.content}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Open Document
              </a>
            </div>
          )}

          {lesson.type === 'IMAGE' && (
            <div className="text-center">
              <img
                src={lesson.content}
                alt={lesson.title}
                className="max-w-full h-auto rounded-lg mx-auto"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {isLearner && !isCompleted && (
          <button
            onClick={handleMarkComplete}
            disabled={marking}
            className="w-full btn-primary disabled:opacity-50"
          >
            {marking ? 'Marking...' : '✅ Mark as Complete'}
          </button>
        )}
      </div>
    </div>
  );
};

export default LessonView;
