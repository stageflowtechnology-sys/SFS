import React, { useState, useMemo } from 'react';
import { PortfolioItem, PortfolioStatus, AssetClass } from '../../types/portfolio';
import { SearchInput } from '../ui/SearchInput';
import { Badge } from '../ui/Badge';
import {
  FolderTree,
  Building,
  DollarSign,
  Users,
  TrendingUp,
  Megaphone,
  BarChart2,
  SlidersHorizontal,
  FolderPlus,
  ArrowRight,
  Sparkles,
  LayoutGrid,
  List,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';

interface PortfolioListProps {
  portfolios: PortfolioItem[];
  onSelectPortfolio: (portfolioId: string) => void;
  onOpenIntakeModal: () => void;
}

export const PortfolioList: React.FC<PortfolioListProps> = ({
  portfolios,
  onSelectPortfolio,
  onOpenIntakeModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedAssetClass, setSelectedAssetClass] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  // Filter portfolios
  const filteredPortfolios = useMemo(() => {
    return portfolios.filter((pf) => {
      // Search
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = pf.name.toLowerCase().includes(term);
        const matchesCode = pf.code.toLowerCase().includes(term);
        const matchesClient = pf.client.name.toLowerCase().includes(term);
        if (!matchesName && !matchesCode && !matchesClient) return false;
      }

      // Client
      if (selectedClient !== 'ALL' && pf.client.id !== selectedClient) {
        return false;
      }

      // Status
      if (selectedStatus !== 'ALL' && pf.status !== selectedStatus) {
        return false;
      }

      // Asset Class
      if (selectedAssetClass !== 'ALL' && pf.assetClass !== selectedAssetClass) {
        return false;
      }

      return true;
    });
  }, [portfolios, searchTerm, selectedClient, selectedStatus, selectedAssetClass]);

  // Aggregate Metrics
  const totalBalance = portfolios.reduce((acc, p) => acc + p.balance.currentActiveBalance, 0);
  const totalFaceValue = portfolios.reduce((acc, p) => acc + p.balance.originalFaceValue, 0);
  const totalCollected = portfolios.reduce((acc, p) => acc + p.balance.collectedAmount, 0);
  const totalActiveAccounts = portfolios.reduce((acc, p) => acc + p.accountCount.active, 0);
  const blendedRecoveryRate = totalFaceValue > 0 ? (totalCollected / totalFaceValue) * 100 : 0;
  const totalCampaigns = portfolios.reduce((acc, p) => acc + p.campaigns.length, 0);
  const uniqueCollectors = new Set(
    portfolios.flatMap((p) => p.collectors.map((c) => c.operatorId))
  ).size;

  // Extract unique clients
  const uniqueClients = useMemo(() => {
    const map = new Map<string, string>();
    portfolios.forEach((p) => map.set(p.client.id, p.client.name));
    return Array.from(map.entries());
  }, [portfolios]);

  const getStatusBadgeVariant = (status: PortfolioStatus) => {
    switch (status) {
      case 'PACING_AHEAD':
        return 'success';
      case 'ACTIVE':
        return 'primary';
      case 'UNDERPERFORMING':
        return 'warning';
      case 'PAUSED':
        return 'neutral';
      case 'SETTLED':
        return 'success';
      case 'AUDITING':
        return 'purple';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Active AUM */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active AUM Balance
            </span>
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900">
            {formatCurrency(totalBalance)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Face: {formatCurrency(totalFaceValue)}
          </div>
        </div>

        {/* Active Placement Accounts */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Active Accounts
            </span>
            <Users className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900">
            {totalActiveAccounts.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">
            Across {portfolios.length} tranches
          </div>
        </div>

        {/* Blended Recovery Rate */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Blended Yield
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1.5 text-xl font-bold font-mono text-emerald-700">
            {blendedRecoveryRate.toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">
            Collected: {formatCurrency(totalCollected)}
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Linked Campaigns
            </span>
            <Megaphone className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900">
            {totalCampaigns} Sequences
          </div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-1">
            Voice AI + Omnichannel SMS
          </div>
        </div>

        {/* Deployed Collectors */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Deployed Operators
            </span>
            <Users className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="mt-1.5 text-xl font-bold font-mono text-slate-900">
            {uniqueCollectors} Specialists
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>100% FDCPA Licensed</span>
          </div>
        </div>
      </div>

      {/* Control Strip: Search, Dropdowns, View Switcher & Intake Action */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search portfolios by name, code, or client..."
            isFullWidth
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Client filter */}
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Clients</option>
            {uniqueClients.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PACING_AHEAD">Pacing Ahead</option>
            <option value="UNDERPERFORMING">Underperforming</option>
            <option value="AUDITING">Auditing</option>
            <option value="PAUSED">Paused</option>
          </select>

          {/* Asset class filter */}
          <select
            value={selectedAssetClass}
            onChange={(e) => setSelectedAssetClass(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Asset Classes</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="AUTO_LOAN">Auto Loan</option>
            <option value="PERSONAL_INSTALLMENT">Personal Installment</option>
            <option value="MEDICAL_HEALTHCARE">Medical / Healthcare</option>
            <option value="COMMERCIAL_SMB">Commercial & SMB</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5 ml-1">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`p-1 rounded transition-colors ${
                viewMode === 'CARDS' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* New Ingestion Button */}
          <button
            onClick={onOpenIntakeModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-2xs ml-auto transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Ingest Tranche</span>
          </button>
        </div>
      </div>

      {/* Main List Display: Table or Card Grid */}
      {viewMode === 'TABLE' ? (
        /* Master Table Display */
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500 select-none">
                  <th className="py-3 px-3.5">Portfolio & Asset Class</th>
                  <th className="py-3 px-3.5">Client & Tier</th>
                  <th className="py-3 px-3.5">Account Count</th>
                  <th className="py-3 px-3.5">Balance & Yield</th>
                  <th className="py-3 px-3.5 min-w-[160px]">DPD Distribution</th>
                  <th className="py-3 px-3.5">Campaigns</th>
                  <th className="py-3 px-3.5">Collectors</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPortfolios.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 italic">
                      No portfolios matching the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPortfolios.map((portfolio) => {
                    const dpd = portfolio.dpdDistribution;
                    return (
                      <tr
                        key={portfolio.id}
                        onClick={() => onSelectPortfolio(portfolio.id)}
                        className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                      >
                        {/* Portfolio */}
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-slate-900 text-sm">
                            {portfolio.name}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono font-semibold text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                              {portfolio.code}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {portfolio.assetClassLabel}
                            </span>
                          </div>
                        </td>

                        {/* Client */}
                        <td className="py-3 px-3.5">
                          <div className="font-semibold text-slate-900">
                            {portfolio.client.name}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {portfolio.client.tierLabel}
                          </div>
                        </td>

                        {/* Account Count */}
                        <td className="py-3 px-3.5">
                          <div className="font-mono font-bold text-slate-900">
                            {portfolio.accountCount.active.toLocaleString()}{' '}
                            <span className="text-slate-400 font-normal text-[11px]">
                              / {portfolio.accountCount.total.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                            {portfolio.accountCount.resolved} resolved ({portfolio.accountCount.inPtp} PTP)
                          </div>
                        </td>

                        {/* Balance & Yield */}
                        <td className="py-3 px-3.5">
                          <div className="font-mono font-bold text-slate-900 text-sm">
                            {formatCurrency(portfolio.balance.currentActiveBalance)}
                          </div>
                          <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-0.5">
                            {portfolio.balance.recoveryRatePct.toFixed(1)}% yield (${formatCurrency(portfolio.balance.collectedAmount)} rec)
                          </div>
                        </td>

                        {/* DPD Distribution Visual Bar */}
                        <td className="py-3 px-3.5">
                          <div className="w-full">
                            <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                              <div
                                style={{ width: `${dpd.bucket0_30.percentage}%` }}
                                className="bg-emerald-500"
                                title={`1-30 DPD: ${dpd.bucket0_30.percentage}%`}
                              />
                              <div
                                style={{ width: `${dpd.bucket31_60.percentage}%` }}
                                className="bg-amber-400"
                                title={`31-60 DPD: ${dpd.bucket31_60.percentage}%`}
                              />
                              <div
                                style={{ width: `${dpd.bucket61_90.percentage}%` }}
                                className="bg-orange-500"
                                title={`61-90 DPD: ${dpd.bucket61_90.percentage}%`}
                              />
                              <div
                                style={{ width: `${dpd.bucket91_120.percentage}%` }}
                                className="bg-rose-500"
                                title={`91-120 DPD: ${dpd.bucket91_120.percentage}%`}
                              />
                              <div
                                style={{ width: `${dpd.bucket120Plus.percentage}%` }}
                                className="bg-purple-700"
                                title={`120+ DPD: ${dpd.bucket120Plus.percentage}%`}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                              <span>Avg {dpd.weightedAvgDpd.toFixed(0)} DPD</span>
                              <span className="text-slate-400">5 Buckets</span>
                            </div>
                          </div>
                        </td>

                        {/* Campaigns */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center gap-1 flex-wrap">
                            {portfolio.campaigns.slice(0, 2).map((c) => (
                              <Badge key={c.id} variant="purple" size="xs">
                                {c.channel === 'VOICE_AI' ? 'Voice AI' : c.channel === 'OMNICHANNEL_SMS' ? 'SMS Link' : 'Omnichannel'}
                              </Badge>
                            ))}
                            {portfolio.campaigns.length > 2 && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                +{portfolio.campaigns.length - 2}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {portfolio.campaigns.length} Active Sequences
                          </div>
                        </td>

                        {/* Collectors */}
                        <td className="py-3 px-3.5">
                          <div className="flex items-center -space-x-1.5 overflow-hidden">
                            {portfolio.collectors.map((c) => (
                              <div
                                key={c.id}
                                className="inline-block h-6 w-6 rounded-full bg-indigo-600 text-white ring-2 ring-white font-bold text-[10px] flex items-center justify-center shadow-2xs"
                                title={`${c.name} (${c.operatorId}) - ${c.role}`}
                              >
                                {c.avatarInitials}
                              </div>
                            ))}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {portfolio.collectors.length} assigned
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-3.5">
                          <Badge variant={getStatusBadgeVariant(portfolio.status)} size="xs">
                            {portfolio.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectPortfolio(portfolio.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 font-semibold text-xs transition-colors shadow-2xs"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Bento Grid Card Display */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPortfolios.map((portfolio) => {
            const dpd = portfolio.dpdDistribution;
            return (
              <div
                key={portfolio.id}
                onClick={() => onSelectPortfolio(portfolio.id)}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between space-y-4"
              >
                {/* Card Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {portfolio.code}
                    </span>
                    <Badge variant={getStatusBadgeVariant(portfolio.status)} size="xs">
                      {portfolio.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-tight">
                    {portfolio.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{portfolio.client.name}</span>
                    <span>•</span>
                    <span className="font-mono">{portfolio.originationVintage}</span>
                  </div>
                </div>

                {/* Financial & Volume Metrics */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                      Active Balance
                    </span>
                    <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
                      {formatCurrency(portfolio.balance.currentActiveBalance)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Face: {formatCurrency(portfolio.balance.originalFaceValue)}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold block">
                      Liquidation Yield
                    </span>
                    <div className="text-base font-bold font-mono text-emerald-700 mt-0.5">
                      {portfolio.balance.recoveryRatePct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {portfolio.accountCount.active} active accts
                    </div>
                  </div>
                </div>

                {/* DPD Visual Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>DPD Aging Spread</span>
                    <span>Avg {dpd.weightedAvgDpd.toFixed(0)} DPD</span>
                  </div>
                  <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-100 border border-slate-200">
                    <div style={{ width: `${dpd.bucket0_30.percentage}%` }} className="bg-emerald-500" />
                    <div style={{ width: `${dpd.bucket31_60.percentage}%` }} className="bg-amber-400" />
                    <div style={{ width: `${dpd.bucket61_90.percentage}%` }} className="bg-orange-500" />
                    <div style={{ width: `${dpd.bucket91_120.percentage}%` }} className="bg-rose-500" />
                    <div style={{ width: `${dpd.bucket120Plus.percentage}%` }} className="bg-purple-700" />
                  </div>
                </div>

                {/* Footer Strip: Campaigns, Collectors, Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center -space-x-1.5">
                      {portfolio.collectors.slice(0, 3).map((c) => (
                        <div
                          key={c.id}
                          className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center ring-1 ring-white"
                        >
                          {c.avatarInitials}
                        </div>
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {portfolio.campaigns.length} campaigns
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 font-bold text-indigo-700 group-hover:text-indigo-900">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
