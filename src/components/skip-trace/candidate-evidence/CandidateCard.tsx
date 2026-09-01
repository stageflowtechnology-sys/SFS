import React from 'react';
import {
  CandidateDetail,
  EvidenceItem,
  EvidenceProvenance,
  EvidenceState,
} from '../../../types/skipTrace';
import { IdentityBandBadge } from '../IdentityBandBadge';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Fingerprint,
  Scale,
  Sparkles,
  AlertCircle,
  Briefcase,
  HelpCircle,
  UserX,
  UserCheck,
} from 'lucide-react';

interface CandidateCardProps {
  candidate: CandidateDetail;
  onInspectProvenance: (
    evidence: EvidenceItem & { evidenceState?: EvidenceState; provenance?: EvidenceProvenance },
    candidateName: string
  ) => void;
  isExpandedDefault?: boolean;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onInspectProvenance,
  isExpandedDefault = true,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(isExpandedDefault);
  const [activeTab, setActiveTab] = React.useState<'SUPPORTING' | 'CONTRADICTING' | 'CHANNELS'>('SUPPORTING');

  // Strict constraint: A name-only match must never look confirmed
  const isNameOnly = candidate.isNameOnlyMatch;

  // Strict constraint: A PROBABLE candidate must visibly say: "Potential — Unverified"
  const isProbable = candidate.identityMatch === 'PROBABLE';

