import React from 'react';
import {
  Inbox,
  Briefcase,
  LayoutDashboard,
  Users,
  CreditCard,
  FolderTree,
  Megaphone,
  Sparkles,
  Search,
  CalendarClock,
  AlertTriangle,
  Mic,
  ClipboardCheck,
  BookOpen,
  ShieldAlert,
  GitBranch,
  BarChart3,
  Building2,
  UserCog,
  Settings,
  HelpCircle,
  Palette,
  SlidersHorizontal,
  FileCheck2,
  Bot,
} from 'lucide-react';

interface SidebarIconProps {
  name: string;
  className?: string;
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Bot':
      return <Bot className={className} />;
    case 'Palette':
      return <Palette className={className} />;
    case 'Inbox':
      return <Inbox className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'LayoutDashboard':
      return <LayoutDashboard className={className} />;
    case 'SlidersHorizontal':
      return <SlidersHorizontal className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'CreditCard':
      return <CreditCard className={className} />;
    case 'FolderTree':
      return <FolderTree className={className} />;
    case 'Megaphone':
      return <Megaphone className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Search':
      return <Search className={className} />;
    case 'CalendarClock':
      return <CalendarClock className={className} />;
    case 'AlertTriangle':
      return <AlertTriangle className={className} />;
    case 'FileCheck2':
      return <FileCheck2 className={className} />;
    case 'Mic':
      return <Mic className={className} />;
    case 'ClipboardCheck':
      return <ClipboardCheck className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'GitBranch':
      return <GitBranch className={className} />;
    case 'BarChart3':
      return <BarChart3 className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'UserCog':
      return <UserCog className={className} />;
    case 'Settings':
      return <Settings className={className} />;
    default:
      return <HelpCircle className={className} />;
  }
};
