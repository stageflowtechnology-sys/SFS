/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ExecutionStatus = 'PENDING' | 'CONFIRMED' | 'EXECUTED_VERIFIED' | 'EXECUTION_FAILED';

export interface MilestoneItem {
  time: string;
  speaker: string;
  title: string;
  description: string;
}

export interface StressPoint {
  time: string;
  agentStress: number;
  debtorStress: number;
}

export interface PtpInstallment {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  rail: string;
  status: 'PENDING_SCHEDULE' | 'SCHEDULED_LOCKED' | 'PROCESSED';
}

export interface GateCheck {
  check: string;
  satisfied: boolean;
  evidenceRef: string;
}

export interface SubScore {
  dimension: string;
  score: number;
  status: 'HIGH' | 'MODERATE' | 'LOW';
  details: string;
}

export interface EvidenceCitation {
  id: string;
  category: 'TRANSCRIPT_CITATION' | 'STATUTORY_DISCLOSURE' | 'ENTITY_DISCOVERY' | 'FINANCIAL_COMMITMENT';
  timestamp: string;
  quote: string;
  speaker: string;
  extractedFact: string;
  confidence: number;
  verified: boolean;
}

export interface AcousticSignal {
  id: string;
  name: string;
  category: 'ACOUSTIC' | 'INTENT' | 'SOLVENCY' | 'COMPLIANCE' | 'RISK';
  level: 'POSITIVE' | 'WARNING' | 'NEUTRAL' | 'CRITICAL';
  score: number;
  description: string;
  evidenceTime: string;
}

export interface OperationalRecommendationItem {
  id: string;
  title: string;
  category: 'DISPOSITION' | 'PTP_POSTING' | 'FOLLOW_UP_SCHEDULE' | 'STAGE_TRANSITION' | 'NEXT_ACTION';
  description: string;
  impact: string;
  status: ExecutionStatus;
  aiConfidence: number;
  confirmedBy?: string;
  confirmedAt?: string;
  executedAt?: string;
  executionReceiptHash?: string;
  errorMessage?: string;
}

export interface PostCallReviewRecord {
  callId: string;
  callDateTime: string;
  durationSeconds: number;
  audioRecordingUrl: string;
  channel: 'INBOUND' | 'OUTBOUND';
  collectorName: string;
  collectorId: string;
  debtorName: string;
  accountNumber: string;
  originalCreditor: string;
  totalBalance: number;
  principalBalance: number;
  accruedFees: number;
  daysPastDue: number;

  // 1. Interaction Summary items
  summary: string;
  milestones: MilestoneItem[];

  disposition: {
    code: string;
    label: string;
    description: string;
  };

  sentiment: {
    initialState: string;
    finalState: string;
    trend: 'positive_recovery' | 'de_escalated' | 'persistent_friction' | 'neutral';
    debtorCooperationScore: number;
    agentEmpathyScore: number;
    stressTrajectory: StressPoint[];
    acousticObservations: string[];
  };

  collectionOutcome: {
    outcomeType: 'PROMISE_TO_PAY' | 'PARTIAL_DOWNPAYMENT' | 'HARDSHIP_INTAKE' | 'DISPUTE_INVESTIGATION' | 'REFUSAL_TO_PAY';
    label: string;
    amountRecoveredPromise: number;
    settlementPercentage: number;
    feeConcessionGranted: number;
    resolutionEfficiency: string;
  };

  nonPaymentReason: {
    primaryCategory: string;
    rootCauseSummary: string;
    supportingDebtorStatements: string[];
    mitigatingFactors: string[];
  };

  ptpInformation: {
    hasPtp: boolean;
    promisedAmount: number;
    firstPaymentDate: string;
    paymentRail: string;
    paymentSchedule: PtpInstallment[];
    preAuthorizedDebitToken: string;
    feeWaiverApproved: boolean;
    feeWaiverAmount: number;
  };

  recommendedFollowUp: {
    followUpDate: string;
    followUpTime: string;
    channel: 'SMS_AND_EMAIL' | 'PHONE_OUTBOUND' | 'LEGAL_LETTER' | 'SECURE_PORTAL';
    channelLabel: string;
    actionTitle: string;
    instructions: string;
    complianceNotice: string;
  };

  recommendedNextAction: {
    actionType: string;
    actionTitle: string;
    description: string;
    targetSystem: string;
    priority: 'HIGH' | 'CRITICAL' | 'STANDARD';
  };

  recommendedStage: {
    currentStageNumber: number;
    currentStageName: string;
    recommendedStageNumber: number;
    recommendedStageName: string;
    transitionRationale: string;
    gateChecklist: GateCheck[];
  };

  // 2. AI Confidence
  aiConfidence: {
    overallConfidence: number;
    confidenceTier: 'VERY_HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
    modelEngine: string;
    subScores: SubScore[];
    evidence: EvidenceCitation[];
    signals: AcousticSignal[];
  };

  // 3. Operational Recommendations Array with independent lifecycle states
  recommendations: OperationalRecommendationItem[];
}
