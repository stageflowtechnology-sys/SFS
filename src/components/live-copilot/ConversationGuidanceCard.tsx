/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConversationGuidance } from '../../types/liveCopilot';
import {
  Compass,
  ShieldAlert,
  Percent,
  DollarSign,
  Calendar,
  AlertOctagon,
  Sparkles,
  Info,
  Scale,
} from 'lucide-react';

interface ConversationGuidanceCardProps {
  guidance: ConversationGuidance;
}

export const ConversationGuidanceCard: React.FC<ConversationGuidanceCardProps> = ({
  guidance,
}) => {
  return (
    <div
      id="card-conversation-guidance"
      className="rounded-xl border border-violet-200 bg-white p-3.5 shadow-2xs space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-violet-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-violet-100 text-violet-700">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Conversation Guidance</span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-violet-100 text-violet-800 border border-violet-200">
                {guidance.currentPhase}
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[9px] font-mono uppercase font-bold text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded border border-violet-100 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Playbook Active
        </span>
      </div>

      {/* Strategic Rule */}
      <div className="p-2.5 rounded-lg border border-violet-200/80 bg-violet-50/50 text-xs text-slate-800 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-violet-800 font-mono flex items-center gap-1">
          <Scale className="w-3 h-3 text-violet-600" />
          <span>Strategic Negotiation Rule</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-700 font-medium">
          {guidance.rule}
        </p>
      </div>

      {/* Authorized Settlement Boundaries Grid */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
          Authorized Policy Boundaries
        </span>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] text-slate-500 font-mono block">Max Discount</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              {guidance.maxAuthorizedDiscountPercent}%
            </span>
          </div>

          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] text-slate-500 font-mono block">Floor Amount</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              ${guidance.settlementFloorAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-2 rounded-lg border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] text-slate-500 font-mono block">Max Installment</span>
            <span className="text-xs font-bold text-slate-900 font-mono">
              {guidance.maxInstallmentMonths} mos
            </span>
          </div>
        </div>
      </div>

      {/* Compliance Guardrail Warning */}
      <div className="p-2 rounded-lg border border-amber-200/90 bg-amber-50/60 text-[11px] text-amber-950 space-y-1">
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase font-mono text-amber-800">
          <ShieldAlert className="w-3 h-3 text-amber-600" />
          <span>Regulatory Guardrail</span>
        </div>
        <p className="text-[10px] leading-snug text-amber-900">
          {guidance.complianceGuardrail}
        </p>
      </div>

      {/* Explicit Non-Authoritative Disclaimer */}
      <div className="flex items-start gap-1.5 p-2 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-500">
        <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
        <span className="leading-tight">
          <strong>AI Advisory Notice:</strong> Inferences are guidance only. Account balance, delinquency stage, and binding payment arrangements are authoritative in the core ledger.
        </span>
      </div>
    </div>
  );
};
