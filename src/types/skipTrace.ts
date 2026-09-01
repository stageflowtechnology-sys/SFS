export type IdentityBand =
  | 'MATCH'
  | 'PROBABLE'
  | 'POSSIBLE'
  | 'INSUFFICIENT'
  | 'CONTRADICTED';

export type EvidenceState = 'OBSERVED' | 'INFERRED' | 'UNKNOWN';

export interface EvidenceProvenance {
  sourceName: string;
  sourceType: string;
  statutoryCitation: string; // e.g. FCRA §604(a)(3)(A), FDCPA §804
  ingestMethod: string; // e.g. Real-time API Ping, USPS CASS Batch, County Deeds Index Pull
  ingestTimestamp: string;
  certificateId: string; // e.g. CERT-NCOA-88291
  permissiblePurpose: string;
  operatorId?: string;
  dataFreshnessDays?: number;
}

export type InvestigationStatus =
  | 'ACTIVE'
  | 'READY_TO_RUN'
  | 'IN_PROGRESS'
  | 'STALE'
  | 'COMPLETED'
  | 'DISCREPANCY_FLAGGED';

export type EvidenceCategory =
  | 'PHONE'
  | 'EMAIL'
  | 'PROFESSIONAL'
  | 'SOCIAL'
  | 'GEOGRAPHIC'
  | 'ASSET'
  | 'LEGAL_ENTITY'
  | 'IDENTITY';

export type VerificationStatus =
  | 'VERIFIED_ACTIVE'
  | 'UNVERIFIED_NEW'
  | 'STALE_HISTORICAL'
  | 'INVALID_DISCONNECTED'
  | 'DISPUTED_CONTRADICTED';

export interface ContradictingEvidenceItem {
  id: string;
  category: EvidenceCategory | 'DECEASED_INDEX' | 'BANKRUPTCY' | 'CRIMINAL' | 'AGE_MISMATCH' | 'IDENTITY';
  title: string;
  finding: string;
  source: string;
  sourceType: string;
  observedDate: string;
  severity: 'CRITICAL_BLOCKER' | 'HIGH_RISK' | 'MEDIUM_DISCREPANCY' | 'LOW_VARIATION';
  provenance: EvidenceProvenance;
  reconciliationNote: string;
}

export interface CandidateContactChannel {
  id: string;
  type: 'PHONE_MOBILE' | 'PHONE_LANDLINE' | 'PHONE_WORK' | 'EMAIL_WORK' | 'EMAIL_PERSONAL' | 'PHYSICAL_DOMICILE' | 'CORPORATE_HQ';
  label: string;
  value: string;
  reachabilityScore: number;
  evidenceState: EvidenceState;
  source: string;
  observedDate: string;
  carrierOrDeliverability?: string;
  tcpaStatus?: 'CONSENT_RECORDED' | 'EXEMPT_MANUAL_DIAL' | 'DNC_RESTRICTED' | 'UNVERIFIED';
  fdcpaWindow?: string;
  inWindowNow?: boolean;
}

export interface CandidateDetail {
  id: string;
  name: string;
  aliasOrSuffix?: string;
  entityType: 'INDIVIDUAL_PRIMARY' | 'JUNIOR_RELATIVE' | 'SENIOR_RELATIVE' | 'COMMERCIAL_ENTITY' | 'NAME_COLLISION_ONLY';
  identityMatch: IdentityBand;
  identityConfidence: number; // 0 - 100
  isNameOnlyMatch: boolean; // "A name-only match must never look confirmed"
  probableBadgeRequired: boolean; // "A PROBABLE candidate must visibly say: Potential — Unverified"
  ssnConcordance: 'EXACT_LAST4' | 'PARTIAL' | 'MISMATCH' | 'UNAVAILABLE';
  maskedSsn?: string;
  dobConcordance: 'EXACT' | 'APPROXIMATE' | 'DISTINCT_DOB' | 'UNAVAILABLE';
  maskedDob?: string;
  source: string;
  observedDate: string;
  primaryLocation: string;
  primaryEmployer: string;
  summaryRationale: string;
  supportingEvidence: (EvidenceItem & { evidenceState: EvidenceState; provenance: EvidenceProvenance })[];
  contradictingEvidence: ContradictingEvidenceItem[];
  contactChannels: CandidateContactChannel[];
}

