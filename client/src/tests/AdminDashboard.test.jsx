import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../pages/admin/AdminDashboard';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

describe('Admin Dashboard Component Tests', () => {
  const renderAdminDashboard = () => {
    return render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AdminDashboard />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );
  };

  it('renders placement overview stats and recent applications table', () => {
    renderAdminDashboard();

    expect(screen.getByText('Total Placement Drives')).toBeInTheDocument();
    expect(screen.getByText('Total Candidate Applications')).toBeInTheDocument();
    expect(screen.getAllByText('Shortlisted for Interview')[0]).toBeInTheDocument();
    expect(screen.getByText('Selected / Placed Candidates')).toBeInTheDocument();

    expect(screen.getByText('Recent Candidate Applications')).toBeInTheDocument();
    expect(screen.getByText('Placement Pipeline Status')).toBeInTheDocument();
  });

  it('switches to Manage Drives tab and renders placement drives table', () => {
    renderAdminDashboard();

    const manageDrivesTab = screen.getByRole('button', { name: /manage drives/i });
    fireEvent.click(manageDrivesTab);

    expect(screen.getByText(/campus placement drives/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search drives/i)).toBeInTheDocument();
    expect(screen.getByText('Associate Software Engineer')).toBeInTheDocument();
  });

  it('switches to Candidate Applications tab and filters candidate list', () => {
    renderAdminDashboard();

    const applicationsTab = screen.getByRole('button', { name: /candidate applications/i });
    fireEvent.click(applicationsTab);

    expect(screen.getByText(/student candidate applications/i)).toBeInTheDocument();
    expect(screen.getByText('Alex Chen')).toBeInTheDocument();
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
  });

  it('opens job creation modal when clicking Post New Drive button', () => {
    renderAdminDashboard();

    const postDriveBtn = screen.getByRole('button', { name: /post new drive/i });
    fireEvent.click(postDriveBtn);

    expect(
      screen.getByRole('heading', { name: /publish new campus placement drive/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/job role title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/hiring company/i)).toBeInTheDocument();
  });
});
