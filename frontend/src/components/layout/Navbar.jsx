import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, LogOut, Menu, Moon, Sun, User, X, Zap, Trophy } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const { user, logout, isLearner } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isQuizMode = location.pathname.startsWith('/quiz/') && location.pathname !== '/quiz';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-dark-700 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-800'
    }`;

  return (
    <nav className="nav-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-accent-purple" />
              <span className="text-lg font-bold text-white">LearnSphere</span>
            </Link>

            {/* Desktop Navigation */}
            {!isQuizMode && (
              <div className="hidden md:flex items-center gap-8">
                <NavLink to="/" className={navLinkClass}>
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </NavLink>

                {user ? (
                  /* POST-LOGIN LINKS */
                  <>
                    <NavLink to="/courses" className={navLinkClass}>
                      <BookOpen className="w-4 h-4" />
                      <span>Courses</span>
                    </NavLink>
                    <NavLink to="/quiz" className={navLinkClass}>
                      <Trophy className="w-4 h-4" />
                      <span>Quiz</span>
                    </NavLink>
                    <NavLink to="/account" className={navLinkClass}>
                      <User className="w-4 h-4" />
                      <span>Account</span>
                    </NavLink>
                  </>
                ) : (
                  /* PRE-LOGIN LINKS */
                  <>
                    <a href="/#features" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                      Features
                    </a>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-3 text-sm text-gray-300">
                  <span>{user.name}</span>
                  <span className="px-2 py-1 rounded-full bg-dark-700 text-xs text-gray-300">
                    {user.role}
                  </span>
                  {isLearner && (
                    <span className="text-accent-gold font-medium">⭐ {user.totalPoints} XP</span>
                  )}
                </div>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  <LogOut className="w-4 h-4 inline mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" className="btn-secondary text-sm">
                  Sign In
                </Link>
                <Link to="/auth" state={{ isRegister: true }} className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                ? 'text-gray-400 hover:bg-dark-800 hover:text-white'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {!isQuizMode && (
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden p-2 rounded-lg hover:bg-dark-800 text-gray-300"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {menuOpen && !isQuizMode && (
        <div className="md:hidden border-t border-dark-700 bg-dark-900/95">
          <div className="px-4 py-4 space-y-4">
            <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </NavLink>

            {user ? (
              <>
                <NavLink to="/courses" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <BookOpen className="w-4 h-4" />
                  <span>Courses</span>
                </NavLink>
                <NavLink to="/quiz" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <Trophy className="w-4 h-4" />
                  <span>Quiz</span>
                </NavLink>
                <NavLink to="/account" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                  <User className="w-4 h-4" />
                  <span>Account</span>
                </NavLink>
              </>
            ) : (
              <a href="/#features" className="block text-gray-400 hover:text-white px-3 py-2 text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Features
              </a>
            )}
          </div>
        </div>
      )}

      {isQuizMode && (
        <div className="border-t border-dark-700 bg-dark-900/95">
          <div className="max-w-7xl mx-auto px-4 py-2 text-xs text-gray-400">
            Quiz in progress — navigation is disabled to keep you focused.
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
