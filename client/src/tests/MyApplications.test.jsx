import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyApplications from '../pages/student/MyApplications';
import { StudentProvider } from '../context/StudentContext';
import { ToastProvider } from '../context/ToastContext';

describe('MyApplications Component Tests', () => {
  const renderApplications = () => {
    return render(
      <ToastProvider>
        <StudentProvider>
          <BrowserRouter>
            <MyApplications />
          </BrowserRouter>
        </StudentProvider>
      </ToastProvider>
    );
  };

  it('renders all student applications with tabular headers', () => {
    renderApplications();
    expect(
      screen.getByRole('heading', { name: /my placement applications/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Company & Role')).toBeInTheDocument();
    expect(screen.getByText('Associate Software Engineer')).toBeInTheDocument();
  });

  it('filters applications by status tabs', () => {
    renderApplications();
    const shortlistedTab = screen.getByRole('button', { name: /shortlisted/i });
    fireEvent.click(shortlistedTab);

    expect(screen.getByText('Associate Software Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Full Stack Developer Intern')).not.toBeInTheDocument();
  });

  it('opens application verification timeline modal when Timeline button is clicked', () => {
    renderApplications();
    const timelineButtons = screen.getAllByRole('button', { name: /timeline/i });
    fireEvent.click(timelineButtons[0]);

    expect(
      screen.getByText(/verification & review history/i)
    ).toBeInTheDocument();
  });
});
