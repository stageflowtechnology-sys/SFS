import React from 'react';
import {
  UserCheck,
  RotateCcw,
  PhoneCall,
  Download,
  X,
  Layers,
  Check,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { WorkQueueAccount } from '../../types/workQueue';

interface BatchActionBarProps {
  selectedAccounts: WorkQueueAccount[];
  onClaimSelected: () => void;
  onReleaseSelected: () => void;
  onStartBatchDialer: () => void;
  onExportCsv: () => void;
  onClearSelection: () => void;
  currentOperatorId: string;
}

export const BatchActionBar: React.FC<BatchActionBarProps> = ({
  selectedAccounts,
  onClaimSelected,
  onReleaseSelected,
  onStartBatchDialer,
  onExportCsv,
  onClearSelection,
  currentOperatorId,
}) => {
  if (selectedAccounts.length === 0) return null;

  const totalBalance = selectedAccounts.reduce((acc, curr) => acc + curr.balance, 0);
  const unclaimedCount = selectedAccounts.filter((a) => a.ownership.state === 'UNCLAIMED').length;
  const myClaimedCount = selectedAccounts.filter(
    (a) => a.ownership.state === 'CLAIMED_BY_ME' || a.ownership.claimedByOperatorId === currentOperatorId
  ).length;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-4xl w-[92vw] sm:w-auto bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-800 p-2.5 px-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
      {/* Selection Details */}
      <div className="flex items-center gap-2.5">
        <div className="h-6 w-6 rounded-md bg-indigo-600 text-white text-xs font-mono font-bold flex items-center justify-center">
          {selectedAccounts.length}
        </div>
        <div>
          <span className="text-xs font-bold font-sans">
            {selectedAccounts.length} {selectedAccounts.length === 1 ? 'account' : 'accounts'} selected
          </span>
          <span className="text-xs font-mono text-slate-300 ml-2">
            (${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} exposure)
          </span>
        </div>
      </div>

      {/* Batch Actions */}
      <div className="flex items-center gap-2">
        {unclaimedCount > 0 && (
          <button
            onClick={onClaimSelected}
            className="px-2.5 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-2xs font-mono"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Claim Available ({unclaimedCount})</span>
          </button>
        )}

        {myClaimedCount > 0 && (
          <button
            onClick={onReleaseSelected}
            className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700 font-mono"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Release ({myClaimedCount})</span>
          </button>
        )}

        <button
          onClick={onStartBatchDialer}
          className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Launch Dial Queue</span>
        </button>

        <button
          onClick={onExportCsv}
          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onClearSelection}
          className="p-1.5 text-slate-400 hover:text-slate-200 ml-1 rounded"
          title="Deselect all"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
