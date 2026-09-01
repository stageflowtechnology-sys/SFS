import React from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Sparkles,
  Search,
  UserCheck,
  Lock,
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
  User,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Zap,
} from 'lucide-react';
import {
  WorkQueueAccount,
  QueueSortField,
  ChannelType,
  PriorityLevel,
  QueueStage,
} from '../../types/workQueue';
import { Button } from '../ui/Button';
import { StatusPill } from '../ui/StatusPill';

interface WorkQueueTableProps {
  accounts: WorkQueueAccount[];
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: () => void;
  onRowClick: (account: WorkQueueAccount) => void;
  onClaimAccount: (account: WorkQueueAccount, e: React.MouseEvent) => void;
  onReleaseAccount: (account: WorkQueueAccount, e: React.MouseEvent) => void;
  currentOperatorId: string;
  sortField: QueueSortField;
  sortAsc: boolean;
  onSort: (field: QueueSortField) => void;
  density: 'compact' | 'standard';
}

export const WorkQueueTable: React.FC<WorkQueueTableProps> = ({
  accounts,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onRowClick,
  onClaimAccount,
  onReleaseAccount,
  currentOperatorId,
  sortField,
  sortAsc,
  onSort,
  density,
}) => {
  const isAllSelected = accounts.length > 0 && selectedIds.length === accounts.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < accounts.length;

  const renderSortIndicator = (field: QueueSortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-3 h-3 text-slate-300 ml-1 inline-block" />;
    }
    return sortAsc ? (
      <ChevronUp className="w-3 h-3 text-slate-900 ml-1 inline-block" />
    ) : (
      <ChevronDown className="w-3 h-3 text-slate-900 ml-1 inline-block" />
    );
  };

  const getChannelIcon = (channel: ChannelType) => {
    switch (channel) {
      case 'VOICE':
        return <Phone className="w-3 h-3 text-slate-600" title="Voice Phone" />;
      case 'SMS':
        return <MessageSquare className="w-3 h-3 text-indigo-600" title="SMS" />;
      case 'EMAIL':
        return <Mail className="w-3 h-3 text-blue-600" title="Email" />;
      case 'LEGAL_MAIL':
        return <FileText className="w-3 h-3 text-rose-600" title="Legal Demand Notice" />;
      case 'OMNICHANNEL':
      default:
        return <Zap className="w-3 h-3 text-amber-600" title="Omnichannel" />;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel, propensity: number, aiRecommended: boolean) => {
    switch (priority) {
      case 'P1_CRITICAL':
        return (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-200">
              <Flame className="w-2.5 h-2.5 text-rose-600 shrink-0" />
              <span>P1 CRIT</span>
            </span>
            <span className="font-mono text-[10px] font-semibold text-rose-700">
              {propensity}%
            </span>
            {aiRecommended && (
              <Sparkles className="w-2.5 h-2.5 text-indigo-600 shrink-0" title="AI Propensity Signal" />
            )}
          </div>
        );
      case 'P2_HIGH':
        return (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
              <span>P2 HIGH</span>
            </span>
            <span className="font-mono text-[10px] font-semibold text-amber-800">
              {propensity}%
            </span>
            {aiRecommended && (
              <Sparkles className="w-2.5 h-2.5 text-indigo-600 shrink-0" title="AI Propensity Signal" />
            )}
          </div>
        );
      case 'P3_MEDIUM':
        return (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
              <span>P3 MED</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              {propensity}%
            </span>
          </div>
        );
      case 'P4_LOW':
        return (
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-500 bg-slate-50 border border-slate-200">
              <span>P4 LOW</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {propensity}%
            </span>
          </div>
        );
    }
  };

  const getStageBadge = (stage: QueueStage, label: string) => {
    switch (stage) {
      case 'BROKEN_PTP':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-2.5 h-2.5 text-rose-600" />
            <span>{label}</span>
          </span>
        );
      case 'DISPUTE_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <ShieldCheck className="w-2.5 h-2.5 text-purple-600" />
            <span>{label}</span>
          </span>
        );
      case 'PRE_LEGAL':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <FileText className="w-2.5 h-2.5 text-amber-700" />
            <span>{label}</span>
          </span>
        );
      case 'SKIP_TRACE_ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Search className="w-2.5 h-2.5 text-sky-600" />
            <span>{label}</span>
          </span>
        );
      case 'MID_COLLECTION':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-800 border border-blue-200">
            <span>{label}</span>
          </span>
        );
      case 'EARLY_DELINQUENCY':
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span>{label}</span>
          </span>
        );
    }
  };

  const getFollowUpBadge = (time: string, status: WorkQueueAccount['followUpStatus']) => {
    if (status === 'NONE') {
      return <span className="font-mono text-[10px] text-slate-400">None</span>;
    }
    if (status === 'OVERDUE') {
      return (
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
          <Clock className="w-2.5 h-2.5 text-rose-600 animate-pulse" />
          <span>{time}</span>
        </div>
      );
    }
    if (status === 'DUE_TODAY') {
      return (
        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
          <Clock className="w-2.5 h-2.5 text-amber-600" />
          <span>{time}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
        <span>{time}</span>
      </div>
    );
  };

  const rowPadding = density === 'compact' ? 'py-1.5 px-2.5' : 'py-2.5 px-3';

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse min-w-[1280px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90 font-mono text-[10px] uppercase tracking-wider text-slate-500 select-none sticky top-0 z-10 backdrop-blur-xs">
            {/* Checkbox */}
            <th className="py-2.5 px-2.5 w-8 text-center">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={onSelectAll}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer h-3.5 w-3.5"
                title="Select all accounts"
              />
            </th>

            {/* 1. Account */}
            <th
              onClick={() => onSort('accountNumber')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Account {renderSortIndicator('accountNumber')}
            </th>

            {/* 2. Customer */}
            <th
              onClick={() => onSort('customerName')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Customer {renderSortIndicator('customerName')}
            </th>

            {/* 3. Campaign */}
            <th
              onClick={() => onSort('campaignName')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Campaign {renderSortIndicator('campaignName')}
            </th>

            {/* 4. Stage */}
            <th
              onClick={() => onSort('stage')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Stage {renderSortIndicator('stage')}
            </th>

            {/* 5. Priority */}
            <th
              onClick={() => onSort('priority')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Priority {renderSortIndicator('priority')}
            </th>

            {/* 6. Balance */}
            <th
              onClick={() => onSort('balance')}
              className="py-2.5 px-2.5 text-right cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Balance {renderSortIndicator('balance')}
            </th>

            {/* 7. DPD */}
            <th
              onClick={() => onSort('daysPastDue')}
              className="py-2.5 px-2.5 text-center cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              DPD {renderSortIndicator('daysPastDue')}
            </th>

            {/* 8. Last Contact */}
            <th
              onClick={() => onSort('lastContactTime')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Last Contact {renderSortIndicator('lastContactTime')}
            </th>

            {/* 9. Next Action */}
            <th
              onClick={() => onSort('nextAction')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Next Action {renderSortIndicator('nextAction')}
            </th>

            {/* 10. Follow-Up */}
            <th
              onClick={() => onSort('followUpTime')}
              className="py-2.5 px-2.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Follow-Up {renderSortIndicator('followUpTime')}
            </th>

            {/* 11. Claim Status & Action */}
            <th
              onClick={() => onSort('claimStatus')}
              className="py-2.5 px-2.5 text-right cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Claim Status {renderSortIndicator('claimStatus')}
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 text-xs font-sans">
          {accounts.length === 0 ? (
            <tr>
              <td colSpan={12} className="py-12 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Search className="w-6 h-6 text-slate-300" />
                  <span className="font-semibold text-slate-700">No accounts match the active filter parameters.</span>
                  <span className="text-[11px] text-slate-400 font-mono">Try adjusting search keywords or clearing view filters.</span>
                </div>
              </td>
            </tr>
          ) : (
            accounts.map((acc) => {
              const isSelected = selectedIds.includes(acc.id);
              const isClaimedByMe =
                acc.ownership.state === 'CLAIMED_BY_ME' ||
                acc.ownership.claimedByOperatorId === currentOperatorId;
              const isClaimedByOther = acc.ownership.state === 'CLAIMED_BY_OTHER' && !isClaimedByMe;
              const isUnclaimed = acc.ownership.state === 'UNCLAIMED';

              return (
                <tr
                  key={acc.id}
                  onClick={() => onRowClick(acc)}
                  className={`group transition-colors cursor-pointer select-none ${
                    isSelected
                      ? 'bg-indigo-50/70 hover:bg-indigo-50'
                      : isClaimedByMe
                      ? 'bg-slate-50/40 hover:bg-indigo-50/30'
                      : 'hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  {/* Checkbox */}
                  <td
                    className={`${rowPadding} text-center`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectRow(acc.id)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer h-3.5 w-3.5"
                    />
                  </td>

                  {/* 1. Account */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                        {acc.accountNumber}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[140px]" title={`${acc.creditorName} • ${acc.accountType}`}>
                      {acc.creditorName}
                    </div>
                  </td>

                  {/* 2. Customer */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">
                        {acc.customerName}
                      </span>
                      {acc.customerType === 'COMMERCIAL' ? (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200" title="Commercial Entity">
                          B2B
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <span>{acc.state}</span>
                      <span>•</span>
                      <span>{acc.phoneNumbersCount} phones</span>
                    </div>
                  </td>

                  {/* 3. Campaign */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-slate-800">
                      {getChannelIcon(acc.primaryChannel)}
                      <span className="truncate max-w-[130px]" title={acc.campaignName}>
                        {acc.campaignName}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {acc.campaignStep}
                    </div>
                  </td>

                  {/* 4. Stage */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    {getStageBadge(acc.stage, acc.stageLabel)}
                  </td>

                  {/* 5. Priority */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    {getPriorityBadge(acc.priority, acc.propensityScore, acc.aiRecommended)}
                  </td>

                  {/* 6. Balance */}
                  <td className={`${rowPadding} text-right whitespace-nowrap`}>
                    <div className="font-mono font-bold text-slate-900">
                      ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {acc.authorizedSettlementDiscountPct}% max disc
                    </div>
                  </td>

                  {/* 7. DPD */}
                  <td className={`${rowPadding} text-center whitespace-nowrap`}>
                    <span
                      className={`inline-block font-mono font-bold px-1.5 py-0.2 rounded text-[11px] ${
                        acc.daysPastDue > 120
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : acc.daysPastDue > 60
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {acc.daysPastDue}d
                    </span>
                    {acc.statuteWarningDays ? (
                      <div className="text-[9px] font-mono text-rose-700 font-bold mt-0.5">
                        SOL: {acc.statuteWarningDays}d
                      </div>
                    ) : null}
                  </td>

                  {/* 8. Last Contact */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                      <span>{acc.lastContactTime}</span>
                    </div>
                    <div
                      className="text-[10px] text-slate-500 truncate max-w-[130px]"
                      title={acc.lastContactOutcome}
                    >
                      {acc.lastContactOutcome}
                    </div>
                  </td>

                  {/* 9. Next Action */}
                  <td className={`${rowPadding} max-w-[200px]`}>
                    <div
                      className="text-[11px] font-medium text-slate-800 truncate"
                      title={acc.nextAction}
                    >
                      {acc.nextAction}
                    </div>
                    {acc.aiConfidence && (
                      <div className="text-[10px] font-mono text-indigo-700 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                        <span>{(acc.aiConfidence * 100).toFixed(0)}% AI Conf</span>
                      </div>
                    )}
                  </td>

                  {/* 10. Follow-Up */}
                  <td className={`${rowPadding} whitespace-nowrap`}>
                    {getFollowUpBadge(acc.followUpTime, acc.followUpStatus)}
                  </td>

                  {/* 11. Claim Status & Ownership */}
                  <td
                    className={`${rowPadding} text-right whitespace-nowrap`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isUnclaimed ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          UNCLAIMED
                        </span>
                        <Button
                          size="xs"
                          variant="primary"
                          leftIcon={<UserCheck className="w-3 h-3" />}
                          onClick={(e) => onClaimAccount(acc, e)}
                        >
                          Claim
                        </Button>
                      </div>
                    ) : isClaimedByMe ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          <span>CLAIMED (YOU)</span>
                        </span>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={(e) => onReleaseAccount(acc, e)}
                          title="Release claim back to pool"
                        >
                          Release
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <div className="flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          <div className="w-4 h-4 rounded-full bg-slate-700 text-white text-[8px] font-bold flex items-center justify-center">
                            {acc.ownership.claimedByInitials || 'OP'}
                          </div>
                          <span className="font-semibold text-slate-800">
                            {acc.ownership.claimedByName || acc.ownership.claimedByOperatorId}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
