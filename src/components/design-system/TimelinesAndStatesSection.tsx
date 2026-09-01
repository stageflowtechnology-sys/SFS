import React, { useState } from 'react';
import {
  GitCommit,
  Filter,
  Layers,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
} from 'lucide-react';
import { Timeline, TimelineItem } from '../ui/Timeline';
import { FilterBar, ActiveFilter } from '../ui/FilterBar';
import { Pagination } from '../ui/Pagination';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { ConfirmationState } from '../ui/ConfirmationState';

const SAMPLE_TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: 't-1',
    timestamp: '2026-08-31 20:30:14 UTC',
    title: 'Bank Settlement Reconciled ($28,950.00 Cleared)',
    description: 'ACH clearinghouse counterparty acknowledgement matched against internal core banking ledger. Balance reduced to $0.00.',
    origin: 'VERIFIED_GROUND_TRUTH',
    hash: '0x8849...32AC',
    metadata: [
      { label: 'Rail', value: 'Fedwire / ACH' },
      { label: 'Status', value: 'RECONCILED_CLEARED' },
    ],
  },
  {
    id: 't-2',
    timestamp: '2026-08-31 20:25:02 UTC',
    title: 'ACH Gateway Dispatch In-Flight',
    description: 'Automated direct debit triggered for debtor settlement installment. Mutual exclusion lock acquired on account.',
    origin: 'SYSTEM_EXECUTION',
    metadata: [
      { label: 'Job ID', value: 'ACH-BATCH-9941' },
      { label: 'Lock', value: 'MUTEX_ACQUIRED' },
    ],
  },
  {
    id: 't-3',
    timestamp: '2026-08-31 18:14:22 UTC',
    title: 'Human Discretion Sign-off Approved',
    description: 'Licensed recovery specialist approved 15% settlement write-down following recorded verbal hardship disclosure.',
    origin: 'HUMAN_DECISION',
    operatorId: '402',
    metadata: [
      { label: 'Signed By', value: 'A. Santiago (NMLS #8820491)' },
      { label: 'Discount', value: '$4,342.50 USD' },
    ],
  },
  {
    id: 't-4',
    timestamp: '2026-08-31 16:02:11 UTC',
    title: 'AI Copilot Recovery Strategy Inferred',
    description: 'Statistical prediction identified high propensity to settle based on recent payroll cadence and direct deposit pattern.',
    origin: 'AI_RECOMMENDATION',
    confidence: 0.91,
    metadata: [
      { label: 'Model', value: 'Recovery-Optimizer v4.2' },
      { label: 'Standing', value: 'Non-Authoritative Advisory' },
    ],
  },
  {
    id: 't-5',
    timestamp: '2026-08-30 09:12:00 UTC',
    title: 'ACH Direct Debit Returned NSF (Rollback Executed)',
    description: 'Payment gateway rejected initial direct debit with R01 Insufficient Funds. Transaction rolled back to avoid ledger discrepancy.',
    origin: 'EXECUTION_FAILED',
    metadata: [
      { label: 'Exception', value: 'ERR_ACH_R01' },
      { label: 'Action', value: 'Requeued for secondary retry' },
    ],
  },
];

