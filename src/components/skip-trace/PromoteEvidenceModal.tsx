import React from 'react';
import { EvidenceItem } from '../../types/skipTrace';
import {
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
} from 'lucide-react';

interface PromoteEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: EvidenceItem | null;
  onConfirmPromote: (evidence: EvidenceItem, reason: string) => void;
}

export const PromoteEvidenceModal: React.FC<PromoteEvidenceModalProps> = ({
  isOpen,
  onClose,
  evidence,
  onConfirmPromote,
}) => {
  const [reason, setReason] = React.useState('Verified through concordant public records and active carrier HLR ping.');
  const [certified, setCertified] = React.useState(true);

  if (!isOpen || !evidence) return null;

  const handleConfirm = () => {
    onConfirmPromote(evidence, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Promote Evidence to Master Servicing File
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Authoritative Master File Mutation
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

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-indigo-700 font-mono">
              Target Discovered Evidence
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {evidence.title}
            </div>
            <div className="font-mono text-indigo-950 font-bold">
              {evidence.value}
            </div>
            <div className="text-[11px] text-slate-600">
              Source: {evidence.source} ({evidence.discoveredDate})
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Operator Audit Reason for Master Promotion:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-sans"
            />
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={certified}
              onChange={(e) => setCertified(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-600 leading-normal">
              I certify that this promotion adheres to FDCPA §804 location information validation standards and represents accurate ground-truth debtor contact data.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            Ledger Commit Audit Required
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!certified || !reason.trim()}
              id="btn-confirm-promote"
              className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 shadow-xs transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Promote to Master</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
