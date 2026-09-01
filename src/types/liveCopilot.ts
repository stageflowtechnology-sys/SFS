/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SpeakerRole = 'collector' | 'debtor' | 'system';

export type UtteranceSentiment =
  | 'cooperative'
  | 'defensive'
  | 'hesitant'
  | 'neutral'
  | 'frustrated'
  | 'urgent'
  | 'conciliatory';

export type EntityType = 'currency' | 'date' | 'hardship' | 'entity' | 'compliance';

export interface RecognizedEntity {
  text: string;
  type: EntityType;
  tooltip?: string;
}

export interface SpeechAcousticMetrics {
  pitchHz?: number;
  speechRateWpm?: number;
  stressLevel?: 'low' | 'moderate' | 'high';
}

export interface TranscriptUtterance {
  id: string;
  speaker: SpeakerRole;
  speakerName: string;
  timestamp: string; // e.g. "00:14"
  timeSeconds: number;
  text: string;
  sentiment?: UtteranceSentiment;
  entities?: RecognizedEntity[];
  metrics?: SpeechAcousticMetrics;
  complianceTags?: string[];
  bookmarked?: boolean;
}

export type PrioritySeverity = 'critical' | 'high' | 'advisory';

export type PriorityCategory =
  | 'settlement_trigger'
  | 'compliance_risk'
  | 'hardship_detected'
  | 'dispute_alert'
  | 'legal_escalation';

export interface PrioritySignal {
  id: string;
  severity: PrioritySeverity;
  category: PriorityCategory;
  title: string;
  triggerQuote: string;
  timestamp: string;
  confidence: number; // 0 - 100
  recommendedAction: string;
  actionPromptText?: string;
}

export interface ConversationSignal {
  id: string;
  name: string;
  category: 'sentiment' | 'ability_to_pay' | 'hardship' | 'de_escalation' | 'objection';
  score: number; // 0 - 100
  status: 'positive' | 'warning' | 'neutral' | 'risk';
  details: string;
  trend: 'rising' | 'falling' | 'stable';
}

export interface ExtractedFact {
  id: string;
  label: string;
  value: string;
  verifiedFromUtteranceId?: string;
  isAuthoritative: boolean; // false for AI inference, true for verified ledger
}

export interface CurrentUnderstanding {
  synthesis: string;
  confidence: number;
  statedPosition: string;
  cashflowWindow: string;
  keyFactsExtracted: ExtractedFact[];
  objectionsRaised: string[];
  unlockedConcessions: string[];
  lastUpdatedTimestamp: string;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category: 'closing' | 'hardship_probe' | 'liquidity_check' | 'objection_handling' | 'compliance_confirmation';
  rationale: string;
  alternatives: { style: 'Direct' | 'Consultative' | 'Policy-Strict'; text: string }[];
  confidence: number;
  suggestedAt: string;
}

export type MissingInfoCategory = 'compliance' | 'identity' | 'financial' | 'payment_commitment';

export interface MissingInformationItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  collected: boolean;
  collectedValue?: string;
  category: MissingInfoCategory;
}

export interface ConversationGuidance {
  id: string;
  title: string;
  currentPhase: 'Opening & Verification' | 'Financial Discovery' | 'Negotiation & Concessions' | 'Commitment & Closing';
  rule: string;
  policyBoundary: string;
  complianceGuardrail: string;
  maxAuthorizedDiscountPercent: number;
  settlementFloorAmount: number;
  maxInstallmentMonths: number;
  supervisorApprovalRequired: boolean;
  advisoryNote: string;
}

export interface LiveCopilotAccountContext {
  id: string;
  accountNumber: string;
  debtorName: string;
  debtorType: 'Individual Consumer' | 'Commercial Entity';
  maskedSSN: string;
  state: string;
  timezone: string;
  currentLocalTime: string;
  totalOutstandingBalance: number;
  principalBalance: number;
  accruedFeesAndInterest: number;
  daysPastDue: number;
  delinquencyStage: string;
  originalCreditor: string;
  statuteOfLimitationsDate: string;
  miniMirandaStated: boolean;
  tcpaConsentStatus: 'Recorded & Valid' | 'Revoked' | 'Pending Confirmation';
}

export interface CallSessionState {
  callStatus: 'active' | 'on_hold' | 'wrapping_up' | 'ended';
  isMuted: boolean;
  isOnHold: boolean;
  holdDurationSeconds: number;
  callDurationSeconds: number;
  isRecording: boolean;
  tcpaConsentVerified: boolean;
  talkTimeAgentPercent: number;
  talkTimeDebtorPercent: number;
  audioStreamQuality: 'optimal' | 'moderate' | 'degraded';
  currentSpeaker: 'collector' | 'debtor' | 'silence';
  audioWaveData: number[];
}

export interface LiveCallScenario {
  id: string;
  label: string;
  description: string;
  badge: string;
  accountContext: LiveCopilotAccountContext;
  initialUtterances: TranscriptUtterance[];
  streamUtterances: TranscriptUtterance[];
  prioritySignal: PrioritySignal;
  conversationSignals: ConversationSignal[];
  currentUnderstanding: CurrentUnderstanding;
  suggestedQuestions: SuggestedQuestion[];
  missingInfo: MissingInformationItem[];
  guidance: ConversationGuidance;
}
