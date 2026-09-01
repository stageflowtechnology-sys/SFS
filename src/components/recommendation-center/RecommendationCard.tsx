/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RecommendationItem } from '../../types/recommendationCenter';
import { formatPHP } from '../../services/philippineCollections';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Hash,
  RefreshCw,
  Ban,
  Check,
  Building,
  CreditCard,
  Phone,
  Mail,
  ExternalLink,
  Layers,
  Activity,
  AlertOctagon,
  Scale,
  UserCheck,
} from 'lucide-react';

interface RecommendationCardProps {
  item: RecommendationItem;
  onOpenConfirm: (item: RecommendationItem) => void;
  onOpenReject: (item: RecommendationItem) => void;
  onOpenEvidence: (item: RecommendationItem) => void;
  onOpenReceipt: (item: RecommendationItem) => void;
  onRetryExecution?: (item: RecommendationItem) => void;
  onAcknowledgeAdvisory?: (id: string) => void;
  roleView: 'COLLECTOR' | 'MANAGER';
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  onOpenConfirm,
  onOpenReject,
  onOpenEvidence,
  onOpenReceipt,
  onRetryExecution,
  onAcknowledgeAdvisory,
  roleView,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const formatCurrency = (val: number) => formatPHP(val);

  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">CRITICAL RISK</span>;
      case 'HIGH_RISK':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">HIGH RISK</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">MODERATE RISK</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">LOW RISK</span>;
    }
  };

  const getSectionBadge = (section: string) => {
    switch (section) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>PENDING HUMAN REVIEW</span>
          </span>
        );
      case 'ADVISORY':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-300 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI STRATEGIC ADVISORY</span>
          </span>
        );
      case 'EXECUTED_VERIFIED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>EXECUTED & VERIFIED</span>
          </span>
        );
      case 'EXECUTION_FAILED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>EXECUTION FAILED</span>
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 shadow-2xs">
            <Ban className="w-3.5 h-3.5 text-slate-600" />
            <span>DISMISSED / REJECTED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const getPipelineSteps = () => {
    let currentStep = 1; // 1: AI Rec, 2: Human Review, 3: Confirmation, 4: System Execution, 5: Verification
    if (item.section === 'PENDING') currentStep = 2;
    if (item.section === 'EXECUTED_VERIFIED') currentStep = 5;
    if (item.section === 'EXECUTION_FAILED') currentStep = 4;
    if (item.section === 'REJECTED') currentStep = 2;

    const steps = [
      { name: 'AI Recommendation', step: 1 },
      { name: 'Human Review', step: 2 },
      { name: 'Confirmation', step: 3 },
      { name: 'System Execution', step: 4 },
      { name: 'Verification', step: 5 },
    ];

    return (
      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-slate-600">Governed Execution Pipeline (Human-in-the-Loop):</span>
          <span className="text-indigo-600 font-bold">Never Automatic</span>
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((s, idx) => {
            const isCompleted = s.step < currentStep || (s.step === 5 && item.section === 'EXECUTED_VERIFIED');
            const isCurrent = s.step === currentStep && item.section !== 'EXECUTED_VERIFIED';
            return (
              <React.Fragment key={s.step}>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono whitespace-nowrap transition-colors ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                      : isCurrent
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3 h-3 text-emerald-700" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold">
                      {s.step}
                    </span>
                  )}
                  <span>{s.name}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const handleRetryClick = () => {
    if (onRetryExecution) {
      setIsRetrying(true);
      setTimeout(() => {
        setIsRetrying(false);
        onRetryExecution(item);
      }, 1000);
    }
  };

  const recommendation = item.recommendationText || item.detailedAction || item.title;
  const reason = item.reason || item.operationalImpact || item.summary;
  const requiredHumanAction = item.requiredHumanAction || 'Tele-Collector / Team Lead must review evidence, confirm agreement terms with borrower, and authorize ledger mutation.';
  const policyCheck = item.policyCheck || {
    framework: 'BSP Circular 454 & SEC MC-18',
    ruleName: 'Fair Debt Collection Practices & Truthful Balance Presentation',
    status: 'PASSED',
    notes: 'No unverified third-party disclosures or unauthorized term guarantees detected.',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Top Banner / Card Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Section Badge & Action Type */}
        <div className="flex flex-wrap items-center gap-2">
          {getSectionBadge(item.section)}
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700 uppercase">
            {item.actionType.replace(/_/g, ' ')}
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            ID: {item.id}
          </span>
        </div>

        {/* Right: Confidence Score & Created Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{item.createdTime.relativeTime}</span>
          </div>

          <button
            onClick={() => onOpenEvidence(item)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-mono text-xs font-bold transition-colors cursor-pointer"
            title="Inspect grounding confidence breakdown"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{item.confidence.score}% Confidence</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
            title={isExpanded ? 'Collapse Card' : 'Expand Card'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Row 1: Account & Customer Information Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/70">
          {/* Customer Metadata */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" /> Borrower Profile
              </span>
              {getRiskBadge(item.customer.riskTier)}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-slate-900 text-sm">{item.customer.name}</span>
              <span className="font-mono text-xs text-slate-500">({item.customer.id})</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-600 pt-0.5">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" /> {item.customer.phone}
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" /> {item.customer.email}
              </span>
            </div>
          </div>

          {/* Account Financial Telemetry */}
          <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 pt-2 md:pt-0 md:pl-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Building className="w-3 h-3 text-slate-400" /> Endorsed Portfolio
              </span>
              <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                {item.account.daysPastDue} DPD
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatCurrency(item.account.totalBalance)}
              </span>
              <span className="font-mono text-xs text-slate-500">
                {item.account.accountNumber}
              </span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] text-slate-600 pt-0.5">
              <span>{item.account.creditor}</span>
              <span className="text-slate-400 text-[10px]">{item.account.portfolio}</span>
            </div>
          </div>
        </div>

        {/* Governed Execution Pipeline Stepper */}
        {getPipelineSteps()}

        {/* 7-Field AI Recommendation Structured Format */}
        <div className="space-y-3 p-4 rounded-xl border border-indigo-100 bg-indigo-50/30">
          <div className="flex items-center justify-between border-b border-indigo-100/80 pb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase font-mono tracking-wider text-indigo-900">
                Structured AI Recommendation Format
              </span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-700 font-bold">
              Human Action Required
            </span>
          </div>

          {/* 1. Recommendation */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" /> 1. Recommendation:
            </span>
            <div className="p-2.5 rounded-lg bg-white border border-indigo-200 text-xs font-bold text-slate-900 leading-relaxed shadow-2xs">
              {recommendation}
            </div>
          </div>

          {/* 2. Reason */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" /> 2. Reason:
            </span>
            <p className="text-xs text-slate-700 leading-relaxed pl-2.5">
              {reason}
            </p>
          </div>

          {/* 3. Evidence */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <FileText className="w-3 h-3 text-indigo-500" /> 3. Evidence ({item.evidence.type.replace(/_/g, ' ')}):
              </span>
              <button
                onClick={() => onOpenEvidence(item)}
                className="text-[10px] font-mono text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Transcript / Source Grounding</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
            <blockquote className="italic text-slate-800 text-xs leading-relaxed border-l-2 border-indigo-400 pl-3 py-1 font-serif bg-white rounded-r-lg p-2 border border-slate-200">
              &ldquo;{item.evidence.directCitation}&rdquo;
            </blockquote>
            <div className="text-[10px] font-mono text-slate-500 pl-2.5">
              Ref: {item.evidence.timestampOrRef} • {item.evidence.groundingExplanation}
            </div>
          </div>

          {/* 4. Confidence */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> 4. Confidence:
            </span>
            <div className="flex items-center gap-2 pl-2.5">
              <div className="w-32 bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${item.confidence.score}%` }}
                />
              </div>
              <span className="font-mono text-xs font-bold text-indigo-900">{item.confidence.score}%</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-semibold">
                Tier: {item.confidence.tier} ({item.confidence.calibrationModel})
              </span>
            </div>
          </div>

          {/* 5. Required Human Action */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-amber-600" /> 5. Required Human Action:
            </span>
            <div className="p-2 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 font-mono leading-relaxed">
              {requiredHumanAction}
            </div>
          </div>

          {/* 6. Policy Check */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              <Scale className="w-3 h-3 text-emerald-600" /> 6. Policy Check:
            </span>
            <div className="p-2 rounded-lg bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-2 text-xs font-mono text-emerald-950">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{policyCheck.framework}:</strong> {policyCheck.ruleName}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] shrink-0">
                {policyCheck.status}
              </span>
            </div>
          </div>

          {/* 7. Execution Status */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
              <Activity className="w-3 h-3 text-slate-500" /> 7. Execution Status:
            </span>
            <div className="pl-2.5 text-xs font-mono text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>
                <strong>Current State:</strong> {item.section.replace(/_/g, ' ')} — Awaiting human review & explicit operator authorization before ledger commit.
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Deep Details */}
        {isExpanded && (
          <div className="space-y-5 pt-2 border-t border-slate-100 animate-in fade-in duration-150">
            {/* Current State vs Expected State Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Current State */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Current Ledger State
                </span>
                <div className="text-xs font-bold text-slate-800">
                  {item.currentState.label}
                </div>
                <p className="text-[11px] text-slate-600">
                  {item.currentState.description}
                </p>
                <div className="space-y-1 pt-2 border-t border-slate-200 font-mono text-[11px]">
                  {item.currentState.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-slate-600">
                      <span>{m.key}:</span>
                      <span className="font-semibold text-slate-800">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected State */}
              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                  Expected State (Post-Confirmation Target)
                </span>
                <div className="text-xs font-bold text-emerald-950">
                  {item.expectedState.label}
                </div>
                <p className="text-[11px] text-emerald-900/80">
                  {item.expectedState.description}
                </p>
                <div className="space-y-1 pt-2 border-t border-emerald-200/60 font-mono text-[11px]">
                  {item.expectedState.metrics.map((m, idx) => (
                    <div key={idx} className="flex justify-between text-emerald-900">
                      <span>{m.key}:</span>
                      <span className="font-bold text-emerald-950">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section Specific Diagnostics / Receipts */}
            {/* A. Executed & Verified Result Display */}
            {item.section === 'EXECUTED_VERIFIED' && item.verificationResult && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Execution Output & Bank Ledger Confirmation</span>
                  </div>
                  <button
                    onClick={() => onOpenReceipt(item)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold transition-colors cursor-pointer"
                  >
                    <Hash className="w-3 h-3" />
                    <span>View Cryptographic Receipt</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-white/80 rounded border border-emerald-200 text-emerald-950">
                    <span className="text-slate-400 block text-[10px]">Verification Hash:</span>
                    <span className="font-bold truncate block">{item.verificationResult.receiptHash}</span>
                  </div>
                  <div className="p-2 bg-white/80 rounded border border-emerald-200 text-emerald-950">
                    <span className="text-slate-400 block text-[10px]">Verifying Authority:</span>
                    <span className="font-bold">{item.verificationResult.verifiedBy}</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-emerald-900 pt-1">
                  <strong>Ledger Delta:</strong> {item.verificationResult.stateMutationDelta}
                </div>
              </div>
            )}

            {/* B. Execution Failed Diagnostic Display */}
            {item.section === 'EXECUTION_FAILED' && item.failureDetails && (
              <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/70 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 text-rose-950">
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs uppercase font-mono tracking-wider text-rose-900 block">
                        Execution Failure Diagnostic: {item.failureDetails.errorCode}
                      </span>
                      <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                        {item.failureDetails.errorMessage}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-200 text-rose-900 shrink-0">
                    {item.failureDetails.errorCategory}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-white rounded border border-rose-200 text-rose-950">
                    <span className="text-slate-400 block text-[10px]">Affected Subsystem:</span>
                    <span className="font-bold">{item.failureDetails.affectedSystem}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-rose-200 text-rose-950">
                    <span className="text-slate-400 block text-[10px]">Recommended Operational Remedy:</span>
                    <span className="font-bold">{item.failureDetails.recommendedRemedy}</span>
                  </div>
                </div>

                {item.failureDetails.canRetry && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleRetryClick}
                      disabled={isRetrying}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-mono text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Retrying Gateway...' : 'Retry Execution Rail'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* C. Rejected Audit Reason Display */}
            {item.section === 'REJECTED' && item.rejectionDetails && (
              <div className="p-4 rounded-xl border border-slate-300 bg-slate-100/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                    <Ban className="w-4 h-4 text-slate-600" />
                    <span>Logged Rejection Audit Record</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700">
                    {item.rejectionDetails.category}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {item.rejectionDetails.rejectionReason}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                  <span>Rejected By: {item.rejectionDetails.rejectedBy}</span>
                  <span>Timestamp: {item.rejectionDetails.rejectedAt}</span>
                </div>
              </div>
            )}

            {/* Actor & Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Generated / Authored By:</span>
                <span className="font-bold text-slate-800">
                  {item.actor.name} ({item.actor.id}) • {item.actor.role}
                </span>
              </div>
              <div>
                <span>Created: {item.createdTime.timestamp}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Controls Bar */}
        {item.section === 'PENDING' && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-600 font-mono">
              <span className="font-bold text-indigo-900">Operator Review Checkpoint:</span> AI recommendations require explicit human authorization before updating the bank ledger.
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenReject(item)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Dismiss / Reject</span>
              </button>

              <button
                onClick={() => onOpenConfirm(item)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Execute Mutation</span>
              </button>
            </div>
          </div>
        )}

        {item.section === 'ADVISORY' && onAcknowledgeAdvisory && (
          <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between gap-3">
            <span className="text-xs text-indigo-900 font-mono">
              Strategic guidance model active. No automated balance modification.
            </span>
            <button
              onClick={() => onAcknowledgeAdvisory(item.id)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Acknowledge Advisory</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

