import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Lock, FileText, AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Checkbox } from './Input';

export interface ConfirmationStateProps {
  title?: string;
  impactLevel?: 'HIGH_IMPACT' | 'STATUTORY_IRREVOCABLE' | 'STANDARD_FINANCIAL';
  accountNumber?: string;
  debtorName?: string;
  principalAmount?: number;
  proposedAction?: string;
  impactSummary?: string;
  onConfirm: (operatorNotes: string) => void;
  onCancel: () => void;
  isProcessing?: boolean;
  className?: string;
}

export const ConfirmationState: React.FC<ConfirmationStateProps> = ({
  title = 'Authoritative Action Confirmation Gate',
  impactLevel = 'STATUTORY_IRREVOCABLE',
  accountNumber = 'ACC-8910-234',
  debtorName = 'Apex Logistics LLC',
  principalAmount = 48500.0,
  proposedAction = 'Authorize 20% Lump-Sum Settlement ($38,800.00 Payoff)',
  impactSummary = 'Executing this action generates an immutable legal settlement agreement, updates Metro 2 credit reporting status, and halts active collection sequences.',
  onConfirm,
  onCancel,
  isProcessing = false,
  className = '',
}) => {
  const [hasAcknowledgedFdcpa, setHasAcknowledgedFdcpa] = useState(false);
  const [hasVerifiedIdentity, setHasVerifiedIdentity] = useState(false);
  const [operatorNotes, setOperatorNotes] = useState('');

  const canSubmit = hasAcknowledgedFdcpa && hasVerifiedIdentity && !isProcessing;

  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50/40 p-4 text-xs shadow-2xs space-y-4 ${className}`}
    >
      {/* Title & Severity Header */}
      <div className="flex items-start justify-between gap-3 border-b border-amber-200/80 pb-3">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded bg-amber-100 border border-amber-300 text-amber-800 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">{title}</span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold uppercase">
                {impactLevel}
              </span>
            </div>
            <p className="text-slate-600 mt-0.5 leading-relaxed">{impactSummary}</p>
          </div>
        </div>
      </div>

      {/* Target Account Summary Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-[11px] bg-white p-3 rounded-md border border-amber-200">
        <div>
          <span className="text-slate-400 uppercase text-[10px]">Account & Debtor</span>
          <div className="font-bold text-slate-900 mt-0.5">{debtorName}</div>
          <div className="text-slate-500">{accountNumber}</div>
        </div>
        <div>
          <span className="text-slate-400 uppercase text-[10px]">Principal Balance</span>
          <div className="font-bold text-slate-900 mt-0.5">
            ${principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-emerald-700 font-semibold">15% Write-Down</div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-slate-400 uppercase text-[10px]">Proposed Action</span>
          <div className="font-bold text-indigo-900 mt-0.5 truncate">{proposedAction}</div>
          <div className="text-slate-500">Dual Authorization Enforced</div>
        </div>
      </div>

      {/* Mandatory Regulatory Checkboxes */}
      <div className="space-y-2 pt-1">
        <Checkbox
          checked={hasVerifiedIdentity}
          onChange={(e) => setHasVerifiedIdentity(e.target.checked)}
          label="I verify that debtor identity and authority have been verified against primary account records."
        />
        <Checkbox
          checked={hasAcknowledgedFdcpa}
          onChange={(e) => setHasAcknowledgedFdcpa(e.target.checked)}
          label="I confirm this action complies with FDCPA Reg-F guidelines and corporate lending mandates."
        />
      </div>

      {/* Operator Audit Note */}
      <div className="space-y-1">
        <label className="font-semibold text-slate-800 text-[11px]">
          Operator Authorization Note (Required for Audit Trail)
        </label>
        <input
          type="text"
          value={operatorNotes}
          onChange={(e) => setOperatorNotes(e.target.value)}
          placeholder="e.g. Verbal agreement confirmed on recorded line #REC-40291."
          className="w-full h-8 px-2.5 rounded border border-amber-300 bg-white text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder-slate-400"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-200/80">
        <Button variant="secondary" size="xs" onClick={onCancel} disabled={isProcessing}>
          Cancel Operation
        </Button>
        <Button
          variant="authoritative-confirm"
          size="xs"
          onClick={() => onConfirm(operatorNotes)}
          disabled={!canSubmit}
          isLoading={isProcessing}
        >
          Authorize & Commit to Ledger
        </Button>
      </div>
    </div>
  );
};
