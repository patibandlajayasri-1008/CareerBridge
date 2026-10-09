import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import { ToastProvider } from '../context/ToastContext';

describe('Authentication UI & Validation Tests', () => {
  it('displays validation error when submitting empty login form', () => {
    render(
      <ToastProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </ToastProvider>
    );

    const submitBtn = screen.getByRole('button', { name: /sign in as student/i });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/please enter your registered email address/i)
    ).toBeInTheDocument();
  });

  it('switches role between student and admin on login page', () => {
    render(
      <ToastProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </ToastProvider>
    );

    const adminTab = screen.getByRole('button', { name: /placement admin/i });
    fireEvent.click(adminTab);

    expect(
      screen.getByRole('button', { name: /sign in as administrator/i })
    ).toBeInTheDocument();
  });

  it('displays password mismatch validation error on register page', () => {
    render(
      <ToastProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </ToastProvider>
    );

    const nameInput = screen.getByLabelText(/full legal name/i);
    const emailInput = screen.getByLabelText(/college email address/i);
    const collegeInput = screen.getByLabelText(/college \/ institute name/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const termsCheckbox = screen.getByRole('checkbox');

    fireEvent.change(nameInput, { target: { value: 'Jane Student' } });
    fireEvent.change(emailInput, { target: { value: 'jane@college.edu' } });
    fireEvent.change(collegeInput, { target: { value: 'MIT College' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different123' } });
    fireEvent.click(termsCheckbox);

    const registerBtn = screen.getByRole('button', { name: /complete registration/i });
    fireEvent.click(registerBtn);

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('toggles password visibility on clicking the eye icon', () => {
    render(
      <ToastProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </ToastProvider>
    );

    const passwordInput = screen.getByLabelText(/^password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByLabelText('Show password');
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
