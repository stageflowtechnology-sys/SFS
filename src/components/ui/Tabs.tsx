import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  badgeVariant?: 'neutral' | 'warning' | 'purple' | 'success';
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'segmented' | 'pills';
  size?: 'sm' | 'md';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'sm',
  className = '',
}) => {
  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-0.5 rounded bg-slate-100 border border-slate-200 select-none ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
              }`}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    isActive ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant (standard financial ops header tabs)
  return (
    <div className={`flex items-center gap-6 border-b border-slate-200 select-none ${className}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`group relative pb-2.5 pt-1 text-xs font-semibold transition-colors flex items-center gap-2 border-b-2 -mb-px disabled:opacity-40 disabled:cursor-not-allowed ${
              isActive
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 border-slate-300 font-bold'
                    : 'bg-slate-50 text-slate-500 border-slate-200 group-hover:border-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
