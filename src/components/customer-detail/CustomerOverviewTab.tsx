import React from 'react';
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
  AlertTriangle,
  FileText,
  Sparkles,
  Scale,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CreditCard,
  History,
  Briefcase,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react';

interface CustomerOverviewTabProps {
  data: CustomerDetailData;
  onNavigateToTab: (tabId: string) => void;
  onNavigateToWorkbench?: () => void;
}

export const CustomerOverviewTab: React.FC<CustomerOverviewTabProps> = ({
  data,
  onNavigateToTab,
  onNavigateToWorkbench,
}) => {
  const {
    customer,
    location,
    contactability,
    investigation,
    collectionContext,
    contacts,
    accounts,
    recentInteractions,
    aiIntelligence,
  } = data;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div id="customer-overview-tab" className="space-y-6">
      {/* Top Split: Authoritative Ground Truth vs AI-Derived Intelligence Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Authoritative Customer Ground Truth & Verified Records */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Verified Customer Identity & Demographic Record */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Customer Identity & Legal Standing
                </h2>
              </div>
              <OriginBadge origin={customer.origin} size="sm" />
            </div>

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Legal Entity & Name</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{customer.name}</div>
                  <div className="text-xs text-slate-500">{customer.type} • {customer.citizenship}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono">
                  <div className="text-[10px] uppercase font-semibold text-slate-400 font-sans">SSN & DOB</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{customer.ssnMasked}</div>
                  <div className="text-xs text-slate-500 font-sans">DOB: {customer.dobMasked}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">KYC Verification</div>
                  <div className="flex items-center gap-1 text-sm font-bold text-emerald-700 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {customer.kycStatus}
                  </div>
                  <div className="text-[11px] text-slate-500">{customer.kycProvider} ({customer.kycVerifiedDate})</div>
                </div>
              </div>

              {/* Employer / Commercial Business Information */}
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block">Verified Employment & Title</span>
                  <div className="text-xs font-semibold text-slate-800 mt-0.5">{customer.employerName}</div>
                  <div className="text-[11px] text-slate-500">{customer.employerTitle} • Est. {formatCurrency(customer.annualIncomeEst)} / yr</div>
                </div>

                {customer.businessName && (
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Commercial Business & DBA</span>
                    <div className="text-xs font-semibold text-slate-800 mt-0.5">{customer.businessName}</div>
                    <div className="text-[11px] text-slate-500">DBA: {customer.dba || 'None'} • EIN: {customer.tinEinMasked}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Verified Contact Information & TCPA Consent Status */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Verified Contact Points & TCPA Consent
                </h2>
              </div>
              <OriginBadge origin="VERIFIED_GROUND_TRUTH" size="sm" />
            </div>

            <div className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {contact.type.startsWith('PHONE') ? (
                        <Phone className="w-4 h-4 text-slate-500" />
                      ) : contact.type === 'EMAIL' ? (
                        <Mail className="w-4 h-4 text-slate-500" />
                      ) : (
                        <MapPin className="w-4 h-4 text-slate-500" />
                      )}
                      <span className="text-sm font-semibold text-slate-900 font-mono">
                        {contact.value}
                      </span>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-200">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>{contact.label}</span>
                      <span>•</span>
                      <span>Verified: {contact.lastVerifiedDate}</span>
                      <span>•</span>
                      <span className="text-slate-400">via {contact.verificationSource}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-center">
                    {contact.isConsentGiven ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        TCPA Consent: {contact.consentType.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-md border border-amber-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        Consent Pending
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Linked Debtor Accounts Master Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Linked Accounts ({accounts.length})
                </h2>
              </div>
              <button
                onClick={() => onNavigateToTab('accounts')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Account & Creditor</th>
                    <th className="py-2.5 px-4">Account Type</th>
                    <th className="py-2.5 px-4">Balance</th>
                    <th className="py-2.5 px-4">DPD</th>
                    <th className="py-2.5 px-4">Status & Stage</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {accounts.map((acc) => (
                    <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 font-mono">{acc.accountNumber}</div>
                        <div className="text-[11px] text-slate-500">{acc.creditorName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{acc.accountType}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{acc.portfolioName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{formatCurrency(acc.totalBalance)}</div>
                        <div className="text-[10px] text-slate-400">Principal: {formatCurrency(acc.principalAmount)}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 text-[11px] font-bold rounded border border-amber-200">
                          {acc.daysPastDue} DPD
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <StatusPill status={acc.status} />
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">{acc.stage}</div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onNavigateToWorkbench && (
                          <button
                            onClick={onNavigateToWorkbench}
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors inline-flex items-center gap-1 text-xs font-semibold"
                            title="Open in Workbench"
                          >
                            <span>Work</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Recent Omnichannel Interactions Preview */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Recent Interactions Across Accounts
                </h2>
              </div>
              <button
                onClick={() => onNavigateToTab('interactions')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>All Interactions ({recentInteractions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentInteractions.map((int) => (
                <div key={int.id} className="p-4 space-y-2 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{int.channel}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{new Date(int.timestamp).toLocaleString()}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{int.operatorName}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 text-[10px] font-bold rounded">
                      {int.disposition.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {int.summary}
                  </p>

                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    {int.complianceFlags.map((flag, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium border border-emerald-200">
                        ✓ {flag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Important Collection Context, Investigation & Isolated AI Intelligence */}
        <div className="lg:col-span-4 space-y-6">
          {/* Important Collection Context & Risk Flags (Authoritative) */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-700" />
                Collection Context
              </h3>
              <OriginBadge origin={collectionContext.origin} size="sm" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Statute of Limitations (SOL)</span>
                <span className="font-bold text-slate-800">
                  {collectionContext.statuteOfLimitationsEarliest} (~{collectionContext.solYearsRemaining} yrs)
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Cease & Desist Order</span>
                <span className="font-semibold text-emerald-700">
                  {collectionContext.isUnderCeaseAndDesist ? 'ACTIVE CEASE & DESIST' : 'None (Permitted to Contact)'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Attorney Represented</span>
                <span className="font-semibold text-slate-800">
                  {collectionContext.isAttorneyRepresented ? 'Yes (Route to Counsel)' : 'No (Direct Debtor Contact)'}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Active Balance Dispute</span>
                <span className={collectionContext.disputeActive ? 'font-bold text-amber-700' : 'font-semibold text-slate-700'}>
                  {collectionContext.disputeActive ? 'Active Dispute Logged' : 'No Dispute on File'}
                </span>
              </div>

              {collectionContext.disputeDetails && (
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-800 leading-snug">
                  {collectionContext.disputeDetails}
                </div>
              )}
            </div>
          </div>

          {/* Investigation Status Card (Authoritative Checks) */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Investigation & Clearance
              </h3>
              <OriginBadge origin={investigation.origin} size="sm" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700">PACER National Bankruptcy</span>
                  <span className="text-emerald-700 font-bold">✓ {investigation.pacerBankruptcyCheck.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-[11px] text-slate-500">{investigation.pacerBankruptcyCheck.details}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700">SCRA Active Duty Military</span>
                  <span className="text-emerald-700 font-bold">✓ {investigation.scraMilitaryCheck.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-[11px] text-slate-500">{investigation.scraMilitaryCheck.details}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700">SSA Death Master File</span>
                  <span className="text-emerald-700 font-bold">✓ {investigation.deceasedMasterFileCheck.status.replace(/_/g, ' ')}</span>
                </div>
                <div className="text-[11px] text-slate-500">{investigation.deceasedMasterFileCheck.details}</div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700">Civil Court & Judgment Search</span>
                  <span className="text-slate-800 font-bold">{investigation.litigationCheck.activeSuits} Suits • {investigation.litigationCheck.judgmentsCount} Judgments</span>
                </div>
                <div className="text-[11px] text-slate-500">{investigation.litigationCheck.details}</div>
              </div>
            </div>
          </div>

          {/* AI-DERIVED INTELLIGENCE MODULE (VISUALLY ISOLATED WITH PURPLE/INDIGO AI STYLING) */}
          <div className="bg-gradient-to-b from-purple-50/50 to-indigo-50/30 border-2 border-purple-300 rounded-xl shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-700" />
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                    AI Decision Intelligence
                  </h3>
                  <p className="text-[10px] text-purple-700">Advisory Analytics • Requires Operator Review</p>
                </div>
              </div>
              <OriginBadge origin="AI_RECOMMENDATION" size="sm" />
            </div>

            {/* Recommended Cross-Account Strategy */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">
                {aiIntelligence.recommendedStrategy.title}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-white/90 p-3 rounded-lg border border-purple-200">
                {aiIntelligence.recommendedStrategy.rationale}
              </p>
              <div className="text-[11px] font-mono text-purple-900 bg-purple-100/70 px-2.5 py-1.5 rounded border border-purple-200 font-medium">
                Suggested Terms: {aiIntelligence.recommendedStrategy.suggestedTerms}
              </div>
            </div>

            {/* Propensity Scores & Settlement Recovery */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-200">
              <div className="p-2.5 bg-white/80 rounded-lg border border-purple-100">
                <div className="text-[10px] uppercase font-semibold text-purple-700">Settlement Propensity</div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {aiIntelligence.settlementPropensity.score}%
                </div>
                <div className="text-[10px] text-slate-500">Rec. {aiIntelligence.settlementPropensity.recommendedDiscountPct}% Discount</div>
              </div>

              <div className="p-2.5 bg-white/80 rounded-lg border border-purple-100">
                <div className="text-[10px] uppercase font-semibold text-purple-700">Expected Recovery</div>
                <div className="text-base font-bold text-emerald-800 mt-0.5">
                  {formatCurrency(aiIntelligence.settlementPropensity.expectedRecovery)}
                </div>
                <div className="text-[10px] text-slate-500">Confidence: {(aiIntelligence.settlementPropensity.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Behavioral Profile & Leverage Points */}
            <div className="space-y-2 pt-2 border-t border-purple-200 text-xs">
              <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">
                Behavioral Insights & Leverage
              </div>
              <ul className="space-y-1 text-slate-700 text-[11px]">
                {aiIntelligence.behavioralProfile.keyLeveragePoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-purple-600 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
              <div className="p-2 bg-white/80 rounded border border-purple-100 text-[11px] text-slate-600">
                <span className="font-semibold text-purple-900">Recommended Tone: </span>
                {aiIntelligence.behavioralProfile.recommendedTone}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
