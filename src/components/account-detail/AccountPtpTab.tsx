import React, { useState } from 'react';
import { PtpRecord } from '../../types/accountDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UserCheck,
  CreditCard,
  Plus,
  RefreshCw,
} from 'lucide-react';

interface AccountPtpTabProps {
  ptps: PtpRecord[];
  currentBalance: number;
}

export const AccountPtpTab: React.FC<AccountPtpTabProps> = ({ ptps, currentBalance }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredPtps = ptps.filter((p) => {
    if (filterStatus === 'ALL') return true;
    return p.status === filterStatus;
  });

  const getPtpStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING_DUE':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            PENDING DUE
          </span>
        );
      case 'HONORED_SETTLED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            HONORED & SETTLED
          </span>
        );
      case 'BROKEN_DEFAULTED':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            BROKEN / RETURNED
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Promise to Pay (PTP) Agreements & Schedules ({ptps.length} Total)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Formal debtor payment commitments, agreed installment tranches, and banking direct debit authorizations.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          {['ALL', 'PENDING_DUE', 'BROKEN_DEFAULTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* PTP Cards Grid */}
      {filteredPtps.length === 0 ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs border border-dashed border-slate-200 rounded-xl">
          No promises to pay matching current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPtps.map((ptp) => (
            <div
              key={ptp.id}
              className={`rounded-xl border p-4 transition-all space-y-3 ${
                ptp.status === 'BROKEN_DEFAULTED'
                  ? 'border-rose-200 bg-rose-50/30'
                  : ptp.status === 'PENDING_DUE'
                  ? 'border-indigo-200 bg-indigo-50/20'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-slate-900">
                    Tranche #{ptp.installmentNumber || 1} of {ptp.totalInstallments || 1}
                  </span>
                  {getPtpStatusBadge(ptp.status)}
                </div>

                <OriginBadge origin={ptp.origin} size="sm" />
              </div>

              {/* Amount and Due Date */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Agreed Amount
                  </span>
                  <span className="text-base font-mono font-bold text-slate-900">
                    ${ptp.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">
                    Due Date
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-900">
                    {ptp.dueDate}
                  </span>
                </div>
              </div>

              {/* Payment Method & Authorization */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 text-xs font-mono">
                <div className="text-slate-600">
                  <strong className="text-slate-900">Instrument:</strong> {ptp.paymentMethod}
                </div>
                <div className="text-slate-500 text-[11px]">
                  Authorized with Collector: {ptp.collectorName} ({ptp.collectorId})
                </div>
              </div>

              {/* Notes */}
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {ptp.notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
