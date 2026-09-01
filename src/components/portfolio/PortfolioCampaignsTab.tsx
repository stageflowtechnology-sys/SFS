import React, { useState } from 'react';
import { PortfolioItem, PortfolioCampaignSummary } from '../../types/portfolio';
import { Badge } from '../ui/Badge';
import {
  Megaphone,
  PhoneCall,
  MessageSquare,
  Mail,
  Scale,
  Sparkles,
  Play,
  Pause,
  Plus,
  Users,
  CheckCircle2,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface PortfolioCampaignsTabProps {
  portfolio: PortfolioItem;
}

export const PortfolioCampaignsTab: React.FC<PortfolioCampaignsTabProps> = ({
  portfolio,
}) => {
  const [campaigns, setCampaigns] = useState<PortfolioCampaignSummary[]>(
    portfolio.campaigns
  );
  const [activeToast, setActiveToast] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const toggleCampaignStatus = (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const nextStatus = c.status === 'RUNNING' ? 'PAUSED' : 'RUNNING';
          setActiveToast(`Campaign "${c.name}" status updated to ${nextStatus}`);
          setTimeout(() => setActiveToast(null), 3000);
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'VOICE_AI':
        return <PhoneCall className="w-4 h-4 text-purple-600" />;
      case 'OMNICHANNEL_SMS':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      case 'EMAIL_SERIES':
        return <Mail className="w-4 h-4 text-emerald-600" />;
      case 'LEGAL_NOTICE':
        return <Scale className="w-4 h-4 text-amber-600" />;
      default:
        return <Megaphone className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getChannelLabel = (channel: string) => {
    switch (channel) {
      case 'VOICE_AI':
        return 'Autonomous Voice AI';
      case 'OMNICHANNEL_SMS':
        return 'SMS + Mobile Wallet';
      case 'EMAIL_SERIES':
        return 'Email Settlement Series';
      case 'LEGAL_NOTICE':
        return 'Statutory Demand Notice';
      default:
        return 'Multi-Touch Omnichannel';
    }
  };

  // Calculate campaign rollups
  const totalEnrolled = campaigns.reduce((acc, c) => acc + c.enrolledAccounts, 0);
  const totalCollectedViaCampaigns = campaigns.reduce((acc, c) => acc + c.collectedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Summary */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Active Portfolio Engagement & Outreach Sequences
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Automated communication cadence configured under CFPB Reg-F call limits (7 calls in 7 days) and digital-first opt-in compliance.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-400 block font-semibold">Enrolled In Cadence</span>
            <span className="text-sm font-bold text-slate-900">{totalEnrolled} Accounts</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] uppercase text-emerald-600 block font-semibold">Campaign Recoveries</span>
            <span className="text-sm font-bold text-emerald-800">{formatCurrency(totalCollectedViaCampaigns)}</span>
          </div>
        </div>
      </div>

      {activeToast && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          <span>{activeToast}</span>
        </div>
      )}

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  {getChannelIcon(campaign.channel)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{campaign.name}</h3>
                    <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      {campaign.code}
                    </span>
                    <Badge
                      variant={campaign.status === 'RUNNING' ? 'success' : campaign.status === 'PAUSED' ? 'warning' : 'neutral'}
                      size="xs"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">{getChannelLabel(campaign.channel)}</span>
                    <span>•</span>
                    <span>Launched {campaign.startDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => toggleCampaignStatus(campaign.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors shadow-2xs ${
                    campaign.status === 'RUNNING'
                      ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  {campaign.status === 'RUNNING' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Campaign</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Resume Cadence</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Campaign Cadence Description */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Cadence Architecture:</span>
                <span className="text-slate-600 mt-0.5 block">{campaign.cadenceDescription}</span>
              </div>
            </div>

            {/* 4 Performance Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">
                  Enrolled Accounts
                </span>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                  {campaign.enrolledAccounts}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Targeted in cohort</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">
                  Contact / Delivery Rate
                </span>
                <div className="text-base font-bold font-mono text-indigo-700 mt-0.5">
                  {campaign.contactRatePct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Above standard benchmark</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">
                  PTP Conversion %
                </span>
                <div className="text-base font-bold font-mono text-purple-700 mt-0.5">
                  {campaign.ptpConversionRatePct.toFixed(1)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Promise agreed</div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 font-mono">
                  Collected Yield
                </span>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                  {formatCurrency(campaign.collectedAmount)}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Cash cleared via rail</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
