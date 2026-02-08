// Role-based dashboard redirector
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Navigate } from 'react-router-dom';

const DashboardRouter = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect to appropriate dashboard based on role
  switch (user?.role) {
    case 'user':
      return <Navigate to="/user/dashboard" replace state={location.state} />;
    case 'instructor':
      return <Navigate to="/instructor/dashboard" replace state={location.state} />;
    case 'admin':
      return <Navigate to="/admin/dashboard" replace state={location.state} />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-900">
          <div className="text-center">
            <p className="text-gray-400">Invalid user role: {user?.role}</p>
          </div>
        </div>
      );
  }
};

export default DashboardRouter;
