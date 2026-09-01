import React, { useState } from 'react';
import { AiPreCallBriefingData, TalkingPoint } from '../../types/preCallBriefing';
import { OriginBadge } from '../ui/OriginBadge';
import {
  MessageSquare,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  CornerDownRight,
  AlertCircle,
  Mic,
  Pin,
} from 'lucide-react';

interface SuggestedOpeningAndTalkingPointsProps {
  suggestedOpening: AiPreCallBriefingData['suggestedOpening'];
  talkingPoints: TalkingPoint[];
}

export const SuggestedOpeningAndTalkingPoints: React.FC<SuggestedOpeningAndTalkingPointsProps> = ({
  suggestedOpening,
  talkingPoints,
}) => {
  const [copiedOpening, setCopiedOpening] = useState(false);
  const [copiedPointId, setCopiedPointId] = useState<string | null>(null);
  const [expandedPointId, setExpandedPointId] = useState<string | null>(talkingPoints[0]?.id || null);

  const handleCopyOpening = () => {
    navigator.clipboard.writeText(suggestedOpening.verbatimScript);
    setCopiedOpening(true);
    setTimeout(() => setCopiedOpening(false), 2000);
  };

  const handleCopyPoint = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPointId(id);
    setTimeout(() => setCopiedPointId(null), 2000);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white shadow-2xs">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
                6. Suggested Opening & Interactive Talking Points
              </h2>
              <OriginBadge origin="AI_RECOMMENDATION" size="xs" />
            </div>
            <div className="text-xs text-slate-600 font-sans">
              Tailored opening script with mandatory regulatory notice and objection handling playbooks.
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          {talkingPoints.length} Strategic Talking Points
        </div>
      </div>

      {/* Suggested Opening Script Box */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-700" />
            <span className="text-xs font-bold font-mono text-indigo-950 uppercase tracking-wider">
              Suggested Opening Statement (Verbatim Script)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {suggestedOpening.miniMirandaIncluded && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded font-bold border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Mini-Miranda Integrated</span>
              </span>
            )}
            <button
              onClick={handleCopyOpening}
              className="flex items-center gap-1 text-xs font-mono text-indigo-700 bg-white hover:bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 shadow-2xs transition-colors"
              title="Copy script to clipboard"
            >
              {copiedOpening ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-indigo-100 text-xs text-slate-900 leading-relaxed font-sans shadow-2xs">
          “{suggestedOpening.verbatimScript}”
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-indigo-900 pt-1">
          <div>
            <strong>Tone & Pacing: </strong>
            <span>{suggestedOpening.tonePacing}</span>
          </div>
          <div className="text-slate-500 text-[10px]">
            {suggestedOpening.debtorPersonalizationKey}
          </div>
        </div>
      </div>

      {/* Interactive Talking Points & Objection Rebuttals */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
          Key Talking Points & Objection Rebuttals
        </div>

        <div className="space-y-2.5">
          {talkingPoints.map((tp, idx) => {
            const isExpanded = expandedPointId === tp.id;

            return (
              <div
                key={tp.id}
                className="rounded-lg border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedPointId(isExpanded ? null : tp.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 cursor-pointer flex items-center justify-between gap-2 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {tp.topic}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                      {tp.context}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                      {(tp.confidenceScore * 100).toFixed(0)}% Fit
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-3.5 space-y-3 text-xs">
                  {/* Suggested Collector Prompt */}
                  <div className="bg-slate-50/70 p-3 rounded border border-slate-200 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase text-slate-500">
                      <span>Suggested Script Formulation</span>
                      <button
                        onClick={() => handleCopyPoint(tp.id, tp.suggestedPrompt)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold"
                      >
                        {copiedPointId === tp.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedPointId === tp.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-slate-900 font-medium leading-relaxed">
                      {tp.suggestedPrompt}
                    </div>
                  </div>

                  {/* Anticipated Objection & Rebuttal */}
                  {tp.objectionAnticipated && tp.suggestedRebuttal && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-2.5 rounded bg-amber-50/50 border border-amber-200/80 space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase text-amber-800 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-amber-700" />
                          <span>Anticipated Objection</span>
                        </div>
                        <div className="text-slate-800 italic leading-snug">
                          {tp.objectionAnticipated}
                        </div>
                      </div>

                      <div className="p-2.5 rounded bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase text-emerald-800 flex items-center gap-1">
                          <CornerDownRight className="w-3 h-3 text-emerald-700" />
                          <span>Suggested Rebuttal</span>
                        </div>
                        <div className="text-slate-900 font-medium leading-snug">
                          {tp.suggestedRebuttal}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Compliance Caution */}
                  {tp.complianceCaution && (
                    <div className="flex items-center gap-2 p-2 rounded bg-rose-50 border border-rose-200 text-[11px] font-mono text-rose-900">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>{tp.complianceCaution}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