  return (
    <div
      id={`candidate-card-${candidate.id}`}
      className={`rounded-2xl border transition-all shadow-xs overflow-hidden ${
        isNameOnly
          ? 'bg-amber-50/20 border-amber-300 ring-1 ring-amber-200'
          : candidate.identityMatch === 'MATCH'
          ? 'bg-white border-slate-200 hover:border-indigo-300'
          : candidate.identityMatch === 'PROBABLE'
          ? 'bg-white border-indigo-200/80 hover:border-indigo-400'
          : candidate.identityMatch === 'CONTRADICTED'
          ? 'bg-rose-50/20 border-rose-200'
          : 'bg-white border-slate-200'
      }`}
    >
      {/* 1. Name-Only Warning Banner (Crucial Constraint: Name-only must never look confirmed) */}
      {isNameOnly && (
        <div className="bg-amber-500/10 border-b border-amber-200 px-5 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider">
              NAME-ONLY MATCH — UNCORROBORATED (Cannot Confirm Identity Without DOB/SSN Concordance)
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Unverified Name Collision
          </span>
        </div>
      )}

      {/* 2. Top Header Bar */}
      <div className="p-5 lg:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Candidate Primary Identity Info */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base lg:text-lg font-bold text-slate-900 leading-tight">
                {candidate.name}
              </h3>

              {/* Identity Band Badge */}
              <IdentityBandBadge band={candidate.identityMatch} size="md" />

              {/* Crucial Constraint: A PROBABLE candidate must visibly say "Potential — Unverified" */}
              {isProbable && (
                <span
                  id={`badge-probable-warning-${candidate.id}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase bg-amber-50 text-amber-800 border border-amber-300 animate-pulse"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Potential — Unverified</span>
                </span>
              )}

              {/* Entity Type Chip */}
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {candidate.entityType.replace(/_/g, ' ')}
              </span>
            </div>

            {candidate.aliasOrSuffix && (
              <p className="text-xs text-slate-500 font-mono">
                Alias / Note: {candidate.aliasOrSuffix}
              </p>
            )}
          </div>

          {/* Identity Confidence & Score Gauge */}
          <div className="flex items-center gap-4 bg-slate-50 p-2.5 px-4 rounded-xl border border-slate-200">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">
                Identity Confidence
              </span>
              <div className="flex items-baseline justify-end gap-1">
                <span
                  className={`text-xl font-mono font-bold ${
                    candidate.identityConfidence >= 85
                      ? 'text-emerald-700'
                      : candidate.identityConfidence >= 60
                      ? 'text-indigo-700'
                      : candidate.identityConfidence >= 30
                      ? 'text-amber-700'
                      : 'text-rose-700'
                  }`}
                >
                  {candidate.identityConfidence}%
                </span>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center relative">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-200"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  stroke="currentColor"
                  strokeWidth="3"
                  className={
                    candidate.identityConfidence >= 85
                      ? 'text-emerald-500'
                      : candidate.identityConfidence >= 60
                      ? 'text-indigo-500'
                      : candidate.identityConfidence >= 30
                      ? 'text-amber-500'
                      : 'text-rose-500'
                  }
                  fill="transparent"
                  strokeDasharray={94}
                  strokeDashoffset={94 - (94 * candidate.identityConfidence) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-bold text-slate-800">
                {candidate.identityConfidence}%
              </span>
            </div>
          </div>
        </div>

        {/* Concordance Checklist Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-between">
            <span className="text-slate-500 font-medium">SSN Concordance:</span>
            <span
              className={`font-mono font-bold ${
                candidate.ssnConcordance === 'EXACT_LAST4'
                  ? 'text-emerald-700'
                  : candidate.ssnConcordance === 'MISMATCH'
                  ? 'text-rose-700'
                  : 'text-slate-500'
              }`}
            >
              {candidate.maskedSsn || 'Not Available'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-between">
            <span className="text-slate-500 font-medium">DOB Concordance:</span>
            <span
              className={`font-mono font-bold ${
                candidate.dobConcordance === 'EXACT'
                  ? 'text-emerald-700'
                  : candidate.dobConcordance === 'DISTINCT_DOB'
                  ? 'text-rose-700'
                  : 'text-slate-500'
              }`}
            >
              {candidate.maskedDob || 'Not Available'}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Primary Source:</span>
            <span className="font-sans font-bold text-slate-900 truncate max-w-[130px]" title={candidate.source}>
              {candidate.source}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-between">
            <span className="text-slate-500 font-medium">Observed Date:</span>
            <span className="font-mono text-slate-700 font-bold">{candidate.observedDate}</span>
          </div>
        </div>

        {/* Summary Rationale Text */}
        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-200">
          <span className="font-bold text-slate-900">Intelligence Finding: </span>
          {candidate.summaryRationale}
        </p>

        {/* Evidence Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-150">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('SUPPORTING')}
              id={`tab-supporting-${candidate.id}`}
              className={`py-1 px-3 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'SUPPORTING'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supporting Evidence ({candidate.supportingEvidence.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('CONTRADICTING')}
              id={`tab-contradicting-${candidate.id}`}
              className={`py-1 px-3 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'CONTRADICTING'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <XCircle className={`w-3.5 h-3.5 ${candidate.contradictingEvidence.length > 0 ? 'text-rose-600' : 'text-slate-400'}`} />
              <span>Contradicting Evidence ({candidate.contradictingEvidence.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('CHANNELS')}
              id={`tab-channels-${candidate.id}`}
              className={`py-1 px-3 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'CHANNELS'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Contact Channels ({candidate.contactChannels.length})</span>
            </button>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <span>{isExpanded ? 'Collapse Details' : 'Expand Details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. Detailed Tab Content (Collapsible) */}
      {isExpanded && (
        <div className="bg-slate-50/50 border-t border-slate-200 p-5 lg:p-6 space-y-3">
          {/* TAB 1: SUPPORTING EVIDENCE */}
          {activeTab === 'SUPPORTING' && (
            <div className="space-y-3">
              {candidate.supportingEvidence.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                  <p>No supporting evidence items recorded.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {candidate.supportingEvidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2.5 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Evidence Classification & Provenance Tag Header */}
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100">
                          <div className="flex items-center gap-1.5">
                            {ev.evidenceState && (
                              <EvidenceStateBadge state={ev.evidenceState} size="sm" />
                            )}
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">
                              {ev.category}
                            </span>
                          </div>

                          <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            {ev.confidenceScore}% Conf.
                          </span>
                        </div>

                        {/* Title & Value */}
                        <div className="pt-1.5 space-y-1">
                          <h5 className="text-xs font-bold text-slate-900 leading-snug">
                            {ev.title}
                          </h5>
                          <div className="font-mono text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                            {ev.value}
                          </div>
                          {ev.subValue && (
                            <p className="text-[11px] text-slate-500 leading-snug">
                              {ev.subValue}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Explicit Provenance Footer (Every evidence item must show provenance) */}
                      <div className="pt-2 border-t border-slate-100 text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-slate-500 font-mono">
                          <span className="truncate max-w-[180px]">
                            Source: {ev.provenance.sourceName}
                          </span>
                          <span>Observed: {ev.discoveredDate}</span>
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                          <span className="font-mono text-[9px] text-slate-400 truncate max-w-[180px]">
                            Cert: {ev.provenance.certificateId}
                          </span>

                          <button
                            onClick={() => onInspectProvenance(ev, candidate.name)}
                            id={`btn-provenance-${ev.id}`}
                            className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 hover:underline font-mono"
                          >
                            <Scale className="w-3 h-3" />
                            <span>View Provenance</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CONTRADICTING EVIDENCE */}
          {activeTab === 'CONTRADICTING' && (
            <div className="space-y-3">
              {candidate.contradictingEvidence.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-700">
                    Zero contradicting evidence items or statutory blockers identified for this candidate.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {candidate.contradictingEvidence.map((contra) => (
                    <div
                      key={contra.id}
                      className="bg-white rounded-xl border border-rose-200 p-4 space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                            {contra.severity.replace(/_/g, ' ')}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900">{contra.title}</h5>
                        </div>

                        <span className="text-[10px] font-mono text-slate-500">
                          Observed: {contra.observedDate}
                        </span>
                      </div>

                      <p className="text-xs text-rose-950 bg-rose-50/50 p-2.5 rounded-lg border border-rose-150 leading-relaxed">
                        <span className="font-bold">Discrepancy Finding: </span>
                        {contra.finding}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600">
                        <span className="font-semibold">
                          Reconciliation: {contra.reconciliationNote}
                        </span>

                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                          <Scale className="w-3 h-3 text-indigo-600" />
                          <span>Rule: {contra.provenance.statutoryCitation}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CONTACT CHANNELS */}
          {activeTab === 'CHANNELS' && (
            <div className="space-y-3">
              {candidate.contactChannels.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs bg-white rounded-xl border border-slate-200">
                  <p>No verified contact channels recorded for this candidate record.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {candidate.contactChannels.map((chan) => (
                    <div
                      key={chan.id}
                      className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2 shadow-2xs hover:border-indigo-200 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100">
                          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase truncate max-w-[140px]">
                            {chan.label}
                          </span>
                          <EvidenceStateBadge state={chan.evidenceState} size="sm" />
                        </div>

                        <div className="font-mono text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-lg border border-slate-200">
                          {chan.value}
                        </div>

                        {chan.carrierOrDeliverability && (
                          <p className="text-[10px] text-slate-500">
                            {chan.carrierOrDeliverability}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-mono">Reachability:</span>
                          <span className="font-mono font-bold text-indigo-700">
                            {chan.reachabilityScore}% Score
                          </span>
                        </div>

                        <div className="p-1.5 rounded bg-slate-50 text-[10px] font-mono flex items-center justify-between text-slate-700">
                          <span className="truncate max-w-[160px]">{chan.fdcpaWindow}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold ${
                              chan.inWindowNow
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {chan.inWindowNow ? 'CALL PERMITTED' : 'BLOCKED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
