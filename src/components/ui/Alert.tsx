import React from 'react';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  AlertOctagon,
  Info,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { StateOrigin } from '../../types/design-system';

export interface AlertProps {
  title: string;
  description?: React.ReactNode;
  originType?: StateOrigin;
  variant?: 'info' | 'warning' | 'success' | 'danger' | 'ai' | 'neutral';
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  metadata?: {
    label: string;
    value: string;
  }[];
  className?: string;
  onDismiss?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  description,
  originType,
  variant = 'info',
  action,
  metadata,
  className = '',
}) => {
  // Determine styling based on originType or fallback variant
  const getStyles = () => {
    if (originType === 'AI_RECOMMENDATION' || variant === 'ai') {
      return {
        bg: 'bg-indigo-50/70',
        border: 'border-l-4 border-l-indigo-600 border-indigo-200',
        textTitle: 'text-indigo-950',
        textBody: 'text-indigo-900/80',
        icon: <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />,
        pill: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        tag: 'AI Advisory (Non-Authoritative)',
      };
    }
    if (originType === 'HUMAN_DECISION' || variant === 'warning') {
      return {
        bg: 'bg-amber-50/70',
        border: 'border-l-4 border-l-amber-500 border-amber-200',
        textTitle: 'text-amber-950',
        textBody: 'text-amber-900/80',
        icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
        pill: 'bg-amber-100 text-amber-800 border-amber-200',
        tag: 'Human Review Required',
      };
    }
    if (originType === 'SYSTEM_EXECUTION') {
      return {
        bg: 'bg-cyan-50/70',
        border: 'border-l-4 border-l-cyan-500 border-cyan-200',
        textTitle: 'text-cyan-950',
        textBody: 'text-cyan-900/80',
        icon: <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin shrink-0 mt-0.5" />,
        pill: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        tag: 'In-Flight Pipeline Dispatch',
      };
    }
    if (originType === 'VERIFIED_GROUND_TRUTH' || variant === 'success') {
      return {
        bg: 'bg-emerald-50/70',
        border: 'border-l-4 border-l-emerald-600 border-emerald-200',
        textTitle: 'text-emerald-950',
        textBody: 'text-emerald-900/80',
        icon: <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
        pill: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        tag: 'Reconciled Ledger Truth',
      };
    }
    if (originType === 'EXECUTION_FAILED' || variant === 'danger') {
      return {
        bg: 'bg-rose-50/70',
        border: 'border-l-4 border-l-rose-500 border-rose-200',
        textTitle: 'text-rose-950',
        textBody: 'text-rose-900/80',
        icon: <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
        pill: 'bg-rose-100 text-rose-800 border-rose-200',
        tag: 'Execution Exception (Rollback)',
      };
    }
    return {
      bg: 'bg-slate-50',
      border: 'border-l-4 border-l-slate-400 border-slate-200',
      textTitle: 'text-slate-900',
      textBody: 'text-slate-600',
      icon: <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />,
      pill: 'bg-slate-100 text-slate-700 border-slate-200',
      tag: 'System Notice',
    };
  };

  const style = getStyles();

  return (
    <div
      className={`rounded border p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs ${style.bg} ${style.border} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        {style.icon}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-semibold tracking-tight ${style.textTitle}`}>{title}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-semibold uppercase tracking-wider ${style.pill}`}
            >
              {style.tag}
            </span>
          </div>
          {description && <div className={`${style.textBody} leading-relaxed font-normal`}>{description}</div>}

          {metadata && metadata.length > 0 && (
            <div className="flex items-center gap-3 mt-1 pt-1 border-t border-slate-200/80 font-mono text-[11px] text-slate-600 flex-wrap">
              {metadata.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <span className="text-slate-400">{item.label}:</span>
                  <span className="text-slate-800 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {action && (
        <button
          onClick={action.onClick}
          className="self-start md:self-center shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-white text-slate-800 hover:bg-slate-50 border border-slate-300 transition-colors shadow-2xs"
        >
          {action.icon || <ChevronRight className="w-3.5 h-3.5" />}
          <span>{action.label}</span>
        </button>
      )}
    </div>
  );
};
