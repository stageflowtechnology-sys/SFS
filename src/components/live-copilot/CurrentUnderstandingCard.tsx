/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CurrentUnderstanding } from '../../types/liveCopilot';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Unlock,
  ShieldCheck,
  Bot,
} from 'lucide-react';

interface CurrentUnderstandingCardProps {
  understanding: CurrentUnderstanding;
  onJumpToUtterance?: (utteranceId: string) => void;
}

export const CurrentUnderstandingCard: React.FC<CurrentUnderstandingCardProps> = ({
  understanding,
  onJumpToUtterance,
}) => {
  return (
    <div
      id="card-current-understanding"
      className="rounded-xl border border-violet-200/90 bg-white p-3.5 shadow-2xs space-y-3"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 border-b border-violet-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-violet-100 text-violet-700">
            <BrainCircuit className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Current Understanding</span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-violet-100 text-violet-800 border border-violet-200">
                {understanding.confidence}% Synth.
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          Updated {understanding.lastUpdatedTimestamp}
        </span>
      </div>

      {/* AI Distilled Synthesis Box */}
      <div className="p-2.5 rounded-lg bg-violet-50/50 border border-violet-100 text-xs text-slate-800 leading-relaxed relative">
        <div className="text-[10px] font-bold uppercase tracking-wider text-violet-700 font-mono mb-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-violet-600" />
          <span>Real-time Situational Synthesis</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-700">
          {understanding.synthesis}
        </p>
      </div>

      {/* Key Extracted Facts Grid */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
          <span>Extracted Fact Ledger</span>
          <span className="text-[9px] font-normal lowercase text-slate-500">
            authoritative vs inferred
          </span>
        </div>

        <div className="grid grid-cols-1 gap-1.5">
          {understanding.keyFactsExtracted.map((fact) => (
            <div
              key={fact.id}
              className="flex items-start justify-between gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 transition-colors text-xs"
            >
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] font-medium text-slate-500 block truncate">
                  {fact.label}
                </span>
                <span className="text-xs font-semibold text-slate-900 block truncate">
                  {fact.value}
                </span>
              </div>

              <div className="shrink-0 flex items-center gap-1 pt-0.5">
                {fact.isAuthoritative ? (
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200"
                    title="Authoritative core ledger record"
                  >
                    <ShieldCheck className="w-2.5 h-2.5" />
                    Ledger
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold font-mono bg-violet-50 text-violet-700 border border-violet-200"
                    title="AI inferred from live transcript utterance"
                  >
                    <Bot className="w-2.5 h-2.5" />
                    AI Utterance
                  </span>
                )}
                {fact.verifiedFromUtteranceId && (
                  <button
                    onClick={() => onJumpToUtterance?.(fact.verifiedFromUtteranceId!)}
                    className="text-[10px] text-indigo-600 hover:underline font-mono"
                    title="Jump to utterance in transcript"
                  >
                    view
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objections & Concessions Split */}
      <div className="grid grid-cols-1 gap-2 pt-1">
        {/* Objections Raised */}
        {understanding.objectionsRaised.length > 0 && (
          <div className="p-2 rounded-lg border border-amber-200/80 bg-amber-50/40 text-[11px] space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1 text-[10px] uppercase font-mono">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Active Debtor Objections ({understanding.objectionsRaised.length})
            </span>
            <ul className="space-y-0.5 pl-3 list-disc text-amber-900 marker:text-amber-500">
              {understanding.objectionsRaised.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Unlocked Concessions */}
        {understanding.unlockedConcessions.length > 0 && (
          <div className="p-2 rounded-lg border border-emerald-200/80 bg-emerald-50/40 text-[11px] space-y-1">
            <span className="font-bold text-emerald-900 flex items-center gap-1 text-[10px] uppercase font-mono">
              <Unlock className="w-3 h-3 text-emerald-600" />
              Unlocked Concessions ({understanding.unlockedConcessions.length})
            </span>
            <ul className="space-y-0.5 pl-3 list-disc text-emerald-900 marker:text-emerald-500">
              {understanding.unlockedConcessions.map((conc, idx) => (
                <li key={idx}>{conc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
