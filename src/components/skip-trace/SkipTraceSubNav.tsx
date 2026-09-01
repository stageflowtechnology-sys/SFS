import React from 'react';
import {
  LayoutDashboard,
  Search,
  Layers,
  Award,
  ShieldAlert,
  History,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { SKIP_TRACE_ACCOUNTS } from '../../data/skipTraceData';
import { SkipTraceAccount } from '../../types/skipTrace';

export type SkipTraceSubViewType =
  | 'OVERVIEW'
  | 'WORKSPACE'
  | 'CANDIDATES_EVIDENCE'
  | 'CONTACTABILITY'
  | 'CONTRADICTIONS'
  | 'HISTORY';

interface SkipTraceSubNavProps {
  currentSubView: SkipTraceSubViewType;
  onNavigateSubView: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
  contraCount?: number;
}

export const SkipTraceSubNav: React.FC<SkipTraceSubNavProps> = ({
  currentSubView,
  onNavigateSubView,
  selectedAccountId = 'skip-acc-101',
  onSelectAccount,
  contraCount,
}) => {
  const accounts: SkipTraceAccount[] = SKIP_TRACE_ACCOUNTS;
  const activeAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const navItems: {
    id: SkipTraceSubViewType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeVariant?: 'indigo' | 'amber' | 'rose' | 'emerald';
  }[] = [
    {
      id: 'OVERVIEW',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'WORKSPACE',
      label: 'Investigation Workspace',
      icon: Search,
      badge: 'Live',
      badgeVariant: 'indigo',
    },
    {
      id: 'CANDIDATES_EVIDENCE',
      label: 'Candidate & Evidence',
      icon: Layers,
      badge: activeAccount.evidenceList.length || '5',
      badgeVariant: 'emerald',
    },
    {
      id: 'CONTACTABILITY',
      label: 'Contactability Intelligence',
      icon: Award,
      badge: `${activeAccount.summary.contactability.overallScore}%`,
      badgeVariant: 'indigo',
    },
    {
      id: 'CONTRADICTIONS',
      label: 'Contradictions & Discrepancies',
      icon: ShieldAlert,
      badge: contraCount !== undefined ? contraCount : 2,
      badgeVariant: (contraCount ?? 2) > 0 ? 'rose' : 'emerald',
    },
    {
      id: 'HISTORY',
      label: 'Investigation History',
      icon: History,
      badge: activeAccount.investigationHistory.length || '4',
      badgeVariant: 'indigo',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-2.5 sticky top-0 z-20 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Module Identity and Account Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
              Skip Trace Intelligence
            </span>
          </div>

          <span className="text-slate-300">|</span>

          {/* Account selector */}
          <div className="relative">
            <select
              value={activeAccount.id}
              onChange={(e) => onSelectAccount && onSelectAccount(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-300 rounded-lg pl-2.5 pr-7 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.customerName} ({acc.summary.identityConfidence.band} • {acc.accountNumber})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right: 6 View Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSubView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigateSubView(item.id)}
                id={`subnav-btn-${item.id.toLowerCase()}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeVariant === 'rose'
                        ? 'bg-rose-100 text-rose-800'
                        : item.badgeVariant === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.badgeVariant === 'amber'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
