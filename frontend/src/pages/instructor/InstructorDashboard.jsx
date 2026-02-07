import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { courseAPI } from '../../api/course.api';
import { BookOpen, Users, BarChart3, PlusCircle, Edit, Eye, EyeOff, TrendingUp } from 'lucide-react';
import InstructorNavbar from '../../components/instructor/InstructorNavbar';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, totalLearners: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      const myCourses = response.data.data.filter(c => c.instructorId === user.id);
      setCourses(myCourses);
      
      const published = myCourses.filter(c => c.isPublished).length;
      const draft = myCourses.filter(c => !c.isPublished).length;
      
      setStats({
        total: myCourses.length,
        published,
        draft,
        totalLearners: myCourses.reduce((acc, c) => acc + (c._count?.enrollments || 0), 0)
      });
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <InstructorNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Instructor Dashboard</h1>
            <p className="text-gray-400">Manage your courses and track learner progress</p>
          </div>
          
          <Link to="/courses/create" className="btn-primary">
            <PlusCircle className="w-5 h-5 inline mr-2" />
            Create Course
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-solid"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-gray-400">Total Courses</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-solid"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.published}</div>
                <div className="text-sm text-gray-400">Published</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-solid"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.draft}</div>
                <div className="text-sm text-gray-400">Draft</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-solid"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalLearners}</div>
                <div className="text-sm text-gray-400">Total Learners</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Courses Table */}
        <div className="card-solid">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">My Courses</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          {courses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Course</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Learners</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Lessons</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <motion.tr
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-dark-700 hover:bg-dark-800 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-white">{course.title}</div>
                          <div className="text-sm text-gray-400 line-clamp-1">{course.description}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {course.isPublished ? (
                          <span className="badge badge-success">Published</span>
                        ) : (
                          <span className="badge badge-danger">Draft</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{course._count?.enrollments || 0}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{course._count?.lessons || 0}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/courses/${course.id}`}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                            title="View Course"
                          >
                            <Eye className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link
                            to={`/courses/${course.id}/edit`}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                            title="Edit Course"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </Link>
                          <Link
                            to={`/courses/${course.id}/stats`}
                            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                            title="View Stats"
                          >
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                          </Link>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Create your first course to start teaching</p>
              <Link to="/courses/create" className="btn-primary inline-block">
                <PlusCircle className="w-4 h-4 inline mr-2" />
                Create Your First Course
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Link to="/courses/create" className="card-solid hover:border-primary-500 transition-colors">
            <PlusCircle className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Create Course</h3>
            <p className="text-sm text-gray-400">Start building a new course</p>
          </Link>

          <Link to="/courses" className="card-solid hover:border-primary-500 transition-colors">
            <BookOpen className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Manage Content</h3>
            <p className="text-sm text-gray-400">Edit lessons and quizzes</p>
          </Link>

          <Link to="/analytics" className="card-solid hover:border-primary-500 transition-colors">
            <TrendingUp className="w-8 h-8 text-primary-500 mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">View Analytics</h3>
            <p className="text-sm text-gray-400">Track learner progress</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
