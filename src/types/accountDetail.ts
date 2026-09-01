import { StageFlowStatus, StateOrigin } from './design-system';
import { PriorityLevel, DelinquencyBucket, QueueStage, ChannelType } from './workQueue';
import { ContactMethod, PastInteraction, AiIntelligencePackage } from './workbench';

export type AccountTabId =
  | 'overview'
  | 'timeline'
  | 'interactions'
  | 'payments'
  | 'ptp'
  | 'skip-trace'
  | 'follow-ups'
  | 'collection-gaps'
  | 'audit';

export interface TimelineEvent {
  id: string;
  date: string;
  stage: string;
  title: string;
  description: string;
  actorType: 'SYSTEM' | 'COLLECTOR' | 'DEBTOR' | 'COURT' | 'AI';
  actorName: string;
  origin: StateOrigin;
  status: StageFlowStatus;
  category: 'STAGE_CHANGE' | 'PAYMENT' | 'PTP' | 'LEGAL' | 'COMMUNICATION' | 'DISPUTE' | 'COMPLIANCE';
  metadata?: Record<string, string | number | boolean>;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  principalApplied: number;
  interestApplied: number;
  feeApplied: number;
  paymentMethod: 'ACH_DIRECT_DEBIT' | 'FEDWIRE' | 'DEBIT_CARD' | 'CERTIFIED_CHECK' | 'ESCROW_PAYOUT';
  referenceNumber: string;
  status: 'SETTLED' | 'PENDING' | 'RECONCILED' | 'FAILED' | 'REVERSED';
  origin: StateOrigin;
  settlementBatchId?: string;
  clearingBank: string;
}

export interface PtpRecord {
  id: string;
  creationDate: string;
  dueDate: string;
  amount: number;
  paymentMethod: string;
  collectorName: string;
  collectorId: string;
  status: 'PENDING_DUE' | 'HONORED_SETTLED' | 'BROKEN_DEFAULTED' | 'RESCHEDULED' | 'CANCELLED';
  origin: StateOrigin;
  installmentNumber?: number;
  totalInstallments?: number;
  notes: string;
  reconciliationTxId?: string;
}

export interface SkipTraceHit {
  id: string;
  category: 'EMPLOYMENT' | 'PROPERTY' | 'PHONE' | 'ADDRESS' | 'BANK_DISCOVERY' | 'CORPORATE_FILING';
  source: string; // e.g. "LexisNexis Risk Solutions", "Equifax Credit Bureau", "State Secretary of State"
  discoveredDate: string;
  confidenceScore: number;
  status: 'VERIFIED' | 'UNVERIFIED' | 'DISPROVED' | 'PENDING_OUTREACH';
  details: {
    field: string;
    oldValue?: string;
    newValue: string;
    verificationMethod: string;
  };
}

export interface FollowUpItem {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  assignedCollector: string;
  assignedCollectorId: string;
  priority: PriorityLevel;
  type: 'CALLBACK_REQUESTED' | 'PTP_PRE_REMINDER' | 'HARDSHIP_REVIEW' | 'LEGAL_PACKET_REVIEW' | 'SKIP_RE_SEARCH';
  reason: string;
  targetChannel: ChannelType;
  status: 'OPEN_PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  reminderSent: boolean;
}

export interface CollectionGap {
  id: string;
  type: 'CADENCE_DELAY' | 'MISSED_PTP_FOLLOWUP' | 'UNTOUCHED_OVER_SLA' | 'COMPLIANCE_BLACKOUT' | 'UNVERIFIED_CONTACT';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
  durationDays: number;
  title: string;
  description: string;
  suggestedRemediation: string;
  remediationActionLabel: string;
  assignedToRole: string;
  resolved: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  targetField: string;
  previousValue: string;
  newValue: string;
  origin: StateOrigin;
  ipAddress: string;
  immutableHash: string;
}

export interface ContactabilityMetric {
  overallScore: number; // 0 - 100
  phoneScore: number;
  emailScore: number;
  addressScore: number;
  bestContactChannel: ChannelType;
  bestWindow: string;
  timezone: string;
  tcpaStatus: 'FULL_CONSENT' | 'REVOKED' | 'LIMITED_TIME_ONLY' | 'EXEMPT';
  dncFlag: boolean;
  contactAttemptsLast30Days: number;
  successfulContactsLast30Days: number;
  contactRatePct: number;
}

export interface AccountDetailData {
  account: {
    id: string;
    accountNumber: string;
    creditorName: string;
    accountType: string;
    originalBalance: number;
    totalBalance: number;
    principalAmount: number;
    accruedInterest: number;
    accruedFees: number;
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
    originalCreditLimit: number;
    minAcceptableSettlement: number;
    authorizedDiscountPct: number;
    originationDate: string;
    chargeOffDate: string;
    openDate: string;
  };

  customer: {
    id: string;
    name: string;
    type: 'CONSUMER' | 'COMMERCIAL';
    ssnMasked: string;
    dobMasked: string;
    state: string;
    fullAddress: string;
    employer: string;
    businessTaxIdMasked?: string;
    jurisdictionRules: string;
  };

  delinquency: {
    daysPastDue: number;
    dpdBucket: DelinquencyBucket;
    dpdBucketLabel: string;
    status: StageFlowStatus;
    statusLabel: string;
    statuteOfLimitationsDate: string;
    statuteRemainingYears: number;
    statuteState: string;
    statuteStatus: 'ACTIVE_ENFORCEABLE' | 'APPROACHING_EXPIRY' | 'TIME_BARRED';
  };

  portfolio: {
    id: string;
    name: string;
    vintage: string;
    debtType: string;
    placementDate: string;
  };

  campaign: {
    id: string;
    name: string;
    currentStep: string;
    stepNumber: number;
    totalSteps: number;
    strategyType: string;
    activeCadenceInterval: string;
  };

  stage: {
    currentStage: QueueStage;
    currentStageLabel: string;
    stageEnteredDate: string;
    daysInCurrentStage: number;
    status: StageFlowStatus;
    origin: StateOrigin;
    slaTargetDays: number;
    slaStatus: 'ON_TRACK' | 'AT_RISK' | 'BREACHED';
    exitCriteria: string[];
    complianceMandates: string[];
  };

  assignedCollector: {
    operatorId: string;
    name: string;
    title: string;
    email: string;
    phoneExt: string;
    status: 'ONLINE' | 'IN_CALL' | 'AWAY';
    assignedDate: string;
  };

  contactability: ContactabilityMetric;
  contacts: ContactMethod[];
  recentInteractions: PastInteraction[];
  timeline: TimelineEvent[];
  payments: PaymentRecord[];
  ptps: PtpRecord[];
  skipTraceHits: SkipTraceHit[];
  followUps: FollowUpItem[];
  collectionGaps: CollectionGap[];
  auditLogs: AuditLogEntry[];
  aiIntelligence: AiIntelligencePackage;
}
