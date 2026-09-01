/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  PrioritySignal,
  ConversationSignal,
  CurrentUnderstanding,
  SuggestedQuestion,
  MissingInformationItem,
  ConversationGuidance,
} from '../../types/liveCopilot';
import { PrioritySignalCard } from './PrioritySignalCard';
import { ConversationSignalsCard } from './ConversationSignalsCard';
import { CurrentUnderstandingCard } from './CurrentUnderstandingCard';
import { SuggestedQuestionCard } from './SuggestedQuestionCard';
import { MissingInformationCard } from './MissingInformationCard';
import { ConversationGuidanceCard } from './ConversationGuidanceCard';
import {
  Sparkles,
  Zap,
  Activity,
  BrainCircuit,
  MessageSquareQuote,
  ListChecks,
  Compass,
  Filter,
  Shield,
} from 'lucide-react';

interface AiCopilotGuidancePanelProps {
  prioritySignal: PrioritySignal;
  conversationSignals: ConversationSignal[];
  currentUnderstanding: CurrentUnderstanding;
  suggestedQuestions: SuggestedQuestion[];
  missingInfo: MissingInformationItem[];
  guidance: ConversationGuidance;
  onUsePrompt?: (text: string) => void;
  onJumpToTimestamp?: (timestamp: string) => void;
}

export const AiCopilotGuidancePanel: React.FC<AiCopilotGuidancePanelProps> = ({
  prioritySignal,
  conversationSignals,
  currentUnderstanding,
  suggestedQuestions,
  missingInfo,
  guidance,
  onUsePrompt,
  onJumpToTimestamp,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'priority' | 'signals' | 'understanding' | 'questions' | 'gaps' | 'guidance'>('all');

  return (
    <div
      id="right-ai-copilot-panel"
      className="flex-1 flex flex-col h-full bg-slate-50/50 border-l border-slate-200 overflow-hidden"
    >
      {/* Panel Top Header with Clear AI Guidance Styling */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white px-4 py-3 shrink-0 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/30 border border-violet-400/40 flex items-center justify-center text-violet-300 shadow-xs">
            <Sparkles className="w-4 h-4 text-violet-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight text-white">
                Live AI Copilot
              </h3>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-violet-500/30 text-violet-200 border border-violet-400/30">
                Advisory Layer
              </span>
            </div>
            <p className="text-[11px] text-violet-200/80 leading-tight">
              Real-time conversational intelligence & strategic playbook
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
        </div>
      </div>

      {/* Quick Filter Strip for rapid navigation during call */}
      <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Intel (6)
        </button>
        <button
          onClick={() => setActiveFilter('priority')}
          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
            activeFilter === 'priority'
              ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3 h-3 text-rose-500" />
          <span>Priority</span>
        </button>
        <button
          onClick={() => setActiveFilter('signals')}
          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
            activeFilter === 'signals'
              ? 'bg-violet-100 text-violet-800 font-bold border border-violet-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3 h-3 text-violet-500" />
          <span>Signals</span>
        </button>
        <button
          onClick={() => setActiveFilter('questions')}
          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
            activeFilter === 'questions'
              ? 'bg-indigo-100 text-indigo-800 font-bold border border-indigo-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquareQuote className="w-3 h-3 text-indigo-500" />
          <span>Questions</span>
        </button>
        <button
          onClick={() => setActiveFilter('understanding')}
          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
            activeFilter === 'understanding'
              ? 'bg-violet-100 text-violet-800 font-bold border border-violet-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BrainCircuit className="w-3 h-3 text-violet-500" />
          <span>Context</span>
        </button>
        <button
          onClick={() => setActiveFilter('gaps')}
          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
            activeFilter === 'gaps'
              ? 'bg-slate-100 text-slate-800 font-bold border border-slate-300'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ListChecks className="w-3 h-3 text-slate-500" />
          <span>Gaps</span>
        </button>
        <button
          onClick={() => setActiveFilter('guidance')}
          className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors shrink-0 flex items-center gap-1 ${
            activeFilter === 'guidance'
              ? 'bg-violet-100 text-violet-800 font-bold border border-violet-200'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-3 h-3 text-violet-500" />
          <span>Guidance</span>
        </button>
      </div>

      {/* Scrollable Intelligence Feed */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
        {/* 1. Priority Signal */}
        {(activeFilter === 'all' || activeFilter === 'priority') && (
          <PrioritySignalCard
            signal={prioritySignal}
            onUsePrompt={onUsePrompt}
            onJumpToTimestamp={onJumpToTimestamp}
          />
        )}

        {/* 2. Suggested Next Question */}
        {(activeFilter === 'all' || activeFilter === 'questions') && (
          <SuggestedQuestionCard
            questions={suggestedQuestions}
            onUseQuestion={onUsePrompt}
          />
        )}

        {/* 3. Conversation Signals */}
        {(activeFilter === 'all' || activeFilter === 'signals') && (
          <ConversationSignalsCard signals={conversationSignals} />
        )}

        {/* 4. Current Understanding */}
        {(activeFilter === 'all' || activeFilter === 'understanding') && (
          <CurrentUnderstandingCard
            understanding={currentUnderstanding}
            onJumpToUtterance={(id) => onJumpToTimestamp?.(id)}
          />
        )}

        {/* 5. Missing Information */}
        {(activeFilter === 'all' || activeFilter === 'gaps') && (
          <MissingInformationCard items={missingInfo} />
        )}

        {/* 6. Conversation Guidance */}
        {(activeFilter === 'all' || activeFilter === 'guidance') && (
          <ConversationGuidanceCard guidance={guidance} />
        )}
      </div>
    </div>
  );
};
