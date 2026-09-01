/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExecutionStatus } from '../../types/postCallReview';
import { Clock, CheckCircle2, ShieldCheck, AlertOctagon, HelpCircle } from 'lucide-react';

interface ExecutionStateBadgeProps {
  status: ExecutionStatus;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

export const ExecutionStateBadge: React.FC<ExecutionStateBadgeProps> = ({
  status,
  size = 'md',
  showDescription = false,
}) => {
  const config = {
    PENDING: {
      label: 'PENDING',
      subtitle: 'AI Advisory • Unconfirmed',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      dot: 'bg-amber-500',
      icon: Clock,
      description: 'AI-generated recommendation. Not yet reviewed or authorized by an operator.',
    },
    CONFIRMED: {
      label: 'CONFIRMED',
      subtitle: 'Operator Authorized • Queued',
      bg: 'bg-indigo-50',
      text: 'text-indigo-900',
      border: 'border-indigo-300',
      dot: 'bg-indigo-600',
      icon: CheckCircle2,
      description: 'Reviewed and confirmed by human operator. Queued for core execution pipeline.',
    },
    EXECUTED_VERIFIED: {
      label: 'EXECUTED_VERIFIED',
      subtitle: 'Ledger Committed • Verified',
      bg: 'bg-emerald-50',
      text: 'text-emerald-950',
      border: 'border-emerald-300',
      dot: 'bg-emerald-600',
      icon: ShieldCheck,
      description: 'Successfully committed to the core banking ledger with cryptographic receipt.',
    },
    EXECUTION_FAILED: {
      label: 'EXECUTION_FAILED',
      subtitle: 'Execution Error • Action Needed',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      border: 'border-rose-300',
      dot: 'bg-rose-600',
      icon: AlertOctagon,
      description: 'Core engine rejected transaction or timeout occurred. Operator intervention required.',
    },
  }[status];

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }[size];

  return (
    <div className="inline-flex flex-col">
      <span
        className={`inline-flex items-center font-mono font-bold uppercase rounded-md border ${config.bg} ${config.text} ${config.border} ${sizeClasses} shadow-2xs`}
        title={config.description}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
        <Icon className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>{config.label}</span>
      </span>

      {showDescription && (
        <span className="text-[10px] font-mono text-slate-500 mt-0.5">
          {config.subtitle}
        </span>
      )}
    </div>
  );
};
