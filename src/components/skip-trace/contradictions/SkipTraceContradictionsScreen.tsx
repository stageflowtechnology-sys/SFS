import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Scale,
  Search,
  Filter,
  RefreshCw,
  FileCheck2,
  Fingerprint,
  ChevronRight,
  Info,
  Clock,
  UserX,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  ShieldCheck,
  Eye,
  SlidersHorizontal,
  X,
  Sparkles,
} from 'lucide-react';
import {
  ContradictingEvidenceItem,
  IdentityBand,
  EvidenceState,
  EvidenceProvenance,
  SkipTraceAccount,
} from '../../../types/skipTrace';
import { CANDIDATE_EVIDENCE_LIST } from '../../../data/candidateEvidenceData';
import { SKIP_TRACE_ACCOUNTS } from '../../../data/skipTraceData';
import { IdentityBandBadge } from '../IdentityBandBadge';
import { EvidenceStateBadge } from '../candidate-evidence/EvidenceStateBadge';
import { SkipTraceSubNav, SkipTraceSubViewType } from '../SkipTraceSubNav';

interface SkipTraceContradictionsScreenProps {
  currentSubView: SkipTraceSubViewType;
  onNavigateSubView: (view: SkipTraceSubViewType) => void;
  selectedAccountId?: string;
  onSelectAccount?: (accountId: string) => void;
}

interface EnrichedContradiction extends ContradictingEvidenceItem {
  candidateId: string;
  candidateName: string;
  candidateBand: IdentityBand;
  isReconciled: boolean;
  reconciliationAudit?: {
    operatorId: string;
    operatorName: string;
    resolvedDate: string;
    reason: string;
    status: 'CLEARED_AUTHORIZED' | 'MAINTAIN_BLOCK';
  };
}

