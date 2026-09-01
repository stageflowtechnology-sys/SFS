import React from 'react';
import {
  X,
  History,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Scale,
  Clock,
  ShieldCheck,
  PhoneCall,
  Mail,
  Building2,
  Globe,
  MapPin,
  FileText,
} from 'lucide-react';
import { ContactabilityChannel } from '../../../types/contactability';
import { IdentityBandBadge } from '../IdentityBandBadge';

interface ChannelHistoryAuditModalProps {
  channel: ContactabilityChannel | null;
  onClose: () => void;
}

export const ChannelHistoryAuditModal: React.FC<ChannelHistoryAuditModalProps> = ({
  channel,
  onClose,
}) => {
  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-2xs">
              <History className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Channel Audit Ledger & Telemetry
                </span>
                <IdentityBandBadge band={channel.identityRelationship.band} />
              </div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight font-mono mt-0.5">
                {channel.value}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Logged</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {channel.historicalSuccessFailure.totalAttempts} Attempts
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Success Conversion</span>
              <div className="text-base font-bold text-emerald-700 mt-0.5">
                {channel.historicalSuccessFailure.successRatePct}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Confidence Weight</span>
              <div className="text-base font-bold text-indigo-700 mt-0.5">
                {channel.confidenceScore}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">FDCPA Status</span>
              <div className="text-xs font-bold text-slate-900 mt-1 truncate">
                {channel.compliance.inCallWindowNow ? 'In Window' : 'Hold'}
              </div>
            </div>
          </div>

          {/* Statutory & Provenance Panel */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 font-mono text-[11px] uppercase">
              <Scale className="w-4 h-4 text-slate-500" />
              <span>Statutory Citation & Permissible Safe Harbor</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {channel.compliance.safeHarborCitation}
            </p>
            <div className="text-[11px] text-slate-500 font-mono pt-1 border-t border-slate-200/60">
              Source Citation: <strong>{channel.statutoryCitation}</strong>
            </div>
          </div>

          {/* Chronological History Timeline */}
          <div className="space-y-3">
            <h4 className="font-mono text-xs font-bold text-slate-900 uppercase">
              Interaction & Validation History ({channel.historicalSuccessFailure.attempts.length})
            </h4>

            <div className="space-y-2.5">
              {channel.historicalSuccessFailure.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {attempt.result === 'SUCCESS' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : attempt.result === 'FAILURE' ? (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <span className="font-bold text-slate-900 font-mono text-[11px]">
                        {attempt.action}
                      </span>
                    </div>

                    <span className="font-mono text-[10px] text-slate-500">
                      {attempt.date} • {attempt.operatorId}
                    </span>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed pl-6">
                    {attempt.notes}
                  </p>
                </div>
              ))}

              {channel.historicalSuccessFailure.attempts.length === 0 && (
                <div className="p-4 rounded-lg bg-slate-50 text-center text-xs text-slate-500">
                  No previous manual dial or outreach attempts logged for this channel yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Audit Log #TLM-90142 • Immutable Storage</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
