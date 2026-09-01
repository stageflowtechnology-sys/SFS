import React from 'react';
import { PaymentRecord } from '../../types/accountDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  DollarSign,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Building,
  CreditCard,
  FileCheck,
  ArrowUpRight,
  Plus,
} from 'lucide-react';

interface AccountPaymentsTabProps {
  payments: PaymentRecord[];
  totalBalance: number;
}

export const AccountPaymentsTab: React.FC<AccountPaymentsTabProps> = ({
  payments,
  totalBalance,
}) => {
  const settledPayments = payments.filter((p) => p.status === 'SETTLED' || p.status === 'RECONCILED');
  const totalPaid = settledPayments.reduce((acc, curr) => acc + curr.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SETTLED':
      case 'RECONCILED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            {status}
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            PENDING CLEARING
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
            FAILED / RETURNED (R01)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header and Summary Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Payment & Settlement Ledger ({payments.length} Transactions)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Immutable clearinghouse records reconciled against Fedwire, ACH, and debit gateways.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Recovered</span>
            <span className="text-sm font-mono font-bold text-emerald-700">
              ${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Records Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            <tr>
              <th className="p-3">Posting Date</th>
              <th className="p-3">Reference / Tx ID</th>
              <th className="p-3">Payment Method</th>
              <th className="p-3">Gross Amount</th>
              <th className="p-3">Principal / Int / Fees</th>
              <th className="p-3">Clearing Bank</th>
              <th className="p-3">Status</th>
              <th className="p-3">Origin</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {payments.map((pmt) => (
              <tr key={pmt.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                  {pmt.date}
                </td>
                <td className="p-3 text-slate-700 whitespace-nowrap">
                  <span className="text-[11px] font-mono">{pmt.referenceNumber}</span>
                  {pmt.settlementBatchId && (
                    <span className="block text-[9px] text-slate-400">{pmt.settlementBatchId}</span>
                  )}
                </td>
                <td className="p-3 text-slate-800 whitespace-nowrap">
                  {pmt.paymentMethod.replace(/_/g, ' ')}
                </td>
                <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                  ${pmt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-[11px] text-slate-600 whitespace-nowrap">
                  <div>Prin: ${pmt.principalApplied.toLocaleString()}</div>
                  <div className="text-slate-400">Int: ${pmt.interestApplied.toLocaleString()} • Fee: ${pmt.feeApplied.toLocaleString()}</div>
                </td>
                <td className="p-3 text-slate-600 whitespace-nowrap">
                  {pmt.clearingBank}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {getStatusBadge(pmt.status)}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <OriginBadge origin={pmt.origin} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
