import React from 'react';
import { AuditLogEntry } from '../../types/accountDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  ShieldCheck,
  Lock,
  FileCode,
  User,
  Cpu,
  Clock,
} from 'lucide-react';

interface AccountAuditTabProps {
  auditLogs: AuditLogEntry[];
}

export const AccountAuditTab: React.FC<AccountAuditTabProps> = ({ auditLogs }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Immutable Regulatory Audit Trail ({auditLogs.length} Entries)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Cryptographically sealed operational mutations for CFPB, FTC, and state licensing compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          <Lock className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ledger Seal: SHA-256 Active</span>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold">
            <tr>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Actor & Role</th>
              <th className="p-3">Action Description</th>
              <th className="p-3">Field Mutation (Diff)</th>
              <th className="p-3">Origin</th>
              <th className="p-3">Cryptographic Seal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                  {log.timestamp}
                </td>
                <td className="p-3 text-slate-800 whitespace-nowrap">
                  <div className="font-bold">{log.actor}</div>
                  <div className="text-[10px] text-slate-500">{log.actorRole}</div>
                </td>
                <td className="p-3 text-slate-900 font-medium">
                  {log.action}
                </td>
                <td className="p-3 text-[11px]">
                  <div className="text-rose-700 line-through">Prev: {log.previousValue}</div>
                  <div className="text-emerald-800 font-bold">New: {log.newValue}</div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  <OriginBadge origin={log.origin} size="sm" />
                </td>
                <td className="p-3 text-[10px] text-slate-500 whitespace-nowrap">
                  <div className="truncate max-w-[140px]" title={log.immutableHash}>
                    {log.immutableHash}
                  </div>
                  <div className="text-[9px] text-slate-400">IP: {log.ipAddress}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
