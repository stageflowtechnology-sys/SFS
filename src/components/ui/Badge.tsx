import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'neutral'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'purple'
    | 'cyan'
    | 'outline'
    | 'currency';
  size?: 'xs' | 'sm';
  isMono?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  isMono = false,
  className = '',
  icon,
}) => {
  const variantStyles = {
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    purple: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    outline: 'bg-transparent text-slate-600 border-slate-300',
    currency: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-mono font-semibold',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.2 tracking-wider gap-1',
    sm: 'text-xs px-2 py-0.5 tracking-wide gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded border font-medium select-none whitespace-nowrap ${
        isMono ? 'font-mono' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
