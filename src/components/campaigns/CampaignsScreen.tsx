import React, { useState } from 'react';
import { MOCK_CAMPAIGNS } from '../../data/campaignMockData';
import { CampaignItem, CampaignStatus } from '../../types/campaign';
import { CampaignList } from './CampaignList';
import { CampaignDetail } from './CampaignDetail';
import { NewCampaignModal } from './NewCampaignModal';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface CampaignsScreenProps {
  initialCampaignId?: string;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const CampaignsScreen: React.FC<CampaignsScreenProps> = ({
  initialCampaignId,
  onNavigateToWorkbench,
}) => {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(MOCK_CAMPAIGNS);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    initialCampaignId || null
  );
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);

  const handleUpdateCampaign = (updated: CampaignItem) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    showToast(`Campaign "${updated.name}" updated.`);
  };

  const handleCreateCampaign = (newCampData: Partial<CampaignItem>) => {
    const newId = `camp-${Date.now()}`;
    const fullNew: CampaignItem = {
      id: newId,
      code: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newCampData.name || 'New Omnichannel Campaign',
      type: newCampData.type || 'OMNICHANNEL',
      typeLabel: newCampData.typeLabel || 'Omnichannel Automated Cadence',
      status: (newCampData.status as CampaignStatus) || 'DRAFT',
      description: newCampData.description || 'Configured campaign cadence with automated stage progression.',
      targetAudience: newCampData.targetAudience || 'Selected portfolio cohorts',
      startDate: newCampData.startDate || '2026-03-15',
      createdAt: '2026-03-01',
      updatedAt: '2026-03-01',
      createdBy: 'Operator (You)',
      enrolledPortfoliosCount: 1,
      totalAccounts: 450,
      activeAccounts: newCampData.status === 'ACTIVE' ? 450 : 0,
      completedAccounts: 0,
      totalEnrolledBalance: 1650000,
      totalCollectedBalance: 0,
      liquidationRatePct: 0,
      targetLiquidationRatePct: 28.0,
      contactRatePct: 0,
      responseRatePct: 0,
      ptpConversionRatePct: 0,
      channels: newCampData.channels || ['VOICE', 'SMS', 'EMAIL'],
      stages: [
        {
          id: 'stg-new-1',
          order: 1,
          name: 'Stage 1: Validation Notice & Digital Onboarding',
          code: 'STG-01-VAL',
          description: 'Electronic validation notice dispatched via email with SMS confirmation.',
          type: 'NOTIFICATION',
          channel: 'EMAIL',
          channelLabel: 'Email & SMS e-Notice',
          dwellTimeDays: 3,
          activeAccountsCount: newCampData.status === 'ACTIVE' ? 450 : 0,
          completedAccountsCount: 0,
          progressedRatePct: 0,
          exitConditionSummary: '3-day validation statutory window expires without dispute.',
          complianceNotes: 'FDCPA § 809 validation compliant.',
          colorTheme: 'blue',
          status: newCampData.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING',
        },
        {
          id: 'stg-new-2',
          order: 2,
          name: 'Stage 2: Conversational Voice AI Outreach',
          code: 'STG-02-VOICE',
          description: 'Outbound conversational voice sessions during local calling hours.',
          type: 'VOICE_AI',
          channel: 'VOICE_AI',
          channelLabel: 'Autonomous Voice AI',
          dwellTimeDays: 5,
          activeAccountsCount: 0,
          completedAccountsCount: 0,
          progressedRatePct: 0,
          exitConditionSummary: 'Voice contact with PTP recorded or max attempts reached.',
          complianceNotes: 'CFPB 7-in-7 counter strictly monitored.',
          colorTheme: 'indigo',
          status: 'PENDING',
        },
        {
          id: 'stg-new-3',
          order: 3,
          name: 'Stage 3: Settlement Offer Portal Link',
          code: 'STG-03-SETTLE',
          description: 'Authorized 15% discount offer with payment schedule portal.',
          type: 'SETTLEMENT_PROPOSAL',
          channel: 'SMS',
          channelLabel: 'Interactive SMS & Portal',
          dwellTimeDays: 4,
          activeAccountsCount: 0,
          completedAccountsCount: 0,
          progressedRatePct: 0,
          exitConditionSummary: 'Payment scheduled or offer expiration.',
          complianceNotes: 'Capped at pre-authorized creditor discount threshold.',
          colorTheme: 'purple',
          status: 'PENDING',
        },
      ],
      portfolios: [
        {
          portfolioId: 'PF-2026-001',
          portfolioName: 'Apex Tier-1 Consumer Revolving Q1',
          portfolioCode: 'APEX-Q1-PRIME',
          clientName: 'JPMorgan Chase & Co.',
          clientTier: 'Tier-1 Money Center Bank',
          enrolledAccounts: 450,
          enrolledBalance: 1650000,
          recoveredBalance: 0,
          liquidationRatePct: 0,
          assetClass: 'Prime Revolving Credit Card',
          attachedDate: '2026-03-01',
          dpdSummary: 'Weighted Avg: 58 DPD',
        },
      ],
      accounts: [],
      transitionRules: [
        {
          id: 'tr-new-1',
          ruleCode: 'TR-AUTO-01',
          name: 'Advance on Dwell Expiration',
          sourceStageId: 'stg-new-1',
          sourceStageName: 'Stage 1: Validation Notice',
          targetStageId: 'stg-new-2',
          targetStageName: 'Stage 2: Voice AI Outreach',
          triggerEvent: 'TIME_ELAPSED_NO_DISPUTE',
          triggerLabel: 'Dwell Time Reached (72 Hours)',
          conditions: [
            {
              field: 'DisputeStatus',
              operator: 'EQUALS',
              value: 'NONE',
              description: 'No dispute filed by debtor.',
            },
          ],
          actionSummary: 'Queue account for automated Voice AI outbound dialer.',
          velocityHours: 72,
          automatedExecution: true,
          safetyGuardrails: ['CFPB 7-in-7 Counter', 'TCPA Window'],
          status: 'ACTIVE',
          executionCountLast30Days: 0,
        },
      ],
      performance: {
        recoveryByVintage: [],
        funnel: {
          enrolled: 450,
          contacted: 0,
          engaged: 0,
          settlementOffered: 0,
          ptpSecured: 0,
          cashCollected: 0,
        },
        channelBreakdown: [],
        hourlyEngagementHeatmap: [],
        complianceStats: {
          totalInteractions: 0,
          fdcpa7in7Violations: 0,
          tcpaWindowCompliancePct: 100.0,
          optOutRequests: 0,
          optOutRatePct: 0,
          disputeTransfers: 0,
        },
      },
      complianceCadence: {
        cfpb7in7Limit: true,
        callingWindow: '08:00 - 21:00 Debtor Local Time',
        aiVoicePersona: 'Clara (Empathetic Conciliatory Financial Assistant)',
        settlementAuthorityCapPct: 20.0,
        allowWeekendSMS: false,
        maxDailyTouchesPerDebtor: 1,
        holidayBlackoutActive: true,
      },
      activityLog: [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          user: 'Operator (You)',
          action: 'Campaign Created',
          details: `Created campaign with state ${newCampData.status || 'DRAFT'}.`,
          category: 'STATUS_CHANGE',
        },
      ],
    };

    setCampaigns((prev) => [fullNew, ...prev]);
    setIsNewCampaignModalOpen(false);
    showToast(`Campaign "${fullNew.name}" created successfully as ${fullNew.status}!`);
    setSelectedCampaignId(fullNew.id);
  };

  const handleToggleCampaignState = (campaignId: string, newState: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          const updated: CampaignItem = {
            ...c,
            status: newState,
            updatedAt: 'Just now',
            activityLog: [
              {
                id: `act-${Date.now()}`,
                timestamp: 'Just now',
                user: 'Operator (You)',
                action: `State Changed to ${newState}`,
                details: `Operational state transitioned from ${c.status} to ${newState}.`,
                category: 'STATUS_CHANGE',
              },
              ...c.activityLog,
            ],
          };
          return updated;
        }
        return c;
      })
    );
    showToast(`Campaign state changed to ${newState}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-semibold text-slate-100">Campaign Operations Update</p>
            <p className="text-slate-300 mt-0.5">{toastMessage}</p>
          </div>
        </div>
      )}

      {selectedCampaign ? (
        <CampaignDetail
          campaign={selectedCampaign}
          onBack={() => setSelectedCampaignId(null)}
          onUpdateCampaign={handleUpdateCampaign}
          onToggleState={(newState) => handleToggleCampaignState(selectedCampaign.id, newState)}
          onNavigateToWorkbench={onNavigateToWorkbench}
          showToast={showToast}
        />
      ) : (
        <CampaignList
          campaigns={campaigns}
          onSelectCampaign={(id) => setSelectedCampaignId(id)}
          onOpenNewCampaignModal={() => setIsNewCampaignModalOpen(true)}
          onToggleState={handleToggleCampaignState}
          showToast={showToast}
        />
      )}

      {/* New Campaign Creation Modal */}
      <NewCampaignModal
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        onSubmit={handleCreateCampaign}
      />
    </div>
  );
};
