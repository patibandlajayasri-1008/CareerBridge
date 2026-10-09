import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../pages/public/LandingPage';

describe('LandingPage Integration Test', () => {
  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders the mandatory hero headline and supporting copy', () => {
    renderWithRouter(<LandingPage />);
    expect(
      screen.getByRole('heading', { name: /your next career move starts here/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/discover opportunities that match your skills/i)
    ).toBeInTheDocument();
  });

  it('renders primary and secondary call to action buttons', () => {
    renderWithRouter(<LandingPage />);
    expect(
      screen.getByRole('button', { name: /explore opportunities/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create your profile/i })
    ).toBeInTheDocument();
  });

  it('renders prominent job search inputs', () => {
    renderWithRouter(<LandingPage />);
    expect(
      screen.getByPlaceholderText(/job title, skills, or company/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/location/i)
    ).toBeInTheDocument();
  });

  it('renders three concise workflow steps in How It Works', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText('Build Your Profile')).toBeInTheDocument();
    expect(screen.getByText('Discover Opportunities')).toBeInTheDocument();
    expect(screen.getByText('Apply and Track Progress')).toBeInTheDocument();
  });

  it('displays featured opportunities with company and view details button', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByText(/featured placement opportunities/i)).toBeInTheDocument();
    expect(screen.getAllByText('Cognizant Technology Solutions').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('button', { name: /view details/i }).length).toBeGreaterThan(0);
  });
});
