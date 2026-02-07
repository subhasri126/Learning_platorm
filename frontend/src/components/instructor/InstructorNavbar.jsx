import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Home, BookOpen, BarChart3, LogOut, User } from 'lucide-react';

const InstructorNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary-500" />
            <span className="text-xl font-bold text-white">
              LearnSphere <span className="text-primary-500 text-sm">Instructor</span>
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
              <span>My Courses</span>
            </Link>
            <Link to="/analytics" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </Link>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-gray-400">Instructor</div>
            </div>
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-primary-500" />
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
    </nav>
  );
};

export default InstructorNavbar;
