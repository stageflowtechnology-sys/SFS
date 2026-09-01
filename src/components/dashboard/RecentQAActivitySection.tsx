import React from 'react';
import {
  ClipboardCheck,
  ShieldCheck,
  AlertTriangle,
  Mic,
  Clock,
  UserCheck,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { RecentQAAuditItem } from '../../types/dashboard';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RecentQAActivitySectionProps {
  audits: RecentQAAuditItem[];
  onInspectAudit?: (audit: RecentQAAuditItem) => void;
}

export const RecentQAActivitySection: React.FC<RecentQAActivitySectionProps> = ({
  audits,
  onInspectAudit,
}) => {
  const getActionBadge = (action: RecentQAAuditItem['actionRequired']) => {
    switch (action) {
      case 'CLEARED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Passed & Cleared</span>
          </span>
        );
      case 'COACHING_ASSIGNED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Coaching Assigned</span>
          </span>
        );
      case 'RE_AUDIT_MANDATED':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Re-Audit Required</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent QA Compliance Audits & Call Disclosures
            </h3>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
              96.4% Floor Average
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Operational Question: <em>Is the floor operating in full compliance with Mini-Miranda verbal rules and CFPB debt collection standards?</em>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Standard: <strong>FDCPA Reg-F § 1006.14</strong></span>
        </div>
      </div>

      {/* Compact Operational Compliance Adherence Distribution Bar */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Audit Action Distribution</span>
            <span className="font-bold text-slate-800">{audits.length} Monitored</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded bg-slate-200">
            <div
              style={{ width: `${(audits.filter(a => a.actionRequired === 'CLEARED').length / audits.length) * 100}%` }}
              className="bg-emerald-500"
              title="Cleared / Passed"
            />
            <div
              style={{ width: `${(audits.filter(a => a.actionRequired === 'COACHING_ASSIGNED').length / audits.length) * 100}%` }}
              className="bg-amber-500"
              title="Coaching Assigned"
            />
            <div
              style={{ width: `${(audits.filter(a => a.actionRequired === 'RE_AUDIT_MANDATED').length / audits.length) * 100}%` }}
              className="bg-rose-500"
              title="Re-Audit Mandated"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Mini-Miranda Verbal Pass Rate</span>
            <span className="font-bold text-emerald-700">
              {((audits.filter(a => a.miniMirandaVerified).length / audits.length) * 100).toFixed(1)}% Verified
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            FDCPA Compliant: <strong className="text-emerald-700 font-bold">{audits.filter(a => a.fdcpaCompliant).length} / {audits.length} calls</strong>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>Floor Quality Index</span>
            <span className="font-bold text-emerald-800">
              {(audits.reduce((acc, a) => acc + a.score, 0) / audits.length).toFixed(1)} / 100
            </span>
          </div>
          <div className="text-[10px] text-slate-600">
            Target SLA: &gt;92.0% Floor Baseline
          </div>
        </div>
      </div>

      {/* Audits Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 font-mono text-[10px] uppercase tracking-wider text-slate-500 select-none">
              <th className="py-2 px-3">Audit # & Time</th>
              <th className="py-2 px-3">Collector</th>
              <th className="py-2 px-3 text-center">Duration</th>
              <th className="py-2 px-3 text-center">QA Score</th>
              <th className="py-2 px-3 text-center">Mini-Miranda</th>
              <th className="py-2 px-3 text-center">Reg-F Status</th>
              <th className="py-2 px-3">Auditor Notes & Deviation</th>
              <th className="py-2 px-3 text-right">Compliance Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-sans">
            {audits.map((a) => (
              <tr
                key={a.id}
                onClick={() => onInspectAudit && onInspectAudit(a)}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
              >
                {/* Audit ID & Time */}
                <td className="py-2.5 px-3 font-mono">
                  <div className="font-bold text-slate-900">{a.auditNumber}</div>
                  <div className="text-[10px] text-slate-400">{a.timestamp}</div>
                </td>

                {/* Collector */}
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {a.collectorName}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">
                    {a.collectorId}
                  </div>
                </td>

                {/* Duration */}
                <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-700">
                  <div className="inline-flex items-center gap-1">
                    <Mic className="w-3 h-3 text-slate-400" />
                    <span>{a.callDuration}</span>
                  </div>
                </td>

                {/* QA Score */}
                <td className="py-2.5 px-3 text-center font-mono">
                  <span
                    className={`px-1.5 py-0.5 rounded font-bold text-xs ${
                      a.score >= 95
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : a.score >= 85
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {a.score}/100
                  </span>
                </td>

                {/* Mini-Miranda */}
                <td className="py-2.5 px-3 text-center font-mono">
                  {a.miniMirandaVerified ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Pass
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 inline-flex items-center gap-1">
                      <XCircle className="w-3 h-3 text-rose-600" /> Failed
                    </span>
                  )}
                </td>

                {/* Reg-F Status */}
                <td className="py-2.5 px-3 text-center font-mono">
                  {a.fdcpaCompliant ? (
                    <span className="text-[10px] font-medium text-slate-700">Compliant</span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                      Deviation
                    </span>
                  )}
                </td>

                {/* Deviation Summary */}
                <td className="py-2.5 px-3 max-w-xs">
                  <div className="text-[11px] text-slate-700 truncate" title={a.deviationSummary}>
                    {a.deviationSummary}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Audited by: {a.auditorName}
                  </div>
                </td>

                {/* Action */}
                <td className="py-2.5 px-3 text-right">
                  {getActionBadge(a.actionRequired)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
