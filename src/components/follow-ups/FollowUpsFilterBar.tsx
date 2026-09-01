import React from 'react';
import {
  Search,
  Filter,
  Sparkles,
  UserCheck,
  Phone,
  MessageSquare,
  Mail,
  FileCheck,
  ArrowUpDown,
  RotateCcw,
  Plus,
} from 'lucide-react';
import {
  FollowUpType,
  FollowUpSourceOrigin,
  FollowUpPriority,
  FollowUpFilterState,
} from '../../types/followUps';

interface FollowUpsFilterBarProps {
  filters: FollowUpFilterState;
  onUpdateFilters: (partial: Partial<FollowUpFilterState>) => void;
  onResetFilters: () => void;
  onCreateNew: () => void;
  totalFiltered: number;
}

export const FollowUpsFilterBar: React.FC<FollowUpsFilterBarProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  onCreateNew,
  totalFiltered,
}) => {
  const types: { id: 'ALL' | FollowUpType; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { id: 'ALL', label: 'All Types' },
    { id: 'CALL', label: 'Calls', icon: Phone },
    { id: 'SMS', label: 'SMS', icon: MessageSquare },
    { id: 'EMAIL', label: 'Email', icon: Mail },
    { id: 'REVIEW', label: 'Review', icon: FileCheck },
  ];

  const sources: { id: 'ALL' | FollowUpSourceOrigin; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { id: 'ALL', label: 'All Sources' },
    { id: 'AI_GENERATED', label: 'AI Inferred', icon: Sparkles },
    { id: 'MANUAL', label: 'Manual Directives', icon: UserCheck },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-3">
      {/* Top Filter Controls Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            placeholder="Search by account #, customer name, reason, or collector..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
          />
          {filters.search && (
            <button
              onClick={() => onUpdateFilters({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-mono"
            >
              ×
            </button>
          )}
        </div>

        {/* Collector Scope Toggle & Sort Select */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Collector Scope */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-semibold">
            <button
              onClick={() => onUpdateFilters({ collector: 'ALL' })}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filters.collector === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Collectors
            </button>
            <button
              onClick={() => onUpdateFilters({ collector: 'ME' })}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filters.collector === 'ME'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned to Me
            </button>
          </div>

          {/* Sort Field Selector */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono text-[10px] uppercase">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
              className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="DUE_DATE">Due Date</option>
              <option value="BALANCE">Account Balance</option>
              <option value="PRIORITY">Priority Urgency</option>
              <option value="CUSTOMER_NAME">Customer Name</option>
              <option value="TYPE">Action Type</option>
            </select>
            <button
              onClick={() =>
                onUpdateFilters({
                  sortDirection: filters.sortDirection === 'ASC' ? 'DESC' : 'ASC',
                })
              }
              title={`Switch to ${filters.sortDirection === 'ASC' ? 'Descending' : 'Ascending'}`}
              className="ml-1 text-[10px] font-mono font-bold text-slate-500 hover:text-indigo-600"
            >
              {filters.sortDirection}
            </button>
          </div>

          {/* Mobile Schedule Button */}
          <button
            onClick={onCreateNew}
            className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Pill Filters Bar: Type & Source Segmented Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Follow-Up Type Pills */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold mr-1">
              Type:
            </span>
            {types.map((t) => {
              const Icon = t.icon;
              const isSelected = filters.type === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdateFilters({ type: t.id })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Source Origin Pills (AI vs Manual) */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold mr-1">
              Source:
            </span>
            {sources.map((s) => {
              const Icon = s.icon;
              const isSelected = filters.source === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onUpdateFilters({ source: s.id })}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors border ${
                    isSelected
                      ? s.id === 'AI_GENERATED'
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                        : s.id === 'MANUAL'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-2xs'
                        : 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3 h-3 ${
                        isSelected
                          ? 'text-white'
                          : s.id === 'AI_GENERATED'
                          ? 'text-indigo-600'
                          : 'text-amber-600'
                      }`}
                    />
                  )}
                  <span>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter & Reset Action */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span>Showing <strong>{totalFiltered}</strong> Follow-Ups</span>
          {(filters.search ||
            filters.type !== 'ALL' ||
            filters.source !== 'ALL' ||
            filters.collector !== 'ALL') && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition-colors font-semibold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
