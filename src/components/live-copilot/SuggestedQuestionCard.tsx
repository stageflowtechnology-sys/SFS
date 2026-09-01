/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SuggestedQuestion } from '../../types/liveCopilot';
import {
  MessageSquareQuote,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCheck,
} from 'lucide-react';

interface SuggestedQuestionCardProps {
  questions: SuggestedQuestion[];
  onUseQuestion?: (text: string) => void;
}

export const SuggestedQuestionCard: React.FC<SuggestedQuestionCardProps> = ({
  questions,
  onUseQuestion,
}) => {
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedStyle, setSelectedStyle] = useState<'Direct' | 'Consultative' | 'Policy-Strict'>('Consultative');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [markedAsAsked, setMarkedAsAsked] = useState<Record<string, boolean>>({});
  const [showRationale, setShowRationale] = useState<boolean>(true);

  if (!questions || questions.length === 0) return null;

  const activeQuestion = questions[activeQuestionIndex] || questions[0];

  // Find alternative text if style is selected
  const currentText =
    activeQuestion.alternatives.find((alt) => alt.style === selectedStyle)?.text ||
    activeQuestion.text;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onUseQuestion?.(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleAsked = (id: string) => {
    setMarkedAsAsked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      id="card-suggested-question"
      className="rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50/40 via-white to-violet-50/20 p-3.5 shadow-2xs space-y-3"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-indigo-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-indigo-600 text-white shadow-2xs">
            <MessageSquareQuote className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Suggested Next Question</span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                {activeQuestion.confidence}% Tactical Match
              </span>
            </h4>
          </div>
        </div>

        {questions.length > 1 && (
          <div className="flex items-center gap-1">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveQuestionIndex(idx)}
                className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                  activeQuestionIndex === idx
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tone / Posture Pill Selector */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-mono font-semibold uppercase text-slate-400">
          Delivery Posture:
        </span>
        <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80">
          {(['Consultative', 'Direct', 'Policy-Strict'] as const).map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition-all ${
                selectedStyle === style
                  ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Phrasing Box */}
      <div className="relative p-3 rounded-lg border border-indigo-200/80 bg-white shadow-2xs group">
        <div className="text-xs font-semibold text-slate-900 leading-relaxed">
          &ldquo;{currentText}&rdquo;
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => handleCopy(currentText, activeQuestion.id)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {copiedId === activeQuestion.id ? (
              <>
                <Check className="w-3 h-3 text-emerald-200" />
                <span>Copied to Script!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Read to Debtor</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleAsked(activeQuestion.id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-colors ${
              markedAsAsked[activeQuestion.id]
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCheck className={`w-3 h-3 ${markedAsAsked[activeQuestion.id] ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>{markedAsAsked[activeQuestion.id] ? 'Asked' : 'Mark Asked'}</span>
          </button>
        </div>
      </div>

      {/* Tactical Rationale Toggle */}
      <div className="rounded-lg border border-slate-200/80 bg-slate-50/70 p-2 text-[11px]">
        <button
          onClick={() => setShowRationale(!showRationale)}
          className="w-full flex items-center justify-between text-slate-600 hover:text-slate-900 font-semibold"
        >
          <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            Tactical Rationale
          </span>
          {showRationale ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showRationale && (
          <p className="mt-1.5 text-slate-600 leading-relaxed text-[11px]">
            {activeQuestion.rationale}
          </p>
        )}
      </div>
    </div>
  );
};
