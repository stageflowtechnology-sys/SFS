/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RecommendationItem } from '../../types/recommendationCenter';
import {
  X,
  FileText,
  Volume2,
  Sparkles,
  Quote,
  CheckCircle2,
  Cpu,
  BarChart2,
  ExternalLink,
} from 'lucide-react';

interface EvidenceDrawerModalProps {
  recommendation: RecommendationItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceDrawerModal: React.FC<EvidenceDrawerModalProps> = ({
  recommendation,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !recommendation) return null;

  const { evidence, confidence, account, customer } = recommendation;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Evidence Grounding & Inference Audit
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                {recommendation.id} • {account.accountNumber} ({customer.name})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* 1. Direct Evidence Citation Quote */}
          <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-mono font-bold text-[11px] uppercase tracking-wider">
                <Quote className="w-4 h-4 text-indigo-600" />
                <span>Primary Grounding Citation ({evidence.type.replace(/_/g, ' ')})</span>
              </div>
              <span className="font-mono text-[10px] bg-white border border-indigo-200 px-2 py-0.5 rounded text-indigo-700 font-bold">
                {evidence.timestampOrRef}
              </span>
            </div>

            <blockquote className="italic text-slate-800 text-xs leading-relaxed border-l-2 border-indigo-400 pl-3 py-1 font-serif bg-white/70 rounded-r-lg p-2">
              {evidence.directCitation}
            </blockquote>

            <div className="text-[11px] text-indigo-950 leading-relaxed font-sans pt-1">
              <strong>Grounding Logic:</strong> {evidence.groundingExplanation}
            </div>
          </div>

          {/* 2. Confidence Decomposition & Factors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Inference Confidence Decomposition</span>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600">
                Overall: {confidence.score}% ({confidence.tier})
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-b border-slate-200 pb-1.5">
                <span>Underlying Factor</span>
                <div className="flex gap-6">
                  <span>Weight</span>
                  <span>Factor Score</span>
                </div>
              </div>

              {confidence.factors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium text-slate-800">{factor.name}</span>
                    <div className="flex items-center gap-6 font-mono text-slate-600">
                      <span className="w-8 text-right text-slate-400">{factor.weight}</span>
                      <span className="w-8 text-right font-bold text-slate-900">{factor.score}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        factor.score >= 85
                          ? 'bg-emerald-500'
                          : factor.score >= 70
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                <span>Model: {confidence.calibrationModel}</span>
              </div>
              <span>Grounding Loss: 0.0028</span>
            </div>
          </div>

          {/* 3. Corroborating Facts & Telemetry */}
          {evidence.additionalFacts && evidence.additionalFacts.length > 0 && (
            <div className="space-y-2">
              <span className="text-slate-900 font-bold text-xs uppercase tracking-wider font-mono block">
                Corroborating Telemetry & Records
              </span>
              <ul className="space-y-1.5">
                {evidence.additionalFacts.map((fact, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center gap-2.5 text-[11px] text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close Audit View
          </button>
        </div>
      </div>
    </div>
  );
};
