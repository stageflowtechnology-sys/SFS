import React, { useState } from 'react';
import { PastInteraction } from '../../types/workbench';
import {
  MessageSquare,
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  Mail,
  FileText,
  Volume2,
  Play,
  Pause,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  Shield,
} from 'lucide-react';

interface AccountInteractionsTabProps {
  interactions: PastInteraction[];
  onLogNewInteraction?: () => void;
}

export const AccountInteractionsTab: React.FC<AccountInteractionsTabProps> = ({
  interactions,
  onLogNewInteraction,
}) => {
  const [activePlaybackId, setActivePlaybackId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>('ALL');

  const filteredInteractions = interactions.filter((it) => {
    if (channelFilter === 'ALL') return true;
    return it.channel === channelFilter;
  });

  const getChannelIcon = (channel: string, direction: string) => {
    if (channel === 'VOICE') {
      return direction === 'INBOUND' ? (
        <PhoneIncoming className="w-4 h-4 text-emerald-600" />
      ) : (
        <PhoneOutgoing className="w-4 h-4 text-indigo-600" />
      );
    }
    if (channel === 'SMS') {
      return <MessageSquare className="w-4 h-4 text-cyan-600" />;
    }
    if (channel === 'EMAIL') {
      return <Mail className="w-4 h-4 text-sky-600" />;
    }
    return <FileText className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Omnichannel Interactions History ({filteredInteractions.length} Records)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Full compliance call audio logs, SMS threads, emails, and collector notes with operator signatures.
          </p>
        </div>

        {/* Channel Filters */}
        <div className="flex items-center gap-1.5">
          {['ALL', 'VOICE', 'SMS', 'EMAIL'].map((ch) => (
            <button
              key={ch}
              onClick={() => setChannelFilter(ch)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                channelFilter === ch
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* List of Interactions */}
      <div className="space-y-3">
        {filteredInteractions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white p-4 transition-all space-y-3"
          >
            {/* Top Bar: Channel, Direction, Date, Operator & Disposition */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {getChannelIcon(item.channel, item.direction)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 font-mono">
                      {item.channel} • {item.direction}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                      {item.disposition}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Logged by {item.operatorName} (Op #{item.operatorId})
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-500 font-semibold">
                {item.timestamp}
              </span>
            </div>

            {/* Note / Transcript Summary */}
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {item.summary}
            </p>

            {/* PTP / Settlement Contract Highlight if present */}
            {item.ptpAmount && (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Promise to Pay Established:</span>
                </div>
                <span className="font-bold text-emerald-950">
                  ${item.ptpAmount.toLocaleString()} due on {item.ptpDueDate}
                </span>
              </div>
            )}

            {/* Audio Recording Player Strip if voice */}
            {item.recordingDuration && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setActivePlaybackId(activePlaybackId === item.id ? null : item.id)
                    }
                    className="p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    {activePlaybackId === item.id ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span className="text-slate-800 font-semibold">
                    Call Audio Recording ({item.recordingDuration})
                  </span>
                </div>

                <span className="text-[10px] text-slate-400">
                  SHA-256 Verified Telephony Archive
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
