import React, { useState } from 'react';
import { CollectionGap } from '../../types/accountDetail';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AccountCollectionGapsTabProps {
  gaps: CollectionGap[];
}

export const AccountCollectionGapsTab: React.FC<AccountCollectionGapsTabProps> = ({ gaps }) => {
  const [gapList, setGapList] = useState<CollectionGap[]>(gaps);
  const [remediatedGaps, setRemediatedGaps] = useState<Record<string, boolean>>({});

  const handleRemediate = (id: string) => {
    setRemediatedGaps((prev) => ({ ...prev, [id]: true }));
    setGapList((prev) =>
      prev.map((g) => (g.id === id ? { ...g, resolved: true } : g))
    );
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
            CRITICAL GAP
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            HIGH SEVERITY
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-300">
            MEDIUM
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Collection Gaps & Cadence SLA Monitor ({gapList.length} Items)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Automated detection of cadence delays, overdue touchpoints, and regulatory SLA risks.
          </p>
        </div>
      </div>

      {/* Gaps List */}
      {gapList.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-xl">
          Zero collection gaps detected. Account is in full SLA compliance.
        </div>
      ) : (
        <div className="space-y-4">
          {gapList.map((gap) => (
            <div
              key={gap.id}
              className={`rounded-xl border p-4 transition-all space-y-3 ${
                gap.resolved
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-amber-200 bg-amber-50/20'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900 font-mono">
                    {gap.title}
                  </span>
                  {getSeverityBadge(gap.severity)}
                  {gap.resolved && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>RESOLVED</span>
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-slate-500">
                  Detected: {gap.detectedAt} ({gap.durationDays}d delay)
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {gap.description}
              </p>

              {/* Suggested Remediation Box */}
              <div className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 font-mono">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">
                    Automated Remediation:
                  </span>
                  <span className="text-slate-800 font-semibold">{gap.suggestedRemediation}</span>
                </div>

                {!gap.resolved && (
                  <button
                    onClick={() => handleRemediate(gap.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
                  >
                    <span>{gap.remediationActionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
