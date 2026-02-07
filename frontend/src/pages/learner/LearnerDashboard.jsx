import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { progressAPI } from '../../api/progress.api';
import { Zap, Trophy, Target, BookOpen, TrendingUp, Award, Star, MessageCircle } from 'lucide-react';
import { calculateLevel, calculateLevelProgress, getRank, formatXP } from '../../utils/gamification';
import LearnerNavbar from '../../components/learner/LearnerNavbar';
import MascotGuide from '../../components/learner/MascotGuide';

const LearnerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMascot, setShowMascot] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await progressAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-purple"></div>
      </div>
    );
  }

  const totalXP = user?.totalPoints || 0;
  const level = calculateLevel(totalXP);
  const levelProgress = calculateLevelProgress(totalXP);
  const rank = getRank(totalXP);
  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <LearnerNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Mascot */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-400">Ready to continue your learning adventure?</p>
            </div>
            
            {/* Level Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-accent-purple to-accent-pink px-6 py-3 rounded-2xl shadow-glow"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-white" />
                <div>
                  <div className="text-xs text-white/80">Level</div>
                  <div className="text-2xl font-bold text-white">{level}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* XP Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent-purple" />
              <div>
                <div className="text-sm text-gray-400">Total XP</div>
                <div className="text-2xl font-bold text-white">{formatXP(totalXP)}</div>
              </div>
            </div>
            <div className={`badge ${rank.bg} ${rank.color} flex items-center gap-2`}>
              <span>{rank.icon}</span>
              <span>{rank.name}</span>
            </div>
          </div>
          
          <div className="xp-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="xp-fill"
            />
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Level {level}</span>
            <span>{Math.round(levelProgress)}% to Level {level + 1}</span>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-gradient text-center"
          >
            <BookOpen className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.coursesInProgress || 0}</div>
            <div className="text-xs text-gray-400">In Progress</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-gradient text-center"
          >
            <Trophy className="w-8 h-8 text-accent-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.coursesCompleted || 0}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-gradient text-center"
          >
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{dashboardData?.recentQuizAttempts?.length || 0}</div>
            <div className="text-xs text-gray-400">Quizzes Taken</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-gradient text-center"
          >
            <TrendingUp className="w-8 h-8 text-accent-pink mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{level}</div>
            <div className="text-xs text-gray-400">Current Level</div>
          </motion.div>
        </div>

        {/* My Courses */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-accent-purple" />
              My Courses
            </h2>
            <Link to="/courses" className="btn-secondary text-sm">
              Browse All Courses
            </Link>
          </div>

          {dashboardData?.enrolledCourses?.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.enrolledCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/courses/${course.id}`} className="card-hover block">
                    <div className="flex items-center justify-between mb-3">
                      <span className="badge badge-info">{course.status.replace('_', ' ')}</span>
                      <span className="text-2xl">{course.progress >= 100 ? '🏆' : '📚'}</span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <div className="progress-bar mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                        className="progress-fill"
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{Math.round(course.progress)}% Complete</span>
                      {course.progress >= 100 && (
                        <span className="text-green-400 flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          Done!
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Start your learning journey today!</p>
              <Link to="/courses" className="btn-primary inline-block">
                <Star className="w-4 h-4 inline mr-2" />
                Explore Courses
              </Link>
            </div>
          )}
        </div>

        {/* Recent Quiz Attempts */}
        {dashboardData?.recentQuizAttempts?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-accent-purple" />
              Recent Quizzes
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.recentQuizAttempts.map((attempt, index) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card-gradient"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Attempt #{attempt.attemptNumber}</span>
                    <span className="text-2xl">{attempt.percentage >= 80 ? '🎉' : attempt.percentage >= 60 ? '👍' : '💪'}</span>
                  </div>
                  
                  <div className="text-2xl font-bold text-white mb-1">
                    {attempt.score} / {attempt.quizMaxPoints}
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-3">
                    {Math.round(attempt.percentage)}% Score
                  </div>
                  
                  <div className="progress-bar h-2">
                    <div
                      className={`h-full rounded-full ${
                        attempt.percentage >= 80 ? 'bg-green-500' :
                        attempt.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${attempt.percentage}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mascot Guide */}
      <AnimatePresence>
        {showMascot && (
          <MascotGuide
            emoji="👋"
            message="Hey! Ready to learn something new today?"
            onClose={() => setShowMascot(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearnerDashboard;
