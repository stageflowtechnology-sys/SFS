import React from 'react';
import { StateOrigin } from '../../types/design-system';
import { OriginBadge } from './OriginBadge';
import {
  Sparkles,
  UserCheck,
  RefreshCw,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface TimelineItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  origin: StateOrigin;
  operatorId?: string;
  confidence?: number;
  metadata?: { label: string; value: string }[];
  status?: 'completed' | 'in_progress' | 'failed' | 'pending';
  hash?: string;
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
  density?: 'compact' | 'standard';
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  className = '',
  density = 'standard',
}) => {
  const getOriginNode = (origin: StateOrigin) => {
    switch (origin) {
      case 'AI_RECOMMENDATION':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 border border-dashed border-indigo-400 text-indigo-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        );
      case 'HUMAN_DECISION':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-50 border border-amber-400 text-amber-800 shadow-2xs">
            <UserCheck className="w-3.5 h-3.5" />
          </div>
        );
      case 'SYSTEM_EXECUTION':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-50 border border-cyan-400 text-cyan-800 shadow-2xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          </div>
        );
      case 'VERIFIED_GROUND_TRUTH':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        );
      case 'EXECUTION_FAILED':
        return (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 border border-rose-400 text-rose-800 shadow-2xs">
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  const getOriginCardStyle = (origin: StateOrigin) => {
    switch (origin) {
      case 'AI_RECOMMENDATION':
        return 'border-dashed border-indigo-300 bg-indigo-50/40 text-indigo-950';
      case 'HUMAN_DECISION':
        return 'border-amber-300 bg-amber-50/40 text-amber-950';
      case 'SYSTEM_EXECUTION':
        return 'border-cyan-300 bg-cyan-50/40 text-cyan-950';
      case 'VERIFIED_GROUND_TRUTH':
        return 'border-2 border-emerald-400 bg-emerald-50/40 text-emerald-950';
      case 'EXECUTION_FAILED':
        return 'border-rose-300 bg-rose-50/40 text-rose-950';
    }
  };

  return (
    <div className={`relative pl-6 space-y-6 ${className}`}>
      {/* Central continuous spine line */}
      <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-slate-200" />

      {items.map((item, idx) => (
        <div key={item.id || idx} className="relative flex items-start gap-4 group">
          {/* Origin Icon Node */}
          <div className="relative z-10 shrink-0 mt-0.5">
            {getOriginNode(item.origin)}
          </div>

          {/* Event Content Container */}
          <div
            className={`flex-1 rounded-lg border p-3.5 transition-all duration-150 ${getOriginCardStyle(
              item.origin
            )} shadow-2xs`}
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-black/5 pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-900">{item.title}</span>
                <OriginBadge
                  origin={item.origin}
                  size="xs"
                  confidence={item.confidence}
                  operatorId={item.operatorId}
                />
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{item.timestamp}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-700 leading-relaxed mt-2">{item.description}</p>

            {/* Metadata Badges & Cryptographic Ledger Hash */}
            {(item.metadata || item.hash) && (
              <div className="mt-2.5 pt-2 border-t border-black/5 flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono">
                {item.metadata && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {item.metadata.map((meta, mIdx) => (
                      <div key={mIdx} className="flex items-center gap-1">
                        <span className="text-slate-500 font-normal">{meta.label}:</span>
                        <span className="text-slate-900 font-semibold">{meta.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {item.hash && (
                  <div className="flex items-center gap-1 text-slate-500 bg-white/70 px-1.5 py-0.5 rounded border border-slate-200">
                    <span>Audit Ref:</span>
                    <span className="text-slate-800 font-semibold">{item.hash}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
