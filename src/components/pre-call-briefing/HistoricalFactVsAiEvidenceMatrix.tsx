import React, { useState } from 'react';
import { HistoricalFactItem, AiInterpretationItem } from '../../types/preCallBriefing';
import { OriginBadge } from '../ui/OriginBadge';
import {
  ShieldCheck,
  Sparkles,
  Link2,
  FileText,
  DollarSign,
  PhoneCall,
  Scale,
  Activity,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface HistoricalFactVsAiEvidenceMatrixProps {
  facts: HistoricalFactItem[];
  interpretations: AiInterpretationItem[];
}

export const HistoricalFactVsAiEvidenceMatrix: React.FC<HistoricalFactVsAiEvidenceMatrixProps> = ({
  facts,
  interpretations,
}) => {
  const [selectedFactId, setSelectedFactId] = useState<string | null>(null);

  const getCategoryIcon = (category: HistoricalFactItem['category']) => {
    switch (category) {
      case 'PAYMENT_RECORD':
        return <DollarSign className="w-3.5 h-3.5 text-emerald-700" />;
      case 'RECORDED_CALL':
        return <PhoneCall className="w-3.5 h-3.5 text-indigo-700" />;
      case 'LEGAL_DOC':
        return <Scale className="w-3.5 h-3.5 text-slate-700" />;
      case 'BANK_DATA':
        return <Activity className="w-3.5 h-3.5 text-blue-700" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  const getWeightBadge = (weight: AiInterpretationItem['impactWeight']) => {
    switch (weight) {
      case 'HIGH_POSITIVE':
        return <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">High Positive Weight</span>;
      case 'MODERATE_POSITIVE':
        return <span className="bg-emerald-50/70 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px] font-mono">Moderate Positive</span>;
      case 'MODERATE_NEGATIVE':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">Moderate Friction</span>;
      case 'HIGH_NEGATIVE':
        return <span className="bg-rose-50 text-rose-800 border border-rose-200 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">High Risk Weight</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">Neutral</span>;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Matrix Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white shadow-2xs">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
              2. Evidence Discrimination: Historical Fact vs. AI Interpretation
            </h2>
            <p className="text-xs text-slate-600 font-sans">
              Strictly distinguishing verified ledger facts from model-derived statistical inferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedFactId && (
            <button
              onClick={() => setSelectedFactId(null)}
              className="text-xs font-mono text-indigo-600 hover:text-indigo-800 underline"
            >
              Reset Evidence Filter
            </button>
          )}
          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            {facts.length} Verified Facts • {interpretations.length} Model Inferences
          </div>
        </div>
      </div>

      {/* Side-by-Side Partition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Historical Facts (Ground Truth) */}
        <div className="rounded-lg border border-emerald-200 bg-emerald-50/20 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold font-mono text-emerald-950 uppercase tracking-wider">
                Historical Facts (Reconciled Ground Truth)
              </span>
            </div>
            <OriginBadge origin="VERIFIED_GROUND_TRUTH" size="xs" />
          </div>

          <div className="text-[11px] text-emerald-900 leading-relaxed font-sans">
            Immutable, audit-verified records sourced directly from counterparty banking networks, dual-channel audio archives, and legal registries.
          </div>

          {/* Fact Cards */}
          <div className="space-y-2.5">
            {facts.map((fact) => {
              const isSelected = selectedFactId === fact.id;
              const hasLinkedInterp = interpretations.some((i) => i.factIdRef === fact.id);

              return (
                <div
                  key={fact.id}
                  onClick={() => setSelectedFactId(isSelected ? null : fact.id)}
                  className={`p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-100/50 shadow-xs ring-1 ring-emerald-500'
                      : 'border-emerald-200/80 bg-white hover:border-emerald-400 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900">
                      {getCategoryIcon(fact.category)}
                      <span>{fact.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{fact.timestamp}</span>
                  </div>

                  <div className="font-semibold text-slate-800 pl-5 text-xs mb-1.5 leading-snug">
                    {fact.factValue}
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Source:</span>
                      <span className="font-semibold text-slate-700">{fact.dataSource}</span>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{fact.verifiedBy}</span>
                    </div>
                  </div>

                  {hasLinkedInterp && (
                    <div className="mt-1.5 pt-1 text-[10px] font-mono text-indigo-700 flex items-center gap-1">
                      <Link2 className="w-3 h-3" />
                      <span>Click to highlight linked AI inference</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Model Interpretations (Advisory Only) */}
        <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50/20 p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-indigo-200/60">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-700" />
              <span className="text-xs font-bold font-mono text-indigo-950 uppercase tracking-wider">
                AI Model Inferences (Advisory & Predictive)
              </span>
            </div>
            <OriginBadge origin="AI_RECOMMENDATION" size="xs" />
          </div>

          <div className="text-[11px] text-indigo-900 leading-relaxed font-sans">
            Probabilistic models and behavioral inferences synthesized from historical cohort patterns. <strong>Non-binding guidance for collector judgment.</strong>
          </div>

          {/* Interpretation Cards */}
          <div className="space-y-2.5">
            {interpretations
              .filter((interp) => !selectedFactId || interp.factIdRef === selectedFactId)
              .map((interp) => (
                <div
                  key={interp.id}
                  className={`p-3 rounded-lg border border-dashed text-xs transition-all ${
                    interp.factIdRef === selectedFactId
                      ? 'border-indigo-500 bg-indigo-100/50 shadow-xs ring-1 ring-indigo-400'
                      : 'border-indigo-200 bg-white hover:border-indigo-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-indigo-950">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{interp.category.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {getWeightBadge(interp.impactWeight)}
                      <span className="font-mono text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-bold">
                        {(interp.confidence * 100).toFixed(0)}% Conf
                      </span>
                    </div>
                  </div>

                  <div className="font-medium text-slate-900 pl-5 text-xs mb-1.5 leading-snug">
                    {interp.inferenceText}
                  </div>

                  <div className="text-[11px] text-slate-600 pl-5 bg-slate-50 p-1.5 rounded border border-slate-100 leading-relaxed">
                    <strong className="text-slate-700 font-mono text-[10px] uppercase">Rationale: </strong>
                    {interp.rationale}
                  </div>

                  {interp.factIdRef && (
                    <div className="mt-1.5 pl-5 flex items-center gap-1 text-[10px] font-mono text-emerald-700">
                      <Link2 className="w-3 h-3" />
                      <span>Derived from Ground Truth Fact #{interp.factIdRef}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
