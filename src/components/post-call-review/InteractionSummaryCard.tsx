/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PostCallReviewRecord } from '../../types/postCallReview';
import {
  FileText,
  DollarSign,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  Send,
  Zap,
  Activity,
  UserCheck,
  Building2,
  PhoneCall,
  GitBranch,
} from 'lucide-react';

interface InteractionSummaryCardProps {
  review: PostCallReviewRecord;
  onJumpToTimestamp?: (time: string) => void;
}

export const InteractionSummaryCard: React.FC<InteractionSummaryCardProps> = ({
  review,
  onJumpToTimestamp,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ptp_plan' | 'milestones' | 'stage_gate'>('overview');

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div
      id="interaction-summary-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-0"
    >
      {/* Card Header & Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-2xs">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Interaction Summary & Recovery Assessment
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Audited Interaction
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              Call Ref: {review.callId} • {review.callDateTime} • Duration: {Math.floor(review.durationSeconds / 60)}m {review.durationSeconds % 60}s
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 border border-slate-300/60 text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-indigo-900 font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            Core Summary
          </button>
          <button
            onClick={() => setActiveTab('ptp_plan')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'ptp_plan'
                ? 'bg-white text-indigo-900 font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <span>PTP Breakdown</span>
            {review.ptpInformation.hasPtp && (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('milestones')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'milestones'
                ? 'bg-white text-indigo-900 font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            Call Milestones ({review.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab('stage_gate')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'stage_gate'
                ? 'bg-white text-indigo-900 font-bold shadow-2xs'
                : 'hover:text-slate-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Stage Gate Checklist</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="p-6 space-y-6">
        {/* Tab 1: CORE SUMMARY */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 1. Executive Summary Prose */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Interaction Synthesis
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Collector: {review.collectorName} ({review.collectorId})
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed">
                {review.summary}
              </p>
            </div>

            {/* 2. Key Summary KPI Badges (Disposition, Collection Outcome, Sentiment) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Disposition */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="uppercase font-semibold">1. Call Disposition</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                    {review.disposition.code}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900 leading-snug">
                  {review.disposition.label}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {review.disposition.description}
                </p>
              </div>

              {/* Collection Outcome */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-800">
                  <span className="uppercase font-semibold">2. Collection Outcome</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-bold">
                    {review.collectionOutcome.outcomeType}
                  </span>
                </div>
                <div className="text-sm font-bold text-emerald-950 flex items-center justify-between">
                  <span>{review.collectionOutcome.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-emerald-900 pt-1 border-t border-emerald-200/60">
                  <span>Committed Recovery:</span>
                  <span className="font-bold text-sm text-emerald-900">
                    {formatCurrency(review.collectionOutcome.amountRecoveredPromise)}
                  </span>
                </div>
                {review.collectionOutcome.feeConcessionGranted > 0 && (
                  <div className="text-[10px] font-mono text-emerald-700 flex justify-between">
                    <span>Fee Concession Authorized:</span>
                    <span className="font-semibold">{formatCurrency(review.collectionOutcome.feeConcessionGranted)}</span>
                  </div>
                )}
              </div>

              {/* Sentiment & Acoustic Tone */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span className="uppercase font-semibold">3. Acoustic Sentiment</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {review.sentiment.trend}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-slate-700 flex items-center justify-between">
                    <span className="text-slate-500">Initial State:</span>
                    <span className="font-semibold font-mono text-slate-800 text-[11px]">{review.sentiment.initialState}</span>
                  </div>
                  <div className="text-xs text-slate-700 flex items-center justify-between">
                    <span className="text-slate-500">Final State:</span>
                    <span className="font-semibold font-mono text-emerald-700 text-[11px]">{review.sentiment.finalState}</span>
                  </div>
                </div>

                {/* Score meters */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div>
                    <span className="text-slate-500 block">Debtor Cooperation</span>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${review.sentiment.debtorCooperationScore}%` }}
                      />
                    </div>
                    <span className="text-slate-800 font-bold mt-0.5 block">{review.sentiment.debtorCooperationScore}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Agent Empathy</span>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${review.sentiment.agentEmpathyScore}%` }}
                      />
                    </div>
                    <span className="text-slate-800 font-bold mt-0.5 block">{review.sentiment.agentEmpathyScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Non-Payment Reason & Root Cause Analysis */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <h3 className="text-xs font-bold text-amber-950 uppercase font-mono tracking-wider">
                    Primary Non-Payment Reason & Hardship Root Cause
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {review.nonPaymentReason.primaryCategory}
                </span>
              </div>

              <p className="text-xs text-amber-950 font-medium leading-relaxed">
                {review.nonPaymentReason.rootCauseSummary}
              </p>

              {/* Debtor Quotes */}
              <div className="space-y-1.5 pt-2 border-t border-amber-200/60">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-800 block">
                  Verbatim Debtor Disclosures:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {review.nonPaymentReason.supportingDebtorStatements.map((stmt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-white/80 border border-amber-200/80 text-[11px] italic text-slate-800"
                    >
                      {stmt}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mitigating Factors */}
              <div className="pt-2 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800">
                  Mitigating Factors:
                </span>
                {review.nonPaymentReason.mitigatingFactors.map((fact, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-amber-200 text-[11px] text-amber-900 font-medium"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{fact}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Three Actionable Recommendation Tiles (Follow-Up, Next Action, Stage) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Recommended Follow-Up */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="uppercase font-semibold flex items-center gap-1.5 text-indigo-700">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      Recommended Follow-Up
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {review.recommendedFollowUp.actionTitle}
                  </div>
                  <div className="mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Date:</span>
                      <span className="font-bold text-slate-900">
                        {review.recommendedFollowUp.followUpDate} ({review.recommendedFollowUp.followUpTime})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Channel:</span>
                      <span className="font-bold text-indigo-700">{review.recommendedFollowUp.channelLabel}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {review.recommendedFollowUp.instructions}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>{review.recommendedFollowUp.complianceNotice}</span>
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                    <span className="uppercase font-semibold flex items-center gap-1.5 text-indigo-700">
                      <Zap className="w-3.5 h-3.5 text-indigo-600" />
                      Recommended Next Action
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-800 font-bold text-[10px] border border-rose-200">
                      {review.recommendedNextAction.priority} PRIORITY
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    {review.recommendedNextAction.actionTitle}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {review.recommendedNextAction.description}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span>Target Gateway:</span>
                  <span className="font-bold text-slate-800 truncate">{review.recommendedNextAction.targetSystem}</span>
                </div>
              </div>

              {/* Recommended Stage Transition */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-indigo-900">
                    <span className="uppercase font-semibold flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                      Recommended Stage
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-900 font-bold text-[10px]">
                      Deterministic Gate
                    </span>
                  </div>

                  {/* Stage Transition Visual */}
                  <div className="mt-2 p-2.5 rounded-lg bg-white border border-indigo-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-500 text-[11px]">Current:</span>
                      <span className="font-bold text-slate-700">{review.recommendedStage.currentStageName}</span>
                    </div>
                    <div className="flex justify-center text-indigo-600">
                      <ArrowRight className="w-4 h-4 rotate-90 sm:rotate-0" />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-emerald-600 text-[11px]">Target:</span>
                      <span className="font-bold text-emerald-800">{review.recommendedStage.recommendedStageName}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    {review.recommendedStage.transitionRationale}
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('stage_gate')}
                  className="text-xs font-bold font-mono text-indigo-700 hover:text-indigo-900 flex items-center justify-between pt-2 border-t border-indigo-200"
                >
                  <span>View 4-Point Stage Gate Rules</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PTP BREAKDOWN PLAN */}
        {activeTab === 'ptp_plan' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {review.ptpInformation.hasPtp ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div>
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 block">
                      Active Payment Plan Authorization
                    </span>
                    <div className="text-lg font-bold text-emerald-950 mt-0.5">
                      {formatCurrency(review.ptpInformation.promisedAmount)} Initial Payment • {review.ptpInformation.paymentRail}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-emerald-900">
                    <div>First Debit Date: <strong>{review.ptpInformation.firstPaymentDate}</strong></div>
                    <div>Token: <span className="text-emerald-700">{review.ptpInformation.preAuthorizedDebitToken}</span></div>
                  </div>
                </div>

                {/* Installment Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-mono text-xs font-bold text-slate-700 flex justify-between items-center">
                    <span>Structured Repayment Installment Schedule</span>
                    <span className="text-indigo-600">{review.ptpInformation.paymentSchedule.length} Installments</span>
                  </div>

                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 text-slate-600 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="px-4 py-2.5">Installment #</th>
                        <th className="px-4 py-2.5">Due Date</th>
                        <th className="px-4 py-2.5">Committed Amount</th>
                        <th className="px-4 py-2.5">Payment Instrument</th>
                        <th className="px-4 py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {review.ptpInformation.paymentSchedule.map((inst) => (
                        <tr key={inst.installmentNumber} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-900">
                            Installment {inst.installmentNumber}
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            {inst.dueDate}
                          </td>
                          <td className="px-4 py-3 font-bold text-emerald-700">
                            {formatCurrency(inst.amount)}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {inst.rail}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                inst.status === 'SCHEDULED_LOCKED'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {inst.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Authorized Fee Waiver Details */}
                {review.ptpInformation.feeWaiverApproved && (
                  <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <span className="font-bold text-indigo-950 block">
                        Conditional Fee Abatement Authorized ({formatCurrency(review.ptpInformation.feeWaiverAmount)})
                      </span>
                      <p className="text-indigo-900 leading-relaxed">
                        Late fee and interest concessions of {formatCurrency(review.ptpInformation.feeWaiverAmount)} will be applied directly to the account balance once Installment 1 clears successfully on {review.ptpInformation.firstPaymentDate}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 space-y-2">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No Promise-to-Pay Scheduled for this Interaction</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  This interaction concluded as a dispute investigation or hardship inquiry without a fixed payment commitment.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: CALL MILESTONES */}
        {activeTab === 'milestones' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="space-y-3">
              {review.milestones.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-start justify-between gap-4 shadow-2xs"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onJumpToTimestamp?.(m.time)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-xs font-bold border border-indigo-200 shrink-0 flex items-center gap-1 transition-colors"
                      title="Jump to audio timestamp"
                    >
                      <Clock className="w-3 h-3" />
                      <span>{m.time}</span>
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                        <span className="text-[10px] font-mono text-slate-400">• {m.speaker}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: STAGE GATE CHECKLIST */}
        {activeTab === 'stage_gate' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-800">Stage Gate Validation Matrix</span>
                <span className="text-indigo-700">{review.recommendedStage.currentStageName} → {review.recommendedStage.recommendedStageName}</span>
              </div>
              <p className="text-xs text-slate-600">
                Deterministic governance requires all four statutory criteria to pass prior to executing pipeline progression in the core database.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {review.recommendedStage.gateChecklist.map((gate, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 ${
                    gate.satisfied
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {gate.satisfied ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        {gate.check}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Evidence Citation: {gate.evidenceRef}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                      gate.satisfied
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border border-rose-300'
                    }`}
                  >
                    {gate.satisfied ? 'PASSED' : 'DEFICIENT'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
