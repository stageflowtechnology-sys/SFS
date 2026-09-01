import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Zap,
} from 'lucide-react';
import { DashboardAIRecommendation } from '../../types/dashboard';
import { OriginBadge } from '../ui/OriginBadge';
import { Button } from '../ui/Button';

interface AIRecommendationsSectionProps {
  recommendations: DashboardAIRecommendation[];
  onAuthorize?: (recommendation: DashboardAIRecommendation) => void;
  onInspect?: (recommendation: DashboardAIRecommendation) => void;
}

export const AIRecommendationsSection: React.FC<AIRecommendationsSectionProps> = ({
  recommendations,
  onAuthorize,
  onInspect,
}) => {
  const [authorizedIds, setAuthorizedIds] = useState<string[]>([]);

  const handleAuthorizeClick = (rec: DashboardAIRecommendation) => {
    setAuthorizedIds((prev) => [...prev, rec.id]);
    if (onAuthorize) onAuthorize(rec);
  };

  const totalProjectedLift = recommendations.reduce((acc, curr) => acc + curr.projectedRecoveryLift, 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-indigo-50/40">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              AI Copilot Recommendations (Advisory)
            </h3>
            <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold border border-indigo-200">
              +{totalProjectedLift.toLocaleString()} Projected Lift
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>What settlement discounts, channel timing, or skip-trace pivots does the model propose to maximize yield?</em>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-indigo-700">
          <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded border border-indigo-200 shadow-2xs font-semibold">
            <Zap className="w-3 h-3 text-indigo-600" />
            <span>Autonomous Threshold: $5,000</span>
          </span>
        </div>
      </div>

      {/* Compact Operational Model Confidence & Strategy Yield Bar */}
      <div className="px-4 py-2.5 bg-indigo-50/20 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Average Model Confidence</span>
            <span className="font-bold text-indigo-900">
              {((recommendations.reduce((acc, r) => acc + r.modelConfidence, 0) / recommendations.length) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{
                width: `${(recommendations.reduce((acc, r) => acc + r.modelConfidence, 0) / recommendations.length) * 100}%`,
              }}
              className="bg-indigo-600 rounded"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Total Projected Yield Gain</span>
            <span className="font-bold text-emerald-700">
              +${totalProjectedLift.toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Across {recommendations.length} Active Accounts
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Governance Origin</span>
            <span className="font-bold text-indigo-900">Advisory Pipeline</span>
          </div>
          <div className="text-[10px] text-slate-600">
            {authorizedIds.length} of {recommendations.length} Authorized by Manager
          </div>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="divide-y divide-slate-100">
        {recommendations.map((rec) => {
          const isAuthorized = authorizedIds.includes(rec.id);

          return (
            <div
              key={rec.id}
              className={`p-4 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                isAuthorized ? 'bg-emerald-50/30' : 'hover:bg-slate-50/70 bg-white'
              }`}
            >
              {/* Recommendation Details */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <OriginBadge
                    origin={rec.origin}
                    confidence={rec.modelConfidence}
                    size="xs"
                  />
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                    {rec.modelVersion}
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {rec.accountNumber}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    • {rec.debtorName}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-indigo-950">
                  {rec.actionTitle}
                </h4>

                <p className="text-[11px] text-slate-600 leading-relaxed font-sans max-w-3xl">
                  {rec.reasoning}
                </p>
              </div>

              {/* Lift & Action Buttons */}
              <div className="flex items-center gap-3 shrink-0 self-end lg:self-center border-t lg:border-t-0 pt-2 lg:pt-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                <div className="text-right font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Estimated Recovery Lift</div>
                  <div className="text-sm font-bold text-emerald-700">
                    +${rec.projectedRecoveryLift.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => onInspect && onInspect(rec)}
                  >
                    Inspect Reasoning
                  </Button>

                  {isAuthorized ? (
                    <Button
                      size="xs"
                      variant="authoritative-confirm"
                      disabled
                      leftIcon={<CheckCheck className="w-3.5 h-3.5 text-white" />}
                    >
                      Authorized
                    </Button>
                  ) : (
                    <Button
                      size="xs"
                      variant="ai-action"
                      onClick={() => handleAuthorizeClick(rec)}
                    >
                      Authorize Strategy
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
