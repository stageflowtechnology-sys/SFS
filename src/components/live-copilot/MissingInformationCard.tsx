/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MissingInformationItem } from '../../types/liveCopilot';
import {
  ListChecks,
  CheckCircle2,
  Circle,
  AlertCircle,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface MissingInformationCardProps {
  items: MissingInformationItem[];
  onToggleItem?: (id: string) => void;
}

export const MissingInformationCard: React.FC<MissingInformationCardProps> = ({
  items: initialItems,
}) => {
  const [items, setItems] = useState<MissingInformationItem[]>(initialItems);

  // Sync state if initialItems change
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, collected: !item.collected } : item
      )
    );
  };

  const collectedCount = items.filter((i) => i.collected).length;
  const requiredCount = items.filter((i) => i.required).length;
  const collectedRequiredCount = items.filter((i) => i.required && i.collected).length;
  const percentComplete = Math.round((collectedCount / items.length) * 100);

  return (
    <div
      id="card-missing-information"
      className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs space-y-3"
    >
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded bg-slate-100 text-slate-700">
            <ListChecks className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Interaction Data Gaps</span>
              <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {collectedCount}/{items.length} Items
              </span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
          {percentComplete}% Complete
        </span>
      </div>

      {/* Progress Track */}
      <div className="space-y-1">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentComplete === 100
                ? 'bg-emerald-500'
                : percentComplete > 50
                ? 'bg-indigo-500'
                : 'bg-amber-500'
            }`}
            style={{ width: `${percentComplete}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>{collectedRequiredCount}/{requiredCount} mandatory collected</span>
          <span>{items.length - collectedCount} pending</span>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-1.5">
        {items.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`p-2 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                item.collected
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'
                  : item.required
                  ? 'bg-white border-amber-200 hover:border-amber-300 text-slate-800'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center transition-colors ${
                  item.collected
                    ? 'bg-emerald-600 text-white'
                    : 'border border-slate-300 bg-white hover:border-slate-400'
                }`}
              >
                {item.collected && <Check className="w-3 h-3 stroke-[3]" />}
              </button>

              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-semibold truncate ${
                      item.collected ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </span>

                  {item.required && !item.collected && (
                    <span className="shrink-0 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Required
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-500 leading-snug">
                  {item.collected && item.collectedValue ? (
                    <span className="text-emerald-700 font-mono font-medium">
                      ✓ {item.collectedValue}
                    </span>
                  ) : (
                    item.description
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
