import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { progressAPI } from '../../api/progress.api';
import Loading from '../../components/common/Loading';
import { calculateLevel, calculateLevelProgress, getRank, formatXP } from '../../utils/gamification';

const Account = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await progressAPI.getDashboard();
        setDashboard(response.data.data);
      } catch (error) {
        setDashboard(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Loading />;

  const totalXP = user?.totalPoints || 0;
  const level = calculateLevel(totalXP);
  const levelProgress = calculateLevelProgress(totalXP);
  const rank = getRank(totalXP);

  const badges = [
    { name: 'Consistency', icon: '🔥', desc: '3-day learning streak' },
    { name: 'Quiz Starter', icon: '🎯', desc: 'Completed first quiz' },
    { name: 'Course Finisher', icon: '🏆', desc: 'Finished a course' },
    { name: 'Rising Star', icon: '⭐', desc: 'Earned 500 XP' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-850">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
          <p className="text-gray-400">Track your achievements and learning progress.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">XP Level</div>
            <div className="text-3xl font-bold text-white">Level {level}</div>
            <div className="xp-bar mt-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                className="xp-fill"
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">{Math.round(levelProgress)}% to next level</div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">Total XP</div>
            <div className="text-3xl font-bold text-white">{formatXP(totalXP)}</div>
            <div className={`badge ${rank.bg} ${rank.color} mt-3 inline-flex items-center gap-2`}>
              <span>{rank.icon}</span>
              <span>{rank.name}</span>
            </div>
          </div>
          <div className="card-solid">
            <div className="text-sm text-gray-400 mb-1">Leaderboard Position</div>
            <div className="text-3xl font-bold text-white">#12</div>
            <div className="text-xs text-gray-500 mt-2">Weekly / Overall</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card-solid">
            <h2 className="text-xl font-semibold text-white mb-4">Courses in Progress</h2>
            {dashboard?.enrolledCourses?.length ? (
              <div className="space-y-3">
                {dashboard.enrolledCourses.slice(0, 4).map((course) => (
                  <div key={course.id} className="bg-dark-800/60 rounded-xl p-4 border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold">{course.title}</span>
                      <span className="text-xs text-gray-400">{Math.round(course.progress)}%</span>
                    </div>
                    <div className="progress-bar h-2">
                      <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses started yet.</p>
            )}
          </div>

          <div className="card-solid">
            <h2 className="text-xl font-semibold text-white mb-4">Completed Courses</h2>
            {dashboard?.completedCourses?.length ? (
              <div className="space-y-3">
                {dashboard.completedCourses.slice(0, 4).map((course) => (
                  <div key={course.id} className="bg-dark-800/60 rounded-xl p-4 border border-dark-700">
                    <div className="text-white font-semibold">{course.title}</div>
                    <div className="text-xs text-gray-400 mt-1">Completed</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No completed courses yet.</p>
            )}
          </div>
        </div>

        <div className="card-solid">
          <h2 className="text-xl font-semibold text-white mb-4">Badges Earned</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <motion.div
                key={badge.name}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-800/60 rounded-xl p-4 border border-dark-700 text-center"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold text-white">{badge.name}</div>
                <div className="text-xs text-gray-500">{badge.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
