import React, { useState } from 'react';
import {
  WorkbenchAccount,
  AiSignal,
  AiEvidenceFactor,
} from '../../types/workbench';
import { StateOrigin } from '../../types/design-system';
import {
  Sparkles,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  AlertOctagon,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  Brain,
  Layers,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  Cpu,
  Info,
} from 'lucide-react';
import { OriginCardWrapper } from './OriginCardWrapper';
import { OriginBadge } from '../ui/OriginBadge';

interface RightAiIntelligencePanelProps {
  account: WorkbenchAccount;
  currentOperatorId: string;
  onApplyRecommendedAction: (actionTitle: string, terms: string) => void;
  onApplyRecommendedStage: (targetStage: string) => void;
}

export const RightAiIntelligencePanel: React.FC<RightAiIntelligencePanelProps> = ({
  account,
  currentOperatorId,
  onApplyRecommendedAction,
  onApplyRecommendedStage,
}) => {
  const { aiIntelligence } = account;

  // Interactive origin state lifecycle for the Recommended Next Action
  const [actionOriginState, setActionOriginState] = useState<StateOrigin>(
    aiIntelligence.recommendedNextAction.origin
  );
  const [actionConfirmedAt, setActionConfirmedAt] = useState<string | null>(null);

  // Interactive origin state lifecycle for the Recommended Stage Transition
  const [stageOriginState, setStageOriginState] = useState<StateOrigin>(
    aiIntelligence.recommendedStage.origin
  );
  const [stageConfirmedAt, setStageConfirmedAt] = useState<string | null>(null);

  // Active tab for AI panel (Briefing & Guidance vs. Signals & Evidence)
  const [activeAiTab, setActiveAiTab] = useState<'GUIDANCE' | 'EVIDENCE'>('GUIDANCE');

  // Handle human confirmation of the AI recommended action
  const handleApproveAction = () => {
    // Transition to HUMAN_DECISION
    setActionOriginState('HUMAN_DECISION');
    setActionConfirmedAt('Confirmed by you just now');

    // Simulate automatic pipeline execution after operator authorization
    setTimeout(() => {
      setActionOriginState('SYSTEM_EXECUTION');
      setTimeout(() => {
        setActionOriginState('VERIFIED_GROUND_TRUTH');
        onApplyRecommendedAction(
          aiIntelligence.recommendedNextAction.actionTitle,
          aiIntelligence.recommendedNextAction.suggestedTerms
        );
      }, 1500);
    }, 1200);
  };

  const handleResetActionOrigin = () => {
    setActionOriginState('AI_RECOMMENDATION');
    setActionConfirmedAt(null);
  };

  // Handle human confirmation of the AI recommended stage
  const handleApproveStage = () => {
    setStageOriginState('HUMAN_DECISION');
    setStageConfirmedAt('Confirmed by you just now');

    setTimeout(() => {
      setStageOriginState('SYSTEM_EXECUTION');
      setTimeout(() => {
        setStageOriginState('VERIFIED_GROUND_TRUTH');
        onApplyRecommendedStage(aiIntelligence.recommendedStage.targetStageLabel);
      }, 1500);
    }, 1200);
  };

  const handleResetStageOrigin = () => {
    setStageOriginState('AI_RECOMMENDATION');
    setStageConfirmedAt(null);
  };

  const getSignalBadgeColor = (severity: string) => {
    switch (severity) {
      case 'positive':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'high':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col h-full bg-indigo-50/20 border-l border-slate-200 overflow-y-auto">
      {/* Panel Header with Core Principle Reminder */}
      <div className="p-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                AI Intelligence & Copilot
              </h3>
              <p className="text-[10px] font-mono text-indigo-700">
                Model: StageFlow Recovery-v4.2 • Advisory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveAiTab('GUIDANCE')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                activeAiTab === 'GUIDANCE'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Guidance
            </button>
            <button
              onClick={() => setActiveAiTab('EVIDENCE')}
              className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                activeAiTab === 'EVIDENCE'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evidence ({aiIntelligence.evidenceFactors.length})
            </button>
          </div>
        </div>

        {/* Explicit Visual Distinction Banner */}
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/80 p-2 text-[11px] text-indigo-950 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
          <span className="leading-snug">
            <strong>Advisory Protocol:</strong> AI suggestions carry <em>no authoritative legal force</em> until validated by a licensed operator.
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 1. RECOMMENDED NEXT ACTION (With Strict 4-State Visual Distinction) */}
        <OriginCardWrapper
          origin={actionOriginState}
          title={aiIntelligence.recommendedNextAction.actionTitle}
          confidence={aiIntelligence.recommendedNextAction.confidence}
          operatorId={actionOriginState !== 'AI_RECOMMENDATION' ? currentOperatorId : undefined}
          timestamp={actionConfirmedAt || undefined}
          actionButtons={
            actionOriginState === 'AI_RECOMMENDATION' ? (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-[10px] font-mono text-indigo-700">
                  Requires Operator Approval
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleApproveAction}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve & Authorize</span>
                  </button>
                </div>
              </div>
            ) : actionOriginState === 'SYSTEM_EXECUTION' ? (
              <div className="flex items-center justify-between w-full text-cyan-900 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-700" />
                  Dispatching to Core Ledger Rail...
                </span>
                <span className="text-[10px] bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                  Lock #TX-90142
                </span>
              </div>
            ) : actionOriginState === 'VERIFIED_GROUND_TRUTH' ? (
              <div className="flex items-center justify-between w-full text-emerald-950 text-xs font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Authorized & Reconciled to Case File
                </span>
                <button
                  onClick={handleResetActionOrigin}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                >
                  Reset State Demo
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full text-amber-950 text-xs font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                  Authorized by Operator #{currentOperatorId}
                </span>
              </div>
            )
          }
        >
          <div className="space-y-2.5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Suggested Restructure Terms:
              </span>
              <p className="text-xs font-semibold text-slate-900 bg-slate-50 p-2 rounded border border-slate-200 leading-relaxed font-sans">
                {aiIntelligence.recommendedNextAction.suggestedTerms}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Model Rationale:
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {aiIntelligence.recommendedNextAction.rationale}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Underlying Statistical Evidence:
              </span>
              <ul className="space-y-1 text-xs text-slate-600 font-mono">
                {aiIntelligence.recommendedNextAction.evidenceList.map((ev, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-indigo-600 mt-0.5">•</span>
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </OriginCardWrapper>

        {/* 2. RECOMMENDED STAGE TRANSITION */}
        <OriginCardWrapper
          origin={stageOriginState}
          title={`Stage Transition: → ${aiIntelligence.recommendedStage.targetStageLabel}`}
          confidence={aiIntelligence.recommendedStage.confidence}
          operatorId={stageOriginState !== 'AI_RECOMMENDATION' ? currentOperatorId : undefined}
          timestamp={stageConfirmedAt || undefined}
          actionButtons={
            stageOriginState === 'AI_RECOMMENDATION' ? (
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-mono text-indigo-700">
                  Current: {account.currentStageLabel}
                </span>
                <button
                  onClick={handleApproveStage}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Accept Stage Change</span>
                </button>
              </div>
            ) : stageOriginState === 'VERIFIED_GROUND_TRUTH' ? (
              <div className="flex items-center justify-between w-full text-emerald-950 text-xs font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Stage Transition Logged to Master Database
                </span>
                <button
                  onClick={handleResetStageOrigin}
                  className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                >
                  Reset
                </button>
              </div>
            ) : (
              <div className="text-xs font-mono text-amber-900 font-semibold">
                Transition Queued by Operator #{currentOperatorId}
              </div>
            )
          }
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Current Stage:</span>
              <span className="font-mono font-bold text-slate-900">
                {account.currentStageLabel}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-indigo-50 border border-indigo-200">
              <span className="text-indigo-900 font-medium">Proposed Stage:</span>
              <span className="font-mono font-bold text-indigo-950">
                {aiIntelligence.recommendedStage.targetStageLabel}
              </span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed pt-1">
              {aiIntelligence.recommendedStage.rationale}
            </p>
          </div>
        </OriginCardWrapper>

        {activeAiTab === 'GUIDANCE' ? (
          <>
            {/* 3. PRE-CALL BRIEFING */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                    Debtor Pre-Call Briefing
                  </h4>
                </div>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  Propensity: {account.propensityScore}/100
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {aiIntelligence.preCallBriefing.summary}
              </p>

              {/* Personality traits */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Psychological & Negotiation Profile:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {aiIntelligence.preCallBriefing.personalityTraits.map((trait, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-mono border border-slate-200"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Leverage Points */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 font-bold">
                  Key Settlement Leverage Points:
                </span>
                <ul className="space-y-1 text-xs text-slate-700">
                  {aiIntelligence.preCallBriefing.keyLeveragePoints.map((lp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{lp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Tone */}
              <div className="p-2 rounded bg-indigo-50/60 border border-indigo-100 text-xs text-indigo-950 font-medium">
                <span className="font-bold">Recommended Tone:</span>{' '}
                {aiIntelligence.preCallBriefing.recommendedTone}
              </div>
            </div>

            {/* 4. REAL-TIME AI GUIDANCE & COMPLIANCE GUARDRAILS */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                    Real-Time Conversational Guidance
                  </h4>
                </div>
              </div>

              <div className="space-y-2.5">
                {aiIntelligence.liveGuidancePoints.map((guide) => (
                  <div
                    key={guide.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs"
                  >
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>Trigger: {guide.trigger}</span>
                    </div>

                    <p className="text-slate-700 leading-relaxed">
                      {guide.guidance}
                    </p>

                    {guide.complianceReminder && (
                      <div className="p-1.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-900 font-semibold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{guide.complianceReminder}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 5. DETECTED SIGNALS */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                    Live Detected Signals ({aiIntelligence.detectedSignals.length})
                  </h4>
                </div>
              </div>

              <div className="space-y-2">
                {aiIntelligence.detectedSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {signal.label}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase ${getSignalBadgeColor(
                          signal.severity
                        )}`}
                      >
                        {(signal.confidence * 100).toFixed(0)}% conf
                      </span>
                    </div>

                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      {signal.description}
                    </p>

                    {signal.sourceText && (
                      <div className="text-[10px] font-mono text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                        {signal.sourceText}
                      </div>
                    )}

                    <div className="text-[9px] font-mono text-slate-400">
                      Detected: {signal.detectedAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* EVIDENCE & MODEL EXPLAINABILITY TAB */
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                  Feature Importance & Evidence Breakdown
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mathematical feature weights influencing the <strong>{account.propensityScore}%</strong> recovery score and settlement recommendations:
            </p>

            <div className="space-y-3">
              {aiIntelligence.evidenceFactors.map((factor, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{factor.label}</span>
                    <span className="font-mono font-bold text-slate-700">
                      Weight: {factor.weight}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        factor.impact === 'positive'
                          ? 'bg-emerald-500'
                          : factor.impact === 'negative'
                          ? 'bg-rose-500'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${factor.weight}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono">{factor.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
