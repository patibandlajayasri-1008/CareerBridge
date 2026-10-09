import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import JobsPage from '../pages/public/JobsPage';
import { ToastProvider } from '../context/ToastContext';

describe('Job Discovery & Filtering Tests', () => {
  const renderJobsPage = () => {
    return render(
      <ToastProvider>
        <BrowserRouter>
          <JobsPage />
        </BrowserRouter>
      </ToastProvider>
    );
  };

  it('renders all initial placement opportunities and search bar', () => {
    renderJobsPage();
    expect(
      screen.getByRole('heading', { name: /explore placement opportunities/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/search by job title, company name/i)
    ).toBeInTheDocument();
    expect(screen.getByText('Cognizant Technology Solutions')).toBeInTheDocument();
  });

  it('filters jobs when typing into keyword search', () => {
    renderJobsPage();
    const searchInput = screen.getByPlaceholderText(/search by job title, company name/i);
    fireEvent.change(searchInput, { target: { value: 'Zoho' } });

    expect(screen.getByText('Zoho Corporation')).toBeInTheDocument();
    expect(screen.queryByText('Cognizant Technology Solutions')).not.toBeInTheDocument();
  });

  it('filters jobs by employment type when selecting Internship pill', () => {
    renderJobsPage();
    const internshipPill = screen.getByRole('button', { name: 'Internship' });
    fireEvent.click(internshipPill);

    expect(screen.getByText('Zoho Corporation')).toBeInTheDocument();
    expect(screen.queryByText('Cognizant Technology Solutions')).not.toBeInTheDocument();
  });

  it('renders empty state when no job matches the search query', () => {
    renderJobsPage();
    const searchInput = screen.getByPlaceholderText(/search by job title, company name/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentTechRoleXYZ' } });

    expect(screen.getByText('No Matching Opportunities')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reset all filters/i })
    ).toBeInTheDocument();
  });

  it('resets all filters when clicking Reset Filters button', () => {
    renderJobsPage();
    const searchInput = screen.getByPlaceholderText(/search by job title, company name/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistentTechRoleXYZ' } });

    const resetButton = screen.getByRole('button', { name: /reset all filters/i });
    fireEvent.click(resetButton);

    expect(screen.getByText('Cognizant Technology Solutions')).toBeInTheDocument();
  });
});
