import React from 'react';
import { CampaignItem } from '../../types/campaign';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  MessageSquare,
  Mail,
  AlertTriangle,
  Bot,
  Calendar,
  Lock,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

interface CampaignOverviewTabProps {
  campaign: CampaignItem;
  onNavigateTab: (tabId: any) => void;
}

export const CampaignOverviewTab: React.FC<CampaignOverviewTabProps> = ({
  campaign,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* 4-Card Executive KPI Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Enrolled & Collected */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Enrolled AUM Balance</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            ${campaign.totalEnrolledBalance.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">Recovered to Date:</span>
            <span className="font-bold text-emerald-600">
              ${campaign.totalCollectedBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Card 2: Liquidation Rate vs Target */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Liquidation Yield</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">
              {campaign.liquidationRatePct.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              / {campaign.targetLiquidationRatePct}% Target SLA
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                campaign.liquidationRatePct >= campaign.targetLiquidationRatePct
                  ? 'bg-emerald-500'
                  : 'bg-indigo-600'
              }`}
              style={{
                width: `${Math.min(
                  100,
                  (campaign.liquidationRatePct / (campaign.targetLiquidationRatePct || 1)) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Card 3: Account Funnel Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Enrolled Accounts</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {campaign.totalAccounts.toLocaleString()}
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 text-slate-600">
            <span>{campaign.activeAccounts.toLocaleString()} In Progress</span>
            <span className="font-semibold text-indigo-600">
              {campaign.completedAccounts.toLocaleString()} Resolved
            </span>
          </div>
        </div>

        {/* Card 4: Response & PTP Conversion */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Response & PTP Rate</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {campaign.responseRatePct.toFixed(1)}%
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500">PTP Conversion:</span>
            <span className="font-bold text-slate-800">
              {campaign.ptpConversionRatePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Stage Progression Pipeline Summary Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Stage Progression Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live distribution of active debt claims advancing through automated workflow stages.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('stages')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start sm:self-center"
          >
            <span>View Full Pipeline Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Multi-Segment Stage Bar */}
        <div className="space-y-2">
          <div className="flex h-4 w-full rounded-lg overflow-hidden gap-1 bg-slate-100 p-0.5">
            {campaign.stages.map((stg, idx) => {
              const weight = Math.max(10, (stg.activeAccountsCount / (campaign.totalAccounts || 1)) * 100);
              const colorBg =
                idx === 0
                  ? 'bg-blue-500'
                  : idx === 1
                  ? 'bg-indigo-500'
                  : idx === 2
                  ? 'bg-purple-500'
                  : idx === 3
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              return (
                <div
                  key={stg.id}
                  style={{ flex: `${weight} 0 0%` }}
                  className={`h-full rounded transition-all ${colorBg} relative group cursor-pointer`}
                  title={`${stg.name}: ${stg.activeAccountsCount} accounts (${stg.progressedRatePct}% through)`}
                />
              );
            })}
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
            {campaign.stages.map((stg, idx) => {
              const dotColor =
                idx === 0
                  ? 'bg-blue-500'
                  : idx === 1
                  ? 'bg-indigo-500'
                  : idx === 2
                  ? 'bg-purple-500'
                  : idx === 3
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              return (
                <div
                  key={stg.id}
                  onClick={() => onNavigateTab('stages')}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-1"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span className="text-[11px] font-bold text-slate-800 truncate">
                      Stage {stg.order}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{stg.channelLabel}</p>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60 font-semibold">
                    <span className="text-slate-700">{stg.activeAccountsCount} Accts</span>
                    <span className="text-indigo-600">{stg.dwellTimeDays}d dwell</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Cadence Parameters & Safety Guardrails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cadence & Strategy Configuration (2 cols) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Campaign Execution Cadence & Persona
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live & Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                CFPB Regulation F Guardrail
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                7-in-7 Frequency Hard Ceiling
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Max 7 telephone calls placed per rolling 7-day window per placed debt claim.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Permissible Calling Window
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                {campaign.complianceCadence.callingWindow}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Dynamic time zone resolution based on debtor area code and verified postal address.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Autonomous AI Voice Persona
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-600" />
                {campaign.complianceCadence.aiVoicePersona}
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                High-fidelity LLM conversational engine with latency &lt; 350ms and seamless collector transfer.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Settlement Authority Matrix
              </span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Up to {campaign.complianceCadence.settlementAuthorityCapPct.toFixed(1)}% Discount Cap
              </p>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pre-authorized client MSA cap for 1-click lump sum and multi-pay settlement execution.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Automated Stage Progression Active:</span> Debtor claims automatically step forward through configured stages upon reaching dwell-time expiration or triggering behavioral event rules (e.g. email opened, non-PTP call disposition).
            </div>
          </div>
        </div>

        {/* Right Column: Campaign Audit & Health (1 col) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Compliance & Audit Health
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/70">
              <span className="font-semibold text-emerald-900">FDCPA 7-in-7 Violations</span>
              <span className="font-bold text-emerald-700">0 (100% Clean)</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-600">TCPA Window Compliance</span>
              <span className="font-bold text-slate-900">
                {campaign.performance.complianceStats.tcpaWindowCompliancePct.toFixed(1)}%
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Opt-Out / DNC Requests</span>
              <span className="font-bold text-slate-900">
                {campaign.performance.complianceStats.optOutRequests} ({campaign.performance.complianceStats.optOutRatePct}%)
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Dispute Escalations</span>
              <span className="font-bold text-slate-900">
                {campaign.performance.complianceStats.disputeTransfers} cases
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Recent Operational Log
            </span>
            <div className="space-y-2">
              {campaign.activityLog.slice(0, 3).map((act) => (
                <div key={act.id} className="text-xs space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-800">{act.action}</span>
                    <span className="text-slate-400 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{act.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
