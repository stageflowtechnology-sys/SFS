import React from 'react';
import {
  Inbox,
  UserCheck,
  CalendarClock,
  Zap,
  ArrowRight,
  TrendingUp,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { WorkQueueAccount } from '../../types/workQueue';
import { Button } from '../ui/Button';

interface QueueStatSummaryProps {
  accounts: WorkQueueAccount[];
  currentOperatorId: string;
  onQuickClaimNext: () => void;
  unclaimedHighPriorityCount: number;
}

export const QueueStatSummary: React.FC<QueueStatSummaryProps> = ({
  accounts,
  currentOperatorId,
  onQuickClaimNext,
  unclaimedHighPriorityCount,
}) => {
  const unclaimedAccounts = accounts.filter((a) => a.ownership.state === 'UNCLAIMED');
  const unclaimedBalance = unclaimedAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const myClaimedAccounts = accounts.filter(
    (a) => a.ownership.state === 'CLAIMED_BY_ME' || a.ownership.claimedByOperatorId === currentOperatorId
  );
  const myClaimedBalance = myClaimedAccounts.reduce((acc, curr) => acc + curr.balance, 0);

  const dueTodayCount = accounts.filter(
    (a) => a.followUpStatus === 'DUE_TODAY' || a.followUpStatus === 'OVERDUE'
  ).length;

  const criticalP1Count = accounts.filter((a) => a.priority === 'P1_CRITICAL').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {/* 1. Unclaimed Available */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">
            Unclaimed Available
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold font-mono text-slate-900">
            {unclaimedAccounts.length}
          </span>
          <span className="text-xs font-mono text-slate-500">
            ${(unclaimedBalance / 1000).toFixed(0)}k total
          </span>
        </div>
        <div className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center gap-1 font-mono">
          <span>Ready for immediate claiming</span>
        </div>
      </div>

      {/* 2. My Active Claims */}
      <div className="p-3 rounded-lg bg-indigo-50/40 border border-indigo-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase text-indigo-900">
            My Active Claims
          </span>
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold font-mono text-indigo-950">
            {myClaimedAccounts.length}
          </span>
          <span className="text-xs font-mono text-indigo-700 font-semibold">
            ${(myClaimedBalance / 1000).toFixed(1)}k assigned
          </span>
        </div>
        <div className="text-[10px] text-indigo-700 font-medium mt-1 font-mono">
          <span>Operator Queue: {currentOperatorId}</span>
        </div>
      </div>

      {/* 3. Follow-Ups Due Today */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">
            Follow-Ups Due
          </span>
          <CalendarClock className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold font-mono text-amber-700">
            {dueTodayCount}
          </span>
          <span className="text-xs font-mono text-slate-500">
            Active Schedule
          </span>
        </div>
        <div className="text-[10px] text-amber-800 font-medium mt-1 font-mono">
          <span>PTP & Callback windows</span>
        </div>
      </div>

      {/* 4. Critical P1 Cases */}
      <div className="p-3 rounded-lg bg-white border border-slate-200 shadow-2xs hidden sm:block">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold uppercase text-slate-500">
            Critical (P1)
          </span>
          <Flame className="w-3.5 h-3.5 text-rose-600" />
        </div>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-bold font-mono text-rose-700">
            {criticalP1Count}
          </span>
          <span className="text-xs font-mono text-slate-500">
            High Propensity
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium mt-1 font-mono">
          <span>Broken PTP & Pre-Legal</span>
        </div>
      </div>

      {/* 5. Quick Claim Next Button */}
      <div className="p-2.5 rounded-lg bg-slate-900 text-white flex flex-col justify-between shadow-xs col-span-2 sm:col-span-2 lg:col-span-1">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              Auto-Routing
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
              {unclaimedHighPriorityCount} P1/P2
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
            Claim highest propensity account
          </p>
        </div>

        <button
          onClick={onQuickClaimNext}
          disabled={unclaimedAccounts.length === 0}
          className="mt-2 w-full py-1 px-2.5 rounded bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-mono text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Claim Next Account</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
