import React, { useState } from 'react';
import { AccountDetailData } from '../../types/accountDetail';
import { StateOrigin } from '../../types/design-system';
import { OriginCardWrapper } from '../workbench/OriginCardWrapper';
import { OriginBadge } from '../ui/OriginBadge';
import {
  DollarSign,
  Calculator,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Calendar,
  Clock,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  UserCheck,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  FileText,
  Volume2,
  Play,
  Pause,
  ExternalLink,
  Percent,
} from 'lucide-react';

interface AccountOverviewTabProps {
  data: AccountDetailData;
  onApplyAction?: (actionTitle: string, terms: string) => void;
  onOpenDialer?: (phoneNumber: string) => void;
  onOpenInteractionsTab?: () => void;
  onOpenTimelineTab?: () => void;
}

export const AccountOverviewTab: React.FC<AccountOverviewTabProps> = ({
  data,
  onApplyAction,
  onOpenDialer,
  onOpenInteractionsTab,
  onOpenTimelineTab,
}) => {
  const {
    account,
    customer,
    delinquency,
    stage,
    assignedCollector,
    contactability,
    contacts,
    recentInteractions,
    aiIntelligence,
  } = data;

  // Settlement Calculator State
  const [customDiscountPct, setCustomDiscountPct] = useState<number>(
    account.authorizedDiscountPct
  );

  const calculatedSettlementAmount =
    account.totalBalance * (1 - customDiscountPct / 100);
  const calculatedSavings = account.totalBalance - calculatedSettlementAmount;

  // Next Action Origin Interactive State
  const [actionOriginState, setActionOriginState] = useState<StateOrigin>(
    aiIntelligence.recommendedNextAction.origin
  );
  const [actionConfirmedAt, setActionConfirmedAt] = useState<string | null>(null);

  // Audio preview simulation state for recent interaction
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  const handleApproveAction = () => {
    setActionOriginState('HUMAN_DECISION');
    setActionConfirmedAt('Confirmed by you just now');

    setTimeout(() => {
      setActionOriginState('SYSTEM_EXECUTION');
      setTimeout(() => {
        setActionOriginState('VERIFIED_GROUND_TRUTH');
        if (onApplyAction) {
          onApplyAction(
            aiIntelligence.recommendedNextAction.actionTitle,
            aiIntelligence.recommendedNextAction.suggestedTerms
          );
        }
      }, 1500);
    }, 1200);
  };

  const handleResetActionOrigin = () => {
    setActionOriginState('AI_RECOMMENDATION');
    setActionConfirmedAt(null);
  };

  const latestInteraction = recentInteractions[0];
  const primaryPhone = contacts.find((c) => c.type.startsWith('PHONE') && c.isPrimary) || contacts[0];

  return (
    <div className="space-y-6">
      {/* 2-Column Responsive Grid for Core Functional Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (7 cols): Account Summary, Settlement Calculator, Current Stage */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. ACCOUNT SUMMARY MODULE */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                    Account Summary & Financial Breakdown
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Direct Ledger Reconciliation • {account.accountNumber}
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {account.accountType}
              </span>
            </div>

            {/* Financial Ledger Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  Principal Amount
                </span>
                <div className="text-sm font-mono font-bold text-slate-900">
                  ${account.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Original: ${account.originalBalance.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  Accrued Interest
                </span>
                <div className="text-sm font-mono font-bold text-amber-900">
                  ${account.accruedInterest.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Prime + 4.5% Cap
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  Accrued Late Fees
                </span>
                <div className="text-sm font-mono font-bold text-rose-900">
                  ${account.accruedFees.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Waivable by Op
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-semibold">
                  Total Exposure
                </span>
                <div className="text-sm font-mono font-bold text-emerald-950">
                  ${account.totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] text-emerald-700 font-mono">
                  Full Payoff Amount
                </div>
              </div>
            </div>

            {/* Origination, Charge-Off & Last Payment Milestones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-100 font-mono">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">Origination Date</span>
                <span className="font-bold text-slate-800">{account.originationDate}</span>
                <span className="text-[10px] text-slate-500">Limit: ${account.originalCreditLimit.toLocaleString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">Charge-Off Date</span>
                <span className="font-bold text-rose-800">{account.chargeOffDate}</span>
                <span className="text-[10px] text-slate-500">{delinquency.daysPastDue} Days Delinquent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase">Last Recorded Payment</span>
                <span className="font-bold text-slate-800">
                  {account.lastPaymentDate ? `${account.lastPaymentDate} ($${account.lastPaymentAmount?.toLocaleString()})` : 'None on File'}
                </span>
                <span className="text-[10px] text-emerald-700">Reconciled via Wire</span>
              </div>
            </div>

            {/* Interactive Settlement Authority Calculator */}
            <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-700" />
                  <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-950">
                    Authorized Settlement Authority Calculator
                  </span>
                </div>
                <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                  Max Cap: {account.authorizedDiscountPct}% Discount
                </span>
              </div>

              {/* Slider for Settlement Discount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Settlement Discount Percentage:</span>
                  <span className="font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                    {customDiscountPct}% Discount
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max={account.authorizedDiscountPct}
                  step="1"
                  value={customDiscountPct}
                  onChange={(e) => setCustomDiscountPct(Number(e.target.value))}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>0% (Full Balance: ${account.totalBalance.toLocaleString()})</span>
                  <span>Max Approved: {account.authorizedDiscountPct}% (${account.minAcceptableSettlement.toLocaleString()})</span>
                </div>
              </div>

              {/* Calculated Output Box */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-indigo-100 text-xs font-mono">
                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-[10px] text-slate-500 uppercase">Settlement Payoff</span>
                  <div className="text-sm font-bold text-indigo-950">
                    ${calculatedSettlementAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-[10px] text-slate-500 uppercase">Debtor Savings</span>
                  <div className="text-sm font-bold text-emerald-700">
                    ${calculatedSavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-indigo-100 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-500 uppercase">Min Acceptable Floor</span>
                  <div className="text-sm font-bold text-slate-800">
                    ${account.minAcceptableSettlement.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal & Compliance Safeguards Bar */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-700" />
                  <span>Statutory Limitation & Legal Defense Status</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                  {delinquency.statuteStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>SOL Expiry: {delinquency.statuteOfLimitationsDate} ({delinquency.statuteRemainingYears} yrs left)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Bankruptcy Search: Clear (No active PACER filing)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Cease & Desist: None Logged</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. CURRENT STAGE DEEP DIVE MODULE */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                    Current Stage • {stage.currentStageLabel}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Entered: {stage.stageEnteredDate} ({stage.daysInCurrentStage} days in stage)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  SLA: {stage.slaStatus} ({stage.daysInCurrentStage}/{stage.slaTargetDays} Days Target)
                </span>
                <OriginBadge origin={stage.origin} size="sm" />
              </div>
            </div>

            {/* Stage Exit Criteria Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Mandatory Stage Exit Criteria:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {stage.exitCriteria.map((criterion, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{criterion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Regulatory Compliance Mandates */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Active Regulatory Mandates:
              </span>
              <div className="space-y-1">
                {stage.complianceMandates.map((mandate, idx) => (
                  <div
                    key={idx}
                    className="text-xs font-mono text-slate-600 flex items-start gap-1.5 bg-amber-50/50 p-2 rounded border border-amber-200 text-amber-900"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{mandate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Next Action, Contactability Indicator, Recent Interaction */}
        <div className="lg:col-span-5 space-y-6">
          {/* 3. NEXT ACTION MODULE (Strict 4-State Demarcation) */}
          <OriginCardWrapper
            origin={actionOriginState}
            title={aiIntelligence.recommendedNextAction.actionTitle}
            confidence={aiIntelligence.recommendedNextAction.confidence}
            operatorId={actionOriginState !== 'AI_RECOMMENDATION' ? assignedCollector.operatorId : undefined}
            timestamp={actionConfirmedAt || undefined}
            actionButtons={
              actionOriginState === 'AI_RECOMMENDATION' ? (
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-mono text-indigo-700 font-bold">
                    Advisory Recommendation
                  </span>
                  <button
                    onClick={handleApproveAction}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Authorize & Execute</span>
                  </button>
                </div>
              ) : actionOriginState === 'SYSTEM_EXECUTION' ? (
                <div className="flex items-center justify-between w-full text-cyan-900 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-700" />
                    Executing Settlement Agreement Rail...
                  </span>
                </div>
              ) : actionOriginState === 'VERIFIED_GROUND_TRUTH' ? (
                <div className="flex items-center justify-between w-full text-emerald-950 text-xs font-mono">
                  <span className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    Authorized by Op #{assignedCollector.operatorId}
                  </span>
                  <button
                    onClick={handleResetActionOrigin}
                    className="text-[10px] text-slate-500 hover:text-slate-800 underline"
                  >
                    Reset Demo
                  </button>
                </div>
              ) : (
                <div className="text-xs font-mono text-amber-900 font-bold">
                  Signed off by {assignedCollector.name}
                </div>
              )
            }
          >
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Suggested Terms & Structure:
                </span>
                <p className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed font-sans">
                  {aiIntelligence.recommendedNextAction.suggestedTerms}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Decision Engine Rationale:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {aiIntelligence.recommendedNextAction.rationale}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Statistical Evidence & Collateral:
                </span>
                <ul className="space-y-1 font-mono text-slate-600 text-[11px]">
                  {aiIntelligence.recommendedNextAction.evidenceList.map((ev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-indigo-600">•</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </OriginCardWrapper>

          {/* 4. CONTACTABILITY INDICATOR MODULE */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                    Contactability & Channel Score
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    TCPA Safe Harbor Validated
                  </p>
                </div>
              </div>

              {/* Overall Score Dial */}
              <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                <span className="text-xs font-mono font-bold text-emerald-800">
                  {contactability.overallScore}/100
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                  (High Reach)
                </span>
              </div>
            </div>

            {/* Multi-channel Score Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Phone Score</span>
                <span className="text-xs font-bold text-slate-900">{contactability.phoneScore}%</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Email Score</span>
                <span className="text-xs font-bold text-slate-900">{contactability.emailScore}%</span>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase block">Address Score</span>
                <span className="text-xs font-bold text-slate-900">{contactability.addressScore}%</span>
              </div>
            </div>

            {/* Best Window & Timezone Compliance */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Optimal Calling Window:</span>
                <span className="font-bold text-slate-900">{contactability.bestWindow}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Debtor Timezone:</span>
                <span className="font-bold text-slate-900">{contactability.timezone}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">30-Day Contact Success Rate:</span>
                <span className="font-bold text-emerald-700">
                  {contactability.successfulContactsLast30Days}/{contactability.contactAttemptsLast30Days} ({contactability.contactRatePct}%)
                </span>
              </div>
            </div>

            {/* Quick Contact Points List */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Verified Direct Reach Points:
              </span>
              <div className="space-y-1.5">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50/80 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {contact.type.startsWith('PHONE') ? (
                        <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : contact.type === 'EMAIL' ? (
                        <Mail className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      ) : (
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-slate-900 truncate">
                          {contact.value}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {contact.label} • Verified {contact.lastVerifiedDate}
                        </div>
                      </div>
                    </div>

                    {contact.type.startsWith('PHONE') && (
                      <button
                        onClick={() => onOpenDialer && onOpenDialer(contact.value)}
                        className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-mono font-bold flex items-center gap-1 border border-indigo-200 shrink-0 cursor-pointer"
                        title="Dial this number"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Dial</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. RECENT INTERACTION MODULE */}
          {latestInteraction && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
                      Recent Interaction Touchpoint
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {latestInteraction.timestamp}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                  {latestInteraction.disposition}
                </span>
              </div>

              {/* Interaction Details */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>Channel: {latestInteraction.channel} ({latestInteraction.direction})</span>
                  <span>Operator: {latestInteraction.operatorName}</span>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">
                  {latestInteraction.summary}
                </p>

                {latestInteraction.ptpAmount && (
                  <div className="flex items-center justify-between p-2 rounded bg-emerald-50 border border-emerald-200 font-mono text-xs">
                    <span className="text-emerald-800 font-semibold">Agreed Cure PTP Amount:</span>
                    <span className="font-bold text-emerald-950">
                      ${latestInteraction.ptpAmount.toLocaleString()} due {latestInteraction.ptpDueDate}
                    </span>
                  </div>
                )}

                {latestInteraction.recordingDuration && (
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-600">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                        className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                      >
                        {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                      <span>Call Recording ({latestInteraction.recordingDuration})</span>
                    </div>
                    <span className="text-slate-400">FDCPA Compliant Archival</span>
                  </div>
                )}
              </div>

              {/* View all interactions button */}
              {onOpenInteractionsTab && (
                <button
                  onClick={onOpenInteractionsTab}
                  className="w-full py-2 text-xs font-mono text-indigo-600 hover:text-indigo-800 font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-50/50 rounded-lg transition-colors border border-transparent hover:border-indigo-100"
                >
                  <span>View Full Interaction Log ({recentInteractions.length} Touches)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
