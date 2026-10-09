import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Helper component that consumes auth
function UserGreeting() {
  const { user, isAuthenticated } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Guest'}</p>
      {user && <p data-testid="user-name">{user.name}</p>}
    </div>
  );
}

describe('Auth & Protected Route Integration Tests', () => {
  it('renders fallback guest state when no active session exists', async () => {
    render(
      <AuthProvider>
        <UserGreeting />
      </AuthProvider>
    );

    // Initial session check completes with guest state
    const status = await screen.findByTestId('auth-status');
    expect(status).toHaveTextContent('Guest');
  });

  it('redirects unauthenticated guest accessing protected student route to /login', async () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <div>Student Protected Dashboard Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Redirected Login Portal</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // The protected route redirects unauthenticated guest to login
    expect(await screen.findByText('Redirected Login Portal')).toBeInTheDocument();
    expect(screen.queryByText('Student Protected Dashboard Content')).not.toBeInTheDocument();
  });
});
