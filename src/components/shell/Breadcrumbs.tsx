import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Home, ChevronDown, Check, Sparkles, Lock } from 'lucide-react';
import { NavigationSection, NavigationItem, UserRole } from '../../types/shell';

interface BreadcrumbsProps {
  currentSection: NavigationSection;
  currentItem: NavigationItem;
  onSelectItem: (item: NavigationItem) => void;
  currentUserRole: UserRole;
  contextualSubItem?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentSection,
  currentItem,
  onSelectItem,
  currentUserRole,
  contextualSubItem,
}) => {
  const [isSiblingMenuOpen, setIsSiblingMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSiblingMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasAccess = (item: NavigationItem): boolean => {
    if (!item.requiredRole) return true;
    if (currentUserRole === 'ADMIN') return true;
    if (currentUserRole === 'QA_AUDITOR' && item.requiredRole === 'QA_AUDITOR') return true;
    return false;
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-slate-500 font-medium py-1 overflow-x-auto min-w-max"
    >
      {/* Root Context */}
      <span className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          StageFlow
        </span>
      </span>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

      {/* Section Level */}
      <span className="font-semibold text-slate-600">
        {currentSection.title}
      </span>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

      {/* Active Item with Sibling Dropdown Switcher */}
      <div className="relative inline-flex items-center" ref={dropdownRef}>
        <button
          onClick={() => setIsSiblingMenuOpen(!isSiblingMenuOpen)}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
        >
          {currentItem.isAiPowered && (
            <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
          )}
          <span>{currentItem.label}</span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        {/* Siblings Popover Menu */}
        {isSiblingMenuOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 w-52 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95">
            <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              {currentSection.title} Views
            </div>
            <div className="space-y-0.5">
              {currentSection.items.map((sibling) => {
                const isCurrent = sibling.id === currentItem.id;
                const accessible = hasAccess(sibling);
                return (
                  <button
                    key={sibling.id}
                    onClick={() => {
                      onSelectItem(sibling);
                      setIsSiblingMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors text-left ${
                      isCurrent
                        ? 'bg-slate-900 text-white font-semibold'
                        : accessible
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {!accessible && <Lock className="w-3 h-3 text-slate-400" />}
                      <span>{sibling.label}</span>
                    </div>
                    {isCurrent && (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    )}
                    {!isCurrent && typeof sibling.badgeCount === 'number' && (
                      <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-600">
                        {sibling.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Optional Contextual Sub-Item */}
      {contextualSubItem && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded font-medium">
            {contextualSubItem}
          </span>
        </>
      )}
    </nav>
  );
};
