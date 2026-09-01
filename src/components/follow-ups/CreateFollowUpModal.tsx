import React, { useState } from 'react';
import {
  X,
  CalendarClock,
  Phone,
  MessageSquare,
  Mail,
  FileCheck,
  UserCheck,
  Calendar,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { FollowUpItem, FollowUpType, FollowUpPriority } from '../../types/followUps';

interface CreateFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (item: FollowUpItem) => void;
  currentOperatorId?: string;
}

export const CreateFollowUpModal: React.FC<CreateFollowUpModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  currentOperatorId = 'OP-402',
}) => {
  const [accountNumber, setAccountNumber] = useState('ACC-89104');
  const [customerName, setCustomerName] = useState('Marcus Vance');
  const [phone, setPhone] = useState('(415) 882-9014');
  const [email, setEmail] = useState('m.vance@vancetech.io');
  const [reason, setReason] = useState('');
  const [type, setType] = useState<FollowUpType>('CALL');
  const [priority, setPriority] = useState<FollowUpPriority>('HIGH');
  const [dueDateText, setDueDateText] = useState('Tomorrow, 10:00 AM');
  const [recommendedActionText, setRecommendedActionText] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const newItem: FollowUpItem = {
      id: `FU-${Math.floor(1000 + Math.random() * 9000)}`,
      account: {
        id: accountNumber,
        accountNumber: accountNumber,
        originalCreditor: 'Apex Primary Recovery',
        portfolio: 'Standard Active Placements',
        balance: 24500.0,
        principalAmount: 22000.0,
        daysPastDue: 95,
        currentStage: 'STAGE_04_NEGOTIATION',
      },
      customer: {
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        name: customerName,
        phone: phone,
        email: email,
        ssnMasked: '***-**-8812',
        timezone: 'EST (UTC-5)',
        riskLevel: 'MEDIUM',
      },
      reason: reason,
      type: type,
      dueDate: dueDateText,
      dueTimestamp: Date.now() + 24 * 3600 * 1000,
      collector: {
        id: currentOperatorId,
        name: 'Armando Santiago',
        initials: 'AS',
        avatarColor: 'bg-indigo-600',
        isCurrentUser: true,
      },
      source: {
        origin: 'MANUAL',
        sourceName: `Manual: Armando Santiago (${currentOperatorId})`,
        createdBy: `Armando Santiago (${currentOperatorId})`,
        createdAt: 'Just now',
      },
      status: 'PENDING',
      recommendedAction: {
        label: recommendedActionText || `Execute ${type}`,
        actionType: type,
        description: `Manual directive: ${reason}`,
        urgency: priority,
      },
      priority: priority,
      notes: notes,
      tags: ['Manual Directive'],
    };

    onCreate(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Schedule New Follow-Up
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Manual Operator Directive • Reg-F Compliant
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
                Account Number *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
                Customer Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
                Customer Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Follow-Up Type Selection */}
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1.5">
              Follow-Up Type *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['CALL', 'SMS', 'EMAIL', 'REVIEW'] as FollowUpType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold flex flex-col items-center gap-1 transition-colors ${
                    type === t
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t === 'CALL' && <Phone className="w-4 h-4 text-indigo-600" />}
                  {t === 'SMS' && <MessageSquare className="w-4 h-4 text-sky-600" />}
                  {t === 'EMAIL' && <Mail className="w-4 h-4 text-emerald-600" />}
                  {t === 'REVIEW' && <FileCheck className="w-4 h-4 text-amber-600" />}
                  <span>{t}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
              Follow-Up Operational Reason *
            </label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Debtor promised $2,500 wire payment on Friday; call to verify transaction receipt."
              rows={2}
              className="w-full p-2.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
                Due Date & Time
              </label>
              <input
                type="text"
                value={dueDateText}
                onChange={(e) => setDueDateText(e.target.value)}
                placeholder="e.g. Tomorrow, 2:30 PM"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as FollowUpPriority)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
              >
                <option value="CRITICAL">Critical (SLA High)</option>
                <option value="HIGH">High Priority</option>
                <option value="NORMAL">Normal</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
              Recommended Action Label
            </label>
            <input
              type="text"
              value={recommendedActionText}
              onChange={(e) => setRecommendedActionText(e.target.value)}
              placeholder="e.g. Call Debtor Direct, Send Settlement SMS"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
              Internal Collector Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional operational details..."
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Follow-Up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
