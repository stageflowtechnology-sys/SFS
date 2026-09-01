import React from 'react';
import { Inbox, Filter, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: 'inbox' | 'filter' | 'shield' | 'ai';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  title,
  description,
  action,
  className = '',
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'filter':
        return <Filter className="w-8 h-8 text-slate-500 stroke-[1.5]" />;
      case 'shield':
        return <ShieldAlert className="w-8 h-8 text-amber-500/80 stroke-[1.5]" />;
      case 'ai':
        return <Sparkles className="w-8 h-8 text-indigo-400 stroke-[1.5]" />;
      default:
        return <Inbox className="w-8 h-8 text-slate-500 stroke-[1.5]" />;
    }
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-8 rounded border border-dashed border-slate-300 bg-slate-50/50 text-center ${className}`}
    >
      <div className="p-3 rounded bg-white border border-slate-200 mb-3 shadow-xs">
        {getIcon()}
      </div>
      <h4 className="text-sm font-semibold text-slate-800 tracking-wide mb-1">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && (
        <Button variant="secondary" size="xs" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export const SkeletonRow: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <div className="w-full flex items-center gap-4 py-3 px-4 border-b border-slate-100 animate-pulse bg-slate-50/60">
      <div className="w-4 h-4 bg-slate-200 rounded" />
      <div className="w-32 h-3.5 bg-slate-200 rounded" />
      <div className="w-20 h-3.5 bg-slate-200/80 rounded font-mono" />
      <div className="w-16 h-4 bg-slate-200/60 rounded" />
      <div className="flex-1 h-3.5 bg-slate-200/40 rounded" />
      <div className="w-24 h-5 bg-indigo-100 rounded border border-indigo-200" />
      <div className="w-6 h-6 bg-slate-200/50 rounded" />
    </div>
  );
};
