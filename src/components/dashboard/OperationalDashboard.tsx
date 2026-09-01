import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  ShieldAlert,
  RefreshCw,
  Download,
  Filter,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  UserCheck,
  Building,
  PhoneCall,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { Organization, OperatorProfile } from '../../types/shell';
import {
  MOCK_OPERATIONAL_KPIS,
  MOCK_COLLECTOR_WORKLOAD,
  MOCK_ACCOUNTS_ATTENTION,
  MOCK_COLLECTION_OUTCOMES,
  MOCK_AI_RECOMMENDATIONS,
  MOCK_FOLLOW_UPS_DUE,
  MOCK_COLLECTION_GAPS,
  MOCK_RECENT_QA_AUDITS,
} from '../../data/dashboardMockData';
import {
  AccountRequiringAttention,
  DashboardAIRecommendation,
  FollowUpDueToday,
  CollectionGapItem,
  RecentQAAuditItem,
} from '../../types/dashboard';

import { KPIGrid } from './KPIGrid';
import { CollectorWorkloadSection } from './CollectorWorkloadSection';
import { AccountsAttentionSection } from './AccountsAttentionSection';
import { CollectionOutcomesSection } from './CollectionOutcomesSection';
import { AIRecommendationsSection } from './AIRecommendationsSection';
import { FollowUpsDueSection } from './FollowUpsDueSection';
import { CollectionGapsSection } from './CollectionGapsSection';
import { RecentQAActivitySection } from './RecentQAActivitySection';

import { Alert } from '../ui/Alert';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Drawer } from '../ui/Drawer';

interface OperationalDashboardProps {
  activeOrganization: Organization;
  currentUser: OperatorProfile;
  onNavigateToView?: (viewId: string) => void;
}

