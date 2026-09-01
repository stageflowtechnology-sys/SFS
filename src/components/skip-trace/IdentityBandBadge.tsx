import React from 'react';
import { IdentityBand } from '../../types/skipTrace';
import { ShieldCheck, ShieldAlert, ShieldQuestion, ShieldX, Shield } from 'lucide-react';

interface IdentityBandBadgeProps {
  band: IdentityBand;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const IdentityBandBadge: React.FC<IdentityBandBadgeProps> = ({
  band,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (band) {
      case 'MATCH':
        return {
          label: 'MATCH',
          description: 'Verified 100% concordance across credit header and public records',
          icon: ShieldCheck,
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'PROBABLE':
        return {
          label: 'PROBABLE',
          description: 'High concordance across multiple independent public registries',
          icon: Shield,
          bg: 'bg-indigo-50',
          text: 'text-indigo-800',
          border: 'border-indigo-300',
          dot: 'bg-indigo-500',
        };
      case 'POSSIBLE':
        return {
          label: 'POSSIBLE',
          description: 'Partial match or single-source public record observation',
          icon: ShieldQuestion,
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'INSUFFICIENT':
        return {
          label: 'INSUFFICIENT',
          description: 'Insufficient public records or thin credit header footprint',
          icon: ShieldAlert,
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-300',
          dot: 'bg-slate-400',
        };
      case 'CONTRADICTED':
        return {
          label: 'CONTRADICTED',
          description: 'Contradictory public data, SSN collision, or deceased flag conflict',
          icon: ShieldX,
          bg: 'bg-rose-50',
          text: 'text-rose-800',
          border: 'border-rose-300',
          dot: 'bg-rose-500',
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold tracking-wider gap-1',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wider gap-1.5',
    lg: 'text-sm px-3 py-1.5 font-bold tracking-widest gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      id={`identity-band-${band.toLowerCase()}`}
      title={config.description}
      className={`inline-flex items-center rounded-md border font-mono uppercase transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <IconComponent className={`${iconSizes[size]} shrink-0`} />}
      <span>{config.label}</span>
    </span>
  );
};
