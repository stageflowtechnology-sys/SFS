import { StageFlowStatus, StateOrigin } from './design-system';
import { PriorityLevel, DelinquencyBucket, QueueStage, ChannelType } from './workQueue';
import { ContactMethod, PastInteraction } from './workbench';

export type { ContactMethod, PastInteraction };

export interface PreCallBriefingAccount {
  id: string;
  accountNumber: string;
  creditorName: string;
  accountType: string;
  portfolioId: string;
  portfolioName: string;

  // Customer Profile
  customerId: string;
  customerName: string;
  customerType: 'CONSUMER' | 'COMMERCIAL';
  ssnMasked: string;
  dobMasked: string;
  state: string;
  address: string;
  timezone: string;
  localTimeFormatted: string;
  isTimezoneCallSafe: boolean;
  employer?: string;

  // Financial Context (Authoritative Ground Truth)
  totalBalance: number;
  principalAmount: number;
  accruedInterest: number;
  accruedFees: number;
  minAcceptableSettlement: number;
  authorizedSettlementDiscountPct: number;
  originalCreditLimit: number;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;

  // Delinquency & Compliance Context
  daysPastDue: number;
  dpdBucket: DelinquencyBucket;
  chargeOffDate?: string;
  statuteOfLimitationsDate: string;
  statuteRemainingYears: number;
  fdcpaMiniMirandaRequired: boolean;
  ceaseAndDesistStatus: boolean;
  bankruptcyFlag: boolean;
  disputeStatus: boolean;

  // Campaign & Current Stage
  campaignId: string;
  campaignName: string;
  campaignStep: string;
  currentStage: QueueStage;
  currentStageLabel: string;
  currentStageStatus: StageFlowStatus;
  currentStageOrigin: StateOrigin;
  stageLastUpdated: string;

  // Contact info
  contacts: ContactMethod[];

  // Previous Interactions (Facts)
  previousInteractions: PastInteraction[];

  // Priority & Propensity
  priority: PriorityLevel;
  propensityScore: number;

  // AI Pre-Call Briefing (Advisory Only)
  briefing: AiPreCallBriefingData;
}

export interface HistoricalFactItem {
  id: string;
  category: 'PAYMENT_RECORD' | 'RECORDED_CALL' | 'LEGAL_DOC' | 'BANK_DATA' | 'CONTACT_LOG';
  label: string;
  factValue: string;
  dataSource: string;
  timestamp: string;
  authoritative: boolean;
  verifiedBy: string;
}

export interface AiInterpretationItem {
  id: string;
  factIdRef?: string;
  category: 'BEHAVIOR_INFERENCE' | 'SOLVENCY_PROJECTION' | 'RISK_SIGNAL' | 'SETTLEMENT_STRATEGY';
  inferenceText: string;
  confidence: number; // 0 - 1
  impactWeight: 'HIGH_POSITIVE' | 'MODERATE_POSITIVE' | 'NEUTRAL' | 'MODERATE_NEGATIVE' | 'HIGH_NEGATIVE';
  rationale: string;
}

export interface RiskFlag {
  id: string;
  type: 'COMPLIANCE' | 'DISPUTE' | 'RECIDIVISM' | 'TCPA' | 'SENTIMENT' | 'LITIGATION';
  label: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  origin: StateOrigin;
  description: string;
  actionRequired: string;
  statutoryReference?: string;
}

export interface TalkingPoint {
  id: string;
  topic: string;
  context: string;
  suggestedPrompt: string;
  objectionAnticipated?: string;
  suggestedRebuttal?: string;
  complianceCaution?: string;
  confidenceScore: number;
}

export interface ContactabilityIndicator {
  contactId: string;
  channel: 'PHONE_MOBILE' | 'PHONE_WORK' | 'PHONE_HOME' | 'EMAIL' | 'SMS';
  value: string;
  label: string;
  bestTimeWindow: string;
  optimalTimeNow: boolean;
  predictedRpcRate: number; // e.g. 0.84
  historicalAnswerCount: number;
  historicalAttemptCount: number;
  lastAttemptResult: string;
  tcpaVerified: boolean;
  isPreferredChannel: boolean;
}

export interface AiPreCallBriefingData {
  generatedAt: string;
  modelVersion: string;
  overallConfidence: number;
  advisoryDisclaimer: string;

  // Strategic Approach
  strategy: {
    title: string;
    posture: 'CONSULTATIVE_RESTRUCTURE' | 'FIRM_SETTLEMENT' | 'DISPUTE_RESOLUTION' | 'HARDSHIP_RELIEF' | 'LEGAL_ESCALATION_WARNING';
    postureLabel: string;
    summary: string;
    recommendedSettlementOffer: {
      targetAmount: number;
      discountPct: number;
      structureType: 'LUMP_SUM' | '3_INSTALLMENTS' | '6_INSTALLMENTS' | 'RESTRUCTURED_AUTOPAY';
      termsDescription: string;
      expectedFulfillmentProb: number;
    };
    negotiationBoundaries: {
      maximumAuthorizedDiscountPct: number;
      minimumAcceptablePayoff: number;
      authorizedFeeWaiverMax: number;
      requiresManagerSignoffAbove: number;
    };
    recommendedTone: string;
  };

  // Important Account Context
  accountContextAnalysis: {
    coreSummary: string;
    personalityProfile: string[];
    solvencyStatus: string;
    cashFlowIndicators: string;
    keyLeveragePoints: string[];
  };

  // Previous Interaction Summary
  interactionSummary: {
    lastContactOutcome: string;
    lastContactDate: string;
    debtorStatedPosition: string;
    historicalReliability: string;
    distilledAiTakeaway: string;
  };

  // Evidence Ledger (Historical Facts vs AI Interpretations)
  historicalFacts: HistoricalFactItem[];
  aiInterpretations: AiInterpretationItem[];

  // Risk Flags
  riskFlags: RiskFlag[];

  // Scripting & Talking Points
  suggestedOpening: {
    verbatimScript: string;
    miniMirandaIncluded: boolean;
    tonePacing: string;
    debtorPersonalizationKey: string;
  };
  talkingPoints: TalkingPoint[];

  // Contactability
  contactability: ContactabilityIndicator[];
}
