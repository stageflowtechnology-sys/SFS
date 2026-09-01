import React from 'react';
import { SKIP_TRACE_ACCOUNTS } from '../../data/skipTraceData';
import {
  SkipTraceAccount,
  EvidenceItem,
  ReachableChannel,
  RecommendedAction,
} from '../../types/skipTrace';
import { SkipTraceHeader } from './SkipTraceHeader';
import { SkipTraceSummaryGrid } from './SkipTraceSummaryGrid';
import { RecommendedActionCard } from './RecommendedActionCard';
import { ReachableChannelsList } from './ReachableChannelsList';
import { EvidenceDiscoveredPanel } from './EvidenceDiscoveredPanel';
import { InvestigationHistoryTable } from './InvestigationHistoryTable';
import { StartInvestigationModal } from './StartInvestigationModal';
import { PromoteEvidenceModal } from './PromoteEvidenceModal';
import { SkipTraceSubNav, SkipTraceSubViewType } from './SkipTraceSubNav';
import {
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Mail,
  ShieldCheck,
  FileDown,
  RefreshCw,
  Search,
} from 'lucide-react';

interface SkipTraceOverviewScreenProps {
  onOpenWorkspace?: () => void;
  currentSubView?: SkipTraceSubViewType;
  onNavigateSubView?: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
}

