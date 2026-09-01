import React from 'react';
import { ContactabilityIndicator, PreCallBriefingAccount } from '../../types/preCallBriefing';
import {
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sparkles,
  ShieldCheck,
  Mail,
  Smartphone,
  Building,
} from 'lucide-react';

interface ContactabilityIndicatorsCardProps {
  indicators: ContactabilityIndicator[];
  account: PreCallBriefingAccount;
}

export const ContactabilityIndicatorsCard: React.FC<ContactabilityIndicatorsCardProps> = ({
  indicators,
  account,
}) => {
  const getChannelIcon = (channel: ContactabilityIndicator['channel']) => {
    switch (channel) {
      case 'PHONE_MOBILE':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-600" />;
      case 'PHONE_WORK':
        return <Building className="w-3.5 h-3.5 text-blue-600" />;
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <PhoneCall className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white shadow-2xs">
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
              7. Contactability Indicators & Telephony Readiness
            </h2>
            <div className="text-xs text-slate-600 font-sans">
              Right-Party Contact (RPC) probability scoring and timezone safe window verification.
            </div>
          </div>
        </div>

        {/* Timezone Status Seal */}
        <div className="flex items-center gap-2 font-mono text-xs bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-md border border-emerald-200">
          <Clock className="w-3.5 h-3.5 text-emerald-700" />
          <span className="font-bold">Debtor Local Time:</span>
          <span>{account.localTimeFormatted}</span>
        </div>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {indicators.map((ind) => (
          <div
            key={ind.contactId}
            className={`rounded-lg border p-3.5 space-y-2 transition-all ${
              ind.isPreferredChannel
                ? 'border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-200 shadow-2xs'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {getChannelIcon(ind.channel)}
                <span className="text-xs font-bold text-slate-900 font-mono">
                  {ind.label}
                </span>
              </div>
              {ind.isPreferredChannel && (
                <span className="bg-indigo-600 text-white text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold">
                  Recommended
                </span>
              )}
            </div>

            <div className="text-sm font-bold font-mono text-slate-900">
              {ind.value}
            </div>

            {/* RPC Likelihood Meter */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Predicted RPC Likelihood</span>
                <span className="font-bold text-emerald-700">
                  {(ind.predictedRpcRate * 100).toFixed(0)}% Probability
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${ind.predictedRpcRate * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] font-mono text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400">Optimal Window:</span>
                <span className="font-semibold text-slate-800">{ind.bestTimeWindow}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Prior Answer Ratio:</span>
                <span>{ind.historicalAnswerCount} of {ind.historicalAttemptCount} calls</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-emerald-700 font-semibold pt-0.5">
                <span>TCPA Consent: Active</span>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
