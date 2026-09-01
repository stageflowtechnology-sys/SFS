import React, { useState } from 'react';
import { CustomerInteractionItem } from '../../types/customerDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  Phone,
  MessageSquare,
  Mail,
  FileText,
  Play,
  Pause,
  Clock,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Volume2,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface CustomerInteractionsTabProps {
  interactions: CustomerInteractionItem[];
}

export const CustomerInteractionsTab: React.FC<CustomerInteractionsTabProps> = ({
  interactions,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedTranscripts, setExpandedTranscripts] = useState<Record<string, boolean>>({});
  const [playingId, setPlayingId] = useState<string | null>(null);

  const toggleTranscript = (id: string) => {
    setExpandedTranscripts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlayAudio = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const filteredInteractions = interactions.filter((int) => {
    const matchesChannel =
      selectedChannel === 'ALL' ||
      (selectedChannel === 'VOICE' && int.type === 'CALL') ||
      (selectedChannel === 'SMS' && int.type === 'SMS') ||
      (selectedChannel === 'EMAIL' && int.type === 'EMAIL');

    const matchesSearch =
      int.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      int.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (int.transcript && int.transcript.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesChannel && matchesSearch;
  });

  return (
    <div id="customer-interactions-tab" className="space-y-6">
      {/* Controls & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'VOICE', 'SMS', 'EMAIL'].map((ch) => (
            <button
              key={ch}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedChannel === ch
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ch === 'ALL' ? 'All Channels' : ch}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcripts, operators, summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Interactions Feed */}
      <div className="space-y-4">
        {filteredInteractions.map((int) => {
          const isExpanded = expandedTranscripts[int.id];
          const isPlaying = playingId === int.id;

          return (
            <div
              key={int.id}
              className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden"
            >
              {/* Interaction Header Strip */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-700 shadow-2xs">
                    {int.type === 'CALL' ? (
                      <Phone className="w-4 h-4 text-emerald-600" />
                    ) : int.type === 'SMS' ? (
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Mail className="w-4 h-4 text-purple-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{int.channel} Touchpoint</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{int.operatorName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {new Date(int.timestamp).toLocaleString()}
                      {int.durationSeconds && ` • Duration: ${Math.floor(int.durationSeconds / 60)}m ${int.durationSeconds % 60}s`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono text-[11px] font-bold rounded-md border border-slate-200">
                    {int.disposition}
                  </span>
                  <OriginBadge origin={int.origin} size="sm" />
                </div>
              </div>

              {/* Interaction Content */}
              <div className="p-5 space-y-4">
                {/* Audio Recording Player (if voice call) */}
                {int.type === 'CALL' && int.recordingUrl && (
                  <div className="p-3 bg-slate-900 text-white rounded-lg flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlayAudio(int.id)}
                        className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-colors shadow-xs"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {isPlaying ? 'Playing Lossless Stereo Call Audio' : 'Call Recording Audio'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {isPlaying ? '01:14 / 06:22' : 'Full Duration: 382 seconds • 24-bit PCM'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="hidden sm:flex items-center gap-1">
                        {[40, 65, 80, 50, 95, 30, 70, 85, 40, 60, 90, 45, 75, 30, 85].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full transition-all ${
                              isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-slate-700'
                            }`}
                            style={{ height: `${h * 0.25}px` }}
                          />
                        ))}
                      </div>
                      <Volume2 className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* Structured Summary */}
                <div className="space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    Interaction Summary & Outcomes
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {int.summary}
                  </p>
                </div>

                {/* Key Takeaways & Compliance */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {int.complianceFlags.map((flag, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-medium rounded border border-emerald-200"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {flag}
                      </span>
                    ))}
                  </div>

                  {int.transcript && (
                    <button
                      onClick={() => toggleTranscript(int.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Full Transcript' : 'Show Full Transcript'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Expandable Verbatim Transcript */}
                {isExpanded && int.transcript && (
                  <div className="mt-3 p-4 bg-slate-900 text-slate-200 text-xs font-mono rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[10px] uppercase font-bold text-indigo-400 mb-2 border-b border-slate-800 pb-1">
                      Verbatim Speech-to-Text Transcript (Verified)
                    </div>
                    {int.transcript}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
