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
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Scale,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface CandidateTableViewProps {
  candidates: CandidateDetail[];
  onSelectCandidate: (candidate: CandidateDetail) => void;
  onInspectProvenance: (
    evidence: EvidenceItem & { evidenceState?: EvidenceState; provenance?: EvidenceProvenance },
    candidateName: string
  ) => void;
}

export const CandidateTableView: React.FC<CandidateTableViewProps> = ({
  candidates,
  onSelectCandidate,
  onInspectProvenance,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3 px-4 font-bold">Candidate</th>
              <th className="py-3 px-4 font-bold">Identity Match</th>
              <th className="py-3 px-4 font-bold text-center">Confidence</th>
              <th className="py-3 px-4 font-bold">Supporting Evidence</th>
              <th className="py-3 px-4 font-bold">Contradictions</th>
              <th className="py-3 px-4 font-bold">Primary Source</th>
              <th className="py-3 px-4 font-bold">Observed Date</th>
              <th className="py-3 px-4 font-bold">Contact Channels</th>
              <th className="py-3 px-4 font-bold text-right">Audit</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-200">
            {candidates.map((cand) => {
              const isNameOnly = cand.isNameOnlyMatch;
              const isProbable = cand.identityMatch === 'PROBABLE';

              return (
                <tr
                  key={cand.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    isNameOnly
                      ? 'bg-amber-50/20'
                      : cand.identityMatch === 'CONTRADICTED'
                      ? 'bg-rose-50/20'
                      : ''
                  }`}
                >
                  {/* Candidate Identity Column */}
                  <td className="py-4 px-4 align-top max-w-[240px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs block leading-tight">
                          {cand.name}
                        </span>
                      </div>

                      {/* Name-only match warning badge (Must never look confirmed) */}
                      {isNameOnly && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" />
                          <span>Name-Only Match</span>
                        </div>
                      )}

                      <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
                        <div>SSN: {cand.maskedSsn || 'N/A'} • DOB: {cand.maskedDob || 'N/A'}</div>
                        <div className="text-slate-600 truncate">{cand.primaryLocation}</div>
                      </div>
                    </div>
                  </td>

                  {/* Identity Match Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1">
                      <IdentityBandBadge band={cand.identityMatch} size="sm" />

                      {/* Visible "Potential — Unverified" requirement for PROBABLE */}
                      {isProbable && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          <span>Potential — Unverified</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Confidence Column */}
                  <td className="py-4 px-4 align-top text-center">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`text-sm font-mono font-bold ${
                          cand.identityConfidence >= 85
                            ? 'text-emerald-700'
                            : cand.identityConfidence >= 60
                            ? 'text-indigo-700'
                            : cand.identityConfidence >= 30
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {cand.identityConfidence}%
                      </span>
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            cand.identityConfidence >= 85
                              ? 'bg-emerald-500'
                              : cand.identityConfidence >= 60
                              ? 'bg-indigo-500'
                              : cand.identityConfidence >= 30
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${cand.identityConfidence}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Supporting Evidence Column */}
                  <td className="py-4 px-4 align-top max-w-[200px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-bold text-slate-800">
                          {cand.supportingEvidence.length} Recorded Items
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cand.supportingEvidence.slice(0, 2).map((ev) => (
                          <span
                            key={ev.id}
                            onClick={() => onInspectProvenance(ev, cand.name)}
                            className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-100 text-slate-700 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-colors truncate max-w-[160px]"
                            title={`Inspect Provenance: ${ev.title}`}
                          >
                            {ev.evidenceState}: {ev.category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Contradicting Evidence Column */}
                  <td className="py-4 px-4 align-top">
                    {cand.contradictingEvidence.length === 0 ? (
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        0 Blockers
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3 h-3 text-rose-600" />
                          {cand.contradictingEvidence.length} Flagged Blockers
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Primary Source Column */}
                  <td className="py-4 px-4 align-top font-mono text-[11px] text-slate-700 max-w-[150px] truncate" title={cand.source}>
                    {cand.source}
                  </td>

                  {/* Observed Date Column */}
                  <td className="py-4 px-4 align-top font-mono text-[11px] text-slate-600">
                    {cand.observedDate}
                  </td>

                  {/* Contact Channels Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1 text-[11px]">
                      {cand.contactChannels.length === 0 ? (
                        <span className="text-slate-400 text-[10px] font-mono">None Available</span>
                      ) : (
                        cand.contactChannels.slice(0, 2).map((chan) => (
                          <div key={chan.id} className="flex items-center gap-1 text-slate-700 font-mono text-[10px]">
                            {chan.type.includes('PHONE') ? (
                              <Phone className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                            ) : (
                              <MapPin className="w-2.5 h-2.5 text-indigo-600 shrink-0" />
                            )}
                            <span className="truncate max-w-[140px]">{chan.value}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </td>

                  {/* Audit Action Column */}
                  <td className="py-4 px-4 align-top text-right">
                    <button
                      onClick={() => onSelectCandidate(cand)}
                      id={`btn-table-inspect-${cand.id}`}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
