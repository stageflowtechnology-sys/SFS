import React from 'react';
import { CampaignAccountItem } from '../../types/campaign';
import {
  X,
  CreditCard,
  User,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
} from 'lucide-react';

interface CampaignAccountDrawerProps {
  account: CampaignAccountItem | null;
  onClose: () => void;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const CampaignAccountDrawer: React.FC<CampaignAccountDrawerProps> = ({
  account,
  onClose,
  onNavigateToWorkbench,
}) => {
  if (!account) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">{account.customerName}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {account.accountNumber}
                </span>
              </div>
              <p className="text-xs text-slate-500">{account.portfolioName}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body Content */}
        <div className="p-5 space-y-5 flex-1">
          {/* Top Balance & DPD Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Outstanding Balance
              </span>
              <span className="text-lg font-bold text-slate-900 block">
                ${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-amber-700 font-semibold">
                {account.daysPastDue} Days Past Due
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-200/80 space-y-1">
              <span className="text-[10px] font-semibold text-purple-800 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" />
                Propensity Score
              </span>
              <span className="text-lg font-bold text-purple-700 block">
                {account.propensityScore} / 100
              </span>
              <span className="text-[11px] text-purple-600 font-semibold">
                {account.propensityScore >= 75 ? 'High Settlement Intent' : 'Moderate Recovery'}
              </span>
            </div>
          </div>

          {/* Current Stage in Pipeline */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-2">
            <span className="text-[10px] font-semibold text-indigo-800 uppercase tracking-wider block flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Active Campaign Stage
            </span>
            <p className="text-sm font-bold text-indigo-900">{account.currentStageName}</p>
            <p className="text-xs text-indigo-700 font-semibold">Status: {account.statusLabel}</p>
          </div>

          {/* Touch History Breakdown */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Campaign Interaction Telemetry
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Phone className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                <span className="text-sm font-bold text-slate-900 block">{account.touchCount.calls}</span>
                <span className="text-[10px] text-slate-500">Voice Calls</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <MessageSquare className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-sm font-bold text-slate-900 block">{account.touchCount.sms}</span>
                <span className="text-[10px] text-slate-500">SMS Links</span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Mail className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-sm font-bold text-slate-900 block">{account.touchCount.emails}</span>
                <span className="text-[10px] text-slate-500">Emails</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Last Touch:</span>
                <span className="font-semibold text-slate-800">{account.lastTouchDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Channel Dispatched:</span>
                <span className="font-semibold text-indigo-700">{account.lastTouchChannel}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <span className="text-slate-500">Next Scheduled Cadence:</span>
                <span className="font-bold text-emerald-700">{account.nextScheduledTouch}</span>
              </div>
            </div>
          </div>

          {/* Active Promise to Pay if any */}
          {account.ptpAmount && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Active Settlement Commitment
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  ${account.ptpAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-emerald-800">
                Scheduled clearing date: <strong>{account.ptpDate}</strong> via automated ACH rail.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>

          {onNavigateToWorkbench && (
            <button
              onClick={() => {
                onClose();
                onNavigateToWorkbench(account.id);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Open in Collector Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
