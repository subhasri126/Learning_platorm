import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Zap, Home, BookOpen, Trophy, LogOut, User } from 'lucide-react';
import { calculateLevel, getRank, formatXP } from '../../utils/gamification';

const LearnerNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const level = calculateLevel(user?.totalPoints || 0);
  const rank = getRank(user?.totalPoints || 0);

  return (
    <nav className="bg-dark-800/50 backdrop-blur-xl border-b border-dark-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <Zap className="w-7 h-7 text-accent-purple" />
            <span className="text-xl font-bold bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
              LearnSphere
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/courses" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Courses</span>
            </Link>
            <Link to="/leaderboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-4">
            {/* XP Display */}
            <div className="hidden md:flex items-center gap-3 bg-dark-700/50 px-4 py-2 rounded-xl">
              <Zap className="w-5 h-5 text-accent-purple" />
              <div>
                <div className="text-xs text-gray-400">Level {level}</div>
                <div className="text-sm font-bold text-white">{formatXP(user?.totalPoints || 0)} XP</div>
              </div>
              <span className={`badge ${rank.bg} ${rank.color} text-xs`}>
                {rank.icon} {rank.name}
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LearnerNavbar;
