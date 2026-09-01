import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, MoreHorizontal, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { StatusPill } from './StatusPill';
import { OriginBadge } from './OriginBadge';
import { DebtCaseSample } from '../../types/design-system';
import { Dropdown } from './SearchInput';

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

export interface OperationsTableProps {
  data: DebtCaseSample[];
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onRowClick?: (item: DebtCaseSample) => void;
  onInspectAI?: (item: DebtCaseSample) => void;
  onAction?: (actionId: string, item: DebtCaseSample) => void;
  density?: 'compact' | 'standard';
}

export const OperationsTable: React.FC<OperationsTableProps> = ({
  data,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onRowClick,
  onInspectAI,
  onAction,
  density = 'standard',
}) => {
  const [sortField, setSortField] = useState<string>('daysPastDue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < data.length;

  const rowPadding = density === 'compact' ? 'py-1.5 px-2.5 text-xs' : 'py-2.5 px-3 text-xs';

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500 select-none">
            {/* Selection Checkbox */}
            <th className="w-9 px-3 py-2.5 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={onSelectAll}
                className="rounded border-slate-300 bg-white text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
              />
            </th>

            {/* Account & Debtor */}
            <th
              onClick={() => handleSort('accountNumber')}
              className="px-3 py-2.5 cursor-pointer hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Account & Debtor</span>
                <ChevronsUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>

            {/* Principal Balance */}
            <th
              onClick={() => handleSort('principalAmount')}
              className="px-3 py-2.5 text-right cursor-pointer hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center justify-end gap-1.5">
                <span>Principal Balance</span>
                <ChevronsUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>

            {/* DPD / SLA */}
            <th
              onClick={() => handleSort('daysPastDue')}
              className="px-3 py-2.5 text-center cursor-pointer hover:text-slate-900 transition-colors"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>DPD</span>
                <ChevronsUpDown className="w-3 h-3 text-slate-400" />
              </div>
            </th>

            {/* Operational Status (System State) */}
            <th className="px-3 py-2.5">System Status</th>

            {/* AI Recommendation (Advisory vs Authoritative) */}
            <th className="px-3 py-2.5 bg-indigo-50/50 border-x border-indigo-100">
              <div className="flex items-center gap-1.5 text-indigo-700">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Recommendation (Advisory)</span>
              </div>
            </th>

            {/* Authoritative Verified Ground Truth */}
            <th className="px-3 py-2.5">
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authoritative Stage</span>
              </div>
            </th>

            {/* Row Actions */}
            <th className="w-10 px-2 py-2.5 text-right"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 font-sans">
          {data.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <tr
                key={item.id}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors duration-100 group ${
                  isSelected ? 'bg-slate-50' : 'hover:bg-slate-50/80 bg-white'
                }`}
              >
                {/* Select Checkbox */}
                <td
                  className="px-3 py-2 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectRow(item.id);
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelectRow(item.id)}
                    className="rounded border-slate-300 bg-white text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                  />
                </td>

                {/* Account & Debtor */}
                <td className={rowPadding}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-slate-950">
                      {item.debtorName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 tracking-wider">
                      {item.accountNumber}
                    </span>
                  </div>
                </td>

                {/* Principal Balance (Tabular Num) */}
                <td className={`${rowPadding} text-right font-mono font-semibold text-slate-900`}>
                  ${item.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>

                {/* DPD */}
                <td className={`${rowPadding} text-center font-mono`}>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                      item.daysPastDue > 90
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : item.daysPastDue > 60
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {item.daysPastDue}d
                  </span>
                </td>

                {/* Status Pill */}
                <td className={rowPadding}>
                  <StatusPill status={item.status} size="sm" />
                </td>

                {/* AI Recommendation Column (Distinct Violet tint) */}
                <td
                  className={`${rowPadding} bg-indigo-50/30 border-x border-indigo-100/60 cursor-pointer hover:bg-indigo-50/70 transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onInspectAI) onInspectAI(item);
                  }}
                  title="Click to inspect model reasoning & prompt lineage"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-indigo-900 truncate">
                          {item.aiRecommendation.action}
                        </span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold shrink-0">
                          {(item.aiRecommendation.confidence * 100).toFixed(0)}% conf
                        </span>
                      </div>
                      <span className="text-[10px] text-indigo-600/90 truncate">
                        {item.aiRecommendation.reasoning}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                  </div>
                </td>

                {/* Authoritative Stage */}
                <td className={rowPadding}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">
                      {item.authoritativeState.currentStage}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 truncate">
                      {item.authoritativeState.ledgerHash || item.authoritativeState.decisionMaker || 'System Auto'}
                    </span>
                  </div>
                </td>

                {/* Action Menu */}
                <td
                  className="px-2 py-2 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dropdown
                    trigger={
                      <button className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    }
                    items={[
                      { id: 'view_details', label: 'View Case Ledger' },
                      { id: 'inspect_ai', label: 'Inspect AI Reasoning', badge: 'AI' },
                      { id: 'execute_action', label: 'Authorize Recommendation', badge: 'Confirm' },
                      { id: 'manual_override', label: 'Human Stage Override' },
                      { id: 'flag_legal', label: 'Flag for Legal Hold', isDestructive: true, dividerAbove: true },
                    ]}
                    onSelect={(actionId) => onAction && onAction(actionId, item)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
