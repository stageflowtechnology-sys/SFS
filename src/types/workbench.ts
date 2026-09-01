import { StageFlowStatus, StateOrigin } from './design-system';
import { PriorityLevel, DelinquencyBucket, QueueStage, ChannelType } from './workQueue';

export interface ContactMethod {
  id: string;
  type: 'PHONE_MOBILE' | 'PHONE_HOME' | 'PHONE_WORK' | 'EMAIL' | 'MAILING_ADDRESS';
  value: string;
  label: string;
  isPrimary: boolean;
  isVerified: boolean;
  tcpaConsent: boolean;
  lastVerifiedDate: string;
  doNotContact: boolean;
  bestTimeToCall?: string;
  timezone?: string;
}

export interface PastInteraction {
  id: string;
  timestamp: string; // e.g. "Aug 30, 2026 • 03:45 PM"
  channel: ChannelType;
  direction: 'INBOUND' | 'OUTBOUND';
  operatorName: string;
  operatorId: string;
  disposition: string;
  outcomeCategory: 'PTP' | 'HARDSHIP' | 'NO_ANSWER' | 'DISPUTE' | 'SETTLEMENT' | 'GENERAL';
  summary: string;
  recordingDuration?: string;
  ptpAmount?: number;
  ptpDueDate?: string;
}

export interface WorkbenchAccount {
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
  state: string; // CA, NY, etc.
  address: string;
  timezone: string;
  employer?: string;
  
  // Financial Overview
  totalBalance: number;
  principalAmount: number;
  accruedInterest: number;
  accruedFees: number;
  minAcceptableSettlement: number;
  authorizedSettlementDiscountPct: number;
  originalCreditLimit: number;
  
  // Delinquency & Compliance
  daysPastDue: number;
  dpdBucket: DelinquencyBucket;
  chargeOffDate?: string;
  statuteOfLimitationsDate: string;
  statuteRemainingYears: number;
  fdcpaMiniMirandaRequired: boolean;
  ceaseAndDesistStatus: boolean;
  bankruptcyFlag: boolean;
  
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
  
  // History
  previousInteractions: PastInteraction[];
  
  // Priority
  priority: PriorityLevel;
  propensityScore: number;
  
  // AI Intelligence Package
  aiIntelligence: AiIntelligencePackage;
}

export interface AiSignal {
  id: string;
  type: 'HARDSHIP' | 'WILLINGNESS' | 'DISPUTE' | 'LEGAL_RISK' | 'INCOME_STABILITY' | 'TCPA_RISK';
  label: string;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'positive';
  detectedAt: string;
  sourceText?: string;
}

export interface AiEvidenceFactor {
  label: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number; // 0-100
  detail: string;
}

export interface AiIntelligencePackage {
  preCallBriefing: {
    summary: string;
    personalityTraits: string[];
    riskAssessment: string;
    keyLeveragePoints: string[];
    recommendedTone: string;
  };
  liveGuidancePoints: {
    id: string;
    trigger: string;
    guidance: string;
    complianceReminder?: string;
  }[];
  detectedSignals: AiSignal[];
  recommendedNextAction: {
    actionTitle: string;
    actionType: 'PROPOSE_SETTLEMENT' | 'PAYMENT_PLAN' | 'SKIP_TRACE' | 'MANAGER_ESCALATION' | 'LEGAL_REFERRAL';
    suggestedTerms: string;
    rationale: string;
    confidence: number;
    origin: StateOrigin;
    evidenceList: string[];
  };
  recommendedStage: {
    targetStage: QueueStage;
    targetStageLabel: string;
    rationale: string;
    confidence: number;
    origin: StateOrigin;
  };
  evidenceFactors: AiEvidenceFactor[];
}

export type CallStatus = 'IDLE' | 'DIALING' | 'IN_CALL' | 'ON_HOLD' | 'WRAP_UP' | 'COMPLETED';

export interface CallSession {
  status: CallStatus;
  durationSeconds: number;
  activePhoneNumber: string;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  transcript: {
    speaker: 'OPERATOR' | 'DEBTOR' | 'SYSTEM';
    text: string;
    timestamp: string;
    sentiment?: 'positive' | 'neutral' | 'negative' | 'frustrated';
  }[];
}

export interface OutcomeDisposition {
  code: string;
  label: string;
  category: 'PTP' | 'SETTLEMENT' | 'HARDSHIP' | 'NO_CONTACT' | 'DISPUTE' | 'REFUSAL';
  requiresPtpTerms?: boolean;
  requiresFollowUp?: boolean;
}
