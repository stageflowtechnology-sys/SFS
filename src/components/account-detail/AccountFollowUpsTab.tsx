import React, { useState } from 'react';
import { FollowUpItem } from '../../types/accountDetail';
import {
  CalendarClock,
  Clock,
  Phone,
  MessageSquare,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

interface AccountFollowUpsTabProps {
  followUps: FollowUpItem[];
}

export const AccountFollowUpsTab: React.FC<AccountFollowUpsTabProps> = ({ followUps }) => {
  const [items, setItems] = useState<FollowUpItem[]>(followUps);

  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: item.status === 'COMPLETED' ? 'OPEN_PENDING' : 'COMPLETED',
          };
        }
        return item;
      })
    );
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
            HIGH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300">
            MEDIUM
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <CalendarClock className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Scheduled Follow-Ups & Collector Task Queue ({items.length} Tasks)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Operational reminders for cure payments, pre-legal reviews, and debtor milestone callbacks.
          </p>
        </div>
      </div>

      {/* Follow-Up List */}
      <div className="space-y-3">
        {items.map((fu) => (
          <div
            key={fu.id}
            className={`rounded-xl border p-4 transition-all space-y-2 ${
              fu.status === 'COMPLETED'
                ? 'border-slate-200 bg-slate-50/40 opacity-70'
                : 'border-slate-200 bg-white hover:border-indigo-200 hover:shadow-xs'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleComplete(fu.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                    fu.status === 'COMPLETED'
                      ? 'bg-emerald-600 border-emerald-700 text-white'
                      : 'border-slate-300 hover:border-indigo-500 bg-white'
                  }`}
                >
                  {fu.status === 'COMPLETED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold text-xs ${
                      fu.status === 'COMPLETED'
                        ? 'line-through text-slate-500'
                        : 'text-slate-900'
                    }`}
                  >
                    {fu.type.replace(/_/g, ' ')}
                  </span>
                  {getPriorityBadge(fu.priority)}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">
                  {fu.scheduledDate} • {fu.scheduledTime}
                </span>
              </div>
            </div>

            {/* Reason */}
            <p className="text-xs text-slate-700 font-sans pl-7 leading-relaxed">
              {fu.reason}
            </p>

            {/* Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 pl-7">
              <span>
                Assigned: <strong>{fu.assignedCollector}</strong> ({fu.assignedCollectorId})
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.2 rounded font-semibold uppercase">
                Target: {fu.targetChannel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
