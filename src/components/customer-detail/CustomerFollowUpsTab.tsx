import React, { useState } from 'react';
import { CustomerFollowUpTask } from '../../types/customerDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Plus,
  Filter,
  Check,
  CreditCard,
} from 'lucide-react';

interface CustomerFollowUpsTabProps {
  followUps: CustomerFollowUpTask[];
}

export const CustomerFollowUpsTab: React.FC<CustomerFollowUpsTabProps> = ({
  followUps: initialFollowUps,
}) => {
  const [followUpsList, setFollowUpsList] = useState<CustomerFollowUpTask[]>(initialFollowUps);
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New follow up form state
  const [newReason, setNewReason] = useState('');
  const [newDate, setNewDate] = useState('2026-09-05');
  const [newTime, setNewTime] = useState('10:00 AM PT');
  const [newPriority, setNewPriority] = useState<'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM'>('P2_HIGH');
  const [newChannel, setNewChannel] = useState<'VOICE' | 'SMS' | 'EMAIL'>('VOICE');

  const toggleComplete = (id: string) => {
    setFollowUpsList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : item
      )
    );
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReason.trim()) return;

    const newItem: CustomerFollowUpTask = {
      id: `FU-${Date.now().toString().slice(-4)}`,
      dueDate: newDate,
      scheduledTime: newTime,
      assignedCollector: 'Sarah Jenkins',
      assignedCollectorId: 'OP-7492',
      priority: newPriority,
      type: 'CALLBACK_REQUESTED',
      reason: newReason,
      targetChannel: newChannel,
      status: 'PENDING',
      origin: 'HUMAN_DECISION',
    };

    setFollowUpsList([newItem, ...followUpsList]);
    setNewReason('');
    setShowAddModal(false);
  };

  const filteredItems = followUpsList.filter((item) => {
    if (filterPriority === 'ALL') return true;
    return item.priority === filterPriority;
  });

  return (
    <div id="customer-follow-ups-tab" className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['ALL', 'P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterPriority === p
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p === 'ALL' ? 'All Priorities' : p.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Task</span>
        </button>
      </div>

      {/* Add Follow-Up Form (if opened) */}
      {showAddModal && (
        <form
          onSubmit={handleAddFollowUp}
          className="bg-slate-50 border border-indigo-200 p-5 rounded-xl space-y-4 shadow-xs animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950">
              Schedule Debtor Follow-up & SLA Callback
            </h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Due Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Scheduled Window</label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="P1_CRITICAL">P1 Critical</option>
                <option value="P2_HIGH">P2 High</option>
                <option value="P3_MEDIUM">P3 Medium</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Target Channel</label>
              <select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
              >
                <option value="VOICE">Voice Call</option>
                <option value="SMS">SMS Message</option>
                <option value="EMAIL">Email Follow-Up</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1 text-xs">
              Task Reason & Operational Notes
            </label>
            <textarea
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="e.g. Call debtor to verify clearance of settlement ACH tranche..."
              rows={2}
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
            >
              Commit Task to SLA Queue
            </button>
          </div>
        </form>
      )}

      {/* Follow-Ups Task Cards */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isDone = item.status === 'COMPLETED';

          return (
            <div
              key={item.id}
              className={`p-4 bg-white border rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                isDone ? 'border-slate-200 opacity-60 bg-slate-50' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    isDone
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 hover:border-slate-400 bg-white'
                  }`}
                  title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                >
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                        item.priority === 'P1_CRITICAL'
                          ? 'bg-rose-50 text-rose-800 border border-rose-200'
                          : item.priority === 'P2_HIGH'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.priority.replace('_', ' ')}
                    </span>

                    <span className="text-xs font-bold text-slate-900">
                      {item.type.replace(/_/g, ' ')}
                    </span>

                    <span className="text-slate-400 text-xs">•</span>
                    <span className="text-xs text-slate-500 font-medium">{item.assignedCollector}</span>
                    <OriginBadge origin={item.origin} size="sm" />
                  </div>

                  <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.reason}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center text-xs font-mono text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.dueDate}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.scheduledTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
