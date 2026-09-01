import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  ShieldCheck,
  Tag,
  MousePointer,
  Bell,
  SlidersHorizontal,
  Layers,
  GitCommit,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { DesignTokensSection } from './DesignTokensSection';
import { OriginDistinctionSection } from './OriginDistinctionSection';
import { StatusLanguageSection } from './StatusLanguageSection';
import { ButtonsAndFormsSection } from './ButtonsAndFormsSection';
import { DataDensitySection } from './DataDensitySection';
import { FeedbackAndOverlaysSection } from './FeedbackAndOverlaysSection';
import { TimelinesAndStatesSection } from './TimelinesAndStatesSection';
import { Modal } from '../ui/Modal';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { DebtCaseSample } from '../../types/design-system';

export type DesignSystemTab =
  | 'tokens'
  | 'origins'
  | 'status'
  | 'components'
  | 'tables_tabs'
  | 'timelines_states'
  | 'overlays_feedback';

export const DesignSystemViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DesignSystemTab>('origins');

  // Modal and Drawer Demo States
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isLineageDrawerOpen, setIsLineageDrawerOpen] = useState(false);
  const [selectedCaseForDemo, setSelectedCaseForDemo] = useState<DebtCaseSample | null>(null);

  const tabs: { id: DesignSystemTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'origins',
      label: '5-Origin Distinctive System',
      icon: <Sparkles className="w-3.5 h-3.5 text-indigo-600" />,
      badge: 'Core Rule',
    },
    {
      id: 'tokens',
      label: 'Foundations & Tokens',
      icon: <Palette className="w-3.5 h-3.5 text-slate-600" />,
    },
    {
      id: 'status',
      label: 'Status Language (13 Codes)',
      icon: <Tag className="w-3.5 h-3.5 text-slate-600" />,
    },
    {
      id: 'components',
      label: 'Buttons, Inputs & Forms',
      icon: <MousePointer className="w-3.5 h-3.5 text-slate-600" />,
    },
    {
      id: 'tables_tabs',
      label: 'Tables, Tabs & Badges',
      icon: <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />,
    },
    {
      id: 'timelines_states',
      label: 'Timelines, Filters & States',
      icon: <GitCommit className="w-3.5 h-3.5 text-slate-600" />,
      badge: 'New',
    },
    {
      id: 'overlays_feedback',
      label: 'Alerts, Modals & Drawers',
      icon: <Bell className="w-3.5 h-3.5 text-slate-600" />,
    },
  ];

  const handleInspectAI = (item: DebtCaseSample) => {
    setSelectedCaseForDemo(item);
    setIsLineageDrawerOpen(true);
  };

  const handleOpenConfirmation = (item: DebtCaseSample) => {
    setSelectedCaseForDemo(item);
    setIsConfirmationModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                Design System Specification
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-700 border border-slate-200">
                <span>StageFlow AI v3.0</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800 border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Financial Ops Restrained</span>
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              StageFlow AI Design System Foundation
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-4xl leading-relaxed">
              Engineered exclusively for financial debt collection operations. Features strict visual discrimination
              between statistical AI advisories and authoritative reconciled ground truth, 4px baseline spatial rhythm,
              tabular numerical alignment, and high-density desktop controls.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setIsConfirmationModalOpen(true)}
            >
              Test Modal
            </Button>
            <Button
              variant="ai-action"
              size="xs"
              onClick={() => setIsLineageDrawerOpen(true)}
            >
              Test Drawer
            </Button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Section Content */}
      <div className="animate-in fade-in duration-150">
        {activeTab === 'origins' && <OriginDistinctionSection />}
        {activeTab === 'tokens' && <DesignTokensSection />}
        {activeTab === 'status' && <StatusLanguageSection />}
        {activeTab === 'components' && <ButtonsAndFormsSection />}
        {activeTab === 'tables_tabs' && (
          <DataDensitySection
            onInspectAI={handleInspectAI}
            onOpenConfirmationModal={handleOpenConfirmation}
          />
        )}
        {activeTab === 'timelines_states' && <TimelinesAndStatesSection />}
        {activeTab === 'overlays_feedback' && (
          <FeedbackAndOverlaysSection
            onOpenModalDemo={() => setIsConfirmationModalOpen(true)}
            onOpenDrawerDemo={() => setIsLineageDrawerOpen(true)}
          />
        )}
      </div>

      {/* Authoritative Confirmation Modal Demo */}
      <Modal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        title="Authorize Irrevocable Debt Settlement"
        subtitle="This action modifies the legal ledger balance and issues binding payoff documentation."
        size="md"
        authoritativeBadge="Human Sign-off Required"
        footer={
          <>
            <Button
              variant="secondary"
              size="xs"
              onClick={() => setIsConfirmationModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="authoritative-confirm"
              size="xs"
              onClick={() => {
                alert('Settlement authorized & written to ledger!');
                setIsConfirmationModalOpen(false);
              }}
            >
              Authorize & Commit Settlement
            </Button>
          </>
        }
      >
        <div className="space-y-3.5">
          <div className="p-3 rounded bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
            <div className="font-semibold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Statutory Compliance Notice (FDCPA Reg-F)</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Once authorized, the debtor account will transition to <strong>APPLIED_SETTLEMENT</strong>.
              All automated collection outreach will be permanently disabled across SMS, dialer, and email channels.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 bg-slate-50 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Account</span>
              <div className="font-bold text-slate-900">
                {selectedCaseForDemo?.accountNumber || 'ACC-8910-234'}
              </div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Debtor</span>
              <div className="font-bold text-slate-900">
                {selectedCaseForDemo?.debtorName || 'Apex Logistics LLC'}
              </div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Current Principal</span>
              <div className="font-bold text-slate-900">
                ${selectedCaseForDemo?.principalAmount.toLocaleString() || '48,500.00'} USD
              </div>
            </div>
            <div>
              <span className="text-slate-400 uppercase text-[10px]">Settlement Amount</span>
              <div className="font-bold text-emerald-700 font-mono">$38,800.00 USD (20% Discount)</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* AI Decision Lineage Drawer Demo */}
      <Drawer
        isOpen={isLineageDrawerOpen}
        onClose={() => setIsLineageDrawerOpen(false)}
        title="AI Decision Lineage & Model Explainability"
        subtitle={`Model: Recovery-Optimizer-v3.4 • Account: ${
          selectedCaseForDemo?.accountNumber || 'ACC-8910-234'
        }`}
        width="lg"
        footer={
          <>
            <Button variant="secondary" size="xs" onClick={() => setIsLineageDrawerOpen(false)}>
              Close Drawer
            </Button>
            <Button
              variant="ai-action"
              size="xs"
              onClick={() => {
                setIsLineageDrawerOpen(false);
                setIsConfirmationModalOpen(true);
              }}
            >
              Proceed to Authorize Strategy
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-3.5 rounded border border-dashed border-indigo-300 bg-indigo-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase font-bold text-indigo-700">
                Inference Summary (Advisory)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-semibold">
                89.4% Settlement Propensity
              </span>
            </div>
            <h4 className="text-xs font-bold text-indigo-950">
              {selectedCaseForDemo?.aiRecommendation.action ||
                'Offer 20% Lump-Sum Settlement ($38,800.00)'}
            </h4>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed">
              {selectedCaseForDemo?.aiRecommendation.reasoning ||
                'Debtor bank transaction analysis identified high payroll concentration and seasonal cashflow peak. Historic cohort data shows 89% settlement acceptance within 5 business days.'}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="font-bold text-slate-900">Statistical Feature Weights</div>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Direct Deposit Consistency</span>
                <span className="font-bold text-indigo-700">+42% weight</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Days Past Due (114d)</span>
                <span className="font-bold text-amber-700">-12% weight</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span>Prior Broken Promise-to-Pay Count (0)</span>
                <span className="font-bold text-emerald-700">+28% weight</span>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
