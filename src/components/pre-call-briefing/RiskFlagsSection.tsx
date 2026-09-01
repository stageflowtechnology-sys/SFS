import React from 'react';
import { RiskFlag } from '../../types/preCallBriefing';
import { OriginBadge } from '../ui/OriginBadge';
import {
  AlertTriangle,
  ShieldAlert,
  AlertOctagon,
  CheckCircle2,
  Scale,
  Clock,
  Info,
} from 'lucide-react';

interface RiskFlagsSectionProps {
  riskFlags: RiskFlag[];
}

export const RiskFlagsSection: React.FC<RiskFlagsSectionProps> = ({ riskFlags }) => {
  const getSeverityStyle = (severity: RiskFlag['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          container: 'border-rose-300 bg-rose-50/60',
          badge: 'bg-rose-600 text-white font-bold',
          icon: <AlertOctagon className="w-4 h-4 text-rose-600" />,
        };
      case 'HIGH':
        return {
          container: 'border-amber-300 bg-amber-50/60',
          badge: 'bg-amber-600 text-white font-bold',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      case 'MEDIUM':
        return {
          container: 'border-yellow-300 bg-yellow-50/50',
          badge: 'bg-yellow-600 text-white font-bold',
          icon: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
        };
      case 'LOW':
      case 'INFORMATIONAL':
      default:
        return {
          container: 'border-slate-200 bg-slate-50',
          badge: 'bg-slate-700 text-white font-semibold',
          icon: <Info className="w-4 h-4 text-slate-600" />,
        };
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-rose-100 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
              5. Account Risk Flags & Regulatory Compliance
            </h2>
            <div className="text-xs text-slate-600 font-sans">
              Statutory disclosure mandates, broken commitment alerts, and litigation risk triggers.
            </div>
          </div>
        </div>

        <div className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
          {riskFlags.filter((r) => r.severity === 'CRITICAL' || r.severity === 'HIGH').length} Active High/Critical Flags
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="space-y-3">
        {riskFlags.map((flag) => {
          const style = getSeverityStyle(flag.severity);

          return (
            <div
              key={flag.id}
              className={`rounded-lg border p-3.5 space-y-2 transition-all ${style.container}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {style.icon}
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {flag.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${style.badge}`}>
                    {flag.severity}
                  </span>
                </div>

                <OriginBadge origin={flag.origin} size="xs" />
              </div>

              <div className="text-xs text-slate-800 leading-relaxed pl-6">
                {flag.description}
              </div>

              <div className="bg-white/80 p-2.5 rounded border border-slate-200/80 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 ml-6">
                <div className="flex items-center gap-1.5 text-slate-900">
                  <strong className="text-indigo-900 uppercase text-[10px]">Action Required: </strong>
                  <span>{flag.actionRequired}</span>
                </div>
                {flag.statutoryReference && (
                  <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shrink-0">
                    Ref: {flag.statutoryReference}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
