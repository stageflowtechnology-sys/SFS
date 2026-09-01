import React from 'react';
import { SKIP_TRACE_ACCOUNTS } from '../../../data/skipTraceData';
import {
  PERMITTED_INVESTIGATION_SOURCES,
  INITIAL_INVESTIGATION_BUDGET,
  INITIAL_HYPOTHESES,
  MOCK_CANDIDATES,
  WORKSPACE_EXECUTION_STEPS,
} from '../../../data/investigationWorkspaceData';
import {
  SkipTraceAccount,
  EvidenceItem,
  InvestigationWorkspaceState,
  InvestigationSource,
  InvestigationBudgetPlan,
  InvestigationHypothesis,
  InvestigationCandidate,
  InvestigationActivityStep,
  IdentityBand,
} from '../../../types/skipTrace';
import { InvestigationProfileLeftPanel } from './InvestigationProfileLeftPanel';
import { InvestigationActivityCenterPanel } from './InvestigationActivityCenterPanel';
import { IntelligenceSummaryRightPanel } from './IntelligenceSummaryRightPanel';
import { PromoteEvidenceModal } from '../PromoteEvidenceModal';
import { SkipTraceSubNav, SkipTraceSubViewType } from '../SkipTraceSubNav';
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ShieldCheck,
  FileSpreadsheet,
  ArrowLeftRight,
} from 'lucide-react';

interface SkipTraceInvestigationWorkspaceProps {
  onSwitchToOverview?: () => void;
  onSwitchToCandidates?: () => void;
  currentSubView?: SkipTraceSubViewType;
  onNavigateSubView?: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
}

