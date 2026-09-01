import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Mail,
  FileCheck,
  Sparkles,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ExternalLink,
  Info,
  Check,
  MoreVertical,
  Calendar,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  FollowUpItem,
  FollowUpType,
  FollowUpSourceOrigin,
  FollowUpStatus,
} from '../../types/followUps';

interface FollowUpsTableProps {
  items: FollowUpItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onSelectRow: (item: FollowUpItem) => void;
  onExecuteAction: (item: FollowUpItem) => void;
  onQuickComplete: (item: FollowUpItem) => void;
  onQuickSnooze: (item: FollowUpItem) => void;
  onQuickCancel: (item: FollowUpItem) => void;
}

export const FollowUpsTable: React.FC<FollowUpsTableProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onSelectRow,
  onExecuteAction,
  onQuickComplete,
  onQuickSnooze,
  onQuickCancel,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const allSelected = items.length > 0 && selectedIds.length === items.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < items.length;

  const getTypeBadge = (type: FollowUpType) => {
    switch (type) {
      case 'CALL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold border border-indigo-200">
            <Phone className="w-3 h-3 text-indigo-600" />
            <span>CALL</span>
          </span>
        );
      case 'SMS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-mono text-[10px] font-bold border border-sky-200">
            <MessageSquare className="w-3 h-3 text-sky-600" />
            <span>SMS</span>
          </span>
        );
      case 'EMAIL':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
            <Mail className="w-3 h-3 text-emerald-600" />
            <span>EMAIL</span>
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono text-[10px] font-bold border border-amber-200">
            <FileCheck className="w-3 h-3 text-amber-700" />
            <span>REVIEW</span>
          </span>
        );
    }
  };

  const getStatusBadge = (status: FollowUpStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[10px] font-semibold border border-slate-200">
            <Clock className="w-2.5 h-2.5 text-slate-500" />
            <span>Pending</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-mono text-[10px] font-bold border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-mono text-[10px] font-bold border border-rose-300">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-600 animate-bounce" />
            <span>Overdue</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 font-mono text-[10px] font-medium border border-slate-200 line-through">
            <XCircle className="w-2.5 h-2.5 text-slate-400" />
            <span>Cancelled</span>
          </span>
        );
      case 'SNOOZED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono text-[10px] font-semibold border border-purple-200">
            <Clock className="w-2.5 h-2.5 text-purple-500" />
            <span>Snoozed</span>
          </span>
        );
    }
  };

  const getSourceDisplay = (item: FollowUpItem) => {
    if (item.source.origin === 'AI_GENERATED') {
      return (
        <div className="space-y-0.5">
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50/90 text-indigo-900 border border-indigo-200 shadow-2xs font-mono text-[10px] font-bold group relative cursor-help"
            title={item.source.aiReasoning || 'AI Copilot Model Inference'}
          >
            <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
            <span className="truncate max-w-[110px]">{item.source.sourceName}</span>
            {typeof item.source.modelConfidence === 'number' && (
              <span className="bg-indigo-200/80 text-indigo-950 px-1 py-0.2 rounded text-[9px] font-black">
                {Math.round(item.source.modelConfidence * 100)}%
              </span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
            {item.source.algorithmTag || 'Autonomous Recovery Engine'}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-0.5">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-mono text-[10px] font-semibold">
          <UserCheck className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="truncate max-w-[120px]">Manual Directive</span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono truncate max-w-[150px]">
          By: {item.source.createdBy}
        </div>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center space-y-3 shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">No Follow-Ups Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          There are no follow-up tasks matching your current view tab and filter criteria. Try adjusting the search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600 select-none">
              {/* Select All Checkbox */}
              <th className="w-9 px-3 py-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={onSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                  title="Select all rows"
                />
              </th>

              {/* Exact 9 Columns from User Prompt */}
              <th className="px-3.5 py-3">Account</th>
              <th className="px-3.5 py-3">Customer</th>
              <th className="px-3.5 py-3 min-w-[200px]">Reason</th>
              <th className="px-3.5 py-3">Type</th>
              <th className="px-3.5 py-3">Due Date</th>
              <th className="px-3.5 py-3">Collector</th>
              <th className="px-3.5 py-3">Source</th>
              <th className="px-3.5 py-3">Status</th>
              <th className="px-3.5 py-3 text-right">Recommended Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-xs">
            {items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isOverdue = item.status === 'OVERDUE';
              const isAI = item.source.origin === 'AI_GENERATED';

              return (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-slate-50/80 group ${
                    isSelected ? 'bg-indigo-50/30' : isOverdue ? 'bg-rose-50/20' : ''
                  }`}
                >
                  {/* Select Row Checkbox */}
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(item.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5 cursor-pointer"
                    />
                  </td>

                  {/* 1. Account Column */}
                  <td className="px-3.5 py-3 align-top">
                    <div
                      onClick={() => onSelectRow(item)}
                      className="cursor-pointer group/acc"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900 group-hover/acc:text-indigo-600 transition-colors">
                          {item.account.accountNumber}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-400 group-hover/acc:translate-x-0.5 transition-transform" />
                      </div>
                      <div className="font-mono text-xs font-semibold text-slate-900 mt-0.5">
                        ${item.account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px] mt-0.5">
                        {item.account.originalCreditor}
                      </div>
                    </div>
                  </td>

                  {/* 2. Customer Column */}
                  <td className="px-3.5 py-3 align-top">
                    <div
                      onClick={() => onSelectRow(item)}
                      className="cursor-pointer"
                    >
                      <div className="font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        {item.customer.name}
                      </div>
                      <div className="font-mono text-[11px] text-slate-600 mt-0.5">
                        {item.customer.phone}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-400">
                          {item.customer.ssnMasked}
                        </span>
                        {item.customer.riskLevel === 'CRITICAL' && (
                          <span className="px-1 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold">
                            HIGH RISK
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 3. Reason Column */}
                  <td className="px-3.5 py-3 align-top">
                    <div
                      onClick={() => onSelectRow(item)}
                      className="cursor-pointer space-y-1"
                    >
                      <p className="text-xs text-slate-800 font-medium leading-snug line-clamp-2">
                        {item.reason}
                      </p>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1 flex-wrap pt-0.5">
                          {item.tags.slice(0, 2).map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* 4. Type Column */}
                  <td className="px-3.5 py-3 align-top whitespace-nowrap">
                    {getTypeBadge(item.type)}
                  </td>

                  {/* 5. Due Date Column */}
                  <td className="px-3.5 py-3 align-top whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div
                        className={`font-semibold flex items-center gap-1 ${
                          isOverdue ? 'text-rose-700 font-bold' : 'text-slate-900'
                        }`}
                      >
                        {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                        <span>{item.dueDate}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.customer.timezone}
                      </div>
                    </div>
                  </td>

                  {/* 6. Collector Column */}
                  <td className="px-3.5 py-3 align-top whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white font-mono text-[10px] font-bold ${
                          item.collector.avatarColor || 'bg-slate-700'
                        }`}
                      >
                        {item.collector.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 truncate max-w-[110px] text-xs">
                          {item.collector.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {item.collector.isCurrentUser ? (
                            <span className="text-indigo-600 font-bold">You (OP-402)</span>
                          ) : (
                            item.collector.id
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* 7. Source Column (AI vs Manual distinct highlight) */}
                  <td className="px-3.5 py-3 align-top">
                    {getSourceDisplay(item)}
                  </td>

                  {/* 8. Status Column */}
                  <td className="px-3.5 py-3 align-top whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>

                  {/* 9. Recommended Action Column */}
                  <td className="px-3.5 py-3 align-top text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end">
                      {/* Primary Execution Button */}
                      {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' ? (
                        <button
                          onClick={() => onExecuteAction(item)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-2xs transition-colors"
                          title={item.recommendedAction.description}
                        >
                          {item.type === 'CALL' && <Phone className="w-3 h-3" />}
                          {item.type === 'SMS' && <MessageSquare className="w-3 h-3" />}
                          {item.type === 'EMAIL' && <Mail className="w-3 h-3" />}
                          {item.type === 'REVIEW' && <FileCheck className="w-3 h-3" />}
                          <span>{item.recommendedAction.label}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectRow(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <span>View Audit</span>
                        </button>
                      )}

                      {/* Row Quick Action Menu */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActiveMenuId(activeMenuId === item.id ? null : item.id)
                          }
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Quick actions"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 top-full mt-1 w-44 rounded-lg bg-white border border-slate-200 shadow-lg py-1 z-30 text-left">
                            <button
                              onClick={() => {
                                onSelectRow(item);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Info className="w-3.5 h-3.5 text-slate-400" />
                              <span>View Details</span>
                            </button>

                            {item.status !== 'COMPLETED' && (
                              <button
                                onClick={() => {
                                  onQuickComplete(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Mark Completed</span>
                              </button>
                            )}

                            {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && (
                              <button
                                onClick={() => {
                                  onQuickSnooze(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Snooze / Reschedule</span>
                              </button>
                            )}

                            {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                              <button
                                onClick={() => {
                                  onQuickCancel(item);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                <span>Cancel Follow-Up</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
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
