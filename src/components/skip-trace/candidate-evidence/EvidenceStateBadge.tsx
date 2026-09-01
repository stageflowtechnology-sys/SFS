import React from 'react';
import { EvidenceState } from '../../../types/skipTrace';
import { Eye, BrainCircuit, HelpCircle } from 'lucide-react';

interface EvidenceStateBadgeProps {
  state: EvidenceState;
  size?: 'sm' | 'md';
  className?: string;
}

export const EvidenceStateBadge: React.FC<EvidenceStateBadgeProps> = ({
  state,
  size = 'md',
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (state) {
      case 'OBSERVED':
        return {
          label: 'OBSERVED',
          subLabel: 'Direct Record',
          icon: Eye,
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'INFERRED':
        return {
          label: 'INFERRED',
          subLabel: 'Algorithmic Model',
          icon: BrainCircuit,
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
        };
      case 'UNKNOWN':
        return {
          label: 'UNKNOWN',
          subLabel: 'Unverified Data',
          icon: HelpCircle,
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  return (
    <span
      id={`badge-evidence-state-${state.toLowerCase()}`}
      className={`inline-flex items-center font-mono font-bold rounded-md border tracking-wider transition-all ${config.bg} ${sizeClasses[size]} ${className}`}
      title={`Evidence Classification: ${config.label} (${config.subLabel})`}
    >
      <IconComponent className={`${iconSizes[size]} shrink-0`} />
      <span>{config.label}</span>
    </span>
  );
};
