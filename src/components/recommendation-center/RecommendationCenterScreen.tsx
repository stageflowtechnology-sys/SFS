/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  RecommendationItem,
  RecommendationSection,
  RejectionDetails,
} from '../../types/recommendationCenter';
import { MOCK_RECOMMENDATIONS } from '../../data/recommendationCenterMockData';
import { RecommendationCard } from './RecommendationCard';
import { ConfirmationModal } from './ConfirmationModal';
import { RejectionModal } from './RejectionModal';
import { EvidenceDrawerModal } from './EvidenceDrawerModal';
import { VerificationReceiptModal } from './VerificationReceiptModal';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ban,
  Search,
  Filter,
  SlidersHorizontal,
  RefreshCw,
  Layers,
  ArrowRight,
  UserCheck,
  TrendingUp,
  AlertOctagon,
  HelpCircle,
  FileCheck,
  CheckCheck,
} from 'lucide-react';

export const RecommendationCenterScreen: React.FC = () => {
  // State management
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(MOCK_RECOMMENDATIONS);
  const [activeSection, setActiveSection] = useState<RecommendationSection>('PENDING');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActionType, setSelectedActionType] = useState<string>('ALL');
  const [selectedConfidenceTier, setSelectedConfidenceTier] = useState<string>('ALL');
  const [roleView, setRoleView] = useState<'COLLECTOR' | 'MANAGER'>('COLLECTOR');

  // Modal states
  const [confirmingItem, setConfirmingItem] = useState<RecommendationItem | null>(null);
  const [rejectingItem, setRejectingItem] = useState<RecommendationItem | null>(null);
  const [evidenceItem, setEvidenceItem] = useState<RecommendationItem | null>(null);
  const [receiptItem, setReceiptItem] = useState<RecommendationItem | null>(null);

  // User notification banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const currentOperator = useMemo(() => {
    return roleView === 'COLLECTOR'
      ? { name: 'Sarah Lin', id: 'COL-8821', role: 'Senior Recovery Specialist' }
      : { name: 'Michael Chen', id: 'SUP-102', role: 'Operations Supervisor' };
  }, [roleView]);

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Section Counts
  const sectionCounts = useMemo(() => {
    return {
      PENDING: recommendations.filter((r) => r.section === 'PENDING').length,
      ADVISORY: recommendations.filter((r) => r.section === 'ADVISORY').length,
      EXECUTED_VERIFIED: recommendations.filter((r) => r.section === 'EXECUTED_VERIFIED').length,
      EXECUTION_FAILED: recommendations.filter((r) => r.section === 'EXECUTION_FAILED').length,
      REJECTED: recommendations.filter((r) => r.section === 'REJECTED').length,
    };
  }, [recommendations]);

  // Filtered List
  const filteredRecommendations = useMemo(() => {
    return recommendations.filter((item) => {
      // 1. Section match
      if (item.section !== activeSection) return false;

      // 2. Action Type filter
      if (selectedActionType !== 'ALL' && item.actionType !== selectedActionType) return false;

      // 3. Confidence Tier filter
      if (selectedConfidenceTier !== 'ALL' && item.confidence.tier !== selectedConfidenceTier) return false;

      // 4. Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAccount = item.account.accountNumber.toLowerCase().includes(q);
        const matchesCustomer = item.customer.name.toLowerCase().includes(q) || item.customer.id.toLowerCase().includes(q);
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesSummary = item.summary.toLowerCase().includes(q);
        const matchesEvidence = item.evidence.directCitation.toLowerCase().includes(q);

        return matchesAccount || matchesCustomer || matchesTitle || matchesSummary || matchesEvidence;
      }

      return true;
    });
  }, [recommendations, activeSection, selectedActionType, selectedConfidenceTier, searchQuery]);

  // Handlers for state mutations
  const handleConfirmExecution = (id: string, operatorNotes?: string) => {
    setRecommendations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const receiptHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          return {
            ...item,
            section: 'EXECUTED_VERIFIED',
            confirmedBy: `${currentOperator.name} (${currentOperator.id})`,
            confirmedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
            verificationResult: {
              receiptHash,
              executedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
              verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
              verifiedBy: 'Core Banking Ledger Gateway (Node #04)',
              targetSystem: 'StageFlow-Core-Orchestrator',
              ledgerCommitBlock: `Block #${Math.floor(8840000 + Math.random() * 9999)}`,
              stateMutationDelta: `${item.title} committed with zero ledger variance.`,
              status: 'VERIFIED_SUCCESS',
            },
          };
        }
        return item;
      })
    );
    showNotification(`Operational recommendation ${id} confirmed and verified on ledger.`, 'success');
  };

  const handleRejectRecommendation = (id: string, rejectionDetails: RejectionDetails) => {
    setRecommendations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            section: 'REJECTED',
            rejectionDetails,
          };
        }
        return item;
      })
    );
    showNotification(`Recommendation ${id} dismissed and logged to compliance audit trail.`, 'warning');
  };

  const handleRetryExecution = (item: RecommendationItem) => {
    // Simulate re-running gateway execution
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === item.id) {
          const receiptHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          return {
            ...r,
            section: 'EXECUTED_VERIFIED',
            failureDetails: undefined,
            verificationResult: {
              receiptHash,
              executedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
              verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
              verifiedBy: 'Core Payment Gateway ACH Engine (Retry Rail)',
              targetSystem: 'Apex-Core-Ledger-v8.1',
              ledgerCommitBlock: `Block #${Math.floor(8840000 + Math.random() * 9999)}`,
              stateMutationDelta: 'Retry succeeded: Payment mandate registered with gateway confirmation.',
              status: 'VERIFIED_SUCCESS',
            },
          };
        }
        return r;
      })
    );
    showNotification(`Retry execution successful for ${item.id}. Verified and committed.`, 'success');
  };

  const handleAcknowledgeAdvisory = (id: string) => {
    showNotification(`Strategic advisory ${id} acknowledged for upcoming outreach.`, 'info');
  };

  const handleBatchConfirmHighConfidence = () => {
    const highConfidencePending = recommendations.filter(
      (r) => r.section === 'PENDING' && r.confidence.score >= 94
    );

    if (highConfidencePending.length === 0) {
      showNotification('No pending items meet the 94%+ high-confidence threshold.', 'info');
      return;
    }

    setRecommendations((prev) =>
      prev.map((item) => {
        if (item.section === 'PENDING' && item.confidence.score >= 94) {
          const receiptHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
          return {
            ...item,
            section: 'EXECUTED_VERIFIED',
            confirmedBy: `${currentOperator.name} (${currentOperator.id}) [Batch Auth]`,
            confirmedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
            verificationResult: {
              receiptHash,
              executedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
              verifiedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
              verifiedBy: 'Core Banking Ledger Gateway (Batch Verifier #01)',
              targetSystem: 'StageFlow-Core-Orchestrator',
              ledgerCommitBlock: `Block #${Math.floor(8840000 + Math.random() * 9999)}`,
              stateMutationDelta: 'Batch verified and committed.',
              status: 'VERIFIED_SUCCESS',
            },
          };
        }
        return item;
      })
    );

    showNotification(`Successfully batch executed ${highConfidencePending.length} high-confidence recommendations.`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 font-mono text-xs ${
              notification.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-800'
                : notification.type === 'warning'
                ? 'bg-amber-950 text-amber-200 border-amber-800'
                : 'bg-indigo-950 text-indigo-200 border-indigo-800'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {notification.type === 'info' && <Sparkles className="w-4 h-4 text-indigo-400" />}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  AI Recommendation Center
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Consolidated supervisory & collector oversight of AI-generated operational mutations and strategic guidance.
                </p>
              </div>
            </div>
          </div>

          {/* Role Toggle Switcher */}
          <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="text-[11px] font-mono font-bold text-slate-500 pl-2">
              Viewing As:
            </span>
            <button
              onClick={() => setRoleView('COLLECTOR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleView === 'COLLECTOR'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Collector View
            </button>
            <button
              onClick={() => setRoleView('MANAGER')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                roleView === 'MANAGER'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manager / Supervisor
            </button>
          </div>
        </div>

        {/* Operational Authority Notice Strip */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Authority Model:</strong> AI provides guidance and recommendations only. Core ledger state mutations require explicit human operator confirmation.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-400">Active Operator:</span>
            <span className="font-bold text-slate-800">{currentOperator.name} ({currentOperator.role})</span>
          </div>
        </div>
      </div>

      {/* Section Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8">
        <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
          {/* Tab: PENDING */}
          <button
            onClick={() => setActiveSection('PENDING')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSection === 'PENDING'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Pending</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {sectionCounts.PENDING}
            </span>
          </button>

          {/* Tab: ADVISORY */}
          <button
            onClick={() => setActiveSection('ADVISORY')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSection === 'ADVISORY'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Advisory</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'ADVISORY' ? 'bg-indigo-700 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {sectionCounts.ADVISORY}
            </span>
          </button>

          {/* Tab: EXECUTED & VERIFIED */}
          <button
            onClick={() => setActiveSection('EXECUTED_VERIFIED')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSection === 'EXECUTED_VERIFIED'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Executed & Verified</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'EXECUTED_VERIFIED' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {sectionCounts.EXECUTED_VERIFIED}
            </span>
          </button>

          {/* Tab: EXECUTION FAILED */}
          <button
            onClick={() => setActiveSection('EXECUTION_FAILED')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSection === 'EXECUTION_FAILED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Execution Failed</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'EXECUTION_FAILED' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
              }`}
            >
              {sectionCounts.EXECUTION_FAILED}
            </span>
          </button>

          {/* Tab: REJECTED */}
          <button
            onClick={() => setActiveSection('REJECTED')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSection === 'REJECTED'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Rejected</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeSection === 'REJECTED' ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {sectionCounts.REJECTED}
            </span>
          </button>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="px-4 sm:px-8 py-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by account, debtor name, action, or citation quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category / Action Filter */}
            <select
              value={selectedActionType}
              onChange={(e) => setSelectedActionType(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Action Categories</option>
              <option value="SETTLEMENT_OFFER">Settlement Offer</option>
              <option value="STAGE_TRANSITION">Stage Transition</option>
              <option value="PTP_INSTALLMENT_PLAN">PTP Installment Plan</option>
              <option value="DIALER_SUPPRESSION">Dialer Suppression</option>
              <option value="FEE_WAIVER">Fee Waiver</option>
              <option value="HARDSHIP_RECLASSIFICATION">Hardship Intake</option>
              <option value="CALL_TIME_OPTIMIZATION">Call Time Optimization</option>
              <option value="SKIP_TRACE_TRIGGER">Skip Trace Discovery</option>
              <option value="BANKRUPTCY_ALERT">Bankruptcy Stay Alert</option>
            </select>

            {/* Confidence Tier Filter */}
            <select
              value={selectedConfidenceTier}
              onChange={(e) => setSelectedConfidenceTier(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="ALL">All Confidence Tiers</option>
              <option value="HIGH">High Confidence (&gt;90%)</option>
              <option value="MODERATE">Moderate (70% - 89%)</option>
              <option value="REVIEW_REQUIRED">Review Required (&lt;70%)</option>
            </select>

            {/* Batch Operational Action for Pending */}
            {activeSection === 'PENDING' && (
              <button
                onClick={handleBatchConfirmHighConfidence}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                title="Batch confirm all pending items with confidence >= 94%"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Authorize High-Confidence (&gt;94%)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="px-4 sm:px-8 pb-12 space-y-4">
        {filteredRecommendations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              No recommendations found in section "{activeSection.replace(/_/g, ' ')}"
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or reset the filter dropdowns to view other available items.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedActionType('ALL');
                setSelectedConfidenceTier('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredRecommendations.map((item) => (
            <RecommendationCard
              key={item.id}
              item={item}
              roleView={roleView}
              onOpenConfirm={(it) => setConfirmingItem(it)}
              onOpenReject={(it) => setRejectingItem(it)}
              onOpenEvidence={(it) => setEvidenceItem(it)}
              onOpenReceipt={(it) => setReceiptItem(it)}
              onRetryExecution={handleRetryExecution}
              onAcknowledgeAdvisory={handleAcknowledgeAdvisory}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={!!confirmingItem}
        recommendation={confirmingItem}
        onClose={() => setConfirmingItem(null)}
        onConfirm={handleConfirmExecution}
        currentOperator={currentOperator}
      />

      <RejectionModal
        isOpen={!!rejectingItem}
        recommendation={rejectingItem}
        onClose={() => setRejectingItem(null)}
        onReject={handleRejectRecommendation}
        currentOperator={currentOperator}
      />

      <EvidenceDrawerModal
        isOpen={!!evidenceItem}
        recommendation={evidenceItem}
        onClose={() => setEvidenceItem(null)}
      />

      <VerificationReceiptModal
        isOpen={!!receiptItem}
        recommendation={receiptItem}
        onClose={() => setReceiptItem(null)}
      />
    </div>
  );
};
