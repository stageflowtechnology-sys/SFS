import React, { useState } from 'react';
import { CustomerTabId } from '../../types/customerDetail';
import { MOCK_CUSTOMERS } from '../../data/customerDetailMockData';
import { CustomerDetailHeader } from './CustomerDetailHeader';
import { CustomerOverviewTab } from './CustomerOverviewTab';
import { CustomerAccountsTab } from './CustomerAccountsTab';
import { CustomerInteractionsTab } from './CustomerInteractionsTab';
import { CustomerFollowUpsTab } from './CustomerFollowUpsTab';
import { CustomerSkipTraceTab } from './CustomerSkipTraceTab';
import { CustomerEvidenceTab } from './CustomerEvidenceTab';
import { CustomerHistoryTab } from './CustomerHistoryTab';
import {
  LayoutDashboard,
  CreditCard,
  History,
  Calendar,
  Search,
  FileCheck,
  ShieldAlert,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Check,
} from 'lucide-react';

interface CustomerDetailPageProps {
  initialCustomerId?: string;
  onNavigateToWorkbench?: (accountId?: string) => void;
}

export const CustomerDetailPage: React.FC<CustomerDetailPageProps> = ({
  initialCustomerId = 'CUST-88392',
  onNavigateToWorkbench,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId);
  const [activeTab, setActiveTab] = useState<CustomerTabId>('overview');
  const [notification, setNotification] = useState<string | null>(null);

  const customerData = MOCK_CUSTOMERS[selectedCustomerId] || MOCK_CUSTOMERS['CUST-88392'];

  const allCustomerIds = Object.values(MOCK_CUSTOMERS).map((c) => ({
    id: c.customer.id,
    name: c.customer.name,
    type: c.customer.type,
  }));

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenDialer = (phone: string) => {
    showNotification(`Dialing ${customerData.customer.name} via Twilio Safe Harbor Voice Trunk (${phone})...`);
  };

  const handleOpenSms = (phone: string) => {
    showNotification(`Opening TCPA Secure SMS Portal for ${customerData.customer.name} (${phone})...`);
  };

  const tabs: { id: CustomerTabId; label: string; icon: React.ReactNode; badgeCount?: number }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'accounts', label: 'Accounts', icon: <CreditCard className="w-4 h-4" />, badgeCount: customerData.accounts.length },
    { id: 'interactions', label: 'Interactions', icon: <History className="w-4 h-4" />, badgeCount: customerData.recentInteractions.length },
    { id: 'follow-ups', label: 'Follow-Ups', icon: <Calendar className="w-4 h-4" />, badgeCount: customerData.followUps.length },
    { id: 'skip-trace', label: 'Skip Trace', icon: <Search className="w-4 h-4" />, badgeCount: customerData.skipTraceHits.length },
    { id: 'evidence', label: 'Evidence', icon: <FileCheck className="w-4 h-4" />, badgeCount: customerData.evidence.length },
    { id: 'history', label: 'History', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  return (
    <div id="customer-detail-page" className="space-y-6 pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 right-8 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl z-50 flex items-center gap-2 border border-slate-700 text-xs font-semibold animate-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Customer Header Component */}
      <CustomerDetailHeader
        data={customerData}
        allCustomerIds={allCustomerIds}
        selectedCustomerId={selectedCustomerId}
        onSelectCustomer={(id) => {
          setSelectedCustomerId(id);
          setActiveTab('overview');
        }}
        onOpenDialer={handleOpenDialer}
        onOpenSms={handleOpenSms}
        onNavigateToWorkbench={onNavigateToWorkbench ? () => onNavigateToWorkbench() : undefined}
      />

      {/* Primary 7-Tab Navigation Bar */}
      <div className="border-b border-slate-200 bg-white rounded-xl shadow-xs px-2 overflow-x-auto">
        <nav className="flex space-x-1 min-w-max p-1" aria-label="Customer Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badgeCount !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content Area */}
      <div>
        {activeTab === 'overview' && (
          <CustomerOverviewTab
            data={customerData}
            onNavigateToTab={(tabId) => setActiveTab(tabId as CustomerTabId)}
            onNavigateToWorkbench={onNavigateToWorkbench ? () => onNavigateToWorkbench() : undefined}
          />
        )}

        {activeTab === 'accounts' && (
          <CustomerAccountsTab
            accounts={customerData.accounts}
            onNavigateToWorkbench={onNavigateToWorkbench}
          />
        )}

        {activeTab === 'interactions' && (
          <CustomerInteractionsTab interactions={customerData.recentInteractions} />
        )}

        {activeTab === 'follow-ups' && (
          <CustomerFollowUpsTab followUps={customerData.followUps} />
        )}

        {activeTab === 'skip-trace' && (
          <CustomerSkipTraceTab skipTraceHits={customerData.skipTraceHits} />
        )}

        {activeTab === 'evidence' && (
          <CustomerEvidenceTab evidence={customerData.evidence} />
        )}

        {activeTab === 'history' && (
          <CustomerHistoryTab historyAudit={customerData.historyAudit} />
        )}
      </div>
    </div>
  );
};
