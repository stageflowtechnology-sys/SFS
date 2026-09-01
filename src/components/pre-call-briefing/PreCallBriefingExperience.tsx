import React, { useState } from 'react';
import { PRE_CALL_BRIEFING_ACCOUNTS } from '../../data/preCallBriefingMockData';
import { PreCallBriefingAccount } from '../../types/preCallBriefing';
import { AccountContextSummaryBar } from './AccountContextSummaryBar';
import { AiBriefingAdvisoryBanner } from './AiBriefingAdvisoryBanner';
import { RecommendedApproachCard } from './RecommendedApproachCard';
import { HistoricalFactVsAiEvidenceMatrix } from './HistoricalFactVsAiEvidenceMatrix';
import { ImportantAccountContextCard } from './ImportantAccountContextCard';
import { PreviousInteractionSummaryCard } from './PreviousInteractionSummaryCard';
import { RiskFlagsSection } from './RiskFlagsSection';
import { SuggestedOpeningAndTalkingPoints } from './SuggestedOpeningAndTalkingPoints';
import { ContactabilityIndicatorsCard } from './ContactabilityIndicatorsCard';
import { PreCallReadinessChecklist } from './PreCallReadinessChecklist';
import { Sparkles, PhoneCall, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';

interface PreCallBriefingExperienceProps {
  onNavigateToWorkbench?: (accountId: string) => void;
}

export const PreCallBriefingExperience: React.FC<PreCallBriefingExperienceProps> = ({
  onNavigateToWorkbench,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<PreCallBriefingAccount>(
    PRE_CALL_BRIEFING_ACCOUNTS[0]
  );
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationNotice, setRegenerationNotice] = useState<string | null>(null);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setRegenerationNotice(null);
    setTimeout(() => {
      setIsRegenerating(false);
      setRegenerationNotice('Model inference refreshed with latest core banking ledger and telephony feeds.');
      setTimeout(() => setRegenerationNotice(null), 4000);
    }, 1200);
  };

  const handleLaunchCall = (account: PreCallBriefingAccount) => {
    if (onNavigateToWorkbench) {
      onNavigateToWorkbench(account.id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Experience Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              StageFlow Copilot • Pre-Call Preparation
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-mono text-xs text-slate-500 font-semibold">
              Advisory Decision Support
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            AI Pre-Call Briefing: {selectedAccount.customerName}
          </h1>
          <p className="text-xs text-slate-600 font-sans mt-0.5">
            Operational intelligence, negotiation boundaries, and compliance playbooks prepared before opening dialogue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {regenerationNotice && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{regenerationNotice}</span>
            </div>
          )}
          {onNavigateToWorkbench && (
            <button
              onClick={() => onNavigateToWorkbench(selectedAccount.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-indigo-600" />
              <span>Open Collector Workbench</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. Account Context Summary Bar */}
      <AccountContextSummaryBar
        account={selectedAccount}
        allAccounts={PRE_CALL_BRIEFING_ACCOUNTS}
        onSelectAccount={setSelectedAccount}
      />

      {/* 2. Advisory Notice Banner */}
      <AiBriefingAdvisoryBanner briefing={selectedAccount.briefing} />

      {/* 3. Recommended Approach & Strategy */}
      <RecommendedApproachCard strategy={selectedAccount.briefing.strategy} />

      {/* 4. Evidence Discrimination: Historical Fact vs AI Interpretation */}
      <HistoricalFactVsAiEvidenceMatrix
        facts={selectedAccount.briefing.historicalFacts}
        interpretations={selectedAccount.briefing.aiInterpretations}
      />

      {/* 5. Important Account Context & Nuance */}
      <ImportantAccountContextCard
        context={selectedAccount.briefing.accountContextAnalysis}
      />

      {/* 6. Previous Interaction Summary & Historical Logs */}
      <PreviousInteractionSummaryCard
        interactions={selectedAccount.previousInteractions}
        aiSummary={selectedAccount.briefing.interactionSummary}
      />

      {/* 7. Risk Flags & Regulatory Compliance */}
      <RiskFlagsSection riskFlags={selectedAccount.briefing.riskFlags} />

      {/* 8. Suggested Opening & Interactive Talking Points */}
      <SuggestedOpeningAndTalkingPoints
        suggestedOpening={selectedAccount.briefing.suggestedOpening}
        talkingPoints={selectedAccount.briefing.talkingPoints}
      />

      {/* 9. Contactability Indicators */}
      <ContactabilityIndicatorsCard
        indicators={selectedAccount.briefing.contactability}
        account={selectedAccount}
      />

      {/* 10. Collector Readiness Gate & Outreach Launch */}
      <PreCallReadinessChecklist
        account={selectedAccount}
        onLaunchCall={handleLaunchCall}
        onRegenerate={handleRegenerate}
        isRegenerating={isRegenerating}
      />
    </div>
  );
};
