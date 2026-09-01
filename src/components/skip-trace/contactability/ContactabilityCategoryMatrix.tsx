import React from 'react';
import {
  PhoneCall,
  Mail,
  Building2,
  Globe,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  ContactabilityCategory,
  ContactabilityCategorySummary,
} from '../../../types/contactability';

interface ContactabilityCategoryMatrixProps {
  categorySummaries: Record<ContactabilityCategory, ContactabilityCategorySummary>;
  selectedCategory: ContactabilityCategory | 'ALL';
  onSelectCategory: (category: ContactabilityCategory | 'ALL') => void;
}

export const ContactabilityCategoryMatrix: React.FC<ContactabilityCategoryMatrixProps> = ({
  categorySummaries,
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: ContactabilityCategory[] = [
    'PHONE',
    'EMAIL',
    'PROFESSIONAL',
    'SOCIAL',
    'GEOGRAPHIC',
  ];

  const getCategoryIcon = (cat: ContactabilityCategory) => {
    switch (cat) {
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

  const getBadgeColor = (cat: ContactabilityCategory, isSelected: boolean) => {
    if (isSelected) {
      return 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40';
    }
    return 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs';
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-mono">
            Contactability Vector Matrix (5 Channels)
          </h3>
          <span className="text-xs text-slate-500">• Filter ranked channels by vector</span>
        </div>

        {/* 'Show All' Filter Trigger */}
        <button
          onClick={() => onSelectCategory('ALL')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100 border border-slate-200 bg-white'
          }`}
        >
          View All Channels (Unified Leaderboard)
        </button>
      </div>

      {/* 5-Column Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {categories.map((cat) => {
          const summary = categorySummaries[cat];
          const isSelected = selectedCategory === cat;

          return (
            <div
              key={cat}
              onClick={() => onSelectCategory(isSelected ? 'ALL' : cat)}
              className={`rounded-xl border p-4 transition-all cursor-pointer flex flex-col justify-between relative group ${getBadgeColor(
                cat,
                isSelected
              )}`}
            >
              {/* Top Row: Icon & Name & Confidence */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 border border-slate-200/80 shadow-2xs">
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {cat}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      summary.highestConfidenceScore >= 85
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : summary.highestConfidenceScore >= 60
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {summary.highestConfidenceScore}%
                  </span>
                </div>

                <div className="text-[11px] font-medium text-slate-500 mt-2">
                  {summary.label}
                </div>

                {/* Primary Discovered Value */}
                <div className="mt-2.5 p-2 rounded bg-slate-50 border border-slate-100 text-xs">
                  <div className="font-bold text-slate-900 truncate font-mono text-[11px]" title={summary.topChannelValue}>
                    {summary.topChannelValue}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {summary.topChannelLabel}
                  </div>
                </div>
              </div>

              {/* Bottom Metrics: Channels count, success rate, compliance */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] space-y-1 text-slate-600 font-mono">
                <div className="flex items-center justify-between">
                  <span>Discovered:</span>
                  <span className="font-bold text-slate-800">
                    {summary.activeDeliverableCount}/{summary.totalChannelsDiscovered} Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hist. Conversion:</span>
                  <span className="font-bold text-slate-800">
                    {summary.historicalSuccessRate}%
                  </span>
                </div>
                <div className="text-[10px] text-indigo-700 font-semibold truncate pt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span className="truncate">{summary.complianceStatus}</span>
                </div>
              </div>

              {/* Active selection dot indicator */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
