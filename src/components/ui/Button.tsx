import React from 'react';
import Link from 'next/link';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      href,
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs h-8 px-3 rounded-xs gap-1.5',
      md: 'text-sm h-10 px-4 rounded-sm gap-2',
      lg: 'text-base h-12 px-6 rounded-sm gap-2.5 font-semibold',
    }[size];

    const variantStyles = {
      primary:
        'bg-brand-gradient text-white shadow-flat hover:shadow-raised hover:brightness-105 border-0',
      secondary:
        'bg-background hover:bg-surface text-ink-soft border border-line shadow-flat hover:border-muted/30',
      ghost:
        'bg-transparent hover:bg-surface-sunk text-muted hover:text-ink border-0',
      outline:
        'bg-transparent hover:bg-primary/5 text-primary-deep border border-primary/30 hover:border-primary',
      danger:
        'bg-error hover:bg-error/90 text-white shadow-flat border-0',
    }[variant];

    const classes = `${baseStyles} ${sizeStyles} ${variantStyles} ${className}`;

    if (href) {
      return (
        <Link href={href} className={classes}>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </Link>
      );
    }

    return (
      <button ref={ref} disabled={disabled || isLoading} className={classes} {...props}>
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
