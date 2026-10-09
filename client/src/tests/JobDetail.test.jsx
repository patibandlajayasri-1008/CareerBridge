import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import JobDetailPage from '../pages/public/JobDetailPage';
import { ToastProvider } from '../context/ToastContext';

describe('JobDetailPage Component Tests', () => {
  const renderJobDetail = (jobId) => {
    return render(
      <ToastProvider>
        <MemoryRouter initialEntries={[`/jobs/${jobId}`]}>
          <Routes>
            <Route path="/jobs/:id" element={<JobDetailPage />} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    );
  };

  it('renders complete job specifications for valid job id', () => {
    renderJobDetail('job-1');
    expect(
      screen.getByRole('heading', { name: 'Associate Software Engineer' })
    ).toBeInTheDocument();
    expect(screen.getByText('Cognizant Technology Solutions')).toBeInTheDocument();
    expect(screen.getByText('₹6.5 LPA - ₹8.5 LPA')).toBeInTheDocument();
    expect(screen.getByText(/2026 Passing Out/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apply with profile/i })).toBeInTheDocument();
  });

  it('displays not found alert when job id does not exist', () => {
    renderJobDetail('job-invalid-999');
    expect(screen.getByText('Job Opportunity Not Found')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /back to all opportunities/i })
    ).toBeInTheDocument();
  });

  it('renders similar campus drives rail', () => {
    renderJobDetail('job-1');
    expect(screen.getByText('Similar Campus Drives')).toBeInTheDocument();
  });
});
