import React from 'react';
import { PortfolioAccountItem } from '../../types/portfolio';
import { Drawer } from '../ui/Drawer';
import { StatusPill } from '../ui/StatusPill';
import { OriginBadge } from '../ui/OriginBadge';
import { Badge } from '../ui/Badge';
import {
  CreditCard,
  User,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  ShieldCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface AccountQuickDrawerProps {
  account: PortfolioAccountItem | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const AccountQuickDrawer: React.FC<AccountQuickDrawerProps> = ({
  account,
  isOpen,
  onClose,
  onNavigateToWorkbench,
}) => {
  if (!account) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={account.customerName}
      subtitle={`Account #${account.accountNumber} • ${account.cityState}`}
      width="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close Drawer
          </button>
          {onNavigateToWorkbench && (
            <button
              onClick={() => {
                onClose();
                onNavigateToWorkbench(account.accountNumber);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
            >
              <span>Open in Collector Workbench</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Core Financial Block */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block">
              Outstanding Balance
            </span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-0.5">
              {formatCurrency(account.balance)}
            </div>
            <div className="text-[11px] font-mono text-slate-500 mt-0.5">
              Principal: {formatCurrency(account.originalPrincipal)}
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block">
              Delinquency Aging
            </span>
            <div className="text-xl font-bold font-mono text-rose-700 mt-0.5">
              {account.daysPastDue} DPD
            </div>
            <div className="mt-0.5">
              <Badge variant="warning" size="xs">
                Bucket: {account.dpdBucket}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status & Origin Block */}
        <div className="space-y-2">
          <span className="font-bold text-slate-900 block">Status & Governance</span>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill status={account.status} size="sm" />
            <OriginBadge origin={account.origin} size="sm" />
            <Badge variant="purple" size="sm">
              Stage: {account.stage.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>

        {/* AI Recommendation Box */}
        <div className="p-3.5 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>AI Prescriptive Action</span>
            </div>
            <span className="font-mono font-bold text-indigo-700">
              Propensity Score: {account.propensityScore}/100
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">
            {account.recommendedAction}
          </p>
        </div>

        {/* Contact Points */}
        <div className="p-4 rounded-lg bg-white border border-slate-200 space-y-2.5">
          <span className="font-bold text-slate-900 block">Verified Debtor Contact Points</span>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{account.phone}</span>
              </span>
              <Badge variant="success" size="xs">Verified Contact</Badge>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{account.email}</span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">Consent: ACTIVE</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{account.cityState}</span>
              </span>
              <span className="text-[10px] text-slate-400">SSN: {account.ssnMasked}</span>
            </div>
          </div>
        </div>

        {/* Assigned Collector Details */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase text-slate-500 font-semibold block">
              Assigned Collector
            </span>
            <div className="font-bold text-slate-900 mt-0.5">
              {account.assignedCollectorName}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Operator ID: {account.assignedCollectorId}
            </div>
          </div>
          <span className="font-mono text-xs text-slate-500">
            Last Touch: {account.lastContactDate || 'Pending Outreach'}
          </span>
        </div>
      </div>
    </Drawer>
  );
};
