import React from 'react';
import { Loader2, RefreshCw, Sparkles, Database } from 'lucide-react';

export interface LoadingStateProps {
  label?: string;
  description?: string;
  variant?: 'spinner' | 'card-skeleton' | 'table-skeleton' | 'ai-inference' | 'progress';
  progressPercent?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  label = 'Processing ledger transaction...',
  description = 'Reconciling counterparty banking rails and validating compliance gates.',
  variant = 'spinner',
  progressPercent,
  className = '',
}) => {
  if (variant === 'table-skeleton') {
    return (
      <div className={`rounded-lg border border-slate-200 bg-white overflow-hidden shadow-2xs ${className}`}>
        <div className="p-3 border-b border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-500 bg-slate-50">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />
            <span>{label}</span>
          </div>
          <span className="text-slate-400">Syncing with Core Banking API</span>
        </div>

        <div className="divide-y divide-slate-100 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 px-4 bg-slate-50/40">
              <div className="w-4 h-4 bg-slate-200 rounded" />
              <div className="w-28 h-3.5 bg-slate-200 rounded" />
              <div className="w-20 h-3.5 bg-slate-200/80 rounded font-mono" />
              <div className="w-16 h-4 bg-slate-200/60 rounded" />
              <div className="flex-1 h-3.5 bg-slate-200/40 rounded" />
              <div className="w-24 h-4 bg-indigo-100/60 rounded" />
              <div className="w-6 h-6 bg-slate-200/50 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'card-skeleton') {
    return (
      <div className={`p-4 rounded-lg border border-slate-200 bg-white space-y-3 shadow-2xs animate-pulse ${className}`}>
        <div className="flex items-center justify-between">
          <div className="w-32 h-4 bg-slate-200 rounded" />
          <div className="w-16 h-4 bg-slate-200 rounded" />
        </div>
        <div className="w-full h-8 bg-slate-100 rounded" />
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <div className="w-20 h-3 bg-slate-200 rounded" />
          <div className="w-24 h-3 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'ai-inference') {
    return (
      <div className={`p-4 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 text-center space-y-3 shadow-2xs ${className}`}>
        <div className="inline-flex p-2.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
          <Sparkles className="w-5 h-5 animate-spin text-indigo-600" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-indigo-950">{label}</h4>
          <p className="text-[11px] text-indigo-900/80 mt-0.5 max-w-sm mx-auto">{description}</p>
        </div>
        <div className="w-48 mx-auto h-1.5 bg-indigo-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-indeterminate" />
        </div>
      </div>
    );
  }

  if (variant === 'progress') {
    return (
      <div className={`p-4 rounded-lg border border-slate-200 bg-white space-y-2.5 shadow-2xs ${className}`}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800">{label}</span>
          <span className="font-mono text-[11px] text-indigo-700 font-bold">
            {progressPercent ?? 65}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent ?? 65}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500">{description}</p>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center justify-center p-6 text-center space-y-2.5 ${className}`}>
      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      <div className="text-xs font-bold text-slate-900">{label}</div>
      <div className="text-[11px] text-slate-500 max-w-xs leading-relaxed">{description}</div>
    </div>
  );
};
