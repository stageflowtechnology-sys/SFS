import { StageFlowStatus, StateOrigin } from './design-system';

export type ClaimState = 'UNCLAIMED' | 'CLAIMED_BY_ME' | 'CLAIMED_BY_OTHER';

export type PriorityLevel = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';

export type DelinquencyBucket = '1_30' | '31_60' | '61_90' | '91_180' | '180_PLUS';

export type QueueStage =
  | 'EARLY_DELINQUENCY'
  | 'MID_COLLECTION'
  | 'BROKEN_PTP'
  | 'DISPUTE_REVIEW'
  | 'PRE_LEGAL'
  | 'SKIP_TRACE_ACTIVE';

export type ChannelType = 'VOICE' | 'SMS' | 'EMAIL' | 'OMNICHANNEL' | 'LEGAL_MAIL';

export interface CollectorOwnership {
  state: ClaimState;
  claimedByOperatorId?: string;
  claimedByName?: string;
  claimedByInitials?: string;
  claimedAt?: string; // e.g. "25m ago" or ISO
  claimedTimestamp?: string;
}

export interface WorkQueueAccount {
  id: string;
  accountNumber: string;
  creditorName: string;
  accountType: string;
  
  // Customer details
  customerId: string;
  customerName: string;
  customerType: 'CONSUMER' | 'COMMERCIAL';
  state: string; // Jurisdiction / state e.g. "CA", "NY"
  phoneNumbersCount: number;
  hasVerifiedContact: boolean;
  
  // Campaign
  campaignId: string;
  campaignName: string;
  campaignStep: string;
  primaryChannel: ChannelType;
  
  // Stage & Status
  stage: QueueStage;
  stageLabel: string;
  status: StageFlowStatus;
  
  // Priority & Scoring
  priority: PriorityLevel;
  propensityScore: number; // 0-100
  aiRecommended: boolean;
  
  // Financials
  balance: number;
  principalAmount: number;
  feesAccrued: number;
  authorizedSettlementDiscountPct: number; // e.g. 35 for 35%
  
  // DPD & Delinquency
  daysPastDue: number;
  dpdBucket: DelinquencyBucket;
  statuteRemainingYears?: number;
  statuteWarningDays?: number;
  
  // Last Contact
  lastContactTime: string; // e.g. "2h ago", "Yesterday 3:15 PM"
  lastContactChannel: ChannelType;
  lastContactOutcome: string;
  
  // Next Action & AI Advisory
  nextAction: string;
  nextActionCategory: 'CALL' | 'LETTER' | 'SKIP_TRACE' | 'PTP_VERIFY' | 'MANAGER_REVIEW';
  aiRecommendationSnippet?: string;
  aiConfidence?: number;
  
  // Follow-Up
  followUpTime: string; // e.g. "Today 11:30 AM", "Today 2:00 PM", "Tomorrow 9:00 AM", "None"
  followUpStatus: 'DUE_TODAY' | 'OVERDUE' | 'UPCOMING' | 'NONE';
  followUpNotes?: string;
  
  // Ownership
  ownership: CollectorOwnership;
}

export interface WorkQueueFilters {
  search: string;
  ownership: 'ALL' | 'UNCLAIMED' | 'CLAIMED_BY_ME' | 'CLAIMED_BY_OTHERS';
  priority: 'ALL' | PriorityLevel;
  stage: 'ALL' | QueueStage;
  dpdBucket: 'ALL' | DelinquencyBucket;
  balanceRange: 'ALL' | 'OVER_25K' | '10K_TO_25K' | '5K_TO_10K' | 'UNDER_5K';
  followUp: 'ALL' | 'DUE_TODAY' | 'OVERDUE' | 'UPCOMING';
  campaign: string;
}

export type QueueSortField =
  | 'accountNumber'
  | 'customerName'
  | 'campaignName'
  | 'stage'
  | 'priority'
  | 'balance'
  | 'daysPastDue'
  | 'lastContactTime'
  | 'nextAction'
  | 'followUpTime'
  | 'claimStatus';

export interface SavedViewPreset {
  id: string;
  name: string;
  description: string;
  iconName: string;
  badgeCount?: number;
  badgeVariant?: 'neutral' | 'warning' | 'purple' | 'success';
  filters: Partial<WorkQueueFilters>;
  sortField: QueueSortField;
  sortAsc: boolean;
}
