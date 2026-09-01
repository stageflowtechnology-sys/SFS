import React from 'react';
import { AiPreCallBriefingData } from '../../types/preCallBriefing';
import { OriginBadge } from '../ui/OriginBadge';
import {
  Compass,
  Target,
  Sliders,
  Volume2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface RecommendedApproachCardProps {
  strategy: AiPreCallBriefingData['strategy'];
}

export const RecommendedApproachCard: React.FC<RecommendedApproachCardProps> = ({
  strategy,
}) => {
  return (
    <div className="rounded-lg border border-dashed border-indigo-300 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 text-indigo-700 border border-indigo-200">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
                1. Recommended Strategic Approach
              </h2>
              <OriginBadge origin="AI_RECOMMENDATION" size="xs" confidence={strategy.recommendedSettlementOffer.expectedFulfillmentProb} />
            </div>
            <div className="text-xs text-indigo-700 font-semibold font-mono">
              Posture: {strategy.postureLabel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-500">Predicted Fulfillment:</span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {(strategy.recommendedSettlementOffer.expectedFulfillmentProb * 100).toFixed(0)}% Likelihood
          </span>
        </div>
      </div>

      {/* Strategic Summary */}
      <div className="bg-indigo-50/40 p-3.5 rounded-lg border border-indigo-100 text-xs text-slate-800 leading-relaxed font-sans">
        <strong className="text-indigo-950 font-semibold">Core Model Strategy: </strong>
        {strategy.summary}
      </div>

      {/* Settlement Offer Recommendation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recommended Settlement Proposal */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Suggested Settlement Terms</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
              {strategy.recommendedSettlementOffer.discountPct}% Discount
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">
              ${strategy.recommendedSettlementOffer.targetAmount.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Payoff Target ({strategy.recommendedSettlementOffer.structureType.replace('_', ' ')})
            </span>
          </div>

          <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 leading-relaxed font-mono">
            {strategy.recommendedSettlementOffer.termsDescription}
          </div>
        </div>

        {/* Negotiating Boundaries (Policy Rules) */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Collector Negotiating Boundaries</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-semibold">
              Policy Floor Matrix
            </span>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-600">Max Authorized Discount:</span>
              <span className="font-bold text-slate-900">
                {strategy.negotiationBoundaries.maximumAuthorizedDiscountPct}% Max
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-600">Minimum Payoff Floor:</span>
              <span className="font-bold text-indigo-900">
                ${strategy.negotiationBoundaries.minimumAcceptablePayoff.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-200">
              <span className="text-slate-600">Authorized Fee Waiver:</span>
              <span className="font-bold text-emerald-700">
                Up to ${strategy.negotiationBoundaries.authorizedFeeWaiverMax.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-0.5 text-[11px] text-slate-500">
              <span>Manager Sign-Off:</span>
              <span className="text-amber-800 font-semibold">
                Required if &gt; {strategy.negotiationBoundaries.requiresManagerSignoffAbove}% discount
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Conversational Tone */}
      <div className="flex items-center gap-2.5 p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
        <Volume2 className="w-4 h-4 text-indigo-600 shrink-0" />
        <div>
          <span className="font-bold text-slate-900">Recommended Conversational Tone: </span>
          <span>{strategy.recommendedTone}</span>
        </div>
      </div>
    </div>
  );
};
