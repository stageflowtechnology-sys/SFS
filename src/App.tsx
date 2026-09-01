/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  SHELL_NAVIGATION_SECTIONS,
  MOCK_ORGANIZATIONS,
  INITIAL_OPERATOR_PROFILE,
  MOCK_NOTIFICATIONS,
} from './data/shellNavigation';
import {
  NavigationSection,
  NavigationItem,
  Organization,
  OperatorProfile,
  ShellNotification,
  UserRole,
  UserStatus,
} from './types/shell';
import { Sidebar } from './components/shell/Sidebar';
import { TopBar } from './components/shell/TopBar';
import { PageContainer } from './components/shell/PageContainer';
import { CommandPaletteModal } from './components/shell/CommandPaletteModal';
import { PhilippineLocalizationProvider } from './context/PhilippineLocalizationContext';
import { PhilippineLocalizationDrawer } from './components/shell/PhilippineLocalizationDrawer';

export default function App() {
  // Navigation & Shell State
  const [sections] = useState<NavigationSection[]>(SHELL_NAVIGATION_SECTIONS);
  const [activeItemId, setActiveItemId] = useState<string>('skip-trace');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Multi-tenant & Organization State
  const [organizations, setOrganizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [activeOrganization, setActiveOrganization] = useState<Organization>(MOCK_ORGANIZATIONS[0]);

  // Operator / User State
  const [currentUser, setCurrentUser] = useState<OperatorProfile>(INITIAL_OPERATOR_PROFILE);

  // Notifications State
  const [notifications, setNotifications] = useState<ShellNotification[]>(MOCK_NOTIFICATIONS);

  // Command Palette Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Keyboard shortcut listeners for ⌘K (Search) and ⌘[ (Collapse)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      // ⌘[ or Ctrl+[ for toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === '[') {
        e.preventDefault();
        setIsSidebarCollapsed((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Find active section and item
  let currentSection = sections[0];
  let currentItem = sections[0].items[0];

  for (const sec of sections) {
    const found = sec.items.find((it) => it.id === activeItemId);
    if (found) {
      currentSection = sec;
      currentItem = found;
      break;
    }
  }

  const handleSelectItem = (item: NavigationItem) => {
    setActiveItemId(item.id);
  };

  const handleUpdateUserRole = (role: UserRole) => {
    setCurrentUser((prev) => {
      let roleTitle = 'Licensed Senior Recovery Specialist';
      if (role === 'QA_AUDITOR') roleTitle = 'QA Compliance Lead Auditor';
      if (role === 'ADMIN') roleTitle = 'Operations Administrator';
      return { ...prev, role, roleTitle };
    });
  };

  const handleUpdateUserStatus = (status: UserStatus) => {
    setCurrentUser((prev) => ({ ...prev, status }));
  };

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNavigateToView = (viewId: string) => {
    setActiveItemId(viewId);
  };

  return (
    <PhilippineLocalizationProvider>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
        {/* Top Application Navigation Bar */}
        <TopBar
          organizations={organizations}
          activeOrganization={activeOrganization}
          onSelectOrganization={setActiveOrganization}
          currentUser={currentUser}
          onUpdateUserRole={handleUpdateUserRole}
          onUpdateUserStatus={handleUpdateUserStatus}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onNavigateToView={handleNavigateToView}
        />

        {/* App Body: Left Sidebar + Responsive Page Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar
            sections={sections}
            activeItemId={activeItemId}
            onSelectItem={handleSelectItem}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            currentUserRole={currentUser.role}
            isMobileOpen={isMobileSidebarOpen}
            onMobileClose={() => setIsMobileSidebarOpen(false)}
          />

          {/* Main Content Viewport & Page Container */}
          <PageContainer
            currentSection={currentSection}
            currentItem={currentItem}
            onSelectItem={handleSelectItem}
            currentUserRole={currentUser.role}
            currentUser={currentUser}
            activeOrganization={activeOrganization}
          />
        </div>

        {/* Global Command Palette / Search Modal */}
        <CommandPaletteModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          sections={sections}
          onSelectItem={handleSelectItem}
          currentUserRole={currentUser.role}
        />

        {/* Philippine Localization Drawer / Terminology & Compliance Hub */}
        <PhilippineLocalizationDrawer />
      </div>
    </PhilippineLocalizationProvider>
  );
}
