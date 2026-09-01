import React, { useState } from 'react';
import {
  Sparkles,
  Shield,
  ShieldCheck,
  RefreshCw,
  Download,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Activity,
  CheckCircle2,
  Clock,
  Lock,
  ArrowUpRight,
  Database,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { NavigationSection, NavigationItem, UserRole, OperatorProfile, Organization } from '../../types/shell';
import { Breadcrumbs } from './Breadcrumbs';
import { SidebarIcon } from './SidebarIcon';
import { OperationalDashboard } from '../dashboard/OperationalDashboard';
import { CollectorWorkQueue } from '../work-queue/CollectorWorkQueue';
import { CollectorWorkbench } from '../workbench/CollectorWorkbench';
import { AccountDetailPage } from '../account-detail/AccountDetailPage';
import { CustomerDetailPage } from '../customer-detail/CustomerDetailPage';
import { DesignSystemViewer } from '../design-system/DesignSystemViewer';
import { PreCallBriefingExperience } from '../pre-call-briefing/PreCallBriefingExperience';
import { LiveCopilotExperience } from '../live-copilot/LiveCopilotExperience';
import { PostCallReviewScreen } from '../post-call-review/PostCallReviewScreen';
import { RecommendationCenterScreen } from '../recommendation-center/RecommendationCenterScreen';
import { SkipTraceOverviewScreen } from '../skip-trace/SkipTraceOverviewScreen';
import { SkipTraceInvestigationWorkspace } from '../skip-trace/workspace/SkipTraceInvestigationWorkspace';
import { SkipTraceCandidateEvidenceScreen } from '../skip-trace/candidate-evidence/SkipTraceCandidateEvidenceScreen';
import { SkipTraceContactabilityScreen } from '../skip-trace/contactability/SkipTraceContactabilityScreen';
import { SkipTraceContradictionsScreen } from '../skip-trace/contradictions/SkipTraceContradictionsScreen';
import { SkipTraceHistoryScreen } from '../skip-trace/history/SkipTraceHistoryScreen';
import { SkipTraceSubViewType } from '../skip-trace/SkipTraceSubNav';
import { FollowUpsScreen } from '../follow-ups/FollowUpsScreen';
import { PortfoliosScreen } from '../portfolio/PortfoliosScreen';
import { CampaignsScreen } from '../campaigns/CampaignsScreen';

interface PageContainerProps {
  currentSection: NavigationSection;
  currentItem: NavigationItem;
  onSelectItem: (item: NavigationItem) => void;
  currentUserRole: UserRole;
  currentUser: OperatorProfile;
  activeOrganization: Organization;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  currentSection,
  currentItem,
  onSelectItem,
  currentUserRole,
  currentUser,
  activeOrganization,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('Just now');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [skipTraceSubView, setSkipTraceSubView] = useState<SkipTraceSubViewType>('OVERVIEW');
  const [skipTraceSelectedAccountId, setSkipTraceSelectedAccountId] = useState<string>('skip-acc-101');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 600);
  };

  const hasAccess = (): boolean => {
    if (!currentItem.requiredRole) return true;
    if (currentUserRole === 'ADMIN') return true;
    if (currentUserRole === 'QA_AUDITOR' && currentItem.requiredRole === 'QA_AUDITOR') return true;
    return false;
  };

  const isAccessible = hasAccess();

  // Route to Collector Workbench
  const isWorkbenchView = currentItem.id === 'workbench';

  // Route to AI Pre-Call Briefing Experience
  const isAiCopilotView = currentItem.id === 'ai-copilot';

  // Route to the Collector Work Queue for work-queue & my-claims
  const isWorkQueueView =
    currentItem.id === 'work-queue' || currentItem.id === 'my-claims';

  // Route to Account Detail Page for accounts
  const isAccountDetailView = currentItem.id === 'accounts';

  // Route to Customer Detail Page for customers
  const isCustomerDetailView = currentItem.id === 'customers';

  // Route to Operational Dashboard for dashboard & reports
  const isDashboardView =
    currentItem.id === 'dashboard' || currentItem.id === 'reports';

  // Route to Design System Foundation Explorer
  const isDesignSystemView = currentItem.id === 'design-system';

  // Route to Post-Call Review Experience
  const isPostCallReviewView =
    currentItem.id === 'call-recordings' ||
    currentItem.id === 'qa-audits' ||
    currentItem.id === 'post-call-review';

  // Route to AI Recommendation Center
  const isRecommendationCenterView =
    currentItem.id === 'recommendation-center' ||
    currentItem.id === 'ai-recommendations';

  // Route to Skip Trace Overview
  const isSkipTraceView =
    currentItem.id === 'skip-trace' ||
    currentItem.id === 'skip-tracing';

  // Route to Follow-Ups Workstation
  const isFollowUpsView =
    currentItem.id === 'follow-ups' ||
    currentItem.id === 'followups' ||
    currentItem.id === 'follow-up';

  // Route to Portfolios Module
  const isPortfoliosView =
    currentItem.id === 'portfolios' ||
    currentItem.id === 'portfolio' ||
    currentItem.id === 'portfolio-list' ||
    currentItem.id === 'portfolio-detail';

  // Route to Campaigns Module
  const isCampaignsView =
    currentItem.id === 'campaigns' ||
    currentItem.id === 'campaign' ||
    currentItem.id === 'campaign-list' ||
    currentItem.id === 'campaign-detail';

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] overflow-y-auto">
      {/* Top Breadcrumbs & Operational Control Strip */}
      <div className="border-b border-slate-200 bg-white px-4 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        <Breadcrumbs
          currentSection={currentSection}
          currentItem={currentItem}
          onSelectItem={onSelectItem}
          currentUserRole={currentUserRole}
        />

        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span className="hidden sm:inline">Last Reconciled: {lastRefreshed}</span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors p-1 rounded hover:bg-slate-100"
            title="Refresh active dataset"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>
        </div>
      </div>

      {/* Main Page Content Area */}
      {isPortfoliosView ? (
        /* Render Portfolios Module Workstation Edge-to-Edge */
        <PortfoliosScreen
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
        />
      ) : isFollowUpsView ? (
        /* Render Follow-Ups Module Workstation Edge-to-Edge */
        <FollowUpsScreen
          currentOperatorId={currentUser.operatorId}
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
        />
      ) : isSkipTraceView ? (
        skipTraceSubView === 'OVERVIEW' ? (
          /* 1. Render Skip Trace Overview Screen */
          <SkipTraceOverviewScreen
            currentSubView={skipTraceSubView}
            onNavigateSubView={setSkipTraceSubView}
            selectedAccountId={skipTraceSelectedAccountId}
            onSelectAccount={setSkipTraceSelectedAccountId}
            onOpenWorkspace={() => setSkipTraceSubView('WORKSPACE')}
          />
        ) : skipTraceSubView === 'WORKSPACE' ? (
          /* 2. Render Skip Trace Investigation Workspace */
          <SkipTraceInvestigationWorkspace
            currentSubView={skipTraceSubView}
            onNavigateSubView={setSkipTraceSubView}
            selectedAccountId={skipTraceSelectedAccountId}
            onSelectAccount={setSkipTraceSelectedAccountId}
            onSwitchToOverview={() => setSkipTraceSubView('OVERVIEW')}
            onSwitchToCandidates={() => setSkipTraceSubView('CANDIDATES_EVIDENCE')}
          />
        ) : skipTraceSubView === 'CANDIDATES_EVIDENCE' ? (
          /* 3. Render Skip Trace Candidate & Evidence Screen */
          <SkipTraceCandidateEvidenceScreen
            currentSubView={skipTraceSubView}
            onNavigateSubView={setSkipTraceSubView}
            selectedAccountId={skipTraceSelectedAccountId}
            onSelectAccount={setSkipTraceSelectedAccountId}
            onSwitchToWorkspace={() => setSkipTraceSubView('WORKSPACE')}
            onSwitchToOverview={() => setSkipTraceSubView('OVERVIEW')}
          />
        ) : skipTraceSubView === 'CONTACTABILITY' ? (
          /* 4. Render Skip Trace Contactability Intelligence Screen */
          <SkipTraceContactabilityScreen
            currentSubView={skipTraceSubView}
            onNavigateSubView={setSkipTraceSubView}
            selectedAccountId={skipTraceSelectedAccountId}
            onSelectAccount={setSkipTraceSelectedAccountId}
            onSwitchToCandidates={() => setSkipTraceSubView('CANDIDATES_EVIDENCE')}
            onSwitchToWorkspace={() => setSkipTraceSubView('WORKSPACE')}
            onSwitchToOverview={() => setSkipTraceSubView('OVERVIEW')}
          />
        ) : skipTraceSubView === 'CONTRADICTIONS' ? (
          /* 5. Render Skip Trace Contradictions & Discrepancies Screen */
          <SkipTraceContradictionsScreen
            currentSubView={skipTraceSubView}
            onNavigateSubView={setSkipTraceSubView}
            selectedAccountId={skipTraceSelectedAccountId}
            onSelectAccount={setSkipTraceSelectedAccountId}
          />
        ) : (
          /* 6. Render Skip Trace Investigation History Screen */
          <SkipTraceHistoryScreen
            currentSubView={skipTraceSubView}
            onNavigateSubView={setSkipTraceSubView}
            selectedAccountId={skipTraceSelectedAccountId}
            onSelectAccount={setSkipTraceSelectedAccountId}
          />
        )
      ) : isRecommendationCenterView ? (
        /* Render AI Recommendation Center Screen Edge-to-Edge */
        <RecommendationCenterScreen />
      ) : isAiCopilotView ? (
        /* Render Live AI Copilot Workstation Edge-to-Edge */
        <LiveCopilotExperience
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
        />
      ) : isWorkbenchView ? (
        /* Render Collector Workbench Edge-to-Edge */
        <CollectorWorkbench
          currentOperatorId={currentUser.operatorId}
          onNavigateToQueue={() => {
            const queueItem = currentSection.items.find((it) => it.id === 'work-queue');
            if (queueItem) onSelectItem(queueItem);
          }}
        />
      ) : isPostCallReviewView ? (
        /* Render Post-Call Interaction Review Screen Edge-to-Edge */
        <PostCallReviewScreen
          currentOperatorId={currentUser.operatorId}
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
          onNavigateToQueue={() => {
            const queueItem = currentSection.items.find((it) => it.id === 'work-queue');
            if (queueItem) onSelectItem(queueItem);
          }}
        />
      ) : isPortfoliosView ? (
        /* Render Portfolios Module Screen */
        <PortfoliosScreen
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
        />
      ) : isCampaignsView ? (
        /* Render Campaigns Module Screen */
        <CampaignsScreen
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
        />
      ) : isFollowUpsView ? (
        /* Render Follow-Ups Workstation Screen */
        <FollowUpsScreen
          onNavigateToWorkbench={(accountId) => {
            const wbItem = currentSection.items.find((it) => it.id === 'workbench');
            if (wbItem) onSelectItem(wbItem);
          }}
        />
      ) : (
        <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Permission Gate Warning if restricted */}
          {!isAccessible ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-4 text-amber-900 shadow-2xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-xs">
                <Lock className="w-4 h-4 text-amber-700" />
                <span>Restricted Access Module ({currentItem.requiredRole})</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your active operator profile is currently set to <strong>{currentUser.role}</strong>. This module requires <strong>{currentItem.requiredRole}</strong> clearance. Use the top right user menu to simulate switching roles.
              </p>
            </div>
          ) : isWorkQueueView ? (
            /* Render Collector Work Queue */
            <CollectorWorkQueue currentOperatorId={currentUser.operatorId} />
          ) : isAccountDetailView ? (
            /* Render Account Detail Page */
            <AccountDetailPage
              onNavigateToWorkbench={() => {
                const wbItem = currentSection.items.find((it) => it.id === 'workbench');
                if (wbItem) onSelectItem(wbItem);
              }}
            />
          ) : isCustomerDetailView ? (
            /* Render Customer Detail Page */
            <CustomerDetailPage
              onNavigateToWorkbench={() => {
                const wbItem = currentSection.items.find((it) => it.id === 'workbench');
                if (wbItem) onSelectItem(wbItem);
              }}
            />
          ) : isDashboardView ? (
            /* Render Full Operational Dashboard */
            <OperationalDashboard
              activeOrganization={activeOrganization}
              currentUser={currentUser}
              onNavigateToView={(viewId) => {
                // Find matching item from section
                for (const sec of [currentSection]) {
                  const found = sec.items.find((it) => it.id === viewId);
                  if (found) {
                    onSelectItem(found);
                    return;
                  }
                }
              }}
            />
          ) : isDesignSystemView ? (
            /* Render StageFlow AI Design System Foundation */
            <DesignSystemViewer />
          ) : (
            /* Module Header Banner & Workstation for other specific sections */
            <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
                    <SidebarIcon name={currentItem.icon} className="w-5 h-5 text-indigo-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                        {currentSection.title}
                      </span>
                      {currentItem.isAiPowered && (
                        <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                          <Sparkles className="w-3 h-3" />
                          <span>AI Model Inference v3.1</span>
                        </span>
                      )}
                      {currentItem.requiredRole && (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-800 border border-amber-200">
                          <Lock className="w-3 h-3" />
                          <span>{currentItem.requiredRole} Level</span>
                        </span>
                      )}
                    </div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
                      {currentItem.label}
                    </h1>
                    <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                      {currentItem.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Export Ledger</span>
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition-colors">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Configure Filters</span>
                  </button>
                </div>
              </div>

              {/* Module Telemetry */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Active Queue</span>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {typeof currentItem.badgeCount === 'number' ? currentItem.badgeCount : 18} Cases
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Operating Entity</span>
                  <div className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {activeOrganization.code}
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Compliance Gate</span>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>FDCPA Reg-F Pass</span>
                  </div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Authorized Session</span>
                  <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                    {currentUser.operatorId} ({currentUser.role})
                  </div>
                </div>
              </div>
            </div>

            {/* Also render the Operational Dashboard directly in other views with a focus banner */}
            <OperationalDashboard
              activeOrganization={activeOrganization}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
      )}

      {/* Bottom Operational Status Bar */}
      <footer className="border-t border-slate-200 bg-white py-2.5 px-4 lg:px-8 text-xs text-slate-500 font-mono mt-auto shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-slate-800">StageFlow AI Console</span>
            <span>•</span>
            <span>Tenant: {activeOrganization.code}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Core Banking Rail: CONNECTED</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Session: TLS 1.3 / AES-256</span>
            <span>•</span>
            <span>Operator: {currentUser.operatorId}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
