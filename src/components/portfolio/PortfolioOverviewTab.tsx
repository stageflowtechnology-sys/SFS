import React from 'react';
import { PortfolioItem } from '../../types/portfolio';
import { Badge } from '../ui/Badge';
import {
  DollarSign,
  TrendingUp,
  Percent,
  Users,
  Calendar,
  ShieldCheck,
  Building,
  Scale,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  Clock,
  Briefcase,
  FileText,
  Activity,
} from 'lucide-react';

interface PortfolioOverviewTabProps {
  portfolio: PortfolioItem;
  onNavigateToAccountsTab: () => void;
  onNavigateToCampaignsTab: () => void;
  onNavigateToAssignmentsTab: () => void;
}

export const PortfolioOverviewTab: React.FC<PortfolioOverviewTabProps> = ({
  portfolio,
  onNavigateToAccountsTab,
  onNavigateToCampaignsTab,
  onNavigateToAssignmentsTab,
}) => {
  const {
    balance,
    accountCount,
    dpdDistribution,
    client,
    assetClassLabel,
    complianceGate,
    aiPropensityScore,
    aiStrategySummary,
    legalJurisdictions,
    statuteOfLimitationsDate,
    interestCapPct,
    maxSettlementDiscountPct,
    activityMilestones,
  } = portfolio;

  // Format currency
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6">
      {/* 4-Stat Core Financial & Operational Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Balance Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Active Balance
            </span>
            <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {formatCurrency(balance.currentActiveBalance)}
            </span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Face Value: {formatCurrency(balance.originalFaceValue)}</span>
            <span className="font-mono text-slate-700 font-medium">
              Avg ${balance.avgAccountBalance.toLocaleString()}/acct
            </span>
          </div>
        </div>

        {/* Recovered & Pace Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recovery Yield & Pace
            </span>
            <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-700">
              {balance.recoveryRatePct.toFixed(1)}%
            </span>
            <span className="text-xs font-mono text-slate-500">
              / Target {balance.targetRecoveryPct.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Collected: {formatCurrency(balance.collectedAmount)}</span>
            <Badge
              variant={balance.recoveryRatePct >= balance.targetRecoveryPct ? 'success' : 'warning'}
              size="xs"
            >
              {balance.recoveryRatePct >= balance.targetRecoveryPct ? 'Ahead of SLA' : 'Behind Pace'}
            </Badge>
          </div>
        </div>

        {/* Account Resolution Progress */}
        <div className="bg-white rounded-lg border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Accounts
            </span>
            <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900">
              {accountCount.active.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">
              of {accountCount.total.toLocaleString()} total
            </span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-emerald-700 font-semibold">{accountCount.resolved} Settled</span>
            <span className="text-indigo-700 font-semibold">{accountCount.inPtp} Active PTPs</span>
          </div>
        </div>

        {/* AI Propensity Score Card */}
        <div className="bg-white rounded-lg border border-slate-200 p-4.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              AI Propensity Score
            </span>
            <div className="w-8 h-8 rounded-md bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-700">
              {aiPropensityScore}
            </span>
            <span className="text-xs font-semibold text-slate-600">/ 100 Likelihood</span>
          </div>
          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Model v3.1 Inference</span>
            <Badge variant="purple" size="xs">High Responsiveness</Badge>
          </div>
        </div>
      </div>

      {/* DPD Distribution Breakdown Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Days Past Due (DPD) Aging Distribution
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Weighted average portfolio aging: <span className="font-mono font-bold text-slate-800">{dpdDistribution.weightedAvgDpd.toFixed(1)} DPD</span> across {dpdDistribution.totalAccounts} active placements.
            </p>
          </div>
          <button
            onClick={onNavigateToAccountsTab}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>View All Delinquency Buckets</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Stacked Visual Bar */}
        <div className="mt-4">
          <div className="h-4 w-full rounded-md overflow-hidden flex shadow-2xs border border-slate-200">
            <div
              style={{ width: `${dpdDistribution.bucket0_30.percentage}%` }}
              className="bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
              title={`1-30 DPD: ${dpdDistribution.bucket0_30.count} accounts (${dpdDistribution.bucket0_30.percentage}%) - ${formatCurrency(dpdDistribution.bucket0_30.balance)}`}
            />
            <div
              style={{ width: `${dpdDistribution.bucket31_60.percentage}%` }}
              className="bg-amber-400 hover:bg-amber-500 transition-colors cursor-pointer"
              title={`31-60 DPD: ${dpdDistribution.bucket31_60.count} accounts (${dpdDistribution.bucket31_60.percentage}%) - ${formatCurrency(dpdDistribution.bucket31_60.balance)}`}
            />
            <div
              style={{ width: `${dpdDistribution.bucket61_90.percentage}%` }}
              className="bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer"
              title={`61-90 DPD: ${dpdDistribution.bucket61_90.count} accounts (${dpdDistribution.bucket61_90.percentage}%) - ${formatCurrency(dpdDistribution.bucket61_90.balance)}`}
            />
            <div
              style={{ width: `${dpdDistribution.bucket91_120.percentage}%` }}
              className="bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer"
              title={`91-120 DPD: ${dpdDistribution.bucket91_120.count} accounts (${dpdDistribution.bucket91_120.percentage}%) - ${formatCurrency(dpdDistribution.bucket91_120.balance)}`}
            />
            <div
              style={{ width: `${dpdDistribution.bucket120Plus.percentage}%` }}
              className="bg-purple-700 hover:bg-purple-800 transition-colors cursor-pointer"
              title={`120+ DPD: ${dpdDistribution.bucket120Plus.count} accounts (${dpdDistribution.bucket120Plus.percentage}%) - ${formatCurrency(dpdDistribution.bucket120Plus.balance)}`}
            />
          </div>

          {/* 5-Bucket Breakdown Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* 1-30 DPD */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-slate-700">1 - 30 DPD</span>
              </div>
              <div className="mt-1.5 text-base font-bold font-mono text-slate-900">
                {dpdDistribution.bucket0_30.count} <span className="text-xs font-normal text-slate-500">accts</span>
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                {formatCurrency(dpdDistribution.bucket0_30.balance)}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">
                {dpdDistribution.bucket0_30.percentage}% of portfolio
              </span>
            </div>

            {/* 31-60 DPD */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-slate-700">31 - 60 DPD</span>
              </div>
              <div className="mt-1.5 text-base font-bold font-mono text-slate-900">
                {dpdDistribution.bucket31_60.count} <span className="text-xs font-normal text-slate-500">accts</span>
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                {formatCurrency(dpdDistribution.bucket31_60.balance)}
              </div>
              <span className="text-[10px] text-amber-700 font-semibold">
                {dpdDistribution.bucket31_60.percentage}% of portfolio
              </span>
            </div>

            {/* 61-90 DPD */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-slate-700">61 - 90 DPD</span>
              </div>
              <div className="mt-1.5 text-base font-bold font-mono text-slate-900">
                {dpdDistribution.bucket61_90.count} <span className="text-xs font-normal text-slate-500">accts</span>
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                {formatCurrency(dpdDistribution.bucket61_90.balance)}
              </div>
              <span className="text-[10px] text-orange-700 font-semibold">
                {dpdDistribution.bucket61_90.percentage}% of portfolio
              </span>
            </div>

            {/* 91-120 DPD */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-slate-700">91 - 120 DPD</span>
              </div>
              <div className="mt-1.5 text-base font-bold font-mono text-slate-900">
                {dpdDistribution.bucket91_120.count} <span className="text-xs font-normal text-slate-500">accts</span>
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                {formatCurrency(dpdDistribution.bucket91_120.balance)}
              </div>
              <span className="text-[10px] text-rose-700 font-semibold">
                {dpdDistribution.bucket91_120.percentage}% of portfolio
              </span>
            </div>

            {/* 120+ DPD */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-700 shrink-0" />
                <span className="text-[11px] font-bold font-mono text-slate-700">120+ DPD / Charge-off</span>
              </div>
              <div className="mt-1.5 text-base font-bold font-mono text-slate-900">
                {dpdDistribution.bucket120Plus.count} <span className="text-xs font-normal text-slate-500">accts</span>
              </div>
              <div className="text-xs font-mono text-slate-600 mt-0.5">
                {formatCurrency(dpdDistribution.bucket120Plus.balance)}
              </div>
              <span className="text-[10px] text-purple-700 font-semibold">
                {dpdDistribution.bucket120Plus.percentage}% of portfolio
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Split: Client Parameters & AI Strategy vs Activity Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Client & Placement Contract Parameters */}
        <div className="space-y-6">
          {/* Client Details Box */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Client & Placement Master Agreement
              </h2>
            </div>

            <div className="mt-3.5 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Creditor / Originator:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <span>{client.name}</span>
                  <Badge variant="purple" size="xs">{client.tierLabel}</Badge>
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Contract Reference:</span>
                <span className="font-mono font-semibold text-slate-800">{client.contractRef}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Placement Date:</span>
                <span className="font-mono text-slate-800">{portfolio.placementDate} (Vintage {portfolio.originationVintage})</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Statute of Limitations:</span>
                <span className="font-mono text-slate-800 flex items-center gap-1 text-emerald-700 font-semibold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expires {statuteOfLimitationsDate}</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Authorized Settlement Discount:</span>
                <span className="font-mono font-bold text-indigo-700">Up to {maxSettlementDiscountPct}% Lump-Sum</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Post-Chargeoff Interest Cap:</span>
                <span className="font-mono text-slate-800">{interestCapPct === 0 ? '0.00% (Non-Accrual)' : `${interestCapPct}% APR`}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Authorized Legal Jurisdictions:</span>
                <span className="font-mono text-slate-800 text-[11px]">{legalJurisdictions.join(', ')}</span>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Compliance Gate:</strong> {complianceGate}</span>
            </div>
          </div>

          {/* AI Strategy Directive */}
          <div className="bg-gradient-to-br from-indigo-50/60 to-white rounded-lg border border-indigo-200 p-5 shadow-xs">
            <div className="flex items-center gap-2 pb-3 border-b border-indigo-100">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Autonomous Propensity Modeling & Cadence Guidance
              </h2>
            </div>
            <p className="mt-3 text-xs text-slate-700 leading-relaxed">
              {aiStrategySummary}
            </p>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-indigo-100/70">
              <div className="flex items-center gap-2 text-xs text-indigo-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>2 Active Automated Campaigns Linked</span>
              </div>
              <button
                onClick={onNavigateToCampaignsTab}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1"
              >
                <span>Manage Campaigns</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Portfolio Activity Milestone Stream */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Portfolio Milestones & Audits
              </h2>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {activityMilestones.length} Events Logged
            </span>
          </div>

          <div className="mt-4 space-y-4 flex-1">
            {activityMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 text-xs space-y-1.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span>{milestone.title}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {milestone.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {milestone.description}
                </p>
                <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Actor: {milestone.actor} ({milestone.actorRole})</span>
                  <Badge variant={milestone.badgeVariant || 'neutral'} size="xs">
                    {milestone.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              onClick={onNavigateToAssignmentsTab}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              View Collector Roster & Allocations
            </button>
            <span className="text-emerald-700 font-mono text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Immutable Ledger Hash Verified</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
