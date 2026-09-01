import React from 'react';
import {
  InvestigationWorkspaceState,
  InvestigationHypothesis,
  InvestigationActivityStep,
  InvestigationBudgetPlan,
} from '../../../types/skipTrace';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Search,
  Activity,
  Layers,
  Database,
  PhoneCall,
  MapPin,
  Building,
  ShieldCheck,
  ChevronRight,
  Filter,
  Check,
  XCircle,
  HelpCircle,
  DollarSign,
} from 'lucide-react';

interface InvestigationActivityCenterPanelProps {
  state: InvestigationWorkspaceState;
  onStart: () => void;
  onStop: () => void;
  onStepNext: () => void;
  onReset: () => void;
  currentStepIndex: number;
  totalSteps: number;
  stopReason?: string;
  hypotheses: InvestigationHypothesis[];
  activitySteps: InvestigationActivityStep[];
  budget: InvestigationBudgetPlan;
  elapsedSeconds: number;
}

export const InvestigationActivityCenterPanel: React.FC<InvestigationActivityCenterPanelProps> = ({
  state,
  onStart,
  onStop,
  onStepNext,
  onReset,
  currentStepIndex,
  totalSteps,
  stopReason,
  hypotheses,
  activitySteps,
  budget,
  elapsedSeconds,
}) => {
  const [filterType, setFilterType] = React.useState<'ALL' | 'QUERIES' | 'HYPOTHESES' | 'EVIDENCE'>('ALL');

  // Format seconds as mm:ss.s
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = (secs % 60).toFixed(1);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.padStart(4, '0')}`;
  };

  const getStatusBadge = () => {
    switch (state) {
      case 'READY':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            READY
          </span>
        );
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            RUNNING INVESTIGATION
          </span>
        );
      case 'STOPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            STOPPED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            COMPLETED
          </span>
        );
    }
  };

  const getHypothesisBadge = (status: InvestigationHypothesis['status']) => {
    switch (status) {
      case 'VALIDATED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-700" />
            VALIDATED
          </span>
        );
      case 'TESTING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 animate-pulse">
            <Activity className="w-3 h-3 text-indigo-700" />
            TESTING...
          </span>
        );
      case 'DISPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-700" />
            DISPROVED
          </span>
        );
      case 'INCONCLUSIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <HelpCircle className="w-3 h-3 text-amber-700" />
            INCONCLUSIVE
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            QUEUED
          </span>
        );
    }
  };

  const filteredSteps = activitySteps.filter((step) => {
    if (filterType === 'QUERIES') return step.actionType !== 'CONFIDENCE_SYNTHESIS';
    if (filterType === 'HYPOTHESES') return !!step.hypothesisAffectedId;
    if (filterType === 'EVIDENCE') return step.evidenceItemsYielded.length > 0;
    return true;
  });

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto">
      {/* 1. Top Investigation Command & Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Investigation Execution Engine
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Automated Multi-Source Concordance & Hypothesis Testing
              </p>
            </div>
          </div>

          {/* Interactive Play / Pause / Step Controls */}
          <div className="flex items-center gap-2">
            {state === 'READY' && (
              <button
                onClick={onStart}
                id="btn-workspace-start"
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Investigation</span>
              </button>
            )}

            {state === 'RUNNING' && (
              <>
                <button
                  onClick={onStop}
                  id="btn-workspace-stop"
                  className="px-3.5 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all flex items-center gap-1.5"
                >
                  <Pause className="w-3.5 h-3.5 fill-amber-900" />
                  <span>Pause</span>
                </button>
                <button
                  onClick={onStepNext}
                  id="btn-workspace-step-next"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Step</span>
                </button>
              </>
            )}

            {state === 'STOPPED' && (
              <>
                <button
                  onClick={onStart}
                  id="btn-workspace-resume"
                  className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={onStepNext}
                  id="btn-workspace-step-next-stopped"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center gap-1.5"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Step Once</span>
                </button>
                <button
                  onClick={onReset}
                  id="btn-workspace-reset"
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </>
            )}

            {state === 'COMPLETED' && (
              <button
                onClick={onReset}
                id="btn-workspace-rerun"
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 shadow-xs transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-run Investigation</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 font-mono text-xs">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
            <span className="text-[10px] text-slate-500 block">Progress</span>
            <span className="font-bold text-slate-900">
              Step {currentStepIndex} of {totalSteps}
            </span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
            <span className="text-[10px] text-slate-500 block">Elapsed Time</span>
            <span className="font-bold text-indigo-700">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
            <span className="text-[10px] text-slate-500 block">Cost Incurred</span>
            <span className="font-bold text-emerald-700">${budget.usedBudgetDollars.toFixed(2)}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-150">
            <span className="text-[10px] text-slate-500 block">Hypotheses Solved</span>
            <span className="font-bold text-slate-900">
              {hypotheses.filter((h) => h.status === 'VALIDATED' || h.status === 'DISPROVED').length} / {hypotheses.length}
            </span>
          </div>
        </div>

        {/* Stop Reason Alert Banner (when Stopped or Completed) */}
        {stopReason && (
          <div
            className={`p-3 rounded-lg border flex items-start gap-2.5 text-xs ${
              state === 'COMPLETED'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            {state === 'COMPLETED' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px] font-mono">
                {state === 'COMPLETED' ? 'Stop Reason • Target Satisfied' : 'Stop Reason • Halt Trigger'}
              </span>
              <p className="mt-0.5 leading-relaxed font-medium">{stopReason}</p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Working Hypotheses Engine */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Active Hypotheses
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Working Hypotheses & Evidence Corroboration
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {hypotheses.filter((h) => h.status === 'VALIDATED').length} of {hypotheses.length} Validated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {hypotheses.map((hyp) => (
            <div
              key={hyp.id}
              className={`p-3 rounded-xl border transition-all ${
                hyp.status === 'VALIDATED'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : hyp.status === 'TESTING'
                  ? 'bg-indigo-50/40 border-indigo-300 shadow-xs'
                  : hyp.status === 'DISPROVED'
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-slate-500">
                  HYPOTHESIS #{hyp.number} • {hyp.category}
                </span>
                {getHypothesisBadge(hyp.status)}
              </div>

              <p className="font-semibold text-slate-900 mt-1.5 leading-snug">
                {hyp.statement}
              </p>

              {/* Signals & Supporting Sources */}
              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-mono text-[10px]">
                  {hyp.corroboratingSignals.length > 0
                    ? `✓ ${hyp.corroboratingSignals.length} Corroborating Signal${
                        hyp.corroboratingSignals.length > 1 ? 's' : ''
                      }`
                    : 'Awaiting source query...'}
                </span>
                <span className="font-mono text-[10px] font-bold text-indigo-700">
                  {hyp.confidenceScore > 0 ? `${hyp.confidenceScore}% Conf.` : '--'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Live Investigation Activity Timeline Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex-1 flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Activity Stream
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Step-by-Step Investigation Activity
              </h4>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-600">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              All Steps ({activitySteps.length})
            </button>
            <button
              onClick={() => setFilterType('QUERIES')}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === 'QUERIES' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Data Queries
            </button>
            <button
              onClick={() => setFilterType('HYPOTHESES')}
              className={`px-2 py-1 rounded transition-colors ${
                filterType === 'HYPOTHESES' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Hypothesis Validations
            </button>
          </div>
        </div>

        {/* Steps List */}
        {filteredSteps.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs space-y-2 my-auto">
            <Clock className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
            <p className="font-semibold text-slate-600">Investigation Queued</p>
            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
              Click &quot;Start Investigation&quot; above to execute multi-source statutory queries and observe live hypothesis resolution.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredSteps.map((step) => (
              <div
                key={step.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      {step.sourceName}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {step.sourceCategory}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-slate-400">{step.relativeTime}</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      +${step.costIncurred.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 text-slate-300 font-mono text-[10px] p-2 rounded-lg border border-slate-800 overflow-x-auto">
                  <span className="text-emerald-400">&gt; </span>
                  {step.queryParametersRedacted}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {step.summaryNote}
                </p>

                {step.hypothesisResolution && (
                  <div className="p-2 rounded-lg bg-indigo-50/70 border border-indigo-200/80 text-[11px] text-indigo-950 flex items-start gap-1.5 font-sans">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
                    <span>{step.hypothesisResolution}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
