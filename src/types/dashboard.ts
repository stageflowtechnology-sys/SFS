import { StageFlowStatus, StateOrigin } from './design-system';

export interface OperationalKPIs {
  activeAccounts: {
    total: number;
    changePct: number;
    breakdown: {
      earlyStage: number;   // 1-30 DPD
      midStage: number;     // 31-90 DPD
      lateStage: number;    // 90+ DPD
      preLegal: number;
    };
  };
  outstandingBalance: {
    total: number;
    liquidatedThisMonth: number;
    liquidationRatePct: number;
    targetPct: number;
  };
  accountsRequiringAttention: {
    total: number;
    criticalRisk: number;
    brokenPromises: number;
    disputeHolds: number;
    highBalanceDormant: number;
  };
  todaysWork: {
    completedTouches: number;
    targetTouches: number;
    adherencePct: number;
    callsCompleted: number;
    smsSent: number;
    lettersDispatched: number;
  };
  overdueFollowUps: {
    total: number;
    totalBalance: number;
    criticalOverdue: number; // >24h overdue
    averageDelayHours: number;
  };
  ptpActivity: {
    scheduledTodayCount: number;
    scheduledTodayAmount: number;
    collectedTodayAmount: number;
    honorRatePct: number;
    brokenCount: number;
  };
  contactability: {
    rpcRatePct: number;
    totalDialsToday: number;
    connectedCount: number;
    verifiedRpcCount: number;
    bestHourWindow: string;
  };
  qaActivity: {
    averageScorePct: number;
    auditedTodayCount: number;
    flaggedViolationsCount: number;
    miniMirandaPassRatePct: number;
  };
}

export interface CollectorWorkloadItem {
  id: string;
  name: string;
  operatorId: string;
  avatarInitials: string;
  activeAccountsCount: number;
  touchesCompleted: number;
  touchesTarget: number;
  rpcRate: number;
  ptpAmountToday: number;
  overdueCount: number;
  capacityStatus: 'NORMAL' | 'HEAVY' | 'OVERLOADED';
  activePortfolio: string;
  qaScore: number;
}

export interface AccountRequiringAttention {
  id: string;
  accountNumber: string;
  debtorName: string;
  balance: number;
  daysPastDue: number;
  reason: string;
  reasonCategory: 'BROKEN_PTP' | 'DISPUTE_SLA' | 'STATUTE_LIMIT' | 'HIGH_VALUE_DORMANT' | 'COMPLIANCE_FLAG';
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  assignedCollector: string;
  suggestedAction: string;
  daysInAttentionState: number;
}

export interface CollectionOutcome {
  id: string;
  timestamp: string;
  debtorName: string;
  accountNumber: string;
  amount: number;
  type: 'SETTLEMENT_PIF' | 'PAYMENT_PLAN_ESTABLISHED' | 'WIRE_CLEARED' | 'PARTIAL_PAYMENT' | 'PTP_LOGGED';
  paymentRail: 'FEDWIRE' | 'ACH_DEBIT' | 'DEBIT_CARD' | 'CERTIFIED_CHECK';
  collectorName: string;
  status: StageFlowStatus;
  notes: string;
}

export interface DashboardAIRecommendation {
  id: string;
  accountNumber: string;
  debtorName: string;
  balance: number;
  actionTitle: string;
  modelConfidence: number;
  projectedRecoveryLift: number;
  modelVersion: string;
  reasoning: string;
  origin: StateOrigin;
  urgency: 'HIGH' | 'MEDIUM';
  suggestedDiscountPct?: number;
}

export interface FollowUpDueToday {
  id: string;
  timeSlot: string;
  timeSlotFull: string;
  accountNumber: string;
  debtorName: string;
  balance: number;
  type: 'PTP_MATURITY' | 'CALLBACK_PROMISE' | 'HARDSHIP_REVIEW' | 'ASSET_VERIFICATION_CHECK';
  collectorName: string;
  collectorId: string;
  status: 'COMPLETED' | 'DUE_SOON' | 'OVERDUE' | 'SCHEDULED';
  minutesDelta: number; // negative for overdue, positive for upcoming
}

export interface CollectionGapItem {
  id: string;
  title: string;
  category: 'UNCONTACTED_HIGH_VALUE' | 'EXPIRED_SKIP_TRACE' | 'BROKEN_PTP_LAG' | 'DISPUTE_DEADLINE_RISK';
  accountCount: number;
  totalAtRiskAmount: number;
  description: string;
  operationalImpact: string;
  urgency: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  actionLabel: string;
}

export interface RecentQAAuditItem {
  id: string;
  auditNumber: string;
  timestamp: string;
  collectorName: string;
  collectorId: string;
  callDuration: string;
  score: number;
  miniMirandaVerified: boolean;
  fdcpaCompliant: boolean;
  deviationSummary: string;
  auditorName: string;
  actionRequired: 'COACHING_ASSIGNED' | 'CLEARED' | 'RE_AUDIT_MANDATED';
}
