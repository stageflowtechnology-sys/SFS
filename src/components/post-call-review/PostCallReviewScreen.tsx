/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_POST_CALL_REVIEWS } from '../../data/postCallReviewData';
import {
  PostCallReviewRecord,
  OperationalRecommendationItem,
  ExecutionStatus,
} from '../../types/postCallReview';
import { AudioPlaybackBar } from './AudioPlaybackBar';
import { InteractionSummaryCard } from './InteractionSummaryCard';
import { AiConfidenceAndEvidence } from './AiConfidenceAndEvidence';
import { OperationalRecommendationsList } from './OperationalRecommendationsList';
import {
  User,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  Clock,
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';

interface PostCallReviewScreenProps {
  onNavigateToWorkbench?: (accountId: string) => void;
  onNavigateToQueue?: () => void;
  currentOperatorId?: string;
}

export const PostCallReviewScreen: React.FC<PostCallReviewScreenProps> = ({
  onNavigateToWorkbench,
  onNavigateToQueue,
  currentOperatorId = 'OP-4821',
}) => {
  // Scenario Selection State
  const [selectedCallId, setSelectedCallId] = useState<string>(
    MOCK_POST_CALL_REVIEWS[0].callId
  );
  const activeReview =
    MOCK_POST_CALL_REVIEWS.find((r) => r.callId === selectedCallId) ||
    MOCK_POST_CALL_REVIEWS[0];

  // Local mutable state for recommendations so operator can accept, dismiss, and execute
  const [recommendations, setRecommendations] = useState<OperationalRecommendationItem[]>(
    activeReview.recommendations
  );

  // Audio Playback Simulation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSecond, setCurrentSecond] = useState<number>(18);
  const [activeEvidenceTimestamp, setActiveEvidenceTimestamp] = useState<string | null>(null);

  // Sync recommendations on scenario change
  useEffect(() => {
    setRecommendations(activeReview.recommendations);
    setCurrentSecond(18);
    setIsPlaying(false);
  }, [selectedCallId]);

  // Audio player interval
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSecond((prev) => {
          if (prev >= activeReview.durationSeconds) {
            setIsPlaying(false);
            return activeReview.durationSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeReview.durationSeconds]);

  const handleSeek = (secs: number) => {
    setCurrentSecond(Math.floor(secs));
  };

  const handleJumpToTimestamp = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0], 10);
      const secs = parseInt(parts[1], 10);
      const targetSec = mins * 60 + secs;
      setCurrentSecond(targetSec);
      setIsPlaying(true);
      setActiveEvidenceTimestamp(timeStr);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ExecutionStatus, options?: any) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          return {
            ...rec,
            status: newStatus,
            confirmedBy: options?.confirmedBy ?? rec.confirmedBy,
            confirmedAt: options?.confirmedAt ?? rec.confirmedAt,
            executedAt: options?.executedAt ?? rec.executedAt,
            executionReceiptHash: options?.executionReceiptHash ?? rec.executionReceiptHash,
            errorMessage: options?.errorMessage ?? (newStatus !== 'EXECUTION_FAILED' ? undefined : rec.errorMessage),
          };
        }
        return rec;
      })
    );
  };

  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div
      id="post-call-review-screen"
      className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto"
    >
      {/* 1. Top Account & Interaction Identity Strip */}
      <div className="bg-white border-b border-slate-200 shadow-2xs shrink-0 sticky top-0 z-20">
        {/* Top Advisory Banner */}
        <div className="bg-slate-900 text-slate-100 px-4 lg:px-8 py-1.5 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-indigo-600 text-white font-mono text-[10px] font-bold">
              QA
            </span>
            <span className="font-semibold text-white">
              Post-Call Interaction Review & Ledger Settlement Reconciliation
            </span>
            <span className="text-slate-400 text-[11px] hidden md:inline">
              • Deterministic Stage Transition & Regulatory Audit Verification
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-300">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Dual-Channel Audio Audited
            </span>
            <span>•</span>
            <span>CFPB Reg-F Certified</span>
          </div>
        </div>

        {/* Account Details & Scenario Selector */}
        <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Debtor Profile Chip */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                <User className="w-5 h-5 text-slate-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight">
                    {activeReview.debtorName}
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {activeReview.accountNumber}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {activeReview.channel} CALL
                  </span>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2 font-mono mt-0.5">
                  <span>Creditor: {activeReview.originalCreditor}</span>
                  <span>•</span>
                  <span>Collector: {activeReview.collectorName} ({activeReview.collectorId})</span>
                </div>
              </div>
            </div>

            {/* Authoritative Financial Telemetry */}
            <div className="hidden lg:flex items-center gap-4 border-l border-slate-200 pl-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                  Outstanding Balance
                </span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  {formatCurrency(activeReview.totalBalance)}
                </span>
              </div>

              <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
                <div>Principal: {formatCurrency(activeReview.principalBalance)}</div>
                <div>Accrued Fees: {formatCurrency(activeReview.accruedFees)}</div>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">
                  Delinquency Age
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {activeReview.daysPastDue} DPD
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Selector & Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Interaction Record:
              </span>
              <select
                value={selectedCallId}
                onChange={(e) => setSelectedCallId(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              >
                {MOCK_POST_CALL_REVIEWS.map((r) => (
                  <option key={r.callId} value={r.callId}>
                    {r.debtorName} ({r.callId} • {r.disposition.code})
                  </option>
                ))}
              </select>
            </div>

            {onNavigateToWorkbench && (
              <button
                onClick={() => onNavigateToWorkbench(activeReview.accountNumber)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
              >
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                <span>Open in Workbench</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Body Content Area */}
      <div className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Dual-Channel Audio Master Player */}
        <AudioPlaybackBar
          durationSeconds={activeReview.durationSeconds}
          currentSecond={currentSecond}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSeek={handleSeek}
          onJumpToTimestamp={handleJumpToTimestamp}
          activeEvidenceTimestamp={activeEvidenceTimestamp}
        />

        {/* Operational Recommendations Engine (Critical Principle & State Machine) */}
        <OperationalRecommendationsList
          recommendations={recommendations}
          onUpdateStatus={handleUpdateStatus}
          operatorId={currentOperatorId}
        />

        {/* Interaction Summary & Recovery Assessment */}
        <InteractionSummaryCard
          review={activeReview}
          onJumpToTimestamp={handleJumpToTimestamp}
        />

        {/* AI Confidence & Verifiable Evidence Grounding */}
        <AiConfidenceAndEvidence
          review={activeReview}
          onJumpToTimestamp={handleJumpToTimestamp}
        />
      </div>
    </div>
  );
};
