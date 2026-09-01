import React, { useState } from 'react';
import { MOCK_PORTFOLIOS } from '../../data/portfolioMockData';
import { PortfolioItem } from '../../types/portfolio';
import { PortfolioList } from './PortfolioList';
import { PortfolioDetail } from './PortfolioDetail';
import { NewPortfolioIntakeModal } from './NewPortfolioIntakeModal';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface PortfoliosScreenProps {
  initialPortfolioId?: string;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const PortfoliosScreen: React.FC<PortfoliosScreenProps> = ({
  initialPortfolioId,
  onNavigateToWorkbench,
}) => {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(MOCK_PORTFOLIOS);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(
    initialPortfolioId || null
  );
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const selectedPortfolio = portfolios.find((p) => p.id === selectedPortfolioId);

  const handleUpdatePortfolio = (updated: PortfolioItem) => {
    setPortfolios((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleSuccessIntake = (newPortData: Partial<PortfolioItem>) => {
    const newId = `PF-${Date.now()}`;
    const fullNew: PortfolioItem = {
      id: newId,
      name: newPortData.name || 'New Ingested Placement Tranche',
      code: `INGEST-${Math.floor(1000 + Math.random() * 9000)}`,
      client: {
        id: 'CL-WELLS-007',
        name: 'Wells Fargo & Company',
        code: 'WFC-NA',
        tier: 'TIER_1_BANK',
        tierLabel: 'Tier-1 Money Center Bank',
        contractRef: 'MSA-WFC-2026-001',
        contractDate: '2026-03-01',
        slaDays: 14,
        accountExecutive: 'Morgan Blake (VP Recoveries)',
      },
      assetClass: newPortData.assetClass || 'CREDIT_CARD',
      assetClassLabel: 'Prime Revolving Credit Card',
      status: 'ACTIVE',
      originationVintage: '2026-Q1',
      placementDate: '2026-03-01',
      statuteOfLimitationsDate: '2031-03-01',
      legalJurisdictions: ['NY', 'CA', 'IL', 'TX'],
      interestCapPct: 7.5,
      maxSettlementDiscountPct: 30.0,
      complianceGate: 'FDCPA Reg-F / OCC Tier-1 Validated',
      accountCount: newPortData.accountCount || {
        total: 950,
        active: 950,
        resolved: 0,
        inPtp: 0,
        inLegal: 0,
        disputed: 0,
      },
      balance: newPortData.balance || {
        originalFaceValue: 3500000,
        currentActiveBalance: 3500000,
        collectedAmount: 0,
        recoveryRatePct: 0,
        targetRecoveryPct: 35.0,
        avgAccountBalance: 3684,
        currency: 'USD',
      },
      dpdDistribution: {
        bucket0_30: { count: 380, balance: 1400000, percentage: 40.0 },
        bucket31_60: { count: 320, balance: 1180000, percentage: 33.7 },
        bucket61_90: { count: 150, balance: 550000, percentage: 15.7 },
        bucket91_120: { count: 70, balance: 260000, percentage: 7.4 },
        bucket120Plus: { count: 30, balance: 110000, percentage: 3.2 },
        totalAccounts: 950,
        totalBalance: 3500000,
        weightedAvgDpd: 42.1,
      },
      campaigns: [
        {
          id: `CMP-NEW-01`,
          name: 'Welcome & Validation Notice Digital Sequence',
          code: 'SMS-VALIDATE',
          channel: 'OMNICHANNEL_SMS',
          status: 'RUNNING',
          enrolledAccounts: 500,
          contactRatePct: 95.0,
          responseRatePct: 20.0,
          ptpConversionRatePct: 15.0,
          collectedAmount: 0,
          startDate: '2026-03-01',
          cadenceDescription: 'CFPB compliant initial debt validation disclosure and self-service settlement link',
        },
      ],
      collectors: [
        {
          id: 'COL-01',
          operatorId: 'OP-4491',
          name: 'Sarah Jenkins',
          avatarInitials: 'SJ',
          role: 'Senior Recovery Specialist',
          assignedAccounts: 475,
          assignedBalance: 1750000,
          capacityUtilizationPct: 80,
          resolutionRatePct: 0,
          ptpAdherenceRatePct: 0,
          isTeamLead: true,
        },
        {
          id: 'COL-02',
          operatorId: 'OP-5102',
          name: 'Marcus Vance',
          avatarInitials: 'MV',
          role: 'Negotiation Officer',
          assignedAccounts: 475,
          assignedBalance: 1750000,
          capacityUtilizationPct: 78,
          resolutionRatePct: 0,
          ptpAdherenceRatePct: 0,
        },
      ],
      aiPropensityScore: 82,
      aiStrategySummary: 'Newly ingested cohort with high initial settlement likelihood. Prioritize digital outreach and automated discount offers during initial 30-day placement window.',
      performanceHistory: [
        {
          period: 'Mar 2026 (Month 1)',
          targetRecoveryAmount: 350000,
          actualRecoveryAmount: 0,
          targetLiquidationPct: 10.0,
          actualLiquidationPct: 0,
          accountsSettled: 0,
          brokenPtpCount: 0,
        },
      ],
      activityMilestones: [
        {
          id: `ACT-NEW-01`,
          timestamp: '2026-03-01 12:00 PM',
          actor: 'Ingestion Rail',
          actorRole: 'Core Placement Gate',
          type: 'STAGE_MIGRATION',
          title: 'Tranche Loaded & Validated',
          description: '950 claims verified against credit bureaus and state licensing criteria.',
          badgeVariant: 'success',
        },
      ],
      accounts: [
        {
          id: 'ACC-NEW-01',
          accountNumber: 'ACC-WFC-881',
          customerName: 'Morgan Elizabeth Freeman',
          ssnMasked: '•••-••-5591',
          balance: 3850.00,
          originalPrincipal: 3850.00,
          daysPastDue: 32,
          dpdBucket: '31-60',
          stage: 'INITIAL_CONTACT',
          status: 'ACTIVE',
          origin: 'SYSTEM_EXECUTION',
          assignedCollectorId: 'OP-4491',
          assignedCollectorName: 'Sarah Jenkins',
          propensityScore: 85,
          recommendedAction: 'Dispatch initial mini-Miranda digital disclosure with discount portal',
          phone: '+1 (555) 304-9912',
          email: 'm.freeman@pacificholdings.com',
          cityState: 'San Francisco, CA',
          lastContactDate: '2026-03-01',
          ptpStatus: 'NONE',
        },
      ],
    };

    setPortfolios([fullNew, ...portfolios]);
    showToast(`Successfully ingested new placement tranche: "${fullNew.name}"`);
  };

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {selectedPortfolio ? (
        <PortfolioDetail
          portfolio={selectedPortfolio}
          onBack={() => setSelectedPortfolioId(null)}
          onNavigateToWorkbench={onNavigateToWorkbench}
          onUpdatePortfolio={handleUpdatePortfolio}
        />
      ) : (
        <PortfolioList
          portfolios={portfolios}
          onSelectPortfolio={(id) => setSelectedPortfolioId(id)}
          onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        />
      )}

      {/* New Portfolio Intake Modal */}
      <NewPortfolioIntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSuccess={handleSuccessIntake}
      />
    </div>
  );
};