export const SkipTraceInvestigationWorkspace: React.FC<SkipTraceInvestigationWorkspaceProps> = ({
  onSwitchToOverview,
  onSwitchToCandidates,
  currentSubView = 'WORKSPACE',
  onNavigateSubView = () => {},
  selectedAccountId: controlledAccountId,
  onSelectAccount: controlledOnSelectAccount,
}) => {
  // Accounts
  const [accounts, setAccounts] = React.useState<SkipTraceAccount[]>(SKIP_TRACE_ACCOUNTS);
  const [internalAccountId, setInternalAccountId] = React.useState<string>(SKIP_TRACE_ACCOUNTS[0].id);
  const selectedAccountId = controlledAccountId || internalAccountId;

  const handleSelectAccount = (id: string) => {
    setInternalAccountId(id);
    if (controlledOnSelectAccount) {
      controlledOnSelectAccount(id);
    }
  };

  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  // Workspace Execution State
  const [workspaceState, setWorkspaceState] = React.useState<InvestigationWorkspaceState>('READY');
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = React.useState<number>(0);
  const [stopReason, setStopReason] = React.useState<string | undefined>(undefined);

  // Data Collections
  const [sources, setSources] = React.useState<InvestigationSource[]>(PERMITTED_INVESTIGATION_SOURCES);
  const [budget, setBudget] = React.useState<InvestigationBudgetPlan>(INITIAL_INVESTIGATION_BUDGET);
  const [hypotheses, setHypotheses] = React.useState<InvestigationHypothesis[]>(INITIAL_HYPOTHESES);
  const [candidates, setCandidates] = React.useState<InvestigationCandidate[]>(MOCK_CANDIDATES);
  const [visibleSteps, setVisibleSteps] = React.useState<InvestigationActivityStep[]>([]);
  const [discoveredEvidence, setDiscoveredEvidence] = React.useState<EvidenceItem[]>([]);
  const [confidenceScore, setConfidenceScore] = React.useState<number>(20);
  const [identityBand, setIdentityBand] = React.useState<IdentityBand>('POSSIBLE');

  // Promote Evidence Modal State
  const [isPromoteModalOpen, setIsPromoteModalOpen] = React.useState(false);
  const [selectedEvidenceToPromote, setSelectedEvidenceToPromote] = React.useState<EvidenceItem | null>(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = React.useState<{ title: string; subtitle: string; type: 'success' | 'info' | 'alert' } | null>(null);

  const showToast = (title: string, subtitle: string, type: 'success' | 'info' | 'alert' = 'success') => {
    setToastMessage({ title, subtitle, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Timer Ref for execution loop
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const executionIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Reset workspace when account changes
  React.useEffect(() => {
    handleReset();
  }, [selectedAccountId]);

  // Elapsed Seconds Counter
  React.useEffect(() => {
    if (workspaceState === 'RUNNING') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => +(prev + 0.1).toFixed(1));
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [workspaceState]);

  // Helper to execute a single step by index
  const executeStep = (stepIdx: number) => {
    if (stepIdx >= WORKSPACE_EXECUTION_STEPS.length) {
      // Completed all steps
      setWorkspaceState('COMPLETED');
      setStopReason('Completed: High-confidence MATCH threshold (96%) reached with 4 concordant statutory sources.');
      showToast(
        'Investigation Completed Successfully',
        'All 4 statutory hypotheses validated with 96% identity concordance and 0 contradictions.',
        'success'
      );
      return;
    }

    const stepData = WORKSPACE_EXECUTION_STEPS[stepIdx];

    // 1. Add step to visible activity list
    setVisibleSteps((prev) => [...prev, stepData]);
    setCurrentStepIndex(stepIdx + 1);

    // 2. Incur cost and update budget breakdown
    setBudget((prev) => {
      const newUsedDollars = +(prev.usedBudgetDollars + stepData.costIncurred).toFixed(2);
      const updatedBreakdown = prev.costBreakdown.map((item) => {
        if (item.sourceName.toLowerCase().includes(stepData.sourceCategory.toLowerCase()) || item.sourceName === stepData.sourceName) {
          return {
            ...item,
            queriesCount: item.queriesCount + 1,
            totalCost: +(item.totalCost + stepData.costIncurred).toFixed(2),
          };
        }
        return item;
      });

      return {
        ...prev,
        usedBudgetDollars: newUsedDollars,
        usedSteps: stepIdx + 1,
        costBreakdown: updatedBreakdown,
      };
    });

    // 3. Update confidence & Identity Band
    setConfidenceScore(stepData.runningConfidenceScore);
    if (stepData.runningConfidenceScore >= 85) {
      setIdentityBand('MATCH');
    } else if (stepData.runningConfidenceScore >= 60) {
      setIdentityBand('PROBABLE');
    } else {
      setIdentityBand('POSSIBLE');
    }

    // 4. Yield Evidence
    if (stepData.evidenceItemsYielded.length > 0) {
      setDiscoveredEvidence((prev) => [...prev, ...stepData.evidenceItemsYielded]);
    }

    // 5. Update Affected Hypothesis
    if (stepData.hypothesisAffectedId) {
      setHypotheses((prev) =>
        prev.map((h) => {
          if (h.id === stepData.hypothesisAffectedId) {
            const isFinished = stepIdx >= 2;
            return {
              ...h,
              status: isFinished ? 'VALIDATED' : 'TESTING',
              confidenceScore: stepData.runningConfidenceScore,
              corroboratingSignals: [...h.corroboratingSignals, stepData.sourceName],
            };
          }
          return h;
        })
      );
    }
  };

  // Start / Resume automatic investigation loop
  const handleStart = () => {
    setWorkspaceState('RUNNING');
    setStopReason(undefined);

    let nextStep = currentStepIndex;

    const runLoop = () => {
      if (nextStep < WORKSPACE_EXECUTION_STEPS.length) {
        executeStep(nextStep);
        nextStep++;
        executionIntervalRef.current = setTimeout(runLoop, 1100);
      } else {
        setWorkspaceState('COMPLETED');
        setStopReason('Completed: High-confidence MATCH threshold (96%) reached with 4 concordant statutory sources.');
      }
    };

    executionIntervalRef.current = setTimeout(runLoop, 300);
  };

  // Stop / Pause investigation
  const handleStop = () => {
    if (executionIntervalRef.current) clearTimeout(executionIntervalRef.current);
    setWorkspaceState('STOPPED');
    setStopReason('Stopped by Operator: Manual review checkpoint.');
    showToast(
      'Investigation Paused',
      'Execution stopped by operator. You may resume or step individually.',
      'info'
    );
  };

  // Step single step
  const handleStepNext = () => {
    if (currentStepIndex < WORKSPACE_EXECUTION_STEPS.length) {
      executeStep(currentStepIndex);
    }
  };

  // Reset to Ready state
  const handleReset = () => {
    if (executionIntervalRef.current) clearTimeout(executionIntervalRef.current);
    setWorkspaceState('READY');
    setCurrentStepIndex(0);
    setElapsedSeconds(0);
    setStopReason(undefined);
    setBudget(INITIAL_INVESTIGATION_BUDGET);
    setHypotheses(INITIAL_HYPOTHESES);
    setVisibleSteps([]);
    setDiscoveredEvidence([]);
    setConfidenceScore(20);
    setIdentityBand('POSSIBLE');
  };

  // Promote Evidence
  const handlePromoteEvidence = (evidence: EvidenceItem) => {
    setSelectedEvidenceToPromote(evidence);
    setIsPromoteModalOpen(true);
  };

  const handleConfirmPromote = (evidence: EvidenceItem, reason: string) => {
    setDiscoveredEvidence((prev) =>
      prev.map((e) => (e.id === evidence.id ? { ...e, promotedToMaster: true } : e))
    );
    showToast(
      'Evidence Promoted to Master File',
      `"${evidence.title}" (${evidence.value}) committed to StageFlow Master Servicing Records.`,
      'success'
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
          {toastMessage.type === 'info' && <Clock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
          {toastMessage.type === 'alert' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
          <div>
            <h4 className="text-xs font-bold text-white">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">{toastMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* Primary Workspace Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-[49px] z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Skip Trace Investigation Workspace
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live Engine v4.2
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Multi-source public records & bureau concordance workbench
            </p>
          </div>
        </div>

        {/* Account Selector Dropdown & View Mode Switcher */}
        <div className="flex items-center gap-2">
          {onSwitchToCandidates && (
            <button
              onClick={onSwitchToCandidates}
              id="btn-switch-to-candidates"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Candidates & Evidence</span>
            </button>
          )}

          {onSwitchToOverview && (
            <button
              onClick={onSwitchToOverview}
              id="btn-switch-to-overview"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-slate-500" />
              <span>Switch to Overview</span>
            </button>
          )}

          <div className="relative">
            <select
              value={selectedAccountId}
              onChange={(e) => handleSelectAccount(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customerName} ({acc.summary.identityConfidence.band} • {acc.accountNumber})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout: LEFT (Profile), CENTER (Activity), RIGHT (Intelligence) */}
      <div className="px-4 lg:px-8 py-5 max-w-[1600px] mx-auto w-full flex-1 flex flex-col lg:flex-row gap-5 items-start">
        {/* LEFT: Investigation Profile */}
        <InvestigationProfileLeftPanel
          account={activeAccount}
          sources={sources}
          budget={budget}
          isRunning={workspaceState === 'RUNNING'}
        />

        {/* CENTER: Investigation Activity */}
        <InvestigationActivityCenterPanel
          state={workspaceState}
          onStart={handleStart}
          onStop={handleStop}
          onStepNext={handleStepNext}
          onReset={handleReset}
          currentStepIndex={currentStepIndex}
          totalSteps={WORKSPACE_EXECUTION_STEPS.length}
          stopReason={stopReason}
          hypotheses={hypotheses}
          activitySteps={visibleSteps}
          budget={budget}
          elapsedSeconds={elapsedSeconds}
        />

        {/* RIGHT: Intelligence Summary */}
        <IntelligenceSummaryRightPanel
          confidenceScore={confidenceScore}
          identityBand={identityBand}
          candidates={candidates}
          evidenceList={discoveredEvidence}
          recommendedAction={activeAccount.recommendedAction}
          onPromoteEvidence={handlePromoteEvidence}
          account={activeAccount}
        />
      </div>

      {/* Modal: Promote Evidence to Master Servicing File */}
      <PromoteEvidenceModal
        isOpen={isPromoteModalOpen}
        onClose={() => setIsPromoteModalOpen(false)}
        evidence={selectedEvidenceToPromote}
        onConfirmPromote={handleConfirmPromote}
      />
    </div>
  );
};
