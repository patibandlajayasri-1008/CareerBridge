import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentDashboard from '../pages/student/StudentDashboard';
import { StudentProvider } from '../context/StudentContext';
import { ToastProvider } from '../context/ToastContext';

// Mock Recharts ResponsiveContainer to avoid size observer errors in jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }) => <div style={{ width: 500, height: 250 }}>{children}</div>,
  };
});

describe('StudentDashboard Component Tests', () => {
  const renderDashboard = () => {
    return render(
      <ToastProvider>
        <StudentProvider>
          <BrowserRouter>
            <StudentDashboard />
          </BrowserRouter>
        </StudentProvider>
      </ToastProvider>
    );
  };

  it('renders student welcome greeting with name and degree', () => {
    renderDashboard();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/b\.tech \/ b\.e\./i)).toBeInTheDocument();
  });

  it('renders 4 KPI stat cards with correct metric headings', () => {
    renderDashboard();
    expect(screen.getByText('Available Drives')).toBeInTheDocument();
    expect(screen.getByText('Total Applications')).toBeInTheDocument();
    expect(screen.getAllByText('Under Review').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Shortlisted / Offers')).toBeInTheDocument();
  });

  it('renders profile completeness meter and visibility progress', () => {
    renderDashboard();
    expect(screen.getByText(/recruiter visibility/i)).toBeInTheDocument();
    expect(screen.getAllByText(/complete/i).length).toBeGreaterThanOrEqual(1);
  });

  it('displays recent applications with active status badges', () => {
    renderDashboard();
    expect(screen.getByText('Recent Placement Applications')).toBeInTheDocument();
    expect(screen.getAllByText('Associate Software Engineer').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Shortlisted').length).toBeGreaterThanOrEqual(1);
  });
});
