import React, { useState } from 'react';
import { PreCallBriefingAccount } from '../../types/preCallBriefing';
import {
  PhoneForwarded,
  CheckSquare,
  Square,
  Printer,
  RefreshCw,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface PreCallReadinessChecklistProps {
  account: PreCallBriefingAccount;
  onLaunchCall: (account: PreCallBriefingAccount) => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PreCallReadinessChecklist: React.FC<PreCallReadinessChecklistProps> = ({
  account,
  onLaunchCall,
  onRegenerate,
  isRegenerating,
}) => {
  const [checkedMiniMiranda, setCheckedMiniMiranda] = useState(false);
  const [checkedAdvisory, setCheckedAdvisory] = useState(true);
  const [checkedTimezone, setCheckedTimezone] = useState(true);
  const [showCallPrompt, setShowCallPrompt] = useState(false);

  const canLaunch = checkedMiniMiranda && checkedAdvisory && checkedTimezone;

  const handlePrint = () => {
    window.print();
  };

  const handleLaunch = () => {
    setShowCallPrompt(true);
    setTimeout(() => {
      onLaunchCall(account);
    }, 1200);
  };

  return (
    <div className="rounded-lg border-2 border-indigo-600 bg-white p-5 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-700 text-white shadow-2xs">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
              8. Collector Readiness Gate & Outreach Launch
            </h2>
            <div className="text-xs text-slate-600 font-sans">
              Complete mandatory compliance verification before activating the telephony dialer.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-600' : ''}`} />
            <span>{isRegenerating ? 'Re-running inference...' : 'Regenerate Briefing'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Briefing</span>
          </button>
        </div>
      </div>

      {/* Compliance Checkboxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Item 1: Mini Miranda */}
        <div
          onClick={() => setCheckedMiniMiranda(!checkedMiniMiranda)}
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
            checkedMiniMiranda
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-rose-300 bg-rose-50/30 hover:border-rose-400'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {checkedMiniMiranda ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-rose-500" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 font-mono block">
              1. FDCPA Mini-Miranda Required
            </span>
            <span className="text-[11px] text-slate-600 leading-snug">
              I certify I will recite statutory disclosure within first 60 seconds of contact.
            </span>
          </div>
        </div>

        {/* Item 2: Advisory Acknowledgment */}
        <div
          onClick={() => setCheckedAdvisory(!checkedAdvisory)}
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
            checkedAdvisory
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {checkedAdvisory ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 font-mono block">
              2. Advisory Status Confirmed
            </span>
            <span className="text-[11px] text-slate-600 leading-snug">
              I acknowledge AI guidance is advisory and account state remains operator-governed.
            </span>
          </div>
        </div>

        {/* Item 3: Timezone & Safety */}
        <div
          onClick={() => setCheckedTimezone(!checkedTimezone)}
          className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-2.5 ${
            checkedTimezone
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-slate-300 bg-slate-50 hover:border-slate-400'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {checkedTimezone ? (
              <CheckSquare className="w-4 h-4 text-emerald-600" />
            ) : (
              <Square className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="text-xs">
            <span className="font-bold text-slate-900 font-mono block">
              3. Timezone Verified Safe
            </span>
            <span className="text-[11px] text-slate-600 leading-snug">
              Debtor local time {account.timezone.split(' ')[0]} verified in lawful 8am–9pm window.
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Telephony Trunk: SIP-Apex-Primary-US • Call Recording Enabled</span>
        </div>

        <button
          onClick={handleLaunch}
          disabled={!canLaunch || showCallPrompt}
          className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
            canLaunch && !showCallPrompt
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer hover:shadow-md'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
          }`}
        >
          {showCallPrompt ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Connecting to Dialer Trunk...</span>
            </>
          ) : (
            <>
              <PhoneForwarded className="w-4 h-4" />
              <span>Launch Call to {account.customerName} ({account.contacts[0]?.value || 'Primary Line'})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