export interface EvidenceItem {
  id: string;
  category: EvidenceCategory;
  title: string;
  value: string;
  subValue?: string;
  source: string;
  sourceType: 'CREDIT_HEADER' | 'PUBLIC_REGISTRY' | 'USPS_NCOA' | 'PAYROLL_TWN' | 'TELCO_HLR' | 'COUNTY_ASSESSOR' | 'STATE_LICENSING' | 'SEC_EDGAR';
  discoveredDate: string;
  confidenceScore: number; // 0 - 100
  identityBand: IdentityBand;
  evidenceState?: EvidenceState; // 'OBSERVED' | 'INFERRED' | 'UNKNOWN'
  provenance?: EvidenceProvenance;
  verificationStatus: VerificationStatus;
  promotedToMaster: boolean;
  notes?: string;
  tags?: string[];
  metadata?: {
    carrier?: string;
    lineType?: 'Wireless (Mobile)' | 'Wireline (Landline)' | 'VoIP' | 'Toll-Free';
    tcpaConsent?: boolean;
    dncScrubbed?: boolean;
    deliverabilityRate?: string;
    mxValid?: boolean;
    employerName?: string;
    jobTitle?: string;
    employmentStatus?: string;
    verifiedPayDate?: string;
    propertyType?: string;
    assessedValue?: number;
    deedDate?: string;
    residenceTenure?: string;
    profileUrl?: string;
  };
}

export interface ReachableChannel {
  id: string;
  channelType: 'PHONE_MOBILE' | 'PHONE_LANDLINE' | 'PHONE_WORK' | 'EMAIL' | 'PHYSICAL_MAIL';
  label: string;
  value: string;
  rank: number; // 1 = best
  reachabilityScore: number; // 0 - 100
  identityBand: IdentityBand;
  lineType?: string;
  carrier?: string;
  tcpaStatus: 'CONSENT_RECORDED' | 'EXEMPT_MANUAL_DIAL' | 'DNC_RESTRICTED' | 'UNVERIFIED';
  timezone: string;
  localTime: string;
  inFdcpaWindow: boolean;
  windowDescription: string;
  lastContactAttempt?: string;
  isTopRecommended: boolean;
}

export interface RecommendedAction {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  actionType: 'DIAL_PRIMARY_MOBILE' | 'SEND_STATUTORY_NOTICE' | 'VERIFY_EMPLOYER_HR' | 'UPDATE_MASTER_ADDRESS' | 'SCHEDULE_LEGAL_ESCALATION';
  confidenceScore: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  targetChannelValue?: string;
  targetAddress?: string;
  suggestedWindow?: string;
  complianceRuleCitation: string;
}

export interface InvestigationRun {
  id: string;
  runNumber: string;
  timestamp: string;
  relativeTime: string;
  investigatorId: string;
  investigatorName: string;
  triggerType: 'MANUAL_COLLECTOR' | 'AUTOMATED_WATERFALL' | 'BROKEN_PTP_TRIGGER' | 'SCHEDULED_REFRESH';
  sourcesQueried: string[];
  evidenceDiscoveredCount: number;
  identityBand: IdentityBand;
  confidenceScore: number;
  status: 'SUCCESS' | 'PARTIAL_MATCH' | 'NO_NEW_DATA' | 'CONTRADICTED_FLAG';
  executionDurationSeconds: number;
  notes: string;
}

export interface SkipTraceSummary {
  identityConfidence: {
    band: IdentityBand;
    score: number; // 0 - 100
    corroboratingSignalsCount: number;
    discrepancyCount: number;
    ssnMatchStatus: 'EXACT_MATCH' | 'PARTIAL_DECEASED_CHECK_PASS' | 'DISCREPANCY';
    dobMatchStatus: 'EXACT_MATCH' | 'APPROXIMATE' | 'UNAVAILABLE';
    nameConcordance: 'PERFECT' | 'ALIAS_IDENTIFIED' | 'SPELLING_VARIATION';
  };
  contactability: {
    overallScore: number; // 0 - 100
    grade: 'A+' | 'A' | 'B' | 'C' | 'D';
    bestContactWindow: string;
    preferredChannel: string;
    activeChannelsCount: number;
    fdcpaStatus: 'IN_CALL_WINDOW' | 'OUTSIDE_PERMISSIBLE_HOURS';
  };
  phone: {
    totalDiscovered: number;
    activeMobileCount: number;
    activeLandlineCount: number;
    topReachableNumber: string;
    topCarrier: string;
    portabilityStatus: string;
  };
  email: {
    totalDiscovered: number;
    validDeliverableCount: number;
    primaryWorkEmail?: string;
    primaryPersonalEmail?: string;
  };
  professional: {
    employerName: string;
    jobTitle: string;
    employmentStatus: 'CURRENT_ACTIVE' | 'PREVIOUS_HISTORICAL' | 'UNKNOWN';
    source: string;
    verificationDate: string;
    estimatedIncomeRange: string;
    garnishableState: boolean;
  };
  social: {
    publicProfilesCount: number;
    primaryProfessionalRegistry: string;
    publicEntityFilingsCount: number;
    verifiedIndustry: string;
    publicBioSummary: string;
  };
  geographic: {
    primaryAddress: string;
    cityStateZip: string;
    residenceType: 'SINGLE_FAMILY_OWNED' | 'MULTI_FAMILY_RENTAL' | 'COMMERCIAL' | 'UNKNOWN';
    uspsNcoaMoveDate?: string;
    tenureYears: number;
    assessedPropertyValue?: string;
  };
}

