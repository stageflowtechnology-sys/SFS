import React from 'react';
import { StateOrigin } from '../../types/design-system';
import { Sparkles, UserCheck, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

interface OriginCardWrapperProps {
  origin: StateOrigin;
  title: string;
  subtitle?: string;
  confidence?: number;
  operatorId?: string;
  timestamp?: string;
  children: React.ReactNode;
  actionButtons?: React.ReactNode;
  className?: string;
  id?: string;
}

export const OriginCardWrapper: React.FC<OriginCardWrapperProps> = ({
  origin,
  title,
  subtitle,
  confidence,
  operatorId,
  timestamp,
  children,
  actionButtons,
  className = '',
  id,
}) => {
  // Styles strictly aligned with the 4-part StageFlow origin distinction
  const getOriginStyles = () => {
    switch (origin) {
      case 'AI_RECOMMENDATION':
        return {
          container: 'border-2 border-dashed border-indigo-400/80 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-200/50',
          headerBg: 'bg-indigo-100/70 border-b border-indigo-200/80 text-indigo-900',
          icon: <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />,
          tag: 'AI RECOMMENDATION (NON-BINDING ADVISORY)',
          tagStyle: 'bg-indigo-200/80 text-indigo-900 border border-indigo-300 font-mono font-bold',
          standing: 'Statistical inference • Requires human operator confirmation before execution',
          standingStyle: 'text-indigo-700',
        };
      case 'HUMAN_DECISION':
        return {
          container: 'border-2 border-amber-400 bg-amber-50/40 shadow-xs ring-1 ring-amber-200/50',
          headerBg: 'bg-amber-100/70 border-b border-amber-200 text-amber-900',
          icon: <UserCheck className="w-4 h-4 text-amber-700" />,
          tag: 'HUMAN CONFIRMATION (AUTHORIZED)',
          tagStyle: 'bg-amber-200 text-amber-950 border border-amber-400 font-mono font-bold',
          standing: 'Operator Discretion & Legal Directive',
          standingStyle: 'text-amber-800',
        };
      case 'SYSTEM_EXECUTION':
        return {
          container: 'border-2 border-cyan-400 bg-cyan-50/40 shadow-xs ring-1 ring-cyan-200/50',
          headerBg: 'bg-cyan-100/70 border-b border-cyan-200 text-cyan-900',
          icon: <RefreshCw className="w-4 h-4 text-cyan-700 animate-spin" />,
          tag: 'SYSTEM EXECUTION (DISPATCHING)',
          tagStyle: 'bg-cyan-200 text-cyan-950 border border-cyan-400 font-mono font-bold',
          standing: 'In-Flight Pipeline Dispatch • Idempotency Locked',
          standingStyle: 'text-cyan-800',
        };
      case 'VERIFIED_GROUND_TRUTH':
        return {
          container: 'border-2 border-emerald-500 bg-emerald-50/40 shadow-xs ring-1 ring-emerald-200/50',
          headerBg: 'bg-emerald-100/70 border-b border-emerald-200 text-emerald-900',
          icon: <ShieldCheck className="w-4 h-4 text-emerald-700" />,
          tag: 'VERIFIED RESULT (AUTHORITATIVE TRUTH)',
          tagStyle: 'bg-emerald-200 text-emerald-950 border border-emerald-400 font-mono font-bold',
          standing: 'Immutable System Record • Reconciled against Bank/Ledger Rails',
          standingStyle: 'text-emerald-800',
        };
      default:
        return {
          container: 'border border-slate-200 bg-white shadow-xs',
          headerBg: 'bg-slate-50 border-b border-slate-200 text-slate-900',
          icon: <AlertCircle className="w-4 h-4 text-slate-600" />,
          tag: 'SYSTEM STATE',
          tagStyle: 'bg-slate-100 text-slate-700 border border-slate-200 font-mono',
          standing: 'Standard Record',
          standingStyle: 'text-slate-600',
        };
    }
  };

  const style = getOriginStyles();

  return (
    <div id={id} className={`rounded-xl overflow-hidden transition-all duration-200 ${style.container} ${className}`}>
      {/* Header with clear origin demarcation */}
      <div className={`px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 ${style.headerBg}`}>
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded bg-white/70 shadow-2xs shrink-0">
            {style.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${style.tagStyle}`}>
                {style.tag}
              </span>
              {typeof confidence === 'number' && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-200/90 text-indigo-950 border border-indigo-300">
                  {(confidence * 100).toFixed(0)}% Confidence
                </span>
              )}
              {operatorId && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-950 border border-amber-300">
                  Operator: {operatorId}
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{title}</h4>
          </div>
        </div>

        {timestamp && (
          <span className="font-mono text-[10px] text-slate-600 shrink-0">
            {timestamp}
          </span>
        )}
      </div>

      {/* Origin Standing Micro-banner */}
      <div className="px-4 py-1 bg-white/60 border-b border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
        <span className={style.standingStyle}>
          {style.standing}
        </span>
        {subtitle && (
          <span className="text-slate-500 truncate">{subtitle}</span>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 bg-white/80">
        {children}
      </div>

      {/* Action Strip (if provided) */}
      {actionButtons && (
        <div className="px-4 py-2.5 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-end gap-2">
          {actionButtons}
        </div>
      )}
    </div>
  );
};
