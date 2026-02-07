import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressAPI } from '../api/progress.api';
import { useAuth } from '../contexts/AuthContext';
import BadgeDisplay from '../components/badge/BadgeDisplay';
import ProgressBar from '../components/progress/ProgressBar';
import Loading from '../components/common/Loading';

const Dashboard = () => {
  const { user, isLearner } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLearner) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [isLearner]);

  const fetchDashboard = async () => {
    try {
      const response = await progressAPI.getDashboard();
      setDashboard(response.data.data);
    } catch (err) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  if (!isLearner) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Welcome, {user?.name}!
        </h1>
        <div className="card">
          <p className="text-gray-600 mb-4">
            {user?.role === 'INSTRUCTOR' && 'Manage your courses and track student progress.'}
            {user?.role === 'ADMIN' && 'Manage all platform resources and users.'}
          </p>
          <Link to="/courses" className="btn-primary">
            View All Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Dashboard</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <BadgeDisplay points={dashboard?.user.totalPoints || 0} />
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-primary-600">
            {dashboard?.stats.coursesInProgress || 0}
          </div>
          <div className="text-gray-600 mt-1">Courses in Progress</div>
        </div>
        <div className="card">
          <div className="text-3xl font-bold text-green-600">
            {dashboard?.stats.coursesCompleted || 0}
          </div>
          <div className="text-gray-600 mt-1">Courses Completed</div>
        </div>
      </div>

      {/* My Courses */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
            Browse More →
          </Link>
        </div>

        {dashboard?.courses && dashboard.courses.length > 0 ? (
          <div className="space-y-4">
            {dashboard.courses.map((course) => (
              <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-600">by {course.instructor}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : course.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {course.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <ProgressBar percentage={course.progressPercentage} />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-sm text-gray-600">
                    {course.completedLessons} / {course.totalLessons} lessons
                  </span>
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Continue →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't started any courses yet.</p>
            <Link to="/courses" className="btn-primary mt-4 inline-block">
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      {/* Recent Quiz Attempts */}
      {dashboard?.recentQuizAttempts && dashboard.recentQuizAttempts.length > 0 && (
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Quiz Attempts</h2>
          <div className="space-y-3">
            {dashboard.recentQuizAttempts.map((attempt) => (
              <div key={attempt.id} className="flex justify-between items-center border-b border-gray-200 pb-3">
                <div>
                  <div className="font-medium text-gray-900">{attempt.quiz.title}</div>
                  <div className="text-sm text-gray-600">Attempt #{attempt.attemptNumber}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary-600">
                    {attempt.score} / {attempt.quiz.maxPoints}
                  </div>
                  <div className="text-sm text-gray-600">
                    {Math.round((attempt.score / attempt.quiz.maxPoints) * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
