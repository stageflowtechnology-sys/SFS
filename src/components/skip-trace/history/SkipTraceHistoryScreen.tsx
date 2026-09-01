import React, { useState, useMemo } from 'react';
import {
  History,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Zap,
  Layers,
  FileSpreadsheet,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Calendar,
  Database,
} from 'lucide-react';
import {
  InvestigationRun,
  IdentityBand,
  SkipTraceAccount,
} from '../../../types/skipTrace';
import { SKIP_TRACE_ACCOUNTS } from '../../../data/skipTraceData';
import { IdentityBandBadge } from '../IdentityBandBadge';
import { SkipTraceSubNav, SkipTraceSubViewType } from '../SkipTraceSubNav';

interface SkipTraceHistoryScreenProps {
  currentSubView: SkipTraceSubViewType;
  onNavigateSubView: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
}

export const SkipTraceHistoryScreen: React.FC<SkipTraceHistoryScreenProps> = ({
  currentSubView,
  onNavigateSubView,
  selectedAccountId = 'skip-acc-101',
  onSelectAccount,
}) => {
  const accounts: SkipTraceAccount[] = SKIP_TRACE_ACCOUNTS;
  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  // Aggregate runs across accounts or for active account
  const [historyScope, setHistoryScope] = useState<'ACTIVE_ACCOUNT' | 'ALL_PORTFOLIO'>('ACTIVE_ACCOUNT');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRunForDrawer, setSelectedRunForDrawer] = useState<InvestigationRun | null>(null);

  // Compile full runs
  const allRuns: (InvestigationRun & { accountName: string; accountNumber: string })[] = useMemo(() => {
    const list: (InvestigationRun & { accountName: string; accountNumber: string })[] = [];
    accounts.forEach((acc) => {
      acc.investigationHistory.forEach((run) => {
        list.push({
          ...run,
          accountName: acc.customerName,
          accountNumber: acc.accountNumber,
        });
      });
    });
    return list;
  }, [accounts]);

  const targetRuns = useMemo(() => {
    const source =
      historyScope === 'ACTIVE_ACCOUNT'
        ? activeAccount.investigationHistory.map((r) => ({
            ...r,
            accountName: activeAccount.customerName,
            accountNumber: activeAccount.accountNumber,
          }))
        : allRuns;

    return source.filter((run) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRunNumber = run.runNumber.toLowerCase().includes(q);
        const matchesInvestigator = run.investigatorName.toLowerCase().includes(q);
        const matchesNotes = run.notes.toLowerCase().includes(q);
        const matchesAccount = run.accountName.toLowerCase().includes(q);
        const matchesSources = run.sourcesQueried.some((s) => s.toLowerCase().includes(q));
        if (!matchesRunNumber && !matchesInvestigator && !matchesNotes && !matchesAccount && !matchesSources) {
          return false;
        }
      }

      if (selectedTrigger !== 'ALL' && run.triggerType !== selectedTrigger) {
        return false;
      }

      if (selectedStatus !== 'ALL' && run.status !== selectedStatus) {
        return false;
      }

      return true;
    });
  }, [historyScope, activeAccount, allRuns, searchQuery, selectedTrigger, selectedStatus]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = targetRuns.length;
    const automated = targetRuns.filter((r) => r.triggerType === 'AUTOMATED_WATERFALL').length;
    const manual = targetRuns.filter((r) => r.triggerType === 'MANUAL_COLLECTOR').length;
    const brokenPtp = targetRuns.filter((r) => r.triggerType === 'BROKEN_PTP_TRIGGER').length;
    const successful = targetRuns.filter((r) => r.status === 'SUCCESS').length;

    let totalDuration = 0;
    let totalEvidence = 0;
    targetRuns.forEach((r) => {
      totalDuration += r.executionDurationSeconds;
      totalEvidence += r.evidenceDiscoveredCount;
    });
    const avgDuration = total > 0 ? (totalDuration / total).toFixed(1) : '0';

    return {
      total,
      automated,
      manual,
      brokenPtp,
      successful,
      avgDuration,
      totalEvidence,
    };
  }, [targetRuns]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Unified Sub-Navigation */}
      <SkipTraceSubNav
        currentSubView={currentSubView}
        onNavigateSubView={onNavigateSubView}
        selectedAccountId={selectedAccountId}
        onSelectAccount={onSelectAccount}
      />

      {/* Main Container */}
      <div className="px-4 lg:px-8 py-5 max-w-[1600px] mx-auto w-full space-y-5">
        {/* Compliance Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4.5 lg:p-5 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
              <History className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700">
                  Immutable Audit Trail
                </span>
                <span className="text-xs font-bold text-white">
                  Multi-Run Investigation Execution History & Waterfall Ledger
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete historical record of automated waterfalls, manual collector queries, and broken PTP triggers with FCRA permissible purpose logging, queried repositories, and confidence score calibrations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2.5 px-4 rounded-xl border border-white/10 text-xs font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-300 block">FCRA §604 Audit Log</span>
              <span className="font-bold text-white">100% Immutable Timestamped</span>
            </div>
          </div>
        </div>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Runs */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Total Runs</span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.total}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Execution logs</span>
          </div>

          {/* Automated Waterfalls */}
          <div
            onClick={() => setSelectedTrigger('AUTOMATED_WATERFALL')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedTrigger === 'AUTOMATED_WATERFALL'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 block">Automated</span>
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.automated}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Waterfall batch</span>
          </div>

          {/* Manual Collector */}
          <div
            onClick={() => setSelectedTrigger('MANUAL_COLLECTOR')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedTrigger === 'MANUAL_COLLECTOR'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Manual</span>
              <User className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.manual}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Operator queries</span>
          </div>

          {/* Broken PTP Triggers */}
          <div
            onClick={() => setSelectedTrigger('BROKEN_PTP_TRIGGER')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedTrigger === 'BROKEN_PTP_TRIGGER'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block">Broken PTP</span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.brokenPtp}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Auto-triggered</span>
          </div>

          {/* Evidence Yielded */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">Evidence Yielded</span>
            <span className="text-xl font-bold font-mono mt-0.5 block text-emerald-700">{stats.totalEvidence}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Total artifacts</span>
          </div>

          {/* Average Latency */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">Avg Duration</span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.avgDuration}s</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Multi-source ping</span>
          </div>
        </div>

        {/* 2. Search & Multi-Level Filtering Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search run number, investigator, account, source, note..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Scope & Trigger Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Account Scope Toggle */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 pl-2 pr-1">
                  Scope:
                </span>
                <button
                  onClick={() => setHistoryScope('ACTIVE_ACCOUNT')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    historyScope === 'ACTIVE_ACCOUNT'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Selected Account
                </button>
                <button
                  onClick={() => setHistoryScope('ALL_PORTFOLIO')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    historyScope === 'ALL_PORTFOLIO'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Portfolio
                </button>
              </div>

              {/* Trigger Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 pl-2 pr-1">
                  Trigger:
                </span>
                {(['ALL', 'AUTOMATED_WATERFALL', 'MANUAL_COLLECTOR', 'BROKEN_PTP_TRIGGER'] as const).map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setSelectedTrigger(tr)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedTrigger === tr
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tr === 'ALL'
                      ? 'All'
                      : tr === 'AUTOMATED_WATERFALL'
                      ? 'Automated'
                      : tr === 'MANUAL_COLLECTOR'
                      ? 'Manual'
                      : 'Broken PTP'}
                  </button>
                ))}
              </div>

              {/* Reset Filters */}
              {(selectedTrigger !== 'ALL' || searchQuery || historyScope !== 'ACTIVE_ACCOUNT') && (
                <button
                  onClick={() => {
                    setSelectedTrigger('ALL');
                    setSearchQuery('');
                    setHistoryScope('ACTIVE_ACCOUNT');
                  }}
                  className="px-3 py-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Investigation Runs Ledger Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Investigation Run Ledger ({targetRuns.length} Runs)
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-mono uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-5 py-3">Run ID & Timestamp</th>
                  <th className="px-4 py-3">Subject Account</th>
                  <th className="px-4 py-3">Trigger / Investigator</th>
                  <th className="px-4 py-3">Repositories Queried</th>
                  <th className="px-4 py-3">Identity Band</th>
                  <th className="px-4 py-3">Yield / Duration</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {targetRuns.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      No investigation runs found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  targetRuns.map((run) => (
                    <tr key={run.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Run ID & Timestamp */}
                      <td className="px-5 py-3.5">
                        <div className="font-mono font-bold text-slate-900">{run.runNumber}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{run.timestamp}</span>
                        </div>
                      </td>

                      {/* Subject Account */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-800">{run.accountName}</div>
                        <div className="text-[10px] font-mono text-slate-400">{run.accountNumber}</div>
                      </td>

                      {/* Trigger & Investigator */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            run.triggerType === 'AUTOMATED_WATERFALL'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : run.triggerType === 'BROKEN_PTP_TRIGGER'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {run.triggerType.replace(/_/g, ' ')}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-1">{run.investigatorName}</div>
                      </td>

                      {/* Repositories */}
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <div className="flex flex-wrap gap-1">
                          {run.sourcesQueried.map((src, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-mono"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Identity Band & Score */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <IdentityBandBadge band={run.identityBand} size="sm" />
                          <span className="font-mono font-bold text-xs text-slate-800">
                            {run.confidenceScore}%
                          </span>
                        </div>
                      </td>

                      {/* Yield & Duration */}
                      <td className="px-4 py-3.5 font-mono text-xs">
                        <div className="text-emerald-700 font-bold">+{run.evidenceDiscoveredCount} items</div>
                        <div className="text-[10px] text-slate-400">{run.executionDurationSeconds}s latency</div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            run.status === 'SUCCESS'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : run.status === 'PARTIAL_MATCH'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {run.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          <span>{run.status.replace(/_/g, ' ')}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => setSelectedRunForDrawer(run)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Deep Run Inspector Drawer */}
      {selectedRunForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Run Audit Inspector</h3>
                  <p className="text-[11px] font-mono text-slate-500">{selectedRunForDrawer.runNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRunForDrawer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Execution Summary</span>
                <div className="text-xs font-bold text-slate-900">
                  {selectedRunForDrawer.notes || 'Automated multi-repository skip trace query.'}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Attribution</span>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-slate-800">
                  <div>Investigator: {selectedRunForDrawer.investigatorName} ({selectedRunForDrawer.investigatorId})</div>
                  <div>Trigger: {selectedRunForDrawer.triggerType}</div>
                  <div>Timestamp: {selectedRunForDrawer.timestamp}</div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Repositories Ingested</span>
                <div className="p-3 bg-indigo-50 text-indigo-950 rounded-xl border border-indigo-200 space-y-1.5">
                  {selectedRunForDrawer.sourcesQueried.map((src, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Identity Calibration</span>
                  <div className="font-bold text-slate-900 mt-1">{selectedRunForDrawer.confidenceScore}%</div>
                  <IdentityBandBadge band={selectedRunForDrawer.identityBand} size="sm" />
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Evidence Yield</span>
                  <div className="font-bold text-emerald-700 mt-1">+{selectedRunForDrawer.evidenceDiscoveredCount} Items</div>
                  <span className="text-[10px] text-slate-400">{selectedRunForDrawer.executionDurationSeconds}s Latency</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedRunForDrawer(null)}
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
