/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LiveCopilotAccountContext, CurrentUnderstanding } from '../../types/liveCopilot';
import {
  FileCheck2,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  Calendar,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CallWrapupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDisposition: (disposition: {
    code: string;
    label: string;
    ptpAmount?: number;
    ptpDate?: string;
    notes: string;
    followUpDate?: string;
  }) => void;
  account: LiveCopilotAccountContext;
  understanding: CurrentUnderstanding;
  callDurationSeconds: number;
}

export const CallWrapupModal: React.FC<CallWrapupModalProps> = ({
  isOpen,
  onClose,
  onConfirmDisposition,
  account,
  understanding,
  callDurationSeconds,
}) => {
  const [selectedCode, setSelectedCode] = useState<string>('PTP_SCHEDULED');
  const [ptpAmount, setPtpAmount] = useState<string>('1200.00');
  const [ptpDate, setPtpDate] = useState<string>('2026-09-05');
  const [notes, setNotes] = useState<string>(
    `Debtor Marcus Vance confirmed right-party contact. Re-employed at Apex Logistics after temporary July medical leave. Agreed to PTP of $1,200.00 on Friday 09/05/2026 via debit card with $750 fee concession pre-approved.`
  );
  const [followUpDate, setFollowUpDate] = useState<string>('2026-09-06');
  const [isAuthoritativeConfirmed, setIsAuthoritativeConfirmed] = useState<boolean>(true);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const DISPOSITION_OPTIONS = [
    { code: 'PTP_SCHEDULED', label: 'PTP — Promise to Pay Scheduled', variant: 'emerald' },
    { code: 'PTP_PARTIAL', label: 'PTP Partial — Down Payment with Installment Plan', variant: 'indigo' },
    { code: 'HARDSHIP_REVIEW', label: 'Hardship Documentation Pending Review', variant: 'amber' },
    { code: 'DISPUTE_FEE', label: 'Dispute — Penalty Fee Assessment Requested', variant: 'amber' },
    { code: 'REFUSAL_TO_PAY', label: 'Refusal to Pay — Escalate to Legal Review', variant: 'rose' },
  ];

  const handleSave = () => {
    const selectedOption = DISPOSITION_OPTIONS.find((o) => o.code === selectedCode);
    onConfirmDisposition({
      code: selectedCode,
      label: selectedOption?.label || selectedCode,
      ptpAmount: ptpAmount ? parseFloat(ptpAmount) : undefined,
      ptpDate,
      notes,
      followUpDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Call Wrap-Up & Ledger Reconciliation
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {account.debtorName} • {account.accountNumber} • Call Duration: {formatTime(callDurationSeconds)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* AI Pre-Drafted Call Record Notice */}
          <div className="p-3 rounded-xl border border-violet-200 bg-violet-50/50 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-violet-950 block">
                AI Suggested Call Summary (Non-Authoritative Draft)
              </span>
              <p className="text-violet-900 leading-relaxed">
                Review and edit the pre-populated interaction notes below before posting to the permanent ledger.
              </p>
            </div>
          </div>

          {/* Disposition Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
              1. Final Interaction Disposition Code *
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {DISPOSITION_OPTIONS.map((opt) => (
                <label
                  key={opt.code}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedCode === opt.code
                      ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="dispositionCode"
                      checked={selectedCode === opt.code}
                      onChange={() => setSelectedCode(opt.code)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-xs">{opt.label}</span>
                  </div>
                  {selectedCode === opt.code && (
                    <span className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      Selected
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Promise to Pay Terms (if PTP selected) */}
          {(selectedCode === 'PTP_SCHEDULED' || selectedCode === 'PTP_PARTIAL') && (
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 font-mono uppercase">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Binding Promise-to-Pay (PTP) Terms</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-emerald-900 block mb-1">
                    Committed PTP Amount ($)
                  </label>
                  <input
                    type="number"
                    value={ptpAmount}
                    onChange={(e) => setPtpAmount(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-emerald-900 block mb-1">
                    Execution Date
                  </label>
                  <input
                    type="date"
                    value={ptpDate}
                    onChange={(e) => setPtpDate(e.target.value)}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-900 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Interaction Notes */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
                2. Permanent Ledger Interaction Notes *
              </label>
              <span className="text-[10px] text-slate-400 font-mono">
                Editable before ledger write
              </span>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Statutory Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer">
            <input
              type="checkbox"
              checked={isAuthoritativeConfirmed}
              onChange={(e) => setIsAuthoritativeConfirmed(e.target.checked)}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-700 leading-snug">
              <strong>Collector Certification:</strong> I certify that all statutory disclosures (Mini-Miranda 15 U.S.C. § 1692e(11)) and two-party call recording consent were communicated and accurately reflected in this record.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel & Return to Call
          </button>

          <button
            id="btn-confirm-ledger-write"
            disabled={!isAuthoritativeConfirmed}
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
              isAuthoritativeConfirmed
                ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                : 'bg-slate-400 cursor-not-allowed opacity-60'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Commit & Write to Core Ledger</span>
          </button>
        </div>
      </div>
    </div>
  );
};
