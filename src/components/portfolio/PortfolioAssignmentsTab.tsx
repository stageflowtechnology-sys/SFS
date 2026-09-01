import React, { useState } from 'react';
import { PortfolioItem, PortfolioCollectorSummary } from '../../types/portfolio';
import { Badge } from '../ui/Badge';
import {
  Users,
  UserCheck,
  Percent,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  Crown,
} from 'lucide-react';

interface PortfolioAssignmentsTabProps {
  portfolio: PortfolioItem;
  onOpenAssignModal?: () => void;
}

export const PortfolioAssignmentsTab: React.FC<PortfolioAssignmentsTabProps> = ({
  portfolio,
  onOpenAssignModal,
}) => {
  const [collectors, setCollectors] = useState<PortfolioCollectorSummary[]>(
    portfolio.collectors
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const totalAssignedAccounts = collectors.reduce((acc, c) => acc + c.assignedAccounts, 0);
  const totalAssignedBalance = collectors.reduce((acc, c) => acc + c.assignedBalance, 0);
  const avgUtilization =
    collectors.length > 0
      ? Math.round(
          collectors.reduce((acc, c) => acc + c.capacityUtilizationPct, 0) / collectors.length
        )
      : 0;

  const handleRebalanceAuto = () => {
    // Distribute accounts evenly
    const avgAccounts = Math.round(totalAssignedAccounts / collectors.length);
    const avgBal = Math.round(totalAssignedBalance / collectors.length);
    const rebalanced = collectors.map((c) => ({
      ...c,
      assignedAccounts: avgAccounts,
      assignedBalance: avgBal,
      capacityUtilizationPct: Math.min(85, Math.max(65, Math.round(avgAccounts / 3.8))),
    }));
    setCollectors(rebalanced);
    setToastMessage('Workload autonomously rebalanced evenly across assigned operators');
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Allocation Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Collector Team Capacity & Workload Allocation
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Real-time queue loading, licensed jurisdiction coverage, and recovery velocity per assigned debt negotiation officer.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRebalanceAuto}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Auto-Balance Load</span>
          </button>
          {onOpenAssignModal && (
            <button
              onClick={onOpenAssignModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Modify Roster</span>
            </button>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3 Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Assigned Queue Total
          </span>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900">
            {totalAssignedAccounts.toLocaleString()} <span className="text-xs font-normal text-slate-500">accounts</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-mono">
            {formatCurrency(totalAssignedBalance)} total balance
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average Capacity Utilization
          </span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-indigo-700">
              {avgUtilization}%
            </span>
            <span className="text-xs text-slate-500">of maximum desk capacity</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              style={{ width: `${avgUtilization}%` }}
              className={`h-full ${avgUtilization > 85 ? 'bg-amber-500' : 'bg-indigo-600'}`}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            FDCPA Roster Compliance
          </span>
          <div className="mt-1.5 text-xs font-bold text-emerald-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Operators State-Licensed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Valid credentials across {portfolio.legalJurisdictions.join(', ')}
          </p>
        </div>
      </div>

      {/* Collectors Detail Grid / Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Assigned Operator Roster ({collectors.length})
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Portfolio Code: {portfolio.code}
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {collectors.map((collector) => (
            <div
              key={collector.id}
              className="p-4.5 hover:bg-slate-50/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Collector Profile */}
              <div className="flex items-start gap-3.5 min-w-[260px]">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                  {collector.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {collector.name}
                    </span>
                    {collector.isTeamLead && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                        <Crown className="w-3 h-3 text-amber-600" />
                        <span>Team Lead</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{collector.role}</span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-slate-600 font-semibold">
                      {collector.operatorId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Workload & Capacity Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 text-xs">
                {/* Assigned Accounts */}
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">
                    Assigned Cases
                  </span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {collector.assignedAccounts}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {formatCurrency(collector.assignedBalance)}
                  </div>
                </div>

                {/* Capacity Bar */}
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">
                    Desk Utilization
                  </span>
                  <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">
                    {collector.capacityUtilizationPct}%
                  </div>
                  <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1">
                    <div
                      style={{ width: `${collector.capacityUtilizationPct}%` }}
                      className={`h-full rounded-full ${
                        collector.capacityUtilizationPct > 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                  </div>
                </div>

                {/* Resolution Rate */}
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">
                    Resolution Yield
                  </span>
                  <div className="font-mono font-bold text-emerald-700 text-sm mt-0.5">
                    {collector.resolutionRatePct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Liquidated to date</div>
                </div>

                {/* PTP Adherence */}
                <div>
                  <span className="text-[10px] uppercase text-slate-400 font-mono block">
                    PTP Kept Rate
                  </span>
                  <div className="font-mono font-bold text-indigo-700 text-sm mt-0.5">
                    {collector.ptpAdherenceRatePct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Promise honored</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