export type InvestigationWorkspaceState = 'READY' | 'RUNNING' | 'STOPPED' | 'COMPLETED';

export interface InvestigationSource {
  id: string;
  name: string;
  category: string;
  costPerQuery: number;
  latencyAvgMs: number;
  enabled: boolean;
  compliancePurpose: string;
  description: string;
}

export interface InvestigationHypothesis {
  id: string;
  number: number;
  statement: string;
  category: 'IDENTITY' | 'LOCATION' | 'TELEPHONY' | 'EMPLOYMENT' | 'ASSET';
  status: 'VALIDATED' | 'TESTING' | 'DISPROVED' | 'PENDING' | 'INCONCLUSIVE';
  confidenceScore: number;
  corroboratingSignals: string[];
  contradictingSignals?: string[];
  supportingSourceNames: string[];
}

export interface InvestigationCandidate {
  id: string;
  name: string;
  matchScore: number;
  identityBand: IdentityBand;
  isPrimaryMatch: boolean;
  ssnConcordance: 'EXACT_LAST4' | 'PARTIAL' | 'MISMATCH' | 'UNAVAILABLE';
  dobConcordance: 'EXACT' | 'APPROXIMATE' | 'UNAVAILABLE';
  confirmedAddress: string;
  activePhone: string;
  primaryEmployer: string;
  recordedDeedsCount: number;
  signalsCount: number;
  discrepanciesCount: number;
  notes: string;
}

export interface InvestigationActivityStep {
  id: string;
  stepNumber: number;
  timestamp: string;
  relativeTime: string;
  sourceName: string;
  sourceCategory: string;
  actionType: 'CREDIT_HEADER_QUERY' | 'NCOA_MOVE_SCRUB' | 'DEED_INDEX_PULL' | 'CARRIER_HLR_PING' | 'STATE_CORP_SCRUB' | 'CONFIDENCE_SYNTHESIS';
  status: 'COMPLETED' | 'RUNNING' | 'PENDING' | 'SKIPPED';
  queryParametersRedacted: string;
  costIncurred: number;
  latencyMs: number;
  artifactsDiscoveredCount: number;
  evidenceItemsYielded: EvidenceItem[];
  hypothesisAffectedId?: string;
  hypothesisResolution?: string;
  confidenceDelta: number; // e.g. +14
  runningConfidenceScore: number;
  summaryNote: string;
}

export interface InvestigationBudgetPlan {
  allocatedBudgetDollars: number;
  usedBudgetDollars: number;
  maxSteps: number;
  usedSteps: number;
  costBreakdown: {
    sourceName: string;
    queriesCount: number;
    totalCost: number;
  }[];
}

export interface SkipTraceAccount {
  id: string;
  customerName: string;
  customerId: string;
  customerType: 'CONSUMER' | 'COMMERCIAL_GUARANTOR' | 'SOLE_PROPRIETOR';
  maskedSsn: string;
  maskedDob: string;
  accountNumber: string;
  creditorName: string;
  portfolioName: string;
  totalBalance: number;
  principalBalance: number;
  feeBalance: number;
  currentStage: string;
  currentStageCode: 'BROKEN_PTP' | 'SKIP_UNREACHABLE' | 'PRE_LEGAL_ESCALATION' | 'EARLY_COLLECTIONS' | 'DEMAND_SENT';
  investigationStatus: InvestigationStatus;
  lastInvestigationDate: string;
  lastInvestigationRunId: string;
  lastInvestigator: string;
  daysSinceLastInvestigation: number;
  summary: SkipTraceSummary;
  evidenceList: EvidenceItem[];
  reachableChannels: ReachableChannel[];
  recommendedAction: RecommendedAction;
  investigationHistory: InvestigationRun[];
}
