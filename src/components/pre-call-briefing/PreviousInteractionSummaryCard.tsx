import React from 'react';
import { PastInteraction, AiPreCallBriefingData } from '../../types/preCallBriefing';
import {
  History,
  PhoneCall,
  MessageSquare,
  Mail,
  User,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

interface PreviousInteractionSummaryCardProps {
  interactions: PastInteraction[];
  aiSummary: AiPreCallBriefingData['interactionSummary'];
}

export const PreviousInteractionSummaryCard: React.FC<PreviousInteractionSummaryCardProps> = ({
  interactions,
  aiSummary,
}) => {
  const getChannelIcon = (channel: PastInteraction['channel']) => {
    switch (channel) {
      case 'VOICE':
        return <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />;
      case 'SMS':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white shadow-2xs">
          <History className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
            4. Previous Interaction Summary & Historical Logs
          </h2>
          <div className="text-xs text-slate-600 font-sans">
            Chronological contact audits paired with AI distilled behavioral takeaways.
          </div>
        </div>
      </div>

      {/* AI Distilled Takeaway Box */}
      <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50/40 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-indigo-950">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Distilled Interaction Takeaway</span>
          </div>
          <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded font-semibold">
            Synthesized from {interactions.length} Interactions
          </span>
        </div>

        <div className="text-xs text-indigo-950 font-medium leading-relaxed">
          {aiSummary.distilledAiTakeaway}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-indigo-100 text-xs font-mono">
          <div className="bg-white/90 p-2.5 rounded border border-indigo-200/70">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Debtor Stated Position:</span>
            <div className="text-slate-900 italic mt-0.5">{aiSummary.debtorStatedPosition}</div>
          </div>
          <div className="bg-white/90 p-2.5 rounded border border-indigo-200/70">
            <span className="text-[10px] uppercase text-slate-500 font-bold">Historical Reliability:</span>
            <div className="text-slate-900 font-semibold mt-0.5">{aiSummary.historicalReliability}</div>
          </div>
        </div>
      </div>

      {/* Chronological Historical Log (Ground Truth) */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider flex items-center justify-between">
          <span>Chronological Contact Audits ({interactions.length})</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Audit Recorded</span>
        </div>

        <div className="space-y-2 divide-y divide-slate-100 border border-slate-200 rounded-lg p-2 bg-slate-50/40">
          {interactions.map((item, idx) => (
            <div key={item.id} className={`pt-2 ${idx === 0 ? 'pt-0' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono mb-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-semibold">
                    {getChannelIcon(item.channel)}
                    <span>{item.channel}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.disposition}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>{item.timestamp}</span>
                  {item.recordingDuration && (
                    <span className="bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded text-[10px]">
                      {item.recordingDuration}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs text-slate-700 pl-2 leading-relaxed">
                {item.summary}
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 pl-2 mt-1">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{item.operatorName}</span>
                </div>
                {item.ptpAmount && (
                  <span className="text-emerald-700 font-bold">
                    PTP: ${item.ptpAmount.toLocaleString()} due {item.ptpDueDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
