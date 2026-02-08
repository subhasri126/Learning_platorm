import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../api/user.api';
import { courseAPI } from '../../api/course.api';
import { Users, BookOpen, TrendingUp, Shield, UserCheck, GraduationCap, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    learners: 0,
    instructors: 0,
    admins: 0,
    totalCourses: 0,
    publishedCourses: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [viewMode, setViewMode] = useState('kanban');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', isPublished: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, coursesResponse] = await Promise.all([
        userAPI.getAll(),
        courseAPI.getAll()
      ]);

      const users = usersResponse.data.data;
      const courses = coursesResponse.data.data;

      setStats({
        totalUsers: users.length,
        learners: users.filter(u => u.role === 'LEARNER').length,
        instructors: users.filter(u => u.role === 'INSTRUCTOR').length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.isPublished).length
      });

      setRecentUsers(users.slice(0, 5));
      setCourses(courses);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (course) => {
    try {
      const updated = await courseAPI.update(course.id, { isPublished: !course.isPublished });
      const updatedCourse = updated.data?.data;
      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, ...updatedCourse } : c)));
      setStats((prev) => ({
        ...prev,
        publishedCourses: prev.publishedCourses + (course.isPublished ? -1 : 1)
      }));
    } catch (error) {
      console.error('Failed to update publish status:', error);
    }
  };

  const handleCreateCourse = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      const response = await courseAPI.create({
        title: newCourse.title,
        description: newCourse.description,
        isPublished: newCourse.isPublished
      });
      const created = response.data?.data;
      if (created) {
        setCourses((prev) => [created, ...prev]);
        setStats((prev) => ({
          ...prev,
          totalCourses: prev.totalCourses + 1,
          publishedCourses: prev.publishedCourses + (created.isPublished ? 1 : 0)
        }));
      }
      setShowCreateModal(false);
      setNewCourse({ title: '', description: '', isPublished: false });
    } catch (error) {
      console.error('Failed to create course:', error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-accent-gold" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <p className="text-gray-400">Platform-wide management and analytics</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-solid"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Users</div>
                <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
              </div>
              <div className="w-12 h-12 bg-accent-purple/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-accent-purple" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">Learners: </span>
                <span className="text-white font-semibold">{stats.learners}</span>
              </div>
              <div>
                <span className="text-gray-500">Instructors: </span>
                <span className="text-white font-semibold">{stats.instructors}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-solid"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Total Courses</div>
                <div className="text-3xl font-bold text-white">{stats.totalCourses}</div>
              </div>
              <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-500" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="text-gray-500">Published: </span>
                <span className="text-white font-semibold">{stats.publishedCourses}</span>
              </div>
              <div>
                <span className="text-gray-500">Draft: </span>
                <span className="text-white font-semibold">{stats.totalCourses - stats.publishedCourses}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-solid"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Platform Health</div>
                <div className="text-3xl font-bold text-green-400">Excellent</div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              All systems operational
            </div>
          </motion.div>
        </div>

        {/* Reporting Dashboard */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">Total Participants</div>
            <div className="text-2xl font-bold text-white">{stats.learners}</div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">Yet to Start</div>
            <div className="text-2xl font-bold text-white">0</div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">In Progress</div>
            <div className="text-2xl font-bold text-white">0</div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">Completed</div>
            <div className="text-2xl font-bold text-white">0</div>
          </div>
        </div>

        {/* User Roles Breakdown */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-solid">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent-purple/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-accent-purple" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Learners</div>
                <div className="text-2xl font-bold text-white">{stats.learners}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {((stats.learners / stats.totalUsers) * 100).toFixed(1)}% of total users
            </div>
          </div>

          <div className="card-solid">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Instructors</div>
                <div className="text-2xl font-bold text-white">{stats.instructors}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {((stats.instructors / stats.totalUsers) * 100).toFixed(1)}% of total users
            </div>
          </div>

          <div className="card-solid">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-accent-gold/20 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-gold" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Admins</div>
                <div className="text-2xl font-bold text-white">{stats.admins}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Platform administrators
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="card-solid mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Course Management</h2>
              <p className="text-sm text-gray-500">Kanban and list views with publish controls</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-dark-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'kanban' ? 'bg-dark-700 text-white' : 'text-gray-400'}`}
                >
                  Kanban
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm rounded-lg ${viewMode === 'list' ? 'bg-dark-700 text-white' : 'text-gray-400'}`}
                >
                  List
                </button>
              </div>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                Create Course
              </button>
            </div>
          </div>

          {viewMode === 'kanban' ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card-solid">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Draft</h3>
                <div className="space-y-3">
                  {courses.filter((course) => !course.isPublished).map((course) => (
                    <div key={course.id} className="bg-dark-800/60 rounded-xl p-4 border border-dark-700">
                      <div className="text-white font-semibold mb-1">{course.title}</div>
                      <div className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description || 'No description provided.'}</div>
                      <button
                        onClick={() => handlePublishToggle(course)}
                        className="text-xs text-primary-400 hover:text-primary-300"
                      >
                        Publish
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-solid">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Published</h3>
                <div className="space-y-3">
                  {courses.filter((course) => course.isPublished).map((course) => (
                    <div key={course.id} className="bg-dark-800/60 rounded-xl p-4 border border-dark-700">
                      <div className="text-white font-semibold mb-1">{course.title}</div>
                      <div className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description || 'No description provided.'}</div>
                      <button
                        onClick={() => handlePublishToggle(course)}
                        className="text-xs text-gray-400 hover:text-white"
                      >
                        Unpublish
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Visibility</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-dark-700">
                      <td className="py-3 px-4 text-white">
                        <div className="font-semibold">{course.title}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{course.description || 'No description provided.'}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{course.isPublished ? 'Published' : 'Draft'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${course.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                          {course.isPublished ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handlePublishToggle(course)}
                          className="text-xs text-primary-400 hover:text-primary-300"
                        >
                          {course.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Users Table */}
        <div className="card-solid mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Users</h2>
            <a href="/admin/users" className="text-sm text-primary-400 hover:text-primary-300">View All</a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">XP</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-400">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u, index) => (
                  <tr key={u.id} className="border-b border-dark-700 hover:bg-dark-800 transition-colors">
                    <td className="py-3 px-4 text-white">{u.name}</td>
                    <td className="py-3 px-4 text-gray-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-gold' :
                          u.role === 'INSTRUCTOR' ? 'badge-info' :
                            'badge-success'
                        }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white">{u.totalPoints || 0}</td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6">
          <a href="/admin/users" className="card-solid hover:border-accent-gold transition-colors text-center">
            <Users className="w-8 h-8 text-accent-gold mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">Manage Users</h3>
            <p className="text-sm text-gray-500">View and edit users</p>
          </a>

          <a href="/admin/courses" className="card-solid hover:border-accent-gold transition-colors text-center">
            <BookOpen className="w-8 h-8 text-accent-gold mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">All Courses</h3>
            <p className="text-sm text-gray-500">Platform-wide courses</p>
          </a>

          <a href="/admin/analytics" className="card-solid hover:border-accent-gold transition-colors text-center">
            <BarChart3 className="w-8 h-8 text-accent-gold mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">Analytics</h3>
            <p className="text-sm text-gray-500">Platform insights</p>
          </a>

          <a href="/admin/settings" className="card-solid hover:border-accent-gold transition-colors text-center">
            <Settings className="w-8 h-8 text-accent-gold mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-1">Settings</h3>
            <p className="text-sm text-gray-500">System configuration</p>
          </a>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="card-solid max-w-lg w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Create Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Title</label>
                <input
                  value={newCourse.title}
                  onChange={(event) => setNewCourse((prev) => ({ ...prev, title: event.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(event) => setNewCourse((prev) => ({ ...prev, description: event.target.value }))}
                  className="input-field min-h-[100px]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={newCourse.isPublished}
                  onChange={(event) => setNewCourse((prev) => ({ ...prev, isPublished: event.target.checked }))}
                />
                Publish immediately
              </label>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
