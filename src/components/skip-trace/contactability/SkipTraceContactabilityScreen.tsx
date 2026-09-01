import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  FolderUp,
  Cloud,
  FileCheck,
  Shield,
  ShieldCheck,
  Award,
  Layers,
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import {
  ContactabilityCategory,
  ContactabilityChannel,
  SkipTraceContactabilityDataset,
} from '../../../types/contactability';
import {
  CONTACTABILITY_DATASETS,
  MARCUS_VANCE_CONTACTABILITY,
} from '../../../data/contactabilityData';
import { IdentityConfidenceCalibrationCard } from './IdentityConfidenceCalibrationCard';
import { ContactabilityCategoryMatrix } from './ContactabilityCategoryMatrix';
import { LikelyReachableChannelsLeaderboard } from './LikelyReachableChannelsLeaderboard';
import { GoogleDriveIntegrationModal } from './GoogleDriveIntegrationModal';
import { ChannelHistoryAuditModal } from './ChannelHistoryAuditModal';
import { SkipTraceSubNav, SkipTraceSubViewType } from '../SkipTraceSubNav';

interface SkipTraceContactabilityScreenProps {
  onSwitchToWorkspace?: () => void;
  onSwitchToCandidates?: () => void;
  onSwitchToOverview?: () => void;
  currentSubView?: SkipTraceSubViewType;
  onNavigateSubView?: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
}

