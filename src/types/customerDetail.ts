import { StageFlowStatus, StateOrigin } from './design-system';

export type CustomerTabId =
  | 'overview'
  | 'accounts'
  | 'interactions'
  | 'follow-ups'
  | 'skip-trace'
  | 'evidence'
  | 'history';

export interface CustomerIdentity {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'COMMERCIAL';
  ssnMasked: string;
  dobMasked: string;
  tinEinMasked?: string;
  businessName?: string;
  dba?: string;
  kycStatus: 'VERIFIED' | 'FLAGGED' | 'EXPIRED';
  kycVerifiedDate: string;
  kycProvider: string;
  citizenship: string;
  employerName: string;
  employerTitle: string;
  annualIncomeEst: number;
  origin: StateOrigin;
}

export interface CustomerContactPoint {
  id: string;
  type:
    | 'PHONE_MOBILE'
    | 'PHONE_HOME'
    | 'PHONE_WORK'
    | 'EMAIL'
    | 'PHYSICAL_ADDRESS'
    | 'MAILING_ADDRESS';
  value: string;
  label: string;
  isPrimary: boolean;
  isConsentGiven: boolean;
  consentType: 'EXPRESS_WRITTEN' | 'VERBAL' | 'PORTFOLIO_TRANSFER' | 'REVOKED';
  consentDate: string;
  lastVerifiedDate: string;
  verificationSource: string;
  deliverabilityStatus: 'DELIVERABLE' | 'UNDELIVERABLE' | 'UNKNOWN';
  origin: StateOrigin;
}

export interface CustomerAccountSummary {
  id: string;
  accountNumber: string;
  creditorName: string;
  portfolioName: string;
  accountType: string;
  principalAmount: number;
  accruedInterest: number;
  accruedFees: number;
  totalBalance: number;
  daysPastDue: number;
  dpdBucket: string;
  status: StageFlowStatus;
  stage: string;
  assignedCollector: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  chargeOffDate: string;
  authorizedDiscountPct: number;
  origin: StateOrigin;
}

export interface CustomerContactability {
  overallScore: number;
  rating: 'HIGH_CONTACTABILITY' | 'MODERATE' | 'LOW' | 'SKIP_REQUIRED';
  phoneScore: number;
  emailScore: number;
  addressScore: number;
  bestCallingWindow: string;
  timezone: string;
  jurisdictionState: string;
  tcpaSafeHarborActive: boolean;
  contactAttemptsLast30Days: number;
  successfulContactsLast30Days: number;
  contactRatePct: number;
  origin: StateOrigin;
}

export interface CustomerInvestigationStatus {
  overallStatus:
    | 'CLEARED_FOR_COLLECTION'
    | 'INVESTIGATION_ACTIVE'
    | 'LEGAL_HOLD'
    | 'BANKRUPTCY_HOLD';
  pacerBankruptcyCheck: {
    status: 'NO_RECORD' | 'CHAPTER_7' | 'CHAPTER_13';
    searchDate: string;
    pacerRef: string;
    details: string;
  };
  scraMilitaryCheck: {
    status: 'NOT_ACTIVE_DUTY' | 'ACTIVE_DUTY';
    searchDate: string;
    certificateId: string;
    details: string;
  };
  deceasedMasterFileCheck: {
    status: 'CONFIRMED_ALIVE' | 'RECORD_FOUND';
    searchDate: string;
    source: string;
    details: string;
  };
  litigationCheck: {
    activeSuits: number;
    judgmentsCount: number;
    liensCount: number;
    searchDate: string;
    county: string;
    details: string;
  };
  assetSearchSummary: {
    verifiedRealEstateCount: number;
    totalRealEstateValue: number;
    vehicleCount: number;
    bankDiscoveryStatus: string;
    employerVerified: boolean;
  };
  lastFullInvestigationDate: string;
  origin: StateOrigin;
}

