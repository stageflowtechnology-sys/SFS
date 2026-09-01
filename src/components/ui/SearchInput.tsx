import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Command, Filter, ChevronDown, Check } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  shortcut?: string;
  isDense?: boolean;
  onClear?: () => void;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search account #, debtor name, SSN/TIN, SSCC reference...',
  shortcut = '⌘K',
  isDense = false,
  onClear,
  className = '',
}) => {
  return (
    <div
      className={`relative flex items-center w-full rounded border bg-slate-50 border-slate-200 focus-within:border-slate-400 focus-within:ring-1 focus-within:ring-slate-400/50 shadow-2xs transition-colors ${
        isDense ? 'h-7.5 text-xs' : 'h-8.5 text-xs'
      } ${className}`}
    >
      <Search className="w-3.5 h-3.5 text-slate-400 ml-2.5 shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-2 text-xs focus:outline-none"
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          className="p-1 text-slate-400 hover:text-slate-700 mr-1 rounded"
        >
          <X className="w-3 h-3" />
        </button>
      )}
      {shortcut && !value && (
        <kbd className="mr-2 text-[10px] font-mono px-1.5 py-0.5 bg-white text-slate-500 rounded border border-slate-200 shadow-2xs select-none">
          {shortcut}
        </kbd>
      )}
    </div>
  );
};

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isDestructive?: boolean;
  disabled?: boolean;
  badge?: string;
  dividerAbove?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  onSelect,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-flex ${className}`}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 min-w-[170px] rounded border border-slate-200 bg-white shadow-lg py-1 text-xs animate-in fade-in-0 zoom-in-95 duration-100 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, idx) => (
            <React.Fragment key={item.id || idx}>
              {item.dividerAbove && <div className="my-1 border-t border-slate-100" />}
              <button
                disabled={item.disabled}
                onClick={() => {
                  onSelect(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                  item.isDestructive
                    ? 'text-rose-600 hover:bg-rose-50'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-500">
                    {item.badge}
                  </span>
                )}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
