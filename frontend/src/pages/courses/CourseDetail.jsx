import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseAPI } from '../../api/course.api';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';
import ProgressBar from '../../components/progress/ProgressBar';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, isLearner, isInstructor, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
    if (isLearner) {
      fetchProgress();
    }
  }, [id, isLearner]);

  const fetchCourse = async () => {
    try {
      const response = await courseAPI.getById(id);
      setCourse(response.data.data);
    } catch (err) {
      setError('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      const response = await courseAPI.getProgress(id);
      setProgress(response.data.data);
    } catch (err) {
      console.log('No progress yet');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseAPI.delete(id);
      navigate('/courses');
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  if (loading) return <Loading />;
  if (!course) return <div className="text-center py-12">Course not found</div>;

  const canEdit = isAdmin || (isInstructor && course.instructor.id === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Course Header */}
      <div className="card mb-8">
        {course.thumbnail && (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600 mt-2">by {course.instructor.name}</p>
          </div>
          <div className="flex space-x-2">
            {!course.isPublished && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Draft
              </span>
            )}
            {canEdit && (
              <>
                <Link to={`/courses/${id}/edit`} className="btn-secondary">
                  Edit
                </Link>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
        <p className="text-gray-700 mb-6">{course.description}</p>

        {progress && (
          <div className="bg-primary-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Your Progress</span>
              <span className="text-primary-600 font-bold">{progress.progressPercentage}%</span>
            </div>
            <ProgressBar percentage={progress.progressPercentage} />
            <p className="text-sm text-gray-600 mt-2">
              {progress.completedLessons} of {progress.totalLessons} lessons completed
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lessons */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons</h2>
            {course.lessons && course.lessons.length > 0 ? (
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <Link
                    key={lesson.id}
                    to={`/lessons/${lesson.id}`}
                    className="block border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <span className="flex-shrink-0 w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          {lesson.description && (
                            <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="px-2 py-1 bg-gray-100 rounded">{lesson.type}</span>
                            {lesson.duration && <span>⏱️ {lesson.duration} min</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-primary-600 font-medium">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No lessons available yet.</p>
            )}
          </div>
        </div>

        {/* Quizzes Sidebar */}
        <div>
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quizzes</h2>
            {course.quizzes && course.quizzes.length > 0 ? (
              <div className="space-y-3">
                {course.quizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    to={`/quiz/${quiz.id}`}
                    className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm">{quiz.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {quiz._count?.questions || 0} questions
                    </p>
                    <p className="text-xs text-primary-600 mt-2 font-medium">
                      Max: {quiz.maxPoints} pts
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No quizzes available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
