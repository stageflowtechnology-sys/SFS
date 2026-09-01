import React, { useState, useMemo } from 'react';
import {
  FollowUpViewTab,
  FollowUpItem,
  FollowUpFilterState,
  FollowUpStats,
} from '../../types/followUps';
import { INITIAL_FOLLOW_UPS } from '../../data/followUpsData';
import { FollowUpsHeader } from './FollowUpsHeader';
import { FollowUpsFilterBar } from './FollowUpsFilterBar';
import { FollowUpsTable } from './FollowUpsTable';
import { FollowUpDetailDrawer } from './FollowUpDetailDrawer';
import { QuickActionModal } from './QuickActionModal';
import { CreateFollowUpModal } from './CreateFollowUpModal';
import { FollowUpsBatchBar } from './FollowUpsBatchBar';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface FollowUpsScreenProps {
  currentOperatorId?: string;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const FollowUpsScreen: React.FC<FollowUpsScreenProps> = ({
  currentOperatorId = 'OP-402',
  onNavigateToWorkbench,
}) => {
  // Master follow-ups list
  const [items, setItems] = useState<FollowUpItem[]>(INITIAL_FOLLOW_UPS);

  // Active view tab (TODAY, UPCOMING, OVERDUE, COMPLETED, CANCELLED)
  const [activeTab, setActiveTab] = useState<FollowUpViewTab>('TODAY');

  // Filters state
  const [filters, setFilters] = useState<FollowUpFilterState>({
    search: '',
    type: 'ALL',
    source: 'ALL',
    collector: 'ALL',
    priority: 'ALL',
    sortBy: 'DUE_DATE',
    sortDirection: 'ASC',
  });

  // Selected row IDs
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer inspection state
  const [selectedItem, setSelectedItem] = useState<FollowUpItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Quick Action execution modal state
  const [actionItem, setActionItem] = useState<FollowUpItem | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState<boolean>(false);

  // Create follow-up modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  // Toast notification
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

  // Compute live statistics for Header
  const stats: FollowUpStats = useMemo(() => {
    let today = 0;
    let upcoming = 0;
    let overdue = 0;
    let completed = 0;
    let cancelled = 0;
    let aiCount = 0;
    let manualCount = 0;

    const now = Date.now();

    items.forEach((item) => {
      if (item.source.origin === 'AI_GENERATED') aiCount++;
      if (item.source.origin === 'MANUAL') manualCount++;

      if (item.status === 'COMPLETED') {
        completed++;
      } else if (item.status === 'CANCELLED') {
        cancelled++;
      } else if (item.status === 'OVERDUE' || item.dueTimestamp < now - 12 * 3600 * 1000) {
        overdue++;
      } else if (
        item.dueDate.toLowerCase().includes('today') ||
        (item.dueTimestamp >= now - 12 * 3600 * 1000 && item.dueTimestamp <= now + 20 * 3600 * 1000)
      ) {
        today++;
      } else {
        upcoming++;
      }
    });

    const totalActive = today + upcoming + overdue;
    const slaAdherenceRate = totalActive > 0 ? Math.round(((totalActive - overdue) / totalActive) * 1000) / 10 : 100;

    return {
      todayCount: today,
      upcomingCount: upcoming,
      overdueCount: overdue,
      completedCount: completed,
      cancelledCount: cancelled,
      aiGeneratedCount: aiCount,
      manualCount: manualCount,
      totalActive,
      slaAdherenceRate,
    };
  }, [items]);

  // Filter items based on active Tab and Filter criteria
  const filteredItems = useMemo(() => {
    const now = Date.now();

    return items
      .filter((item) => {
        // Tab bucket partition
        if (activeTab === 'COMPLETED') {
          if (item.status !== 'COMPLETED') return false;
        } else if (activeTab === 'CANCELLED') {
          if (item.status !== 'CANCELLED') return false;
        } else if (activeTab === 'OVERDUE') {
          if (item.status !== 'OVERDUE' && !(item.status === 'PENDING' && item.dueTimestamp < now - 12 * 3600 * 1000)) {
            return false;
          }
        } else if (activeTab === 'TODAY') {
          if (item.status === 'COMPLETED' || item.status === 'CANCELLED') return false;
          if (item.status === 'OVERDUE') return false;
          const isToday =
            item.dueDate.toLowerCase().includes('today') ||
            (item.dueTimestamp >= now - 12 * 3600 * 1000 && item.dueTimestamp <= now + 20 * 3600 * 1000);
          if (!isToday) return false;
        } else if (activeTab === 'UPCOMING') {
          if (item.status === 'COMPLETED' || item.status === 'CANCELLED' || item.status === 'OVERDUE') return false;
          const isToday =
            item.dueDate.toLowerCase().includes('today') ||
            (item.dueTimestamp >= now - 12 * 3600 * 1000 && item.dueTimestamp <= now + 20 * 3600 * 1000);
          if (isToday) return false;
        }

        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchAccount = item.account.accountNumber.toLowerCase().includes(q);
          const matchCustomer = item.customer.name.toLowerCase().includes(q);
          const matchReason = item.reason.toLowerCase().includes(q);
          const matchCollector = item.collector.name.toLowerCase().includes(q);
          if (!matchAccount && !matchCustomer && !matchReason && !matchCollector) return false;
        }

        // Type filter
        if (filters.type !== 'ALL' && item.type !== filters.type) {
          return false;
        }

        // Source filter (AI vs Manual)
        if (filters.source !== 'ALL' && item.source.origin !== filters.source) {
          return false;
        }

        // Collector filter
        if (filters.collector === 'ME') {
          if (!item.collector.isCurrentUser && item.collector.id !== currentOperatorId) {
            return false;
          }
        } else if (filters.collector !== 'ALL') {
          if (item.collector.id !== filters.collector) return false;
        }

        // Priority filter
        if (filters.priority !== 'ALL' && item.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (filters.sortBy === 'DUE_DATE') {
          diff = a.dueTimestamp - b.dueTimestamp;
        } else if (filters.sortBy === 'BALANCE') {
          diff = b.account.balance - a.account.balance;
        } else if (filters.sortBy === 'CUSTOMER_NAME') {
          diff = a.customer.name.localeCompare(b.customer.name);
        } else if (filters.sortBy === 'TYPE') {
          diff = a.type.localeCompare(b.type);
        } else if (filters.sortBy === 'PRIORITY') {
          const weight: Record<string, number> = { CRITICAL: 4, HIGH: 3, NORMAL: 2, LOW: 1 };
          diff = (weight[b.priority] || 0) - (weight[a.priority] || 0);
        }

        return filters.sortDirection === 'ASC' ? diff : -diff;
      });
  }, [items, activeTab, filters, currentOperatorId]);

  // Handler: Toggle single row selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handler: Select all visible rows
  const handleSelectAll = () => {
    if (selectedIds.length === filteredItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map((it) => it.id));
    }
  };

  // Handler: Open row in Drawer
  const handleSelectRow = (item: FollowUpItem) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  // Handler: Execute primary action
  const handleExecuteAction = (item: FollowUpItem) => {
    setActionItem(item);
    setIsActionModalOpen(true);
  };

  // Handler: Mark Single Item Complete
  const handleMarkComplete = (item: FollowUpItem, outcomeNotes: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'COMPLETED',
              completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              completedBy: `Armando Santiago (${currentOperatorId})`,
              completionOutcome: outcomeNotes || 'Marked completed by operator.',
            }
          : it
      )
    );
    showToast(`Follow-Up #${item.id} completed and reconciled.`, 'success');
  };

  // Handler: Snooze Item
  const handleSnooze = (item: FollowUpItem, hours: number) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'PENDING',
              dueDate: `In ${hours} hours`,
              dueTimestamp: Date.now() + hours * 3600 * 1000,
            }
          : it
      )
    );
    showToast(`Follow-Up #${item.id} rescheduled (+${hours}h).`, 'info');
  };

  // Handler: Cancel Item
  const handleCancel = (item: FollowUpItem, reason: string) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id
          ? {
              ...it,
              status: 'CANCELLED',
              cancelledAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              cancelledBy: `Armando Santiago (${currentOperatorId})`,
              cancellationReason: reason || 'Cancelled by operator directive.',
            }
          : it
      )
    );
    showToast(`Follow-Up #${item.id} cancelled.`, 'warning');
  };

  // Handler: Create New Item
  const handleCreateNew = (newItem: FollowUpItem) => {
    setItems((prev) => [newItem, ...prev]);
    showToast(`New follow-up scheduled for Account #${newItem.account.accountNumber}.`, 'success');
  };

  // Batch Handlers
  const handleBatchComplete = () => {
    setItems((prev) =>
      prev.map((it) =>
        selectedIds.includes(it.id)
          ? {
              ...it,
              status: 'COMPLETED',
              completedAt: 'Just now',
              completedBy: `Armando Santiago (${currentOperatorId})`,
              completionOutcome: 'Batch completed.',
            }
          : it
      )
    );
    showToast(`Completed ${selectedIds.length} follow-ups.`, 'success');
    setSelectedIds([]);
  };

  const handleBatchSnooze = () => {
    setItems((prev) =>
      prev.map((it) =>
        selectedIds.includes(it.id)
          ? {
              ...it,
              status: 'PENDING',
              dueDate: 'Tomorrow, 10:00 AM',
              dueTimestamp: Date.now() + 24 * 3600 * 1000,
            }
          : it
      )
    );
    showToast(`Snoozed ${selectedIds.length} follow-ups to tomorrow.`, 'info');
    setSelectedIds([]);
  };

  const handleBatchCancel = () => {
    setItems((prev) =>
      prev.map((it) =>
        selectedIds.includes(it.id)
          ? {
              ...it,
              status: 'CANCELLED',
              cancelledAt: 'Just now',
              cancelledBy: `Armando Santiago (${currentOperatorId})`,
              cancellationReason: 'Batch cancelled by operator.',
            }
          : it
      )
    );
    showToast(`Cancelled ${selectedIds.length} follow-ups.`, 'warning');
    setSelectedIds([]);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          className={`fixed top-18 right-6 z-50 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-xl border flex items-center gap-2 animate-in fade-in duration-150 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-900 text-white border-emerald-700'
              : toastMessage.type === 'warning'
              ? 'bg-amber-900 text-white border-amber-700'
              : 'bg-indigo-900 text-white border-indigo-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <FollowUpsHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSelectedIds([]);
        }}
        stats={stats}
        onCreateNew={() => setIsCreateModalOpen(true)}
      />

      {/* Filters & Search Control Bar */}
      <FollowUpsFilterBar
        filters={filters}
        onUpdateFilters={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
        onResetFilters={() =>
          setFilters({
            search: '',
            type: 'ALL',
            source: 'ALL',
            collector: 'ALL',
            priority: 'ALL',
            sortBy: 'DUE_DATE',
            sortDirection: 'ASC',
          })
        }
        onCreateNew={() => setIsCreateModalOpen(true)}
        totalFiltered={filteredItems.length}
      />

      {/* 9-Column Master Data Table */}
      <FollowUpsTable
        items={filteredItems}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onSelectRow={handleSelectRow}
        onExecuteAction={handleExecuteAction}
        onQuickComplete={(item) => handleMarkComplete(item, 'Quick completed by operator.')}
        onQuickSnooze={(item) => handleSnooze(item, 24)}
        onQuickCancel={(item) => handleCancel(item, 'Quick cancelled by operator.')}
      />

      {/* Detailed Slide-Over Inspector Drawer */}
      <FollowUpDetailDrawer
        item={selectedItem}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedItem(null);
        }}
        onExecuteAction={(item) => {
          setIsDrawerOpen(false);
          handleExecuteAction(item);
        }}
        onMarkComplete={handleMarkComplete}
        onSnooze={handleSnooze}
        onCancel={handleCancel}
      />

      {/* Interactive Quick Action Modal (Dialer, SMS, Email, Review) */}
      <QuickActionModal
        item={actionItem}
        isOpen={isActionModalOpen}
        onClose={() => {
          setIsActionModalOpen(false);
          setActionItem(null);
        }}
        onConfirmComplete={handleMarkComplete}
        onConfirmSnooze={handleSnooze}
        onConfirmCancel={handleCancel}
      />

      {/* Create Follow-Up Modal */}
      <CreateFollowUpModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNew}
        currentOperatorId={currentOperatorId}
      />

      {/* Multi-Select Floating Batch Actions Bar */}
      <FollowUpsBatchBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBatchComplete={handleBatchComplete}
        onBatchSnooze={handleBatchSnooze}
        onBatchCancel={handleBatchCancel}
      />
    </div>
  );
};
