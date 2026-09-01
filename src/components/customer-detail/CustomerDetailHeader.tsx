import React, { useState } from 'react';
import { CustomerDetailData } from '../../types/customerDetail';
import { StatusPill } from '../ui/StatusPill';
import { OriginBadge } from '../ui/OriginBadge';
import {
  User,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Layers,
  Copy,
  Check,
  ChevronDown,
  PhoneCall,
  MessageSquare,
  FileText,
  Sparkles,
  Scale,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CustomerDetailHeaderProps {
  data: CustomerDetailData;
  allCustomerIds: { id: string; name: string; type: string }[];
  selectedCustomerId: string;
  onSelectCustomer: (id: string) => void;
  onOpenDialer?: (phone: string) => void;
  onOpenSms?: (phone: string) => void;
  onNavigateToWorkbench?: () => void;
}

export const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({
  data,
  allCustomerIds,
  selectedCustomerId,
  onSelectCustomer,
  onOpenDialer,
  onOpenSms,
  onNavigateToWorkbench,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const {
    customer,
    location,
    contactability,
    investigation,
    collectionContext,
    accounts,
    contacts,
  } = data;

  const primaryPhone = contacts.find((c) => c.type.startsWith('PHONE') && c.isPrimary)?.value || contacts.find((c) => c.type.startsWith('PHONE'))?.value;
  const primaryEmail = contacts.find((c) => c.type === 'EMAIL' && c.isPrimary)?.value || contacts.find((c) => c.type === 'EMAIL')?.value;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div id="customer-detail-header" className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Meta Bar: Debtor Master Identity & Quick Profile Switcher */}
      <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer Master Record
            </span>
            <span className="text-slate-600">•</span>
            {/* Customer Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium rounded-md border border-slate-700 transition-colors"
                title="Switch Customer Master Record"
              >
                <span>{customer.id}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCustomerDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1 text-xs">
                  <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-slate-800">
                    Select Debtor Profile
                  </div>
                  {allCustomerIds.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSelectCustomer(c.id);
                        setIsCustomerDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        c.id === selectedCustomerId ? 'bg-indigo-950/60 text-indigo-300 font-medium' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{c.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{c.id} • {c.type}</div>
                      </div>
                      {c.id === selectedCustomerId && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleCopy(customer.id, 'customerId')}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              title="Copy Customer ID"
            >
              {copiedField === 'customerId' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {primaryPhone && (
            <button
              onClick={() => onOpenDialer && onOpenDialer(primaryPhone)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Primary ({primaryPhone})</span>
            </button>
          )}

          {primaryPhone && (
            <button
              onClick={() => onOpenSms && onOpenSms(primaryPhone)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-md border border-slate-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span>SMS Portal</span>
            </button>
          )}

          {onNavigateToWorkbench && (
            <button
              onClick={onNavigateToWorkbench}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open in Workbench</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Information Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-start">
        {/* Column 1: Customer Name & Core Demographics */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {customer.name}
                </h1>
                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
                  customer.type === 'COMMERCIAL'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-blue-50 text-blue-800 border-blue-200'
                }`}>
                  {customer.type === 'COMMERCIAL' ? 'Commercial Entity & Guarantor' : 'Individual Debtor'}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  KYC Verified
                </span>
              </div>

              {customer.businessName && (
                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.businessName}</span>
                  {customer.dba && (
                    <span className="text-slate-400 font-normal">(DBA: {customer.dba})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Demographic & Identity Snapshot */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono">
            <div>
              <span className="text-slate-400 font-sans block text-[10px] uppercase tracking-wider">Masked SSN</span>
              <span className="font-semibold text-slate-800">{customer.ssnMasked}</span>
            </div>
            <div>
              <span className="text-slate-400 font-sans block text-[10px] uppercase tracking-wider">DOB</span>
              <span className="font-semibold text-slate-800">{customer.dobMasked}</span>
            </div>
            {customer.tinEinMasked && (
              <div>
                <span className="text-slate-400 font-sans block text-[10px] uppercase tracking-wider">Employer EIN / TIN</span>
                <span className="font-semibold text-slate-800">{customer.tinEinMasked}</span>
              </div>
            )}
            <div>
              <span className="text-slate-400 font-sans block text-[10px] uppercase tracking-wider">Verified Employer</span>
              <span className="font-semibold text-slate-800 font-sans truncate block" title={customer.employerName}>
                {customer.employerName}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2: Contactability Metric Block */}
        <div className="space-y-2 border-l border-slate-100 pl-0 md:pl-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
            <span>Contactability</span>
            <OriginBadge origin={contactability.origin} size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-bold text-sm">
              {contactability.overallScore}
              <span className="text-[9px] font-normal text-emerald-600 absolute bottom-1">%</span>
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">
                {contactability.rating.replace('_', ' ')}
              </span>
              <div className="text-xs text-slate-600 mt-0.5 font-medium">
                {contactability.successfulContactsLast30Days}/{contactability.contactAttemptsLast30Days} Reach Rate ({contactability.contactRatePct}%)
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={contactability.bestCallingWindow}>
              Best: {contactability.bestCallingWindow}
            </span>
          </div>
        </div>

        {/* Column 3: Account Count & Exposure */}
        <div className="space-y-2 border-l border-slate-100 pl-0 md:pl-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
            <span>Linked Exposure</span>
            <span className="text-[10px] font-bold text-slate-600">{accounts.length} Accounts</span>
          </div>

          <div>
            <div className="text-lg font-bold text-slate-900 tracking-tight">
              {formatCurrency(collectionContext.totalAggregateExposure)}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Principal: {formatCurrency(collectionContext.totalPrincipal)} • Fees: {formatCurrency(collectionContext.totalInterestAndFees)}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold rounded">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Max {collectionContext.highestDpd} DPD
            </span>
            <span className="text-[11px] text-slate-500">
              SOL: ~{collectionContext.solYearsRemaining}y rem.
            </span>
          </div>
        </div>

        {/* Column 4: Status & Location Jurisdiction */}
        <div className="space-y-2 border-l border-slate-100 pl-0 md:pl-4">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
            Status & Location
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <StatusPill status={collectionContext.overallStatus} />
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {investigation.overallStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="text-xs text-slate-700 font-medium flex items-start gap-1.5 pt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <div>{location.city}, {location.state} {location.zip}</div>
              <div className="text-[11px] text-slate-500">{location.timezone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Safe Harbor / Jurisdictional Banner */}
      <div className="bg-slate-50 px-5 py-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-semibold text-slate-700">Jurisdiction Rule:</span>
          <span>{location.jurisdictionRules}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
            <Check className="w-3 h-3" /> TCPA Calling Window Safe
          </span>
          <span className="text-slate-300">•</span>
          <span>Last Investigation: {investigation.lastFullInvestigationDate}</span>
        </div>
      </div>
    </div>
  );
};
