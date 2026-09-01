import React, { useState, useMemo } from 'react';
import {
  INITIAL_WORK_QUEUE_ACCOUNTS,
  SAVED_VIEW_PRESETS,
} from '../../data/workQueueMockData';
import {
  WorkQueueAccount,
  WorkQueueFilters,
  QueueSortField,
  SavedViewPreset,
} from '../../types/workQueue';
import { QueueStatSummary } from './QueueStatSummary';
import { SavedViewsBar } from './SavedViewsBar';
import { QueueFilterBar } from './QueueFilterBar';
import { WorkQueueTable } from './WorkQueueTable';
import { BatchActionBar } from './BatchActionBar';
import { AccountDetailDrawer } from './AccountDetailDrawer';
import { CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export interface CollectorWorkQueueProps {
  currentOperatorId?: string;
}

export const CollectorWorkQueue: React.FC<CollectorWorkQueueProps> = ({
  currentOperatorId = 'OP-7492',
}) => {
  // Accounts master state
  const [accounts, setAccounts] = useState<WorkQueueAccount[]>(INITIAL_WORK_QUEUE_ACCOUNTS);

  // Active saved view preset
  const [activePresetId, setActivePresetId] = useState<string>('unclaimed-high-priority');

  // Filters state
  const [filters, setFilters] = useState<WorkQueueFilters>({
    search: '',
    ownership: 'UNCLAIMED',
    priority: 'P1_CRITICAL',
    stage: 'ALL',
    dpdBucket: 'ALL',
    balanceRange: 'ALL',
    followUp: 'ALL',
    campaign: '',
  });

  // Sorting state
  const [sortField, setSortField] = useState<QueueSortField>('priority');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Density state
  const [density, setDensity] = useState<'compact' | 'standard'>('compact');

  // Row selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer state
  const [selectedAccount, setSelectedAccount] = useState<WorkQueueAccount | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  // Switch Saved View Preset
  const handleSelectPreset = (preset: SavedViewPreset) => {
    setActivePresetId(preset.id);
    setFilters({
      search: '',
      ownership: preset.filters.ownership || 'ALL',
      priority: preset.filters.priority || 'ALL',
      stage: preset.filters.stage || 'ALL',
      dpdBucket: preset.filters.dpdBucket || 'ALL',
      balanceRange: preset.filters.balanceRange || 'ALL',
      followUp: preset.filters.followUp || 'ALL',
      campaign: preset.filters.campaign || '',
    });
    setSortField(preset.sortField);
    setSortAsc(preset.sortAsc);
  };

  // Reset Filters to All
  const handleResetFilters = () => {
    setActivePresetId('all-queue');
    setFilters({
      search: '',
      ownership: 'ALL',
      priority: 'ALL',
      stage: 'ALL',
      dpdBucket: 'ALL',
      balanceRange: 'ALL',
      followUp: 'ALL',
      campaign: '',
    });
  };

  // Calculate live counts for saved view presets
  const presetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SAVED_VIEW_PRESETS.forEach((preset) => {
      const match = accounts.filter((acc) => {
        if (preset.filters.ownership && preset.filters.ownership !== 'ALL') {
          if (preset.filters.ownership === 'UNCLAIMED' && acc.ownership.state !== 'UNCLAIMED') return false;
          if (
            preset.filters.ownership === 'CLAIMED_BY_ME' &&
            acc.ownership.state !== 'CLAIMED_BY_ME' &&
            acc.ownership.claimedByOperatorId !== currentOperatorId
          )
            return false;
          if (
            preset.filters.ownership === 'CLAIMED_BY_OTHERS' &&
            (acc.ownership.state !== 'CLAIMED_BY_OTHER' || acc.ownership.claimedByOperatorId === currentOperatorId)
          )
            return false;
        }
        if (preset.filters.priority && preset.filters.priority !== 'ALL' && acc.priority !== preset.filters.priority) {
          return false;
        }
        if (preset.filters.stage && preset.filters.stage !== 'ALL' && acc.stage !== preset.filters.stage) {
          return false;
        }
        if (preset.filters.dpdBucket && preset.filters.dpdBucket !== 'ALL' && acc.dpdBucket !== preset.filters.dpdBucket) {
          return false;
        }
        if (preset.filters.balanceRange && preset.filters.balanceRange !== 'ALL') {
          if (preset.filters.balanceRange === 'OVER_25K' && acc.balance < 25000) return false;
        }
        if (preset.filters.followUp && preset.filters.followUp !== 'ALL') {
          if (preset.filters.followUp === 'DUE_TODAY' && acc.followUpStatus !== 'DUE_TODAY') return false;
        }
        return true;
      });
      counts[preset.id] = match.length;
    });
    return counts;
  }, [accounts, currentOperatorId]);

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      // 1. Search Query
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const match =
          acc.accountNumber.toLowerCase().includes(query) ||
          acc.customerName.toLowerCase().includes(query) ||
          acc.creditorName.toLowerCase().includes(query) ||
          acc.customerId.toLowerCase().includes(query) ||
          acc.campaignName.toLowerCase().includes(query) ||
          acc.nextAction.toLowerCase().includes(query);
        if (!match) return false;
      }

      // 2. Ownership
      if (filters.ownership !== 'ALL') {
        if (filters.ownership === 'UNCLAIMED' && acc.ownership.state !== 'UNCLAIMED') return false;
        if (
          filters.ownership === 'CLAIMED_BY_ME' &&
          acc.ownership.state !== 'CLAIMED_BY_ME' &&
          acc.ownership.claimedByOperatorId !== currentOperatorId
        )
          return false;
        if (
          filters.ownership === 'CLAIMED_BY_OTHERS' &&
          (acc.ownership.state !== 'CLAIMED_BY_OTHER' || acc.ownership.claimedByOperatorId === currentOperatorId)
        )
          return false;
      }

      // 3. Priority
      if (filters.priority !== 'ALL' && acc.priority !== filters.priority) return false;

      // 4. Stage
      if (filters.stage !== 'ALL' && acc.stage !== filters.stage) return false;

      // 5. DPD Bucket
      if (filters.dpdBucket !== 'ALL' && acc.dpdBucket !== filters.dpdBucket) return false;

      // 6. Balance Range
      if (filters.balanceRange !== 'ALL') {
        if (filters.balanceRange === 'OVER_25K' && acc.balance <= 25000) return false;
        if (filters.balanceRange === '10K_TO_25K' && (acc.balance < 10000 || acc.balance > 25000)) return false;
        if (filters.balanceRange === '5K_TO_10K' && (acc.balance < 5000 || acc.balance > 10000)) return false;
        if (filters.balanceRange === 'UNDER_5K' && acc.balance >= 5000) return false;
      }

      // 7. Follow-Up
      if (filters.followUp !== 'ALL') {
        if (filters.followUp === 'DUE_TODAY' && acc.followUpStatus !== 'DUE_TODAY') return false;
        if (filters.followUp === 'OVERDUE' && acc.followUpStatus !== 'OVERDUE') return false;
        if (filters.followUp === 'UPCOMING' && acc.followUpStatus !== 'UPCOMING') return false;
      }

      return true;
    });
  }, [accounts, filters, currentOperatorId]);

  // Sort filtered accounts
  const sortedAccounts = useMemo(() => {
    const sorted = [...filteredAccounts];
    sorted.sort((a, b) => {
      let valA: any = a[sortField as keyof WorkQueueAccount] ?? '';
      let valB: any = b[sortField as keyof WorkQueueAccount] ?? '';

      if (sortField === 'claimStatus') {
        valA = a.ownership.state;
        valB = b.ownership.state;
      }

      if (sortField === 'priority') {
        const priorityWeight = {
          P1_CRITICAL: 4,
          P2_HIGH: 3,
          P3_MEDIUM: 2,
          P4_LOW: 1,
        };
        valA = priorityWeight[a.priority];
        valB = priorityWeight[b.priority];
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      if (strA < strB) return sortAsc ? -1 : 1;
      if (strA > strB) return sortAsc ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredAccounts, sortField, sortAsc]);

  // Sorting Handler
  const handleSort = (field: QueueSortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for high-value / high-priority scanning
    }
  };

  // Row Selection Handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === sortedAccounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedAccounts.map((a) => a.id));
    }
  };

  // Claim Account Handler
  const handleClaimAccount = (account: WorkQueueAccount, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === account.id
          ? {
              ...acc,
              ownership: {
                state: 'CLAIMED_BY_ME',
                claimedByOperatorId: currentOperatorId,
                claimedByName: 'Alex Rivera',
                claimedByInitials: 'AR',
                claimedAt: 'Just now',
                claimedTimestamp: new Date().toISOString(),
              },
            }
          : acc
      )
    );

    // Update selectedAccount in drawer if open
    if (selectedAccount?.id === account.id) {
      setSelectedAccount((prev) =>
        prev
          ? {
              ...prev,
              ownership: {
                state: 'CLAIMED_BY_ME',
                claimedByOperatorId: currentOperatorId,
                claimedByName: 'Alex Rivera',
                claimedByInitials: 'AR',
                claimedAt: 'Just now',
                claimedTimestamp: new Date().toISOString(),
              },
            }
          : null
      );
    }

    showToast(`Account ${account.accountNumber} (${account.customerName}) claimed successfully.`, 'success');
  };

  // Release Account Handler
  const handleReleaseAccount = (account: WorkQueueAccount, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === account.id
          ? {
              ...acc,
              ownership: {
                state: 'UNCLAIMED',
              },
            }
          : acc
      )
    );

    // Update selectedAccount in drawer if open
    if (selectedAccount?.id === account.id) {
      setSelectedAccount((prev) =>
        prev
          ? {
              ...prev,
              ownership: {
                state: 'UNCLAIMED',
              },
            }
          : null
      );
    }

    showToast(`Account ${account.accountNumber} released back to unclaimed pool.`, 'info');
  };

  // Quick Claim Next Available (Claims highest priority unclaimed account)
  const handleQuickClaimNext = () => {
    const unclaimed = accounts
      .filter((a) => a.ownership.state === 'UNCLAIMED')
      .sort((a, b) => {
        const priorityWeight = { P1_CRITICAL: 4, P2_HIGH: 3, P3_MEDIUM: 2, P4_LOW: 1 };
        if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
          return priorityWeight[b.priority] - priorityWeight[a.priority];
        }
        return b.propensityScore - a.propensityScore;
      });

    if (unclaimed.length > 0) {
      const target = unclaimed[0];
      handleClaimAccount(target);
      // Auto open drawer for immediate execution
      setSelectedAccount(target);
      setIsDrawerOpen(true);
    }
  };

  // Batch Claim Selected
  const handleBatchClaimSelected = () => {
    setAccounts((prev) =>
      prev.map((acc) =>
        selectedIds.includes(acc.id) && acc.ownership.state === 'UNCLAIMED'
          ? {
              ...acc,
              ownership: {
                state: 'CLAIMED_BY_ME',
                claimedByOperatorId: currentOperatorId,
                claimedByName: 'Alex Rivera',
                claimedByInitials: 'AR',
                claimedAt: 'Just now',
                claimedTimestamp: new Date().toISOString(),
              },
            }
          : acc
      )
    );
    showToast(`Claimed ${selectedIds.length} accounts to your active workstation.`, 'success');
    setSelectedIds([]);
  };

  // Batch Release Selected
  const handleBatchReleaseSelected = () => {
    setAccounts((prev) =>
      prev.map((acc) =>
        selectedIds.includes(acc.id) &&
        (acc.ownership.state === 'CLAIMED_BY_ME' || acc.ownership.claimedByOperatorId === currentOperatorId)
          ? {
              ...acc,
              ownership: {
                state: 'UNCLAIMED',
              },
            }
          : acc
      )
    );
    showToast(`Released selected accounts back to unclaimed queue.`, 'info');
    setSelectedIds([]);
  };

  // Row Click opens Drawer
  const handleRowClick = (account: WorkQueueAccount) => {
    setSelectedAccount(account);
    setIsDrawerOpen(true);
  };

  const unclaimedHighPriorityCount = accounts.filter(
    (a) => a.ownership.state === 'UNCLAIMED' && (a.priority === 'P1_CRITICAL' || a.priority === 'P2_HIGH')
  ).length;

  const selectedAccounts = useMemo(() => {
    return accounts.filter((a) => selectedIds.includes(a.id));
  }, [accounts, selectedIds]);

  return (
    <div className="space-y-3 relative pb-12">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900 text-white text-xs font-mono shadow-xl border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* 1. Stat Summary Bar */}
      <QueueStatSummary
        accounts={accounts}
        currentOperatorId={currentOperatorId}
        onQuickClaimNext={handleQuickClaimNext}
        unclaimedHighPriorityCount={unclaimedHighPriorityCount}
      />

      {/* 2. Operations Saved Views Bar */}
      <SavedViewsBar
        presets={SAVED_VIEW_PRESETS}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        presetCounts={presetCounts}
      />

      {/* 3. Filter Bar & Quick Search */}
      <QueueFilterBar
        filters={filters}
        onChangeFilters={setFilters}
        onResetFilters={handleResetFilters}
        density={density}
        onToggleDensity={setDensity}
        totalMatching={sortedAccounts.length}
        totalAll={accounts.length}
      />

      {/* 4. High-Density Work Queue Table */}
      <WorkQueueTable
        accounts={sortedAccounts}
        selectedIds={selectedIds}
        onSelectRow={handleSelectRow}
        onSelectAll={handleSelectAll}
        onRowClick={handleRowClick}
        onClaimAccount={handleClaimAccount}
        onReleaseAccount={handleReleaseAccount}
        currentOperatorId={currentOperatorId}
        sortField={sortField}
        sortAsc={sortAsc}
        onSort={handleSort}
        density={density}
      />

      {/* 5. Floating Batch Action Bar */}
      <BatchActionBar
        selectedAccounts={selectedAccounts}
        onClaimSelected={handleBatchClaimSelected}
        onReleaseSelected={handleBatchReleaseSelected}
        onStartBatchDialer={() => showToast('Batch dialer initialized with selected accounts.', 'info')}
        onExportCsv={() => showToast('Exporting queue records to CSV...', 'info')}
        onClearSelection={() => setSelectedIds([])}
        currentOperatorId={currentOperatorId}
      />

      {/* 6. Account Detail Drawer */}
      <AccountDetailDrawer
        account={selectedAccount}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onClaimAccount={handleClaimAccount}
        onReleaseAccount={handleReleaseAccount}
        currentOperatorId={currentOperatorId}
      />
    </div>
  );
};
