import React from 'react';
import { AiPreCallBriefingData } from '../../types/preCallBriefing';
import {
  BrainCircuit,
  UserCheck,
  TrendingUp,
  KeyRound,
  AlertTriangle,
  Lightbulb,
  Shield,
  Activity,
} from 'lucide-react';

interface ImportantAccountContextCardProps {
  context: AiPreCallBriefingData['accountContextAnalysis'];
}

export const ImportantAccountContextCard: React.FC<ImportantAccountContextCardProps> = ({
  context,
}) => {
  return (
    <div className="rounded-lg border border-dashed border-indigo-300 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 text-indigo-700 border border-indigo-200">
          <BrainCircuit className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
            3. Important Account & Behavioral Context
          </h2>
          <div className="text-xs text-slate-600 font-sans">
            Debtor behavioral profile, verified liquidity metrics, and actionable negotiation leverage.
          </div>
        </div>
      </div>

      {/* Core Summary */}
      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
        <strong className="text-slate-900 font-semibold font-mono uppercase text-[11px]">Context Summary: </strong>
        {context.coreSummary}
      </div>

      {/* 3-Column Nuance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Personality Profile */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Behavioral Traits</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {context.personalityProfile.map((trait, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <span className="leading-snug">{trait}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solvency & Cash Flow */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Liquidity & Solvency</span>
          </div>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
            {context.solvencyStatus}
          </div>
          <div className="text-xs text-slate-600 leading-relaxed pt-1">
            {context.cashFlowIndicators}
          </div>
        </div>

        {/* Key Negotiation Leverage Points */}
        <div className="rounded-lg border border-slate-200 bg-white p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Key Leverage Points</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {context.keyLeveragePoints.map((pt, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span className="leading-snug text-slate-800">{pt}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
