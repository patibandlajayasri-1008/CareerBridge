import React from 'react';

/**
 * Enterprise Button Component
 * Supports variants: primary, secondary, outline, ghost, danger
 * Includes loading spinner and micro-interaction hover lift
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-55 disabled:cursor-not-allowed disabled:transform-none select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#3157D5] hover:bg-[#2444b0] text-white shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus:ring-[#3157D5]',
    secondary:
      'bg-[#14213D] hover:bg-[#0B1220] text-white shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus:ring-[#14213D]',
    outline:
      'border border-[#E4E8F0] bg-white hover:bg-[#F6F8FC] text-[#172033] shadow-xs hover:border-[#CBD5E1] focus:ring-[#3157D5]',
    ghost:
      'text-[#667085] hover:text-[#14213D] hover:bg-[#F1F5F9] focus:ring-[#3157D5]',
    danger:
      'bg-[#C2414B] hover:bg-[#A8323B] text-white shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 focus:ring-[#C2414B]',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {!isLoading && Icon && iconPosition === 'left' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden="true" />
      )}
      <span>{children}</span>
      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden="true" />
      )}
    </button>
  );
}
