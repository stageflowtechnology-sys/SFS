import React, { useState, useMemo } from 'react';
import { CampaignItem, CampaignStatus, CampaignChannel } from '../../types/campaign';
import {
  Megaphone,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Archive,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  AlertCircle,
  FileText,
  DollarSign,
  FolderTree,
} from 'lucide-react';

interface CampaignListProps {
  campaigns: CampaignItem[];
  onSelectCampaign: (id: string) => void;
  onOpenNewCampaignModal: () => void;
  onToggleState: (id: string, newState: CampaignStatus) => void;
  showToast: (msg: string) => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onSelectCampaign,
  onOpenNewCampaignModal,
  onToggleState,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<CampaignStatus | 'ALL'>('ALL');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<CampaignChannel | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'GRID'>('TABLE');

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      const matchesSearch =
        camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        camp.portfolios.some((p) => p.portfolioName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatusFilter === 'ALL' || camp.status === selectedStatusFilter;

      const matchesChannel =
        selectedChannelFilter === 'ALL' || camp.channels.includes(selectedChannelFilter);

      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [campaigns, searchQuery, selectedStatusFilter, selectedChannelFilter]);

  // Aggregate Metrics
  const aggregateMetrics = useMemo(() => {
    const totalEnrolled = campaigns.reduce((sum, c) => sum + c.totalEnrolledBalance, 0);
    const totalRecovered = campaigns.reduce((sum, c) => sum + c.totalCollectedBalance, 0);
    const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
    const totalAccounts = campaigns.reduce((sum, c) => sum + c.totalAccounts, 0);
    const avgLiquidation = totalEnrolled > 0 ? (totalRecovered / totalEnrolled) * 100 : 0;

    return {
      totalEnrolled,
      totalRecovered,
      activeCount,
      totalAccounts,
      avgLiquidation,
    };
  }, [campaigns]);

