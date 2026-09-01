import React from 'react';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface FollowUpsBatchBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchComplete: () => void;
  onBatchSnooze: () => void;
  onBatchCancel: () => void;
}

export const FollowUpsBatchBar: React.FC<FollowUpsBatchBarProps> = ({
  selectedCount,
  onClearSelection,
  onBatchComplete,
  onBatchSnooze,
  onBatchCancel,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-800 flex items-center gap-4 animate-in slide-in-from-bottom duration-150">
      <div className="flex items-center gap-2 border-r border-slate-700 pr-3 text-xs">
        <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
        <span className="font-mono font-bold">{selectedCount}</span>
        <span className="text-slate-300">Selected</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onBatchComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Mark Completed</span>
        </button>

        <button
          onClick={onBatchSnooze}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
        >
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Snooze (+24h)</span>
        </button>

        <button
          onClick={onBatchCancel}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-semibold text-xs border border-rose-800/60 transition-colors"
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Cancel Tasks</span>
        </button>
      </div>

      <button
        onClick={onClearSelection}
        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
        title="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
