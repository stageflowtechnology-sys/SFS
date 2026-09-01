import React from 'react';
import { Filter, X, Plus, RotateCcw, Check } from 'lucide-react';
import { Badge } from './Badge';

export interface ActiveFilter {
  id: string;
  category: string;
  label: string;
  value: string;
}

export interface FilterBarProps {
  activeFilters: ActiveFilter[];
  onRemoveFilter: (id: string) => void;
  onClearAll: () => void;
  onOpenFilterDrawer?: () => void;
  totalMatchesCount?: number;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onRemoveFilter,
  onClearAll,
  onOpenFilterDrawer,
  totalMatchesCount,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-lg border border-slate-200 bg-white text-xs shadow-2xs ${className}`}
    >
      {/* Left side: Filter Trigger + Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {onOpenFilterDrawer && (
          <button
            onClick={onOpenFilterDrawer}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-slate-600" />
            <span>Filters</span>
            {activeFilters.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900 text-white font-mono text-[10px]">
                {activeFilters.length}
              </span>
            )}
          </button>
        )}

        {/* Active Filter Chips */}
        {activeFilters.length === 0 ? (
          <span className="text-slate-400 text-xs italic pl-1">
            No active filters applied (showing all records)
          </span>
        ) : (
          <div className="flex items-center gap-1.5 flex-wrap">
            {activeFilters.map((filter) => (
              <span
                key={filter.id}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-mono shadow-2xs group"
              >
                <span className="text-slate-400 uppercase text-[10px]">{filter.category}:</span>
                <span className="font-semibold text-slate-900">{filter.label}</span>
                <button
                  onClick={() => onRemoveFilter(filter.id)}
                  className="p-0.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                  title={`Remove filter ${filter.label}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {/* Clear All Button */}
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-500 hover:text-rose-600 hover:underline px-1.5 py-0.5 transition-colors font-medium"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Right side: Matches Count */}
      {typeof totalMatchesCount === 'number' && (
        <div className="text-[11px] font-mono text-slate-500">
          Matched: <span className="font-bold text-slate-900">{totalMatchesCount.toLocaleString()}</span> accounts
        </div>
      )}
    </div>
  );
};
