import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Clock,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { AccountRequiringAttention } from '../../types/dashboard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface AccountsAttentionSectionProps {
  accounts: AccountRequiringAttention[];
  onSelectAccount?: (account: AccountRequiringAttention) => void;
  onAction?: (actionId: string, account: AccountRequiringAttention) => void;
}

export const AccountsAttentionSection: React.FC<AccountsAttentionSectionProps> = ({
  accounts,
  onSelectAccount,
  onAction,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredAccounts = accounts.filter((acc) => {
    if (filterRisk === 'ALL') return true;
    return acc.riskLevel === filterRisk;
  });

  const getRiskBadge = (level: AccountRequiringAttention['riskLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-rose-800 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600" />
            <span>CRITICAL</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>HIGH RISK</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-700 border border-slate-200">
            <span>MEDIUM</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/30">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Accounts Requiring Manager Attention
            </h3>
            <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold border border-rose-200">
              {accounts.filter(a => a.riskLevel === 'CRITICAL').length} Critical Blockers
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>Which accounts have broken promises, imminent dispute SLA breaches, or statute expirations?</em>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md bg-white p-0.5 border border-slate-200 shadow-2xs text-[11px] font-mono">
            <button
              onClick={() => setFilterRisk('ALL')}
              className={`px-2 py-0.5 rounded font-medium ${
                filterRisk === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({accounts.length})
            </button>
            <button
              onClick={() => setFilterRisk('CRITICAL')}
              className={`px-2 py-0.5 rounded font-medium ${
                filterRisk === 'CRITICAL' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Critical Only ({accounts.filter(a => a.riskLevel === 'CRITICAL').length})
            </button>
          </div>
        </div>
      </div>

      {/* Compact Operational Risk Category & Stagnation Distribution */}
      <div className="px-4 py-2.5 bg-amber-50/20 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Root Cause Breakdown</span>
            <span className="font-bold text-amber-950">{accounts.length} Blocked</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{ width: `${(accounts.filter(a => a.reasonCategory === 'BROKEN_PTP').length / accounts.length) * 100}%` }}
              className="bg-rose-500"
              title="Broken PTP"
            />
            <div
              style={{ width: `${(accounts.filter(a => a.reasonCategory === 'DISPUTE_SLA').length / accounts.length) * 100}%` }}
              className="bg-amber-500"
              title="Dispute SLA"
            />
            <div
              style={{ width: `${(accounts.filter(a => a.reasonCategory === 'STATUTE_LIMIT').length / accounts.length) * 100}%` }}
              className="bg-purple-500"
              title="Statute of Limitations"
            />
            <div
              style={{ width: `${(accounts.filter(a => a.reasonCategory === 'HIGH_VALUE_DORMANT').length / accounts.length) * 100}%` }}
              className="bg-blue-500"
              title="High Value Dormant"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Total Capital in Jeopardy</span>
            <span className="font-bold text-rose-800">
              ${accounts.reduce((acc, a) => acc + a.balance, 0).toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Average Balance: <strong className="text-slate-800">${Math.round(accounts.reduce((acc, a) => acc + a.balance, 0) / accounts.length).toLocaleString()}</strong>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Average Aging in Attention</span>
            <span className="font-bold text-slate-900">
              {(accounts.reduce((acc, a) => acc + a.daysInAttentionState, 0) / accounts.length).toFixed(1)} Days
            </span>
          </div>
          <div className="text-[10px] text-rose-700 font-semibold">
            {accounts.filter(a => a.daysInAttentionState > 7).length} Accounts &gt; 7 Days Unresolved
          </div>
        </div>
      </div>

      {/* Account List Matrix */}
      <div className="divide-y divide-slate-100">
        {filteredAccounts.map((acc) => (
          <div
            key={acc.id}
            onClick={() => onSelectAccount && onSelectAccount(acc)}
            className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 cursor-pointer group"
          >
            {/* Account ID & Debtor Info */}
            <div className="flex items-start gap-3 min-w-[260px]">
              <div className="pt-0.5">{getRiskBadge(acc.riskLevel)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {acc.debtorName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {acc.accountNumber}
                  </span>
                </div>
                <div className="text-xs text-slate-700 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-rose-900 font-semibold">{acc.reason}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                  <span>Assigned: <strong className="text-slate-800">{acc.assignedCollector}</strong></span>
                  <span>•</span>
                  <span>In state: <strong className="text-slate-800">{acc.daysInAttentionState}d</strong></span>
                </div>
              </div>
            </div>

            {/* Financials & DPD */}
            <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
              <div className="text-right">
                <div className="text-slate-400 text-[10px] uppercase">Balance</div>
                <div className="font-bold text-slate-900 text-sm">
                  ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="text-center px-2.5 py-1 bg-slate-100 rounded border border-slate-200">
                <div className="text-slate-400 text-[9px] uppercase">DPD</div>
                <div className={`font-bold text-xs ${acc.daysPastDue > 120 ? 'text-rose-700' : 'text-slate-800'}`}>
                  {acc.daysPastDue}d
                </div>
              </div>
            </div>

            {/* Suggested Manager Action & Trigger Button */}
            <div className="flex items-center gap-2.5 lg:max-w-md w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100">
              <div className="text-[11px] text-slate-600 max-w-xs text-left hidden sm:block">
                <span className="text-slate-400 font-mono text-[10px] block">Suggested Protocol:</span>
                <span className="font-medium text-slate-800 line-clamp-1">{acc.suggestedAction}</span>
              </div>

              <Button
                size="xs"
                variant="primary"
                rightIcon={<ArrowRight className="w-3 h-3" />}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onAction) onAction('resolve', acc);
                }}
              >
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
