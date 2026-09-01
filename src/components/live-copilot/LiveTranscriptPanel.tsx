/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { TranscriptUtterance, RecognizedEntity } from '../../types/liveCopilot';
import {
  Mic,
  Volume2,
  Search,
  Bookmark,
  Sparkles,
  Clock,
  ArrowDown,
  User,
  ShieldCheck,
  Zap,
  Activity,
  Play,
  Pause,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface LiveTranscriptPanelProps {
  utterances: TranscriptUtterance[];
  currentSpeaker: 'collector' | 'debtor' | 'silence';
  isLiveStreaming: boolean;
  onBookmarkUtterance?: (id: string) => void;
  onSimulateNextUtterance?: () => void;
  hasMoreUtterances?: boolean;
}

export const LiveTranscriptPanel: React.FC<LiveTranscriptPanelProps> = ({
  utterances,
  currentSpeaker,
  isLiveStreaming,
  onBookmarkUtterance,
  onSimulateNextUtterance,
  hasMoreUtterances,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState<'all' | 'collector' | 'debtor'>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new utterances arrive
  useEffect(() => {
    if (autoScroll && transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [utterances, autoScroll]);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    onBookmarkUtterance?.(id);
  };

  const filteredUtterances = utterances.filter((u) => {
    if (speakerFilter !== 'all' && u.speaker !== speakerFilter) return false;
    if (searchQuery.trim() && !u.text.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getSentimentBadge = (sentiment?: string) => {
    switch (sentiment) {
      case 'cooperative':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'defensive':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'hesitant':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      case 'frustrated':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'urgent':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'conciliatory':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getEntityBadge = (type: string) => {
    switch (type) {
      case 'currency':
        return 'bg-emerald-100/80 text-emerald-900 border-emerald-300 font-semibold';
      case 'date':
        return 'bg-sky-100/80 text-sky-900 border-sky-300 font-semibold';
      case 'hardship':
        return 'bg-amber-100/80 text-amber-900 border-amber-300 font-semibold';
      case 'entity':
        return 'bg-indigo-100/80 text-indigo-900 border-indigo-300 font-semibold';
      case 'compliance':
        return 'bg-purple-100/80 text-purple-900 border-purple-300 font-semibold';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  return (
    <div
      id="center-live-transcript-panel"
      className="flex-1 flex flex-col h-full bg-white overflow-hidden"
    >
      {/* Transcript Header with Audio Telemetry */}
      <div className="border-b border-slate-200 bg-slate-50/80 px-4 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute top-0 left-0 animate-ping opacity-75" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">
                  Live Audio Transcript
                </h3>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-200/80 text-slate-700">
                  Dual-Channel 16kHz
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                DeepGram Nova-2 • 140ms latency • Active Channel
              </span>
            </div>
          </div>
        </div>

        {/* Live Speaking Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
            <Volume2 className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-700">
              Active Channel:{' '}
              <strong className="text-slate-900 font-bold">
                {currentSpeaker === 'collector'
                  ? 'Agent (Mic 1)'
                  : currentSpeaker === 'debtor'
                  ? 'Debtor (Inbound 2)'
                  : 'Awaiting Audio'}
              </strong>
            </span>
          </div>

          {hasMoreUtterances && (
            <button
              onClick={onSimulateNextUtterance}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold shadow-2xs transition-colors"
              title="Stream the next conversational turn in real-time"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Next Turn</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="px-4 py-2 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search transcript text, dollars, dates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Speaker Filters */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
            {(['all', 'collector', 'debtor'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSpeakerFilter(mode)}
                className={`px-2 py-0.5 rounded text-[11px] capitalize transition-all ${
                  speakerFilter === mode
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'all' ? 'All Channels' : mode}
              </button>
            ))}
          </div>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded text-[11px] font-medium border flex items-center gap-1 transition-colors ${
              autoScroll
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title="Auto-scroll to latest incoming speech"
          >
            <ArrowDown className={`w-3 h-3 ${autoScroll ? 'text-indigo-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">Auto-Scroll</span>
          </button>
        </div>
      </div>

      {/* Utterance Stream Container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30"
      >
        {filteredUtterances.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No matching utterances found for &ldquo;{searchQuery}&rdquo;.
          </div>
        ) : (
          filteredUtterances.map((u) => {
            const isCollector = u.speaker === 'collector';
            const isBookmarked = bookmarkedIds[u.id];

            return (
              <div
                key={u.id}
                id={`utterance-${u.id}`}
                className={`flex flex-col group transition-all ${
                  isCollector ? 'items-start' : 'items-start'
                }`}
              >
                {/* Speaker Tag & Timestamp */}
                <div className="flex items-center gap-2 mb-1 text-[11px]">
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isCollector ? 'text-indigo-700' : 'text-amber-800'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isCollector ? 'bg-indigo-600' : 'bg-amber-600'
                      }`}
                    />
                    {u.speakerName}
                  </span>

                  <span className="text-slate-400 font-mono text-[10px]">
                    {u.timestamp}
                  </span>

                  {u.sentiment && (
                    <span
                      className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 rounded border ${getSentimentBadge(
                        u.sentiment
                      )}`}
                    >
                      {u.sentiment}
                    </span>
                  )}

                  {u.metrics?.speechRateWpm && (
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      {u.metrics.speechRateWpm} wpm
                    </span>
                  )}

                  <button
                    onClick={() => toggleBookmark(u.id)}
                    className={`p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${
                      isBookmarked ? 'opacity-100 text-amber-500' : 'text-slate-300 hover:text-slate-600'
                    }`}
                    title="Bookmark utterance for audit"
                  >
                    <Bookmark className="w-3 h-3" />
                  </button>
                </div>

                {/* Utterance Content Bubble */}
                <div
                  className={`max-w-3xl rounded-xl p-3 border shadow-2xs text-xs leading-relaxed transition-all ${
                    isCollector
                      ? 'bg-white border-indigo-100 text-slate-800'
                      : 'bg-white border-amber-200/90 text-slate-900'
                  }`}
                >
                  <p className="leading-relaxed font-normal select-text">
                    {u.text}
                  </p>

                  {/* Highlighted Entities Pill Bar */}
                  {u.entities && u.entities.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
                        <Sparkles className="w-2.5 h-2.5 text-violet-500" />
                        Entities:
                      </span>
                      {u.entities.map((ent, idx) => (
                        <span
                          key={idx}
                          title={ent.tooltip || ent.type}
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border cursor-help ${getEntityBadge(
                            ent.type
                          )}`}
                        >
                          <span>{ent.text}</span>
                          {ent.tooltip && (
                            <span className="text-[8px] opacity-75 font-sans font-normal">
                              ({ent.type})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Compliance Verification Tags */}
                  {u.complianceTags && u.complianceTags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap items-center gap-1">
                      {u.complianceTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          <ShieldCheck className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
};
