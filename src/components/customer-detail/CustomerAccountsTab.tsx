import React, { useState } from 'react';
import { CustomerAccountSummary } from '../../types/customerDetail';
import { StatusPill } from '../ui/StatusPill';
import { OriginBadge } from '../ui/OriginBadge';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Layers,
  AlertTriangle,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Calculator,
  Percent,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Building,
} from 'lucide-react';

interface CustomerAccountsTabProps {
  accounts: CustomerAccountSummary[];
  onNavigateToWorkbench?: (accountId?: string) => void;
}

export const CustomerAccountsTab: React.FC<CustomerAccountsTabProps> = ({
  accounts,
  onNavigateToWorkbench,
}) => {
  // Local state for settlement discount calculator per account
  const [discountOverrides, setDiscountOverrides] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    accounts.forEach((acc) => {
      initial[acc.id] = acc.authorizedDiscountPct || 20;
    });
    return initial;
  });

  const handleDiscountChange = (accId: string, value: number) => {
    setDiscountOverrides((prev) => ({ ...prev, [accId]: value }));
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div id="customer-accounts-tab" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Debtor Multi-Account Ledger & Portfolio Distribution
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual debt facilities, assigned portfolios, legal stages, and settlement calculators for each claim.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Total Linked Accounts: <span className="text-indigo-600 font-bold">{accounts.length}</span>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {accounts.map((acc) => {
          const discountPct = discountOverrides[acc.id] || acc.authorizedDiscountPct || 20;
          const discountedPayoff = acc.totalBalance * (1 - discountPct / 100);
          const savingsAmount = acc.totalBalance - discountedPayoff;

          return (
            <div
              key={acc.id}
              className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all hover:border-slate-300"
            >
              {/* Account Card Header */}
              <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 rounded-lg">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-100">
                        {acc.accountNumber}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-medium text-slate-300">
                        {acc.creditorName}
                      </span>
                      <OriginBadge origin={acc.origin} size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
                      {acc.portfolioName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <StatusPill status={acc.status} />
                  {onNavigateToWorkbench && (
                    <button
                      onClick={() => onNavigateToWorkbench(acc.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
                    >
                      <span>Work in Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Account Card Body */}
              <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Financial Ledger Breakdown (5 cols) */}
                <div className="lg:col-span-5 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Financial Balance Ledger
                  </h3>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                    <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-medium">Principal Outstanding</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">
                        {formatCurrency(acc.principalAmount)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-medium">Accrued Statutory Interest</span>
                      <span className="text-sm font-semibold text-slate-700 font-mono">
                        {formatCurrency(acc.accruedInterest)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline border-b border-slate-200 pb-2">
                      <span className="text-xs text-slate-500 font-medium">Waivable Collection Fees</span>
                      <span className="text-sm font-semibold text-slate-700 font-mono">
                        {formatCurrency(acc.accruedFees)}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs font-bold text-slate-900">Total Claim Exposure</span>
                      <span className="text-lg font-bold text-indigo-950 font-mono">
                        {formatCurrency(acc.totalBalance)}
                      </span>
                    </div>
                  </div>

                  {/* Delinquency & Charge-off Stats */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                      <div className="text-[10px] uppercase font-bold text-amber-800">Delinquency</div>
                      <div className="text-sm font-bold text-amber-900 mt-0.5">{acc.daysPastDue} DPD</div>
                      <div className="text-[10px] text-amber-700 font-medium">{acc.dpdBucket}</div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Charge-Off Date</div>
                      <div className="text-sm font-bold text-slate-800 mt-0.5">{acc.chargeOffDate}</div>
                      <div className="text-[10px] text-slate-500">Assigned: {acc.assignedCollector}</div>
                    </div>
                  </div>
                </div>

                {/* Settlement Calculator & Terms (7 cols) */}
                <div className="lg:col-span-7 bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Authorized Settlement Calculator
                      </h3>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      Authorized Up to 35%
                    </span>
                  </div>

                  {/* Interactive Discount Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-600">Settlement Discount Rate</span>
                      <span className="text-indigo-600 font-bold font-mono">{discountPct}% Discount</span>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={discountPct}
                      onChange={(e) => handleDiscountChange(acc.id, Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />

                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>5% (Conservative)</span>
                      <span>20% (Standard)</span>
                      <span>35% (Max Collector Authority)</span>
                    </div>
                  </div>

                  {/* Calculated Payoff Numbers */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Lump Sum Payoff</span>
                      <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">
                        {formatCurrency(discountedPayoff)}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">
                        Debtor Saves {formatCurrency(savingsAmount)}
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">2-Tranche Cure (50/50)</span>
                      <div className="text-lg font-bold text-indigo-900 font-mono mt-0.5">
                        {formatCurrency(discountedPayoff / 2)}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Due in 2 Equal Bi-Weekly ACH
                      </span>
                    </div>
                  </div>

                  {/* Last Payment Indicator */}
                  {acc.lastPaymentDate && (
                    <div className="text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-200">
                      <span>Last Recorded Payment:</span>
                      <span className="font-semibold text-slate-800">
                        {formatCurrency(acc.lastPaymentAmount || 0)} on {acc.lastPaymentDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
