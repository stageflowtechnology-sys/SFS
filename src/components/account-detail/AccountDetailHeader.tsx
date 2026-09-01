import React, { useState } from 'react';
import { AccountDetailData } from '../../types/accountDetail';
import { StatusPill } from '../ui/StatusPill';
import { OriginBadge } from '../ui/OriginBadge';
import {
  CreditCard,
  User,
  DollarSign,
  AlertTriangle,
  Clock,
  FolderTree,
  Megaphone,
  GitCommit,
  UserCheck,
  Copy,
  Check,
  ChevronDown,
  Building,
  Shield,
  Phone,
  Mail,
  Scale,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface AccountDetailHeaderProps {
  data: AccountDetailData;
  allAccountNumbers: string[];
  selectedAccountNumber: string;
  onSelectAccount: (accNum: string) => void;
  onOpenDialer?: () => void;
}

export const AccountDetailHeader: React.FC<AccountDetailHeaderProps> = ({
  data,
  allAccountNumbers,
  selectedAccountNumber,
  onSelectAccount,
  onOpenDialer,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const {
    account,
    customer,
    delinquency,
    portfolio,
    campaign,
    stage,
    assignedCollector,
  } = data;

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Bar: Account Switcher, Customer Name, and Quick Operational Badges */}
      <div className="px-4 lg:px-8 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Customer Name & Account Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-2xs">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">
                  {customer.name}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  {customer.type}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  • ID: {customer.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Jurisdiction: {customer.state} ({customer.jurisdictionRules.split('•')[0].trim()})
              </p>
            </div>
          </div>

          {/* Account Number Pill Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <CreditCard className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <select
              value={selectedAccountNumber}
              onChange={(e) => onSelectAccount(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-slate-900 focus:outline-none cursor-pointer pr-2"
            >
              {allAccountNumbers.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleCopy(account.accountNumber, 'accNum')}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
              title="Copy account number"
            >
              {copiedField === 'accNum' ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        {/* Right: Status Pill, Origin Badge & Collector Assignment */}
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={delinquency.status} />
          <OriginBadge origin={stage.origin} size="sm" />
          
          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-7 h-7 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[11px] font-mono font-bold text-emerald-800">
              {assignedCollector.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{assignedCollector.name}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Op #{assignedCollector.operatorId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Key Metadata Metrics (The 10 Required Header Fields) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
        {/* 1. Account & Creditor */}
        <div className="p-3.5 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-slate-400" />
            <span>Account</span>
          </div>
          <div className="font-mono font-bold text-xs text-slate-900 truncate">
            {account.accountNumber}
          </div>
          <div className="text-[11px] text-slate-600 truncate" title={account.creditorName}>
            {account.creditorName}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">
            {account.accountType}
          </div>
        </div>

        {/* 2. Customer Profile */}
        <div className="p-3.5 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" />
            <span>Customer</span>
          </div>
          <div className="font-bold text-xs text-slate-900 truncate">
            {customer.name}
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            SSN: {customer.ssnMasked}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            DOB: {customer.dobMasked} • {customer.state}
          </div>
        </div>

        {/* 3. Balance Breakdown */}
        <div className="p-3.5 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-emerald-600" />
            <span>Total Balance</span>
          </div>
          <div className="font-mono font-bold text-sm text-slate-900">
            ${account.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <span>Prin: ${account.principalAmount.toLocaleString()}</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Int+Fees: ${(account.accruedInterest + account.accruedFees).toLocaleString()}
          </div>
        </div>

        {/* 4. Delinquency (DPD) & DPD Bucket */}
        <div className="p-3.5 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-500" />
            <span>Delinquency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono font-bold text-sm text-rose-700 bg-rose-50 px-2 py-0.2 rounded border border-rose-200">
              {delinquency.daysPastDue} DPD
            </span>
          </div>
          <div className="text-[11px] font-bold text-slate-700 font-mono">
            Bucket: {delinquency.dpdBucketLabel}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            CO: {account.chargeOffDate}
          </div>
        </div>

        {/* 5. Portfolio & Campaign */}
        <div className="p-3.5 space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1">
            <FolderTree className="w-3 h-3 text-indigo-500" />
            <span>Portfolio / Campaign</span>
          </div>
          <div className="font-bold text-xs text-slate-900 truncate" title={portfolio.name}>
            {portfolio.name}
          </div>
          <div className="text-[11px] text-indigo-700 font-mono truncate" title={campaign.name}>
            {campaign.name}
          </div>
          <div className="text-[10px] text-slate-500 font-mono truncate">
            {campaign.currentStep}
          </div>
        </div>

        {/* 6. Current Stage & Assigned Collector */}
        <div className="p-3.5 space-y-1 bg-indigo-50/30">
          <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-bold flex items-center gap-1">
            <GitCommit className="w-3 h-3 text-indigo-600" />
            <span>Current Stage</span>
          </div>
          <div className="font-mono font-bold text-xs text-indigo-950 truncate">
            {stage.currentStageLabel}
          </div>
          <div className="text-[10px] text-slate-600 font-mono">
            Entered: {stage.stageEnteredDate.split('(')[0].trim()} ({stage.daysInCurrentStage}d in stage)
          </div>
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 pt-0.5">
            <UserCheck className="w-2.5 h-2.5 text-emerald-600" />
            <span>Collector: {assignedCollector.name.split(' ')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
