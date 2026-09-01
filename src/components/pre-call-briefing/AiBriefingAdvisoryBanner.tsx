import React from 'react';
import { AiPreCallBriefingData } from '../../types/preCallBriefing';
import { Sparkles, ShieldAlert, CheckCircle2, Cpu, Lock } from 'lucide-react';

interface AiBriefingAdvisoryBannerProps {
  briefing: AiPreCallBriefingData;
}

export const AiBriefingAdvisoryBanner: React.FC<AiBriefingAdvisoryBannerProps> = ({
  briefing,
}) => {
  return (
    <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50/50 p-4 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                AI Pre-Call Briefing • Advisory Guidance
              </span>
              <span className="font-mono text-[11px] text-indigo-700 font-semibold bg-white/80 px-2 py-0.5 rounded border border-indigo-200">
                Model Confidence: {(briefing.overallConfidence * 100).toFixed(1)}%
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                {briefing.modelVersion}
              </span>
            </div>
            <p className="text-xs text-indigo-950 mt-1 font-medium leading-relaxed max-w-4xl">
              <strong>Advisory Only Notice:</strong> This pre-call briefing provides statistical talking points, behavioral context, and settlement recommendations to prepare you for outreach. 
              <span className="text-indigo-900 font-semibold"> No account balances, delinquency stages, or legal rights have been altered.</span> All negotiations and stage transitions require licensed operator authorization.
            </p>
          </div>
        </div>

        {/* Governance Seal */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-center font-mono text-[11px] bg-white text-slate-700 px-3 py-1.5 rounded-md border border-indigo-200 shadow-2xs">
          <Lock className="w-3.5 h-3.5 text-indigo-600" />
          <span className="font-semibold text-slate-800">Human Authority Active</span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-700 font-bold">Ledger Unchanged</span>
        </div>
      </div>
    </div>
  );
};