export const OperationalDashboard: React.FC<OperationalDashboardProps> = ({
  activeOrganization,
  currentUser,
  onNavigateToView,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all-operations');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('TODAY');

  // Feedback Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detail Modal / Drawer state for inspections
  const [inspectItem, setInspectItem] = useState<{
    title: string;
    type: string;
    data: any;
  } | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshedTime('Just now');
      setToastMessage('Operational telemetry and banking ledger synchronized successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    }, 600);
  };

  const handleAuthorizeAIRec = (rec: DashboardAIRecommendation) => {
    setToastMessage(`Strategy authorized for ${rec.debtorName} (${rec.accountNumber}). Executing automated cadence.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleInspectAIRec = (rec: DashboardAIRecommendation) => {
    setInspectItem({
      title: `AI Model Reasoning: ${rec.actionTitle}`,
      type: 'AI_REASONING',
      data: rec,
    });
  };

  const handleAccountAction = (actionId: string, acc: AccountRequiringAttention) => {
    setInspectItem({
      title: `Manager Action: ${acc.debtorName} (${acc.accountNumber})`,
      type: 'ACCOUNT_ATTENTION',
      data: acc,
    });
  };

  const handleDialDebtor = (fu: FollowUpDueToday) => {
    setToastMessage(`Dialer station opening secure dual-recording line to ${fu.debtorName}...`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleRemediateGap = (gap: CollectionGapItem) => {
    setToastMessage(`Batch remediation triggered for ${gap.accountCount} accounts under "${gap.title}".`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification if triggered */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-slate-900 text-white text-xs shadow-xl border border-slate-800 font-medium font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Manager Operational Header & Quick Controls */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 lg:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Collection Operations Console
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Floor Telemetry</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                Tenant: <strong>{activeOrganization.code}</strong>
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
              Operations Floor Command Center
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Real-time situational awareness across collector workloads, cash settlements, AI propensity recommendations, and regulatory compliance gates.
            </p>
          </div>

          {/* Operational Timeframe & Global Actions */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            {/* Shift / Timeframe Selector */}
            <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200 shadow-2xs text-xs font-mono">
              <button
                onClick={() => setSelectedTimeframe('TODAY')}
                className={`px-2.5 py-1 rounded font-medium ${
                  selectedTimeframe === 'TODAY'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today (Shift 1)
              </button>
              <button
                onClick={() => setSelectedTimeframe('MTD')}
                className={`px-2.5 py-1 rounded font-medium ${
                  selectedTimeframe === 'MTD'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MT-Date
              </button>
            </div>

            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />}
              onClick={handleRefresh}
            >
              Sync Floor
            </Button>
          </div>
        </div>

        {/* Critical Operational Banner: Urgent Compliance / Dispute SLA */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <Alert
            title="Urgent CFPB Dispute SLA Warning: 5 Accounts Approaching 30-Day Window"
            description="5 formal dispute verification packets require compliance signature within 48 hours to avoid statutory Reg-F penalties."
            variant="warning"
            metadata={[
              { label: 'Total Exposure', value: '$195,000.00' },
              { label: 'Active Auditor', value: 'Rachel Green' },
              { label: 'Jurisdiction', value: 'California / New York' },
            ]}
            action={{
              label: 'View Dispute Ledger',
              onClick: () => {
                if (onNavigateToView) onNavigateToView('collection-gaps');
              },
            }}
          />
        </div>
      </div>

      {/* Primary KPI Grid (All 8 Required KPIs) */}
      <section>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Key Operational Performance Indicators
          </h2>
          <span className="text-[11px] font-mono text-slate-500">
            Last Reconciled: {lastRefreshedTime}
          </span>
        </div>
        <KPIGrid kpis={MOCK_OPERATIONAL_KPIS} />
      </section>

      {/* Perspective Tabs for Manager Focus */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <Tabs
          tabs={[
            { id: 'all-operations', label: 'All Operational Modules' },
            { id: 'attention-gaps', label: 'Attention & Collection Gaps', count: MOCK_ACCOUNTS_ATTENTION.length + MOCK_COLLECTION_GAPS.length, badgeVariant: 'warning' },
            { id: 'workload-qa', label: 'Collector Workload & QA Audits', count: MOCK_COLLECTOR_WORKLOAD.length },
            { id: 'cash-ai', label: 'Settlement Outcomes & AI Recommendations', count: MOCK_AI_RECOMMENDATIONS.length, badgeVariant: 'purple' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* Operational Sections Container */}
      {(activeTab === 'all-operations' || activeTab === 'attention-gaps') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operational Section 2: Accounts Requiring Attention */}
          <div className="lg:col-span-2">
            <AccountsAttentionSection
              accounts={MOCK_ACCOUNTS_ATTENTION}
              onAction={handleAccountAction}
              onSelectAccount={(acc) => handleAccountAction('view', acc)}
            />
          </div>

          {/* Operational Section 6: Collection Gaps */}
          <div className="lg:col-span-2">
            <CollectionGapsSection
              gaps={MOCK_COLLECTION_GAPS}
              onRemediateGap={handleRemediateGap}
            />
          </div>
        </div>
      )}

      {(activeTab === 'all-operations' || activeTab === 'workload-qa') && (
        <div className="space-y-6">
          {/* Operational Section 1: Collector Workload */}
          <CollectorWorkloadSection
            collectors={MOCK_COLLECTOR_WORKLOAD}
            onRebalanceQueue={() => {
              setToastMessage('Queue rebalancer algorithm initiated. Shifting 34 accounts to normal capacity collectors.');
              setTimeout(() => setToastMessage(null), 4000);
            }}
          />

          {/* Operational Section 5: Follow-Ups Due Today & Operational Section 7: QA Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FollowUpsDueSection
              followUps={MOCK_FOLLOW_UPS_DUE}
              onDialDebtor={handleDialDebtor}
            />
            <RecentQAActivitySection
              audits={MOCK_RECENT_QA_AUDITS}
              onInspectAudit={(audit) => {
                setInspectItem({
                  title: `QA Audit Details: ${audit.auditNumber}`,
                  type: 'QA_AUDIT',
                  data: audit,
                });
              }}
            />
          </div>
        </div>
      )}

      {(activeTab === 'all-operations' || activeTab === 'cash-ai') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Operational Section 3: Recent Collection Outcomes */}
          <div>
            <CollectionOutcomesSection
              outcomes={MOCK_COLLECTION_OUTCOMES}
            />
          </div>

          {/* Operational Section 4: AI Recommendations */}
          <div>
            <AIRecommendationsSection
              recommendations={MOCK_AI_RECOMMENDATIONS}
              onAuthorize={handleAuthorizeAIRec}
              onInspect={handleInspectAIRec}
            />
          </div>
        </div>
      )}

      {/* Inspection Modal / Drawer for drilldowns */}
      <Modal
        isOpen={inspectItem !== null}
        onClose={() => setInspectItem(null)}
        title={inspectItem?.title || 'Operational Detail'}
        size="md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setInspectItem(null)}>
              Close
            </Button>
            {inspectItem?.type === 'AI_REASONING' && (
              <Button
                variant="ai-action"
                onClick={() => {
                  if (inspectItem?.data) handleAuthorizeAIRec(inspectItem.data);
                  setInspectItem(null);
                }}
              >
                Authorize Strategy
              </Button>
            )}
            {inspectItem?.type === 'ACCOUNT_ATTENTION' && (
              <Button
                variant="primary"
                onClick={() => {
                  setToastMessage(`Manager override directive saved for ${inspectItem.data.accountNumber}.`);
                  setInspectItem(null);
                  setTimeout(() => setToastMessage(null), 3500);
                }}
              >
                Sign Off Directive
              </Button>
            )}
          </div>
        }
      >
        {inspectItem && (
          <div className="space-y-4 text-xs">
            {inspectItem.type === 'AI_REASONING' && (
              <div className="space-y-3">
                <div className="p-3 rounded bg-indigo-50/70 border border-indigo-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-950 text-sm">
                      {inspectItem.data.actionTitle}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 font-bold">
                      {(inspectItem.data.modelConfidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>
                  <p className="text-indigo-900/90 leading-relaxed font-sans">
                    {inspectItem.data.reasoning}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase text-[9px]">Account Number</div>
                    <div className="font-bold text-slate-900 mt-0.5">{inspectItem.data.accountNumber}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase text-[9px]">Current Balance</div>
                    <div className="font-bold text-slate-900 mt-0.5">${inspectItem.data.balance.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase text-[9px]">Projected Recovery Lift</div>
                    <div className="font-bold text-emerald-700 mt-0.5">+${inspectItem.data.projectedRecoveryLift.toLocaleString()}</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                    <div className="text-slate-400 uppercase text-[9px]">Model Version</div>
                    <div className="font-bold text-slate-800 mt-0.5">{inspectItem.data.modelVersion}</div>
                  </div>
                </div>
              </div>
            )}

            {inspectItem.type === 'ACCOUNT_ATTENTION' && (
              <div className="space-y-3">
                <div className="p-3 rounded bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950">Attention Trigger</span>
                    <span className="text-[10px] font-mono font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200">
                      {inspectItem.data.riskLevel}
                    </span>
                  </div>
                  <p className="text-amber-900/90 leading-relaxed font-semibold">
                    {inspectItem.data.reason}
                  </p>
                </div>

                <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-semibold text-slate-800">Suggested Resolution Protocol</span>
                  <p className="text-slate-600 leading-relaxed">
                    {inspectItem.data.suggestedAction}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[9px]">Assigned Collector</span>
                    <div className="font-bold text-slate-900">{inspectItem.data.assignedCollector}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[9px]">Days Past Due</span>
                    <div className="font-bold text-slate-900">{inspectItem.data.daysPastDue} days</div>
                  </div>
                </div>
              </div>
            )}

            {inspectItem.type === 'QA_AUDIT' && (
              <div className="space-y-3">
                <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Audit Score: {inspectItem.data.score}/100</span>
                    <span className="font-mono text-slate-500">{inspectItem.data.timestamp}</span>
                  </div>
                  <p className="text-slate-700">{inspectItem.data.deviationSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[9px]">Collector</span>
                    <div className="font-bold text-slate-900">{inspectItem.data.collectorName}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[9px]">Call Duration</span>
                    <div className="font-bold text-slate-900">{inspectItem.data.callDuration}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[9px]">Mini-Miranda Verified</span>
                    <div className={`font-bold ${inspectItem.data.miniMirandaVerified ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {inspectItem.data.miniMirandaVerified ? 'YES - PASS' : 'NO - FAILED'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 text-[9px]">Auditor</span>
                    <div className="font-bold text-slate-900">{inspectItem.data.auditorName}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};
