/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecommendationItem } from '../../types/recommendationCenter';
import {
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  RefreshCw,
  X,
  Layers,
  FileCheck,
} from 'lucide-react';

interface ConfirmationModalProps {
  recommendation: RecommendationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, operatorNotes?: string) => void;
  currentOperator: { name: string; id: string; role: string };
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onConfirm,
  currentOperator,
}) => {
  const [operatorNotes, setOperatorNotes] = useState<string>('');
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !recommendation) return null;

  const handleExecuteConfirm = () => {
    if (!isAcknowledged) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onConfirm(recommendation.id, operatorNotes);
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Authorize Operational Execution
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  State Mutation
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                Ref: {recommendation.id} • Account: {recommendation.account.accountNumber} ({recommendation.customer.name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          {/* 1. Governance Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold font-mono text-[11px] uppercase tracking-wider block">
                Binding Execution Authority Notice:
              </span>
              <p className="leading-relaxed text-[11px]">
                Confirming this recommendation will immediately commit permanent mutations to the Core Banking Ledger, adjust account balance parameters, and alter automated dialer telephony queues.
              </p>
            </div>
          </div>

          {/* 2. Action Summary */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">
                {recommendation.title}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                {recommendation.actionType.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {recommendation.detailedAction}
            </p>
            <div className="pt-2 border-t border-slate-200 text-[11px] font-mono text-indigo-900">
              <strong>Operational Impact:</strong> {recommendation.operationalImpact}
            </div>
          </div>

          {/* 3. Current State vs Expected State Diff */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Current State */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Current System State
              </span>
              <div className="text-xs font-bold text-slate-800">
                {recommendation.currentState.label}
              </div>
              <div className="space-y-1 pt-1 border-t border-slate-100 font-mono text-[11px]">
                {recommendation.currentState.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between text-slate-600">
                    <span>{m.key}:</span>
                    <span className="font-semibold text-slate-800">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expected State */}
            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/40 space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                Target State After Execution
              </span>
              <div className="text-xs font-bold text-emerald-950">
                {recommendation.expectedState.label}
              </div>
              <div className="space-y-1 pt-1 border-t border-emerald-200/60 font-mono text-[11px]">
                {recommendation.expectedState.metrics.map((m, idx) => (
                  <div key={idx} className="flex justify-between text-emerald-900">
                    <span>{m.key}:</span>
                    <span className="font-bold text-emerald-950">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Operator Authorization Identification */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between font-mono text-[11px]">
            <div>
              <span className="text-slate-500 block">Authorizing Operator:</span>
              <span className="font-bold text-slate-900">
                {currentOperator.name} ({currentOperator.id})
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Role & Clearance:</span>
              <span className="font-bold text-indigo-700">{currentOperator.role}</span>
            </div>
          </div>

          {/* 5. Optional Operator Notes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-700 block">
              Operator Audit Notes (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Verified debtor paystub and confirmed verbal authorization under call recording..."
              value={operatorNotes}
              onChange={(e) => setOperatorNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* 6. Mandatory Compliance Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={isAcknowledged}
                onChange={(e) => setIsAcknowledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-700 leading-tight">
                I certify that I have reviewed the underlying evidence and authorize this operational action in compliance with institutional StageFlow recovery policies and CFPB Reg-F requirements.
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteConfirm}
            disabled={!isAcknowledged || isSubmitting}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer ${
              !isAcknowledged || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Committing to Ledger...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Commit Execution</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