export const SkipTraceContradictionsScreen: React.FC<SkipTraceContradictionsScreenProps> = ({
  currentSubView,
  onNavigateSubView,
  selectedAccountId = 'skip-acc-101',
  onSelectAccount,
}) => {
  // Aggregate all contradictions across candidates
  const initialContradictions: EnrichedContradiction[] = useMemo(() => {
    const list: EnrichedContradiction[] = [];

    CANDIDATE_EVIDENCE_LIST.forEach((cand) => {
      cand.contradictingEvidence.forEach((contra) => {
        const isDeceasedOrReconciled =
          contra.reconciliationNote.toLowerCase().includes('reconciled') ||
          contra.reconciliationNote.toLowerCase().includes('exonerated') ||
          contra.reconciliationNote.toLowerCase().includes('cleared');

        list.push({
          ...contra,
          candidateId: cand.id,
          candidateName: cand.name,
          candidateBand: cand.identityMatch,
          isReconciled: isDeceasedOrReconciled,
          reconciliationAudit: isDeceasedOrReconciled
            ? {
                operatorId: 'OP-4819 (Compliance Officer)',
                operatorName: 'Sarah Jenkins, Senior Auditor',
                resolvedDate: '2026-08-28 14:25 EST',
                reason: contra.reconciliationNote,
                status: 'CLEARED_AUTHORIZED',
              }
            : undefined,
        });
      });
    });

    return list;
  }, []);

  const [contradictions, setContradictions] = useState<EnrichedContradiction[]>(initialContradictions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'ACTIVE_BLOCK' | 'RECONCILED'>('ALL');

  // Drawer / Modal states
  const [selectedContraForDrawer, setSelectedContraForDrawer] = useState<EnrichedContradiction | null>(null);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState(false);
  const [contraToReconcile, setContraToReconcile] = useState<EnrichedContradiction | null>(null);
  const [reconcileAction, setReconcileAction] = useState<'CLEARED_AUTHORIZED' | 'MAINTAIN_BLOCK'>('CLEARED_AUTHORIZED');
  const [reconcileNotes, setReconcileNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string; type: 'success' | 'alert' } | null>(null);

  const showToast = (title: string, subtitle: string, type: 'success' | 'alert' = 'success') => {
    setToastMessage({ title, subtitle, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Filter contradictions
  const filteredContradictions = useMemo(() => {
    return contradictions.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesFinding = item.finding.toLowerCase().includes(q);
        const matchesCandidate = item.candidateName.toLowerCase().includes(q);
        const matchesSource = item.source.toLowerCase().includes(q);
        const matchesCert = item.provenance.certificateId.toLowerCase().includes(q);
        if (!matchesTitle && !matchesFinding && !matchesCandidate && !matchesSource && !matchesCert) {
          return false;
        }
      }

      if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) {
        return false;
      }

      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedStatus === 'ACTIVE_BLOCK' && item.isReconciled) {
        return false;
      }

      if (selectedStatus === 'RECONCILED' && !item.isReconciled) {
        return false;
      }

      return true;
    });
  }, [contradictions, searchQuery, selectedSeverity, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    const total = contradictions.length;
    const critical = contradictions.filter((c) => c.severity === 'CRITICAL_BLOCKER').length;
    const high = contradictions.filter((c) => c.severity === 'HIGH_RISK').length;
    const medium = contradictions.filter((c) => c.severity === 'MEDIUM_DISCREPANCY').length;
    const reconciled = contradictions.filter((c) => c.isReconciled).length;
    const activeBlocks = contradictions.filter((c) => !c.isReconciled).length;

    return {
      total,
      critical,
      high,
      medium,
      reconciled,
      activeBlocks,
    };
  }, [contradictions]);

  const handleOpenReconcile = (item: EnrichedContradiction) => {
    setContraToReconcile(item);
    setReconcileAction(item.isReconciled ? 'MAINTAIN_BLOCK' : 'CLEARED_AUTHORIZED');
    setReconcileNotes(item.reconciliationNote || '');
    setIsReconcileModalOpen(true);
  };

  const handleConfirmReconcile = () => {
    if (!contraToReconcile) return;

    const isNowReconciled = reconcileAction === 'CLEARED_AUTHORIZED';

    setContradictions((prev) =>
      prev.map((item) => {
        if (item.id === contraToReconcile.id) {
          return {
            ...item,
            isReconciled: isNowReconciled,
            reconciliationNote: reconcileNotes || item.reconciliationNote,
            reconciliationAudit: isNowReconciled
              ? {
                  operatorId: 'OP-4819 (Active Operator)',
                  operatorName: 'Active Compliance Officer',
                  resolvedDate: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' EST',
                  reason: reconcileNotes || 'Reconciled via statutory review audit.',
                  status: reconcileAction,
                }
              : undefined,
          };
        }
        return item;
      })
    );

    setIsReconcileModalOpen(false);
    showToast(
      isNowReconciled ? 'Discrepancy Reconciled & Exonerated' : 'Block Maintained on Discrepancy',
      `Audit entry recorded for "${contraToReconcile.title}". Compliance ledger updated.`,
      isNowReconciled ? 'success' : 'alert'
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">
      {/* Unified Sub-Navigation */}
      <SkipTraceSubNav
        currentSubView={currentSubView}
        onNavigateSubView={onNavigateSubView}
        selectedAccountId={selectedAccountId}
        onSelectAccount={onSelectAccount}
        contraCount={stats.activeBlocks}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-800 flex items-start gap-3 animate-in slide-in-from-bottom-5 duration-200">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="text-xs font-bold text-white">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-normal">{toastMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="px-4 lg:px-8 py-5 max-w-[1600px] mx-auto w-full space-y-5">
        {/* Compliance Guardrail Affirmation Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white rounded-2xl p-4.5 lg:p-5 shadow-sm border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-700">
                  Statutory Non-Discrepancy Barrier
                </span>
                <span className="text-xs font-bold text-white">
                  Contradiction Resolution & Negative File Audit
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                • <strong>Deceased and Bankruptcy Checks:</strong> All candidate hits conflicting with SSA Death Master File or PACER bankruptcy registries are held in quarantine until reconciled by an authorized officer.
                <br />• <strong>False-Positive Prevention:</strong> Name-only collisions (unrelated relatives, Jr./Sr. homonyms) are strictly separated from primary debtor accounts under FDCPA §805(b).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-2.5 px-4 rounded-xl border border-white/10 text-xs font-mono">
            <Scale className="w-4 h-4 text-rose-300" />
            <div>
              <span className="text-[10px] text-slate-300 block">Quarantine Guardrail</span>
              <span className="font-bold text-white">
                {stats.activeBlocks === 0 ? '100% Cleared / Reconciled' : `${stats.activeBlocks} Pending Review`}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Statistics Filter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div
            onClick={() => {
              setSelectedSeverity('ALL');
              setSelectedStatus('ALL');
            }}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedSeverity === 'ALL' && selectedStatus === 'ALL'
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Total Flagged</span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.total}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Evaluated flags</span>
          </div>

          {/* Critical Blockers */}
          <div
            onClick={() => setSelectedSeverity('CRITICAL_BLOCKER')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedSeverity === 'CRITICAL_BLOCKER'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-rose-700 block">Critical</span>
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.critical}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Deceased / Age Blocker</span>
          </div>

          {/* High Risk */}
          <div
            onClick={() => setSelectedSeverity('HIGH_RISK')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedSeverity === 'HIGH_RISK'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-700 block">High Risk</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.high}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Name Collision Risk</span>
          </div>

          {/* Medium Discrepancy */}
          <div
            onClick={() => setSelectedSeverity('MEDIUM_DISCREPANCY')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedSeverity === 'MEDIUM_DISCREPANCY'
                ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-indigo-300'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase text-indigo-700 block">Medium</span>
            <span className="text-xl font-bold font-mono mt-0.5 block">{stats.medium}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Entity / Asset Shield</span>
          </div>

          {/* Active Pending Blocks */}
          <div
            onClick={() => setSelectedStatus('ACTIVE_BLOCK')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedStatus === 'ACTIVE_BLOCK'
                ? 'bg-rose-900 text-white border-rose-900 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-rose-400'
            }`}
          >
            <span className="text-[10px] font-mono font-bold uppercase text-rose-700 block">Active Blocks</span>
            <span className="text-xl font-bold font-mono mt-0.5 block text-rose-600">{stats.activeBlocks}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Requires audit clearance</span>
          </div>

          {/* Reconciled / Cleared */}
          <div
            onClick={() => setSelectedStatus('RECONCILED')}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedStatus === 'RECONCILED'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 block">Reconciled</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="text-xl font-bold font-mono mt-0.5 block text-emerald-700">{stats.reconciled}</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Exonerated & Audited</span>
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
                placeholder="Search contradiction title, finding, candidate, certificate..."
                className="w-full pl-9.5 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
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

            {/* Severity and Status Filter Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 pl-2 pr-1">
                  Severity:
                </span>
                {(['ALL', 'CRITICAL_BLOCKER', 'HIGH_RISK', 'MEDIUM_DISCREPANCY'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedSeverity === sev
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sev === 'ALL'
                      ? 'All'
                      : sev === 'CRITICAL_BLOCKER'
                      ? 'Critical'
                      : sev === 'HIGH_RISK'
                      ? 'High'
                      : 'Medium'}
                  </button>
                ))}
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 pl-2 pr-1">
                  Status:
                </span>
                {(['ALL', 'ACTIVE_BLOCK', 'RECONCILED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedStatus === st
                        ? 'bg-white text-slate-900 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st === 'ACTIVE_BLOCK' ? 'Active Blocks' : 'Reconciled'}
                  </button>
                ))}
              </div>

              {/* Reset Filters */}
              {(selectedSeverity !== 'ALL' || selectedStatus !== 'ALL' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSeverity('ALL');
                    setSelectedStatus('ALL');
                    setSearchQuery('');
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. Contradiction & Discrepancy Ledger Table / Cards */}
        {filteredContradictions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No contradictions match the active filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All active candidate records for this portfolio are reconciled or do not match your current search criteria.
            </p>
            <button
              onClick={() => {
                setSelectedSeverity('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContradictions.map((item) => {
              const isCritical = item.severity === 'CRITICAL_BLOCKER';
              const isHigh = item.severity === 'HIGH_RISK';

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    item.isReconciled
                      ? 'border-emerald-200 hover:border-emerald-300'
                      : isCritical
                      ? 'border-rose-300 shadow-xs hover:border-rose-400'
                      : isHigh
                      ? 'border-amber-300 shadow-xs hover:border-amber-400'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar Header */}
                  <div
                    className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 ${
                      item.isReconciled
                        ? 'bg-emerald-50/60 border-emerald-100'
                        : isCritical
                        ? 'bg-rose-50/70 border-rose-100'
                        : isHigh
                        ? 'bg-amber-50/70 border-amber-100'
                        : 'bg-slate-50/80 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                          item.isReconciled
                            ? 'bg-emerald-600 text-white'
                            : isCritical
                            ? 'bg-rose-600 text-white'
                            : isHigh
                            ? 'bg-amber-500 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {item.isReconciled ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCritical ? (
                          <XCircle className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{item.title}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                              item.severity === 'CRITICAL_BLOCKER'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : item.severity === 'HIGH_RISK'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                            }`}
                          >
                            {item.severity.replace('_', ' ')}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Evaluated on candidate:</span>
                          <span className="font-semibold text-slate-800">{item.candidateName}</span>
                          <IdentityBandBadge band={item.candidateBand} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Status Pill & Action Buttons */}
                    <div className="flex items-center gap-2.5">
                      {item.isReconciled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Reconciled & Exonerated</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                          <span>Quarantine / Contact Blocked</span>
                        </span>
                      )}

                      <button
                        onClick={() => handleOpenReconcile(item)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
                      >
                        {item.isReconciled ? 'Review Audit' : 'Reconcile Discrepancy'}
                      </button>

                      <button
                        onClick={() => setSelectedContraForDrawer(item)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Inspect Provenance Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Finding & Impact */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 space-y-2">
                        <div className="text-[11px] font-mono uppercase font-bold text-slate-500">
                          Discrepancy Finding
                        </div>
                        <p className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {item.finding}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="text-[11px] font-mono uppercase font-bold text-slate-500">
                          Statutory Provenance
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
                          <div className="text-[10px] text-slate-500">Repository</div>
                          <div className="font-bold text-slate-900 truncate">{item.provenance.sourceName}</div>
                          <div className="text-[10px] text-indigo-700 font-semibold truncate">
                            {item.provenance.statutoryCitation}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Cert: {item.provenance.certificateId}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reconciliation Note & Resolution Banner */}
                    <div
                      className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                        item.isReconciled
                          ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                          : 'bg-amber-50/50 border-amber-200 text-amber-950'
                      }`}
                    >
                      <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-0.5 flex-1">
                        <span className="font-bold">Reconciliation Mandate:</span>
                        <p className="text-slate-700 leading-normal">{item.reconciliationNote}</p>
                        {item.reconciliationAudit && (
                          <div className="pt-1.5 mt-1.5 border-t border-emerald-200/60 flex flex-wrap items-center gap-3 font-mono text-[10px] text-emerald-800">
                            <span>Officer: {item.reconciliationAudit.operatorName}</span>
                            <span>•</span>
                            <span>Audit Date: {item.reconciliationAudit.resolvedDate}</span>
                            <span>•</span>
                            <span className="font-bold">STATUS: {item.reconciliationAudit.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reconcile Action Modal */}
      {isReconcileModalOpen && contraToReconcile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Scale className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Reconcile Compliance Discrepancy</h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {contraToReconcile.id} • {contraToReconcile.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsReconcileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-mono text-[10px] uppercase font-bold text-slate-500">
                  Target Finding
                </span>
                <p className="text-slate-800 font-medium">{contraToReconcile.finding}</p>
              </div>

              {/* Action Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">Compliance Audit Decision</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setReconcileAction('CLEARED_AUTHORIZED')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      reconcileAction === 'CLEARED_AUTHORIZED'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Exonerate & Clear</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Finding verified as unrelated or non-liable. Authorize normal collections.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReconcileAction('MAINTAIN_BLOCK')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      reconcileAction === 'MAINTAIN_BLOCK'
                        ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Maintain Quarantine</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Block all outbound communication to this entity/number under FDCPA §805.
                    </p>
                  </button>
                </div>
              </div>

              {/* Operator Reconciliation Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 block">
                  Statutory Justification & Officer Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reconcileNotes}
                  onChange={(e) => setReconcileNotes(e.target.value)}
                  placeholder="State the statutory basis (e.g. SSA DMF verified distinct SSN last-4, personal guaranty rider attached)..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsReconcileModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReconcile}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save Audit Decision</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Detailed Provenance Certificate */}
      {selectedContraForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Provenance Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedContraForDrawer(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Certificate Token</span>
                <div className="text-xs font-bold text-slate-900 break-all">
                  {selectedContraForDrawer.provenance.certificateId}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-800">Source Repository</div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  {selectedContraForDrawer.provenance.sourceName} ({selectedContraForDrawer.provenance.sourceType})
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-800">Statutory Purpose & Citation</div>
                <div className="p-2.5 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-200">
                  {selectedContraForDrawer.provenance.statutoryCitation}
                  <div className="text-[10px] text-indigo-700 mt-1">
                    Permissible Purpose: {selectedContraForDrawer.provenance.permissiblePurpose}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-800">Ingest Telemetry</div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-slate-600 text-[11px]">
                  <div>Method: {selectedContraForDrawer.provenance.ingestMethod}</div>
                  <div>Timestamp: {selectedContraForDrawer.provenance.ingestTimestamp}</div>
                  <div>Freshness: {selectedContraForDrawer.provenance.dataFreshnessDays ?? 0} days old</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={() => setSelectedContraForDrawer(null)}
                  className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl text-xs"
                >
                  Close Inspector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
