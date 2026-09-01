import React, { useState } from 'react';
import { StageFlowStatus } from '../../types/design-system';
import { StatusPill, STATUS_CONFIG } from '../ui/StatusPill';
import { Activity, CheckCircle2, ShieldAlert, Sparkles, Filter, Copy, Check } from 'lucide-react';

export const StatusLanguageSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StageFlowStatus>('REQUIRES_CONFIRMATION');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const allStatuses: StageFlowStatus[] = [
    'PENDING',
    'REQUIRES_CONFIRMATION',
    'EXECUTING',
    'VERIFYING',
    'EXECUTED_VERIFIED',
    'EXECUTION_FAILED',
    'REJECTED',
    'ADVISORY',
    'APPLIED',
    'OVERDUE',
    'COMPLETED',
    'ACTIVE',
    'INACTIVE',
  ];

  const categories = [
    { id: 'all', label: 'All 13 Operational Statuses', count: 13 },
    { id: 'warning', label: 'Action Required & SLA', count: 2 },
    { id: 'active', label: 'In-Flight & Pipeline', count: 3 },
    { id: 'success', label: 'Verified & Closed', count: 2 },
    { id: 'danger', label: 'Exceptions & Rejections', count: 2 },
    { id: 'purple', label: 'AI Intelligence Advisory', count: 1 },
    { id: 'neutral', label: 'Queued & Policies', count: 3 },
  ];

  const filteredStatuses =
    activeCategory === 'all'
      ? allStatuses
      : allStatuses.filter((st) => {
          const cfg = STATUS_CONFIG[st];
          if (activeCategory === 'warning') return cfg.category === 'warning';
          if (activeCategory === 'active') return cfg.category === 'active';
          if (activeCategory === 'success') return cfg.category === 'success';
          if (activeCategory === 'danger') return cfg.category === 'danger';
          if (activeCategory === 'purple') return cfg.category === 'purple';
          if (activeCategory === 'neutral') return cfg.category === 'neutral' || cfg.category === 'slate';
          return true;
        });

  const selectedConfig = STATUS_CONFIG[selectedStatus];

  const copyStatusUsage = (status: string) => {
    navigator.clipboard.writeText(`<StatusPill status="${status}" size="sm" />`);
    setCopiedCode(status);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600">
              Operations Vocabulary
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Deterministic Status Language System
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Every status has an unequivocal operational definition, color token, dot pulse animation,
              and compliance meaning. Statuses prevent ambiguity across debt collections, automated dialers, and legal workflows.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-200 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] font-mono opacity-80">({cat.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Status Pills & Inspectable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredStatuses.map((status) => {
          const cfg = STATUS_CONFIG[status];
          const isSelected = selectedStatus === status;
          return (
            <div
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'border-indigo-500 bg-white ring-2 ring-indigo-500/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <StatusPill status={status} size="sm" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyStatusUsage(status);
                  }}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Copy JSX component"
                >
                  {copiedCode === status ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div>
                <div className="font-mono text-[11px] text-slate-900 font-semibold">{cfg.code}</div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cfg.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="truncate max-w-[190px]">{cfg.operationalContext}</span>
                <span className="uppercase text-slate-600 font-semibold">{cfg.category}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Status Deep Dive Inspector */}
      {selectedConfig && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <StatusPill status={selectedConfig.code} size="md" showCode />
              <span className="font-mono text-xs text-slate-500">
                Token: <code className="text-indigo-600 font-semibold">StageFlowStatus.{selectedConfig.code}</code>
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Operational Gate: <strong className="text-slate-900">{selectedConfig.operationalContext}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">System Definition</div>
              <p className="text-slate-700 leading-relaxed">{selectedConfig.description}</p>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">CSS Design Tokens</div>
              <div className="font-mono text-[11px] text-slate-600 space-y-1">
                <div>Background: <span className="text-slate-900 font-medium">{selectedConfig.bgClass}</span></div>
                <div>Border: <span className="text-slate-900 font-medium">{selectedConfig.borderClass}</span></div>
                <div>Text: <span className="text-slate-900 font-medium">{selectedConfig.textClass}</span></div>
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Usage in Size Scale</div>
              <div className="flex items-center gap-2 pt-1">
                <StatusPill status={selectedConfig.code} size="xs" />
                <StatusPill status={selectedConfig.code} size="sm" />
                <StatusPill status={selectedConfig.code} size="md" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
