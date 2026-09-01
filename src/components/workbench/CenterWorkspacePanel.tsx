import React, { useState, useEffect } from 'react';
import { WorkbenchAccount, CallSession, CallStatus, OutcomeDisposition } from '../../types/workbench';
import { WORKBENCH_DISPOSITIONS } from '../../data/workbenchMockData';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Pause,
  Play,
  Disc,
  Clock,
  FileText,
  CheckCircle2,
  Calendar,
  DollarSign,
  Send,
  Tag,
  AlertCircle,
  Sparkles,
  Volume2,
  Shield,
  MessageSquare,
  Hash,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { OriginBadge } from '../ui/OriginBadge';

interface CenterWorkspacePanelProps {
  account: WorkbenchAccount;
  currentOperatorId: string;
  onLogInteraction: (outcomeData: {
    disposition: string;
    notes: string;
    ptpAmount?: number;
    ptpDate?: string;
    followUpDate?: string;
    followUpNotes?: string;
  }) => void;
  activeDialPhoneNumber?: string;
}

export const CenterWorkspacePanel: React.FC<CenterWorkspacePanelProps> = ({
  account,
  currentOperatorId,
  onLogInteraction,
  activeDialPhoneNumber,
}) => {
  // Call session state
  const [callStatus, setCallStatus] = useState<CallStatus>('IDLE');
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isOnHold, setIsOnHold] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(true);
  const [selectedPhone, setSelectedPhone] = useState<string>(
    activeDialPhoneNumber || account.contacts.find((c) => c.type.startsWith('PHONE'))?.value || '(949) 555-0184'
  );

  // Sync selected phone if prop changes
  useEffect(() => {
    if (activeDialPhoneNumber) {
      setSelectedPhone(activeDialPhoneNumber);
    }
  }, [activeDialPhoneNumber]);

  // Call timer interval
  useEffect(() => {
    let interval: any = null;
    if (callStatus === 'IN_CALL') {
      interval = setInterval(() => {
        setDurationSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callStatus]);

  // Notes state
  const [notesText, setNotesText] = useState<string>(
    'Debtor verified identity. Acknowledged previous $15,000 promise shortfall due to temporary 3PL freight payout delay. Confirmed business cashflow remains solvent.'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(['PTP Broken', 'Cashflow Lag', 'Settlement Offer']);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Saved 10s ago');

  // Outcome disposition state
  const [selectedDispositionCode, setSelectedDispositionCode] = useState<string>('PTP_SETTLEMENT');
  const [ptpAmount, setPtpAmount] = useState<string>('31525.00');
  const [ptpDueDate, setPtpDueDate] = useState<string>('2026-09-15');
  const [ptpPaymentMethod, setPtpPaymentMethod] = useState<string>('ACH_DIRECT');
  const [splitInstallments, setSplitInstallments] = useState<boolean>(true);

  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState<string>('2026-08-31T14:00');
  const [followUpReason, setFollowUpReason] = useState<string>('Confirm initial $5,000 earnest wire receipt');
  const [sendSmsConfirmation, setSendSmsConfirmation] = useState<boolean>(true);

  // Transcript simulator turns
  const [transcriptMessages, setTranscriptMessages] = useState<
    { speaker: 'OPERATOR' | 'DEBTOR' | 'SYSTEM'; text: string; timestamp: string; sentiment?: string }[]
  >([
    {
      speaker: 'SYSTEM',
      text: 'Telephony Channel Initialized • Carrier: Bandwidth SIP Trunk • Recording Active',
      timestamp: '00:00',
    },
    {
      speaker: 'OPERATOR',
      text: `Hello, Marcus. This is Agent ${currentOperatorId} calling from StageFlow Asset Recovery on behalf of Apex Horizon Bank on a recorded line. This is an attempt to collect a debt.`,
      timestamp: '00:04',
      sentiment: 'neutral',
    },
    {
      speaker: 'DEBTOR',
      text: "Yes, I know why you're calling. Look, our main freight broker delayed our weekly payout by three days. I haven't disappeared—I just had a cash bottleneck.",
      timestamp: '00:14',
      sentiment: 'frustrated',
    },
    {
      speaker: 'OPERATOR',
      text: "I completely understand the freight timing, Marcus. Our system has pre-authorized a 35% settlement discount to resolve the full $48,500 for $31,525, structured in 3 installments.",
      timestamp: '00:26',
      sentiment: 'positive',
    },
    {
      speaker: 'DEBTOR',
      text: "If you can do $5,000 today and the remainder split over mid-September and October, I can authorize the ACH right now.",
      timestamp: '00:38',
      sentiment: 'positive',
    },
  ]);

  // Start Call Handler
  const handleStartCall = () => {
    setCallStatus('DIALING');
    setTimeout(() => {
      setCallStatus('IN_CALL');
      setDurationSeconds(0);
    }, 1200);
  };

  // End Call Handler
  const handleEndCall = () => {
    setCallStatus('WRAP_UP');
  };

  // Quick template inserters for notes
  const handleInsertTemplate = (template: string) => {
    setNotesText((prev) => `${prev.trim()}\n- ${template}`);
    setLastSavedTime('Saved just now');
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setLastSavedTime('Saved just now');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentDisposition = WORKBENCH_DISPOSITIONS.find(
    (d) => d.code === selectedDispositionCode
  );

  const availableTags = [
    'PTP Agreed',
    'PTP Broken',
    'Hardship',
    'Cashflow Lag',
    'Dispute Raised',
    'Settlement Offer',
    'Fee Waiver',
    'Third-Party Attorney',
    'Skip Trace',
  ];

  return (
    <div className="flex flex-col h-full bg-slate-100/70 overflow-y-auto">
      {/* 1. Top Call Controls Bar */}
      <div className="p-4 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Phone Target & Status */}
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                callStatus === 'IN_CALL'
                  ? 'bg-emerald-400 animate-ping'
                  : callStatus === 'DIALING'
                  ? 'bg-amber-400 animate-pulse'
                  : callStatus === 'WRAP_UP'
                  ? 'bg-indigo-400'
                  : 'bg-slate-500'
              }`}
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  {callStatus === 'IN_CALL'
                    ? 'LIVE CALL IN PROGRESS'
                    : callStatus === 'DIALING'
                    ? 'CONNECTING SIP TRUNK...'
                    : callStatus === 'WRAP_UP'
                    ? 'WRAP-UP & DISPOSITION'
                    : 'DIALER IDLE'}
                </span>
                {callStatus === 'IN_CALL' && (
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
                    {formatTimer(durationSeconds)}
                  </span>
                )}
              </div>

              {/* Target Phone Selector */}
              <div className="flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <select
                  value={selectedPhone}
                  onChange={(e) => setSelectedPhone(e.target.value)}
                  disabled={callStatus !== 'IDLE'}
                  className="bg-slate-800 text-xs font-mono font-bold text-white px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-80"
                >
                  {account.contacts
                    .filter((c) => c.type.startsWith('PHONE'))
                    .map((c) => (
                      <option key={c.id} value={c.value}>
                        {c.value} ({c.label})
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Center/Right: Live Call Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {callStatus === 'IDLE' ? (
              <button
                onClick={handleStartCall}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>INITIATE OUTBOUND CALL</span>
              </button>
            ) : callStatus === 'DIALING' ? (
              <button
                onClick={() => setCallStatus('IDLE')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            ) : callStatus === 'IN_CALL' ? (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                    isMuted
                      ? 'bg-rose-600 border-rose-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOnHold(!isOnHold)}
                  className={`p-2 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                    isOnHold
                      ? 'bg-amber-600 border-amber-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isOnHold ? 'Resume call' : 'Place on hold'}
                >
                  {isOnHold ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`px-2.5 py-2 rounded-lg border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-colors ${
                    isRecording
                      ? 'bg-rose-950 border-rose-700 text-rose-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                  title="Compliance call recording"
                >
                  <Disc className={`w-3.5 h-3.5 ${isRecording ? 'text-rose-500 animate-pulse' : ''}`} />
                  <span>{isRecording ? 'REC ON' : 'REC OFF'}</span>
                </button>

                <button
                  onClick={handleEndCall}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-mono flex items-center gap-2 shadow-sm transition-all transform active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>END CALL</span>
                </button>
              </>
            ) : (
              /* Wrap-up state */
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-amber-300 bg-amber-950/70 px-2.5 py-1 rounded border border-amber-800">
                  Call Finished ({formatTimer(durationSeconds)}) • Complete Disposition Below
                </span>
                <button
                  onClick={() => {
                    setCallStatus('IDLE');
                    setDurationSeconds(0);
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700"
                >
                  Reset Dialer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 2. Live Conversation Transcript & Stream */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                Live Conversation Stream & Real-Time Telephony
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-semibold">
                <Shield className="w-3 h-3" />
                FDCPA Mini-Miranda Confirmed
              </span>
            </div>
          </div>

          {/* Transcript bubbles */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto p-2 bg-slate-50/80 rounded-lg border border-slate-200">
            {transcriptMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col text-xs ${
                  msg.speaker === 'OPERATOR'
                    ? 'items-end'
                    : msg.speaker === 'DEBTOR'
                    ? 'items-start'
                    : 'items-center'
                }`}
              >
                {msg.speaker === 'SYSTEM' ? (
                  <div className="text-[10px] font-mono text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full my-1">
                    {msg.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-xl p-3 space-y-1 shadow-2xs ${
                      msg.speaker === 'OPERATOR'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-80 font-mono">
                      <span>
                        {msg.speaker === 'OPERATOR' ? `Agent (${currentOperatorId})` : account.customerName}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed text-[12px]">{msg.text}</p>
                    {msg.sentiment && (
                      <div className="text-[9px] font-mono uppercase tracking-wider text-right opacity-75">
                        Sentiment: {msg.sentiment}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Collector Notes Workspace */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                Collector Interaction Notes
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{lastSavedTime}</span>
          </div>

          {/* Template Quick Inserts */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              Quick Snippets:
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleInsertTemplate(
                    'Debtor promised $5,000 earnest wire today; balance structured over Sep 15 & Oct 15.'
                  )
                }
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono border border-slate-200 transition-colors"
              >
                + $5k Earnest Restructure
              </button>
              <button
                type="button"
                onClick={() =>
                  handleInsertTemplate(
                    'Debtor cited 3PL receivables delay; verified carrier invoice with shipper.'
                  )
                }
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono border border-slate-200 transition-colors"
              >
                + Receivables Delay
              </button>
              <button
                type="button"
                onClick={() =>
                  handleInsertTemplate(
                    'Late fees waived ($2,250.00) contingent on ACH auto-debit signoff.'
                  )
                }
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono border border-slate-200 transition-colors"
              >
                + Fee Waiver Contingency
              </button>
              <button
                type="button"
                onClick={() =>
                  handleInsertTemplate(
                    'Left standard compliant FDCPA voicemail on primary mobile.'
                  )
                }
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono border border-slate-200 transition-colors"
              >
                + Standard VM Dropped
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={notesText}
            onChange={(e) => {
              setNotesText(e.target.value);
              setLastSavedTime('Saving...');
              setTimeout(() => setLastSavedTime('Saved just now'), 500);
            }}
            rows={4}
            placeholder="Record detailed debtor statements, negotiation commitments, authorized terms, and next steps..."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none leading-relaxed transition-all font-sans"
          />

          {/* Categorical Tags */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              <span>Categorical Audit Tags:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border ${
                      isSelected
                        ? 'bg-indigo-100 text-indigo-900 border-indigo-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Outcome Disposition & PTP Settlement Builder */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                Interaction Outcome & Disposition
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Select outcome to trigger cadence rules
            </span>
          </div>

          {/* Disposition Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Primary Call Disposition:
            </label>
            <select
              value={selectedDispositionCode}
              onChange={(e) => setSelectedDispositionCode(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:outline-none cursor-pointer"
            >
              {WORKBENCH_DISPOSITIONS.map((disp) => (
                <option key={disp.code} value={disp.code}>
                  [{disp.category}] {disp.label}
                </option>
              ))}
            </select>
          </div>

          {/* PTP / Settlement Contract Parameters (if applicable) */}
          {currentDisposition?.requiresPtpTerms && (
            <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-indigo-950 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-700" />
                  Settlement & PTP Commitment Terms
                </span>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                  Max Cap: ${account.minAcceptableSettlement.toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Agreed Payoff / Settlement ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-mono">$</span>
                    <input
                      type="text"
                      value={ptpAmount}
                      onChange={(e) => setPtpAmount(e.target.value)}
                      className="w-full pl-6 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 bg-white rounded border border-indigo-200 focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Payment Due Date
                  </label>
                  <input
                    type="date"
                    value={ptpDueDate}
                    onChange={(e) => setPtpDueDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono font-bold text-slate-900 bg-white rounded border border-indigo-200 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Payment Rail / Instrument
                  </label>
                  <select
                    value={ptpPaymentMethod}
                    onChange={(e) => setPtpPaymentMethod(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-medium bg-white rounded border border-indigo-200 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="ACH_DIRECT">Direct Bank ACH Auto-Debit</option>
                    <option value="FEDWIRE">Fedwire Real-Time Gross Settlement</option>
                    <option value="DEBIT_CARD">Commercial Debit / Visa Business</option>
                    <option value="CERTIFIED_CHECK">Certified Bank Cashier Check</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="splitCheck"
                    checked={splitInstallments}
                    onChange={(e) => setSplitInstallments(e.target.checked)}
                    className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <label htmlFor="splitCheck" className="text-xs text-indigo-950 font-medium cursor-pointer">
                    Split into 3 monthly milestones
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Follow-Up Scheduler */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                Scheduled Follow-Up & Cadence Checkpoint
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Next Follow-Up Date & Time:
              </label>
              <input
                type="datetime-local"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs font-mono text-slate-900 bg-slate-50 rounded border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-medium text-slate-700">
                Follow-Up Operational Reason:
              </label>
              <input
                type="text"
                value={followUpReason}
                onChange={(e) => setFollowUpReason(e.target.value)}
                placeholder="Reason for scheduled callback..."
                className="w-full px-3 py-1.5 text-xs text-slate-900 bg-slate-50 rounded border border-slate-200 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="smsNotify"
                checked={sendSmsConfirmation}
                onChange={(e) => setSendSmsConfirmation(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <label htmlFor="smsNotify" className="text-slate-700 cursor-pointer">
                Transmit automated SMS terms confirmation receipt to debtor
              </label>
            </div>
          </div>
        </div>

        {/* 6. Primary Interaction Wrap-up Action Button */}
        <div className="p-4 rounded-xl bg-slate-900 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready for Operational Audit Log</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Operator #{currentOperatorId} will sign the ledger transaction and update cadence.
            </p>
          </div>

          <button
            onClick={() =>
              onLogInteraction({
                disposition: selectedDispositionCode,
                notes: notesText,
                ptpAmount: Number(ptpAmount) || undefined,
                ptpDate: ptpDueDate,
                followUpDate,
                followUpNotes: followUpReason,
              })
            }
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>SAVE INTERACTION & DISPATCH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
