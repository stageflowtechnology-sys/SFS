import React from 'react';
import {
  EvidenceItem,
  IdentityBand,
  InvestigationCandidate,
  RecommendedAction,
  SkipTraceAccount,
} from '../../../types/skipTrace';
import { IdentityBandBadge } from '../IdentityBandBadge';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  PhoneCall,
  Mail,
  MapPin,
  Building,
  Briefcase,
  Layers,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Scale,
} from 'lucide-react';

interface IntelligenceSummaryRightPanelProps {
  confidenceScore: number;
  identityBand: IdentityBand;
  candidates: InvestigationCandidate[];
  evidenceList: EvidenceItem[];
  recommendedAction?: RecommendedAction;
  onPromoteEvidence: (evidence: EvidenceItem) => void;
  onSelectCandidate?: (candidate: InvestigationCandidate) => void;
  account: SkipTraceAccount;
}

export const IntelligenceSummaryRightPanel: React.FC<IntelligenceSummaryRightPanelProps> = ({
  confidenceScore,
  identityBand,
  candidates,
  evidenceList,
  recommendedAction,
  onPromoteEvidence,
  onSelectCandidate,
  account,
}) => {
  const [activeTab, setActiveTab] = React.useState<'EVIDENCE' | 'CANDIDATES'>('EVIDENCE');
  const [selectedCandidateId, setSelectedCandidateId] = React.useState<string>(
    candidates[0]?.id || ''
  );

  return (
    <div className="w-full lg:w-80 xl:w-92 shrink-0 flex flex-col gap-4 overflow-y-auto pl-1">
      {/* 1. Identity Confidence & Band Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Confidence Model
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Identity Concordance
              </h4>
            </div>
          </div>
          <IdentityBandBadge band={identityBand} size="sm" />
        </div>

        {/* Score Gauge */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-150">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 block">
              Confidence Index
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-mono font-bold text-slate-900">
                {confidenceScore}%
              </span>
              <span className="text-xs font-semibold text-emerald-700 font-mono">
                {confidenceScore >= 85 ? '• High Match' : confidenceScore >= 50 ? '• Probable' : '• Low'}
              </span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center relative">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className="text-slate-100"
                fill="transparent"
              />
              <circle
                cx="24"
                cy="24"
                r="18"
                stroke="currentColor"
                strokeWidth="4"
                className={
                  confidenceScore >= 85
                    ? 'text-emerald-500'
                    : confidenceScore >= 60
                    ? 'text-indigo-500'
                    : 'text-amber-500'
                }
                fill="transparent"
                strokeDasharray={113}
                strokeDashoffset={113 - (113 * confidenceScore) / 100}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-slate-800">
              {confidenceScore}%
            </span>
          </div>
        </div>

        {/* Concordance Checklist */}
        <div className="space-y-1.5 text-[11px] pt-1">
          <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 text-slate-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              SSN Last-4 Match
            </span>
            <span className="font-mono font-bold text-slate-900">{account.maskedSsn}</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 text-slate-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              DOB Header Concordance
            </span>
            <span className="font-mono font-bold text-slate-900">{account.maskedDob}</span>
          </div>
          <div className="flex items-center justify-between py-1 px-2 rounded bg-slate-50 text-slate-700">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              County Deed Equity Check
            </span>
            <span className="font-mono font-bold text-slate-900">Recorded Title</span>
          </div>
        </div>
      </div>

      {/* 2. Intelligence Switching Tabs (Evidence Discovered vs. Ranked Candidates) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold w-full">
            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className={`flex-1 py-1 px-2 rounded text-center transition-colors ${
                activeTab === 'EVIDENCE'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Evidence ({evidenceList.length})
            </button>
            <button
              onClick={() => setActiveTab('CANDIDATES')}
              className={`flex-1 py-1 px-2 rounded text-center transition-colors ${
                activeTab === 'CANDIDATES'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Candidates ({candidates.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Evidence Discovered */}
        {activeTab === 'EVIDENCE' && (
          <div className="space-y-2.5 flex-1">
            {evidenceList.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs my-auto">
                <Layers className="w-6 h-6 mx-auto text-slate-300 mb-1" />
                <p>No evidence artifacts generated yet.</p>
              </div>
            ) : (
              evidenceList.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-slate-900 leading-tight">
                      {item.title}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200 shrink-0">
                      {item.confidenceScore}% Conf.
                    </span>
                  </div>

                  <div className="font-mono text-[11px] font-bold text-slate-900 bg-white p-1.5 rounded border border-slate-200">
                    {item.value}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="truncate max-w-[140px]">{item.source}</span>
                    <button
                      onClick={() => onPromoteEvidence(item)}
                      id={`btn-promote-ev-${item.id}`}
                      className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-0.5 hover:underline"
                    >
                      <span>Promote to Master</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Ranked Candidates */}
        {activeTab === 'CANDIDATES' && (
          <div className="space-y-2.5 flex-1">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                onClick={() => {
                  setSelectedCandidateId(cand.id);
                  if (onSelectCandidate) onSelectCandidate(cand);
                }}
                className={`p-3 rounded-lg border cursor-pointer transition-all space-y-1.5 text-xs ${
                  selectedCandidateId === cand.id
                    ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                    : 'bg-slate-50 border-slate-200 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <span className="font-bold text-slate-900 block leading-tight">
                      {cand.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {cand.isPrimaryMatch ? 'Primary Subject Match' : 'Secondary Candidate'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-indigo-700 block">
                      {cand.matchScore}%
                    </span>
                    <IdentityBandBadge band={cand.identityBand} size="sm" />
                  </div>
                </div>

                <div className="text-[11px] text-slate-700 space-y-0.5 pt-1 border-t border-slate-200/60 font-sans">
                  <div>
                    <span className="text-slate-500">Address:</span> {cand.confirmedAddress}
                  </div>
                  <div>
                    <span className="text-slate-500">Phone:</span> {cand.activePhone}
                  </div>
                  <div>
                    <span className="text-slate-500">Employer:</span> {cand.primaryEmployer}
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-snug pt-1 italic">
                  {cand.notes}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Recommended Next Action */}
      {recommendedAction && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                Directive
              </span>
              <h4 className="text-xs font-bold text-slate-900">
                Recommended Next Action
              </h4>
            </div>
          </div>

          <div className="text-xs">
            <h5 className="font-bold text-slate-900">{recommendedAction.title}</h5>
            <p className="text-slate-600 text-[11px] mt-1 leading-snug">
              {recommendedAction.summary}
            </p>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 text-[10px] font-mono text-slate-600 flex items-start gap-1.5">
            <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
            <span>Rule: {recommendedAction.complianceRuleCitation}</span>
          </div>
        </div>
      )}
    </div>
  );
};
