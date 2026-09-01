import React, { useState } from 'react';
import { CampaignItem, StageTransitionRuleItem } from '../../types/campaign';
import {
  GitBranch,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  Filter,
  Search,
  Flame,
  Info,
  Check,
} from 'lucide-react';

interface CampaignTransitionRulesTabProps {
  campaign: CampaignItem;
}

export const CampaignTransitionRulesTab: React.FC<CampaignTransitionRulesTabProps> = ({
  campaign,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTriggerFilter, setSelectedTriggerFilter] = useState<string>('ALL');

  const rules = campaign.transitionRules || [];

  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ruleCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.sourceStageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetStageName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTrigger =
      selectedTriggerFilter === 'ALL' || r.triggerEvent === selectedTriggerFilter;

    return matchesSearch && matchesTrigger;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Stage Transition Rules & Progression Logic</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-emerald-600" />
                  {rules.length} Active Automation Rules
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Evaluated in real-time by the workflow orchestrator to advance, skip, or quarantine accounts based on behavioral triggers and dwell timers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 self-start sm:self-center">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Rule Engine Inspection Mode</span>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="p-3 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Automated Progression Guardrails:</strong> Every transition rule is guarded by hard statutory constraints (CFPB 7-in-7 contact caps, TCPA local time windows, bankruptcy stays). When conditions match, accounts advance instantly without operator manual intervention.
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transition rules by code, stage, or trigger..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTriggerFilter}
              onChange={(e) => setSelectedTriggerFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Trigger Types</option>
              <option value="TIME_ELAPSED_NO_DISPUTE">Time Dwell Elapsed</option>
              <option value="CALL_COMPLETED_NO_PTP">Call Completed (No PTP)</option>
              <option value="SETTLEMENT_TIMER_EXPIRED">Settlement Timer Expired</option>
              <option value="COLLECTOR_MAX_ATTEMPTS_REACHED">Collector Attempts Exhausted</option>
              <option value="EXTERNAL_REGISTRY_SIGNAL">External PACER / SCRA Hit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transition Rules Grid */}
      {filteredRules.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <GitBranch className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No transition rules found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No rules matched your search query in this campaign.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs hover:border-indigo-300 transition-all space-y-4"
            >
              {/* Header: Rule Code, Name, and Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    {rule.ruleCode}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{rule.name}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-semibold font-mono">
                    {rule.executionCountLast30Days.toLocaleString()} triggers last 30d
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Stage Flow Vector (Source -> Target) */}
              <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    From:
                  </span>
                  <span className="font-bold text-slate-800 px-2 py-0.5 rounded bg-white border border-slate-200">
                    {rule.sourceStageName}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0" />

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    To:
                  </span>
                  <span className="font-bold text-indigo-700 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200">
                    {rule.targetStageName}
                  </span>
                </div>

                <div className="ml-auto text-[11px] font-semibold text-slate-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Velocity: {rule.velocityHours === 0 ? 'Immediate (0h)' : `${rule.velocityHours} Hours`}
                </div>
              </div>

              {/* Trigger Event & Conditions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Trigger & Conditions */}
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Trigger & Evaluation Conditions
                  </span>
                  <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {rule.triggerLabel}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    {rule.conditions.map((cond, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded bg-slate-50 border border-slate-100 space-y-0.5 font-mono text-[11px]"
                      >
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <span className="text-indigo-600">{cond.field}</span>
                          <span className="text-slate-500 font-normal">{cond.operator}</span>
                          <span className="text-emerald-700 font-bold">{cond.value}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans not-italic">
                          {cond.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automated Action & Guardrails */}
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Automated Action & Safety Guardrails
                  </span>

                  <p className="text-xs text-slate-800 font-semibold bg-indigo-50/50 p-2 rounded border border-indigo-100">
                    {rule.actionSummary}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                      Enforced Guardrails:
                    </span>
                    {rule.safetyGuardrails.map((g, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
