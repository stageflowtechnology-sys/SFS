import React, { useState } from 'react';
import { CampaignItem, CampaignDetailTabId, CampaignStatus } from '../../types/campaign';
import { CampaignOverviewTab } from './CampaignOverviewTab';
import { CampaignPortfoliosTab } from './CampaignPortfoliosTab';
import { CampaignStagesTab } from './CampaignStagesTab';
import { CampaignAccountsTab } from './CampaignAccountsTab';
import { CampaignPerformanceTab } from './CampaignPerformanceTab';
import { CampaignTransitionRulesTab } from './CampaignTransitionRulesTab';
import {
  ArrowLeft,
  Megaphone,
  Play,
  Pause,
  RotateCcw,
  Archive,
  Layers,
  Users,
  FolderTree,
  BarChart3,
  GitBranch,
  CheckCircle2,
  AlertCircle,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CampaignDetailProps {
  campaign: CampaignItem;
  onBack: () => void;
  onUpdateCampaign: (updated: CampaignItem) => void;
  onToggleState: (newState: CampaignStatus) => void;
  onNavigateToWorkbench?: (accountId: string) => void;
  showToast: (msg: string) => void;
}

export const CampaignDetail: React.FC<CampaignDetailProps> = ({
  campaign,
  onBack,
  onUpdateCampaign,
  onToggleState,
  onNavigateToWorkbench,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<CampaignDetailTabId>('overview');

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

  const tabs: Array<{ id: CampaignDetailTabId; label: string; icon: any; count?: number }> = [
    { id: 'overview', label: 'Overview', icon: Megaphone },
    { id: 'portfolios', label: 'Portfolios', icon: FolderTree, count: campaign.portfolios.length },
    { id: 'stages', label: 'Stages', icon: Layers, count: campaign.stages.length },
    { id: 'accounts', label: 'Accounts', icon: Users, count: campaign.accounts.length || campaign.totalAccounts },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'transition-rules', label: 'Transition Rules', icon: GitBranch, count: campaign.transitionRules.length },
  ];

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
      {/* Top Header Card with Back Action */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6 shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              onClick={onBack}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors shrink-0 mt-0.5"
              title="Back to all campaigns"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs text-slate-500 font-semibold px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                  {campaign.code}
                </span>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {campaign.name}
                </h1>
                {renderStatusBadge(campaign.status)}
              </div>

              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                {campaign.description}
              </p>
            </div>
          </div>

          {/* Quick Action State Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
            {campaign.status === 'ACTIVE' && (
              <button
                onClick={() => onToggleState('PAUSED')}
                className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Campaign</span>
              </button>
            )}

            {campaign.status === 'PAUSED' && (
              <button
                onClick={() => onToggleState('ACTIVE')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume Sequence</span>
              </button>
            )}

            {campaign.status === 'DRAFT' && (
              <button
                onClick={() => onToggleState('ACTIVE')}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Active Cadence</span>
              </button>
            )}

            {campaign.status !== 'ARCHIVED' && (
              <button
                onClick={() => onToggleState('ARCHIVED')}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Archive Campaign"
              >
                <Archive className="w-3.5 h-3.5 text-slate-400" />
                <span>Archive</span>
              </button>
            )}
          </div>
        </div>

        {/* 6 Tabs Navigation Strip */}
        <div className="flex items-center gap-1 border-t border-slate-100 pt-3 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive
                        ? 'bg-indigo-200/60 text-indigo-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Router */}
      {activeTab === 'overview' && (
        <CampaignOverviewTab campaign={campaign} onNavigateTab={setActiveTab} />
      )}

      {activeTab === 'portfolios' && (
        <CampaignPortfoliosTab
          campaign={campaign}
          onUpdateCampaign={onUpdateCampaign}
          showToast={showToast}
        />
      )}

      {activeTab === 'stages' && (
        <CampaignStagesTab
          campaign={campaign}
          onUpdateCampaign={onUpdateCampaign}
          showToast={showToast}
        />
      )}

      {activeTab === 'accounts' && (
        <CampaignAccountsTab
          campaign={campaign}
          onNavigateToWorkbench={onNavigateToWorkbench}
        />
      )}

      {activeTab === 'performance' && <CampaignPerformanceTab campaign={campaign} />}

      {activeTab === 'transition-rules' && (
        <CampaignTransitionRulesTab campaign={campaign} />
      )}
    </div>
  );
};
