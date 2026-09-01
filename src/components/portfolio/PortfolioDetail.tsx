import React, { useState } from 'react';
import { PortfolioItem, PortfolioDetailTabId, PortfolioAccountItem, PortfolioCollectorSummary } from '../../types/portfolio';
import { PortfolioOverviewTab } from './PortfolioOverviewTab';
import { PortfolioAccountsTab } from './PortfolioAccountsTab';
import { PortfolioCampaignsTab } from './PortfolioCampaignsTab';
import { PortfolioAssignmentsTab } from './PortfolioAssignmentsTab';
import { PortfolioPerformanceTab } from './PortfolioPerformanceTab';
import { AccountQuickDrawer } from './AccountQuickDrawer';
import { AssignCollectorsModal } from './AssignCollectorsModal';
import { Tabs, TabItem } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import {
  ArrowLeft,
  LayoutDashboard,
  CreditCard,
  Megaphone,
  Users,
  TrendingUp,
  SlidersHorizontal,
  Download,
  RefreshCw,
  Sparkles,
  Building,
  CheckCircle2,
  Calendar,
  Share2,
} from 'lucide-react';

interface PortfolioDetailProps {
  portfolio: PortfolioItem;
  onBack: () => void;
  onNavigateToWorkbench?: (accountId: string) => void;
  onUpdatePortfolio?: (updated: PortfolioItem) => void;
}

export const PortfolioDetail: React.FC<PortfolioDetailProps> = ({
  portfolio,
  onBack,
  onNavigateToWorkbench,
  onUpdatePortfolio,
}) => {
  const [activeTab, setActiveTab] = useState<PortfolioDetailTabId>('overview');
  const [selectedQuickAccount, setSelectedQuickAccount] = useState<PortfolioAccountItem | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Portfolio ledger cryptographically reconciled with client core banking rail');
    }, 1000);
  };

  const handleSaveCollectors = (collectors: PortfolioCollectorSummary[]) => {
    const updated = { ...portfolio, collectors };
    if (onUpdatePortfolio) onUpdatePortfolio(updated);
    showToast('Updated assigned operator allocations');
  };

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'accounts',
      label: 'Accounts',
      count: portfolio.accounts.length,
      icon: <CreditCard className="w-3.5 h-3.5" />,
    },
    {
      id: 'campaigns',
      label: 'Campaigns',
      count: portfolio.campaigns.length,
      icon: <Megaphone className="w-3.5 h-3.5" />,
    },
    {
      id: 'assignments',
      label: 'Assignments',
      count: portfolio.collectors.length,
      icon: <Users className="w-3.5 h-3.5" />,
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
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
      {/* Detail Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        {/* Navigation Breadcrumb back to List */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Portfolios</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              ID: {portfolio.id}
            </span>
            <span>•</span>
            <span className="text-[11px] font-mono text-slate-500">
              Vintage: {portfolio.originationVintage}
            </span>
          </div>
        </div>

        {/* Title, Badges, and Quick Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {portfolio.code}
              </span>
              <Badge variant={getStatusBadgeVariant(portfolio.status)} size="xs">
                {portfolio.status.replace(/_/g, ' ')}
              </Badge>
              <Badge variant="neutral" size="xs">
                {portfolio.assetClassLabel}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-slate-500 font-medium ml-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{portfolio.client.name}</span>
              </span>
            </div>

            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {portfolio.name}
            </h1>

            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Placed {portfolio.placementDate} under contract {portfolio.client.contractRef} • {portfolio.accountCount.active} active accounts • Weighted Aging: {portfolio.dpdDistribution.weightedAvgDpd.toFixed(1)} DPD
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
              title="Reconcile Core Ledger"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
              <span>Reconcile</span>
            </button>

            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Assign Operators</span>
            </button>

            <button
              onClick={() => showToast('Portfolio summary report exported as encrypted CSV/PDF')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Tranche Ledger</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="mt-6 pt-2 border-t border-slate-100">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as PortfolioDetailTabId)}
            variant="segmented"
            size="sm"
          />
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Tab Content Rendering */}
      <div>
        {activeTab === 'overview' && (
          <PortfolioOverviewTab
            portfolio={portfolio}
            onNavigateToAccountsTab={() => setActiveTab('accounts')}
            onNavigateToCampaignsTab={() => setActiveTab('campaigns')}
            onNavigateToAssignmentsTab={() => setActiveTab('assignments')}
          />
        )}

        {activeTab === 'accounts' && (
          <PortfolioAccountsTab
            portfolio={portfolio}
            onSelectAccount={(acc) => setSelectedQuickAccount(acc)}
            onNavigateToWorkbench={onNavigateToWorkbench}
          />
        )}

        {activeTab === 'campaigns' && (
          <PortfolioCampaignsTab portfolio={portfolio} />
        )}

        {activeTab === 'assignments' && (
          <PortfolioAssignmentsTab
            portfolio={portfolio}
            onOpenAssignModal={() => setIsAssignModalOpen(true)}
          />
        )}

        {activeTab === 'performance' && (
          <PortfolioPerformanceTab portfolio={portfolio} />
        )}
      </div>

      {/* Slide-over Account Quick Drawer */}
      <AccountQuickDrawer
        account={selectedQuickAccount}
        isOpen={Boolean(selectedQuickAccount)}
        onClose={() => setSelectedQuickAccount(null)}
        onNavigateToWorkbench={onNavigateToWorkbench}
      />

      {/* Assign Collectors Modal */}
      <AssignCollectorsModal
        portfolio={portfolio}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSave={handleSaveCollectors}
      />
    </div>
  );
};
