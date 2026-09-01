import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  prefixText?: string;
  suffixText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isMono?: boolean;
  density?: 'compact' | 'standard';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      prefixText,
      suffixText,
      leftIcon,
      rightIcon,
      isMono = false,
      density = 'standard',
      className = '',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const heightClass = density === 'compact' ? 'h-7 text-xs px-2' : 'h-8 text-xs px-2.5';

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor={inputId}
              className={`font-semibold tracking-tight ${error ? 'text-rose-600' : 'text-slate-700'}`}
            >
              {label}
            </label>
            {helperText && !error && (
              <span className="text-[11px] text-slate-400">{helperText}</span>
            )}
          </div>
        )}

        <div
          className={`flex items-center rounded border transition-colors bg-slate-50 ${
            error
              ? 'border-rose-400 focus-within:ring-1 focus-within:ring-rose-400 bg-rose-50/20'
              : 'border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''}`}
        >
          {prefixText && (
            <span className="pl-2.5 pr-1 text-slate-400 font-mono text-xs select-none">
              {prefixText}
            </span>
          )}
          {leftIcon && <span className="pl-2 text-slate-400">{leftIcon}</span>}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed ${
              isMono ? 'font-mono' : ''
            } ${heightClass} ${className}`}
            {...props}
          />

          {rightIcon && <span className="pr-2 text-slate-400">{rightIcon}</span>}
          {suffixText && (
            <span className="pr-2.5 pl-1 text-slate-400 font-mono text-xs select-none">
              {suffixText}
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-0.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
  density?: 'compact' | 'standard';
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, options, density = 'standard', className = '', id, disabled, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const heightClass = density === 'compact' ? 'h-7 text-xs px-2' : 'h-8 text-xs px-2.5';

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor={inputId}
              className={`font-semibold tracking-tight ${error ? 'text-rose-600' : 'text-slate-700'}`}
            >
              {label}
            </label>
            {helperText && !error && (
              <span className="text-[11px] text-slate-400">{helperText}</span>
            )}
          </div>
        )}

        <div className="relative">
          <select
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={`w-full appearance-none rounded border transition-colors bg-slate-50 text-slate-800 focus:outline-none cursor-pointer ${
              error
                ? 'border-rose-400 focus:ring-1 focus:ring-rose-400'
                : 'border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/50'
            } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : ''} ${heightClass} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-white text-slate-800">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-1 text-[11px] text-rose-600 font-medium mt-0.5">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <label className={`inline-flex items-start gap-2.5 select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}>
      <input
        type="checkbox"
        disabled={disabled}
        className="mt-0.5 w-3.5 h-3.5 rounded border border-slate-300 bg-white text-slate-900 focus:ring-1 focus:ring-slate-400 accent-slate-900"
        {...props}
      />
      {(label || description) && (
        <div className="flex flex-col text-xs">
          {label && <span className="font-semibold text-slate-800">{label}</span>}
          {description && <span className="text-[11px] text-slate-500 leading-tight">{description}</span>}
        </div>
      )}
    </label>
  );
};

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}) => {
  return (
    <div
      onClick={() => !disabled && onChange(!checked)}
      className={`inline-flex items-center gap-3 select-none ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div
        className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 border ${
          checked ? 'bg-slate-900 border-slate-900' : 'bg-slate-200 border-slate-300'
        }`}
      >
        <div
          className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ${
            checked ? 'translate-x-3.5' : 'translate-x-0'
          }`}
        />
      </div>
      {(label || description) && (
        <div className="flex flex-col text-xs">
          {label && <span className="font-semibold text-slate-800">{label}</span>}
          {description && <span className="text-[11px] text-slate-500">{description}</span>}
        </div>
      )}
    </div>
  );
};
