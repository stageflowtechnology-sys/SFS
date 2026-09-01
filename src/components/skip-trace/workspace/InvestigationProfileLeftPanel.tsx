import React from 'react';
import {
  SkipTraceAccount,
  InvestigationSource,
  InvestigationBudgetPlan,
} from '../../../types/skipTrace';
import {
  User,
  DollarSign,
  ShieldCheck,
  FileText,
  AlertCircle,
  Database,
  Building,
  MapPin,
  PhoneCall,
  Clock,
  Briefcase,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface InvestigationProfileLeftPanelProps {
  account: SkipTraceAccount;
  sources: InvestigationSource[];
  budget: InvestigationBudgetPlan;
  onToggleSource?: (sourceId: string) => void;
  onAdjustBudget?: (newBudget: number) => void;
  isRunning: boolean;
}

export const InvestigationProfileLeftPanel: React.FC<InvestigationProfileLeftPanelProps> = ({
  account,
  sources,
  budget,
  onToggleSource,
  onAdjustBudget,
  isRunning,
}) => {
  const budgetPercentUsed = Math.min(
    100,
    Math.round((budget.usedBudgetDollars / (budget.allocatedBudgetDollars || 1)) * 100)
  );

  const stepsPercentUsed = Math.min(
    100,
    Math.round((budget.usedSteps / (budget.maxSteps || 1)) * 100)
  );

  return (
    <div className="w-full lg:w-80 xl:w-88 shrink-0 flex flex-col gap-4 overflow-y-auto pr-1">
      {/* 1. Target Debtor Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Target Profile
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                {account.customerName}
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {account.customerType === 'COMMERCIAL_GUARANTOR' ? 'Guarantor' : 'Consumer'}
          </span>
        </div>

        <div className="mt-3 space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-150 font-mono">
            <div>
              <span className="text-[10px] text-slate-600 block">SSN (Masked)</span>
              <span className="font-bold text-slate-900">{account.maskedSsn}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block">DOB (Masked)</span>
              <span className="font-bold text-slate-900">{account.maskedDob}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block">Account Number</span>
              <span className="font-bold text-slate-900">{account.accountNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-600 block">Customer ID</span>
              <span className="font-bold text-slate-900">{account.customerId}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-slate-600">
            <span>Delinquency Stage:</span>
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
              {account.currentStage}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Original Creditor:</span>
            <span className="font-medium text-slate-800 text-[11px] text-right truncate max-w-[150px]">
              {account.creditorName}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span>Total Outstanding:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              ${account.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Investigation Budget & Cost Usage Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Resource Allocation
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Budget & Step Usage
              </h4>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            ${(budget.allocatedBudgetDollars - budget.usedBudgetDollars).toFixed(2)} Remaining
          </span>
        </div>

        {/* Budget Dollars Consumption Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Cost Incurred</span>
            <span className="font-mono font-bold text-slate-900">
              ${budget.usedBudgetDollars.toFixed(2)}{' '}
              <span className="text-slate-600 font-normal">/ ${budget.allocatedBudgetDollars.toFixed(2)}</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                budgetPercentUsed > 85 ? 'bg-rose-500' : budgetPercentUsed > 60 ? 'bg-amber-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${budgetPercentUsed}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-slate-600">
            <span>Utilization: {budgetPercentUsed}%</span>
            <span>Max Cap: ${budget.allocatedBudgetDollars.toFixed(2)}</span>
          </div>
        </div>

        {/* Step Usage Meter */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">Investigation Steps</span>
            <span className="font-mono font-bold text-slate-900">
              {budget.usedSteps}{' '}
              <span className="text-slate-600 font-normal">/ {budget.maxSteps} Max Steps</span>
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${stepsPercentUsed}%` }}
            />
          </div>
        </div>

        {/* Breakdown by Source Table */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 block mb-2">
            Per-Source Cost Ledger
          </span>
          <div className="space-y-1.5 text-[11px]">
            {budget.costBreakdown.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 border border-slate-150"
              >
                <div className="truncate max-w-[170px] text-slate-700 font-medium">
                  {item.sourceName}
                </div>
                <div className="font-mono text-right shrink-0">
                  <span className="font-bold text-slate-900">${item.totalCost.toFixed(2)}</span>
                  <span className="text-[10px] text-slate-600 ml-1">({item.queriesCount}q)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Permitted Statutory Data Sources Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Statutory Tiers
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Permitted Repositories
              </h4>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
            {sources.length} Active
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="font-bold text-slate-900 text-[11px] leading-tight">
                  {src.name}
                </div>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                  ${src.costPerQuery.toFixed(2)}/q
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                {src.description}
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-600">
                <span>Latency ~{src.latencyAvgMs}ms</span>
                <span className="text-indigo-700 font-semibold">{src.compliancePurpose.split('&')[0]}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Statutory Safeguards Banner */}
        <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200/80 text-[11px] text-indigo-900 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="font-semibold block">Permissible Purpose Certified:</strong>
            Governed by FDCPA §804 and FCRA §604(a)(3)(A). No private account access or real-time location tracking.
          </div>
        </div>
      </div>
    </div>
  );
};
