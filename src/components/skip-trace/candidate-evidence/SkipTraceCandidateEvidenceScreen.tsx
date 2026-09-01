import React, { useState, useMemo } from 'react';
import {
  CandidateDetail,
  EvidenceItem,
  EvidenceProvenance,
  EvidenceState,
  IdentityBand,
} from '../../../types/skipTrace';
import { CANDIDATE_EVIDENCE_LIST } from '../../../data/candidateEvidenceData';
import { IdentityBandBadge } from '../IdentityBandBadge';
import { EvidenceStateBadge } from './EvidenceStateBadge';
import { CandidateCard } from './CandidateCard';
import { CandidateTableView } from './CandidateTableView';
import { EvidenceProvenanceModal } from './EvidenceProvenanceModal';
import { SkipTraceSubNav, SkipTraceSubViewType } from '../SkipTraceSubNav';
import {
  Search,
  Filter,
  Layers,
  LayoutGrid,
  List,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Scale,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  BrainCircuit,
  Fingerprint,
  Info,
  ChevronDown,
} from 'lucide-react';

interface SkipTraceCandidateEvidenceScreenProps {
  onSwitchToWorkspace?: () => void;
  onSwitchToOverview?: () => void;
  currentSubView?: SkipTraceSubViewType;
  onNavigateSubView?: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
}

