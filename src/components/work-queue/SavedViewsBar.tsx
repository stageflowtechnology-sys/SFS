import React from 'react';
import {
  Zap,
  Briefcase,
  CalendarClock,
  Banknote,
  AlertTriangle,
  Layers,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { SavedViewPreset } from '../../types/workQueue';

interface SavedViewsBarProps {
  presets: SavedViewPreset[];
  activePresetId: string;
  onSelectPreset: (preset: SavedViewPreset) => void;
  presetCounts: Record<string, number>;
}

export const SavedViewsBar: React.FC<SavedViewsBarProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  presetCounts,
}) => {
  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'Briefcase':
        return <Briefcase className="w-3.5 h-3.5 text-indigo-600" />;
      case 'CalendarClock':
        return <CalendarClock className="w-3.5 h-3.5 text-amber-600" />;
      case 'Banknote':
        return <Banknote className="w-3.5 h-3.5 text-emerald-600" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case 'Layers':
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 select-none no-scrollbar">
      <span className="text-[10px] font-mono uppercase font-bold text-slate-400 mr-1 shrink-0 flex items-center gap-1">
        <Filter className="w-3 h-3" />
        Views:
      </span>

      {presets.map((preset) => {
        const isActive = preset.id === activePresetId;
        const count = presetCounts[preset.id] ?? 0;

        return (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all duration-150 border ${
              isActive
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-bold'
                : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 border-slate-200 shadow-2xs'
            }`}
          >
            {getPresetIcon(preset.iconName)}
            <span>{preset.name}</span>
            <span
              className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isActive
                  ? 'bg-slate-800 text-amber-300'
                  : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