export const TimelinesAndStatesSection: React.FC = () => {
  // Filter bar state
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([
    { id: 'f-1', category: 'DPD', label: '> 90 Days', value: 'dpd_90' },
    { id: 'f-2', category: 'Origin', label: 'AI Advisory', value: 'ai_advisory' },
    { id: 'f-3', category: 'Entity', label: 'Apex Recovery', value: 'apex' },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // States demo selector
  const [activeStateDemo, setActiveStateDemo] = useState<
    'timeline' | 'filters_pagination' | 'loading' | 'error' | 'confirmation'
  >('timeline');

  const handleRemoveFilter = (id: string) => {
    setActiveFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="space-y-10">
      {/* Overview Banner */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600">
              Operational States & Audit Primitives
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Timelines, Filters, Pagination & Lifecycle States
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Standardized components for audit lineage, operational filtering, tabular data navigation,
              asynchronous loading, error recovery rollbacks, and regulatory confirmation gates.
            </p>
          </div>
        </div>

        {/* State Switcher */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-200 flex-wrap">
          {[
            { id: 'timeline', label: 'Audit Timeline (5 Origins)' },
            { id: 'filters_pagination', label: 'Filters & Pagination' },
            { id: 'loading', label: 'Loading & Inference States' },
            { id: 'error', label: 'Error & Rollback States' },
            { id: 'confirmation', label: 'Authoritative Confirmation Gate' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStateDemo(item.id as any)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                activeStateDemo === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Timeline Showcase */}
      {activeStateDemo === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <GitCommit className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Audit Timeline with 5-Origin Visual Discrimination
            </h3>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
            <Timeline items={SAMPLE_TIMELINE_ITEMS} />
          </div>
        </div>
      )}

      {/* 2. Filters & Pagination Showcase */}
      {activeStateDemo === 'filters_pagination' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Filter className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Operational Filter Bar & Tabular Pagination Controls
            </h3>
          </div>

          <div className="space-y-4">
            {/* Filter Bar Component */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-800">
                Filter Bar with Dynamic Badges & Quick Removal
              </div>
              <FilterBar
                activeFilters={activeFilters}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
                onOpenFilterDrawer={() => alert('Filter configuration drawer triggered')}
                totalMatchesCount={1428}
              />
            </div>

            {/* Pagination Component */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-slate-800">
                High-Density Ledger Pagination Component
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={58}
                pageSize={pageSize}
                totalItems={1428}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Loading States Showcase */}
      {activeStateDemo === 'loading' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Asynchronous & AI Inference Loading States
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LoadingState
              variant="ai-inference"
              label="Running Settlement Risk Model v4.2"
              description="Evaluating cashflow volatility and historical installment compliance..."
            />

            <LoadingState
              variant="progress"
              label="Reconciling Daily Batch with Fedwire"
              description="Processing ledger block 482 of 500 records..."
              progressPercent={84}
            />

            <div className="md:col-span-2">
              <LoadingState
                variant="table-skeleton"
                label="Streaming Ledger Records from Core Banking..."
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Error States Showcase */}
      {activeStateDemo === 'error' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. Exception Handling & Safe Rollback States
            </h3>
          </div>

          <ErrorState
            title="Gateway Communication Failure: Socket Closed (ERR_CONN_RESET)"
            errorCode="ERR_GATEWAY_NET_RESET_504"
            errorMessage="The payment gateway failed to acknowledge transaction #TX-9941 within the statutory 15s timeout window. Transaction rolled back to prevent double billing."
            details="Trace: NetworkTimeout: Host payment-gw.core.bank:443 did not respond\n  at ACHConnectionPool.send (ach_pool.ts:204:11)\n  Idempotency Key: IDEM-882109-A\n  Account ID: ACC-8910-234"
            traceId="TRC-504-ACH-998"
            onRetry={() => alert('Retrying gateway dispatch...')}
            onRollback={() => alert('Reverted to checkpoint')}
          />
        </div>
      )}

      {/* 5. Confirmation State Showcase */}
      {activeStateDemo === 'confirmation' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              5. Authoritative Confirmation & Regulatory Gate State
            </h3>
          </div>

          <ConfirmationState
            title="Authoritative Write-Off Authorization Gate"
            impactLevel="STATUTORY_IRREVOCABLE"
            accountNumber="ACC-9941-002"
            debtorName="Kallisto Technologies Inc."
            principalAmount={182300.0}
            proposedAction="Authorize 35% Exceptional Principal Write-Down ($63,805.00 reduction)"
            impactSummary="This action permanently forgives debt principal, issues 1099-C tax reporting documentation, and closes the active claim file."
            onConfirm={(notes) => alert(`Confirmed with operator notes: ${notes}`)}
            onCancel={() => alert('Operation cancelled')}
          />
        </div>
      )}
    </div>
  );
};
