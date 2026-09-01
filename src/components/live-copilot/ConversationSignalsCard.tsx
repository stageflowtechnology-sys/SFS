/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ConversationSignal } from '../../types/liveCopilot';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Info,
} from 'lucide-react';

interface ConversationSignalsCardProps {
  signals: ConversationSignal[];
}

export const ConversationSignalsCard: React.FC<ConversationSignalsCardProps> = ({
  signals,
}) => {
  const getStatusColor = (status: ConversationSignal['status']) => {
    switch (status) {
      case 'positive':
        return {
          bar: 'bg-emerald-500',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'warning':
        return {
          bar: 'bg-amber-500',
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'risk':
        return {
          bar: 'bg-rose-500',
          badge: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
        };
      case 'neutral':
      default:
        return {
          bar: 'bg-indigo-500',
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-500',
        };
    }
  };

  const getTrendIcon = (trend: ConversationSignal['trend']) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="w-3 h-3 text-emerald-600" title="Trajectory Rising" />;
      case 'falling':
        return <TrendingDown className="w-3 h-3 text-rose-600" title="Trajectory Falling" />;
      case 'stable':
      default:
        return <Minus className="w-3 h-3 text-slate-400" title="Trajectory Stable" />;
    }
  };

  return (
    <div
      id="card-conversation-signals"
      className="rounded-xl border border-violet-200/80 bg-gradient-to-b from-white to-violet-50/20 p-3.5 shadow-2xs space-y-3"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 border-b border-violet-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-violet-100 text-violet-700">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Conversation Signals</span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-violet-100 text-violet-800 border border-violet-200">
                Live Telemetry
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-violet-500" />
          4 Vectors
        </span>
      </div>

      {/* Signals List */}
      <div className="space-y-2.5">
        {signals.map((signal) => {
          const color = getStatusColor(signal.status);
          return (
            <div
              key={signal.id}
              className="p-2.5 rounded-lg border border-slate-200/80 bg-white hover:border-violet-200 transition-colors shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
                  <span>{signal.name}</span>
                  {getTrendIcon(signal.trend)}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold ${color.badge}`}>
                    {signal.score}%
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
                  style={{ width: `${signal.score}%` }}
                />
              </div>

              {/* Detail Context */}
              <p className="text-[11px] text-slate-600 leading-snug">
                {signal.details}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
