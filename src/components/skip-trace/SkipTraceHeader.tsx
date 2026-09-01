import React from 'react';
import { SkipTraceAccount } from '../../types/skipTrace';
import { IdentityBandBadge } from './IdentityBandBadge';
import {
  Search,
  User,
  CreditCard,
  DollarSign,
  Layers,
  History,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  Lock,
  Activity,
} from 'lucide-react';

interface SkipTraceHeaderProps {
  account: SkipTraceAccount;
  allAccounts: SkipTraceAccount[];
  onSelectAccount: (account: SkipTraceAccount) => void;
  onStartInvestigation: () => void;
  onOpenWorkspace?: () => void;
  isInvestigating?: boolean;
}

export const SkipTraceHeader: React.FC<SkipTraceHeaderProps> = ({
  account,
  allAccounts,
  onSelectAccount,
  onStartInvestigation,
  onOpenWorkspace,
  isInvestigating = false,
}) => {
  const [showAccountDropdown, setShowAccountDropdown] = React.useState(false);

  const getStatusBadge = () => {
    switch (account.investigationStatus) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Investigation
          </span>
        );
      case 'READY_TO_RUN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            <Clock className="w-3 h-3 text-sky-600" />
            Ready to Run
          </span>
        );
      case 'STALE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Investigation Stale ({account.daysSinceLastInvestigation}d)
          </span>
        );
      case 'DISCREPANCY_FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Discrepancy Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            Completed
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      {/* Top Compliance & Permissible Purpose Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="font-mono text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">
            Statutory Public Records & Master Servicing Ledger
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Compliant with FDCPA §804 (Location Information), FCRA Permissible Purpose, & GLBA Safeguards
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
            Zero Private Account Access
          </span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
            Zero Real-Time Geolocation
          </span>
        </div>
      </div>

      {/* Main Header Information Bar */}
      <div className="px-4 lg:px-8 py-5">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          {/* Left Column: Customer & Account Metadata */}
          <div className="flex flex-col md:flex-row md:items-start gap-5">
            {/* Customer Avatar & Switcher */}
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md border border-slate-800 shrink-0">
                {account.customerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-600 border-2 border-white" />
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                {/* Account Switcher Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                    id="btn-switch-account"
                    className="group flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors focus:outline-none"
                  >
                    <span>{account.customerName}</span>
                    <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform" />
                  </button>

                  {/* Dropdown Menu */}
                  {showAccountDropdown && (
                    <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-2 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                        Select Investigation Case
                      </div>
                      {allAccounts.map((acc) => (
                        <button
                          key={acc.id}
                          onClick={() => {
                            onSelectAccount(acc);
                            setShowAccountDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 flex items-center justify-between gap-2 text-xs transition-colors ${
                            acc.id === account.id ? 'bg-indigo-50/70 text-indigo-950 font-semibold' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-slate-900">{acc.customerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {acc.accountNumber} • ${acc.totalBalance.toLocaleString()}
                            </div>
                          </div>
                          <IdentityBandBadge band={acc.summary.identityConfidence.band} size="sm" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Identity Band Header Badge */}
                <IdentityBandBadge band={account.summary.identityConfidence.band} size="md" />

                {/* Investigation Status */}
                {getStatusBadge()}
              </div>

              {/* Account, SSN, and Creditor Sub-bar */}
              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-mono">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-900">{account.accountNumber}</span>
                  <span className="text-slate-400">({account.customerId})</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">{account.creditorName}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5 font-mono text-slate-500">
                  <span>SSN: {account.maskedSsn}</span>
                  <span>DOB: {account.maskedDob}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Balance, Stage, Last Run & Primary Action Button */}
          <div className="flex flex-wrap items-center gap-4 lg:gap-6 border-t xl:border-t-0 pt-4 xl:pt-0 border-slate-100">
            {/* Balance Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex flex-col justify-center min-w-[150px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Total Balance
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">
                ${account.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Prin: ${account.principalBalance.toLocaleString()} | Fees: ${account.feeBalance.toLocaleString()}
              </div>
            </div>

            {/* Current Stage Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 flex flex-col justify-center min-w-[160px]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                Current Stage
              </span>
              <div className="text-sm font-bold text-indigo-900 truncate">
                {account.currentStage}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Code: {account.currentStageCode}
              </div>
            </div>

            {/* Last Investigation Info */}
            <div className="hidden sm:flex flex-col justify-center text-right min-w-[170px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-end gap-1">
                <History className="w-3 h-3 text-slate-400" />
                Last Investigation
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {account.lastInvestigationDate}
              </span>
              <span className="text-[11px] text-slate-500 font-mono truncate max-w-[190px]">
                {account.lastInvestigator}
              </span>
            </div>

            {/* Live Workspace & Primary Action Button */}
            <div className="flex items-center gap-2">
              {onOpenWorkspace && (
                <button
                  onClick={onOpenWorkspace}
                  id="btn-header-open-workspace"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-2xs transition-all"
                >
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>LIVE WORKSPACE</span>
                </button>
              )}

              <button
                onClick={onStartInvestigation}
                disabled={isInvestigating}
                id="btn-start-investigation"
                className={`flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
                  isInvestigating
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-slate-800 active:scale-[0.98] shadow-slate-900/10 ring-2 ring-slate-900/10'
                }`}
              >
                {isInvestigating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>RUNNING WATERFALL...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white text-white" />
                    <span className="tracking-wide">START INVESTIGATION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