export interface CustomerCollectionContext {
  totalAggregateExposure: number;
  totalPrincipal: number;
  totalInterestAndFees: number;
  activeAccountsCount: number;
  highestDpd: number;
  overallStatus: StageFlowStatus;
  statuteOfLimitationsEarliest: string;
  solYearsRemaining: number;
  isUnderCeaseAndDesist: boolean;
  isAttorneyRepresented: boolean;
  attorneyDetails?: {
    name: string;
    firm: string;
    phone: string;
    email: string;
    address: string;
    barNumber: string;
  };
  hardshipFlag: boolean;
  hardshipDetails?: string;
  disputeActive: boolean;
  disputeDetails?: string;
  origin: StateOrigin;
}

export interface CustomerInteractionItem {
  id: string;
  type: 'CALL' | 'SMS' | 'EMAIL' | 'LETTER';
  channel: string;
  timestamp: string;
  operatorName: string;
  durationSeconds?: number;
  recordingUrl?: string;
  transcript?: string;
  summary: string;
  disposition: string;
  tags: string[];
  complianceFlags: string[];
  keyTakeaways: string[];
  origin: StateOrigin;
}

export interface CustomerFollowUpTask {
  id: string;
  dueDate: string;
  scheduledTime: string;
  assignedCollector: string;
  assignedCollectorId: string;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM';
  type: string;
  reason: string;
  targetChannel: 'VOICE' | 'SMS' | 'EMAIL' | 'MAIL';
  status: 'PENDING' | 'COMPLETED' | 'OVERDUE';
  linkedAccountId?: string;
  origin: StateOrigin;
}

export interface CustomerSkipTraceDiscovery {
  id: string;
  category: 'REAL_ESTATE' | 'BANKING' | 'CORPORATE_FILING' | 'VEHICLE_FLEET' | 'EMPLOYMENT';
  field: string;
  discoveredValue: string;
  confidenceScore: number;
  source: string;
  timestamp: string;
  isVerified: boolean;
  verifiedBy?: string;
  notes: string;
  origin: StateOrigin;
}

export interface CustomerEvidenceItem {
  id: string;
  title: string;
  category:
    | 'DEBT_ORIGINATION'
    | 'CONTRACT_AGREEMENT'
    | 'BANK_STATEMENT'
    | 'RECORDING_AUDIO'
    | 'SKIP_TRACE_HIT'
    | 'REGULATORY_NOTICE'
    | 'TAX_DEED';
  description: string;
  documentRef: string;
  fileSize: string;
  fileType: string;
  uploadDate: string;
  uploadedBy: string;
  verifiedByLegal: boolean;
  sha256Hash: string;
  origin: StateOrigin;
}

export interface CustomerAuditLogRecord {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  actorRole: string;
  field: string;
  oldValue: string;
  newValue: string;
  ipAddress: string;
  origin: StateOrigin;
}

export interface CustomerAIIntelligence {
  contactPropensity: {
    score: number;
    confidence: number;
    primaryDrivers: string[];
  };
  settlementPropensity: {
    score: number;
    confidence: number;
    recommendedDiscountPct: number;
    expectedRecovery: number;
    rationale: string;
  };
  recommendedStrategy: {
    title: string;
    summary: string;
    confidence: number;
    rationale: string;
    evidenceList: string[];
    suggestedTerms: string;
    origin: StateOrigin;
  };
  behavioralProfile: {
    personalityTraits: string[];
    keyLeveragePoints: string[];
    recommendedTone: string;
    riskAssessment: string;
  };
}

export interface CustomerDetailData {
  customer: CustomerIdentity;
  location: {
    city: string;
    state: string;
    zip: string;
    timezone: string;
    jurisdictionRules: string;
  };
  contactability: CustomerContactability;
  investigation: CustomerInvestigationStatus;
  collectionContext: CustomerCollectionContext;
  contacts: CustomerContactPoint[];
  accounts: CustomerAccountSummary[];
  recentInteractions: CustomerInteractionItem[];
  followUps: CustomerFollowUpTask[];
  skipTraceHits: CustomerSkipTraceDiscovery[];
  evidence: CustomerEvidenceItem[];
  historyAudit: CustomerAuditLogRecord[];
  aiIntelligence: CustomerAIIntelligence;
}
