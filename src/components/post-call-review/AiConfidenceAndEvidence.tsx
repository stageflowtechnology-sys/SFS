/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PostCallReviewRecord } from '../../types/postCallReview';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Quote,
  Activity,
  Mic,
  Cpu,
  BarChart2,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AiConfidenceAndEvidenceProps {
  review: PostCallReviewRecord;
  onJumpToTimestamp?: (time: string) => void;
}

export const AiConfidenceAndEvidence: React.FC<AiConfidenceAndEvidenceProps> = ({
  review,
  onJumpToTimestamp,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const { aiConfidence } = review;

  const filteredEvidence =
    filterCategory === 'ALL'
      ? aiConfidence.evidence
      : aiConfidence.evidence.filter((e) => e.category === filterCategory);

  return (
    <div
      id="ai-confidence-evidence-panel"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0"
    >
      {/* Panel Header */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-600 text-white shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                AI Inference Calibration & Verifiable Evidence
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-50 text-violet-700 border border-violet-200">
                Audited Inference
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Model: {aiConfidence.modelEngine}
            </p>
          </div>
        </div>

        {/* Overall Confidence Badge & Meter */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-900">
              Overall Inference Confidence
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
              {aiConfidence.confidenceTier} Certainty
            </span>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-950 text-white font-mono font-bold text-base shadow-sm border border-violet-800">
            {aiConfidence.overallConfidence}%
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* 1. Sub-Score Calibration Grid */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block">
            Multimodal Calibration Metrics
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {aiConfidence.subScores.map((sub, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600 font-semibold truncate" title={sub.dimension}>
                    {sub.dimension}
                  </span>
                  <span className="font-bold text-violet-700">{sub.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-violet-600 rounded-full"
                    style={{ width: `${sub.score}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                  {sub.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Acoustic & Behavioral Signals */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-violet-600" />
              Detected Acoustic & Behavioral Signals
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {aiConfidence.signals.length} Signal Vectors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiConfidence.signals.map((sig) => (
              <div
                key={sig.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase ${
                        sig.level === 'POSITIVE'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : sig.level === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {sig.category} • {sig.level}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{sig.name}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{sig.description}</p>
                </div>

                <div className="text-right font-mono shrink-0">
                  <div className="text-xs font-bold text-violet-900">{sig.score}%</div>
                  <div className="text-[10px] text-slate-400">{sig.evidenceTime}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Evidence Citations & Transcript Grounding */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-violet-600" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                Grounding Evidence & Transcript Citations ({filteredEvidence.length})
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              {['ALL', 'FINANCIAL_COMMITMENT', 'STATUTORY_DISCLOSURE', 'TRANSCRIPT_CITATION', 'ENTITY_DISCOVERY'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      filterCategory === cat
                        ? 'bg-violet-900 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cat === 'ALL' ? 'All Proof' : cat.replace('_', ' ')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Citations List */}
          <div className="space-y-3">
            {filteredEvidence.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all space-y-2 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onJumpToTimestamp?.(ev.timestamp)}
                      className="px-2 py-0.5 rounded bg-violet-100 hover:bg-violet-200 text-violet-900 font-mono text-xs font-bold border border-violet-300 flex items-center gap-1 transition-colors"
                      title="Jump audio player to timestamp"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{ev.timestamp}</span>
                    </button>
                    <span className="text-xs font-bold text-slate-800">{ev.speaker}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-white text-slate-600 border border-slate-200">
                      {ev.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{ev.confidence}% Confidence</span>
                  </div>
                </div>

                {/* Verbatim Quote */}
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs italic text-slate-800 font-serif leading-relaxed">
                  {ev.quote}
                </div>

                {/* Extracted Fact */}
                <div className="flex items-center gap-2 text-xs text-violet-950 font-medium">
                  <span className="font-mono text-[10px] uppercase text-violet-700 font-bold">
                    Extracted Fact:
                  </span>
                  <span>{ev.extractedFact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