export const SkipTraceContactabilityScreen: React.FC<SkipTraceContactabilityScreenProps> = ({
  onSwitchToWorkspace,
  onSwitchToCandidates,
  onSwitchToOverview,
  currentSubView = 'CONTACTABILITY',
  onNavigateSubView = () => {},
  selectedAccountId: controlledAccountId,
  onSelectAccount: controlledOnSelectAccount,
}) => {
  // Active Account / Scenario state
  const [internalAccountId, setInternalAccountId] = useState<string>('skip-acc-101');
  const activeAccountId = controlledAccountId || internalAccountId;
  const dataset: SkipTraceContactabilityDataset =
    CONTACTABILITY_DATASETS[activeAccountId] || MARCUS_VANCE_CONTACTABILITY;

  const handleSelectAccount = (id: string) => {
    setInternalAccountId(id);
    if (controlledOnSelectAccount) {
      controlledOnSelectAccount(id);
    }
  };

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<ContactabilityCategory | 'ALL'>('ALL');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [selectedHistoryChannel, setSelectedHistoryChannel] = useState<ContactabilityChannel | null>(null);
  const [actionAlert, setActionAlert] = useState<{ title: string; detail: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filter channels based on search query
  const filteredChannels = dataset.channels.filter((chan) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      chan.value.toLowerCase().includes(q) ||
      chan.label.toLowerCase().includes(q) ||
      chan.source.toLowerCase().includes(q) ||
      chan.category.toLowerCase().includes(q) ||
      chan.channelType.toLowerCase().includes(q) ||
      chan.recommendationReasoning.primaryRankReason.toLowerCase().includes(q)
    );
  });

  const handleChannelAction = (channel: ContactabilityChannel, actionType: string) => {
    if (actionType === 'DIAL') {
      setActionAlert({
        title: `Dialing Session Initiated for ${channel.value}`,
        detail: `Connecting via TCPA compliant manual dial rail. Local time in ${channel.compliance.fdcpaPermissibleWindow}. Logging call under FDCPA Reg-F guidelines.`,
      });
    } else if (actionType === 'EMAIL') {
      setActionAlert({
        title: `Electronic Statement Prepared for ${channel.value}`,
        detail: `Statutory opt-out header included under 12 CFR § 1006.6(d)(1). Ready for dispatch.`,
      });
    } else if (actionType === 'MAIL') {
      setActionAlert({
        title: `Formal Validation Notice Queued for ${channel.value}`,
        detail: `USPS CASS certified delivery point. Return receipt requested under FDCPA §809.`,
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sub-Navigation for Skip Trace */}
      <SkipTraceSubNav
        currentSubView={currentSubView}
        onNavigateSubView={onNavigateSubView}
        selectedAccountId={activeAccountId}
        onSelectAccount={handleSelectAccount}
      />

      <div className="p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs">
              <Award className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Skip Trace Operations Console
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" />
                  <span>Contactability Intelligence v3.4</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>FCRA §604 / FDCPA Compliant</span>
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
                Skip Trace Contactability Intelligence
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                Autonomous reachability synthesis ranking contact channels from strongest to weakest across 5 vectors (Phone, Email, Professional, Social, Geographic) with verifiable statutory provenance and calibrated identity guardrails.
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Google Drive Dossier Sync Button */}
            <button
              onClick={() => setIsDriveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
            >
              <Cloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Google Drive Dossier</span>
            </button>

            {/* Sync Telemetry Button */}
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Refresh carrier HLR pings and identity signals"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
              <span>Re-Scrub Signals</span>
            </button>
          </div>
        </div>

        {/* Account Context Details Ribbon */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-semibold">Subject Customer</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5 truncate" title={dataset.customerName}>
              {dataset.customerName}
            </div>
            <div className="text-[10px] text-slate-500 truncate">{dataset.customerId}</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-semibold">Account Number</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
              {dataset.accountNumber}
            </div>
            <div className="text-[10px] text-slate-500 truncate">Commercial Line</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-semibold">Claim Balance</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              ${dataset.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-slate-500">Delinquent Principal</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-semibold">Current Stage</span>
            <div className="text-xs font-bold text-amber-800 mt-0.5 truncate" title={dataset.currentStage}>
              {dataset.currentStage}
            </div>
            <div className="text-[10px] text-slate-500">Skip Trace Active</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-semibold">Last Investigation</span>
            <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
              {dataset.lastInvestigationDate.split(' at ')[0]}
            </div>
            <div className="text-[10px] text-slate-500">Waterfall Ping</div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] uppercase text-slate-500 font-semibold">Permissible Purpose</span>
            <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>FCRA §604 Pass</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">Permissible Purpose</div>
          </div>
        </div>

        {/* View Switcher Sub-Tabs */}
        <div className="pt-2 flex items-center gap-2 overflow-x-auto border-t border-slate-100">
          <button
            className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-slate-900 text-white shadow-2xs shrink-0 flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Contactability Intelligence</span>
          </button>

          {onSwitchToCandidates && (
            <button
              onClick={onSwitchToCandidates}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            >
              Candidates & Evidence
            </button>
          )}

          {onSwitchToWorkspace && (
            <button
              onClick={onSwitchToWorkspace}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            >
              Investigation Workspace
            </button>
          )}

          {onSwitchToOverview && (
            <button
              onClick={onSwitchToOverview}
              className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            >
              Skip Trace Overview
            </button>
          )}
        </div>
      </div>

      {/* Action Alert Banner */}
      {actionAlert && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 flex items-start justify-between gap-3 text-indigo-950 shadow-2xs animate-fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-xs">{actionAlert.title}</div>
              <p className="text-xs text-indigo-800 mt-0.5">{actionAlert.detail}</p>
            </div>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-xs text-indigo-600 hover:text-indigo-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Identity Confidence & Calibration Matrix */}
      <IdentityConfidenceCalibrationCard
        calibration={dataset.identityConfidence}
        accountName={dataset.customerName}
        accountNumber={dataset.accountNumber}
        currentAccountId={activeAccountId}
        onSelectAccount={(accId) => handleSelectAccount(accId)}
      />

      {/* 2. Contactability 5-Vector Category Matrix */}
      <ContactabilityCategoryMatrix
        categorySummaries={dataset.categorySummaries}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Search & Channel Filter Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search channels, phone, email, deed, source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-600 w-full sm:w-auto justify-end">
          <span className="font-semibold text-slate-700">Filter:</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-bold">
            {selectedCategory === 'ALL' ? 'All 5 Vectors' : selectedCategory}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[11px] text-indigo-600 hover:underline ml-1"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* 3. Likely Reachable Channels — Ranked Strongest to Weakest */}
      <LikelyReachableChannelsLeaderboard
        channels={filteredChannels}
        selectedCategory={selectedCategory}
        onInspectHistory={(chan) => setSelectedHistoryChannel(chan)}
        onSelectChannelAction={handleChannelAction}
      />

      {/* Google Drive Integration Modal */}
      <GoogleDriveIntegrationModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        dataset={dataset}
      />

      {/* Channel History Audit Modal */}
      <ChannelHistoryAuditModal
        channel={selectedHistoryChannel}
        onClose={() => setSelectedHistoryChannel(null)}
      />
      </div>
    </div>
  );
};
