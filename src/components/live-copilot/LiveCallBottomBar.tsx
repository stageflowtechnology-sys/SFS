/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Pause,
  Play,
  PhoneForwarded,
  Grid3X3,
  Sliders,
  ShieldCheck,
  Clock,
  Radio,
  Volume2,
  Users,
} from 'lucide-react';

interface LiveCallBottomBarProps {
  onEndCall: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isOnHold: boolean;
  onToggleHold: () => void;
  callDurationSeconds: number;
  talkTimeAgentPercent: number;
  talkTimeDebtorPercent: number;
  isRecording: boolean;
}

export const LiveCallBottomBar: React.FC<LiveCallBottomBarProps> = ({
  onEndCall,
  isMuted,
  onToggleMute,
  isOnHold,
  onToggleHold,
  callDurationSeconds,
  talkTimeAgentPercent,
  talkTimeDebtorPercent,
  isRecording,
}) => {
  const [showKeypad, setShowKeypad] = useState(false);
  const [keypadInput, setKeypadInput] = useState('');

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (num: string) => {
    setKeypadInput((prev) => prev + num);
  };

  return (
    <div
      id="live-copilot-bottom-bar"
      className="bg-slate-900 text-white border-t border-slate-800 px-4 lg:px-8 py-3 shrink-0 flex flex-wrap items-center justify-between gap-4 shadow-xl z-20"
    >
      {/* 1. Left Section: Recording State & Audio Wave Telemetry */}
      <div className="flex items-center gap-4">
        {/* Recording Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 shadow-inner">
          <div className="relative flex items-center justify-center">
            {isRecording ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block animate-pulse" />
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 absolute animate-ping opacity-75" />
              </>
            ) : (
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500 block" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-400">
              {isRecording ? 'REC • DUAL-CHANNEL' : 'REC PAUSED'}
            </span>
            <span className="text-[9px] font-mono text-slate-400">
              Lossless 16kHz • TCPA Consent
            </span>
          </div>
        </div>

        {/* Live Audio Wave Graphic */}
        <div className="hidden sm:flex items-center gap-0.5 h-6 px-2 bg-slate-950/60 rounded-md border border-slate-800">
          {[40, 75, 30, 90, 60, 45, 80, 50, 95, 35, 70, 45].map((height, idx) => (
            <div
              key={idx}
              className={`w-1 rounded-full transition-all duration-150 ${
                isOnHold
                  ? 'bg-amber-500/40 h-1.5'
                  : isMuted
                  ? 'bg-slate-700 h-1.5'
                  : 'bg-indigo-400 animate-pulse'
              }`}
              style={{
                height: isOnHold || isMuted ? '4px' : `${Math.max(4, height * 0.22)}px`,
                animationDelay: `${idx * 60}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* 2. Middle Section: Call Controls */}
      <div className="flex items-center gap-2 lg:gap-3">
        {/* Mute Button */}
        <button
          id="btn-call-mute"
          onClick={onToggleMute}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isMuted
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        >
          {isMuted ? (
            <>
              <MicOff className="w-4 h-4 text-amber-400" />
              <span>Unmute</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 text-slate-300" />
              <span>Mute</span>
            </>
          )}
        </button>

        {/* Hold Button */}
        <button
          id="btn-call-hold"
          onClick={onToggleHold}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isOnHold
              ? 'bg-amber-500 text-slate-950 font-bold border border-amber-400 hover:bg-amber-400'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
          }`}
          title={isOnHold ? 'Resume conversation' : 'Place debtor on hold'}
        >
          {isOnHold ? (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Call</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 text-slate-300" />
              <span>Hold</span>
            </>
          )}
        </button>

        {/* Transfer / Escalate */}
        <button
          id="btn-call-transfer"
          onClick={() => alert('Supervisor Escalation Bridge initialized: Transferring with live AI context notes.')}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold transition-colors"
          title="Transfer call to supervisor with context"
        >
          <PhoneForwarded className="w-4 h-4 text-slate-300" />
          <span>Transfer</span>
        </button>

        {/* DTMF Keypad Toggle */}
        <div className="relative">
          <button
            id="btn-call-keypad"
            onClick={() => setShowKeypad(!showKeypad)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              showKeypad
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Dialpad / DTMF tones"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>

          {/* Keypad Flyout */}
          {showKeypad && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl w-48 text-center space-y-2 z-30">
              <div className="font-mono text-xs text-indigo-300 bg-slate-950 p-1.5 rounded border border-slate-800 tracking-wider">
                {keypadInput || 'DTMF Ready'}
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
              {keypadInput && (
                <button
                  onClick={() => setKeypadInput('')}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Clear Tones
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Section: Session Timer, Talk Ratio & End Interaction */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Session Timer & Talk-to-Listen Ratio */}
        <div className="flex items-center gap-4 font-mono">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-sm font-bold text-white tracking-wider">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTime(callDurationSeconds)}</span>
            </div>
            <span className="text-[9px] text-slate-400">
              AHT Target: 06:00 (75%)
            </span>
          </div>

          {/* Talk-to-Listen Ratio */}
          <div className="hidden xl:flex flex-col w-28 gap-1">
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>Agent {talkTimeAgentPercent}%</span>
              <span>Debtor {talkTimeDebtorPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-indigo-500 h-full"
                style={{ width: `${talkTimeAgentPercent}%` }}
                title={`Collector talk time: ${talkTimeAgentPercent}%`}
              />
              <div
                className="bg-amber-500 h-full"
                style={{ width: `${talkTimeDebtorPercent}%` }}
                title={`Debtor talk time: ${talkTimeDebtorPercent}%`}
              />
            </div>
          </div>
        </div>

        {/* End Interaction Button */}
        <button
          id="btn-end-interaction"
          onClick={onEndCall}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md hover:shadow-rose-900/40 transition-all cursor-pointer"
          title="End conversation and open disposition wrap-up"
        >
          <PhoneOff className="w-4 h-4" />
          <span>End Interaction</span>
        </button>
      </div>
    </div>
  );
};
