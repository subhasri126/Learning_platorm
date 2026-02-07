// Role-based dashboard router component
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LearnerDashboard from '../pages/learner/LearnerDashboard';
import InstructorDashboard from '../pages/instructor/InstructorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  // Route to appropriate dashboard based on role
  switch (user?.role) {
    case 'LEARNER':
      return <LearnerDashboard />;
    case 'INSTRUCTOR':
      return <InstructorDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="text-center">
            <p className="text-gray-400">Invalid user role</p>
          </div>
        </div>
      );
  }
};

export default DashboardRouter;
