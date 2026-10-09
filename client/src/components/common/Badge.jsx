import React from 'react';

/**
 * Enterprise Status Badge Component
 * WCAG-compliant color pairings for status states
 */
export default function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-[#3157D5]/10 text-[#3157D5] border border-[#3157D5]/20',
    secondary: 'bg-[#14213D]/10 text-[#14213D] border border-[#14213D]/20',
    neutral: 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]',
    success: 'bg-[#168568]/10 text-[#168568] border border-[#168568]/20',
    warning: 'bg-[#B7791F]/10 text-[#B7791F] border border-[#B7791F]/20',
    error: 'bg-[#C2414B]/10 text-[#C2414B] border border-[#C2414B]/20',
    // Status specific mappings
    Applied: 'bg-blue-50 text-[#3157D5] border-blue-200',
    'Under Review': 'bg-amber-50 text-[#B7791F] border-amber-200',
    Shortlisted: 'bg-indigo-50 text-[#6478F0] border-indigo-200',
    Selected: 'bg-emerald-50 text-[#168568] border-emerald-200',
    Rejected: 'bg-rose-50 text-[#C2414B] border-rose-200',
  };

  const selectedVariant = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${sizeStyles[size]} ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
