import React from 'react';
import {
  Users,
  DollarSign,
  AlertTriangle,
  CheckSquare,
  Clock,
  HandCoins,
  PhoneCall,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { OperationalKPIs } from '../../types/dashboard';
import { Tooltip } from '../ui/Tooltip';
import { Badge } from '../ui/Badge';

interface KPIGridProps {
  kpis: OperationalKPIs;
  onSelectMetric?: (metricId: string) => void;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ kpis, onSelectMetric }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* 1. Active Accounts */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('active-accounts')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Active Accounts</span>
          </div>
          <Tooltip
            content="Operational Question: What is the delinquency age breakdown across the active portfolio?"
            lineageInfo={{ source: 'Core Portfolio Ledger', confidenceOrAudit: 'Reconciled' }}
          >
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              +{kpis.activeAccounts.changePct}% MoM
            </span>
          </Tooltip>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
            {kpis.activeAccounts.total.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">18 Portfolios</span>
        </div>

        {/* Compact DPD Stage Distribution Bar */}
        <div className="mt-2.5 space-y-1">
          <div className="flex h-1.5 w-full overflow-hidden rounded bg-slate-100">
            <div
              style={{ width: `${(kpis.activeAccounts.breakdown.earlyStage / kpis.activeAccounts.total) * 100}%` }}
              className="bg-emerald-500"
              title="1-30 DPD (Early)"
            />
            <div
              style={{ width: `${(kpis.activeAccounts.breakdown.midStage / kpis.activeAccounts.total) * 100}%` }}
              className="bg-blue-500"
              title="31-90 DPD (Mid)"
            />
            <div
              style={{ width: `${(kpis.activeAccounts.breakdown.lateStage / kpis.activeAccounts.total) * 100}%` }}
              className="bg-amber-500"
              title="91-180 DPD (Late)"
            />
            <div
              style={{ width: `${(kpis.activeAccounts.breakdown.preLegal / kpis.activeAccounts.total) * 100}%` }}
              className="bg-rose-500"
              title="180+ DPD (Pre-Legal)"
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span className="text-emerald-700 font-medium">Early: {kpis.activeAccounts.breakdown.earlyStage}</span>
            <span className="text-amber-700 font-medium">Late: {kpis.activeAccounts.breakdown.lateStage}</span>
            <span className="text-rose-700 font-medium">Pre-Legal: {kpis.activeAccounts.breakdown.preLegal}</span>
          </div>
        </div>
      </div>

      {/* 2. Outstanding Balance */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('outstanding-balance')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            <span>Outstanding Balance</span>
          </div>
          <Tooltip
            content="Operational Question: Are collections tracking the monthly 18.5% recovery pace target?"
            lineageInfo={{ source: 'Core Portfolio Ledger', confidenceOrAudit: 'Reconciled' }}
          >
            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
              MTD Rec: ${(kpis.outstandingBalance.liquidatedThisMonth / 1000000).toFixed(2)}M
            </span>
          </Tooltip>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
            ${(kpis.outstandingBalance.total / 1000000).toFixed(2)}M
          </span>
          <span className="text-[11px] font-mono text-slate-600">
            ${kpis.outstandingBalance.total.toLocaleString()}
          </span>
        </div>

        {/* Liquidation Run-Rate Progress */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className="text-slate-500">Liquidation Pace</span>
            <span className="font-bold text-slate-800">
              {kpis.outstandingBalance.liquidationRatePct}% / {kpis.outstandingBalance.targetPct}% target
            </span>
          </div>
          <div className="h-1.5 w-full rounded bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded"
              style={{
                width: `${(kpis.outstandingBalance.liquidationRatePct / kpis.outstandingBalance.targetPct) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Accounts Requiring Attention */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('accounts-attention')}
        className="rounded-lg border border-amber-200 bg-amber-50/40 p-3.5 shadow-2xs hover:border-amber-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Requires Attention</span>
          </div>
          <Tooltip
            content="Operational Question: Which accounts pose immediate compliance SLA or broken commitment risks?"
            lineageInfo={{ source: 'Exception Monitor', confidenceOrAudit: 'Live Feed' }}
          >
            <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200 animate-pulse">
              {kpis.accountsRequiringAttention.criticalRisk} Critical
            </span>
          </Tooltip>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-amber-950 tracking-tight">
            {kpis.accountsRequiringAttention.total}
          </span>
          <span className="text-[10px] text-amber-800 font-mono font-medium">Blocking Pipeline</span>
        </div>

        {/* Breakdown Chips */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-900 font-medium">
            {kpis.accountsRequiringAttention.brokenPromises} Broken PTP
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-900 font-medium">
            {kpis.accountsRequiringAttention.disputeHolds} Dispute SLA
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-900 font-medium">
            {kpis.accountsRequiringAttention.highBalanceDormant} Dormant
          </span>
        </div>
      </div>

      {/* 4. Today's Work */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('todays-work')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <CheckSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Today's Work</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
            {kpis.todaysWork.adherencePct}% SLA Pace
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
              {kpis.todaysWork.completedTouches}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {kpis.todaysWork.targetTouches}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Floor Quota</span>
        </div>

        {/* Channel Breakdown */}
        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-100">
          <span>Calls: <strong className="text-slate-900">{kpis.todaysWork.callsCompleted}</strong></span>
          <span>SMS: <strong className="text-slate-900">{kpis.todaysWork.smsSent}</strong></span>
          <span>Mail: <strong className="text-slate-900">{kpis.todaysWork.lettersDispatched}</strong></span>
        </div>
      </div>

      {/* 5. Overdue Follow-Ups */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('overdue-followups')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Overdue Follow-Ups</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
            Avg Delay: {kpis.overdueFollowUps.averageDelayHours}h
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
            {kpis.overdueFollowUps.total}
          </span>
          <span className="text-[11px] font-mono font-bold text-rose-700">
            ${kpis.overdueFollowUps.totalBalance.toLocaleString()} At Risk
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>Critical (&gt;24h): <strong className="text-rose-700">{kpis.overdueFollowUps.criticalOverdue}</strong></span>
          <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5">
            Resolve Queue <ArrowUpRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>

      {/* 6. PTP Activity (Promise to Pay) */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('ptp-activity')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <HandCoins className="w-3.5 h-3.5 text-emerald-600" />
            <span>PTP Activity Today</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            {kpis.ptpActivity.honorRatePct}% Honor Rate
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
            ${(kpis.ptpActivity.collectedTodayAmount / 1000).toFixed(1)}k
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            of ${(kpis.ptpActivity.scheduledTodayAmount / 1000).toFixed(1)}k sched
          </span>
        </div>

        {/* Progress Ratio */}
        <div className="mt-2.5 space-y-1">
          <div className="h-1.5 w-full rounded bg-slate-100 overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full"
              style={{
                width: `${(kpis.ptpActivity.collectedTodayAmount / kpis.ptpActivity.scheduledTodayAmount) * 100}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span className="text-emerald-700 font-semibold">{kpis.ptpActivity.scheduledTodayCount - kpis.ptpActivity.brokenCount} Kept</span>
            <span className="text-rose-700 font-semibold">{kpis.ptpActivity.brokenCount} Broken</span>
          </div>
        </div>
      </div>

      {/* 7. Contactability (RPC Rate) */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('contactability')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
            <span>Contactability (RPC)</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
            Peak: {kpis.contactability.bestHourWindow}
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-slate-900 tracking-tight">
            {kpis.contactability.rpcRatePct}%
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {kpis.contactability.verifiedRpcCount} Verified RPCs
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-100">
          <span>Dials: <strong className="text-slate-900">{kpis.contactability.totalDialsToday}</strong></span>
          <span>Connects: <strong className="text-slate-900">{kpis.contactability.connectedCount}</strong></span>
          <span className="text-emerald-700 font-semibold">
            {((kpis.contactability.verifiedRpcCount / kpis.contactability.connectedCount) * 100).toFixed(0)}% RPC/Conn
          </span>
        </div>
      </div>

      {/* 8. QA Activity */}
      <div
        onClick={() => onSelectMetric && onSelectMetric('qa-activity')}
        className="rounded-lg border border-slate-200 bg-white p-3.5 shadow-2xs hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>QA Compliance</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            {kpis.qaActivity.miniMirandaPassRatePct}% Mini-Miranda
          </span>
        </div>

        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-xl font-bold font-mono text-emerald-700 tracking-tight">
            {kpis.qaActivity.averageScorePct}%
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {kpis.qaActivity.auditedTodayCount} Audits Today
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-100">
          <span>Passing: <strong className="text-emerald-700">{kpis.qaActivity.auditedTodayCount - kpis.qaActivity.flaggedViolationsCount}</strong></span>
          <span>Flagged: <strong className="text-rose-700">{kpis.qaActivity.flaggedViolationsCount}</strong></span>
          <span className="text-slate-500">Reg-F Strict</span>
        </div>
      </div>
    </div>
  );
};
