import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import RoleSelection from './pages/auth/RoleSelection';
import RoleLogin from './pages/auth/RoleLogin';
import Register from './pages/auth/Register';
import DashboardRouter from './components/DashboardRouter';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import LessonView from './pages/lessons/LessonView';
import QuizAttempt from './pages/quiz/QuizAttempt';
import QuizResult from './pages/quiz/QuizResult';
import QuizReattempt from './pages/quiz/QuizReattempt';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Routes>
        {/* Public Home Page */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />}
        />
        
        {/* Auth Routes */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RoleSelection />}
        />
        <Route
          path="/auth/:role"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RoleLogin />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Protected Routes - Role-Based Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <CourseList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <ProtectedRoute>
              <LessonView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute roles={['LEARNER']}>
              <QuizAttempt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id/result"
          element={
            <ProtectedRoute roles={['LEARNER']}>
              <QuizResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:id/reattempt"
          element={
            <ProtectedRoute roles={['LEARNER']}>
              <QuizReattempt />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
