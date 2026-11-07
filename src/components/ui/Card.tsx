import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 'flat' | 'raised' | 'lifted' | 'none';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  surface?: 'white' | 'sunk' | 'surface';
}

export function Card({
  elevation = 'raised',
  radius = 'md',
  surface = 'white',
  className = '',
  children,
  ...props
}: CardProps) {
  const elevationStyles = {
    none: '',
    flat: 'shadow-flat',
    raised: 'shadow-raised',
    lifted: 'shadow-lifted',
  }[elevation];

  const radiusStyles = {
    xs: 'rounded-xs',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
  }[radius];

  const surfaceStyles = {
    white: 'bg-background',
    surface: 'bg-surface',
    sunk: 'bg-surface-sunk',
  }[surface];

  return (
    <div
      className={`border border-line ${surfaceStyles} ${radiusStyles} ${elevationStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 border-b border-line flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 border-t border-line bg-surface/50 flex items-center justify-between ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