  // Status Badge Helper
  const renderStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-dashed border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            DRAFT
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Pause className="w-3 h-3 text-amber-600" />
            PAUSED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            COMPLETED
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            <Archive className="w-3 h-3 text-slate-400" />
            ARCHIVED
          </span>
        );
    }
  };

  // Channel Icon Helper
  const renderChannelIcon = (ch: CampaignChannel) => {
    switch (ch) {
      case 'VOICE':
        return <Phone className="w-3.5 h-3.5 text-indigo-600" title="Voice AI Dialing" />;
      case 'SMS':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" title="Interactive SMS Portal" />;
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-blue-600" title="Email Validation e-Notice" />;
      case 'MAIL':
        return <FileText className="w-3.5 h-3.5 text-rose-600" title="Certified Postal Mail" />;
      case 'AGENT':
        return <UserCheck className="w-3.5 h-3.5 text-amber-600" title="Senior Collector Work Queue" />;
    }
  };

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
              <Megaphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Outreach Campaigns & Cadences
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {campaigns.length} Total Sequences
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Automated omnichannel recovery sequences, autonomous conversational Voice AI dialers, and CFPB Regulation F compliant stage transitions across enrolled debt tranches.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start lg:self-center">
            <button
              onClick={onOpenNewCampaignModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Enrolled AUM
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              ${aggregateMetrics.totalEnrolled.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Across {campaigns.length} campaigns
            </span>
          </div>

          <div className="bg-emerald-50/50 rounded-lg p-3 border border-emerald-200/60">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              Total Recovered
            </span>
            <span className="text-base font-bold text-emerald-700 mt-0.5 block">
              ${aggregateMetrics.totalRecovered.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 mt-0.5 block">
              {aggregateMetrics.avgLiquidation.toFixed(1)}% liquidation yield
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Active Cadences
            </span>
            <span className="text-base font-bold text-indigo-700 mt-0.5 block">
              {aggregateMetrics.activeCount} Active
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              {campaigns.filter((c) => c.status === 'PAUSED').length} Paused | {campaigns.filter((c) => c.status === 'DRAFT').length} Drafts
            </span>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200/70">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Enrolled Accounts
            </span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              {aggregateMetrics.totalAccounts.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Debtor records in funnel
            </span>
          </div>

          <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-200/60 col-span-2 md:col-span-1">
            <span className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Statutory Safeguard
            </span>
            <span className="text-base font-bold text-blue-700 mt-0.5 block">
              100% Reg-F
            </span>
            <span className="text-[10px] text-blue-600 mt-0.5 block">
              0 7-in-7 frequency violations
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campaigns, codes, portfolios, or audience..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80 overflow-x-auto">
            {(['ALL', 'ACTIVE', 'DRAFT', 'PAUSED', 'COMPLETED', 'ARCHIVED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  selectedStatusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All States' : st}
                <span className="ml-1 text-[10px] text-slate-400">
                  (
                  {st === 'ALL'
                    ? campaigns.length
                    : campaigns.filter((c) => c.status === st).length}
                  )
                </span>
              </button>
            ))}
          </div>

          {/* Channel Dropdown */}
          <select
            value={selectedChannelFilter}
            onChange={(e) => setSelectedChannelFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="ALL">All Channels</option>
            <option value="VOICE">Voice AI</option>
            <option value="SMS">Interactive SMS</option>
            <option value="EMAIL">Email e-Notice</option>
            <option value="AGENT">Senior Collector</option>
            <option value="MAIL">Certified Mail</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 self-end md:self-auto">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'TABLE'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="High Density Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('GRID')}
            className={`p-1.5 rounded-md transition-all ${
              viewMode === 'GRID'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Bento Card Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Campaign List Output */}
      {filteredCampaigns.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No matching campaigns found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No campaigns matched your active search query or filter filters. Try resetting the filters or create a new campaign cadence.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedStatusFilter('ALL');
              setSelectedChannelFilter('ALL');
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'TABLE' ? (
        /* High Density Table Ledger View */
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Campaign & Code</th>
                  <th className="py-3 px-4">State</th>
                  <th className="py-3 px-4">Enrolled Portfolios</th>
                  <th className="py-3 px-4 text-right">Accounts</th>
                  <th className="py-3 px-4 text-right">Enrolled / Collected</th>
                  <th className="py-3 px-4 text-center">Liquidation</th>
                  <th className="py-3 px-4">Channels & Stages</th>
                  <th className="py-3 px-4 text-center">Cadence / Compliance</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredCampaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    onClick={() => onSelectCampaign(camp.id)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Name & Code */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {camp.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                          <span>{camp.code}</span>
                          <span>•</span>
                          <span className="text-slate-600">{camp.typeLabel}</span>
                        </div>
                      </div>
                    </td>

                    {/* State */}
                    <td className="py-3.5 px-4">{renderStatusBadge(camp.status)}</td>

                    {/* Portfolios */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <FolderTree className="w-3.5 h-3.5 text-slate-400" />
                          <span>{camp.enrolledPortfoliosCount} Portfolio{camp.enrolledPortfoliosCount !== 1 ? 's' : ''}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {camp.portfolios.map((p) => p.portfolioName).join(', ') || 'No portfolios linked'}
                        </p>
                      </div>
                    </td>

                    {/* Accounts Count */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900">
                          {camp.totalAccounts.toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-500">
                          {camp.activeAccounts.toLocaleString()} active
                        </p>
                      </div>
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900">
                          ${camp.totalEnrolledBalance.toLocaleString()}
                        </span>
                        <p className="text-[11px] font-semibold text-emerald-600">
                          +${camp.totalCollectedBalance.toLocaleString()} paid
                        </p>
                      </div>
                    </td>

                    {/* Liquidation % */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-between w-24 text-[11px] font-semibold">
                          <span className="text-slate-800">{camp.liquidationRatePct.toFixed(1)}%</span>
                          <span className="text-[10px] text-slate-400">/{camp.targetLiquidationRatePct}%</span>
                        </div>
                        <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              camp.liquidationRatePct >= camp.targetLiquidationRatePct
                                ? 'bg-emerald-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (camp.liquidationRatePct / (camp.targetLiquidationRatePct || 1)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Channels & Stages */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {camp.channels.map((ch, idx) => (
                            <span
                              key={idx}
                              className="p-1 rounded bg-slate-100 border border-slate-200/80"
                            >
                              {renderChannelIcon(ch)}
                            </span>
                          ))}
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold">
                          {camp.stages.length} Workflow Stage{camp.stages.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </td>

                    {/* Cadence / Compliance */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          CFPB 7-in-7 Active
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {camp.complianceCadence.callingWindow.split(' ')[0]} - {camp.complianceCadence.callingWindow.split(' ')[2]}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {camp.status === 'ACTIVE' ? (
                          <button
                            onClick={() => onToggleState(camp.id, 'PAUSED')}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                            title="Pause Active Campaign"
                          >
                            <Pause className="w-3.5 h-3.5" />
                          </button>
                        ) : camp.status === 'PAUSED' ? (
                          <button
                            onClick={() => onToggleState(camp.id, 'ACTIVE')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Resume Campaign"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        ) : camp.status === 'DRAFT' ? (
                          <button
                            onClick={() => onToggleState(camp.id, 'ACTIVE')}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Launch Campaign"
                          >
                            <Play className="w-3.5 h-3.5" />
                          </button>
                        ) : null}

                        <button
                          onClick={() => onSelectCampaign(camp.id)}
                          className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 rounded-md font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bento Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCampaigns.map((camp) => (
            <div
              key={camp.id}
              onClick={() => onSelectCampaign(camp.id)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                      {camp.code}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {camp.name}
                    </h3>
                  </div>
                  {renderStatusBadge(camp.status)}
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {camp.description}
                </p>

                {/* Portfolios Enrolled */}
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <FolderTree className="w-3 h-3 text-slate-400" />
                      Enrolled Portfolios ({camp.enrolledPortfoliosCount})
                    </span>
                    <span className="font-bold text-slate-800">
                      {camp.totalAccounts.toLocaleString()} Accts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    {camp.portfolios.map((p) => p.portfolioName).join(', ') || 'None attached'}
                  </p>
                </div>

                {/* Progress & Liquidation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-600">
                      Collected: <strong className="text-emerald-700">${camp.totalCollectedBalance.toLocaleString()}</strong>
                    </span>
                    <span className="text-slate-800 font-bold">
                      {camp.liquidationRatePct.toFixed(1)}% <span className="text-[10px] text-slate-400">/ {camp.targetLiquidationRatePct}%</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        camp.liquidationRatePct >= camp.targetLiquidationRatePct
                          ? 'bg-emerald-500'
                          : 'bg-indigo-600'
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (camp.liquidationRatePct / (camp.targetLiquidationRatePct || 1)) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Enrolled: ${camp.totalEnrolledBalance.toLocaleString()}</span>
                    <span>{camp.activeAccounts} Active / {camp.completedAccounts} Done</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {camp.channels.map((ch, idx) => (
                    <span
                      key={idx}
                      className="p-1 rounded bg-slate-100 border border-slate-200/80"
                    >
                      {renderChannelIcon(ch)}
                    </span>
                  ))}
                  <span className="text-[11px] text-slate-500 font-semibold ml-1">
                    {camp.stages.length} Stages
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
