import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import LandingPage from './pages/public/LandingPage';
import JobsPage from './pages/public/JobsPage';
import JobDetailPage from './pages/public/JobDetailPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import MyApplications from './pages/student/MyApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/guards/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
      <AuthProvider>
        <StudentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/:id" element={<JobDetailPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />

                {/* Protected Student Routes */}
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <StudentProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="applications"
                  element={
                    <ProtectedRoute allowedRoles={['student', 'admin']}>
                      <MyApplications />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

                {/* Convenient Aliases */}
                <Route path="student/dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="student/profile" element={<Navigate to="/profile" replace />} />
                <Route path="student/applications" element={<Navigate to="/applications" replace />} />

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StudentProvider>
      </AuthProvider>
    </ToastProvider>
  </ErrorBoundary>
  );
}
