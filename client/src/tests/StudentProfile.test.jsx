import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StudentProfile from '../pages/student/StudentProfile';
import { StudentProvider } from '../context/StudentContext';
import { ToastProvider } from '../context/ToastContext';

describe('StudentProfile Component Tests', () => {
  const renderProfile = () => {
    return render(
      <ToastProvider>
        <StudentProvider>
          <BrowserRouter>
            <StudentProfile />
          </BrowserRouter>
        </StudentProvider>
      </ToastProvider>
    );
  };

  it('renders student profile fields populated with initial data', () => {
    renderProfile();
    expect(screen.getByLabelText(/full legal name/i)).toHaveValue('Aarav Sharma');
    expect(screen.getByLabelText(/college email address/i)).toHaveValue('aarav.sharma@nitk.edu.in');
    expect(screen.getByLabelText(/college \/ institute/i)).toHaveValue(
      'National Institute of Technology Karnataka (NITK)'
    );
  });

  it('allows adding and displaying a new technical skill chip', () => {
    renderProfile();
    const skillInput = screen.getByPlaceholderText(/e\.g\. typescript, docker, mongodb/i);
    const addSkillBtn = screen.getByRole('button', { name: /add skill/i });

    fireEvent.change(skillInput, { target: { value: 'Docker' } });
    fireEvent.click(addSkillBtn);

    expect(screen.getByText('Docker')).toBeInTheDocument();
  });

  it('renders the verified resume card with file details', () => {
    renderProfile();
    expect(screen.getByText(/curriculum vitae \/ resume/i)).toBeInTheDocument();
    expect(screen.getByText(/verified pdf/i)).toBeInTheDocument();
    expect(screen.getByText(/replace/i)).toBeInTheDocument();
  });
});
