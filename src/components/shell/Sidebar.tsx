import React, { useState } from 'react';
import {
  ChevronsLeft,
  ChevronsRight,
  Shield,
  Sparkles,
  Lock,
  ChevronDown,
  ChevronRight,
  CircleDot,
  Layers,
  Zap,
} from 'lucide-react';
import { NavigationSection, NavigationItem, UserRole } from '../../types/shell';
import { SidebarIcon } from './SidebarIcon';

interface SidebarProps {
  sections: NavigationSection[];
  activeItemId: string;
  onSelectItem: (item: NavigationItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  currentUserRole: UserRole;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeItemId,
  onSelectItem,
  isCollapsed,
  onToggleCollapse,
  currentUserRole,
  isMobileOpen = false,
  onMobileClose,
}) => {
  // Track collapsed state of section headers in expanded mode
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const hasAccess = (item: NavigationItem): boolean => {
    if (!item.requiredRole) return true;
    if (currentUserRole === 'ADMIN') return true;
    if (currentUserRole === 'QA_AUDITOR' && item.requiredRole === 'QA_AUDITOR') return true;
    return false;
  };

  const getBadgeStyle = (variant?: 'indigo' | 'amber' | 'emerald' | 'slate' | 'rose', isRestricted = false) => {
    if (isRestricted) {
      return 'bg-slate-100 text-slate-400 border border-slate-200';
    }
    switch (variant) {
      case 'amber':
        return 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-900 border border-indigo-300 font-bold';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold';
      case 'rose':
        return 'bg-rose-100 text-rose-900 border border-rose-300 font-bold';
      case 'slate':
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200 font-medium';
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="stageflow-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-in-out lg:static lg:z-30 ${
          isCollapsed ? 'w-18' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand & Organization Identity Header */}
        <div className="flex h-15 items-center justify-between border-b border-slate-200 px-3.5 bg-white">
          {!isCollapsed ? (
            <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white font-black text-sm tracking-tighter shadow-2xs">
                SF
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 tracking-tight truncate">
                    StageFlow AI
                  </span>
                  <span className="shrink-0 rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-indigo-700 border border-indigo-200">
                    CORE
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="truncate">Recovery Console</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white font-black text-sm shadow-2xs">
              SF
            </div>
          )}

          {/* Desktop Collapse / Expand Toggle Button */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar (⌘[)' : 'Collapse Sidebar (⌘[)'}
            aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className="hidden lg:inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-300"
          >
            {isCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Sections Scroll Container */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {sections.map((section) => {
            const isSectionCollapsed = !!collapsedSections[section.id];
            const hasActiveChild = section.items.some((it) => it.id === activeItemId);

            return (
              <div key={section.id} className="space-y-0.5">
                {/* Section Header */}
                {!isCollapsed ? (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="group flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors rounded-sm"
                  >
                    <span className="flex items-center gap-1.5">
                      {section.title}
                      {hasActiveChild && isSectionCollapsed && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      )}
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-600">
                      {isSectionCollapsed ? (
                        <ChevronRight className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </span>
                  </button>
                ) : (
                  <div className="my-1.5 mx-auto h-px w-6 bg-slate-200" />
                )}

                {/* Section Items List */}
                {(!isSectionCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const isActive = activeItemId === item.id;
                      const accessible = hasAccess(item);
                      const isHovered = hoveredItemId === item.id;

                      return (
                        <div key={item.id} className="relative group">
                          <button
                            onClick={() => {
                              onSelectItem(item);
                              if (onMobileClose) onMobileClose();
                            }}
                            onMouseEnter={() => setHoveredItemId(item.id)}
                            onMouseLeave={() => setHoveredItemId(null)}
                            title={isCollapsed ? undefined : item.description}
                            className={`w-full flex items-center gap-2.5 rounded-md text-xs transition-all duration-150 relative ${
                              isCollapsed
                                ? 'h-9 justify-center px-0'
                                : 'h-8.5 px-2.5 justify-between'
                            } ${
                              isActive
                                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                                : accessible
                                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 opacity-75'
                            }`}
                          >
                            {/* Left Active Accent Notch for Expanded Mode */}
                            {isActive && !isCollapsed && (
                              <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-500 rounded-r" />
                            )}

                            {/* Icon & Label */}
                            <div className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}>
                              <span
                                className={`shrink-0 transition-colors ${
                                  isActive
                                    ? item.isAiPowered
                                      ? 'text-indigo-300'
                                      : 'text-white'
                                    : item.isAiPowered
                                    ? 'text-indigo-600'
                                    : accessible
                                    ? 'text-slate-500 group-hover:text-slate-700'
                                    : 'text-slate-400'
                                }`}
                              >
                                <SidebarIcon name={item.icon} className="w-4 h-4" />
                              </span>

                              {!isCollapsed && (
                                <span className="truncate font-medium tracking-tight">
                                  {item.label}
                                </span>
                              )}
                            </div>

                            {/* Right Badges & Indicators (Expanded Mode) */}
                            {!isCollapsed && (
                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Permission Requirement Tag */}
                                {!accessible && (
                                  <span
                                    title={`Requires ${item.requiredRole} permission`}
                                    className="flex items-center gap-0.5 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono font-medium text-slate-500 border border-slate-200"
                                  >
                                    <Lock className="w-2.5 h-2.5 text-slate-400" />
                                    <span>
                                      {item.requiredRole === 'ADMIN' ? 'Admin' : 'QA'}
                                    </span>
                                  </span>
                                )}

                                {/* AI Powered Sparkle */}
                                {item.isAiPowered && accessible && (
                                  <span
                                    className={`flex items-center gap-0.5 rounded px-1.5 py-0.2 text-[9px] font-bold ${
                                      isActive
                                        ? 'bg-indigo-700 text-indigo-100'
                                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                    }`}
                                  >
                                    <Sparkles className="w-2.5 h-2.5" />
                                    <span>AI</span>
                                  </span>
                                )}

                                {/* Live Count Badge */}
                                {typeof item.badgeCount === 'number' && (
                                  <span
                                    className={`min-w-4.5 px-1.5 py-0.2 rounded text-[10px] font-mono text-center leading-none ${
                                      isActive
                                        ? 'bg-slate-800 text-slate-200 border border-slate-700 font-bold'
                                        : getBadgeStyle(item.badgeVariant, !accessible)
                                    }`}
                                  >
                                    {item.badgeCount}
                                  </span>
                                )}

                                {/* Keyboard Shortcut Hint */}
                                {item.shortcut && !item.badgeCount && (
                                  <span
                                    className={`hidden group-hover:inline-block text-[10px] font-mono px-1 py-0.2 rounded ${
                                      isActive
                                        ? 'text-slate-400'
                                        : 'text-slate-400 bg-slate-100 border border-slate-200'
                                    }`}
                                  >
                                    {item.shortcut}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Collapsed Mode Floating Notification Dot */}
                            {isCollapsed && typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                              </span>
                            )}
                          </button>

                          {/* Collapsed Mode Popover Tooltip */}
                          {isCollapsed && isHovered && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2.5 z-50 w-56 rounded-md bg-slate-900 text-white p-2.5 shadow-xl border border-slate-800 pointer-events-none animate-in fade-in-0 zoom-in-95 duration-150">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-xs text-white">
                                  {item.label}
                                </span>
                                {item.shortcut && (
                                  <kbd className="font-mono text-[9px] bg-slate-800 px-1 py-0.2 rounded text-slate-400 border border-slate-700">
                                    {item.shortcut}
                                  </kbd>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-300 leading-tight">
                                {item.description}
                              </p>
                              <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                                <span>{section.title}</span>
                                {typeof item.badgeCount === 'number' && (
                                  <span className="text-amber-400 font-bold">
                                    {item.badgeCount} pending
                                  </span>
                                )}
                                {!accessible && (
                                  <span className="text-rose-400 flex items-center gap-0.5">
                                    <Lock className="w-2.5 h-2.5" />
                                    {item.requiredRole} Only
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer / Telemetry & Active Operator Status */}
        <div className="border-t border-slate-200 bg-slate-50/70 p-2.5 space-y-2">
          {!isCollapsed ? (
            <div className="rounded-md border border-slate-200 bg-white p-2 text-xs shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-500 uppercase">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>Compliance Engine</span>
                </span>
                <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  REG-F PASS
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Model Latency</span>
                <span className="text-slate-700 font-semibold">18ms • Tier 1</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center" title="Compliance Engine: ACTIVE">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
