import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  autoComplete,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#172033] tracking-wide"
        >
          {label} {required && <span className="text-[#C2414B]">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-2xs">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
            <Icon className="w-4 h-4" aria-hidden="true" />
          </div>
        )}

        <input
          id={inputId}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-desc` : undefined}
          className={`w-full text-sm rounded-lg border bg-white px-3.5 py-2.5 transition-all duration-150 text-[#172033] placeholder-[#94A3B8] disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed ${
            Icon ? 'pl-9' : ''
          } ${isPassword ? 'pr-10' : ''} ${
            error
              ? 'border-[#C2414B] focus:border-[#C2414B] focus:ring-2 focus:ring-[#C2414B]/20'
              : 'border-[#E4E8F0] hover:border-[#CBD5E1] focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 focus:outline-none'
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#667085] hover:text-[#14213D] focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p
          id={`${inputId}-error`}
          className="flex items-center gap-1 text-xs text-[#C2414B] font-medium pt-0.5"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${inputId}-desc`} className="text-xs text-[#667085] pt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
