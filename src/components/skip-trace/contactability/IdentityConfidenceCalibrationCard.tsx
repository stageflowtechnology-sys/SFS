import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Fingerprint,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Info,
  Scale,
  Lock,
} from 'lucide-react';
import { IdentityConfidenceCalibration } from '../../../types/contactability';
import { IdentityBand } from '../../../types/skipTrace';
import { IdentityBandBadge } from '../IdentityBandBadge';

interface IdentityConfidenceCalibrationCardProps {
  calibration: IdentityConfidenceCalibration;
  accountName: string;
  accountNumber: string;
  onSelectAccount?: (accId: string) => void;
  currentAccountId: string;
}

export const IdentityConfidenceCalibrationCard: React.FC<IdentityConfidenceCalibrationCardProps> = ({
  calibration,
  accountName,
  accountNumber,
  onSelectAccount,
  currentAccountId,
}) => {
  const isMatch = calibration.band === 'MATCH';
  const isProbable = calibration.band === 'PROBABLE';
  const isPossible = calibration.band === 'POSSIBLE';
  const isInsufficient = calibration.band === 'INSUFFICIENT';
  const isContradicted = calibration.band === 'CONTRADICTED';

  const getScoreColor = (score: number, band: IdentityBand) => {
    if (band === 'MATCH' && score >= 90) return 'text-emerald-700 bg-emerald-50 border-emerald-300';
    if (band === 'PROBABLE' || (score >= 70 && score < 90)) return 'text-blue-700 bg-blue-50 border-blue-300';
    if (band === 'POSSIBLE' || (score >= 40 && score < 70)) return 'text-amber-700 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Top Banner with Account Quick Switcher & Identity Band */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs">
            <Fingerprint className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Identity Calibration & Confidence Engine
              </span>
              <IdentityBandBadge band={calibration.band} />
              {isProbable && (
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                  <Info className="w-3 h-3" />
                  <span>Potential — Unverified</span>
                </span>
              )}
              {isPossible && (
                <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3 text-amber-700" />
                  <span>CONFIDENCE CAP ENFORCED (POSSIBLE)</span>
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
              Identity Confidence: {calibration.overallScore}% ({calibration.statusLabel})
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Subject: <strong>{accountName}</strong> • Account: <span className="font-mono">{accountNumber}</span>
            </p>
          </div>
        </div>

        {/* Multi-Account Simulation Switcher */}
        {onSelectAccount && (
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs shrink-0">
            <span className="font-mono text-[10px] text-slate-500 uppercase px-1 font-semibold">
              Scenario:
            </span>
            <button
              onClick={() => onSelectAccount('skip-acc-101')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                currentAccountId === 'skip-acc-101'
                  ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              M. Vance (MATCH 96%)
            </button>
            <button
              onClick={() => onSelectAccount('skip-acc-102')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                currentAccountId === 'skip-acc-102'
                  ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              E. Rostova (PROBABLE 78%)
            </button>
            <button
              onClick={() => onSelectAccount('skip-acc-103')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                currentAccountId === 'skip-acc-103'
                  ? 'bg-amber-600 text-white shadow-2xs font-semibold'
                  : 'text-slate-700 hover:bg-white'
              }`}
            >
              D. Chen (POSSIBLE 42% Capped)
            </button>
          </div>
        )}
      </div>

      {/* Critical Statutory Guardrail Notice (Strictly respects rules) */}
      <div
        className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-3 ${
          isPossible
            ? 'bg-amber-50/90 border-amber-300 text-amber-900'
            : isProbable
            ? 'bg-blue-50/90 border-blue-200 text-blue-950'
            : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isPossible ? (
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          ) : isProbable ? (
            <Info className="w-4 h-4 text-blue-700" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          )}
        </div>
        <div className="space-y-1">
          <div className="font-bold flex items-center gap-2">
            <span>
              {isPossible
                ? 'STATUTORY RULE: Unconfirmed Identity / Possible Collision Guardrail'
                : isProbable
                ? 'COMPLIANCE NOTICE: Probable Match (Potential — Unverified)'
                : 'VERIFIED RECONCILIATION: Identity Triangulated & Confirmed'}
            </span>
            <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-white/70 border border-current font-semibold">
              FCRA §607(b) Standard
            </span>
          </div>
          <p>{calibration.guardrailExplanation}</p>
          {isPossible && (
            <p className="font-semibold text-amber-800 text-[11px] pt-1 border-t border-amber-200/60">
              * Mandatory Constraint Active: Channels belonging to a POSSIBLE candidate CANNOT receive HIGH confidence under any circumstance. All reachability weights are clamped.
            </p>
          )}
        </div>
      </div>

      {/* Concordance Grid Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* SSN Concordance */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">SSN Concordance</span>
            {calibration.ssnConcordance.status === 'EXACT_LAST4' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3 h-3" /> Exact Last 4
              </span>
            ) : calibration.ssnConcordance.status === 'PARTIAL' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                <HelpCircle className="w-3 h-3" /> Partial Match
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700">
                <XCircle className="w-3 h-3" /> Mismatch / Disputed
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="font-mono text-sm font-bold text-slate-900">
              {calibration.ssnConcordance.maskedSsn}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Signal Weight: {calibration.ssnConcordance.score}%
            </div>
          </div>
        </div>

        {/* DOB Concordance */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">DOB Concordance</span>
            {calibration.dobConcordance.status === 'EXACT' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3 h-3" /> Exact Match
              </span>
            ) : calibration.dobConcordance.status === 'APPROXIMATE' ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700">
                <HelpCircle className="w-3 h-3" /> Approximate
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700">
                <XCircle className="w-3 h-3" /> Distinct DOB Flag
              </span>
            )}
          </div>
          <div className="mt-2">
            <div className="font-mono text-sm font-bold text-slate-900">
              {calibration.dobConcordance.maskedDob}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Signal Weight: {calibration.dobConcordance.score}%
            </div>
          </div>
        </div>

        {/* Name / Alias Concordance */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Name Concordance</span>
            <span className="text-[10px] font-mono font-bold text-slate-700">
              {calibration.nameConcordance.score}% Match
            </span>
          </div>
          <div className="mt-2">
            <div className="text-xs font-bold text-slate-900 truncate">
              {calibration.nameConcordance.matchedName}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Type: {calibration.nameConcordance.concordanceType.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Triangulation Corroboration Count */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">Corroborating Evidence</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700">
              <Sparkles className="w-3 h-3" /> {calibration.corroboratingSignalsCount} Sources
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900">
                {calibration.corroboratingSignalsCount} Verified / {calibration.discrepanciesCount} Discrepancies
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {calibration.discrepanciesCount > 0 ? 'Review flagged discrepancies' : 'Clean audit trail'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