export const SkipTraceCandidateEvidenceScreen: React.FC<SkipTraceCandidateEvidenceScreenProps> = ({
  onSwitchToWorkspace,
  onSwitchToOverview,
  currentSubView = 'CANDIDATES_EVIDENCE',
  onNavigateSubView = () => {},
  selectedAccountId,
  onSelectAccount,
}) => {
  // Candidate dataset state
  const [candidates, setCandidates] = useState<CandidateDetail[]>(CANDIDATE_EVIDENCE_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIdentityBand, setSelectedIdentityBand] = useState<IdentityBand | 'ALL'>('ALL');
  const [selectedEvidenceState, setSelectedEvidenceState] = useState<EvidenceState | 'ALL'>('ALL');
  const [hideNameOnlyMatches, setHideNameOnlyMatches] = useState(false);
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');

  // Provenance Modal Inspector
  const [selectedEvidenceForModal, setSelectedEvidenceForModal] = useState<{
    evidence: EvidenceItem & { evidenceState?: EvidenceState; provenance?: EvidenceProvenance };
    candidateName: string;
  } | null>(null);

  // Filtered Candidates computation
  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = cand.name.toLowerCase().includes(q);
        const matchesSource = cand.source.toLowerCase().includes(q);
        const matchesLocation = cand.primaryLocation.toLowerCase().includes(q);
        const matchesEvidence = cand.supportingEvidence.some(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.value.toLowerCase().includes(q) ||
            e.provenance.sourceName.toLowerCase().includes(q) ||
            e.provenance.certificateId.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesSource && !matchesLocation && !matchesEvidence) {
          return false;
        }
      }

      // 2. Identity Band Filter
      if (selectedIdentityBand !== 'ALL' && cand.identityMatch !== selectedIdentityBand) {
        return false;
      }

      // 3. Name-Only Toggle
      if (hideNameOnlyMatches && cand.isNameOnlyMatch) {
        return false;
      }

      // 4. Evidence State Filter (checks if candidate has evidence of this state)
      if (selectedEvidenceState !== 'ALL') {
        const hasMatchingEvidence = cand.supportingEvidence.some(
          (e) => e.evidenceState === selectedEvidenceState
        );
        if (!hasMatchingEvidence) return false;
      }

      return true;
    });
  }, [candidates, searchQuery, selectedIdentityBand, selectedEvidenceState, hideNameOnlyMatches]);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = candidates.length;
    const matchCount = candidates.filter((c) => c.identityMatch === 'MATCH').length;
    const probableCount = candidates.filter((c) => c.identityMatch === 'PROBABLE').length;
    const possibleCount = candidates.filter((c) => c.identityMatch === 'POSSIBLE').length;
    const insufficientCount = candidates.filter((c) => c.identityMatch === 'INSUFFICIENT').length;
    const contradictedCount = candidates.filter((c) => c.identityMatch === 'CONTRADICTED').length;

    let totalEvidenceItems = 0;
    let observedCount = 0;
    let inferredCount = 0;
    let unknownCount = 0;

    candidates.forEach((c) => {
      c.supportingEvidence.forEach((e) => {
        totalEvidenceItems++;
        if (e.evidenceState === 'OBSERVED') observedCount++;
        else if (e.evidenceState === 'INFERRED') inferredCount++;
        else if (e.evidenceState === 'UNKNOWN') unknownCount++;
      });
    });

    return {
      total,
      matchCount,
      probableCount,
      possibleCount,
      insufficientCount,
      contradictedCount,
      totalEvidenceItems,
      observedCount,
      inferredCount,
      unknownCount,
    };
  }, [candidates]);

  const handleInspectProvenance = (
    evidence: EvidenceItem & { evidenceState?: EvidenceState; provenance?: EvidenceProvenance },
    candidateName: string
  ) => {
    setSelectedEvidenceForModal({ evidence, candidateName });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Sub-Navigation for Skip Trace */}
      <SkipTraceSubNav
        currentSubView={currentSubView}
        onNavigateSubView={onNavigateSubView}
        selectedAccountId={selectedAccountId}
        onSelectAccount={onSelectAccount}
      />

      {/* Top Banner & Title Bar */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8 py-3.5 sticky top-[49px] z-10 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Header Title & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  Skip Trace Candidate & Evidence View
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Statutory Audit Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Evaluated candidate concordance, provenance certificates, and multi-source evidence ledger
              </p>
            </div>
          </div>

          {/* View Mode Toggle & Navigation Switchers */}
          <div className="flex items-center gap-2.5">
            {onSwitchToWorkspace && (
              <button
                onClick={onSwitchToWorkspace}
                id="btn-switch-to-workspace"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                Investigation Workspace
              </button>
            )}

            {onSwitchToOverview && (
              <button
                onClick={onSwitchToOverview}
                id="btn-switch-to-overview"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
              >
                Overview
              </button>
            )}

            {/* View Switcher: Cards vs. Table */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('CARDS')}
                id="btn-view-cards"
                className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-bold transition-all ${
                  viewMode === 'CARDS'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Card Matrix View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>

              <button
                onClick={() => setViewMode('TABLE')}
                id="btn-view-table"
                className={`p-1.5 rounded-md flex items-center gap-1 text-xs font-bold transition-all ${
                  viewMode === 'TABLE'
                    ? 'bg-white text-indigo-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Dense Audit Table View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-4 lg:px-8 py-5 max-w-[1600px] mx-auto w-full space-y-5">
        {/* Compliance Guideline Affirmation Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white rounded-2xl p-4.5 lg:p-5 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0 mt-0.5">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-700">
                  Compliance Safeguard
                </span>
                <span className="text-xs font-bold text-white">
                  Statutory Identity State & Provenance Standard
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                • <strong>A name-only match is never confirmed:</strong> Uncorroborated public records
                without SSN/DOB concordance are strictly flagged to prevent third-party disclosures under
                FDCPA §805(b).
                <br />• <strong>PROBABLE candidates</strong> are explicitly marked as{' '}
                <span className="font-bold text-amber-300">Potential — Unverified</span> until multi-source
                concordance is achieved.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2.5 px-4 rounded-xl border border-white/10 text-xs font-mono">
            <Fingerprint className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-300 block">Ingestion Ledger</span>
              <span className="font-bold text-white">100% Provenance Traceable</span>
            </div>
          </div>
        </div>

        {/* 1. Interactive Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total Candidates */}
          <div
            onClick={() => setSelectedIdentityBand('ALL')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedIdentityBand === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span
              className={`text-[10px] font-mono font-bold uppercase block ${
                selectedIdentityBand === 'ALL' ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              All Candidates
            </span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.total}</span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                selectedIdentityBand === 'ALL' ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Evaluated records
            </span>
          </div>

          {/* MATCH (Emerald) */}
          <div
            onClick={() => setSelectedIdentityBand('MATCH')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedIdentityBand === 'MATCH'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-mono font-bold uppercase block ${
                  selectedIdentityBand === 'MATCH' ? 'text-emerald-100' : 'text-emerald-700'
                }`}
              >
                MATCH
              </span>
              <CheckCircle2
                className={`w-3.5 h-3.5 ${
                  selectedIdentityBand === 'MATCH' ? 'text-emerald-200' : 'text-emerald-600'
                }`}
              />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.matchCount}</span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                selectedIdentityBand === 'MATCH' ? 'text-emerald-100' : 'text-slate-500'
              }`}
            >
              100% Concordance
            </span>
          </div>

          {/* PROBABLE (Indigo/Amber) */}
          <div
            onClick={() => setSelectedIdentityBand('PROBABLE')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedIdentityBand === 'PROBABLE'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-mono font-bold uppercase block ${
                  selectedIdentityBand === 'PROBABLE' ? 'text-indigo-100' : 'text-indigo-700'
                }`}
              >
                PROBABLE
              </span>
              <AlertTriangle
                className={`w-3.5 h-3.5 ${
                  selectedIdentityBand === 'PROBABLE' ? 'text-amber-300' : 'text-amber-500'
                }`}
              />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.probableCount}</span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                selectedIdentityBand === 'PROBABLE' ? 'text-indigo-100' : 'text-amber-700 font-semibold'
              }`}
            >
              Potential — Unverified
            </span>
          </div>

          {/* POSSIBLE (Amber) */}
          <div
            onClick={() => setSelectedIdentityBand('POSSIBLE')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedIdentityBand === 'POSSIBLE'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300'
            }`}
          >
            <span
              className={`text-[10px] font-mono font-bold uppercase block ${
                selectedIdentityBand === 'POSSIBLE' ? 'text-amber-100' : 'text-amber-700'
              }`}
            >
              POSSIBLE
            </span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.possibleCount}</span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                selectedIdentityBand === 'POSSIBLE' ? 'text-amber-100' : 'text-slate-500'
              }`}
            >
              Partial / Secondary
            </span>
          </div>

          {/* INSUFFICIENT (Slate) */}
          <div
            onClick={() => setSelectedIdentityBand('INSUFFICIENT')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedIdentityBand === 'INSUFFICIENT'
                ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-400'
            }`}
          >
            <span
              className={`text-[10px] font-mono font-bold uppercase block ${
                selectedIdentityBand === 'INSUFFICIENT' ? 'text-slate-200' : 'text-slate-600'
              }`}
            >
              INSUFFICIENT
            </span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.insufficientCount}</span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                selectedIdentityBand === 'INSUFFICIENT' ? 'text-slate-200' : 'text-slate-500'
              }`}
            >
              Name-Only / Thin
            </span>
          </div>

          {/* CONTRADICTED (Rose) */}
          <div
            onClick={() => setSelectedIdentityBand('CONTRADICTED')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedIdentityBand === 'CONTRADICTED'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-mono font-bold uppercase block ${
                  selectedIdentityBand === 'CONTRADICTED' ? 'text-rose-100' : 'text-rose-700'
                }`}
              >
                CONTRADICTED
              </span>
              <XCircle
                className={`w-3.5 h-3.5 ${
                  selectedIdentityBand === 'CONTRADICTED' ? 'text-rose-200' : 'text-rose-600'
                }`}
              />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.contradictedCount}</span>
            <span
              className={`text-[10px] font-medium block mt-0.5 ${
                selectedIdentityBand === 'CONTRADICTED' ? 'text-rose-100' : 'text-rose-600'
              }`}
            >
              Blockers / Collisions
            </span>
          </div>
        </div>

        {/* 2. Search & Multi-Level Filtering Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidate name, source, certificate, address..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filters Right Wing */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Evidence State Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 pl-2 pr-1">
                  Evidence State:
                </span>
                {(['ALL', 'OBSERVED', 'INFERRED', 'UNKNOWN'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedEvidenceState(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedEvidenceState === st
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st}
                  </button>
                ))}
              </div>

              {/* Hide Name-Only Checkbox */}
              <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 cursor-pointer select-none transition-colors">
                <input
                  type="checkbox"
                  checked={hideNameOnlyMatches}
                  onChange={(e) => setHideNameOnlyMatches(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 w-3.5 h-3.5"
                />
                <span>Exclude Name-Only Hits</span>
              </label>

              {/* Reset Filters */}
              {(selectedIdentityBand !== 'ALL' ||
                selectedEvidenceState !== 'ALL' ||
                searchQuery ||
                hideNameOnlyMatches) && (
                <button
                  onClick={() => {
                    setSelectedIdentityBand('ALL');
                    setSelectedEvidenceState('ALL');
                    setSearchQuery('');
                    setHideNameOnlyMatches(false);
                  }}
                  className="px-3 py-2 text-xs font-bold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Active Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 text-xs text-slate-500">
            <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
              Active Scope:
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-semibold text-slate-800">
              Identity Band: {selectedIdentityBand}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] font-semibold text-slate-800">
              Evidence State: {selectedEvidenceState}
            </span>
            <span className="ml-auto font-mono text-[11px] font-bold text-slate-700">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </span>
          </div>
        </div>

        {/* 3. Main Body: Card Matrix or Table View */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <Layers className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No matching candidate records found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No skip trace candidates match your current search query or active filter criteria. Try
              relaxing the identity band or evidence state filters.
            </p>
            <button
              onClick={() => {
                setSelectedIdentityBand('ALL');
                setSelectedEvidenceState('ALL');
                setSearchQuery('');
                setHideNameOnlyMatches(false);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : viewMode === 'CARDS' ? (
          <div className="space-y-4">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onInspectProvenance={handleInspectProvenance}
                isExpandedDefault={candidate.identityMatch === 'MATCH' || candidate.identityMatch === 'PROBABLE'}
              />
            ))}
          </div>
        ) : (
          <CandidateTableView
            candidates={filteredCandidates}
            onSelectCandidate={(cand) => {
              // Switch to Card view targeting that candidate
              setViewMode('CARDS');
            }}
            onInspectProvenance={handleInspectProvenance}
          />
        )}
      </div>

      {/* 4. Evidence Provenance Modal */}
      <EvidenceProvenanceModal
        isOpen={!!selectedEvidenceForModal}
        onClose={() => setSelectedEvidenceForModal(null)}
        evidence={selectedEvidenceForModal?.evidence || null}
        candidateName={selectedEvidenceForModal?.candidateName}
      />
    </div>
  );
};
