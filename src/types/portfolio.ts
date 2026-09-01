import { StageFlowStatus, StateOrigin } from './design-system';
import { QueueStage, PriorityLevel, DelinquencyBucket } from './workQueue';

export type PortfolioStatus =
  | 'ACTIVE'
  | 'PACING_AHEAD'
  | 'UNDERPERFORMING'
  | 'PAUSED'
  | 'SETTLED'
  | 'AUDITING'
  | 'LEGAL_REVIEW';

export type AssetClass =
  | 'CREDIT_CARD'
  | 'AUTO_LOAN'
  | 'MEDICAL_HEALTHCARE'
  | 'COMMERCIAL_SMB'
  | 'PERSONAL_INSTALLMENT'
  | 'MORTGAGE_ESCROW';

export type PortfolioDetailTabId =
  | 'overview'
  | 'accounts'
  | 'campaigns'
  | 'assignments'
  | 'performance';

export interface DpdBucketDistribution {
  bucket0_30: { count: number; balance: number; percentage: number };
  bucket31_60: { count: number; balance: number; percentage: number };
  bucket61_90: { count: number; balance: number; percentage: number };
  bucket91_120: { count: number; balance: number; percentage: number };
  bucket120Plus: { count: number; balance: number; percentage: number };
  totalAccounts: number;
  totalBalance: number;
  weightedAvgDpd: number;
}

export interface PortfolioCampaignSummary {
  id: string;
  name: string;
  code: string;
  channel: 'VOICE_AI' | 'OMNICHANNEL_SMS' | 'EMAIL_SERIES' | 'LEGAL_NOTICE' | 'MULTI_TOUCH';
  status: 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'SCHEDULED';
  enrolledAccounts: number;
  contactRatePct: number;
  responseRatePct: number;
  ptpConversionRatePct: number;
  collectedAmount: number;
  startDate: string;
  cadenceDescription: string;
}

export interface PortfolioCollectorSummary {
  id: string;
  operatorId: string;
  name: string;
  avatarInitials: string;
  role: string;
  assignedAccounts: number;
  assignedBalance: number;
  capacityUtilizationPct: number;
  resolutionRatePct: number;
  ptpAdherenceRatePct: number;
  isTeamLead?: boolean;
}

export type PortfolioDpdBucket = '1-30' | '31-60' | '61-90' | '91-120' | '120+';

export type PortfolioAccountStage =
  | 'OUTREACH_PENDING'
  | 'INITIAL_CONTACT'
  | 'NEGOTIATION'
  | 'PROMISE_TO_PAY'
  | 'SETTLEMENT_PROPOSED'
  | 'PRE_LEGAL'
  | 'LEGAL_ESCALATION'
  | 'SKIP_TRACE_ACTIVE';

export interface PortfolioAccountItem {
  id: string;
  accountNumber: string;
  customerName: string;
  ssnMasked: string;
  balance: number;
  originalPrincipal: number;
  daysPastDue: number;
  dpdBucket: PortfolioDpdBucket;
  stage: PortfolioAccountStage;
  status: StageFlowStatus;
  origin: StateOrigin;
  assignedCollectorId: string;
  assignedCollectorName: string;
  propensityScore: number;
  recommendedAction: string;
  phone: string;
  email: string;
  cityState: string;
  lastContactDate?: string;
  ptpStatus?: 'NONE' | 'ACTIVE_PROMISE' | 'HONORED' | 'BROKEN';
}

export interface PortfolioPerformanceVintage {
  period: string; // e.g. 'Month 1', 'Month 2' or 'Jan 2026'
  targetRecoveryAmount: number;
  actualRecoveryAmount: number;
  targetLiquidationPct: number;
  actualLiquidationPct: number;
  accountsSettled: number;
  brokenPtpCount: number;
}

export interface PortfolioActivityMilestone {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  type: 'PAYMENT' | 'CAMPAIGN' | 'ASSIGNMENT' | 'COMPLIANCE' | 'RECONCILIATION' | 'STAGE_MIGRATION';
  title: string;
  description: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'purple' | 'danger';
}

export interface PortfolioItem {
  id: string;
  name: string;
  code: string;
  client: {
    id: string;
    name: string;
    code: string;
    tier: 'TIER_1_BANK' | 'FINTECH' | 'HEALTHCARE' | 'AUTO_FINANCE' | 'COMMERCIAL';
    tierLabel: string;
    contractRef: string;
    contractDate: string;
    slaDays: number;
    accountExecutive: string;
  };
  assetClass: AssetClass;
  assetClassLabel: string;
  status: PortfolioStatus;
  originationVintage: string;
  placementDate: string;
  statuteOfLimitationsDate: string;
  legalJurisdictions: string[];
  interestCapPct: number;
  maxSettlementDiscountPct: number;
  complianceGate: string;
  accountCount: {
    total: number;
    active: number;
    resolved: number;
    inPtp: number;
    inLegal: number;
    disputed: number;
  };
  balance: {
    originalFaceValue: number;
    currentActiveBalance: number;
    collectedAmount: number;
    recoveryRatePct: number;
    targetRecoveryPct: number;
    avgAccountBalance: number;
    currency: string;
  };
  dpdDistribution: DpdBucketDistribution;
  campaigns: PortfolioCampaignSummary[];
  collectors: PortfolioCollectorSummary[];
  aiPropensityScore: number;
  aiStrategySummary: string;
  performanceHistory: PortfolioPerformanceVintage[];
  activityMilestones: PortfolioActivityMilestone[];
  accounts: PortfolioAccountItem[];
}
