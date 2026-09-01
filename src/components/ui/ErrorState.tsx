import React, { useState } from 'react';
import { AlertOctagon, RotateCcw, ChevronDown, ChevronUp, Copy, Check, ShieldAlert } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  errorCode?: string;
  errorMessage?: string;
  details?: string;
  traceId?: string;
  onRetry?: () => void;
  onRollback?: () => void;
  isRetrying?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Execution Exception: Transaction Aborted',
  errorCode = 'ERR_ACH_R01_INSUFFICIENT_FUNDS',
  errorMessage = 'The core banking settlement rail returned an explicit rejection during payment dispatch. Account state has been safely rolled back to prevent ledger corruption.',
  details = 'Stack trace: at GatewayDispatcher.executeBatch (ach_runner.ts:142:19)\n  at SettlementPipeline.dispatch (pipeline.ts:88:12)\n  Response Payload: { code: "R01", routing: "021000021", status: "REJECTED_NSF" }',
  traceId = 'TRC-994102-88B1-FAIL',
  onRetry,
  onRollback,
  isRetrying = false,
  className = '',
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedTrace, setCopiedTrace] = useState(false);

  const handleCopyTrace = () => {
    navigator.clipboard.writeText(`Trace ID: ${traceId}\nError: ${errorCode}\n${details}`);
    setCopiedTrace(true);
    setTimeout(() => setCopiedTrace(false), 2000);
  };

  return (
    <div
      className={`rounded-lg border border-rose-300 bg-rose-50/50 p-4 text-xs shadow-2xs space-y-3.5 ${className}`}
    >
      {/* Header with Icon and Error Code */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded bg-rose-100 border border-rose-200 text-rose-700 shrink-0">
            <AlertOctagon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-rose-950 text-sm">{title}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 font-semibold">
                {errorCode}
              </span>
            </div>
            <p className="text-rose-900/90 mt-1 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      </div>

      {/* Trace ID & Expandable Technical Diagnostics */}
      <div className="p-2.5 rounded bg-white border border-rose-200 flex flex-col gap-2 font-mono text-[11px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="text-slate-400">Trace Audit ID:</span>
            <span className="font-bold text-slate-800">{traceId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTrace}
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
              title="Copy error trace"
            >
              {copiedTrace ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-100 transition-colors"
            >
              <span>{showDetails ? 'Hide Stack' : 'Show Stack'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {showDetails && (
          <pre className="mt-1 p-2 rounded bg-slate-900 text-rose-300 text-[10px] overflow-x-auto whitespace-pre-wrap font-mono border border-slate-800">
            {details}
          </pre>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1">
        {onRollback && (
          <Button variant="outline" size="xs" onClick={onRollback}>
            Revert to Last Known Good State
          </Button>
        )}
        {onRetry && (
          <Button
            variant="destructive"
            size="xs"
            onClick={onRetry}
            isLoading={isRetrying}
            leftIcon={<RotateCcw className="w-3 h-3" />}
          >
            {isRetrying ? 'Retrying Transaction...' : 'Retry Execution Pipeline'}
          </Button>
        )}
      </div>
    </div>
  );
};
