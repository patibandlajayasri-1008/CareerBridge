import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../components/common/Badge';

describe('Badge Component', () => {
  it('renders status text content correctly', () => {
    render(<Badge variant="Selected">Selected</Badge>);
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('applies proper status variant styles for Shortlisted', () => {
    const { container } = render(<Badge variant="Shortlisted">Shortlisted</Badge>);
    expect(container.firstChild.className).toContain('text-[#6478F0]');
  });

  it('renders neutral badge by default', () => {
    const { container } = render(<Badge>Default Badge</Badge>);
    expect(container.firstChild.className).toContain('bg-[#F1F5F9]');
  });
});
