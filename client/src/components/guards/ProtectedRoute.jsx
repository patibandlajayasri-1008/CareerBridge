import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F8FC] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-[#3157D5]/10 flex items-center justify-center mb-4">
          <Loader2 className="w-6 h-6 text-[#3157D5] animate-spin" />
        </div>
        <p className="text-sm font-medium text-[#667085]">Verifying authenticated session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated guests to login page, preserving intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions if specified
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // If student attempts to access admin route, redirect to student dashboard
    if (user?.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    }
    // If admin attempts to access student-only route, redirect to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}
