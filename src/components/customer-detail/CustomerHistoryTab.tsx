import React from 'react';
import { CustomerAuditLogRecord } from '../../types/customerDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  History,
  ShieldCheck,
  User,
  Cpu,
  ArrowRight,
  Clock,
  Terminal,
} from 'lucide-react';

interface CustomerHistoryTabProps {
  historyAudit: CustomerAuditLogRecord[];
}

export const CustomerHistoryTab: React.FC<CustomerHistoryTabProps> = ({
  historyAudit,
}) => {
  return (
    <div id="customer-history-tab" className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            Immutable Customer Audit Trail & Regulatory Change Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed timeline of human collector interventions, automated system actions, and state mutations.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Total Logged Mutations: <span className="text-indigo-600 font-bold">{historyAudit.length}</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {historyAudit.map((log) => (
            <div key={log.id} className="p-5 space-y-3 hover:bg-slate-50/70 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {log.action}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">IP: {log.ipAddress}</span>
                  <OriginBadge origin={log.origin} size="sm" />
                </div>
              </div>

              {/* Actor attribution */}
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Actor:</span>
                <span className="font-bold text-slate-900">{log.actor}</span>
                <span className="text-slate-400">({log.actorRole})</span>
              </div>

              {/* Field Mutation Diff Box */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs font-mono">
                <div className="text-slate-500 font-sans text-[11px] font-semibold">
                  Field Affected: <span className="text-slate-800 font-mono">{log.field}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div className="p-2 bg-rose-50/60 border border-rose-100 rounded text-rose-950">
                    <span className="text-[10px] uppercase font-bold text-rose-600 block font-sans">Previous State</span>
                    <div className="mt-0.5 break-all">{log.oldValue || '—'}</div>
                  </div>

                  <div className="p-2 bg-emerald-50/60 border border-emerald-100 rounded text-emerald-950">
                    <span className="text-[10px] uppercase font-bold text-emerald-600 block font-sans">Mutated State</span>
                    <div className="mt-0.5 break-all">{log.newValue}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
