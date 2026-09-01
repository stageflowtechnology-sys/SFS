import { StageFlowStatus } from './design-system';

export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED';

export type CampaignType =
  | 'OMNICHANNEL'
  | 'VOICE_AI'
  | 'SMS_CADENCE'
  | 'EMAIL_SERIES'
  | 'PRE_LEGAL_NOTICE'
  | 'SETTLEMENT_OFFER'
  | 'SKIP_TRACE_CADENCE';

export type CampaignDetailTabId =
  | 'overview'
  | 'portfolios'
  | 'stages'
  | 'accounts'
  | 'performance'
  | 'transition-rules';

export type CampaignChannel = 'VOICE' | 'SMS' | 'EMAIL' | 'MAIL' | 'AGENT';

export interface CampaignStage {
  id: string;
  order: number;
  name: string;
  code: string;
  description: string;
  type:
    | 'NOTIFICATION'
    | 'VOICE_AI'
    | 'SETTLEMENT_PROPOSAL'
    | 'COLLECTOR_TOUCH'
    | 'PRE_LEGAL'
    | 'SETTLED'
    | 'EXIT_REVIEW';
  channel: 'EMAIL' | 'SMS' | 'VOICE_AI' | 'COLLECTOR_QUEUE' | 'POSTAL_MAIL' | 'OMNICHANNEL';
  channelLabel: string;
  dwellTimeDays: number;
  activeAccountsCount: number;
  completedAccountsCount: number;
  progressedRatePct: number;
  exitConditionSummary: string;
  skipConditionSummary?: string;
  complianceNotes: string;
  colorTheme: string;
  status: 'ACTIVE' | 'PENDING' | 'COMPLETED' | 'INACTIVE';
  isEntryStage?: boolean;
  isExitStage?: boolean;
}

export interface CampaignPortfolioLink {
  portfolioId: string;
  portfolioName: string;
  portfolioCode: string;
  clientName: string;
  clientTier: string;
  enrolledAccounts: number;
  enrolledBalance: number;
  recoveredBalance: number;
  liquidationRatePct: number;
  assetClass: string;
  attachedDate: string;
  dpdSummary: string;
}

export interface CampaignAccountItem {
  id: string;
  accountNumber: string;
  customerName: string;
  portfolioName: string;
  portfolioId: string;
  balance: number;
  daysPastDue: number;
  currentStageId: string;
  currentStageName: string;
  status: 'IN_PROGRESS' | 'PTP_ACTIVE' | 'RESPONDED' | 'UNREACHED' | 'OPTED_OUT' | 'RESOLVED';
  statusLabel: string;
  touchCount: { calls: number; sms: number; emails: number };
  lastTouchDate: string;
  lastTouchChannel: string;
  nextScheduledTouch: string;
  propensityScore: number;
  ptpAmount?: number;
  ptpDate?: string;
}

export interface StageTransitionRuleItem {
  id: string;
  ruleCode: string;
  name: string;
  sourceStageId: string;
  sourceStageName: string;
  targetStageId: string;
  targetStageName: string;
  triggerEvent: string;
  triggerLabel: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
    description: string;
  }>;
  actionSummary: string;
  velocityHours: number;
  automatedExecution: boolean;
  safetyGuardrails: string[];
  status: 'ACTIVE' | 'MONITORED' | 'STANDBY';
  executionCountLast30Days: number;
}

export interface CampaignPerformanceData {
  recoveryByVintage: Array<{
    period: string;
    collected: number;
    target: number;
    ratePct: number;
  }>;
  funnel: {
    enrolled: number;
    contacted: number;
    engaged: number;
    settlementOffered: number;
    ptpSecured: number;
    cashCollected: number;
  };
  channelBreakdown: Array<{
    channel: string;
    channelKey: CampaignChannel;
    touches: number;
    responses: number;
    responseRatePct: number;
    collected: number;
  }>;
  hourlyEngagementHeatmap: Array<{
    hour: string;
    contacts: number;
    responsePct: number;
  }>;
  complianceStats: {
    totalInteractions: number;
    fdcpa7in7Violations: number;
    tcpaWindowCompliancePct: number;
    optOutRequests: number;
    optOutRatePct: number;
    disputeTransfers: number;
  };
}

export interface CampaignItem {
  id: string;
  code: string;
  name: string;
  type: CampaignType;
  typeLabel: string;
  status: CampaignStatus;
  description: string;
  targetAudience: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  enrolledPortfoliosCount: number;
  totalAccounts: number;
  activeAccounts: number;
  completedAccounts: number;
  totalEnrolledBalance: number;
  totalCollectedBalance: number;
  liquidationRatePct: number;
  targetLiquidationRatePct: number;
  contactRatePct: number;
  responseRatePct: number;
  ptpConversionRatePct: number;
  channels: CampaignChannel[];
  stages: CampaignStage[];
  portfolios: CampaignPortfolioLink[];
  accounts: CampaignAccountItem[];
  transitionRules: StageTransitionRuleItem[];
  performance: CampaignPerformanceData;
  complianceCadence: {
    cfpb7in7Limit: boolean;
    callingWindow: string;
    aiVoicePersona: string;
    settlementAuthorityCapPct: number;
    allowWeekendSMS: boolean;
    maxDailyTouchesPerDebtor: number;
    holidayBlackoutActive: boolean;
  };
  activityLog: Array<{
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
    category: 'STATUS_CHANGE' | 'CONFIG_UPDATE' | 'ENROLLMENT' | 'COMPLIANCE_AUDIT';
  }>;
}
