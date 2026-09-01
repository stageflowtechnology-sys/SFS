import React, { useState } from 'react';
import {
  X,
  UserCheck,
  RotateCcw,
  Phone,
  MessageSquare,
  FileText,
  Sparkles,
  ShieldCheck,
  Clock,
  DollarSign,
  AlertTriangle,
  Building,
  User,
  History,
  CheckCircle2,
  Lock,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { WorkQueueAccount } from '../../types/workQueue';
import { Button } from '../ui/Button';
import { Tabs } from '../ui/Tabs';
import { StatusPill } from '../ui/StatusPill';

interface AccountDetailDrawerProps {
  account: WorkQueueAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimAccount: (account: WorkQueueAccount) => void;
  onReleaseAccount: (account: WorkQueueAccount) => void;
  currentOperatorId: string;
  onLogOutcome?: (account: WorkQueueAccount) => void;
}

export const AccountDetailDrawer: React.FC<AccountDetailDrawerProps> = ({
  account,
  isOpen,
  onClose,
  onClaimAccount,
  onReleaseAccount,
  currentOperatorId,
}) => {
  const [activeTab, setActiveTab] = useState<string>('financials');
  const [customDiscount, setCustomDiscount] = useState<number>(account?.authorizedSettlementDiscountPct || 25);
  const [isDialing, setIsDialing] = useState<boolean>(false);
  const [dialStatus, setDialStatus] = useState<string | null>(null);

  if (!isOpen || !account) return null;

  const isClaimedByMe =
    account.ownership.state === 'CLAIMED_BY_ME' ||
    account.ownership.claimedByOperatorId === currentOperatorId;
  const isClaimedByOther = account.ownership.state === 'CLAIMED_BY_OTHER' && !isClaimedByMe;
  const isUnclaimed = account.ownership.state === 'UNCLAIMED';

  const calculateDiscountPayoff = (pct: number) => {
    const discounted = account.balance * (1 - pct / 100);
    return Math.max(0, discounted);
  };

  const handleStartDial = () => {
    setIsDialing(true);
    setDialStatus('Initiating secure dual-channel recording dial...');
    setTimeout(() => {
      setDialStatus('Connecting to primary verified line: (415) 892-4912...');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-2xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900">
                {account.accountNumber}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                {account.creditorName}
              </span>
              {account.priority === 'P1_CRITICAL' && (
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                  P1 CRITICAL
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm font-bold text-slate-900">
                {account.customerName}
              </span>
              <span className="text-xs font-mono text-slate-500">
                ({account.customerId} • {account.state})
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ownership Status & Primary Actions Bar */}
        <div className="p-3 bg-indigo-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="font-semibold text-slate-600">Ownership:</span>
            {isUnclaimed ? (
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                UNCLAIMED POOL
              </span>
            ) : isClaimedByMe ? (
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                CLAIMED BY YOU ({currentOperatorId})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                CLAIMED: {account.ownership.claimedByName} ({account.ownership.claimedByOperatorId})
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isUnclaimed ? (
              <Button
                size="xs"
                variant="primary"
                leftIcon={<UserCheck className="w-3 h-3" />}
                onClick={() => onClaimAccount(account)}
              >
                Claim This Account
              </Button>
            ) : isClaimedByMe ? (
              <Button
                size="xs"
                variant="outline"
                leftIcon={<RotateCcw className="w-3 h-3" />}
                onClick={() => onReleaseAccount(account)}
              >
                Release to Pool
              </Button>
            ) : null}

            <Button
              size="xs"
              variant="primary"
              leftIcon={<Phone className="w-3 h-3 text-emerald-400" />}
              onClick={handleStartDial}
            >
              Start Dial
            </Button>
          </div>
        </div>

        {/* Dialing Banner if active */}
        {isDialing && (
          <div className="p-2.5 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-mono font-medium">{dialStatus}</span>
            </div>
            <button
              onClick={() => setIsDialing(false)}
              className="text-[11px] font-mono text-emerald-800 underline hover:text-emerald-950"
            >
              End Call
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-4 border-b border-slate-200 shrink-0 bg-white">
          <Tabs
            tabs={[
              { id: 'financials', label: 'Financials & Settlement' },
              { id: 'contact', label: 'Contact & Skip Trace' },
              { id: 'copilot', label: 'AI Strategy & Advice' },
              { id: 'history', label: 'Touch History' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Drawer Scrollable Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'financials' && (
            <div className="space-y-4">
              {/* Financial Balance Summary */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Total Balance</span>
                  <span className="text-base font-bold text-slate-900">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Principal</span>
                  <span className="text-sm font-semibold text-slate-700">
                    ${account.principalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Fees & Interest</span>
                  <span className="text-sm font-semibold text-amber-700">
                    +${account.feesAccrued.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Settlement Authority Calculator */}
              <div className="p-3.5 border border-indigo-200 bg-indigo-50/30 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-bold text-indigo-950 font-sans">
                      Settlement Authority Matrix
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                    Max Approved: {account.authorizedSettlementDiscountPct}% Discount
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center font-mono">
                  {[15, 25, 35, account.authorizedSettlementDiscountPct].map((pct) => (
                    <div
                      key={pct}
                      onClick={() => setCustomDiscount(pct)}
                      className={`p-2 rounded border cursor-pointer transition-all ${
                        customDiscount === pct
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-bold'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-[10px] uppercase">{pct}% Disc</div>
                      <div className="text-xs font-bold mt-0.5">
                        ${calculateDiscountPayoff(pct).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-white rounded border border-slate-200 flex items-center justify-between font-mono">
                  <div>
                    <span className="text-[11px] text-slate-600 block">Selected Payoff Offer:</span>
                    <span className="text-sm font-bold text-emerald-700">
                      ${calculateDiscountPayoff(customDiscount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Button size="xs" variant="primary">
                    Generate Settlement Agreement
                  </Button>
                </div>
              </div>

              {/* Delinquency & Statute Information */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Days Past Due (DPD)</span>
                  <span className="font-bold text-slate-800">{account.daysPastDue} Days</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Bucket: {account.dpdBucket}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Statute of Limitations</span>
                  <span className="font-bold text-slate-800">
                    {account.statuteRemainingYears ? `${account.statuteRemainingYears} Years Remaining` : 'Active'}
                  </span>
                  {account.statuteWarningDays && (
                    <span className="text-[10px] text-rose-700 font-bold block mt-0.5">
                      Expires in {account.statuteWarningDays} days!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase font-mono text-slate-600 block">
                  Verified Contact Points (Reg-F Compliant)
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        (415) 892-4912
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          PRIMARY MOBILE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Verified via LexisNexis • Timezone: Pacific (FDCPA Window: 8:00 AM - 9:00 PM PT)
                      </div>
                    </div>
                    <Button size="xs" variant="outline">Call</Button>
                  </div>

                  <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-mono font-semibold text-slate-800 flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        (415) 555-0199
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                          EMPLOYER LANDLINE
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Corporate Switchboard
                      </div>
                    </div>
                    <Button size="xs" variant="outline">Call</Button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                <span className="text-[11px] font-bold uppercase font-mono text-slate-600 block">
                  Jurisdiction & Compliance Bounds
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Debtor residence state: <strong>{account.state}</strong>. Reg-F 7-in-7 call counter currently at{' '}
                  <strong className="text-slate-900 font-mono">2 of 7</strong> touches this week. No cease and desist or attorney representation on file.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'copilot' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-lg space-y-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="font-bold text-indigo-950 font-sans">
                    AI Propensity Model Assessment ({account.propensityScore}/100)
                  </span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  {account.aiRecommendationSnippet ||
                    'High propensity score driven by verified continuous employment and recent payment activity on collateral loans.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold uppercase font-mono text-slate-600 block">
                  Recommended Negotiation Protocol
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                  <li>Open call with verification of identity and mini-Miranda disclosure.</li>
                  <li>Inquire about the reason for delinquency before presenting settlement numbers.</li>
                  <li>If debtor cites temporary cash crunch, offer the 3-pay structured settlement at {account.authorizedSettlementDiscountPct}% discount.</li>
                  <li>Secure immediate debit card or ACH routing verification before concluding call.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-2.5">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-slate-900">{account.lastContactTime}</span>
                  <span className="text-slate-500">{account.lastContactChannel}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1 font-medium">
                  {account.lastContactOutcome}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-slate-900">4 days ago</span>
                  <span className="text-slate-500">VOICE OUTBOUND</span>
                </div>
                <p className="text-xs text-slate-700 mt-1">
                  Connected with debtor. Discussed account status and emailed breakdown ledger.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-slate-900">10 days ago</span>
                  <span className="text-slate-500">SYSTEM DISPATCH</span>
                </div>
                <p className="text-xs text-slate-700 mt-1">
                  Delinquency Notice #2 mailed to verified primary address.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <span className="text-[11px] font-mono text-slate-400">
            Esc to close • ⌘↵ to confirm
          </span>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close Inspector
          </Button>
        </div>
      </div>
    </div>
  );
};
