import React, { useState } from 'react';
import { WorkbenchAccount, ContactMethod } from '../../types/workbench';
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  CreditCard,
  Copy,
  Check,
  Percent,
  ChevronDown,
  ChevronUp,
  FileText,
  History,
  PhoneCall,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { OriginBadge } from '../ui/OriginBadge';
import { StatusPill } from '../ui/StatusPill';

interface LeftContextPanelProps {
  account: WorkbenchAccount;
  selectedContactId: string;
  onSelectContact: (contact: ContactMethod) => void;
  onDialContact?: (contact: ContactMethod) => void;
}

export const LeftContextPanel: React.FC<LeftContextPanelProps> = ({
  account,
  selectedContactId,
  onSelectContact,
  onDialContact,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showDiscountCalc, setShowDiscountCalc] = useState<boolean>(false);
  const [customDiscountPct, setCustomDiscountPct] = useState<number>(
    account.authorizedSettlementDiscountPct
  );
  const [showAllHistory, setShowAllHistory] = useState<boolean>(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const calculatedSettlementPayoff =
    account.totalBalance * (1 - customDiscountPct / 100);

  const visibleInteractions = showAllHistory
    ? account.previousInteractions
    : account.previousInteractions.slice(0, 3);

  return (
    <div className="flex flex-col h-full bg-slate-50/50 border-r border-slate-200 overflow-y-auto">
      {/* Panel Header */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {account.customerName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  {account.customerName}
                </h2>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    account.customerType === 'COMMERCIAL'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {account.customerType}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                ID: {account.customerId} • {account.state} Jurisdiction
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCopy(account.accountNumber, 'acc-top')}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
            title="Copy Account Number"
          >
            {copiedField === 'acc-top' ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 1. Account & Creditor Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Account & Creditor
            </span>
            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {account.accountNumber}
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500">Creditor</span>
              <span className="font-semibold text-slate-900">
                {account.creditorName}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500">Product Line</span>
              <span className="font-medium text-slate-800">
                {account.accountType}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500">Portfolio</span>
              <span className="font-mono text-[11px] text-slate-700 truncate max-w-[170px]" title={account.portfolioName}>
                {account.portfolioName}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500">SSN / DOB</span>
              <span className="font-mono text-[11px] text-slate-700">
                {account.ssnMasked} • {account.dobMasked}
              </span>
            </div>
            {account.employer && (
              <div className="flex items-start justify-between text-slate-600 pt-1 border-t border-slate-100">
                <span className="text-slate-500 shrink-0">Principal Entity</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[170px]" title={account.employer}>
                  {account.employer}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Total Balance & Delinquency (DPD) */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Financial Exposure
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                {account.daysPastDue} DPD
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {account.dpdBucket.replace('_', '-')} Days
              </span>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-lg p-3 space-y-1">
            <div className="text-[10px] font-mono text-slate-400 uppercase">
              Total Outstanding Balance
            </div>
            <div className="text-2xl font-bold font-mono tracking-tight text-white flex items-baseline justify-between">
              <span>${account.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                Limit: ${account.originalCreditLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Balance Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-slate-100">
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-500">Principal</div>
              <div className="font-mono font-bold text-slate-900 mt-0.5">
                ${account.principalAmount.toLocaleString()}
              </div>
            </div>
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-500">Interest</div>
              <div className="font-mono font-bold text-amber-700 mt-0.5">
                +${account.accruedInterest.toLocaleString()}
              </div>
            </div>
            <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
              <div className="text-[10px] text-slate-500">Late Fees</div>
              <div className="font-mono font-bold text-rose-700 mt-0.5">
                +${account.accruedFees.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Authorized Settlement Discount */}
          <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-2.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-indigo-950 font-semibold">
                <Percent className="w-3.5 h-3.5 text-indigo-600" />
                <span>Authorized Settlement Cap</span>
              </div>
              <button
                onClick={() => setShowDiscountCalc(!showDiscountCalc)}
                className="text-[11px] font-mono text-indigo-700 hover:text-indigo-900 font-bold underline"
              >
                {showDiscountCalc ? 'Hide Calc' : 'Payoff Calc'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">Max Cap: {account.authorizedSettlementDiscountPct}% Discount</span>
              <span className="font-mono font-bold text-indigo-900">
                Min Payoff: ${account.minAcceptableSettlement.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {showDiscountCalc && (
              <div className="pt-2 border-t border-indigo-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 text-[11px]">Proposed Discount:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="range"
                      min={0}
                      max={account.authorizedSettlementDiscountPct}
                      step={5}
                      value={customDiscountPct}
                      onChange={(e) => setCustomDiscountPct(Number(e.target.value))}
                      className="w-20 accent-indigo-600 h-1.5 bg-indigo-200 rounded-lg cursor-pointer"
                    />
                    <span className="font-mono font-bold text-indigo-900 w-8 text-right">
                      {customDiscountPct}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-white p-1.5 rounded border border-indigo-200 font-mono text-xs">
                  <span className="text-slate-600">Calculated Payoff:</span>
                  <span className="font-bold text-emerald-700">
                    ${calculatedSettlementPayoff.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Statute of Limitations & Compliance Tag */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              SOL Remaining:
            </span>
            <span className="font-mono font-semibold text-slate-800">
              {account.statuteRemainingYears} yrs ({account.statuteOfLimitationsDate})
            </span>
          </div>
        </div>

        {/* 3. Campaign & Authoritative Current Stage */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Campaign & Stage
            </span>
            <OriginBadge origin={account.currentStageOrigin} size="xs" />
          </div>

          <div className="space-y-2">
            <div className="p-2.5 rounded-lg border-2 border-emerald-300 bg-emerald-50/50 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">
                  Authoritative Current Stage
                </span>
                <StatusPill status={account.currentStageStatus} size="xs" />
              </div>
              <div className="text-sm font-bold text-emerald-950">
                {account.currentStageLabel}
              </div>
              <div className="text-[10px] font-mono text-emerald-700">
                Reconciled: {account.stageLastUpdated}
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Active Campaign</span>
                <span className="font-medium text-slate-900 truncate max-w-[170px]" title={account.campaignName}>
                  {account.campaignName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cadence Step</span>
                <span className="font-mono text-[11px] text-slate-700">
                  {account.campaignStep}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Contact Information */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Contact Information
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              TCPA Compliant
            </span>
          </div>

          <div className="space-y-2">
            {account.contacts.map((contact) => {
              const isSelected = selectedContactId === contact.id;
              const isPhone = contact.type.startsWith('PHONE');
              const isEmail = contact.type === 'EMAIL';

              return (
                <div
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/60 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 min-w-0">
                      <div className="p-1 rounded bg-slate-100 text-slate-700 mt-0.5 shrink-0">
                        {isPhone ? (
                          <Phone className="w-3.5 h-3.5 text-indigo-600" />
                        ) : isEmail ? (
                          <Mail className="w-3.5 h-3.5 text-slate-600" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-900 truncate">
                            {contact.value}
                          </span>
                          {contact.isPrimary && (
                            <span className="text-[9px] font-mono px-1 py-0.2 bg-slate-900 text-white rounded font-bold">
                              PRIMARY
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {contact.label} • {contact.timezone || account.timezone}
                        </div>
                        {contact.bestTimeToCall && (
                          <div className="text-[10px] font-mono text-emerald-700 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Best Time: {contact.bestTimeToCall}
                          </div>
                        )}
                      </div>
                    </div>

                    {isPhone && onDialContact && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectContact(contact);
                          onDialContact(contact);
                        }}
                        className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs shrink-0"
                        title="Dial this number in workspace"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Dial</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Debtor Physical Address */}
            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs space-y-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Verified Legal Mailing Address
              </div>
              <p className="font-medium text-slate-800 text-[11px] leading-snug">
                {account.address}
              </p>
            </div>
          </div>
        </div>

        {/* 5. Previous Interactions Timeline */}
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Previous Interactions ({account.previousInteractions.length})
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {visibleInteractions.map((item, idx) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs relative"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <div className="flex items-center gap-1 font-semibold text-slate-700">
                    {item.channel === 'VOICE' ? (
                      <PhoneCall className="w-3 h-3 text-indigo-600" />
                    ) : item.channel === 'SMS' ? (
                      <MessageSquare className="w-3 h-3 text-cyan-600" />
                    ) : (
                      <Mail className="w-3 h-3 text-slate-600" />
                    )}
                    <span>{item.channel} ({item.direction})</span>
                  </div>
                  <span>{item.timestamp}</span>
                </div>

                <div className="font-bold text-slate-900 text-[11px]">
                  {item.disposition}
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {item.summary}
                </p>

                {item.ptpAmount && (
                  <div className="flex items-center justify-between p-1 rounded bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-900 font-bold">
                    <span>PTP Logged: ${item.ptpAmount.toLocaleString()}</span>
                    <span>Due: {item.ptpDueDate}</span>
                  </div>
                )}

                <div className="text-[10px] font-mono text-slate-400">
                  Agent: {item.operatorName}
                </div>
              </div>
            ))}

            {account.previousInteractions.length > 3 && (
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="w-full py-1 text-center text-xs font-mono text-indigo-600 hover:text-indigo-800 font-bold"
              >
                {showAllHistory
                  ? 'Show Fewer Logs'
                  : `View All ${account.previousInteractions.length} Historical Records`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
