import React from 'react';
import {
  CalendarClock,
  Clock,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
} from 'lucide-react';
import { FollowUpDueToday } from '../../types/dashboard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface FollowUpsDueSectionProps {
  followUps: FollowUpDueToday[];
  onDialDebtor?: (item: FollowUpDueToday) => void;
}

export const FollowUpsDueSection: React.FC<FollowUpsDueSectionProps> = ({
  followUps,
  onDialDebtor,
}) => {
  const getStatusBadge = (status: FollowUpDueToday['status']) => {
    switch (status) {
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            <span>OVERDUE</span>
          </span>
        );
      case 'DUE_SOON':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>DUE IN 15M</span>
          </span>
        );
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span>SCHEDULED</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>COMPLETED</span>
          </span>
        );
    }
  };

  const getTypeLabel = (type: FollowUpDueToday['type']) => {
    switch (type) {
      case 'PTP_MATURITY':
        return 'Promise-to-Pay Settlement Maturity';
      case 'CALLBACK_PROMISE':
        return 'Scheduled Debtor Callback';
      case 'HARDSHIP_REVIEW':
        return 'Financial Hardship Affidavit Review';
      case 'ASSET_VERIFICATION_CHECK':
        return 'UCC / Real Estate Asset Verification';
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Follow-Ups & Commitments Due Today
            </h3>
            <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
              {followUps.length} Scheduled
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>What scheduled debtor touchpoints and PTP maturities require execution today?</em>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Timezone: <strong>EDT (UTC-4)</strong></span>
        </div>
      </div>

      {/* Compact Operational Schedule & Overdue Distribution */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Commitment Status</span>
            <span className="font-bold text-slate-800">{followUps.length} Accounts</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{ width: `${(followUps.filter(f => f.status === 'COMPLETED').length / followUps.length) * 100}%` }}
              className="bg-emerald-500"
              title="Completed"
            />
            <div
              style={{ width: `${(followUps.filter(f => f.status === 'DUE_SOON').length / followUps.length) * 100}%` }}
              className="bg-amber-500"
              title="Due Soon"
            />
            <div
              style={{ width: `${(followUps.filter(f => f.status === 'OVERDUE').length / followUps.length) * 100}%` }}
              className="bg-rose-500"
              title="Overdue"
            />
            <div
              style={{ width: `${(followUps.filter(f => f.status === 'SCHEDULED').length / followUps.length) * 100}%` }}
              className="bg-slate-400"
              title="Upcoming Scheduled"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Scheduled Balance at Stake</span>
            <span className="font-bold text-slate-900">
              ${followUps.reduce((acc, f) => acc + f.balance, 0).toLocaleString()}
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Overdue Capital: <strong className="text-rose-700 font-bold">${followUps.filter(f => f.status === 'OVERDUE').reduce((acc, f) => acc + f.balance, 0).toLocaleString()}</strong>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Peak Window</span>
            <span className="font-bold text-indigo-700">14:00 – 16:30 EDT</span>
          </div>
          <div className="text-[10px] text-slate-600">
            {followUps.filter(f => f.type === 'PTP_MATURITY').length} PTP Maturities / {followUps.filter(f => f.type === 'CALLBACK_PROMISE').length} Callbacks
          </div>
        </div>
      </div>

      {/* Timeline Rows */}
      <div className="divide-y divide-slate-100">
        {followUps.map((item) => (
          <div
            key={item.id}
            className="p-3.5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Time Slot & Debtor Info */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center justify-center p-1.5 rounded bg-slate-900 text-white text-[10px] font-mono w-20 text-center shrink-0">
                <span className="font-bold">{item.timeSlot}</span>
                <span className="text-[9px] text-slate-300">TODAY</span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-slate-900">
                    {item.debtorName}
                  </span>
                  <span className="font-mono text-[11px] text-slate-500">
                    {item.accountNumber}
                  </span>
                  {getStatusBadge(item.status)}
                </div>

                <div className="text-xs text-slate-700 font-medium mt-0.5">
                  {getTypeLabel(item.type)}
                </div>

                <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2">
                  <span>Assigned Collector: <strong className="text-slate-800">{item.collectorName}</strong></span>
                  <span>•</span>
                  <span>Balance: <strong className="text-slate-900">${item.balance.toLocaleString()}</strong></span>
                </div>
              </div>
            </div>

            {/* Direct Dial / Action */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {item.status !== 'COMPLETED' ? (
                <Button
                  size="xs"
                  variant="primary"
                  leftIcon={<PhoneCall className="w-3 h-3" />}
                  onClick={() => onDialDebtor && onDialDebtor(item)}
                >
                  Initiate Call
                </Button>
              ) : (
                <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Logged</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
