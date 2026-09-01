import React from 'react';
import { ReachableChannel } from '../../types/skipTrace';
import { IdentityBandBadge } from './IdentityBandBadge';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Radio,
  ShieldCheck,
  Star,
  ExternalLink,
} from 'lucide-react';

interface ReachableChannelsListProps {
  channels: ReachableChannel[];
  onDialChannel: (channel: ReachableChannel) => void;
  onSendEmail: (channel: ReachableChannel) => void;
}

export const ReachableChannelsList: React.FC<ReachableChannelsListProps> = ({
  channels,
  onDialChannel,
  onSendEmail,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'PHONE_MOBILE':
      case 'PHONE_LANDLINE':
      case 'PHONE_WORK':
        return PhoneCall;
      case 'EMAIL':
        return Mail;
      case 'PHYSICAL_MAIL':
        return MapPin;
      default:
        return Radio;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Likely Reachable Channels
            </h3>
            <p className="text-[11px] text-slate-500">
              Ranked by carrier reachability index & TCPA compliance
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {channels.length} Validated Endpoints
        </span>
      </div>

      {channels.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h4 className="text-xs font-bold text-slate-800">No Reachable Channels Active</h4>
          <p className="text-[11px] text-slate-500 max-w-md mx-auto">
            Outreach is currently paused or no valid communication endpoints have been confirmed. Run an investigation to discover fresh channels.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {channels.map((channel) => {
            const ChannelIcon = getChannelIcon(channel.channelType);
            const isPhone = channel.channelType.startsWith('PHONE');
            const isEmail = channel.channelType === 'EMAIL';

            return (
              <div
                key={channel.id}
                id={`reachable-channel-${channel.id}`}
                className={`border rounded-xl p-4 transition-all ${
                  channel.isTopRecommended
                    ? 'border-indigo-300 bg-indigo-50/30 ring-1 ring-indigo-200 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Channel Left Metadata */}
                  <div className="flex items-start gap-3.5">
                    {/* Rank Badge */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          channel.rank === 1
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        #{channel.rank}
                      </div>
                      {channel.isTopRecommended && (
                        <span className="text-[9px] font-bold text-indigo-700 font-mono uppercase mt-1">
                          TOP
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {channel.label}
                        </span>
                        <IdentityBandBadge band={channel.identityBand} size="sm" />
                        {channel.tcpaStatus === 'CONSENT_RECORDED' && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            TCPA Consent
                          </span>
                        )}
                        {channel.tcpaStatus === 'EXEMPT_MANUAL_DIAL' && (
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                            Manual Dial
                          </span>
                        )}
                      </div>

                      {/* Channel Value */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold font-mono text-slate-900">
                          {channel.value}
                        </span>
                        <button
                          onClick={() => handleCopy(channel.id, channel.value)}
                          title="Copy channel value"
                          className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                        >
                          {copiedId === channel.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Carrier / Line Info */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {channel.carrier && (
                          <span>Carrier: <strong className="text-slate-700">{channel.carrier}</strong></span>
                        )}
                        {channel.lineType && (
                          <span>Type: <strong className="text-slate-700">{channel.lineType}</strong></span>
                        )}
                        {channel.lastContactAttempt && (
                          <span>Last Attempt: {channel.lastContactAttempt}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Timezone, FDCPA Window, Reachability Score & Action Button */}
                  <div className="flex flex-wrap items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Timezone & Window */}
                    <div className="text-left lg:text-right space-y-0.5">
                      <div className="flex items-center lg:justify-end gap-1.5 text-xs font-mono font-bold text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{channel.localTime}</span>
                        <span className="text-slate-400 font-normal">({channel.timezone.split(' ')[0]})</span>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium">
                        {channel.inFdcpaWindow ? '✓ In FDCPA Window' : '⚠ Outside Hours'}
                      </div>
                    </div>

                    {/* Reachability Score Gauge */}
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 min-w-[75px]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">
                        Reachability
                      </span>
                      <span className="text-base font-black font-mono text-indigo-900">
                        {channel.reachabilityScore}%
                      </span>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isPhone ? (
                        <button
                          onClick={() => onDialChannel(channel)}
                          id={`btn-dial-${channel.id}`}
                          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Dial Line</span>
                        </button>
                      ) : isEmail ? (
                        <button
                          onClick={() => onSendEmail(channel)}
                          id={`btn-email-${channel.id}`}
                          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Notice</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCopy(channel.id, channel.value)}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors border border-slate-300"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Address</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
