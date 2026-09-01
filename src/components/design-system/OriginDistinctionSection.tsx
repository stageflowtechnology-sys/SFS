import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  RefreshCw,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Info,
  CheckCircle2,
  Code2,
  FileCheck2,
} from 'lucide-react';
import { OriginBadge, ORIGIN_CONFIG } from '../ui/OriginBadge';
import { StateOrigin } from '../../types/design-system';
import { Button } from '../ui/Button';

export const OriginDistinctionSection: React.FC = () => {
  const [selectedOrigin, setSelectedOrigin] = useState<StateOrigin>('AI_RECOMMENDATION');

  const origins: StateOrigin[] = [
    'AI_RECOMMENDATION',
    'HUMAN_DECISION',
    'SYSTEM_EXECUTION',
    'VERIFIED_GROUND_TRUTH',
    'EXECUTION_FAILED',
  ];

  const current = ORIGIN_CONFIG[selectedOrigin];

  return (
    <div className="space-y-8">
      {/* Principle Banner */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded bg-indigo-100 border border-indigo-200 text-indigo-700 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-700">
                Core Architectural Rule
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold">
                CRITICAL PRINCIPLE
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">
              AI Recommendation ≠ Authoritative System State
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-4xl">
              In financial debt recovery, algorithmic inferences have <strong>no legal standing</strong> until
              validated, authorized, and ledger-reconciled. The StageFlow AI design system provides uncompromising
              visual differentiation between statistical AI suggestions, human authority, pipeline execution, immutable
              ledger truth, and system failure.
            </p>
          </div>
        </div>
      </div>

      {/* Origin Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {origins.map((origin) => {
          const cfg = ORIGIN_CONFIG[origin];
          const isSelected = selectedOrigin === origin;
          return (
            <button
              key={origin}
              onClick={() => setSelectedOrigin(origin)}
              className={`p-3 rounded-lg text-left transition-all border flex flex-col justify-between gap-3 ${
                isSelected
                  ? `${cfg.badgeStyle} shadow-sm scale-[1.02] bg-white`
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <OriginBadge origin={origin} size="xs" />
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{cfg.title}</div>
                <div className="text-[10px] font-mono text-slate-500 truncate">{cfg.legalStanding}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Origin Deep Dive Card */}
      <div className={`rounded-lg border p-5 bg-white shadow-xs ${current.borderStyle} transition-all duration-200`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Spec column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{current.title}</h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      current.authoritative
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {current.authoritative ? 'AUTHORITATIVE STATE' : 'NON-AUTHORITATIVE'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{current.description}</p>
              </div>
            </div>

            {/* Visual Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Legal Standing</div>
                <div className="font-semibold text-slate-800 mt-1">{current.legalStanding}</div>
              </div>
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Visual Cue & Border</div>
                <div className="font-mono text-[11px] text-slate-700 mt-1">{current.visualCue}</div>
              </div>
              <div className="p-2.5 rounded border border-slate-200 bg-slate-50">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Execution Guard</div>
                <div className="font-semibold text-slate-800 mt-1">
                  {selectedOrigin === 'AI_RECOMMENDATION'
                    ? 'Requires Human Approval'
                    : selectedOrigin === 'HUMAN_DECISION'
                    ? 'Operator Token Signed'
                    : selectedOrigin === 'SYSTEM_EXECUTION'
                    ? 'Idempotency Lock Active'
                    : selectedOrigin === 'VERIFIED_GROUND_TRUTH'
                    ? 'Immutable Settlement'
                    : 'Rollback & Exception Queue'}
                </div>
              </div>
            </div>

            {/* UI Component Rendering Example in Context */}
            <div className="p-3.5 rounded border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider flex items-center justify-between font-semibold">
                <span>Representative Debt Operation Component Preview</span>
                <span className="text-[10px] text-indigo-600 font-bold">Live Component State</span>
              </div>

              {selectedOrigin === 'AI_RECOMMENDATION' && (
                <div className="p-3 rounded border border-dashed border-indigo-300 bg-indigo-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-indigo-950">
                          Proposed: Offer 15% Settlement Discount ($18,400 Payoff)
                        </span>
                        <OriginBadge origin="AI_RECOMMENDATION" confidence={0.91} size="xs" />
                      </div>
                      <p className="text-[11px] text-indigo-900/80 mt-0.5">
                        Model: Recovery-Predictor v4.2 • Debtor liquidity spike detected via payroll deposit pattern.
                      </p>
                    </div>
                  </div>
                  <Button variant="ai-action" size="xs">
                    Authorize Discount
                  </Button>
                </div>
              )}

              {selectedOrigin === 'HUMAN_DECISION' && (
                <div className="p-3 rounded border border-amber-300 bg-amber-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <UserCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-amber-950">
                          Manual Override: Hold Dialing for 30-Day Hardship Review
                        </span>
                        <OriginBadge origin="HUMAN_DECISION" operatorId="402" size="xs" />
                      </div>
                      <p className="text-[11px] text-amber-900/80 mt-0.5">
                        Signed by J. Vance (Licensed Officer #402) • Medical expense verification document uploaded.
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary" size="xs">
                    View Sign-off Audit
                  </Button>
                </div>
              )}

              {selectedOrigin === 'SYSTEM_EXECUTION' && (
                <div className="p-3 rounded border border-cyan-300 bg-cyan-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <RefreshCw className="w-4 h-4 text-cyan-600 animate-spin shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-cyan-950">
                          ACH Direct Debit in Progress: $4,500.00 USD
                        </span>
                        <OriginBadge origin="SYSTEM_EXECUTION" size="xs" />
                      </div>
                      <p className="text-[11px] text-cyan-900/80 mt-0.5">
                        Gateway Job #ACH-894102 • Awaiting Fedwire settlement batch confirmation (SLA: ~4 mins).
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[11px] text-cyan-800 px-2 py-1 rounded bg-cyan-100 border border-cyan-200 font-semibold">
                    Lock ID: #LK-902
                  </span>
                </div>
              )}

              {selectedOrigin === 'VERIFIED_GROUND_TRUTH' && (
                <div className="p-3 rounded border-2 border-emerald-500/80 bg-emerald-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-emerald-950">
                          Reconciled Bank Settlement: $28,950.00 USD Settled
                        </span>
                        <OriginBadge origin="VERIFIED_GROUND_TRUTH" size="xs" />
                      </div>
                      <p className="text-[11px] text-emerald-900/80 mt-0.5 font-mono">
                        Ledger Proof: 0x4f82...9e21 • Core Banking Ref: BK-99410 • Balance: $0.00 (Satisfied)
                      </p>
                    </div>
                  </div>
                  <Button variant="authoritative-confirm" size="xs">
                    Download Proof
                  </Button>
                </div>
              )}

              {selectedOrigin === 'EXECUTION_FAILED' && (
                <div className="p-3 rounded border border-rose-300 bg-rose-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-rose-950">
                          ACH Gateway Decline: R01 Insufficient Funds
                        </span>
                        <OriginBadge origin="EXECUTION_FAILED" size="xs" />
                      </div>
                      <p className="text-[11px] text-rose-900/80 mt-0.5 font-mono">
                        Exception Code: ERR_ACH_R01 • Transaction rolled back. Account returned to PENDING_RETRY.
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" size="xs">
                    Handle Exception
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right / State Lineage Flow */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-900">Operational Lineage Flow</div>
            <p className="text-[11px] text-slate-500">
              How state transitions from statistical inference to audited financial ground truth:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                <span className="text-indigo-900 font-semibold">1. Model Inference</span>
                <span className="text-[10px] font-mono text-indigo-700 font-medium">Non-binding</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2 rounded bg-amber-50 border border-amber-200 flex items-center justify-between">
                <span className="text-amber-900 font-semibold">2. Human Review Gate</span>
                <span className="text-[10px] font-mono text-amber-700 font-medium">Sign-off</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2 rounded bg-cyan-50 border border-cyan-200 flex items-center justify-between">
                <span className="text-cyan-900 font-semibold">3. System Pipeline Run</span>
                <span className="text-[10px] font-mono text-cyan-700 font-medium">Locked</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 rotate-90" />
              </div>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <span className="text-emerald-900 font-semibold">4. Ledger Reconciliation</span>
                <span className="text-[10px] font-mono text-emerald-700 font-medium">Ground Truth</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
