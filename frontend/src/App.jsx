import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPageClean from './pages/LandingPageClean';
import AuthPage from './pages/auth/AuthPage';
import DashboardRouter from './components/DashboardRouter';
import DashboardLayout from './components/layout/DashboardLayout';
import LearnerDashboard from './pages/learner/LearnerDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseStats from './pages/instructor/CourseStats';
import CourseProgress from './pages/instructor/CourseProgress';
import Analytics from './pages/instructor/Analytics';
import CourseForm from './pages/courses/CourseForm';
import CourseList from './pages/courses/CourseList';
import CourseDetail from './pages/courses/CourseDetail';
import LessonForm from './pages/lessons/LessonForm'; // Added import for LessonForm
import LessonView from './pages/lessons/LessonView';
import QuizAttempt from './pages/quiz/QuizAttempt';
import QuizResult from './pages/quiz/QuizResult';
import QuizReattempt from './pages/quiz/QuizReattempt';
import QuizHub from './pages/quiz/QuizHub';
import QuizRoom from './pages/quiz/QuizRoom';
import Account from './pages/account/Account';
import DiagnosticPage from './pages/DiagnosticPage';

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navbar only visible when logged in */}
      {isAuthenticated && <Navbar />}

      <div className={isAuthenticated ? "pt-16 min-h-screen overflow-y-auto" : ""}>
        <Routes>
          {/* Root now renders LandingPageClean (Strict Entry Point) */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPageClean />}
          />

          {/* Standalone Auth Page */}
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />}
          />

          {/* Role-Based Redirector */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          {/* Explicit Role Dashboards with Welcome Robot Wrapper */}
          <Route element={<DashboardLayout />}>
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute roles={['user']}>
                  <LearnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/instructor/dashboard"
              element={
                <ProtectedRoute roles={['instructor']}>
                  <InstructorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/create"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/edit"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <CourseForm />
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
            path="/courses/:courseId/lessons/create"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <LessonForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId/edit"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <LessonForm />
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
            path="/courses/:id/stats"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <CourseStats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id/progress"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <CourseProgress />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute roles={['instructor', 'admin']}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id"
            element={
              <ProtectedRoute roles={['user', 'instructor', 'admin']}>
                <QuizAttempt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute roles={['user', 'instructor', 'admin']}>
                <QuizHub />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/result"
            element={
              <ProtectedRoute roles={['user', 'instructor', 'admin']}>
                <QuizResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:id/reattempt"
            element={
              <ProtectedRoute roles={['user', 'instructor', 'admin']}>
                <QuizReattempt />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/room/:code"
            element={
              <ProtectedRoute roles={['user', 'instructor', 'admin']}>
                <QuizRoom />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diagnostic"
            element={
              <ProtectedRoute>
                <DiagnosticPage />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
