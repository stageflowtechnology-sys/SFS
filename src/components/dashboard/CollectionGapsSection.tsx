import React, { useState } from 'react';
import {
  AlertOctagon,
  Search,
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { CollectionGapItem } from '../../types/dashboard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CollectionGapsSectionProps {
  gaps: CollectionGapItem[];
  onRemediateGap?: (gap: CollectionGapItem) => void;
}

export const CollectionGapsSection: React.FC<CollectionGapsSectionProps> = ({
  gaps,
  onRemediateGap,
}) => {
  const [remediatedIds, setRemediatedIds] = useState<string[]>([]);

  const handleRemediate = (gap: CollectionGapItem) => {
    setRemediatedIds((prev) => [...prev, gap.id]);
    if (onRemediateGap) onRemediateGap(gap);
  };

  const totalAtRiskCapital = gaps.reduce((acc, curr) => acc + curr.totalAtRiskAmount, 0);

  const getCategoryIcon = (category: CollectionGapItem['category']) => {
    switch (category) {
      case 'UNCONTACTED_HIGH_VALUE':
        return <TrendingDown className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
      case 'EXPIRED_SKIP_TRACE':
        return <Search className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />;
      case 'BROKEN_PTP_LAG':
        return <RotateCcw className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />;
      case 'DISPUTE_DEADLINE_RISK':
        return <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/20">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Collection Gaps & Pipeline Revenue Leakage
            </h3>
            <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold border border-rose-200">
              ${(totalAtRiskCapital / 1000000).toFixed(2)}M at Risk
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>Where is money leaking due to unserviced cohorts, stale skip traces, or broken PTP follow-up lag?</em>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Diagnostic Engine: <strong>StageFlow Rule Engine v4.2</strong></span>
        </div>
      </div>

      {/* Compact Operational Pipeline Leakage Distribution Bar */}
      <div className="px-4 py-2.5 bg-rose-50/30 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Capital Exposure by Leak Type</span>
            <span className="font-bold text-rose-900">${(totalAtRiskCapital / 1000000).toFixed(2)}M</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{ width: `${(gaps.filter(g => g.category === 'UNCONTACTED_HIGH_VALUE').reduce((acc, g) => acc + g.totalAtRiskAmount, 0) / totalAtRiskCapital) * 100}%` }}
              className="bg-rose-600"
              title="Uncontacted High Value"
            />
            <div
              style={{ width: `${(gaps.filter(g => g.category === 'EXPIRED_SKIP_TRACE').reduce((acc, g) => acc + g.totalAtRiskAmount, 0) / totalAtRiskCapital) * 100}%` }}
              className="bg-amber-500"
              title="Expired Skip Trace"
            />
            <div
              style={{ width: `${(gaps.filter(g => g.category === 'BROKEN_PTP_LAG').reduce((acc, g) => acc + g.totalAtRiskAmount, 0) / totalAtRiskCapital) * 100}%` }}
              className="bg-orange-500"
              title="Broken PTP Lag"
            />
            <div
              style={{ width: `${(gaps.filter(g => g.category === 'DISPUTE_DEADLINE_RISK').reduce((acc, g) => acc + g.totalAtRiskAmount, 0) / totalAtRiskCapital) * 100}%` }}
              className="bg-purple-600"
              title="Dispute Deadline Risk"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Total Accounts Affected</span>
            <span className="font-bold text-slate-900">
              {gaps.reduce((acc, g) => acc + g.accountCount, 0)} Accounts
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Average Exposure / Account: <strong className="text-slate-800">${Math.round(totalAtRiskCapital / gaps.reduce((acc, g) => acc + g.accountCount, 0)).toLocaleString()}</strong>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Remediation Queue</span>
            <span className="font-bold text-rose-800">{gaps.length - remediatedIds.length} Urgent</span>
          </div>
          <div className="text-[10px] text-slate-600">
            {remediatedIds.length} Batches Sent to Automated Ingestion
          </div>
        </div>
      </div>

      {/* Gaps Matrix */}
      <div className="divide-y divide-slate-100">
        {gaps.map((gap) => {
          const isRemediated = remediatedIds.includes(gap.id);

          return (
            <div
              key={gap.id}
              className={`p-4 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isRemediated ? 'bg-slate-50 opacity-75' : 'hover:bg-slate-50/70 bg-white'
              }`}
            >
              {/* Gap Breakdown */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getCategoryIcon(gap.category)}

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {gap.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {gap.accountCount} Accounts
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        gap.urgency === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {gap.urgency}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 max-w-2xl leading-relaxed">
                    {gap.description}
                  </p>

                  <div className="text-[11px] text-rose-900/90 font-medium bg-rose-50/60 px-2 py-1 rounded border border-rose-100 font-mono">
                    Impact: {gap.operationalImpact}
                  </div>
                </div>
              </div>

              {/* At-risk Capital & Action */}
              <div className="flex items-center gap-4 shrink-0 self-end lg:self-center border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Capital Exposure</div>
                  <div className="text-sm font-bold text-rose-800">
                    ${gap.totalAtRiskAmount.toLocaleString()}
                  </div>
                </div>

                <div>
                  {isRemediated ? (
                    <Button
                      size="xs"
                      variant="outline"
                      disabled
                      leftIcon={<CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                    >
                      Batch Queued
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      variant="primary"
                      onClick={() => handleRemediate(gap)}
                    >
                      {gap.actionLabel}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
