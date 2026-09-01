import React, { useState } from 'react';
import {
  X,
  Sparkles,
  UserCheck,
  Phone,
  MessageSquare,
  Mail,
  FileCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Send,
  Calendar,
  CreditCard,
  User,
  HelpCircle,
  History,
  FileText,
} from 'lucide-react';
import { FollowUpItem, FollowUpStatus } from '../../types/followUps';

interface FollowUpDetailDrawerProps {
  item: FollowUpItem | null;
  isOpen: boolean;
  onClose: () => void;
  onExecuteAction: (item: FollowUpItem) => void;
  onMarkComplete: (item: FollowUpItem, outcomeNotes: string) => void;
  onSnooze: (item: FollowUpItem, hours: number) => void;
  onCancel: (item: FollowUpItem, reason: string) => void;
}

export const FollowUpDetailDrawer: React.FC<FollowUpDetailDrawerProps> = ({
  item,
  isOpen,
  onClose,
  onExecuteAction,
  onMarkComplete,
  onSnooze,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'INTELLIGENCE' | 'EXECUTION' | 'AUDIT'>('OVERVIEW');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState('');

  if (!isOpen || !item) return null;

  const isAI = item.source.origin === 'AI_GENERATED';
  const isOverdue = item.status === 'OVERDUE';

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer */}
      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-500">
                {item.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-indigo-600">
                {item.account.accountNumber}
              </span>
              {isAI ? (
                <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Inferred ({Math.round((item.source.modelConfidence || 0.9) * 100)}% Conf)</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                  <UserCheck className="w-3 h-3 text-amber-600" />
                  <span>Manual Directive</span>
                </span>
              )}
              {isOverdue && (
                <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-200">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>PAST DUE SLA</span>
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {item.reason}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-indigo-600 text-indigo-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Account & Debtor
          </button>
          <button
            onClick={() => setActiveTab('INTELLIGENCE')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'INTELLIGENCE'
                ? 'border-indigo-600 text-indigo-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Source & AI Reasoning</span>
          </button>
          <button
            onClick={() => setActiveTab('EXECUTION')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'EXECUTION'
                ? 'border-indigo-600 text-indigo-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Action Workspace</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'AUDIT'
                ? 'border-indigo-600 text-indigo-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Debtor Profile Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs uppercase text-slate-500 font-mono">
                      Debtor Demographic Profile
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-500">
                    ID: {item.customer.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Full Legal Name</span>
                    <span className="font-bold text-slate-900 text-sm">{item.customer.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Primary Verified Phone</span>
                    <span className="font-mono font-bold text-slate-900">{item.customer.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Primary Email</span>
                    <span className="font-mono text-slate-800">{item.customer.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Timezone & Best Contact Window</span>
                    <span className="font-medium text-slate-800">
                      {item.customer.timezone} ({item.customer.bestTimeToContact || 'Standard business hours'})
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Financials Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-xs uppercase text-slate-500 font-mono">
                      Account Financial Ledger
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {item.account.currentStage}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                      Current Balance
                    </span>
                    <span className="text-base font-bold text-slate-900">
                      ${item.account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                      Principal Placed
                    </span>
                    <span className="text-base font-bold text-slate-700">
                      ${item.account.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase text-slate-500 font-semibold block">
                      Days Past Due
                    </span>
                    <span className="text-base font-bold text-amber-700">
                      {item.account.daysPastDue} DPD
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 flex items-center justify-between pt-1 border-t border-slate-100 font-mono">
                  <span>Creditor: <strong>{item.account.originalCreditor}</strong></span>
                  <span>Portfolio: <strong>{item.account.portfolio}</strong></span>
                </div>
              </div>

              {/* Scheduled Task Details */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                <span className="font-bold text-xs uppercase text-slate-500 font-mono block">
                  Task Parameters & Assignee
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Due Date & Time</span>
                    <span className="font-bold text-slate-900">{item.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Assigned Collector</span>
                    <span className="font-bold text-slate-900">
                      {item.collector.name} ({item.collector.id})
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[11px] block">Internal Operator Notes</span>
                    <p className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1 font-sans">
                      {item.notes || 'No operator notes provided.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INTELLIGENCE & AI REASONING */}
          {activeTab === 'INTELLIGENCE' && (
            <div className="space-y-4">
              {isAI ? (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-600" />
                      <h3 className="font-bold text-sm text-indigo-950">
                        AI Inference Engine Provenance
                      </h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold">
                      {Math.round((item.source.modelConfidence || 0.9) * 100)}% Confidence
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono uppercase font-bold text-indigo-900">
                      Recommendation Model Rationale
                    </span>
                    <p className="text-xs text-indigo-950 leading-relaxed bg-white p-3 rounded-lg border border-indigo-200 font-sans shadow-2xs">
                      {item.source.aiReasoning}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2 border-t border-indigo-200/60">
                    <div>
                      <span className="text-indigo-700 text-[10px] block">Algorithm Classifier</span>
                      <span className="font-bold text-indigo-900">{item.source.algorithmTag}</span>
                    </div>
                    <div>
                      <span className="text-indigo-700 text-[10px] block">Inference Timestamp</span>
                      <span className="text-indigo-900">{item.source.createdAt}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-indigo-700 text-[10px] block">Cryptographic Provenance Hash</span>
                      <span className="text-indigo-800 text-[10px] break-all font-mono">
                        {item.source.provenanceHash || 'SHA256:7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-amber-700" />
                    <h3 className="font-bold text-sm text-amber-950">
                      Manual Operator Directive
                    </h3>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed bg-white p-3 rounded-lg border border-amber-200">
                    This follow-up was scheduled manually by licensed operator <strong>{item.source.createdBy}</strong> during active debtor engagement.
                  </p>
                  <div className="text-xs font-mono text-amber-800">
                    Scheduled At: {item.source.createdAt}
                  </div>
                </div>
              )}

              {/* Reg-F Compliance Guard Telemetry */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Statutory Compliance Validation (CFPB Reg-F § 1006.6)</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-1.5 pl-6 list-disc">
                  <li>Outreach window complies with local consumer time (8:00 AM – 9:00 PM local).</li>
                  <li>7-in-7 frequency cap verified (0 prior calls in past 48 hours).</li>
                  <li>Opt-out status: Active consent verified. No cease-and-desist on file.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: ACTION WORKSPACE */}
          {activeTab === 'EXECUTION' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">
                    Recommended Action: {item.recommendedAction.label}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200">
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  {item.recommendedAction.description}
                </p>

                {item.recommendedAction.suggestedScript && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-500">
                      Approved Script / Message Template
                    </span>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed">
                      {item.recommendedAction.suggestedScript}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => onExecuteAction(item)}
                    className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 active:bg-indigo-800 shadow-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {item.type === 'CALL' && <Phone className="w-4 h-4" />}
                    {item.type === 'SMS' && <MessageSquare className="w-4 h-4" />}
                    {item.type === 'EMAIL' && <Mail className="w-4 h-4" />}
                    {item.type === 'REVIEW' && <FileCheck className="w-4 h-4" />}
                    <span>Launch {item.recommendedAction.label}</span>
                  </button>
                </div>
              </div>

              {/* Status Resolution Box */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <span className="font-bold text-xs uppercase font-mono text-slate-500 block">
                  Resolve or Reschedule Task
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsResolving(!isResolving)}
                    className="py-2 px-3 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Complete Task</span>
                  </button>
                  <button
                    onClick={() => onSnooze(item, 24)}
                    className="py-2 px-3 rounded-lg border border-slate-300 bg-slate-50 text-slate-700 font-semibold text-xs hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Snooze (+24h)</span>
                  </button>
                </div>

                {isResolving && (
                  <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-2 mt-2">
                    <span className="text-xs font-bold text-emerald-900 block">
                      Enter Resolution Notes:
                    </span>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="e.g. Spoke with debtor. Payment plan confirmed for Sept 5."
                      className="w-full p-2 text-xs rounded border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      rows={2}
                    />
                    <button
                      onClick={() => {
                        onMarkComplete(item, resolutionNotes || 'Completed as scheduled.');
                        setIsResolving(false);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-700"
                    >
                      Confirm Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative">
                  <span className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 ring-4 ring-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Task Ingested</span>
                    <p className="text-slate-500 font-mono text-[11px]">{item.source.createdAt}</p>
                    <p className="text-slate-700 mt-0.5">
                      Created by {item.source.sourceName} for reason: &ldquo;{item.reason}&rdquo;
                    </p>
                  </div>
                </div>

                {item.completedAt && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 ring-4 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <div className="text-xs">
                      <span className="font-bold text-emerald-800">Task Completed & Reconciled</span>
                      <p className="text-slate-500 font-mono text-[11px]">{item.completedAt}</p>
                      <p className="text-slate-700 mt-0.5">
                        Outcome: {item.completionOutcome || 'Marked done by operator.'}
                      </p>
                    </div>
                  </div>
                )}

                {item.cancelledAt && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 ring-4 ring-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <div className="text-xs">
                      <span className="font-bold text-rose-800">Task Dismissed / Cancelled</span>
                      <p className="text-slate-500 font-mono text-[11px]">{item.cancelledAt}</p>
                      <p className="text-rose-700 mt-0.5">
                        Reason: {item.cancellationReason}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-slate-200 px-6 py-3.5 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
              <button
                onClick={() => {
                  onCancel(item, 'Cancelled by operator via detail drawer.');
                  onClose();
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 px-2 py-1"
              >
                Cancel Follow-Up
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-white bg-slate-100 transition-colors"
            >
              Close
            </button>
            {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
              <button
                onClick={() => {
                  onExecuteAction(item);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-2xs transition-colors flex items-center gap-1.5"
              >
                <span>Execute Action</span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
