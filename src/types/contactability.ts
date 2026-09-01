import { IdentityBand } from './skipTrace';

export type ContactabilityCategory =
  | 'PHONE'
  | 'EMAIL'
  | 'PROFESSIONAL'
  | 'SOCIAL'
  | 'GEOGRAPHIC';

export type FreshnessStatus =
  | 'CURRENT_ACTIVE'
  | 'RECENT_30D'
  | 'AGING_90D'
  | 'STALE_HISTORICAL';

export interface ChannelRecency {
  lastObservedDate: string;
  daysSinceObserved: number;
  freshnessStatus: FreshnessStatus;
  rawTimestamp: string;
  cadenceDescription: string;
}

export interface ChannelHistoricalAttempt {
  id: string;
  date: string;
  action: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILURE' | 'NEUTRAL';
  operatorId: string;
  notes: string;
}

export interface ChannelHistoricalTrackRecord {
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  successRatePct: number;
  lastOutcome: string;
  lastAttemptDate: string;
  trend: 'IMPROVING' | 'STABLE' | 'DEGRADING' | 'UNTESTED';
  attempts: ChannelHistoricalAttempt[];
}

export interface ChannelIdentityRelationship {
  band: IdentityBand;
  subjectName: string;
  relationshipType:
    | 'PRIMARY_DEBTOR'
    | 'COMMERCIAL_GUARANTOR'
    | 'LINKED_CO_SIGNER'
    | 'CONFIRMED_COMMERCIAL_ENTITY'
    | 'PROBABLE_ASSOCIATE'
    | 'POSSIBLE_NAME_COLLISION'
    | 'UNVERIFIED_RELATIVE';
  concordanceScore: number; // 0 - 100
  isNameOnlyMatch: boolean;
  ssnMatch: boolean;
  dobMatch: boolean;
  rationale: string;
  warningNotice?: string;
}

export interface ChannelCompliance {
  tcpaConsentStatus: 'CONSENT_RECORDED' | 'EXEMPT_MANUAL_DIAL' | 'DNC_RESTRICTED' | 'UNVERIFIED';
  fdcpaPermissibleWindow: string;
  inCallWindowNow: boolean;
  thirdPartyRestriction: boolean;
  safeHarborCitation: string;
}

export interface ChannelRecommendationReasoning {
  primaryRankReason: string;
  strengthFactors: string[];
  caveatsAndRisks: string[];
  actionGuidance: string;
  optimalContactWindow: string;
  statutoryConstraintNotice?: string;
}

export interface ContactabilityChannel {
  id: string;
  category: ContactabilityCategory;
  channelType: string;
  label: string;
  value: string;
  maskedValue: string;
  reachabilityRank: number; // 1 = strongest
  confidenceScore: number; // 0 - 100
  confidenceLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW';
  confidenceCapEnforced: boolean; // True if capped because candidate identity is not confirmed (e.g. POSSIBLE candidate)
  confidenceCapReason?: string;
  source: string;
  sourceType: string;
  statutoryCitation: string;
  recency: ChannelRecency;
  historicalSuccessFailure: ChannelHistoricalTrackRecord;
  identityRelationship: ChannelIdentityRelationship;
  compliance: ChannelCompliance;
  recommendationReasoning: ChannelRecommendationReasoning;
  isTopRecommendation: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface IdentityConfidenceCalibration {
  overallScore: number; // 0 - 100
  band: IdentityBand;
  isConfirmed: boolean;
  statusLabel: string;
  nameConcordance: {
    searchedName: string;
    matchedName: string;
    concordanceType: 'EXACT_PERFECT' | 'ALIAS_IDENTIFIED' | 'SPELLING_VARIATION' | 'UNCONFIRMED_COLLISION';
    score: number;
  };
  ssnConcordance: {
    status: 'EXACT_LAST4' | 'PARTIAL' | 'MISMATCH' | 'UNAVAILABLE';
    maskedSsn: string;
    score: number;
  };
  dobConcordance: {
    status: 'EXACT' | 'APPROXIMATE' | 'DISTINCT_DOB' | 'UNAVAILABLE';
    maskedDob: string;
    score: number;
  };
  corroboratingSignalsCount: number;
  discrepanciesCount: number;
  confidenceCapRuleApplied: boolean;
  guardrailExplanation: string;
}

export interface ContactabilityCategorySummary {
  category: ContactabilityCategory;
  label: string;
  totalChannelsDiscovered: number;
  activeDeliverableCount: number;
  highestConfidenceScore: number;
  topChannelValue: string;
  topChannelLabel: string;
  historicalSuccessRate: number;
  complianceStatus: string;
  iconName: string;
  accentColor: string;
}

export interface SkipTraceContactabilityDataset {
  accountId: string;
  accountNumber: string;
  customerName: string;
  customerId: string;
  customerType: string;
  totalBalance: number;
  currentStage: string;
  lastInvestigationDate: string;
  investigationStatus: string;
  permissiblePurpose: string;
  identityConfidence: IdentityConfidenceCalibration;
  categorySummaries: Record<ContactabilityCategory, ContactabilityCategorySummary>;
  channels: ContactabilityChannel[];
}
