import React from 'react';
import {
  Banknote,
  ArrowDownLeft,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { CollectionOutcome } from '../../types/dashboard';
import { StatusPill } from '../ui/StatusPill';
import { Badge } from '../ui/Badge';

interface CollectionOutcomesSectionProps {
  outcomes: CollectionOutcome[];
  onSelectOutcome?: (outcome: CollectionOutcome) => void;
}

export const CollectionOutcomesSection: React.FC<CollectionOutcomesSectionProps> = ({
  outcomes,
  onSelectOutcome,
}) => {
  const totalSettledToday = outcomes
    .filter((o) => o.status === 'EXECUTED_VERIFIED' || o.status === 'VERIFYING')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const getRailBadge = (rail: CollectionOutcome['paymentRail']) => {
    switch (rail) {
      case 'FEDWIRE':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            <Building className="w-3 h-3 text-emerald-600" />
            <span>Fedwire Gross</span>
          </span>
        );
      case 'ACH_DEBIT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
            <Banknote className="w-3 h-3 text-blue-600" />
            <span>NACHA ACH</span>
          </span>
        );
      case 'DEBIT_CARD':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
            <CreditCard className="w-3 h-3 text-indigo-600" />
            <span>Card Terminal</span>
          </span>
        );
      case 'CERTIFIED_CHECK':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
            <span>Cashiers Check</span>
          </span>
        );
    }
  };

  const getOutcomeTypeLabel = (type: CollectionOutcome['type']) => {
    switch (type) {
      case 'SETTLEMENT_PIF':
        return 'Paid in Full (Settlement)';
      case 'PAYMENT_PLAN_ESTABLISHED':
        return 'Structured Autopay Plan';
      case 'WIRE_CLEARED':
        return 'Direct Wire Liquidation';
      case 'PARTIAL_PAYMENT':
        return 'Direct Phone Payment';
      case 'PTP_LOGGED':
        return 'Promise-To-Pay Logged';
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/30">
        <div>
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Collection Outcomes & Cash Liquidations
            </h3>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-bold border border-emerald-300">
              ${totalSettledToday.toLocaleString()} Confirmed
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>What settlements, payments, and payment plans cleared the floor in the last 4 hours?</em>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Core Banking Sync</span>
          </span>
        </div>
      </div>

      {/* Compact Operational Settlement Rail Breakdown */}
      <div className="px-4 py-2.5 bg-emerald-50/20 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Liquidation Rail Mix</span>
            <span className="font-bold text-slate-800">{outcomes.length} Cleared Today</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{ width: `${(outcomes.filter(o => o.paymentRail === 'FEDWIRE').reduce((acc, o) => acc + o.amount, 0) / outcomes.reduce((acc, o) => acc + o.amount, 0)) * 100}%` }}
              className="bg-emerald-600"
              title="Fedwire Gross"
            />
            <div
              style={{ width: `${(outcomes.filter(o => o.paymentRail === 'ACH_DEBIT').reduce((acc, o) => acc + o.amount, 0) / outcomes.reduce((acc, o) => acc + o.amount, 0)) * 100}%` }}
              className="bg-blue-500"
              title="NACHA ACH"
            />
            <div
              style={{ width: `${(outcomes.filter(o => o.paymentRail === 'DEBIT_CARD').reduce((acc, o) => acc + o.amount, 0) / outcomes.reduce((acc, o) => acc + o.amount, 0)) * 100}%` }}
              className="bg-indigo-500"
              title="Card Terminal"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Average Recovery Ticket</span>
            <span className="font-bold text-slate-900">
              ${Math.round(outcomes.reduce((acc, o) => acc + o.amount, 0) / outcomes.length).toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Largest Ticket: <strong className="text-emerald-700 font-bold">${Math.max(...outcomes.map(o => o.amount)).toLocaleString()}</strong>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Settlement Execution Status</span>
            <span className="font-bold text-emerald-700">100% Cleared</span>
          </div>
          <div className="text-[10px] text-slate-600">
            {outcomes.filter(o => o.type === 'SETTLEMENT_PIF').length} PIF / {outcomes.filter(o => o.type === 'PAYMENT_PLAN_ESTABLISHED').length} Autopay Plans
          </div>
        </div>
      </div>

      {/* Outcome Feed */}
      <div className="divide-y divide-slate-100">
        {outcomes.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectOutcome && onSelectOutcome(item)}
            className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
          >
            {/* Timestamp & Debtor Details */}
            <div className="flex items-start gap-3 min-w-[280px]">
              <div className="flex flex-col items-center justify-center p-1.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-slate-600 w-16 text-center shrink-0">
                <Clock className="w-3 h-3 text-slate-400 mb-0.5" />
                <span>{item.timestamp}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {item.debtorName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {item.accountNumber}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 mt-0.5">
                  {getOutcomeTypeLabel(item.type)}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  {item.notes}
                </p>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Handled by: <strong className="text-slate-700">{item.collectorName}</strong>
                </div>
              </div>
            </div>

            {/* Financial Value, Rail & Status */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right">
                <div className="font-mono text-sm font-bold text-emerald-800">
                  +${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="mt-0.5">{getRailBadge(item.paymentRail)}</div>
              </div>

              <div className="shrink-0">
                <StatusPill status={item.status} size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
