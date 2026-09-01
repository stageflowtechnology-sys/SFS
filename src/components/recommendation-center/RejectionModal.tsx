/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecommendationItem, RejectionDetails } from '../../types/recommendationCenter';
import { X, Ban, AlertCircle, RefreshCw } from 'lucide-react';

interface RejectionModalProps {
  recommendation: RecommendationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onReject: (id: string, rejectionDetails: RejectionDetails) => void;
  currentOperator: { name: string; id: string; role: string };
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  recommendation,
  isOpen,
  onClose,
  onReject,
  currentOperator,
}) => {
  const [category, setCategory] = useState<RejectionDetails['category']>('COLLECTOR_DISCRETION');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !recommendation) return null;

  const handleConfirmReject = () => {
    if (!reason.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onReject(recommendation.id, {
        rejectedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
        rejectedBy: `${currentOperator.name} (${currentOperator.id})`,
        rejectionReason: reason.trim(),
        category,
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-rose-900 text-white p-5 border-b border-rose-950 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-700 text-white shadow-2xs">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Dismiss / Reject AI Recommendation
              </h3>
              <p className="text-xs text-rose-200 mt-0.5 font-mono">
                Ref: {recommendation.id} • {recommendation.account.accountNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-300 hover:text-white hover:bg-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-xs text-slate-700">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Dismissing a recommendation logs a permanent supervisory audit event. Please provide a clear operational justification to train and calibrate downstream propensity models.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono font-bold text-slate-700 block">
              Recommendation:
            </label>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-semibold text-slate-900">
              {recommendation.title}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-700 block">
              Rejection Rationale Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RejectionDetails['category'])}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none"
            >
              <option value="COLLECTOR_DISCRETION">Collector Discretion (Context Override)</option>
              <option value="INCORRECT_INFERENCE">Incorrect AI Model Inference</option>
              <option value="DEBTOR_REFUSAL">Debtor Declined Offer During Call</option>
              <option value="SUPERVISORY_VETO">Supervisory Policy Veto</option>
              <option value="OTHER">Other Compliance / Administrative Reason</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-slate-700 block">
              Detailed Audit Explanation: <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail why this recommendation should not be executed (e.g., debtor disclosed updated income, statute of limitations nearing expiry, unverified documentation)..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-rose-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmReject}
            disabled={!reason.trim() || isSubmitting}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-all ${
              !reason.trim() || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Logging Audit Record...</span>
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                <span>Dismiss & Log Rejection</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
