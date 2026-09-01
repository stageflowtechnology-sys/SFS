/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RecommendationSection =
  | 'PENDING'
  | 'ADVISORY'
  | 'EXECUTED_VERIFIED'
  | 'EXECUTION_FAILED'
  | 'REJECTED';

export type RecommendationCategory = 'OPERATIONAL' | 'ADVISORY';

export type RecommendationActionType =
  | 'SETTLEMENT_OFFER'
  | 'STAGE_TRANSITION'
  | 'PTP_INSTALLMENT_PLAN'
  | 'DIALER_SUPPRESSION'
  | 'FEE_WAIVER'
  | 'HARDSHIP_RECLASSIFICATION'
  | 'CALL_TIME_OPTIMIZATION'
  | 'LEGAL_ESCALATION_HOLD'
  | 'SKIP_TRACE_TRIGGER'
  | 'BANKRUPTCY_ALERT';

export interface RecommendationAccount {
  accountNumber: string;
  totalBalance: number;
  principalBalance: number;
  accruedFees: number;
  daysPastDue: number;
  creditor: string;
  portfolio: string;
  currentStage: string;
}

export interface RecommendationCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  riskTier: 'HIGH_RISK' | 'MODERATE' | 'LOW_RISK' | 'CRITICAL';
  solvencyScore: number;
}

export interface ConfidenceFactor {
  name: string;
  weight: string;
  score: number;
}

export interface RecommendationConfidence {
  score: number; // 0 - 100
  tier: 'HIGH' | 'MODERATE' | 'REVIEW_REQUIRED';
  calibrationModel: string;
  factors: ConfidenceFactor[];
}

export interface RecommendationEvidence {
  type: 'AUDIO_TRANSCRIPT' | 'PAYMENT_HISTORY' | 'ACOUSTIC_SENTIMENT' | 'BUREAU_TELEMETRY' | 'STATUTORY_RULE';
  directCitation: string;
  timestampOrRef: string;
  groundingExplanation: string;
  additionalFacts?: string[];
}

export interface StateStateBlock {
  label: string;
  description: string;
  metrics: { key: string; value: string }[];
}

export interface RecommendationActor {
  type: 'AI_ENGINE' | 'COLLECTOR' | 'SUPERVISOR' | 'SYSTEM';
  name: string;
  id: string;
  role: string;
}

export interface VerificationResult {
  receiptHash: string;
  executedAt: string;
  verifiedAt: string;
  verifiedBy: string;
  targetSystem: string;
  ledgerCommitBlock: string;
  stateMutationDelta: string;
  status: 'VERIFIED_SUCCESS';
}

export interface FailureDetails {
  failedAt: string;
  errorCode: string;
  errorCategory: 'GATEWAY_TIMEOUT' | 'INSUFFICIENT_FUNDS' | 'POLICY_OVERRIDE_REQUIRED' | 'TOKEN_EXPIRED' | 'SYSTEM_LOCK';
  errorMessage: string;
  affectedSystem: string;
  recommendedRemedy: string;
  canRetry: boolean;
  retryCount: number;
}

export interface RejectionDetails {
  rejectedAt: string;
  rejectedBy: string;
  rejectionReason: string;
  category: 'COLLECTOR_DISCRETION' | 'INCORRECT_INFERENCE' | 'DEBTOR_REFUSAL' | 'SUPERVISORY_VETO' | 'OTHER';
}

export interface PolicyCheckResult {
  framework: string; // e.g. 'BSP Circular 454' | 'SEC MC-18' | 'NPC Data Privacy Act 2012' | 'Client Restructuring Matrix'
  ruleName: string;
  status: 'PASSED' | 'WARNING' | 'NEEDS_OVERRIDE';
  notes?: string;
}

export type ExecutionPipelineStage = 
  | 'AI_RECOMMENDATION' 
  | 'HUMAN_REVIEW' 
  | 'CONFIRMATION' 
  | 'SYSTEM_EXECUTION' 
  | 'VERIFICATION';

export interface RecommendationItem {
  id: string;
  section: RecommendationSection;
  category: RecommendationCategory;
  actionType: RecommendationActionType;
  title: string;
  summary: string;
  detailedAction: string;
  operationalImpact: string;
  
  // Standardized 7-Field AI Recommendation Payload
  recommendationText?: string;
  reason?: string;
  requiredHumanAction?: string;
  policyCheck?: PolicyCheckResult;
  pipelineStage?: ExecutionPipelineStage;
  
  account: RecommendationAccount;
  customer: RecommendationCustomer;
  confidence: RecommendationConfidence;
  evidence: RecommendationEvidence;
  
  currentState: StateStateBlock;
  expectedState: StateStateBlock;
  
  createdTime: {
    timestamp: string;
    relativeTime: string;
  };
  
  actor: RecommendationActor;
  
  // Specific payload for verified executions
  verificationResult?: VerificationResult;
  
  // Specific payload for failed executions
  failureDetails?: FailureDetails;
  
  // Specific payload for rejected items
  rejectionDetails?: RejectionDetails;

  // Confirmation tracker if in transition
  confirmedBy?: string;
  confirmedAt?: string;
}

export interface RecommendationFilters {
  section: RecommendationSection;
  searchQuery: string;
  actionType: string;
  confidenceTier: string;
  roleView: 'COLLECTOR' | 'MANAGER';
  riskTier: string;
}
