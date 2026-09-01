import React from 'react';
import { CampaignItem } from '../../types/campaign';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  ArrowDown,
  Check,
} from 'lucide-react';

interface CampaignPerformanceTabProps {
  campaign: CampaignItem;
}

export const CampaignPerformanceTab: React.FC<CampaignPerformanceTabProps> = ({ campaign }) => {
  const { performance } = campaign;
  const { funnel } = performance;

  const funnelSteps = [
    { label: '1. Enrolled AUM Claims', count: funnel.enrolled, pct: 100, color: 'bg-slate-700' },
    {
      label: '2. Contact Reached',
      count: funnel.contacted,
      pct: funnel.enrolled > 0 ? (funnel.contacted / funnel.enrolled) * 100 : 0,
      color: 'bg-blue-600',
    },
    {
      label: '3. Engaged / Responded',
      count: funnel.engaged,
      pct: funnel.enrolled > 0 ? (funnel.engaged / funnel.enrolled) * 100 : 0,
      color: 'bg-indigo-600',
    },
    {
      label: '4. Settlement Offered',
      count: funnel.settlementOffered,
      pct: funnel.enrolled > 0 ? (funnel.settlementOffered / funnel.enrolled) * 100 : 0,
      color: 'bg-purple-600',
    },
    {
      label: '5. PTP Secured',
      count: funnel.ptpSecured,
      pct: funnel.enrolled > 0 ? (funnel.ptpSecured / funnel.enrolled) * 100 : 0,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Campaign Recovery Telemetry & Funnel Conversion
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Multi-channel conversion yield, vintage liquidation benchmarks, and compliance audit statistics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              Total Cash Collected: ${funnel.cashCollected.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Contact Reach Rate
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {campaign.contactRatePct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500">Debtors reached via voice/SMS</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Response / Engagement
            </span>
            <span className="text-base font-bold text-purple-700 mt-0.5 block">
              {campaign.responseRatePct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-500">Clicked link or spoke with AI</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              PTP Conversion
            </span>
            <span className="text-base font-bold text-emerald-700 mt-0.5 block">
              {campaign.ptpConversionRatePct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-emerald-600">Of contacted debtors committed</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Liquidation Yield
            </span>
            <span className="text-base font-bold text-indigo-700 mt-0.5 block">
              {campaign.liquidationRatePct.toFixed(1)}%
            </span>
            <span className="text-[10px] text-indigo-600">Target SLA: {campaign.targetLiquidationRatePct}%</span>
          </div>
        </div>
      </div>

      {/* Conversion Funnel Waterfall */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          End-to-End Campaign Conversion Waterfall
        </h3>

        <div className="space-y-3 pt-2">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{step.label}</span>
                <span className="text-slate-900 font-mono">
                  {step.count.toLocaleString()} Accounts ({step.pct.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${step.color}`}
                  style={{ width: `${Math.max(2, step.pct)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Channel Breakdown & Hourly Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Channel Breakdown Matrix */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-indigo-600" />
            Channel Effectiveness Matrix
          </h3>

          <div className="space-y-2.5">
            {performance.channelBreakdown.map((ch, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">{ch.channel}</span>
                  <span className="text-[11px] text-slate-500">
                    {ch.touches.toLocaleString()} Touches • {ch.responses.toLocaleString()} Responses
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="font-bold text-emerald-600 text-sm block">
                    +${ch.collected.toLocaleString()}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {ch.responseRatePct.toFixed(1)}% Response
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Response Heatmap */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Optimal Debtor Response Windows
          </h3>

          <div className="space-y-2.5">
            {performance.hourlyEngagementHeatmap.map((h, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-800">{h.hour}</span>
                  <span className="text-indigo-700 font-bold">{h.responsePct.toFixed(1)}% Response</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{ width: `${h.responsePct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{h.contacts.toLocaleString()} Contacts Placed</span>
                  <span>TCPA Permissible Window Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