export const SkipTraceOverviewScreen: React.FC<SkipTraceOverviewScreenProps> = ({
  onOpenWorkspace,
  currentSubView = 'OVERVIEW',
  onNavigateSubView = () => {},
  selectedAccountId: controlledAccountId,
  onSelectAccount: controlledOnSelectAccount,
}) => {
  const [accounts, setAccounts] = React.useState<SkipTraceAccount[]>(SKIP_TRACE_ACCOUNTS);
  const [internalAccountId, setInternalAccountId] = React.useState<string>(SKIP_TRACE_ACCOUNTS[0].id);
  const selectedAccountId = controlledAccountId || internalAccountId;
  const [selectedEvidenceFilter, setSelectedEvidenceFilter] = React.useState<string | null>(null);

  const handleSelectAccount = (id: string) => {
    setInternalAccountId(id);
    if (controlledOnSelectAccount) {
      controlledOnSelectAccount(id);
    }
  };

  // Modals state
  const [isInvestigationModalOpen, setIsInvestigationModalOpen] = React.useState(false);
  const [isPromoteModalOpen, setIsPromoteModalOpen] = React.useState(false);
  const [selectedEvidenceToPromote, setSelectedEvidenceToPromote] = React.useState<EvidenceItem | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = React.useState<{ title: string; subtitle: string; type: 'success' | 'info' | 'alert' } | null>(null);

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const showToast = (title: string, subtitle: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage({ title, subtitle, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleStartInvestigation = () => {
    setIsInvestigationModalOpen(true);
  };

  const handleCompleteInvestigation = () => {
    // Add a fresh investigation run to history and update account status to ACTIVE
    const updatedHistory = [
      {
        id: `inv-run-fresh-${Date.now()}`,
        runNumber: `RUN-20260831-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: '2026-08-31 22:48:00 EST',
        relativeTime: 'Just now',
        investigatorId: 'OP-4819',
        investigatorName: 'Active Operator (Collector)',
        triggerType: 'MANUAL_COLLECTOR' as const,
        sourcesQueried: ['Credit Header', 'USPS NCOA 48-Month', 'County Assessor Deeds', 'Telco HLR Ping'],
        evidenceDiscoveredCount: activeAccount.evidenceList.length,
        identityBand: activeAccount.summary.identityConfidence.band,
        confidenceScore: activeAccount.summary.identityConfidence.score,
        status: 'SUCCESS' as const,
        executionDurationSeconds: 4.2,
        notes: 'Manual multi-tier waterfall completed. Concordance scores and reachable channels refreshed.',
      },
      ...activeAccount.investigationHistory,
    ];

    const updatedAccount: SkipTraceAccount = {
      ...activeAccount,
      investigationStatus: 'ACTIVE',
      lastInvestigationDate: 'August 31, 2026 at 22:48 EST',
      lastInvestigator: 'Active Operator (Collector)',
      daysSinceLastInvestigation: 0,
      investigationHistory: updatedHistory,
    };

    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
    showToast(
      'Skip Trace Investigation Complete',
      `Waterfall executed across 4 statutory repositories. Refreshed identity concordance to ${activeAccount.summary.identityConfidence.score}%.`,
      'success'
    );
  };

  const handlePromoteEvidence = (evidence: EvidenceItem) => {
    setSelectedEvidenceToPromote(evidence);
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = (evidence: EvidenceItem, reason: string) => {
    const updatedEvidenceList = activeAccount.evidenceList.map((e) =>
      e.id === evidence.id ? { ...e, promotedToMaster: true, notes: `${e.notes || ''} [Promoted to Master by Operator: ${reason}]` } : e
    );

    const updatedAccount: SkipTraceAccount = {
      ...activeAccount,
      evidenceList: updatedEvidenceList,
    };

    setAccounts((prev) => prev.map((a) => (a.id === updatedAccount.id ? updatedAccount : a)));
    showToast(
      'Evidence Promoted to Master File',
      `"${evidence.title}" (${evidence.value}) has been committed to StageFlow Master Servicing Records.`,
      'success'
    );
  };

  const handleExecuteRecommendedAction = (action: RecommendedAction) => {
    showToast(
      'Recommended Action Initiated',
      `Executing "${action.title}" per statutory rule ${action.complianceRuleCitation}.`,
      'info'
    );
  };

  const handleDialChannel = (channel: ReachableChannel) => {
    showToast(
      'Outbound Telephony Dial Initialized',
      `Routing call to ${channel.value} (${channel.label}) with Mini-Miranda compliance prompts loaded.`,
      'info'
    );
  };

  const handleSendEmail = (channel: ReachableChannel) => {
    showToast(
      'Electronic 1692g Notice Dispatched',
      `Delivering statutory notice to ${channel.value} with tracking token.`,
      'info'
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sub-Navigation for Skip Trace */}
      <SkipTraceSubNav
        currentSubView={currentSubView}
        onNavigateSubView={onNavigateSubView}
        selectedAccountId={selectedAccountId}
        onSelectAccount={handleSelectAccount}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'info' && <PhoneCall className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'alert' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          <div>
            <h4 className="text-xs font-bold text-white">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">{toastMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* Primary Sticky Header */}
      <SkipTraceHeader
        account={activeAccount}
        allAccounts={accounts}
        onSelectAccount={(acc) => {
          handleSelectAccount(acc.id);
          setSelectedEvidenceFilter(null);
        }}
        onStartInvestigation={handleStartInvestigation}
        onOpenWorkspace={onOpenWorkspace}
      />

      {/* Main Investigation Content Body */}
      <div className="px-4 lg:px-8 py-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Recommended Next Action Card */}
        <RecommendedActionCard
          action={activeAccount.recommendedAction}
          account={activeAccount}
          onExecuteAction={handleExecuteRecommendedAction}
        />

        {/* 7-Pillar Investigation Summary Matrix */}
        <SkipTraceSummaryGrid
          summary={activeAccount.summary}
          onFilterEvidence={(category) => {
            setSelectedEvidenceFilter(category);
            const el = document.getElementById('section-evidence-discovered');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Likely Reachable Channels (Ranked) */}
        <ReachableChannelsList
          channels={activeAccount.reachableChannels}
          onDialChannel={handleDialChannel}
          onSendEmail={handleSendEmail}
        />

        {/* Evidence Discovered Panel */}
        <div id="section-evidence-discovered">
          <EvidenceDiscoveredPanel
            evidenceList={activeAccount.evidenceList}
            selectedCategoryFilter={selectedEvidenceFilter}
            onSelectCategoryFilter={(cat) => setSelectedEvidenceFilter(cat)}
            onPromoteEvidence={handlePromoteEvidence}
          />
        </div>

        {/* Investigation Audit History Table */}
        <InvestigationHistoryTable history={activeAccount.investigationHistory} />
      </div>

      {/* Modals */}
      <StartInvestigationModal
        isOpen={isInvestigationModalOpen}
        onClose={() => setIsInvestigationModalOpen(false)}
        account={activeAccount}
        onCompleteInvestigation={handleCompleteInvestigation}
      />

      <PromoteEvidenceModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        evidence={selectedEvidenceToPromote}
        onConfirmPromote={handleConfirmPromote}
      />
    </div>
  );
};
