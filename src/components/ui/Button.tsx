import React from 'react';
import { Loader2, Sparkles, CheckCheck } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'ai-action'
    | 'authoritative-confirm'
    | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'sm',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-all duration-150 select-none focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-white disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.99] whitespace-nowrap';

  const sizeStyles = {
    xs: 'text-xs h-7 px-2.5 gap-1.5 font-normal tracking-wide',
    sm: 'text-xs h-8 px-3 gap-2 tracking-wide font-semibold',
    md: 'text-sm h-9 px-3.5 gap-2 font-semibold',
    lg: 'text-sm h-10 px-4 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 border border-transparent shadow-xs focus:ring-slate-400 font-semibold',
    secondary:
      'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 hover:border-slate-300 focus:ring-slate-300 shadow-2xs',
    outline:
      'bg-transparent text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-200 hover:border-slate-400 focus:ring-slate-300',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 focus:ring-slate-300',
    destructive:
      'bg-rose-50 text-rose-700 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 focus:ring-rose-300 shadow-2xs',
    'ai-action':
      'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 border border-indigo-200 hover:border-indigo-300 shadow-2xs focus:ring-indigo-300',
    'authoritative-confirm':
      'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 font-semibold border border-emerald-700 shadow-xs focus:ring-emerald-400',
    subtle:
      'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 focus:ring-slate-300',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
      ) : (
        <>
          {variant === 'ai-action' && !leftIcon && (
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          )}
          {variant === 'authoritative-confirm' && !leftIcon && (
            <CheckCheck className="w-3.5 h-3.5 text-white shrink-0" />
          )}
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        </>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
