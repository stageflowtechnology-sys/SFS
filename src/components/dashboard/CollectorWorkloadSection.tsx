import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  AlertCircle,
  SlidersHorizontal,
  PhoneCall,
  CheckCircle2,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { CollectorWorkloadItem } from '../../types/dashboard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CollectorWorkloadSectionProps {
  collectors: CollectorWorkloadItem[];
  onRebalanceQueue?: () => void;
  onSelectCollector?: (collectorId: string) => void;
}

export const CollectorWorkloadSection: React.FC<CollectorWorkloadSectionProps> = ({
  collectors,
  onRebalanceQueue,
  onSelectCollector,
}) => {
  const [filterCapacity, setFilterCapacity] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'touches' | 'overdue' | 'ptp'>('overdue');

  const filteredCollectors = collectors
    .filter((c) => {
      if (filterCapacity === 'ALL') return true;
      return c.capacityStatus === filterCapacity;
    })
    .sort((a, b) => {
      if (sortBy === 'touches') {
        return (b.touchesCompleted / b.touchesTarget) - (a.touchesCompleted / a.touchesTarget);
      }
      if (sortBy === 'overdue') {
        return b.overdueCount - a.overdueCount;
      }
      if (sortBy === 'ptp') {
        return b.ptpAmountToday - a.ptpAmountToday;
      }
      return 0;
    });

  const getCapacityBadge = (status: CollectorWorkloadItem['capacityStatus']) => {
    switch (status) {
      case 'NORMAL':
        return <Badge variant="success" size="xs" isMono>Normal Capacity</Badge>;
      case 'HEAVY':
        return <Badge variant="warning" size="xs" isMono>Heavy Load</Badge>;
      case 'OVERLOADED':
        return <Badge variant="danger" size="xs" isMono>Overloaded</Badge>;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header with operational question explanation & controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Collector Workload & Floor Capacity
            </h3>
            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
              {collectors.length} Collectors Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>How is portfolio load distributed, and who is falling behind on daily contact quotas?</em>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Filter */}
          <div className="inline-flex rounded-md bg-white p-0.5 border border-slate-200 shadow-2xs text-[11px] font-mono">
            <button
              onClick={() => setFilterCapacity('ALL')}
              className={`px-2 py-0.5 rounded font-medium ${
                filterCapacity === 'ALL' ? 'bg-slate-900 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({collectors.length})
            </button>
            <button
              onClick={() => setFilterCapacity('OVERLOADED')}
              className={`px-2 py-0.5 rounded font-medium ${
                filterCapacity === 'OVERLOADED' ? 'bg-rose-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Overloaded ({collectors.filter(c => c.capacityStatus === 'OVERLOADED').length})
            </button>
          </div>

          <Button
            size="xs"
            variant="secondary"
            leftIcon={<SlidersHorizontal className="w-3 h-3 text-slate-500" />}
            onClick={onRebalanceQueue}
          >
            Rebalance Queues
          </Button>
        </div>
      </div>

      {/* Compact Operational Capacity Distribution Bar */}
      <div className="px-4 py-3 bg-slate-50/70 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Floor Capacity Load</span>
            <span className="font-bold text-slate-800">
              {collectors.filter(c => c.capacityStatus === 'NORMAL').length} Normal / {collectors.filter(c => c.capacityStatus === 'OVERLOADED').length} Overloaded
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{ width: `${(collectors.filter(c => c.capacityStatus === 'NORMAL').length / collectors.length) * 100}%` }}
              className="bg-emerald-500"
              title="Normal Capacity"
            />
            <div
              style={{ width: `${(collectors.filter(c => c.capacityStatus === 'HEAVY').length / collectors.length) * 100}%` }}
              className="bg-amber-500"
              title="Heavy Load"
            />
            <div
              style={{ width: `${(collectors.filter(c => c.capacityStatus === 'OVERLOADED').length / collectors.length) * 100}%` }}
              className="bg-rose-500"
              title="Overloaded"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Total Floor Touches Pace</span>
            <span className="font-bold text-slate-800">
              {collectors.reduce((acc, c) => acc + c.touchesCompleted, 0)} / {collectors.reduce((acc, c) => acc + c.touchesTarget, 0)} (76.7%)
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{
                width: `${(collectors.reduce((acc, c) => acc + c.touchesCompleted, 0) / collectors.reduce((acc, c) => acc + c.touchesTarget, 0)) * 100}%`,
              }}
              className="bg-indigo-600 rounded"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Floor PTP Secured Today</span>
            <span className="font-bold text-emerald-700">
              ${collectors.reduce((acc, c) => acc + c.ptpAmountToday, 0).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-600 pt-0.5">
            <span className="text-emerald-700 font-bold">100% Verified</span>
            <span>• Avg QA Score: 95.8%</span>
          </div>
        </div>
      </div>

      {/* High Density Collector Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 font-mono text-[10px] uppercase tracking-wider text-slate-500 select-none">
              <th className="py-2 px-3">Collector & ID</th>
              <th className="py-2 px-3">Primary Portfolio</th>
              <th className="py-2 px-3 text-center">Accounts</th>
              <th className="py-2 px-3">Today's Touches vs Target</th>
              <th className="py-2 px-3 text-center">RPC Rate</th>
              <th className="py-2 px-3 text-right">PTP Secured</th>
              <th className="py-2 px-3 text-center">Overdue</th>
              <th className="py-2 px-3 text-center">QA Grade</th>
              <th className="py-2 px-3 text-right">Capacity State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-sans">
            {filteredCollectors.map((c) => {
              const progressPct = Math.min(100, Math.round((c.touchesCompleted / c.touchesTarget) * 100));
              const isPaceBehind = progressPct < 80;

              return (
                <tr
                  key={c.id}
                  onClick={() => onSelectCollector && onSelectCollector(c.operatorId)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                >
                  {/* Collector Info */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white font-mono">
                        {c.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                          {c.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-500">
                          {c.operatorId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Portfolio */}
                  <td className="py-2.5 px-3">
                    <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {c.activePortfolio}
                    </span>
                  </td>

                  {/* Active Accounts */}
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                    {c.activeAccountsCount}
                  </td>

                  {/* Touches vs Target */}
                  <td className="py-2.5 px-3 min-w-[140px]">
                    <div className="space-y-1">
                      <div className="flex justify-between font-mono text-[10px]">
                        <span className="font-bold text-slate-800">
                          {c.touchesCompleted} / {c.touchesTarget}
                        </span>
                        <span className={`font-semibold ${isPaceBehind ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {progressPct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded ${
                            progressPct >= 100
                              ? 'bg-emerald-500'
                              : progressPct >= 80
                              ? 'bg-indigo-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* RPC Rate */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    <span className={`font-semibold ${c.rpcRate >= 45 ? 'text-emerald-700' : 'text-slate-700'}`}>
                      {c.rpcRate}%
                    </span>
                  </td>

                  {/* PTP Secured */}
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    ${c.ptpAmountToday.toLocaleString()}
                  </td>

                  {/* Overdue Count */}
                  <td className="py-2.5 px-3 text-center font-mono">
                    {c.overdueCount > 0 ? (
                      <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        c.overdueCount >= 5
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {c.overdueCount}
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold text-[11px] flex items-center justify-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 inline" /> 0
                      </span>
                    )}
                  </td>

                  {/* QA Grade */}
                  <td className="py-2.5 px-3 text-center font-mono font-semibold">
                    <span className={`text-[11px] ${c.qaScore >= 95 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {c.qaScore}%
                    </span>
                  </td>

                  {/* Capacity Status */}
                  <td className="py-2.5 px-3 text-right">
                    {getCapacityBadge(c.capacityStatus)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
