import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { StudentProvider } from '../context/StudentContext';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import StudentDashboard from '../pages/student/StudentDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';

// Mock Recharts ResponsiveContainer for JSDOM
vi.mock('recharts', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => <div style={{ width: 400, height: 250 }}>{children}</div>,
  };
});

describe('Full System Integration & Accessibility Tests', () => {
  it('renders landing page with accessible semantic landmarks and CTAs', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <StudentProvider>
            <MemoryRouter initialEntries={['/']}>
              <LandingPage />
            </MemoryRouter>
          </StudentProvider>
        </AuthProvider>
      </ToastProvider>
    );

    // Hero headline and accessible CTA buttons
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/explore opportunities/i)).toBeInTheDocument();
    expect(screen.getByText(/create your profile/i)).toBeInTheDocument();
  });

  it('guarantees protected student routes block unauthenticated visitors', async () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <StudentProvider>
            <MemoryRouter initialEntries={['/dashboard']}>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['student']}>
                      <StudentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </MemoryRouter>
          </StudentProvider>
        </AuthProvider>
      </ToastProvider>
    );

    // Wait for auth verification to resolve and assert redirection to login
    const heading = await screen.findByRole('heading', { name: /sign in to your account/i });
    expect(heading).toBeInTheDocument();
  });

  it('guarantees protected admin routes block unauthorized visitors', async () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <StudentProvider>
            <MemoryRouter initialEntries={['/admin/dashboard']}>
              <Routes>
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </MemoryRouter>
          </StudentProvider>
        </AuthProvider>
      </ToastProvider>
    );

    // Wait for auth verification to resolve and assert redirection to login
    const heading = await screen.findByRole('heading', { name: /sign in to your account/i });
    expect(heading).toBeInTheDocument();
  });

  it('provides accessible form inputs with clear labels on login portal', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <MemoryRouter>
            <LoginPage />
          </MemoryRouter>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in as student/i })).toBeInTheDocument();
  });
});
