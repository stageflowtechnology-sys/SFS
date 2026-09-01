/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_LIVE_CALL_SCENARIOS } from '../../data/liveCopilotData';
import {
  LiveCallScenario,
  TranscriptUtterance,
  PrioritySignal,
  ConversationSignal,
  CurrentUnderstanding,
  SuggestedQuestion,
  MissingInformationItem,
  ConversationGuidance,
  LiveCopilotAccountContext,
} from '../../types/liveCopilot';
import { LiveTranscriptPanel } from './LiveTranscriptPanel';
import { AiCopilotGuidancePanel } from './AiCopilotGuidancePanel';
import { LiveCallBottomBar } from './LiveCallBottomBar';
import { CallWrapupModal } from './CallWrapupModal';
import {
  ShieldCheck,
  Sparkles,
  Info,
  User,
  CreditCard,
  Calendar,
  Clock,
  Layers,
  ChevronDown,
  Building2,
  PhoneCall,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface LiveCopilotExperienceProps {
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const LiveCopilotExperience: React.FC<LiveCopilotExperienceProps> = ({
  onNavigateToWorkbench,
}) => {
  // Active Scenario State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    MOCK_LIVE_CALL_SCENARIOS[0].id
  );
  const activeScenario =
    MOCK_LIVE_CALL_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    MOCK_LIVE_CALL_SCENARIOS[0];

  // Dynamic Utterance Stream
  const [utterances, setUtterances] = useState<TranscriptUtterance[]>(
    activeScenario.initialUtterances
  );
  const [streamIndex, setStreamIndex] = useState<number>(0);

  // Call Audio State
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(102); // 01:42
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [talkTimeAgentPercent, setTalkTimeAgentPercent] = useState<number>(38);
  const [talkTimeDebtorPercent, setTalkTimeDebtorPercent] = useState<number>(62);
  const [currentSpeaker, setCurrentSpeaker] = useState<'collector' | 'debtor' | 'silence'>('debtor');

  // Wrap-up modal state
  const [isWrapupOpen, setIsWrapupOpen] = useState<boolean>(false);
  const [activePromptText, setActivePromptText] = useState<string | null>(null);
  const [committedRecord, setCommittedRecord] = useState<any | null>(null);

  // Switch scenario effect
  useEffect(() => {
    setUtterances(activeScenario.initialUtterances);
    setStreamIndex(0);
    setCallDurationSeconds(102);
    setIsOnHold(false);
    setIsMuted(false);
    setCommittedRecord(null);
  }, [selectedScenarioId]);

  // Live Timer Simulation
  useEffect(() => {
    if (isOnHold || isWrapupOpen) return;
    const interval = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOnHold, isWrapupOpen]);

  // Simulate next incoming utterance from streaming queue
  const handleSimulateNextUtterance = () => {
    if (streamIndex < activeScenario.streamUtterances.length) {
      const nextUtterance = activeScenario.streamUtterances[streamIndex];
      setUtterances((prev) => [...prev, nextUtterance]);
      setStreamIndex((prev) => prev + 1);
      setCurrentSpeaker(nextUtterance.speaker);
    }
  };

  const hasMoreUtterances = streamIndex < activeScenario.streamUtterances.length;

  const handleConfirmDisposition = (disposition: any) => {
    setCommittedRecord(disposition);
    setIsWrapupOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div
      id="live-ai-copilot-screen"
      className="flex-1 flex flex-col h-full min-h-[85vh] bg-[#F8FAFC] overflow-hidden"
    >
      {/* 1. Authoritative Account Context & Advisory Banner */}
      <div className="bg-white border-b border-slate-200 shadow-2xs shrink-0">
        {/* Top Explicit Advisory Disclaimer */}
        <div className="bg-violet-950 text-violet-100 px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-violet-800 text-violet-300">
              <Sparkles className="w-3 h-3 text-violet-200" />
            </span>
            <span className="font-semibold text-white">
              AI Copilot Advisory Mode:
            </span>
            <span className="text-violet-200 text-[11px]">
              AI guidance is probabilistic and advisory only. Core ledger balances and formal debt agreements require operator confirmation.
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-violet-300">
            <span>FDCPA Mini-Miranda: Recorded</span>
            <span>•</span>
            <span>TCPA Two-Party Consent: Verified</span>
          </div>
        </div>

        {/* Account Info Strip */}
        <div className="px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Account & Debtor Identity */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                <User className="w-4 h-4 text-slate-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                    {activeScenario.accountContext.debtorName}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {activeScenario.accountContext.accountNumber}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Ledger Verified
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 font-mono">
                  <span>SSN: {activeScenario.accountContext.maskedSSN}</span>
                  <span>•</span>
                  <span>{activeScenario.accountContext.state} ({activeScenario.accountContext.currentLocalTime})</span>
                  <span>•</span>
                  <span className="text-slate-600 font-sans">{activeScenario.accountContext.originalCreditor}</span>
                </div>
              </div>
            </div>

            {/* Balances & Delinquency */}
            <div className="hidden md:flex items-center gap-3 border-l border-slate-200 pl-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                  Authoritative Balance
                </span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  {formatCurrency(activeScenario.accountContext.totalOutstandingBalance)}
                </span>
              </div>

              <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
                <div>Principal: {formatCurrency(activeScenario.accountContext.principalBalance)}</div>
                <div>Accrued Fees: {formatCurrency(activeScenario.accountContext.accruedFeesAndInterest)}</div>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                  Delinquency Stage
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {activeScenario.accountContext.daysPastDue} DPD • {activeScenario.accountContext.delinquencyStage}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Selector Dropdown for Testing/Demo */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Simulate Debtor:
            </span>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
            >
              {MOCK_LIVE_CALL_SCENARIOS.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.label} ({sc.badge})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ledger Confirmation Banner if disposition was submitted */}
        {committedRecord && (
          <div className="bg-emerald-50 border-t border-emerald-200 px-4 lg:px-8 py-2 flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Core Ledger Write Verified:</strong> Disposition committed as{' '}
                <span className="font-mono font-bold">{committedRecord.label}</span>.
                {committedRecord.ptpAmount && (
                  <span> PTP Amount: ${committedRecord.ptpAmount.toFixed(2)} on {committedRecord.ptpDate}.</span>
                )}
              </span>
            </div>
            <button
              onClick={() => setCommittedRecord(null)}
              className="text-[10px] font-mono text-emerald-700 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Two-Column Viewport (CENTER: Live Transcript | RIGHT: AI Copilot) */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* CENTER PANEL: Live Transcript */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          <LiveTranscriptPanel
            utterances={utterances}
            currentSpeaker={currentSpeaker}
            isLiveStreaming={!isOnHold}
            onSimulateNextUtterance={handleSimulateNextUtterance}
            hasMoreUtterances={hasMoreUtterances}
          />
        </div>

        {/* RIGHT PANEL: AI Copilot Guidance Panel */}
        <div className="w-full lg:w-[460px] xl:w-[500px] shrink-0 h-full flex flex-col">
          <AiCopilotGuidancePanel
            prioritySignal={activeScenario.prioritySignal}
            conversationSignals={activeScenario.conversationSignals}
            currentUnderstanding={activeScenario.currentUnderstanding}
            suggestedQuestions={activeScenario.suggestedQuestions}
            missingInfo={activeScenario.missingInfo}
            guidance={activeScenario.guidance}
            onUsePrompt={(text) => {
              setActivePromptText(text);
            }}
            onJumpToTimestamp={(ts) => {
              // Highlight utterance
              const target = document.getElementById(`utterance-utt-8`);
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                target.classList.add('ring-2', 'ring-indigo-400');
                setTimeout(() => target.classList.remove('ring-2', 'ring-indigo-400'), 2500);
              }
            }}
          />
        </div>
      </div>

      {/* 3. BOTTOM CONTROL BAR: Call controls, recording state, session timer, end interaction */}
      <LiveCallBottomBar
        onEndCall={() => setIsWrapupOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        isOnHold={isOnHold}
        onToggleHold={() => setIsOnHold(!isOnHold)}
        callDurationSeconds={callDurationSeconds}
        talkTimeAgentPercent={talkTimeAgentPercent}
        talkTimeDebtorPercent={talkTimeDebtorPercent}
        isRecording={isRecording}
      />

      {/* 4. Call Wrap-Up / Disposition Modal */}
      <CallWrapupModal
        isOpen={isWrapupOpen}
        onClose={() => setIsWrapupOpen(false)}
        onConfirmDisposition={handleConfirmDisposition}
        account={activeScenario.accountContext}
        understanding={activeScenario.currentUnderstanding}
        callDurationSeconds={callDurationSeconds}
      />
    </div>
  );
};
