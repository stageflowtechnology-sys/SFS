import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Building2,
  Bell,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Shield,
  ShieldAlert,
  SlidersHorizontal,
  LogOut,
  UserCheck,
  Radio,
  Plus,
  Command,
  FileSpreadsheet,
  Phone,
  PhoneCall,
  Activity,
  Check,
  ExternalLink,
  Menu,
  Key,
  Languages,
} from 'lucide-react';
import {
  Organization,
  OperatorProfile,
  ShellNotification,
  UserRole,
  UserStatus,
} from '../../types/shell';
import { usePhilippineLocalization } from '../../context/PhilippineLocalizationContext';
import { CommunicationLanguage } from '../../services/philippineCollections';

interface TopBarProps {
  organizations: Organization[];
  activeOrganization: Organization;
  onSelectOrganization: (org: Organization) => void;
  currentUser: OperatorProfile;
  onUpdateUserRole: (role: UserRole) => void;
  onUpdateUserStatus: (status: UserStatus) => void;
  notifications: ShellNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onOpenSearch: () => void;
  onOpenMobileSidebar: () => void;
  onNavigateToView: (viewId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  organizations,
  activeOrganization,
  onSelectOrganization,
  currentUser,
  onUpdateUserRole,
  onUpdateUserStatus,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsRead,
  onOpenSearch,
  onOpenMobileSidebar,
  onNavigateToView,
}) => {
  // Dropdown states
  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'AI' | 'COMPLIANCE' | 'AUDIT'>('ALL');

  const {
    communicationLanguage,
    setCommunicationLanguage,
    setIsLocalizationDrawerOpen,
  } = usePhilippineLocalization();

  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const notifDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const actionsDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setIsOrgDropdownOpen(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
        setIsActionsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const unreadCount = unreadNotifications.length;

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'ALL') return true;
    if (notifFilter === 'AI') return n.category === 'AI_INFERENCE';
    if (notifFilter === 'COMPLIANCE') return n.category === 'COMPLIANCE';
    if (notifFilter === 'AUDIT') return n.category === 'AUDIT';
    return true;
  });

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-500 ring-emerald-200';
      case 'IN_CALL':
        return 'bg-amber-500 ring-amber-200 animate-pulse';
      case 'DND':
        return 'bg-rose-500 ring-rose-200';
      case 'AWAY':
        return 'bg-slate-400 ring-slate-200';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'OPERATOR':
        return 'Senior Recovery Specialist';
      case 'QA_AUDITOR':
        return 'QA Compliance Auditor';
      case 'ADMIN':
        return 'Operations Administrator';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-15 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xs px-3 sm:px-4 lg:px-6">
      {/* Left Section: Mobile Hamburger + Organization Selector */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onOpenMobileSidebar}
          aria-label="Open Navigation"
          className="inline-flex lg:hidden h-8.5 w-8.5 items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Organization Switcher Dropdown */}
        <div className="relative" ref={orgDropdownRef}>
          <button
            onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-2xs group"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-900 text-white font-bold text-[10px]">
              <Building2 className="w-3 h-3" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate font-bold text-slate-900">
                  {activeOrganization.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 leading-none mt-0.5 hidden sm:inline">
                {activeOrganization.code} • {activeOrganization.portfoliosCount} Portfolios
              </span>
            </div>
          </button>

          {/* Org Switcher Menu */}
          {isOrgDropdownOpen && (
            <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in-0 zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Switch Operating Entity
              </div>
              <div className="mt-1 space-y-1">
                {organizations.map((org) => {
                  const isSelected = org.id === activeOrganization.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => {
                        onSelectOrganization(org);
                        setIsOrgDropdownOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2 rounded-md text-left text-xs transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/80 text-indigo-950 border border-indigo-200 font-semibold'
                          : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{org.name}</div>
                        <div className="font-mono text-[10px] text-slate-500 mt-0.5">
                          {org.code} • {org.activeClaimsCount.toLocaleString()} Active Claims
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                              org.environment === 'PRODUCTION'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {org.environment}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {org.regulatedRail}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Live Philippine Banking & Regulatory Telemetry Pill */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-[11px]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
          <span className="font-bold">BSP Cir. 454 & SEC MC-18: PASS</span>
          <span className="text-emerald-700">•</span>
          <span className="text-emerald-700">PHT (UTC+08:00)</span>
        </div>
      </div>

      {/* Center Section: Global Search Command Trigger */}
      <div className="flex-1 max-w-md mx-2 sm:mx-4">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 px-3 py-1.5 text-xs text-slate-500 transition-all shadow-2xs group focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
            <span className="truncate text-slate-500 group-hover:text-slate-800">
              Search borrowers, endorsement accounts, claims or commands...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 border border-slate-200 shadow-2xs group-hover:border-slate-300">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right Section: Language Switcher, Localization Drawer, Quick Actions, Notifications & User */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Philippine Language Switcher & Localization Drawer Trigger */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-0.5 rounded-md border border-slate-200">
          {(['ENGLISH', 'TAGLISH', 'FILIPINO'] as CommunicationLanguage[]).map((lang) => {
            const isSelected = communicationLanguage === lang;
            return (
              <button
                key={lang}
                onClick={() => setCommunicationLanguage(lang)}
                title={`Switch collector guidance & templates to ${lang}`}
                className={`px-2 py-1 text-[11px] font-mono font-bold rounded transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                {lang === 'ENGLISH' && 'EN'}
                {lang === 'TAGLISH' && 'TAGLISH'}
                {lang === 'FILIPINO' && 'FIL'}
              </button>
            );
          })}
          <button
            onClick={() => setIsLocalizationDrawerOpen(true)}
            title="Open Philippine Collections Localization & Guidelines"
            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-white rounded transition-colors ml-0.5"
          >
            <Languages className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Contextual Action: Quick Ingestion / Fast Action Dropdown */}
        <div className="relative" ref={actionsDropdownRef}>
          <button
            onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
            className="flex items-center gap-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Quick Action</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isActionsDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-60 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Philippine Ops Shortcuts
              </div>
              <button
                onClick={() => {
                  onNavigateToView('work-queue');
                  setIsActionsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ingest Endorsement Batch (Excel/CSV)</span>
              </button>
              <button
                onClick={() => {
                  onNavigateToView('skip-trace');
                  setIsActionsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <Search className="w-3.5 h-3.5 text-emerald-600" />
                <span>Barangay & Address Verification</span>
              </button>
              <button
                onClick={() => {
                  onNavigateToView('workbench');
                  setIsActionsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                <span>Launch Tele-Collector Dial Station</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative" ref={notifDropdownRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            aria-label="View notifications"
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 font-mono text-[9px] font-bold text-white shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-80 sm:w-96 rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in-0 zoom-in-95 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-3.5 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">Audit & Ops Alerts</span>
                  {unreadCount > 0 && (
                    <span className="rounded bg-indigo-100 px-1.5 py-0.2 font-mono text-[10px] font-bold text-indigo-800">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Filter Chips */}
              <div className="flex items-center gap-1 border-b border-slate-100 px-3 py-1.5 bg-white text-[11px]">
                {(['ALL', 'AI', 'COMPLIANCE', 'AUDIT'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setNotifFilter(filter)}
                    className={`px-2 py-0.5 rounded font-medium transition-colors ${
                      notifFilter === filter
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Notification Items List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationAsRead(notif.id);
                        if (notif.targetViewId) {
                          onNavigateToView(notif.targetViewId);
                          setIsNotifDropdownOpen(false);
                        }
                      }}
                      className={`p-3 text-xs transition-colors cursor-pointer ${
                        !notif.isRead
                          ? 'bg-indigo-50/40 hover:bg-indigo-50/70'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {notif.category === 'AI_INFERENCE' && (
                            <span className="flex items-center gap-0.5 rounded bg-indigo-100 px-1 py-0.2 text-[9px] font-bold text-indigo-800">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                          {notif.category === 'COMPLIANCE' && (
                            <span className="flex items-center gap-0.5 rounded bg-rose-100 px-1 py-0.2 text-[9px] font-bold text-rose-800">
                              <ShieldAlert className="w-2.5 h-2.5" /> FDCPA
                            </span>
                          )}
                          {notif.category === 'AUDIT' && (
                            <span className="flex items-center gap-0.5 rounded bg-amber-100 px-1 py-0.2 text-[9px] font-bold text-amber-800">
                              <SlidersHorizontal className="w-2.5 h-2.5" /> AUDIT
                            </span>
                          )}
                          <span className="font-bold text-slate-900 line-clamp-1">
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 font-mono">
                    No active notifications in this category.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current Operator Profile & Role Switcher */}
        <div className="relative" ref={userDropdownRef}>
          <button
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white hover:bg-slate-50 p-1 sm:px-2 sm:py-1 transition-all shadow-2xs group"
          >
            {/* Operator Avatar + Status Ring */}
            <div className="relative">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-900 text-white font-bold text-xs tracking-tight">
                AS
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${getStatusColor(
                  currentUser.status
                )}`}
              />
            </div>

            {/* Operator Details (Hidden on tiny screens) */}
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="font-bold text-xs text-slate-900 max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 leading-none mt-0.5">
                {currentUser.operatorId} • {currentUser.role}
              </span>
            </div>
          </button>

          {/* User Profile & Role Simulation Menu */}
          {isUserDropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-lg border border-slate-200 bg-white p-3 shadow-xl animate-in fade-in-0 zoom-in-95 space-y-3">
              {/* Header Info */}
              <div className="border-b border-slate-100 pb-2.5">
                <div className="font-bold text-xs text-slate-900">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 font-medium">{currentUser.email}</div>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono text-slate-600">
                  <span className="rounded bg-slate-100 px-1 py-0.2 font-semibold">
                    {currentUser.operatorId}
                  </span>
                  <span>{currentUser.licenseNumber}</span>
                </div>
              </div>

              {/* Operator Availability Status */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Operator Status
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  {(
                    [
                      { key: 'AVAILABLE', label: 'Available' },
                      { key: 'IN_CALL', label: 'In Active Call' },
                      { key: 'DND', label: 'Do Not Disturb' },
                      { key: 'AWAY', label: 'Away' },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.key}
                      onClick={() => onUpdateUserStatus(st.key)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        currentUser.status === st.key
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getStatusColor(st.key)}`}
                      />
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permission & Role Switcher */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  <span>Permission Role (Active)</span>
                  <span className="text-indigo-600">Demo Switcher</span>
                </div>
                <div className="space-y-1 text-xs">
                  {(
                    [
                      { role: 'OPERATOR', desc: 'Standard Work Queue & Claims' },
                      { role: 'QA_AUDITOR', desc: 'Call Audits & Scoring Matrix' },
                      { role: 'ADMIN', desc: 'Full System, Policy & User Gov' },
                    ] as const
                  ).map((r) => {
                    const isCurrent = currentUser.role === r.role;
                    return (
                      <button
                        key={r.role}
                        onClick={() => onUpdateUserRole(r.role)}
                        className={`w-full flex items-start justify-between p-2 rounded text-left transition-colors ${
                          isCurrent
                            ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">
                            {r.role === 'OPERATOR' && 'Senior Operator'}
                            {r.role === 'QA_AUDITOR' && 'QA Compliance Auditor'}
                            {r.role === 'ADMIN' && 'Operations Administrator'}
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">{r.desc}</div>
                        </div>
                        {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Session Lineage & Sign Out */}
              <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[10px]">Session: AES-256</span>
                <button
                  onClick={() => setIsUserDropdownOpen(false)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Lock Station</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
