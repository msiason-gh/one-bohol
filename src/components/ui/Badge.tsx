import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
  children,
  ...props
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-xs gap-1.5',
    md: 'text-xs px-2.5 py-1 rounded-xs gap-2',
  }[size];

  const variantStyles = {
    neutral: 'bg-surface-sunk text-ink-soft border border-line',
    success: 'bg-[#1BA97B]/10 text-[#0F6F50] border border-[#1BA97B]/30',
    warning: 'bg-[#E0A22B]/10 text-[#96670D] border border-[#E0A22B]/30',
    error: 'bg-[#E0554E]/10 text-[#B82B24] border border-[#E0554E]/30',
    info: 'bg-[#2E90C4]/10 text-[#1C6891] border border-[#2E90C4]/30',
    primary: 'bg-primary/10 text-primary-deep border border-primary/25',
  }[variant];

  const dotColors = {
    neutral: 'bg-muted',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    primary: 'bg-primary',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-semibold tracking-wide uppercase select-none ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors}`} />}
      {children}
    </span>
  );
}
