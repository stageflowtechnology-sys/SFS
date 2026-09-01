import React, { useState } from 'react';
import { ACCOUNT_DETAIL_MOCK_ACCOUNTS } from '../../data/accountDetailMockData';
import { AccountTabId } from '../../types/accountDetail';
import { AccountDetailHeader } from './AccountDetailHeader';
import { AccountOverviewTab } from './AccountOverviewTab';
import { AccountTimelineTab } from './AccountTimelineTab';
import { AccountInteractionsTab } from './AccountInteractionsTab';
import { AccountPaymentsTab } from './AccountPaymentsTab';
import { AccountPtpTab } from './AccountPtpTab';
import { AccountSkipTraceTab } from './AccountSkipTraceTab';
import { AccountFollowUpsTab } from './AccountFollowUpsTab';
import { AccountCollectionGapsTab } from './AccountCollectionGapsTab';
import { AccountAuditTab } from './AccountAuditTab';
import { Tabs, TabItem } from '../ui/Tabs';
import {
  LayoutDashboard,
  GitCommit,
  MessageSquare,
  DollarSign,
  CalendarCheck,
  Search,
  CalendarClock,
  AlertOctagon,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface AccountDetailPageProps {
  initialAccountNumber?: string;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const AccountDetailPage: React.FC<AccountDetailPageProps> = ({
  initialAccountNumber = 'ACC-89412-A',
  onNavigateToWorkbench,
}) => {
  const accountKeys = Object.keys(ACCOUNT_DETAIL_MOCK_ACCOUNTS);
  const [selectedAccountNumber, setSelectedAccountNumber] = useState<string>(
    initialAccountNumber
  );

  const [activeTab, setActiveTab] = useState<AccountTabId>('overview');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const accountData =
    ACCOUNT_DETAIL_MOCK_ACCOUNTS[selectedAccountNumber] ||
    ACCOUNT_DETAIL_MOCK_ACCOUNTS['ACC-89412-A'];

  const tabItems: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'timeline',
      label: 'Collection Timeline',
      count: accountData.timeline.length,
      icon: <GitCommit className="w-3.5 h-3.5" />,
    },
    {
      id: 'interactions',
      label: 'Interactions',
      count: accountData.recentInteractions.length,
      icon: <MessageSquare className="w-3.5 h-3.5" />,
    },
    {
      id: 'payments',
      label: 'Payments',
      count: accountData.payments.length,
      icon: <DollarSign className="w-3.5 h-3.5" />,
    },
    {
      id: 'ptp',
      label: 'PTP',
      count: accountData.ptps.length,
      icon: <CalendarCheck className="w-3.5 h-3.5" />,
    },
    {
      id: 'skip-trace',
      label: 'Skip Trace',
      count: accountData.skipTraceHits.length,
      icon: <Search className="w-3.5 h-3.5" />,
    },
    {
      id: 'follow-ups',
      label: 'Follow-Ups',
      count: accountData.followUps.length,
      icon: <CalendarClock className="w-3.5 h-3.5" />,
    },
    {
      id: 'collection-gaps',
      label: 'Collection Gaps',
      count: accountData.collectionGaps.length,
      badgeVariant: accountData.collectionGaps.length > 0 ? 'warning' : 'neutral',
      icon: <AlertOctagon className="w-3.5 h-3.5" />,
    },
    {
      id: 'audit',
      label: 'Audit',
      count: accountData.auditLogs.length,
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="flex flex-col min-w-0 w-full bg-[#F8FAFC]">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-8 z-50 animate-bounce">
          <div className="px-4 py-2.5 rounded-xl border border-indigo-500 bg-slate-900 text-white shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header with the 10 Required Metadata Metrics */}
      <AccountDetailHeader
        data={accountData}
        allAccountNumbers={accountKeys}
        selectedAccountNumber={selectedAccountNumber}
        onSelectAccount={(accNum) => setSelectedAccountNumber(accNum)}
        onOpenDialer={() => {
          showToast(`Initiating dialer for ${accountData.customer.name}...`);
        }}
      />

      {/* 2. 9 Tabs Navigation Strip */}
      <div className="border-b border-slate-200 bg-white px-4 lg:px-8 py-2 sticky top-0 z-20 shadow-2xs">
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onChange={(tabId) => setActiveTab(tabId as AccountTabId)}
          variant="underline"
          size="md"
          className="overflow-x-auto"
        />
      </div>

      {/* 3. Tab Content Display Area */}
      <div className="p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {activeTab === 'overview' && (
          <AccountOverviewTab
            data={accountData}
            onApplyAction={(title, terms) => {
              showToast(`Action "${title}" confirmed & logged!`);
            }}
            onOpenDialer={(phone) => {
              showToast(`Dialing ${phone}...`);
            }}
            onOpenInteractionsTab={() => setActiveTab('interactions')}
            onOpenTimelineTab={() => setActiveTab('timeline')}
          />
        )}

        {activeTab === 'timeline' && (
          <AccountTimelineTab timeline={accountData.timeline} />
        )}

        {activeTab === 'interactions' && (
          <AccountInteractionsTab
            interactions={accountData.recentInteractions}
          />
        )}

        {activeTab === 'payments' && (
          <AccountPaymentsTab
            payments={accountData.payments}
            totalBalance={accountData.account.totalBalance}
          />
        )}

        {activeTab === 'ptp' && (
          <AccountPtpTab
            ptps={accountData.ptps}
            currentBalance={accountData.account.totalBalance}
          />
        )}

        {activeTab === 'skip-trace' && (
          <AccountSkipTraceTab
            hits={accountData.skipTraceHits}
            customerName={accountData.customer.name}
          />
        )}

        {activeTab === 'follow-ups' && (
          <AccountFollowUpsTab followUps={accountData.followUps} />
        )}

        {activeTab === 'collection-gaps' && (
          <AccountCollectionGapsTab gaps={accountData.collectionGaps} />
        )}

        {activeTab === 'audit' && (
          <AccountAuditTab auditLogs={accountData.auditLogs} />
        )}
      </div>
    </div>
  );
};
