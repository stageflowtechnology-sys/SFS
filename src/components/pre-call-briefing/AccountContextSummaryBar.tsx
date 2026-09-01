import React from 'react';
import { PreCallBriefingAccount } from '../../types/preCallBriefing';
import { OriginBadge } from '../ui/OriginBadge';
import { StatusPill } from '../ui/StatusPill';
import {
  User,
  CreditCard,
  Calendar,
  Layers,
  Megaphone,
  Clock,
  Building,
  MapPin,
  DollarSign,
  ChevronDown,
  ShieldCheck,
  Search,
} from 'lucide-react';

interface AccountContextSummaryBarProps {
  account: PreCallBriefingAccount;
  allAccounts: PreCallBriefingAccount[];
  onSelectAccount: (acc: PreCallBriefingAccount) => void;
}

export const AccountContextSummaryBar: React.FC<AccountContextSummaryBarProps> = ({
  account,
  allAccounts,
  onSelectAccount,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Top Header Bar: Account Switcher & Creditor Context */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white font-bold font-mono text-xs shadow-2xs">
            SF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-300 font-semibold tracking-wide uppercase">
                {account.creditorName}
              </span>
              <span className="text-slate-500">•</span>
              <span className="font-mono text-xs text-indigo-400 font-bold">
                {account.accountNumber}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono truncate max-w-md">
              {account.accountType} — {account.portfolioName}
            </div>
          </div>
        </div>

        {/* Account Switcher for Testing Different Debtor Scenarios */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded text-xs font-mono border border-slate-700 transition-colors shadow-2xs"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch Debtor Scenario ({allAccounts.length})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden text-slate-900">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-600 uppercase font-mono">
                Select Pre-Call Account
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {allAccounts.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      onSelectAccount(acc);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 hover:bg-indigo-50/70 transition-colors flex flex-col gap-0.5 ${
                      acc.id === account.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                      <span>{acc.customerName}</span>
                      <span className="font-mono text-indigo-700">${acc.totalBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                      <span>{acc.accountNumber} • {acc.daysPastDue} DPD</span>
                      <span className="font-semibold text-slate-700">{acc.currentStageLabel}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Account Context Grid */}
      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Customer Context */}
        <div className="space-y-1.5 lg:pr-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider font-mono">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Customer Profile</span>
          </div>
          <div className="text-sm font-bold text-slate-900 tracking-tight">
            {account.customerName}
          </div>
          <div className="text-xs text-slate-600 font-mono space-y-0.5">
            <div>SSN: {account.ssnMasked} • DOB: {account.dobMasked}</div>
            <div className="flex items-center gap-1 text-slate-500 truncate" title={account.address}>
              <MapPin className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{account.state} • {account.timezone.split(' ')[0]}</span>
            </div>
            {account.employer && (
              <div className="flex items-center gap-1 text-slate-500 truncate" title={account.employer}>
                <Building className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">{account.employer}</span>
              </div>
            )}
          </div>
        </div>

        {/* Financial Balances Context */}
        <div className="space-y-1.5 pt-3 lg:pt-0 lg:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider font-mono">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span>Balance & Payoff</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 font-mono">
              ${account.totalBalance.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Total Due</span>
          </div>
          <div className="text-xs text-slate-600 font-mono space-y-0.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Principal:</span>
              <span className="font-semibold text-slate-800">${account.principalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Interest / Fees:</span>
              <span className="text-slate-700">${(account.accruedInterest + account.accruedFees).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold pt-0.5 border-t border-slate-100">
              <span>Max Auth Settlement:</span>
              <span>${account.minAcceptableSettlement.toLocaleString()} ({account.authorizedSettlementDiscountPct}% off)</span>
            </div>
          </div>
        </div>

        {/* Delinquency & DPD Context */}
        <div className="space-y-1.5 pt-3 lg:pt-0 lg:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider font-mono">
            <Calendar className="w-3.5 h-3.5 text-rose-600" />
            <span>Delinquency & DPD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold font-mono">
              {account.daysPastDue} DPD
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Bucket {account.dpdBucket.replace('_', '–')} Days
            </span>
          </div>
          <div className="text-xs text-slate-600 font-mono space-y-0.5">
            <div className="text-slate-500 truncate" title={account.statuteOfLimitationsDate}>
              SOL: <strong className="text-slate-800">{account.statuteRemainingYears} yrs</strong> remaining
            </div>
            {account.lastPaymentDate && (
              <div className="text-slate-500">
                Last Paid: <span className="text-slate-800 font-semibold">{account.lastPaymentDate}</span> (${account.lastPaymentAmount?.toLocaleString()})
              </div>
            )}
            <div className="text-[10px] text-slate-400">
              {account.chargeOffDate ? `Charge-off: ${account.chargeOffDate}` : 'Pre-Charge-off Active'}
            </div>
          </div>
        </div>

        {/* Current Stage Context (Authoritative Ground Truth) */}
        <div className="space-y-1.5 pt-3 lg:pt-0 lg:px-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Current Stage</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-900 font-mono">
              {account.currentStageLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <OriginBadge origin={account.currentStageOrigin} size="xs" />
          </div>
          <div className="text-[10px] text-slate-500 font-mono leading-tight">
            Last modified: {account.stageLastUpdated}
          </div>
        </div>

        {/* Active Campaign Context */}
        <div className="space-y-1.5 pt-3 lg:pt-0 lg:pl-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider font-mono">
            <Megaphone className="w-3.5 h-3.5 text-amber-600" />
            <span>Assigned Campaign</span>
          </div>
          <div className="text-xs font-bold text-slate-900 truncate" title={account.campaignName}>
            {account.campaignName}
          </div>
          <div className="text-[11px] text-slate-600 font-mono leading-tight bg-slate-50 p-1.5 rounded border border-slate-200">
            {account.campaignStep}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-mono font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Cadence Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
