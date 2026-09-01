/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  OperationalRecommendationItem,
  ExecutionStatus,
} from '../../types/postCallReview';
import { ExecutionStateBadge } from './ExecutionStateBadge';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  AlertOctagon,
  ArrowRight,
  RefreshCw,
  FileCheck,
  Copy,
  Info,
  Check,
  Sliders,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface OperationalRecommendationsListProps {
  recommendations: OperationalRecommendationItem[];
  onUpdateStatus: (id: string, newStatus: ExecutionStatus, options?: any) => void;
  operatorId: string;
}

export const OperationalRecommendationsList: React.FC<OperationalRecommendationsListProps> = ({
  recommendations,
  onUpdateStatus,
  operatorId,
}) => {
  const [selectedDismissId, setSelectedDismissId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState<string>('');
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Filter or count stats
  const pendingCount = recommendations.filter((r) => r.status === 'PENDING').length;
  const confirmedCount = recommendations.filter((r) => r.status === 'CONFIRMED').length;
  const executedCount = recommendations.filter((r) => r.status === 'EXECUTED_VERIFIED').length;
  const failedCount = recommendations.filter((r) => r.status === 'EXECUTION_FAILED').length;

  const handleAccept = (id: string) => {
    onUpdateStatus(id, 'CONFIRMED', {
      confirmedBy: `Operator (${operatorId})`,
      confirmedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  };

  const handleDismiss = (id: string) => {
    setSelectedDismissId(id);
    setDismissReason('');
  };

  const confirmDismissal = () => {
    if (!selectedDismissId) return;
    onUpdateStatus(selectedDismissId, 'EXECUTION_FAILED', {
      errorMessage: `Dismissed by operator: ${dismissReason || 'Discretionary override.'}`,
    });
    setSelectedDismissId(null);
  };

  const handleExecute = (id: string) => {
    setExecutingId(id);
    setTimeout(() => {
      // Simulate real-time ledger commit
      const fakeReceipt = '0x' + Math.random().toString(16).substring(2, 14) + Math.random().toString(16).substring(2, 14);
      onUpdateStatus(id, 'EXECUTED_VERIFIED', {
        executedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        executionReceiptHash: fakeReceipt,
      });
      setExecutingId(null);
    }, 900);
  };

  const handleSimulateFailure = (id: string) => {
    onUpdateStatus(id, 'EXECUTION_FAILED', {
      errorMessage: 'Core Banking Ledger Gateway Timeout (HTTP 504) - Card authorization token temporarily locked.',
    });
  };

  const handleBatchConfirmAndExecute = () => {
    recommendations
      .filter((r) => r.status === 'PENDING' || r.status === 'CONFIRMED')
      .forEach((r, idx) => {
        setTimeout(() => {
          handleExecute(r.id);
        }, idx * 300);
      });
  };

  const copyReceipt = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div
      id="operational-recommendations-list"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0"
    >
      {/* 1. Critical Distinction Governance Banner */}
      <div className="bg-slate-900 text-white p-5 border-b border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  CRITICAL GOVERNANCE PRINCIPLE:
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  AI Recommendation ≠ Executed Action
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                AI model outputs are non-authoritative recommendations. No balance modification, dialer suppression, or debt settlement occurs until an authorized operator reviews, confirms, and triggers ledger execution.
              </p>
            </div>
          </div>

          {/* Quick Batch Action */}
          {pendingCount + confirmedCount > 0 && (
            <button
              onClick={handleBatchConfirmAndExecute}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Execute All ({pendingCount + confirmedCount})</span>
            </button>
          )}
        </div>

        {/* Four Lifecycle States Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
          <div className="p-2 rounded-lg bg-slate-950/70 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Clock className="w-3.5 h-3.5" />
              <span>PENDING ({pendingCount})</span>
            </div>
            <span className="text-[10px] text-slate-400">AI Advisory</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-indigo-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CONFIRMED ({confirmedCount})</span>
            </div>
            <span className="text-[10px] text-slate-400">Operator Approved</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>EXECUTED_VERIFIED ({executedCount})</span>
            </div>
            <span className="text-[10px] text-slate-400">Ledger Committed</span>
          </div>

          <div className="p-2 rounded-lg bg-slate-950/70 border border-rose-500/30 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-rose-300">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>EXECUTION_FAILED ({failedCount})</span>
            </div>
            <span className="text-[10px] text-slate-400">Exception</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Recommendations List */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-500">
          <span className="font-bold uppercase tracking-wider text-slate-700">
            Actionable Operational Recommendations ({recommendations.length})
          </span>
          <span>Operator Clearance: {operatorId}</span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec) => {
            const isExecuting = executingId === rec.id;

            return (
              <div
                key={rec.id}
                id={`rec-item-${rec.id}`}
                className={`p-5 rounded-xl border transition-all space-y-3.5 ${
                  rec.status === 'EXECUTED_VERIFIED'
                    ? 'bg-emerald-50/20 border-emerald-300 shadow-2xs'
                    : rec.status === 'CONFIRMED'
                    ? 'bg-indigo-50/20 border-indigo-300 shadow-2xs'
                    : rec.status === 'EXECUTION_FAILED'
                    ? 'bg-rose-50/30 border-rose-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Header Line: Category, Title, AI Confidence & Status Badge */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {rec.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-mono text-violet-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>AI Confidence: {rec.aiConfidence}%</span>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {rec.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <ExecutionStateBadge status={rec.status} size="md" showDescription />
                  </div>
                </div>

                {/* Description & Impact */}
                <p className="text-xs text-slate-700 leading-relaxed">
                  {rec.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-600 flex items-center gap-2">
                  <span className="font-bold text-slate-700 uppercase">Operational Impact:</span>
                  <span>{rec.impact}</span>
                </div>

                {/* Audit Details (Confirmed By / Executed At / Receipt) */}
                {(rec.confirmedBy || rec.executedAt || rec.executionReceiptHash || rec.errorMessage) && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 font-mono text-[11px] space-y-1.5">
                    {rec.confirmedBy && (
                      <div className="flex justify-between text-slate-600">
                        <span>Operator Authorization:</span>
                        <span className="font-bold text-slate-900">{rec.confirmedBy} at {rec.confirmedAt}</span>
                      </div>
                    )}
                    {rec.executedAt && (
                      <div className="flex justify-between text-emerald-800">
                        <span>Ledger Execution Timestamp:</span>
                        <span className="font-bold">{rec.executedAt}</span>
                      </div>
                    )}
                    {rec.executionReceiptHash && (
                      <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Core Receipt Hash:</span>
                        <div className="flex items-center gap-1.5">
                          <code className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            {rec.executionReceiptHash}
                          </code>
                          <button
                            onClick={() => copyReceipt(rec.executionReceiptHash!)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                            title="Copy cryptographic proof hash"
                          >
                            {copiedHash === rec.executionReceiptHash ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    {rec.errorMessage && (
                      <div className="text-rose-700 font-bold flex items-center gap-1.5 pt-1 border-t border-rose-100">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                        <span>{rec.errorMessage}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Action Controls depending on State */}
                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                  {/* Left: Quick Lifecycle Tester Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">Simulate State:</span>
                    <div className="flex items-center gap-1">
                      {(['PENDING', 'CONFIRMED', 'EXECUTED_VERIFIED', 'EXECUTION_FAILED'] as ExecutionStatus[]).map(
                        (st) => (
                          <button
                            key={st}
                            onClick={() => {
                              if (st === 'CONFIRMED') handleAccept(rec.id);
                              else if (st === 'EXECUTED_VERIFIED') handleExecute(rec.id);
                              else if (st === 'EXECUTION_FAILED') handleSimulateFailure(rec.id);
                              else onUpdateStatus(rec.id, 'PENDING');
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                              rec.status === st
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {st.split('_')[0]}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Right: Primary Operator Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* If PENDING: Accept & Dismiss */}
                    {rec.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleDismiss(rec.id)}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleAccept(rec.id)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition-all cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Accept Recommendation</span>
                        </button>
                      </>
                    )}

                    {/* If CONFIRMED: Confirm Operational Execution */}
                    {rec.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleExecute(rec.id)}
                        disabled={isExecuting}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all cursor-pointer ${
                          isExecuting ? 'opacity-70 cursor-wait' : ''
                        }`}
                      >
                        {isExecuting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Committing to Ledger...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Confirm Operational Execution</span>
                          </>
                        )}
                      </button>
                    )}

                    {/* If EXECUTED_VERIFIED: Certified Done */}
                    {rec.status === 'EXECUTED_VERIFIED' && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 font-mono">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Execution Complete & Verified</span>
                      </div>
                    )}

                    {/* If EXECUTION_FAILED: Retry Action */}
                    {rec.status === 'EXECUTION_FAILED' && (
                      <button
                        onClick={() => handleExecute(rec.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry Execution</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dismiss Reason Modal */}
      {selectedDismissId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-900">
                Dismiss Operational Recommendation
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Please enter an audit reason for rejecting this AI recommendation. This will be permanently recorded in the QA compliance log.
            </p>
            <textarea
              rows={3}
              placeholder="e.g. Collector judgment: Debtor disclosed pending insurance settlement not captured in audio..."
              value={dismissReason}
              onChange={(e) => setDismissReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedDismissId(null)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDismissal}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
