/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RecommendationItem } from '../../types/recommendationCenter';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Hash,
  Layers,
  Server,
  Clock,
  UserCheck,
} from 'lucide-react';

interface VerificationReceiptModalProps {
  recommendation: RecommendationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationReceiptModal: React.FC<VerificationReceiptModalProps> = ({
  recommendation,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !recommendation || !recommendation.verificationResult) return null;

  const result = recommendation.verificationResult;

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(result.receiptHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-5 border-b border-emerald-900 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-2xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Cryptographic Execution Receipt
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Verified
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5 font-mono">
                Ref: {recommendation.id} • Account: {recommendation.account.accountNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          {/* Verification Badge */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs block">
                Operation Executed & Cryptographically Verified
              </span>
              <p className="text-[11px] text-emerald-800">
                Ledger write-ahead logs and double-entry mutation confirmed by gateway authority.
              </p>
            </div>
          </div>

          {/* Receipt Hash Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Verification Receipt Hash (SHA-256):</span>
              </span>
              <button
                onClick={handleCopyHash}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors text-[10px] cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Hash'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 font-mono text-[11px] text-emerald-400 break-all border border-slate-800 select-all">
              {result.receiptHash}
            </div>
          </div>

          {/* Verification Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 font-mono text-[11px]">
              <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                <Clock className="w-3 h-3" /> Execution Timestamp
              </span>
              <span className="font-bold text-slate-900 block">{result.executedAt}</span>
              <span className="text-[10px] text-slate-500">Verified: {result.verifiedAt}</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1 font-mono text-[11px]">
              <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Verifying Authority
              </span>
              <span className="font-bold text-slate-900 block">{result.verifiedBy}</span>
              <span className="text-[10px] text-slate-500">Target: {result.targetSystem}</span>
            </div>
          </div>

          {/* Commit Block & Mutation Delta */}
          <div className="space-y-2 pt-1 font-mono text-[11px]">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block flex items-center gap-1">
                <Layers className="w-3 h-3" /> Ledger Commit Block
              </span>
              <span className="font-bold text-slate-800">{result.ledgerCommitBlock}</span>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                State Mutation Delta
              </span>
              <div className="p-2 bg-white rounded border border-slate-200 text-slate-900 font-bold text-[10px]">
                {result.stateMutationDelta}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
