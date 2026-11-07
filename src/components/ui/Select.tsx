import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      children,
      className = '',
      wrapperClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`w-full space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[13px] font-semibold text-ink-soft tracking-tight"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={`w-full appearance-none bg-background border rounded-sm text-sm text-ink transition-all duration-150 disabled:opacity-50 disabled:bg-surface-sunk pl-3.5 pr-10 py-2.5 h-11 cursor-pointer ${
              error
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-line focus-glow'
            } ${className}`}
            {...props}
          >
            {children}
          </select>

          <div className="absolute right-3.5 flex items-center pointer-events-none text-muted shrink-0">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {error && <p className="text-xs text-error font-medium">{error}</p>}
        {!error && hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
