export type StageFlowStatus =
  | 'PENDING'
  | 'REQUIRES_CONFIRMATION'
  | 'EXECUTING'
  | 'VERIFYING'
  | 'EXECUTED_VERIFIED'
  | 'EXECUTION_FAILED'
  | 'REJECTED'
  | 'ADVISORY'
  | 'APPLIED'
  | 'OVERDUE'
  | 'COMPLETED'
  | 'ACTIVE'
  | 'INACTIVE';

export type StateOrigin =
  | 'AI_RECOMMENDATION'
  | 'HUMAN_DECISION'
  | 'SYSTEM_EXECUTION'
  | 'VERIFIED_GROUND_TRUTH'
  | 'EXECUTION_FAILED';

export interface StatusMeta {
  code: StageFlowStatus;
  label: string;
  category: 'neutral' | 'warning' | 'active' | 'success' | 'danger' | 'purple' | 'slate';
  description: string;
  operationalContext: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
}

export interface OriginMeta {
  origin: StateOrigin;
  title: string;
  subtitle: string;
  authoritative: boolean;
  legalStanding: string;
  visualCue: string;
  badgeStyle: string;
  borderStyle: string;
  iconName: string;
  description: string;
}

export type DensityMode = 'compact' | 'standard';

export interface DebtCaseSample {
  id: string;
  accountNumber: string;
  debtorName: string;
  principalAmount: number;
  daysPastDue: number;
  status: StageFlowStatus;
  aiRecommendation: {
    action: string;
    confidence: number;
    modelVersion: string;
    reasoning: string;
    advisoryFlag: boolean;
  };
  authoritativeState: {
    currentStage: string;
    decisionMaker?: string;
    verifiedAt?: string;
    ledgerHash?: string;
  };
  lastActivity: string;
}
