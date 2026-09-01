import React from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Rows3,
  Rows4,
  Check,
  ChevronDown,
} from 'lucide-react';
import { WorkQueueFilters, PriorityLevel, QueueStage, DelinquencyBucket } from '../../types/workQueue';
import { Button } from '../ui/Button';

interface QueueFilterBarProps {
  filters: WorkQueueFilters;
  onChangeFilters: (filters: WorkQueueFilters) => void;
  onResetFilters: () => void;
  density: 'compact' | 'standard';
  onToggleDensity: (mode: 'compact' | 'standard') => void;
  totalMatching: number;
  totalAll: number;
}

export const QueueFilterBar: React.FC<QueueFilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  density,
  onToggleDensity,
  totalMatching,
  totalAll,
}) => {
  const isFiltered =
    filters.search !== '' ||
    filters.ownership !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.stage !== 'ALL' ||
    filters.dpdBucket !== 'ALL' ||
    filters.balanceRange !== 'ALL' ||
    filters.followUp !== 'ALL' ||
    filters.campaign !== '';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xs space-y-2.5">
      {/* Search Input & Quick Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1 flex items-center rounded border bg-slate-50 border-slate-200 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-400/50 shadow-2xs transition-colors h-8 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 ml-2.5 shrink-0" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChangeFilters({ ...filters, search: e.target.value })}
            placeholder="Search account #, customer name, creditor, phone, tax ID, or campaign..."
            className="w-full bg-transparent text-slate-900 placeholder-slate-400 px-2 text-xs focus:outline-none font-sans"
          />
          {filters.search && (
            <button
              onClick={() => onChangeFilters({ ...filters, search: '' })}
              className="p-1 text-slate-400 hover:text-slate-700 mr-1 rounded"
              title="Clear search"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Controls & Density Toggle */}
        <div className="flex items-center gap-2 shrink-0 justify-between md:justify-end">
          {/* Density Toggle */}
          <div className="inline-flex rounded bg-slate-100 p-0.5 border border-slate-200 shadow-2xs text-[11px] font-mono">
            <button
              onClick={() => onToggleDensity('compact')}
              className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                density === 'compact'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Compact rows for high-density scanning"
            >
              <Rows4 className="w-3 h-3" />
              <span>Compact</span>
            </button>
            <button
              onClick={() => onToggleDensity('standard')}
              className={`px-2 py-1 rounded flex items-center gap-1 font-medium transition-colors ${
                density === 'standard'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Standard row spacing"
            >
              <Rows3 className="w-3 h-3" />
              <span>Standard</span>
            </button>
          </div>

          {/* Reset Filters if active */}
          {isFiltered && (
            <Button
              size="xs"
              variant="outline"
              leftIcon={<RotateCcw className="w-3 h-3 text-slate-500" />}
              onClick={onResetFilters}
            >
              Reset Filters
            </Button>
          )}

          {/* Matching Count Tag */}
          <div className="text-[11px] font-mono text-slate-500 px-2 py-1 bg-slate-50 rounded border border-slate-200">
            <strong>{totalMatching}</strong> of <strong>{totalAll}</strong> accounts
          </div>
        </div>
      </div>

      {/* Filter Selectors Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1 border-t border-slate-100 text-xs">
        {/* 1. Ownership / Claim Status */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-0.5">
            Ownership
          </label>
          <select
            value={filters.ownership}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                ownership: e.target.value as WorkQueueFilters['ownership'],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans cursor-pointer"
          >
            <option value="ALL">All Ownership</option>
            <option value="UNCLAIMED">Unclaimed Only</option>
            <option value="CLAIMED_BY_ME">Claimed by Me</option>
            <option value="CLAIMED_BY_OTHERS">Claimed by Others</option>
          </select>
        </div>

        {/* 2. Priority */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-0.5">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                priority: e.target.value as WorkQueueFilters['priority'],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="P1_CRITICAL">P1 - Critical</option>
            <option value="P2_HIGH">P2 - High</option>
            <option value="P3_MEDIUM">P3 - Medium</option>
            <option value="P4_LOW">P4 - Low</option>
          </select>
        </div>

        {/* 3. Stage */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-0.5">
            Stage
          </label>
          <select
            value={filters.stage}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                stage: e.target.value as WorkQueueFilters['stage'],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans cursor-pointer"
          >
            <option value="ALL">All Stages</option>
            <option value="EARLY_DELINQUENCY">Early Delinquency</option>
            <option value="MID_COLLECTION">Mid-Stage Recovery</option>
            <option value="BROKEN_PTP">Broken PTP</option>
            <option value="DISPUTE_REVIEW">Dispute Review</option>
            <option value="PRE_LEGAL">Pre-Legal Staging</option>
            <option value="SKIP_TRACE_ACTIVE">Skip Trace Active</option>
          </select>
        </div>

        {/* 4. DPD Bucket */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-0.5">
            DPD Bucket
          </label>
          <select
            value={filters.dpdBucket}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                dpdBucket: e.target.value as WorkQueueFilters['dpdBucket'],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans cursor-pointer"
          >
            <option value="ALL">All DPD</option>
            <option value="1_30">1 - 30 Days</option>
            <option value="31_60">31 - 60 Days</option>
            <option value="61_90">61 - 90 Days</option>
            <option value="91_180">91 - 180 Days</option>
            <option value="180_PLUS">180+ Days</option>
          </select>
        </div>

        {/* 5. Balance Range */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-0.5">
            Balance
          </label>
          <select
            value={filters.balanceRange}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                balanceRange: e.target.value as WorkQueueFilters['balanceRange'],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans cursor-pointer"
          >
            <option value="ALL">All Balances</option>
            <option value="OVER_25K">&gt; $25,000</option>
            <option value="10K_TO_25K">$10,000 - $25,000</option>
            <option value="5K_TO_10K">$5,000 - $10,000</option>
            <option value="UNDER_5K">&lt; $5,000</option>
          </select>
        </div>

        {/* 6. Follow-Up Schedule */}
        <div>
          <label className="block text-[10px] font-mono font-bold uppercase text-slate-400 mb-0.5">
            Follow-Up
          </label>
          <select
            value={filters.followUp}
            onChange={(e) =>
              onChangeFilters({
                ...filters,
                followUp: e.target.value as WorkQueueFilters['followUp'],
              })
            }
            className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-sans cursor-pointer"
          >
            <option value="ALL">All Follow-ups</option>
            <option value="DUE_TODAY">Due Today</option>
            <option value="OVERDUE">Overdue</option>
            <option value="UPCOMING">Upcoming</option>
          </select>
        </div>
      </div>
    </div>
  );
};
