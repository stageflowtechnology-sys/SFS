export type FollowUpViewTab = 'TODAY' | 'UPCOMING' | 'OVERDUE' | 'COMPLETED' | 'CANCELLED';

export type FollowUpType = 'CALL' | 'SMS' | 'EMAIL' | 'REVIEW';

export type FollowUpSourceOrigin = 'AI_GENERATED' | 'MANUAL';

export type FollowUpStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE' | 'SNOOZED';

export type FollowUpPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL' | 'LOW';

export interface FollowUpCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  ssnMasked: string;
  timezone: string;
  bestTimeToContact?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface FollowUpAccount {
  id: string;
  accountNumber: string;
  originalCreditor: string;
  portfolio: string;
  balance: number;
  principalAmount: number;
  daysPastDue: number;
  currentStage: string;
}

export interface FollowUpCollector {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  isCurrentUser?: boolean;
}

export interface FollowUpSourceInfo {
  origin: FollowUpSourceOrigin;
  sourceName: string; // e.g. "AI Copilot v3.1", "AI Recovery Engine", "Manual: Armando Santiago", "Supervisor Assignment"
  modelConfidence?: number; // e.g. 0.94 for 94%
  algorithmTag?: string; // e.g. "PROPENSITY_RECOVERY_V3", "POST_CALL_DISPUTE_TRIGGER", "PROMISE_TO_PAY_TRACKER"
  aiReasoning?: string; // e.g. "Debtor indicated during Call #9921 that payday is 1st of month. Propensity model predicts 92% settlement rate if contacted between 2-4 PM."
  createdBy: string;
  createdAt: string;
  provenanceHash?: string;
}

export interface FollowUpRecommendedAction {
  label: string; // e.g. "Dial Mobile", "Send Reg-F SMS", "Dispatch Settlement Email", "Verify Hardship Proof"
  actionType: FollowUpType;
  description: string;
  suggestedScript?: string;
  urgency: FollowUpPriority;
  targetPayload?: string;
}

export interface FollowUpItem {
  id: string;
  account: FollowUpAccount;
  customer: FollowUpCustomer;
  reason: string;
  type: FollowUpType;
  dueDate: string; // e.g. "Today, 2:30 PM", "Tomorrow, 10:00 AM", "Yesterday, 4:00 PM"
  dueTimestamp: number; // unix timestamp for precise sorting/filtering
  collector: FollowUpCollector;
  source: FollowUpSourceInfo;
  status: FollowUpStatus;
  recommendedAction: FollowUpRecommendedAction;
  priority: FollowUpPriority;
  notes?: string;
  completedAt?: string;
  completedBy?: string;
  completionOutcome?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  tags?: string[];
}

export interface FollowUpFilterState {
  search: string;
  type: 'ALL' | FollowUpType;
  source: 'ALL' | FollowUpSourceOrigin;
  collector: 'ALL' | 'ME' | string;
  priority: 'ALL' | FollowUpPriority;
  sortBy: 'DUE_DATE' | 'BALANCE' | 'PRIORITY' | 'CUSTOMER_NAME' | 'TYPE';
  sortDirection: 'ASC' | 'DESC';
}

export interface FollowUpStats {
  todayCount: number;
  upcomingCount: number;
  overdueCount: number;
  completedCount: number;
  cancelledCount: number;
  aiGeneratedCount: number;
  manualCount: number;
  totalActive: number;
  slaAdherenceRate: number; // percentage e.g. 96.4%
}
