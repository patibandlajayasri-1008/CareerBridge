import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export default function Select({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option...',
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...props
}) {
  const selectId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#172033] tracking-wide"
        >
          {label} {required && <span className="text-[#C2414B]">*</span>}
        </label>
      )}

      <div className="relative rounded-lg shadow-2xs">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-desc` : undefined}
          className={`w-full appearance-none text-sm rounded-lg border bg-white px-3.5 py-2.5 pr-10 transition-all duration-150 text-[#172033] disabled:bg-[#F8FAFC] disabled:text-[#94A3B8] disabled:cursor-not-allowed ${
            error
              ? 'border-[#C2414B] focus:border-[#C2414B] focus:ring-2 focus:ring-[#C2414B]/20'
              : 'border-[#E4E8F0] hover:border-[#CBD5E1] focus:border-[#3157D5] focus:ring-2 focus:ring-[#3157D5]/15 focus:outline-none'
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => {
            const optValue = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#667085]">
          <ChevronDown className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>

      {error ? (
        <p
          id={`${selectId}-error`}
          className="flex items-center gap-1 text-xs text-[#C2414B] font-medium pt-0.5"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p id={`${selectId}-desc`} className="text-xs text-[#667085] pt-0.5">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
