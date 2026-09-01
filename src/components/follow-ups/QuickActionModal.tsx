import React, { useState } from 'react';
import {
  X,
  Phone,
  PhoneCall,
  MessageSquare,
  Mail,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Sparkles,
} from 'lucide-react';
import { FollowUpItem } from '../../types/followUps';

interface QuickActionModalProps {
  item: FollowUpItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmComplete: (item: FollowUpItem, notes: string) => void;
  onConfirmSnooze: (item: FollowUpItem, hours: number) => void;
  onConfirmCancel: (item: FollowUpItem, reason: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  item,
  isOpen,
  onClose,
  onConfirmComplete,
  onConfirmSnooze,
  onConfirmCancel,
}) => {
  const [activeMode, setActiveMode] = useState<'EXECUTE' | 'SNOOZE' | 'COMPLETE' | 'CANCEL'>('EXECUTE');
  const [callStatus, setCallStatus] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'COMPLETED'>('IDLE');
  const [smsBody, setSmsBody] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [reviewChecked, setReviewChecked] = useState<Record<string, boolean>>({
    step1: true,
    step2: false,
    step3: false,
  });
  const [notes, setNotes] = useState('');
  const [selectedHours, setSelectedHours] = useState(24);
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen || !item) return null;

  const handleDial = () => {
    setCallStatus('DIALING');
    setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1200);
  };

  const handleHangup = () => {
    setCallStatus('COMPLETED');
  };

  const handleFinishExecution = () => {
    onConfirmComplete(item, notes || `Executed ${item.type} action successfully.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
              {item.type === 'CALL' && <Phone className="w-4 h-4" />}
              {item.type === 'SMS' && <MessageSquare className="w-4 h-4" />}
              {item.type === 'EMAIL' && <Mail className="w-4 h-4" />}
              {item.type === 'REVIEW' && <FileCheck className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {item.recommendedAction.label}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Acct #{item.account.accountNumber} • {item.customer.name}
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

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* CALL WORKSPACE */}
          {item.type === 'CALL' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">Destination:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {item.customer.phone}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">Call State:</span>
                  <span
                    className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      callStatus === 'CONNECTED'
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : callStatus === 'DIALING'
                        ? 'bg-amber-100 text-amber-800'
                        : callStatus === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {callStatus}
                  </span>
                </div>

                {callStatus === 'IDLE' && (
                  <button
                    onClick={handleDial}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-2xs flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Initiate Telephony Call</span>
                  </button>
                )}

                {callStatus === 'DIALING' && (
                  <div className="text-center py-2 text-xs font-mono text-amber-700 font-bold animate-pulse">
                    Connecting to local carrier trunk...
                  </div>
                )}

                {callStatus === 'CONNECTED' && (
                  <div className="space-y-2">
                    <div className="text-center text-xs font-mono text-emerald-700 font-bold">
                      Call In Progress (00:42) • Live Recording Encrypted
                    </div>
                    <button
                      onClick={handleHangup}
                      className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs"
                    >
                      End Call & Save Recording
                    </button>
                  </div>
                )}
              </div>

              {/* Script Guide */}
              {item.recommendedAction.suggestedScript && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Recommended Script Snippet</span>
                  </div>
                  <p className="text-xs text-indigo-950 font-mono">
                    {item.recommendedAction.suggestedScript}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SMS WORKSPACE */}
          {item.type === 'SMS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>To: <strong>{item.customer.phone}</strong></span>
                <span className="text-emerald-700 font-bold">CFPB Reg-F Approved</span>
              </div>
              <textarea
                value={smsBody || item.recommendedAction.suggestedScript || ''}
                onChange={(e) => setSmsBody(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                128/160 characters • Automatic opt-out clause &ldquo;Reply STOP to cancel&rdquo; will be appended.
              </p>
            </div>
          )}

          {/* EMAIL WORKSPACE */}
          {item.type === 'EMAIL' && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Recipient Email:
                </label>
                <input
                  type="text"
                  readOnly
                  value={item.customer.email}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-slate-50 text-slate-700"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Subject:
                </label>
                <input
                  type="text"
                  defaultValue={`StageFlow Settlement Notice - Account #${item.account.accountNumber}`}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-sans bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-slate-500 block mb-1">
                  Message Body:
                </label>
                <textarea
                  defaultValue={`Dear ${item.customer.name},\n\nPlease review the attached settlement deed regarding account #${item.account.accountNumber}. As discussed, your balance may be resolved in full with the outlined installment schedule.`}
                  rows={4}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs font-sans bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* REVIEW WORKSPACE */}
          {item.type === 'REVIEW' && (
            <div className="space-y-3">
              <span className="font-bold text-xs uppercase font-mono text-slate-500 block">
                Verification Checklist
              </span>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewChecked.step1}
                    onChange={(e) =>
                      setReviewChecked({ ...reviewChecked, step1: e.target.checked })
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span className="font-medium text-slate-800">
                    Verify debtor identity matches registered account credentials
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewChecked.step2}
                    onChange={(e) =>
                      setReviewChecked({ ...reviewChecked, step2: e.target.checked })
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span className="font-medium text-slate-800">
                    Audit uploaded hardship/bankruptcy/dispute documentation
                  </span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reviewChecked.step3}
                    onChange={(e) =>
                      setReviewChecked({ ...reviewChecked, step3: e.target.checked })
                    }
                    className="rounded border-slate-300 text-indigo-600"
                  />
                  <span className="font-medium text-slate-800">
                    Confirm stage gate criteria met and sign off on audit trail
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Disposition Notes */}
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-500 block mb-1">
              Operator Disposition Notes:
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke to consumer; wire confirmed for 2:30 PM."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-200 px-5 py-3.5 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white"
          >
            Cancel
          </button>

          <button
            onClick={handleFinishExecution}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete & Reconcile Follow-Up</span>
          </button>
        </div>
      </div>
    </div>
  );
};
