import React, { useState } from 'react';
import { TimelineEvent } from '../../types/accountDetail';
import { StateOrigin } from '../../types/design-system';
import { OriginBadge } from '../ui/OriginBadge';
import { StatusPill } from '../ui/StatusPill';
import {
  GitCommit,
  Calendar,
  Filter,
  DollarSign,
  Phone,
  Scale,
  ShieldAlert,
  Layers,
  ArrowDown,
  User,
  Cpu,
  Building,
  CheckCircle2,
  AlertOctagon,
  Clock,
} from 'lucide-react';

interface AccountTimelineTabProps {
  timeline: TimelineEvent[];
}

export const AccountTimelineTab: React.FC<AccountTimelineTabProps> = ({ timeline }) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Milestones' },
    { id: 'STAGE_CHANGE', label: 'Stage Changes' },
    { id: 'PTP', label: 'Promise to Pay' },
    { id: 'PAYMENT', label: 'Payments' },
    { id: 'COMMUNICATION', label: 'Communications' },
    { id: 'COMPLIANCE', label: 'Compliance & Legal' },
  ];

  const filteredEvents = timeline.filter((ev) => {
    if (filterCategory === 'ALL') return true;
    return ev.category === filterCategory;
  });

  const getActorIcon = (actorType: string) => {
    switch (actorType) {
      case 'SYSTEM':
        return <Cpu className="w-3.5 h-3.5 text-cyan-600" />;
      case 'COLLECTOR':
        return <User className="w-3.5 h-3.5 text-amber-600" />;
      case 'DEBTOR':
        return <User className="w-3.5 h-3.5 text-indigo-600" />;
      case 'COURT':
        return <Scale className="w-3.5 h-3.5 text-slate-700" />;
      default:
        return <GitCommit className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header with Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <GitCommit className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Collection Lifecycle Timeline ({filteredEvents.length} Milestones)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Chronological audit of all stage transitions, debtor responses, and financial ledger events.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filteredEvents.map((ev, index) => (
          <div key={ev.id} className="relative group">
            {/* Timeline node icon */}
            <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
            </div>

            {/* Event Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-xs p-4 transition-all space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{ev.title}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                    {ev.stage}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <OriginBadge origin={ev.origin} size="sm" />
                  <span className="text-[11px] font-mono text-slate-500">{ev.date}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {ev.description}
              </p>

              {/* Actor & Classification Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  {getActorIcon(ev.actorType)}
                  <span>Actor: <strong>{ev.actorName}</strong> ({ev.actorType})</span>
                </div>
                <span className="text-[10px] bg-slate-200/70 text-slate-700 px-2 py-0.2 rounded font-semibold uppercase">
                  {ev.category.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
