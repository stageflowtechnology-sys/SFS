import React, { useState } from 'react';
import {
  Bell,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Layers,
  Inbox,
  AlertOctagon,
  CheckCheck,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Alert } from '../ui/Alert';
import { Button } from '../ui/Button';
import { EmptyState, SkeletonRow } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { Drawer } from '../ui/Drawer';
import { StatusPill } from '../ui/StatusPill';
import { OriginBadge } from '../ui/OriginBadge';

interface FeedbackAndOverlaysSectionProps {
  onOpenModalDemo: () => void;
  onOpenDrawerDemo: () => void;
}

export const FeedbackAndOverlaysSection: React.FC<FeedbackAndOverlaysSectionProps> = ({
  onOpenModalDemo,
  onOpenDrawerDemo,
}) => {
  const [emptyStateTab, setEmptyStateTab] = useState<'empty_queue' | 'filter_empty' | 'loading'>('empty_queue');
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => setIsRetrying(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* 1. Alerts & Operational State Banners */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Alerts & Five Operational State Banners
          </h3>
        </div>

        <div className="space-y-3">
          {/* 1. AI Recommendation Alert */}
          <Alert
            originType="AI_RECOMMENDATION"
            title="AI Settlement Opportunity Detected (89% Confidence)"
            description="The ML recovery engine suggests extending a 15% discount ($4,200 reduction) to close account ACC-8910-234 prior to month-end statutory cutoff."
            metadata={[
              { label: 'Model', value: 'Recovery-Optimizer v3.4' },
              { label: 'Projected Recovery', value: '$23,800.00 USD' },
              { label: 'Statute Expiration', value: '14 Days' },
            ]}
            action={{
              label: 'Review Suggestion',
              onClick: onOpenDrawerDemo,
            }}
          />

          {/* 2. Human Review Required Gate */}
          <Alert
            originType="HUMAN_DECISION"
            title="Human Sign-Off Required: Threshold Exceeded (> $10,000)"
            description="Automated loan restructuring exceeds autonomous officer threshold ($10,000 limit). Requires signature from a licensed Senior Recovery Manager."
            metadata={[
              { label: 'Pending Item', value: 'Settlement Deed #ST-882' },
              { label: 'Principal Balance', value: '$48,500.00 USD' },
              { label: 'Assigned Officer', value: 'J. Vance (#402)' },
            ]}
            action={{
              label: 'Sign & Authorize',
              onClick: onOpenModalDemo,
            }}
          />

          {/* 3. Active System Execution Running */}
          <Alert
            originType="SYSTEM_EXECUTION"
            title="ACH Gateway Batch Execution in Progress"
            description="Processing Fedwire direct debit for 14 scheduled debtor accounts totaling $62,400.00 USD. Pipeline lock active to prevent duplicate billing."
            metadata={[
              { label: 'Batch ID', value: 'FED-20260831-09' },
              { label: 'Lock State', value: 'MUTEX_ACQUIRED' },
              { label: 'Estimated ACK', value: '~2 minutes' },
            ]}
          />

          {/* 4. Verified Ground Truth */}
          <Alert
            originType="VERIFIED_GROUND_TRUTH"
            title="Ledger Reconciled: Full Satisfaction Cleared"
            description="Counterparty bank ACH confirmation received and matched against internal core banking ledger. Account marked COMPLETED and balance zeroed."
            metadata={[
              { label: 'Ledger Hash', value: '0x8849c...91b2' },
              { label: 'Bureau Metro2', value: 'Queued for Reporting' },
              { label: 'Timestamp', value: '2026-08-31 20:30:14 UTC' },
            ]}
          />

          {/* 5. Execution Failure with Retry Action */}
          <Alert
            originType="EXECUTION_FAILED"
            title="Execution Exception: Webhook Socket Timeout (ERR_GATEWAY_TIMEOUT)"
            description="Payment gateway did not respond within the 15,000ms SLA window. State was safely rolled back to PRE_DISPATCH to avoid balance corruption."
            metadata={[
              { label: 'Failure Code', value: 'ERR_TIMEOUT_GATEWAY' },
              { label: 'Account', value: 'ACC-3310-771' },
              { label: 'Retry Attempt', value: '1 of 3' },
            ]}
            action={{
              label: isRetrying ? 'Retrying Dispatch...' : 'Retry Execution',
              onClick: handleRetry,
              icon: <RotateCcw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />,
            }}
          />
        </div>
      </div>

      {/* 2. Modals & Drawers Triggers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Overlays: Authoritative Modal & Decision Audit Drawer
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-2xs">
          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  Authoritative Confirmation Modal
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Requires explicit 2-step verification, shows exact ledger impact, and warns of irrevocable debt write-offs or legal notices.
              </p>
            </div>
            <Button
              variant="authoritative-confirm"
              size="sm"
              onClick={onOpenModalDemo}
            >
              Launch Confirmation Modal Demo
            </Button>
          </div>

          <div className="p-4 rounded-md bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-slate-900">
                  AI Decision Lineage & Audit Drawer
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Displays the underlying ML prompt, model version, factor weights, and comparative historical debtor recovery analytics.
              </p>
            </div>
            <Button
              variant="ai-action"
              size="sm"
              onClick={onOpenDrawerDemo}
            >
              Inspect AI Decision Drawer Demo
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Empty States & Loading Skeletons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Empty States, Loading States & Error Handlers
            </h3>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setEmptyStateTab('empty_queue')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                emptyStateTab === 'empty_queue'
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Empty Queue
            </button>
            <button
              onClick={() => setEmptyStateTab('filter_empty')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                emptyStateTab === 'filter_empty'
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              No Filter Matches
            </button>
            <button
              onClick={() => setEmptyStateTab('loading')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                emptyStateTab === 'loading'
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 bg-slate-100'
              }`}
            >
              Table Loading Skeleton
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-2xs">
          {emptyStateTab === 'empty_queue' && (
            <EmptyState
              icon="shield"
              title="No Pending Confirmation Gates"
              description="All autonomous debt recovery strategies have been reconciled or reviewed. The current operations queue is fully caught up."
              action={{
                label: 'Run Batch Ingestion Cycle',
                onClick: () => {},
              }}
            />
          )}

          {emptyStateTab === 'filter_empty' && (
            <EmptyState
              icon="filter"
              title="No Debt Accounts Found"
              description="No accounts in portfolio match the current filter criteria (DPD > 180, AI Confidence > 95%). Try broadening your query parameters."
              action={{
                label: 'Reset All Active Filters',
                onClick: () => {},
              }}
            />
          )}

          {emptyStateTab === 'loading' && (
            <div className="rounded-md border border-slate-200 overflow-hidden bg-slate-50">
              <div className="p-3 border-b border-slate-200 font-mono text-xs text-slate-500 flex items-center justify-between">
                <span>Fetching Portfolio Ledger from Core Banking Rail...</span>
                <span className="text-indigo-600 font-semibold animate-pulse">Syncing...</span>
              </div>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
