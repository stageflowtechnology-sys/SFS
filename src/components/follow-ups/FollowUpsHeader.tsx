import React from 'react';
import {
  CalendarClock,
  Sparkles,
  UserCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { FollowUpViewTab, FollowUpStats } from '../../types/followUps';

interface FollowUpsHeaderProps {
  activeTab: FollowUpViewTab;
  onSelectTab: (tab: FollowUpViewTab) => void;
  stats: FollowUpStats;
  onCreateNew: () => void;
}

export const FollowUpsHeader: React.FC<FollowUpsHeaderProps> = ({
  activeTab,
  onSelectTab,
  stats,
  onCreateNew,
}) => {
  const tabs: {
    id: FollowUpViewTab;
    label: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    alertBadge?: boolean;
  }[] = [
    {
      id: 'TODAY',
      label: 'Today',
      count: stats.todayCount,
      icon: Clock,
      alertBadge: stats.todayCount > 0,
    },
    {
      id: 'UPCOMING',
      label: 'Upcoming',
      count: stats.upcomingCount,
      icon: Calendar,
    },
    {
      id: 'OVERDUE',
      label: 'Overdue',
      count: stats.overdueCount,
      icon: AlertTriangle,
      alertBadge: stats.overdueCount > 0,
    },
    {
      id: 'COMPLETED',
      label: 'Completed',
      count: stats.completedCount,
      icon: CheckCircle2,
    },
    {
      id: 'CANCELLED',
      label: 'Cancelled',
      count: stats.cancelledCount,
      icon: XCircle,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner with Operational Telemetry */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs">
              <CalendarClock className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  Recovery Intelligence & Cadence Engine
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" />
                  <span>Dual Origin: AI Copilot & Manual Directives</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Reg-F Cadence Guard</span>
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
                Follow-Ups Workstation
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
                Track and execute scheduled debtor commitments, AI-predicted contact windows, promise-to-pay confirmations, and statutory verification reviews.
              </p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 font-mono">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 min-w-28">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                Today Due
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-bold text-slate-900">{stats.todayCount}</span>
                <span className="text-[10px] text-indigo-600 font-medium">Tasks</span>
              </div>
            </div>

            <div className={`rounded-lg p-2.5 min-w-28 border ${stats.overdueCount > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
              <span className="text-[10px] uppercase font-semibold text-slate-500 block flex items-center gap-1">
                {stats.overdueCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />}
                Past Due
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className={`text-base font-bold ${stats.overdueCount > 0 ? 'text-rose-700' : 'text-slate-900'}`}>
                  {stats.overdueCount}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Breaches</span>
              </div>
            </div>

            <div className="rounded-lg bg-indigo-50/60 border border-indigo-200 p-2.5 min-w-28">
              <span className="text-[10px] uppercase font-semibold text-indigo-600 block flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                AI-Generated
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-bold text-indigo-900">{stats.aiGeneratedCount}</span>
                <span className="text-[10px] text-indigo-600 font-medium">Auto</span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 min-w-28">
              <span className="text-[10px] uppercase font-semibold text-slate-500 block flex items-center gap-1">
                <UserCheck className="w-2.5 h-2.5 text-amber-600" />
                Manual
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base font-bold text-slate-900">{stats.manualCount}</span>
                <span className="text-[10px] text-slate-500 font-medium">Ops</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Tabs Navigation Strip */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-2 rounded-lg pt-1 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all relative border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive
                      ? 'text-indigo-600'
                      : tab.id === 'OVERDUE' && tab.count > 0
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  }`}
                />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold'
                      : tab.id === 'OVERDUE' && tab.count > 0
                      ? 'bg-rose-100 text-rose-800 font-bold border border-rose-200'
                      : 'bg-slate-100 text-slate-600 font-medium'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Create Manual Follow-up Trigger */}
        <div className="hidden sm:flex items-center gap-2 py-1 pr-2">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition-colors"
          >
            <CalendarClock className="w-3.5 h-3.5 text-indigo-300" />
            <span>Schedule Follow-Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};
