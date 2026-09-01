/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Mic,
  Headphones,
  Sparkles,
} from 'lucide-react';

interface AudioPlaybackBarProps {
  durationSeconds: number;
  currentSecond: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSeek: (seconds: number) => void;
  onJumpToTimestamp?: (timeStr: string) => void;
  activeEvidenceTimestamp?: string | null;
}

export const AudioPlaybackBar: React.FC<AudioPlaybackBarProps> = ({
  durationSeconds,
  currentSecond,
  isPlaying,
  onTogglePlay,
  onSeek,
  onJumpToTimestamp,
  activeEvidenceTimestamp,
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationSeconds > 0 ? (currentSecond / durationSeconds) * 100 : 0;

  const speeds = [1, 1.25, 1.5, 2];

  const handleNextSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  // Mock audio bars with speaker separation
  const waveformBars = [
    { h: 30, speaker: 'agent' },
    { h: 55, speaker: 'agent' },
    { h: 80, speaker: 'agent' },
    { h: 45, speaker: 'agent' },
    { h: 15, speaker: 'pause' },
    { h: 65, speaker: 'debtor' },
    { h: 90, speaker: 'debtor' },
    { h: 70, speaker: 'debtor' },
    { h: 40, speaker: 'debtor' },
    { h: 85, speaker: 'debtor' },
    { h: 20, speaker: 'pause' },
    { h: 50, speaker: 'agent' },
    { h: 75, speaker: 'agent' },
    { h: 95, speaker: 'agent' },
    { h: 35, speaker: 'agent' },
    { h: 60, speaker: 'debtor' },
    { h: 85, speaker: 'debtor' },
    { h: 100, speaker: 'debtor' },
    { h: 55, speaker: 'debtor' },
    { h: 30, speaker: 'pause' },
    { h: 70, speaker: 'agent' },
    { h: 90, speaker: 'agent' },
    { h: 60, speaker: 'agent' },
    { h: 80, speaker: 'debtor' },
    { h: 65, speaker: 'debtor' },
    { h: 40, speaker: 'debtor' },
    { h: 90, speaker: 'debtor' },
    { h: 50, speaker: 'agent' },
  ];

  return (
    <div
      id="post-call-audio-player"
      className="bg-slate-900 text-white rounded-xl border border-slate-800 p-4 shadow-md space-y-3"
    >
      {/* Top Header & Channels */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-bold text-white font-mono">
              <span>Dual-Channel Audio Master</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Lossless 16kHz
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              CH 1: Collector (Left) • CH 2: Debtor (Right)
            </p>
          </div>
        </div>

        {/* Playback Controls & Time */}
        <div className="flex items-center gap-3 font-mono">
          <div className="text-xs text-indigo-300 font-bold bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
            <span>{formatTime(currentSecond)}</span>
            <span className="text-slate-500 mx-1">/</span>
            <span className="text-slate-400">{formatTime(durationSeconds)}</span>
          </div>

          <button
            onClick={handleNextSpeed}
            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>
        </div>
      </div>

      {/* Scrubbable Waveform Container */}
      <div className="relative">
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(1, clickX / rect.width));
            onSeek(pct * durationSeconds);
          }}
          className="relative h-12 bg-slate-950 rounded-lg border border-slate-800 p-2 cursor-pointer flex items-center justify-between gap-1 overflow-hidden group select-none"
        >
          {/* Progress Overlay */}
          <div
            className="absolute inset-y-0 left-0 bg-indigo-600/20 border-r-2 border-indigo-400 pointer-events-none transition-all duration-75"
            style={{ width: `${progressPercent}%` }}
          />

          {/* Waveform Bars */}
          {waveformBars.map((bar, idx) => {
            const barPos = (idx / (waveformBars.length - 1)) * 100;
            const isPassed = barPos <= progressPercent;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center justify-center h-full z-10"
              >
                <div
                  className={`w-full max-w-[5px] rounded-full transition-all duration-150 ${
                    bar.speaker === 'agent'
                      ? isPassed
                        ? 'bg-indigo-400'
                        : 'bg-indigo-900/60 group-hover:bg-indigo-800'
                      : bar.speaker === 'debtor'
                      ? isPassed
                        ? 'bg-amber-400'
                        : 'bg-amber-900/60 group-hover:bg-amber-800'
                      : 'bg-slate-800'
                  }`}
                  style={{ height: `${bar.h}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Evidence Markers along track */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1 mt-1">
          <span
            onClick={() => onSeek(18)}
            className="hover:text-indigo-300 cursor-pointer flex items-center gap-0.5"
            title="Mini-Miranda disclosure (00:18)"
          >
            • 00:18 Mini-Miranda
          </span>
          <span
            onClick={() => onSeek(112)}
            className="hover:text-indigo-300 cursor-pointer flex items-center gap-0.5"
            title="Employment confirmation (01:52)"
          >
            • 01:52 Income Verified
          </span>
          <span
            onClick={() => onSeek(155)}
            className="hover:text-indigo-300 cursor-pointer flex items-center gap-0.5"
            title="Fee concession offer (02:35)"
          >
            • 02:35 Concession
          </span>
          <span
            onClick={() => onSeek(220)}
            className="hover:text-indigo-300 cursor-pointer flex items-center gap-0.5"
            title="PTP Authorization (03:40)"
          >
            • 03:40 PTP Authorize
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSeek(Math.max(0, currentSecond - 10))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Back 10s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="btn-play-pause-review-audio"
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Interaction</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSeek(Math.min(durationSeconds, currentSecond + 10))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Forward 10s"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <span className="hidden sm:inline">Volume: {isMuted ? 'Muted' : '100%'}</span>
        </div>
      </div>
    </div>
  );
};
