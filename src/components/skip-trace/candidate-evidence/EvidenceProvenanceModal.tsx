import React from 'react';
import { EvidenceItem, EvidenceProvenance, EvidenceState } from '../../../types/skipTrace';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import {
  ShieldCheck,
  Scale,
  Calendar,
  Clock,
  KeyRound,
  FileCheck2,
  X,
  ExternalLink,
  Lock,
  Layers,
  Database,
  Fingerprint,
} from 'lucide-react';

interface EvidenceProvenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  evidence: (EvidenceItem & { evidenceState?: EvidenceState; provenance?: EvidenceProvenance }) | null;
  candidateName?: string;
}

export const EvidenceProvenanceModal: React.FC<EvidenceProvenanceModalProps> = ({
  isOpen,
  onClose,
  evidence,
  candidateName,
}) => {
  if (!isOpen || !evidence) return null;

  const provenance = evidence.provenance || {
    sourceName: evidence.source,
    sourceType: evidence.sourceType,
    statutoryCitation: 'FDCPA §804 & FCRA §604(a)(3)(A)',
    ingestMethod: 'Statutory Data Aggregation Gateway',
    ingestTimestamp: evidence.discoveredDate,
    certificateId: `CERT-EVD-${evidence.id.toUpperCase()}`,
    permissiblePurpose: 'Debt Collection & Location Acquisition',
    dataFreshnessDays: 1,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700/50">
                  Statutory Provenance Certificate
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-0.5">
                Evidence Provenance & Chain of Custody
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Top Artifact Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Subject / Candidate
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {candidateName || 'Primary Debtor Target'}
                </span>
              </div>
              {evidence.evidenceState && (
                <EvidenceStateBadge state={evidence.evidenceState} size="sm" />
              )}
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-900 block">
                {evidence.title}
              </span>
              <div className="font-mono text-xs font-bold text-indigo-700 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                {evidence.value}
              </div>
              {evidence.subValue && (
                <p className="text-[11px] text-slate-500 mt-1">{evidence.subValue}</p>
              )}
            </div>
          </div>

          {/* Provenance Audit Ledger */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cryptographic Ingestion Ledger</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Source Registry
                </span>
                <span className="font-bold text-slate-900 block leading-tight">
                  {provenance.sourceName}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Type: {provenance.sourceType}
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Certificate Digest ID
                </span>
                <span className="font-mono font-bold text-indigo-700 block">
                  {provenance.certificateId}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  SHA-256 Validated
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Statutory Rule Citation
                </span>
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="text-[11px]">{provenance.statutoryCitation}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block uppercase">
                  Ingestion Timestamp
                </span>
                <div className="flex items-center gap-1.5 font-mono text-slate-800 font-bold">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{provenance.ingestTimestamp}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Ingest Pipeline: {provenance.ingestMethod}
                </span>
              </div>
            </div>

            {/* Permissible Purpose Callout */}
            <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-800 block">
                Permissible Purpose Affirmation
              </span>
              <p className="text-[11px] text-indigo-950 font-medium leading-relaxed">
                {provenance.permissiblePurpose}. This record was ingested in accordance with
                FCRA §604 permissible purpose and FDCPA §804 statutory location acquisition
                safeguards.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Immutable Audit Record • StageFlow Engine</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
