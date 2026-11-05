import React from 'react';

type BADGE_VARIANT = 'primary' | 'secondary' | 'outline';
const BADGE_VARIANTS: Record<BADGE_VARIANT, string> = {
  primary: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'text-foreground',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BADGE_VARIANT;
}

export default function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${BADGE_VARIANTS[variant ?? 'primary']} ${className}`} {...props} />;
}
