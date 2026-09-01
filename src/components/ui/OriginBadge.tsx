import React from 'react';
import { StateOrigin, OriginMeta } from '../../types/design-system';
import { Sparkles, UserCheck, RefreshCw, ShieldCheck, AlertOctagon } from 'lucide-react';

export const ORIGIN_CONFIG: Record<StateOrigin, OriginMeta> = {
  AI_RECOMMENDATION: {
    origin: 'AI_RECOMMENDATION',
    title: 'AI Recommendation',
    subtitle: 'Model-Generated Suggestion',
    authoritative: false,
    legalStanding: 'Advisory (Non-Binding)',
    visualCue: 'Violet hairline border • Spark glyph • Confidence weight',
    badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-200/50',
    borderStyle: 'border-dashed border-indigo-300 bg-indigo-50/40',
    iconName: 'Sparkles',
    description: 'Statistical prediction based on debtor recovery patterns. Requires human confirmation or policy rule to execute.',
  },
  HUMAN_DECISION: {
    origin: 'HUMAN_DECISION',
    title: 'Human Authority',
    subtitle: 'Operator Discretion / Override',
    authoritative: true,
    legalStanding: 'Authorized Directive',
    visualCue: 'Amber badge • Operator ID hash • Audit signature',
    badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200 ring-1 ring-amber-200/50',
    borderStyle: 'border-amber-300 bg-amber-50/40',
    iconName: 'UserCheck',
    description: 'Explicit manual approval or override logged by a licensed collector, compliance officer, or operations manager.',
  },
  SYSTEM_EXECUTION: {
    origin: 'SYSTEM_EXECUTION',
    title: 'System Execution',
    subtitle: 'Deterministic Pipeline Dispatch',
    authoritative: true,
    legalStanding: 'In-Flight State',
    visualCue: 'Cyan pulse • Idempotency key • Active lock',
    badgeStyle: 'bg-cyan-50 text-cyan-800 border-cyan-200 ring-1 ring-cyan-200/50',
    borderStyle: 'border-cyan-300 bg-cyan-50/40',
    iconName: 'RefreshCw',
    description: 'Automated engine trigger (e.g. gateway payment debit, core banking sync, automated ACH batch).',
  },
  VERIFIED_GROUND_TRUTH: {
    origin: 'VERIFIED_GROUND_TRUTH',
    title: 'Verified Ground Truth',
    subtitle: 'Reconciled Ledger State',
    authoritative: true,
    legalStanding: 'Statutory & Reconciled Proof',
    visualCue: 'Emerald solid • Double checkmark • Bank ACK receipt',
    badgeStyle: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-1 ring-emerald-200/50',
    borderStyle: 'border-emerald-300 bg-emerald-50/40',
    iconName: 'ShieldCheck',
    description: 'Confirmed settlement or legal instrument reconciled against counterparty banking rails. Immutable record.',
  },
  EXECUTION_FAILED: {
    origin: 'EXECUTION_FAILED',
    title: 'Execution Failure',
    subtitle: 'System / Gateway Exception',
    authoritative: false,
    legalStanding: 'Failed Transaction (Rollback)',
    visualCue: 'Crimson solid • Error code • Retry circuit breaker',
    badgeStyle: 'bg-rose-50 text-rose-800 border-rose-200 ring-1 ring-rose-200/50',
    borderStyle: 'border-rose-300 bg-rose-50/40',
    iconName: 'AlertOctagon',
    description: 'Payment network decline, network socket timeout, or compliance reject. State rolled back to pre-execution checkpoint.',
  },
};

interface OriginBadgeProps {
  origin: StateOrigin;
  size?: 'xs' | 'sm' | 'md';
  showIcon?: boolean;
  confidence?: number;
  operatorId?: string;
  className?: string;
}

export const OriginBadge: React.FC<OriginBadgeProps> = ({
  origin,
  size = 'sm',
  showIcon = true,
  confidence,
  operatorId,
  className = '',
}) => {
  const config = ORIGIN_CONFIG[origin];

  const getIcon = () => {
    switch (origin) {
      case 'AI_RECOMMENDATION':
        return <Sparkles className="w-3 h-3 text-indigo-600" />;
      case 'HUMAN_DECISION':
        return <UserCheck className="w-3 h-3 text-amber-600" />;
      case 'SYSTEM_EXECUTION':
        return <RefreshCw className="w-3 h-3 text-cyan-600 animate-spin" />;
      case 'VERIFIED_GROUND_TRUTH':
        return <ShieldCheck className="w-3 h-3 text-emerald-600" />;
      case 'EXECUTION_FAILED':
        return <AlertOctagon className="w-3 h-3 text-rose-600" />;
    }
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
  };

  return (
    <div
      className={`inline-flex items-center rounded border font-mono ${config.badgeStyle} ${sizeClasses[size]} ${className}`}
      title={`${config.title}: ${config.description}`}
    >
      {showIcon && getIcon()}
      <span className="font-semibold tracking-wider uppercase text-[10px]">
        {origin === 'AI_RECOMMENDATION' ? 'AI Advisory' :
         origin === 'HUMAN_DECISION' ? 'Human Sign-off' :
         origin === 'SYSTEM_EXECUTION' ? 'System Run' :
         origin === 'VERIFIED_GROUND_TRUTH' ? 'Verified Truth' : 'Failed Task'}
      </span>
      {typeof confidence === 'number' && (
        <span className="ml-0.5 px-1 py-0.2 bg-indigo-100 text-indigo-800 rounded text-[9px] font-mono border border-indigo-200">
          {(confidence * 100).toFixed(0)}% conf
        </span>
      )}
      {operatorId && (
        <span className="ml-0.5 px-1 py-0.2 bg-amber-100 text-amber-800 rounded text-[9px] font-mono border border-amber-200">
          Op #{operatorId}
        </span>
      )}
    </div>
  );
};
