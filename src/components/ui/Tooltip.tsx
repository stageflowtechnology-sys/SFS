import React, { useState } from 'react';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  lineageInfo?: {
    source: string;
    modelOrSystem?: string;
    confidenceOrAudit?: string;
  };
  shortcut?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  lineageInfo,
  shortcut,
  position = 'top',
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none whitespace-normal min-w-[180px] max-w-xs p-2.5 rounded bg-slate-900 text-white border border-slate-800 shadow-xl text-xs font-normal animate-in fade-in-0 zoom-in-95 duration-100 ${positionClasses[position]}`}
        >
          <div className="text-slate-100 leading-snug font-medium">{content}</div>

          {lineageInfo && (
            <div className="mt-1.5 pt-1.5 border-t border-slate-700/80 font-mono text-[10px] space-y-0.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Source:</span>
                <span className="text-white font-medium">{lineageInfo.source}</span>
              </div>
              {lineageInfo.modelOrSystem && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Engine:</span>
                  <span className="text-slate-200">{lineageInfo.modelOrSystem}</span>
                </div>
              )}
              {lineageInfo.confidenceOrAudit && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Weight:</span>
                  <span className="text-indigo-400 font-semibold">{lineageInfo.confidenceOrAudit}</span>
                </div>
              )}
            </div>
          )}

          {shortcut && (
            <div className="mt-1 flex justify-end">
              <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-300">
                {shortcut}
              </kbd>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
