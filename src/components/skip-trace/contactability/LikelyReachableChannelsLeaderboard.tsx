import React, { useState } from 'react';
import {
  PhoneCall,
  Mail,
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  Info,
  Scale,
  Award,
  AlertCircle,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import {
  ContactabilityChannel,
  ContactabilityCategory,
} from '../../../types/contactability';
import { IdentityBandBadge } from '../IdentityBandBadge';

interface LikelyReachableChannelsLeaderboardProps {
  channels: ContactabilityChannel[];
  selectedCategory: ContactabilityCategory | 'ALL';
  onInspectHistory: (channel: ContactabilityChannel) => void;
  onSelectChannelAction?: (channel: ContactabilityChannel, actionType: string) => void;
}

export const LikelyReachableChannelsLeaderboard: React.FC<LikelyReachableChannelsLeaderboardProps> = ({
  channels,
  selectedCategory,
  onInspectHistory,
  onSelectChannelAction,
}) => {
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleReasoning = (id: string) => {
    setExpandedReasoningIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter channels if category selected
  const displayChannels = selectedCategory === 'ALL'
    ? channels
    : channels.filter((c) => c.category === selectedCategory);

  // Sorted by reachabilityRank (1 = strongest)
  const rankedChannels = [...displayChannels].sort((a, b) => a.reachabilityRank - b.reachabilityRank);

  const getCategoryIcon = (category: ContactabilityCategory) => {
    switch (category) {
      case 'PHONE':
        return <PhoneCall className="w-4 h-4 text-indigo-600" />;
      case 'EMAIL':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'PROFESSIONAL':
        return <Building2 className="w-4 h-4 text-emerald-600" />;
      case 'SOCIAL':
        return <Globe className="w-4 h-4 text-violet-600" />;
      case 'GEOGRAPHIC':
        return <MapPin className="w-4 h-4 text-amber-600" />;
    }
  };

  const getFreshnessBadge = (freshness: string, days: number) => {
    if (freshness === 'CURRENT_ACTIVE') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active ({days}d ago)</span>
        </span>
      );
    }
    if (freshness === 'RECENT_30D') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
          <span>Recent ({days}d ago)</span>
        </span>
      );
    }
    if (freshness === 'AGING_90D') {
      return (
        <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200">
          <span>Aging ({days}d ago)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 border border-slate-200">
        <span>Stale ({days}d ago)</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
              Likely Reachable Channels — Ranked Strongest to Weakest
            </h3>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">
            Ranked by multi-factor algorithmic weight: live carrier state, identity concordance, historical RPC conversion, and FDCPA compliance window.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <span>Showing {rankedChannels.length} of {channels.length} Channels</span>
        </div>
      </div>

      {/* Ranked Channels List */}
      <div className="space-y-4">
        {rankedChannels.map((channel) => {
          const isExpanded = expandedReasoningIds[channel.id] ?? true; // expanded by default for full reasoning display
          const isTopOne = channel.reachabilityRank === 1;

          return (
            <div
              key={channel.id}
              className={`rounded-xl border transition-all overflow-hidden ${
                isTopOne
                  ? 'border-indigo-300 bg-linear-to-b from-indigo-50/30 to-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Channel Header Bar */}
              <div className="p-4 sm:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Rank & Icon & Channel Identity */}
                  <div className="flex items-start gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono font-bold text-base shadow-2xs border ${
                        isTopOne
                          ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-400/30'
                          : channel.reachabilityRank === 2
                          ? 'bg-slate-800 text-white border-slate-900'
                          : channel.reachabilityRank === 3
                          ? 'bg-slate-700 text-white border-slate-800'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      #{channel.reachabilityRank}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 border border-slate-200">
                          {getCategoryIcon(channel.category)}
                          <span>{channel.category}</span>
                        </span>

                        <span className="text-xs font-semibold text-slate-600">
                          {channel.channelType}
                        </span>

                        {isTopOne && (
                          <span className="inline-flex items-center gap-1 rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                            <Sparkles className="w-3 h-3" />
                            <span>#1 PRIMARY RECOMMENDED</span>
                          </span>
                        )}

                        {/* Confidence Cap Enforcement Tag */}
                        {channel.confidenceCapEnforced && (
                          <span className="inline-flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-700" />
                            <span>Confidence Capped (POSSIBLE Match)</span>
                          </span>
                        )}
                      </div>

                      {/* Channel Value & Label */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-base font-bold text-slate-900 font-mono tracking-tight">
                          {channel.value}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          ({channel.label})
                        </span>
                        <button
                          onClick={() => handleCopy(channel.id, channel.value)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors"
                          title="Copy channel value"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedId === channel.id && (
                          <span className="text-[10px] text-emerald-600 font-bold font-mono animate-fade-in">
                            Copied!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Confidence Score, Recency, Historical Quick Metric & Action */}
                  <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
                    {/* Confidence Score Pill */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                          Confidence
                        </span>
                        <span
                          className={`font-mono text-sm font-bold px-2.5 py-0.5 rounded-md border ${
                            channel.confidenceScore >= 85
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : channel.confidenceScore >= 60
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          {channel.confidenceScore}% ({channel.confidenceLevel})
                        </span>
                      </div>
                      {channel.confidenceCapReason && (
                        <span className="text-[9px] text-amber-700 font-mono text-right max-w-[200px] truncate">
                          {channel.confidenceCapReason}
                        </span>
                      )}
                    </div>

                    {/* Freshness Badge */}
                    {getFreshnessBadge(channel.recency.freshnessStatus, channel.recency.daysSinceObserved)}

                    {/* History Inspector Trigger */}
                    <button
                      onClick={() => onInspectHistory(channel)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                      title="View chronological attempt history and audit log"
                    >
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>{channel.historicalSuccessFailure.totalAttempts} Logged</span>
                    </button>

                    {/* Expand/Collapse Reasoning Button */}
                    <button
                      onClick={() => toggleReasoning(channel.id)}
                      className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Collapse reasoning details' : 'Expand full reasoning'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Core Attributes Bar: Source, Recency, Historical Success/Failure, Identity Relationship */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* 1. Source & Statutory Provenance */}
                  <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                      <Scale className="w-3 h-3 text-slate-400" />
                      <span>Source & Provenance</span>
                    </span>
                    <div className="font-semibold text-slate-900 text-[11px] truncate" title={channel.source}>
                      {channel.source}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate" title={channel.statutoryCitation}>
                      {channel.statutoryCitation}
                    </div>
                  </div>

                  {/* 2. Recency & Freshness */}
                  <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>Recency & Freshness</span>
                    </span>
                    <div className="font-semibold text-slate-900 text-[11px]">
                      {channel.recency.lastObservedDate}
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1" title={channel.recency.cadenceDescription}>
                      {channel.recency.cadenceDescription}
                    </div>
                  </div>

                  {/* 3. Historical Success / Failure Track Record */}
                  <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-slate-400" />
                      <span>Historical Conversion</span>
                    </span>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-900">
                        {channel.historicalSuccessFailure.successRatePct}% Success
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        ({channel.historicalSuccessFailure.successfulAttempts}/{channel.historicalSuccessFailure.totalAttempts})
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 truncate" title={channel.historicalSuccessFailure.lastOutcome}>
                      Last: {channel.historicalSuccessFailure.lastOutcome}
                    </div>
                  </div>

                  {/* 4. Identity Relationship & Concordance */}
                  <div className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                        Identity Relationship
                      </span>
                      <IdentityBandBadge band={channel.identityRelationship.band} />
                    </div>
                    <div className="font-semibold text-slate-900 text-[11px] truncate">
                      {channel.identityRelationship.subjectName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate" title={channel.identityRelationship.rationale}>
                      {channel.identityRelationship.relationshipType.replace('_', ' ')} • {channel.identityRelationship.concordanceScore}% Concordance
                    </div>
                  </div>
                </div>

                {/* Identity Warning Alert if Name-Only Match or Possible Band */}
                {channel.identityRelationship.warningNotice && (
                  <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-semibold text-[11px]">{channel.identityRelationship.warningNotice}</span>
                  </div>
                )}
              </div>

              {/* Detailed Reasoning & Recommendations Panel (Collapsible) */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50/50 p-4 sm:p-5 space-y-3.5 text-xs">
                  {/* Primary Rank Justification */}
                  <div className="flex items-start gap-2.5">
                    <div className="p-1 rounded bg-indigo-100 text-indigo-800 shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">Recommendation Rationale: </span>
                      <span className="text-slate-700 font-medium leading-relaxed">
                        {channel.recommendationReasoning.primaryRankReason}
                      </span>
                    </div>
                  </div>

                  {/* Strengths & Corroborating Signals */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                      <div className="font-bold text-emerald-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Corroborating Strength Factors</span>
                      </div>
                      <ul className="space-y-1 text-slate-600 text-xs list-disc list-inside">
                        {channel.recommendationReasoning.strengthFactors.map((strength, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Risks, Caveats & Statutory Safeguards */}
                    <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                      <div className="font-bold text-amber-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wide font-mono">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Compliance Caveats & Legal Safeguards</span>
                      </div>
                      <ul className="space-y-1 text-slate-600 text-xs list-disc list-inside">
                        {channel.recommendationReasoning.caveatsAndRisks.map((caveat, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {caveat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Guidance Strip */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-indigo-950">
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs flex items-center gap-1.5 text-indigo-900">
                        <span>Action Directive:</span>
                        <span className="font-normal text-indigo-800">{channel.recommendationReasoning.actionGuidance}</span>
                      </div>
                      <div className="text-[11px] text-indigo-700 font-mono">
                        Optimal Window: <strong>{channel.recommendationReasoning.optimalContactWindow}</strong>
                      </div>
                    </div>

                    {/* Direct Action Trigger */}
                    {onSelectChannelAction && (
                      <div className="flex items-center gap-2 shrink-0">
                        {channel.category === 'PHONE' && (
                          <button
                            onClick={() => onSelectChannelAction(channel, 'DIAL')}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-2xs transition-colors flex items-center gap-1.5"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Launch Dial Session</span>
                          </button>
                        )}
                        {channel.category === 'EMAIL' && (
                          <button
                            onClick={() => onSelectChannelAction(channel, 'EMAIL')}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors flex items-center gap-1.5"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Compose Statement</span>
                          </button>
                        )}
                        {channel.category === 'GEOGRAPHIC' && (
                          <button
                            onClick={() => onSelectChannelAction(channel, 'MAIL')}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-2xs transition-colors flex items-center gap-1.5"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Generate Validation Notice</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {rankedChannels.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-2">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-800">No channels found in this category</div>
            <p className="text-xs text-slate-500">
              Clear the active category filter to view all reachable contact channels.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
