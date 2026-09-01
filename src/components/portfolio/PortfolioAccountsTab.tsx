import React, { useState, useMemo } from 'react';
import { PortfolioItem, PortfolioAccountItem } from '../../types/portfolio';
import { StatusPill } from '../ui/StatusPill';
import { Badge } from '../ui/Badge';
import { SearchInput } from '../ui/SearchInput';
import {
  CreditCard,
  User,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Phone,
  Mail,
  UserCheck,
  Send,
  RefreshCw,
  Eye,
} from 'lucide-react';

interface PortfolioAccountsTabProps {
  portfolio: PortfolioItem;
  onSelectAccount?: (account: PortfolioAccountItem) => void;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const PortfolioAccountsTab: React.FC<PortfolioAccountsTabProps> = ({
  portfolio,
  onSelectAccount,
  onNavigateToWorkbench,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDpdBucket, setSelectedDpdBucket] = useState<string>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [selectedCollector, setSelectedCollector] = useState<string>('ALL');
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [batchActionFeedback, setBatchActionFeedback] = useState<string | null>(null);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return portfolio.accounts.filter((acc) => {
      // Search term matching
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = acc.customerName.toLowerCase().includes(term);
        const matchesNumber = acc.accountNumber.toLowerCase().includes(term);
        const matchesCity = acc.cityState.toLowerCase().includes(term);
        if (!matchesName && !matchesNumber && !matchesCity) return false;
      }

      // DPD Bucket
      if (selectedDpdBucket !== 'ALL' && acc.dpdBucket !== selectedDpdBucket) {
        return false;
      }

      // Stage
      if (selectedStage !== 'ALL' && acc.stage !== selectedStage) {
        return false;
      }

      // Collector
      if (selectedCollector !== 'ALL' && acc.assignedCollectorId !== selectedCollector) {
        return false;
      }

      return true;
    });
  }, [portfolio.accounts, searchTerm, selectedDpdBucket, selectedStage, selectedCollector]);

  const toggleSelectAll = () => {
    if (selectedAccountIds.length === filteredAccounts.length) {
      setSelectedAccountIds([]);
    } else {
      setSelectedAccountIds(filteredAccounts.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedAccountIds.includes(id)) {
      setSelectedAccountIds(selectedAccountIds.filter((item) => item !== id));
    } else {
      setSelectedAccountIds([...selectedAccountIds, id]);
    }
  };

  const handleExecuteBatch = (actionName: string) => {
    setBatchActionFeedback(`Executed "${actionName}" across ${selectedAccountIds.length} accounts`);
    setTimeout(() => {
      setBatchActionFeedback(null);
      setSelectedAccountIds([]);
    }, 3000);
  };

  // Helper for DPD Bucket style
  const getDpdBadgeVariant = (bucket: string) => {
    switch (bucket) {
      case '1-30':
        return 'success';
      case '31-60':
        return 'warning';
      case '61-90':
        return 'danger';
      case '91-120':
      case '120+':
        return 'purple';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Header Strip */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search accounts by name, number, or city..."
            isFullWidth
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* DPD Bucket filter */}
          <select
            value={selectedDpdBucket}
            onChange={(e) => setSelectedDpdBucket(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All DPD Buckets</option>
            <option value="1-30">1-30 DPD</option>
            <option value="31-60">31-60 DPD</option>
            <option value="61-90">61-90 DPD</option>
            <option value="91-120">91-120 DPD</option>
            <option value="120+">120+ DPD</option>
          </select>

          {/* Collector filter */}
          <select
            value={selectedCollector}
            onChange={(e) => setSelectedCollector(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 font-medium hover:bg-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Collectors</option>
            {portfolio.collectors.map((c) => (
              <option key={c.id} value={c.operatorId}>
                {c.name} ({c.operatorId})
              </option>
            ))}
          </select>

          {(searchTerm || selectedDpdBucket !== 'ALL' || selectedCollector !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDpdBucket('ALL');
                setSelectedCollector('ALL');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold px-2 py-1"
            >
              Reset Filters
            </button>
          )}

          <span className="text-slate-400 font-mono text-xs ml-auto">
            Showing <strong>{filteredAccounts.length}</strong> of {portfolio.accounts.length}
          </span>
        </div>
      </div>

      {/* Batch Action Bar if items selected */}
      {selectedAccountIds.length > 0 && (
        <div className="bg-indigo-900 text-white rounded-lg p-3 px-4 shadow-md flex items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs">
            <CheckSquare className="w-4 h-4 text-indigo-300" />
            <span className="font-bold">{selectedAccountIds.length} accounts selected</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleExecuteBatch('Reassign Collector')}
              className="px-3 py-1 rounded bg-white text-slate-900 hover:bg-slate-100 text-xs font-semibold shadow-xs"
            >
              Reassign Collector
            </button>
            <button
              onClick={() => handleExecuteBatch('Enroll in Omnichannel SMS Campaign')}
              className="px-3 py-1 rounded bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-semibold border border-indigo-500"
            >
              Enroll in Campaign
            </button>
            <button
              onClick={() => handleExecuteBatch('Generate Statutory Demand Notices')}
              className="px-3 py-1 rounded bg-indigo-800 hover:bg-indigo-700 text-white text-xs font-semibold border border-indigo-600"
            >
              Demand Notice Batch
            </button>
            <button
              onClick={() => setSelectedAccountIds([])}
              className="text-xs text-indigo-200 hover:text-white px-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Batch action confirmation toast */}
      {batchActionFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{batchActionFeedback}</span>
        </div>
      )}

      {/* Accounts Master Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500 select-none">
                <th className="py-2.5 px-3 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {selectedAccountIds.length === filteredAccounts.length && filteredAccounts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-2.5 px-3">Account & Debtor</th>
                <th className="py-2.5 px-3">Current Balance</th>
                <th className="py-2.5 px-3">Aging & Bucket</th>
                <th className="py-2.5 px-3">Stage & Status</th>
                <th className="py-2.5 px-3">Assigned Collector</th>
                <th className="py-2.5 px-3">AI Propensity & Action</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                    No accounts matching the active filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const isSelected = selectedAccountIds.includes(account.id);
                  return (
                    <tr
                      key={account.id}
                      onClick={() => onSelectAccount && onSelectAccount(account)}
                      className={`hover:bg-indigo-50/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/60' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={(e) => toggleSelectOne(account.id, e)}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 mx-auto" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 hover:text-slate-500 mx-auto" />
                        )}
                      </td>

                      {/* Account & Debtor */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{account.customerName}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-0.5">
                          <span>{account.accountNumber}</span>
                          <span>•</span>
                          <span>{account.ssnMasked}</span>
                          <span>•</span>
                          <span>{account.cityState}</span>
                        </div>
                      </td>

                      {/* Current Balance */}
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-slate-900">
                          {formatCurrency(account.balance)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          Orig: {formatCurrency(account.originalPrincipal)}
                        </div>
                      </td>

                      {/* Aging & Bucket */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-800">
                            {account.daysPastDue} DPD
                          </span>
                          <Badge variant={getDpdBadgeVariant(account.dpdBucket)} size="xs">
                            {account.dpdBucket}
                          </Badge>
                        </div>
                        {account.ptpStatus && account.ptpStatus !== 'NONE' && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-indigo-700">
                            PTP: {account.ptpStatus.replace('_', ' ')}
                          </span>
                        )}
                      </td>

                      {/* Stage & Status */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 text-[11px]">
                          {account.stage.replace(/_/g, ' ')}
                        </div>
                        <div className="mt-1">
                          <StatusPill status={account.status} size="sm" />
                        </div>
                      </td>

                      {/* Assigned Collector */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                            {account.assignedCollectorName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <span className="font-medium text-slate-800">
                            {account.assignedCollectorName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 ml-6.5">
                          {account.assignedCollectorId}
                        </span>
                      </td>

                      {/* AI Propensity & Action */}
                      <td className="py-2.5 px-3 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-700 text-xs">
                            {account.propensityScore}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">/ 100</span>
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5" title={account.recommendedAction}>
                          {account.recommendedAction}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectAccount) onSelectAccount(account);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                            title="Quick Inspect"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {onNavigateToWorkbench && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToWorkbench(account.accountNumber);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] shadow-2xs"
                              title="Open in Collector Workbench"
                            >
                              <span>Work</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
