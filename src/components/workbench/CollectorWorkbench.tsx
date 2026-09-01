import React, { useState } from 'react';
import { WORKBENCH_SAMPLE_ACCOUNTS } from '../../data/workbenchMockData';
import { WorkbenchAccount, ContactMethod } from '../../types/workbench';
import { LeftContextPanel } from './LeftContextPanel';
import { CenterWorkspacePanel } from './CenterWorkspacePanel';
import { RightAiIntelligencePanel } from './RightAiIntelligencePanel';
import {
  User,
  Shield,
  PhoneCall,
  CheckCircle2,
  Sparkles,
  Layers,
  ChevronDown,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { OriginBadge } from '../ui/OriginBadge';

interface CollectorWorkbenchProps {
  currentOperatorId?: string;
  initialAccountId?: string;
  onNavigateToQueue?: () => void;
}

export const CollectorWorkbench: React.FC<CollectorWorkbenchProps> = ({
  currentOperatorId = 'OP-7492',
  initialAccountId = 'wq-101',
  onNavigateToQueue,
}) => {
  // Master accounts state
  const [accounts, setAccounts] = useState<WorkbenchAccount[]>(WORKBENCH_SAMPLE_ACCOUNTS);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(initialAccountId);

  // Active selected debtor account
  const activeAccount =
    accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  // Selected contact for dialer
  const [selectedContact, setSelectedContact] = useState<ContactMethod>(
    activeAccount.contacts[0]
  );
  const [dialPhoneNumber, setDialPhoneNumber] = useState<string>(
    activeAccount.contacts.find((c) => c.type.startsWith('PHONE'))?.value || ''
  );

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'origin';
    originType?: string;
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'origin' = 'success', originType?: string) => {
    setToastMessage({ text, type, originType });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Switch active debtor account
  const handleSelectAccount = (accId: string) => {
    setSelectedAccountId(accId);
    const acc = accounts.find((a) => a.id === accId) || accounts[0];
    const defaultPhone = acc.contacts.find((c) => c.type.startsWith('PHONE'));
    if (defaultPhone) {
      setSelectedContact(defaultPhone);
      setDialPhoneNumber(defaultPhone.value);
    }
  };

  // Dial specific contact
  const handleDialContact = (contact: ContactMethod) => {
    setDialPhoneNumber(contact.value);
    showToast(`Dialing ${contact.value} (${contact.label})...`, 'info');
  };

  // Handle interaction logged
  const handleLogInteraction = (outcomeData: {
    disposition: string;
    notes: string;
    ptpAmount?: number;
    ptpDate?: string;
    followUpDate?: string;
    followUpNotes?: string;
  }) => {
    // Add interaction to history
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === activeAccount.id) {
          const newInteraction = {
            id: `past-${Date.now()}`,
            timestamp: 'Just now',
            channel: 'VOICE' as const,
            direction: 'OUTBOUND' as const,
            operatorName: `Operator ${currentOperatorId}`,
            operatorId: currentOperatorId,
            disposition: outcomeData.disposition,
            outcomeCategory: 'PTP' as const,
            summary: outcomeData.notes,
            ptpAmount: outcomeData.ptpAmount,
            ptpDueDate: outcomeData.ptpDate,
          };
          return {
            ...acc,
            previousInteractions: [newInteraction, ...acc.previousInteractions],
          };
        }
        return acc;
      })
    );

    showToast(
      `Interaction logged & signed by Op #${currentOperatorId}. Cadence dispatched.`,
      'origin',
      'HUMAN_DECISION'
    );
  };

  // Handle applying recommended action
  const handleApplyRecommendedAction = (actionTitle: string, terms: string) => {
    showToast(
      `Action "${actionTitle}" confirmed & ledger-reconciled!`,
      'origin',
      'VERIFIED_GROUND_TRUTH'
    );
  };

  // Handle applying recommended stage
  const handleApplyRecommendedStage = (targetStageLabel: string) => {
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === activeAccount.id) {
          return {
            ...acc,
            currentStageLabel: targetStageLabel,
            stageLastUpdated: 'Just now (Reconciled by Operator)',
            currentStageOrigin: 'VERIFIED_GROUND_TRUTH',
          };
        }
        return acc;
      })
    );
    showToast(
      `Account transitioned to "${targetStageLabel}" and reconciled to core ledger.`,
      'origin',
      'VERIFIED_GROUND_TRUTH'
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] w-full min-w-0 bg-[#F8FAFC]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-14 right-8 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl border shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold ${
              toastMessage.type === 'origin'
                ? 'bg-slate-900 text-white border-indigo-500 ring-2 ring-indigo-400/50'
                : 'bg-emerald-900 text-white border-emerald-500'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Workbench Command Bar & Account Switcher */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs z-20">
        {/* Left: Active Claim Selector */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold hidden sm:inline">
              Active Claim:
            </span>
            <select
              value={selectedAccountId}
              onChange={(e) => handleSelectAccount(e.target.value)}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 text-xs font-mono font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[280px] sm:max-w-xs truncate"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customerName} • {acc.accountNumber} (${acc.totalBalance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              {activeAccount.daysPastDue} DPD
            </span>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
              Propensity: {activeAccount.propensityScore}%
            </span>
          </div>
        </div>

        {/* Right: Operator Badge & Origin System Legend */}
        <div className="flex items-center gap-3">
          {/* Origin Quick Legend */}
          <div className="hidden xl:flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700">Origin Key:</span>
            <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 border-dashed">
              AI Advisory
            </span>
            <span>→</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Human Sign-off
            </span>
            <span>→</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200">
              System Run
            </span>
            <span>→</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Truth
            </span>
          </div>

          {onNavigateToQueue && (
            <button
              onClick={onNavigateToQueue}
              className="text-xs font-mono text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 px-2.5 py-1 rounded border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 transition-colors"
            >
              <span>Back to Queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Op #{currentOperatorId}</span>
          </div>
        </div>
      </div>

      {/* 3-Panel Main Workbench Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* LEFT PANEL: Customer + Account Context (3 cols) */}
        <div className="lg:col-span-3 h-full min-h-0 overflow-hidden">
          <LeftContextPanel
            account={activeAccount}
            selectedContactId={selectedContact.id}
            onSelectContact={(contact) => {
              setSelectedContact(contact);
              if (contact.type.startsWith('PHONE')) {
                setDialPhoneNumber(contact.value);
              }
            }}
            onDialContact={handleDialContact}
          />
        </div>

        {/* CENTER PANEL: Interaction / Conversation Workspace (5 cols) */}
        <div className="lg:col-span-5 h-full min-h-0 overflow-hidden">
          <CenterWorkspacePanel
            account={activeAccount}
            currentOperatorId={currentOperatorId}
            onLogInteraction={handleLogInteraction}
            activeDialPhoneNumber={dialPhoneNumber}
          />
        </div>

        {/* RIGHT PANEL: AI Intelligence & Guidance Panel (4 cols) */}
        <div className="lg:col-span-4 h-full min-h-0 overflow-hidden">
          <RightAiIntelligencePanel
            account={activeAccount}
            currentOperatorId={currentOperatorId}
            onApplyRecommendedAction={handleApplyRecommendedAction}
            onApplyRecommendedStage={handleApplyRecommendedStage}
          />
        </div>
      </div>
    </div>
  );
};
