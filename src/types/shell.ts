import React from 'react';

export type UserRole = 'OPERATOR' | 'QA_AUDITOR' | 'ADMIN';

export type UserStatus = 'AVAILABLE' | 'IN_CALL' | 'DND' | 'AWAY';

export interface NavigationItem {
  id: string;
  label: string;
  sectionId: string;
  icon: string;
  badgeCount?: number;
  badgeVariant?: 'indigo' | 'amber' | 'emerald' | 'slate' | 'rose';
  isAiPowered?: boolean;
  requiredRole?: UserRole;
  shortcut?: string;
  description: string;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
}

export interface Organization {
  id: string;
  name: string;
  code: string;
  environment: 'PRODUCTION' | 'STAGING' | 'SANDBOX';
  regulatedRail: string;
  portfoliosCount: number;
  activeClaimsCount: number;
}

export interface ShellNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'AUDIT' | 'AI_INFERENCE' | 'COMPLIANCE' | 'SLA_BREACH' | 'SYSTEM';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  isRead: boolean;
  targetViewId?: string;
}

export interface OperatorProfile {
  name: string;
  operatorId: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  status: UserStatus;
  licenseNumber: string;
  fdcpaCertified: boolean;
  sessionToken: string;
}
