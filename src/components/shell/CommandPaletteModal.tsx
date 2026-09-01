import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  X,
  Sparkles,
  ArrowRight,
  Shield,
  CreditCard,
  User,
  Inbox,
  FolderTree,
  Building2,
  Lock,
} from 'lucide-react';
import { NavigationSection, NavigationItem, UserRole } from '../../types/shell';
import { SidebarIcon } from './SidebarIcon';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: NavigationSection[];
  onSelectItem: (item: NavigationItem) => void;
  currentUserRole: UserRole;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  sections,
  onSelectItem,
  currentUserRole,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'NAVIGATION' | 'DEBTORS' | 'ACCOUNTS'>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global keydown handler for ESC and arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Flatten all navigation items
  const allNavItems = sections.flatMap((s) => s.items);

  // Sample quick debt entities to search
  const mockEntities = [
    {
      id: 'entity-1',
      type: 'DEBTORS',
      title: 'Robert Henderson (Vanguard Logistics LLC)',
      subtitle: 'SSN: •••-••-8910 • Active Claim #CLM-4012 • $48,500.00 USD',
      targetId: 'work-queue',
      badge: 'DPD: 124d',
    },
    {
      id: 'entity-2',
      type: 'ACCOUNTS',
      title: 'Account #ACC-88910 (Apex Commercial Lease Tranche)',
      subtitle: 'Origination: 2024-Q2 • Principal: $142,850.75 USD • Status: ADVISORY',
      targetId: 'accounts',
      badge: 'Tier 1 Risk',
    },
    {
      id: 'entity-3',
      type: 'DEBTORS',
      title: 'Elena Rostova (Metropolitan Freight Corp)',
      subtitle: 'Verified Liquidity Spike +35% • Promise to Pay Cleared',
      targetId: 'customers',
      badge: 'Settlement 89%',
    },
  ];

  // Filter items
  const filteredNavItems = allNavItems.filter((item) => {
    if (activeCategory === 'DEBTORS' || activeCategory === 'ACCOUNTS') return false;
    if (!query) return true;
    return (
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.sectionId.toLowerCase().includes(query.toLowerCase())
    );
  });

  const filteredEntities = mockEntities.filter((entity) => {
    if (activeCategory === 'NAVIGATION') return false;
    if (activeCategory !== 'ALL' && entity.type !== activeCategory) return false;
    if (!query) return true;
    return (
      entity.title.toLowerCase().includes(query.toLowerCase()) ||
      entity.subtitle.toLowerCase().includes(query.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, debtors, accounts, or navigation..."
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono px-2 py-1 rounded bg-slate-200/80 text-slate-600 hover:bg-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2 bg-white text-xs">
          <span className="font-mono text-[10px] uppercase font-bold text-slate-400 mr-1">
            Scope:
          </span>
          {(
            [
              { id: 'ALL', label: 'All Results' },
              { id: 'NAVIGATION', label: 'Console Navigation' },
              { id: 'DEBTORS', label: 'Debtors & Claims' },
              { id: 'ACCOUNTS', label: 'Accounts & Portfolios' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeCategory === tab.id
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Navigation Results */}
          {filteredNavItems.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Console Navigation ({filteredNavItems.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredNavItems.map((item) => {
                  const accessible =
                    !item.requiredRole ||
                    currentUserRole === 'ADMIN' ||
                    (currentUserRole === 'QA_AUDITOR' && item.requiredRole === 'QA_AUDITOR');

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectItem(item);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs hover:bg-slate-50 group transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                          <SidebarIcon name={item.icon} className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{item.label}</span>
                            <span className="text-[10px] font-mono uppercase text-slate-400">
                              {item.sectionId}
                            </span>
                            {item.isAiPowered && (
                              <span className="flex items-center gap-0.5 rounded bg-indigo-50 px-1 py-0.2 text-[9px] font-bold text-indigo-700 border border-indigo-200">
                                <Sparkles className="w-2.5 h-2.5" /> AI
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!accessible && (
                          <span className="flex items-center gap-1 rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 border border-slate-200">
                            <Lock className="w-2.5 h-2.5" /> {item.requiredRole}
                          </span>
                        )}
                        {item.shortcut && (
                          <kbd className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200">
                            {item.shortcut}
                          </kbd>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Debtor & Account Records */}
          {filteredEntities.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Debtors & Accounts ({filteredEntities.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredEntities.map((entity) => (
                  <button
                    key={entity.id}
                    onClick={() => {
                      const navTarget = allNavItems.find((it) => it.id === entity.targetId);
                      if (navTarget) onSelectItem(navTarget);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg text-left text-xs hover:bg-slate-50 group transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
                        {entity.type === 'DEBTORS' ? (
                          <User className="w-3.5 h-3.5" />
                        ) : (
                          <CreditCard className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{entity.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {entity.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 border border-slate-200">
                      {entity.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNavItems.length === 0 && filteredEntities.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500 font-mono">
              No matching records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-white border border-slate-200 px-1 py-0.2 rounded shadow-2xs">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="bg-white border border-slate-200 px-1 py-0.2 rounded shadow-2xs">↵</kbd> Select
            </span>
          </div>
          <span>StageFlow Command Palette</span>
        </div>
      </div>
    </div>
  );
};
