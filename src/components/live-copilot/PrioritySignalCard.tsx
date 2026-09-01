/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PrioritySignal } from '../../types/liveCopilot';
import {
  AlertTriangle,
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldAlert,
  Copy,
  Check,
} from 'lucide-react';

interface PrioritySignalCardProps {
  signal: PrioritySignal;
  onUsePrompt?: (text: string) => void;
  onJumpToTimestamp?: (timestamp: string) => void;
}

export const PrioritySignalCard: React.FC<PrioritySignalCardProps> = ({
  signal,
  onUsePrompt,
  onJumpToTimestamp,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (signal.actionPromptText) {
      navigator.clipboard.writeText(signal.actionPromptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSeverityStyles = () => {
    switch (signal.severity) {
      case 'critical':
        return {
          container: 'border-rose-300 bg-rose-50/70 text-rose-950',
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          icon: 'text-rose-600',
          quoteBg: 'bg-white/80 border-rose-200 text-rose-900',
          button: 'bg-rose-600 hover:bg-rose-700 text-white',
        };
      case 'high':
        return {
          container: 'border-amber-300 bg-amber-50/70 text-amber-950',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          icon: 'text-amber-600',
          quoteBg: 'bg-white/80 border-amber-200 text-amber-900',
          button: 'bg-amber-600 hover:bg-amber-700 text-white',
        };
      case 'advisory':
      default:
        return {
          container: 'border-indigo-300 bg-indigo-50/70 text-indigo-950',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          icon: 'text-indigo-600',
          quoteBg: 'bg-white/80 border-indigo-200 text-indigo-900',
          button: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        };
    }
  };

  const styles = getSeverityStyles();

  return (
    <div
      id={`priority-signal-${signal.id}`}
      className={`rounded-xl border p-3.5 transition-all shadow-xs relative overflow-hidden ${styles.container}`}
    >
      {/* Visual Accent Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-rose-500" />

      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-2 pt-0.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center justify-center w-5 h-5 rounded-md bg-white shadow-2xs">
            {signal.severity === 'critical' ? (
              <Zap className={`w-3.5 h-3.5 ${styles.icon}`} />
            ) : signal.severity === 'high' ? (
              <AlertTriangle className={`w-3.5 h-3.5 ${styles.icon}`} />
            ) : (
              <Sparkles className={`w-3.5 h-3.5 ${styles.icon}`} />
            )}
          </span>
          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 font-mono bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            PRIORITY SIGNAL
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${styles.badge}`}>
            {signal.severity}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 shrink-0">
          <button
            onClick={() => onJumpToTimestamp?.(signal.timestamp)}
            className="flex items-center gap-1 hover:text-slate-900 hover:underline bg-white/70 px-1.5 py-0.5 rounded border border-slate-200"
            title="Jump to trigger in transcript"
          >
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{signal.timestamp}</span>
          </button>
          <span className="px-1.5 py-0.5 rounded bg-white text-[10px] font-bold text-violet-700 border border-violet-200">
            {signal.confidence}% Conf.
          </span>
        </div>
      </div>

      {/* Title */}
      <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1.5">
        {signal.title}
      </h4>

      {/* Trigger Quote */}
      <div
        onClick={() => onJumpToTimestamp?.(signal.timestamp)}
        className={`text-[11px] font-mono italic p-2 rounded-lg border mb-2.5 cursor-pointer hover:border-slate-400 transition-colors ${styles.quoteBg}`}
        title="Click to view in transcript"
      >
        <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-slate-400 not-italic mb-0.5 flex items-center gap-1">
          <span>Audio Trigger Detection</span>
        </div>
        {signal.triggerQuote}
      </div>

      {/* Action Recommendation */}
      <div className="space-y-2">
        <div className="text-[11px] leading-relaxed text-slate-700">
          <strong className="text-slate-900 font-semibold">Recommended Collector Action: </strong>
          {signal.recommendedAction}
        </div>

        {signal.actionPromptText && (
          <div className="flex items-center gap-2 pt-1">
            <button
              id="btn-use-priority-prompt"
              onClick={() => {
                onUsePrompt?.(signal.actionPromptText!);
                handleCopy();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${styles.button}`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Execute Next Step</span>
                </>
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
              title="Copy prompt text"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
