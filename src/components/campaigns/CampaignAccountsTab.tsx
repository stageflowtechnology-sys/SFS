import React, { useState, useMemo } from 'react';
import { CampaignItem, CampaignAccountItem } from '../../types/campaign';
import { CampaignAccountDrawer } from './CampaignAccountDrawer';
import {
  Search,
  Filter,
  Users,
  CreditCard,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';

interface CampaignAccountsTabProps {
  campaign: CampaignItem;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const CampaignAccountsTab: React.FC<CampaignAccountsTabProps> = ({
  campaign,
  onNavigateToWorkbench,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [inspectingAccount, setInspectingAccount] = useState<CampaignAccountItem | null>(null);

  // Accounts list (fallback to campaign.accounts or empty)
  const accounts = campaign.accounts || [];

  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        acc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.portfolioName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage =
        selectedStageFilter === 'ALL' || acc.currentStageId === selectedStageFilter;

      const matchesStatus =
        selectedStatusFilter === 'ALL' || acc.status === selectedStatusFilter;

      return matchesSearch && matchesStage && matchesStatus;
    });
  }, [accounts, searchQuery, selectedStageFilter, selectedStatusFilter]);

  const renderStatusPill = (status: CampaignAccountItem['status'], label: string) => {
    switch (status) {
      case 'PTP_ACTIVE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {label}
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {label}
          </span>
        );
      case 'RESPONDED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            {label}
          </span>
        );
      case 'OPTED_OUT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            {label}
          </span>
        );
      case 'UNREACHED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {label}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            {label}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Enrolled Debtor Claims ({accounts.length} Active Records)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Debtors progressing through sequence stages with real-time touch counts and next scheduled cadence.
              </p>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by debtor name, account #, or portfolio..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Stage Filter */}
            <select
              value={selectedStageFilter}
              onChange={(e) => setSelectedStageFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Stages</option>
              {campaign.stages.map((stg) => (
                <option key={stg.id} value={stg.id}>
                  Stage {stg.order}: {stg.name.split(':')[1]?.trim() || stg.name}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="PTP_ACTIVE">PTP Active</option>
              <option value="RESPONDED">Responded</option>
              <option value="UNREACHED">Unreached</option>
              <option value="RESOLVED">Resolved</option>
              <option value="OPTED_OUT">Opted Out</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      {filteredAccounts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No debtor claims found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No accounts matched your search or stage filters in this campaign.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Debtor & Account</th>
                  <th className="py-3 px-4 text-right">Balance & DPD</th>
                  <th className="py-3 px-4">Active Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Touches (Call/SMS/Email)</th>
                  <th className="py-3 px-4">Last Dispatched</th>
                  <th className="py-3 px-4">Next Cadence</th>
                  <th className="py-3 px-4 text-center">Propensity</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredAccounts.map((acc) => (
                  <tr
                    key={acc.id}
                    onClick={() => setInspectingAccount(acc)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Debtor & Account */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {acc.customerName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                          <span>{acc.accountNumber}</span>
                          <span>•</span>
                          <span className="text-slate-600 truncate max-w-[140px]">
                            {acc.portfolioName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Balance & DPD */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-900">
                          ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                        <p className="text-[10px] font-semibold text-amber-700">
                          {acc.daysPastDue} DPD
                        </p>
                      </div>
                    </td>

                    {/* Active Stage */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {acc.currentStageName.split(':')[0]}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusPill(acc.status, acc.statusLabel)}
                    </td>

                    {/* Touch Breakdown */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 font-mono text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200">
                        <span title="Voice Calls" className="text-indigo-700 font-bold">
                          {acc.touchCount.calls}c
                        </span>
                        <span className="text-slate-300">/</span>
                        <span title="SMS" className="text-emerald-700 font-bold">
                          {acc.touchCount.sms}s
                        </span>
                        <span className="text-slate-300">/</span>
                        <span title="Emails" className="text-blue-700 font-bold">
                          {acc.touchCount.emails}e
                        </span>
                      </div>
                    </td>

                    {/* Last Touch */}
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="space-y-0.5">
                        <span className="font-semibold">{acc.lastTouchChannel}</span>
                        <p className="text-[10px] text-slate-400 font-mono">{acc.lastTouchDate}</p>
                      </div>
                    </td>

                    {/* Next Cadence */}
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-700 font-semibold text-[11px]">
                        {acc.nextScheduledTouch}
                      </span>
                    </td>

                    {/* Propensity Score */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                          acc.propensityScore >= 75
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : acc.propensityScore >= 50
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {acc.propensityScore}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setInspectingAccount(acc)}
                        className="px-2.5 py-1 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer */}
      <CampaignAccountDrawer
        account={inspectingAccount}
        onClose={() => setInspectingAccount(null)}
        onNavigateToWorkbench={onNavigateToWorkbench}
      />
    </div>
  );
};
