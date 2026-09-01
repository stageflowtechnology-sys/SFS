import React, { useState } from 'react';
import { Table as TableIcon, SlidersHorizontal, Tag, Sparkles, ShieldCheck, Download, Plus } from 'lucide-react';
import { OperationsTable } from '../ui/Table';
import { Tabs } from '../ui/Tabs';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { DebtCaseSample } from '../../types/design-system';

const SAMPLE_DEBT_CASES: DebtCaseSample[] = [
  {
    id: 'case-01',
    accountNumber: 'ACC-8910-234',
    debtorName: 'Apex Logistics LLC',
    principalAmount: 48500.0,
    daysPastDue: 114,
    status: 'REQUIRES_CONFIRMATION',
    aiRecommendation: {
      action: 'Offer 20% Lump-Sum Settlement ($38,800)',
      confidence: 0.89,
      modelVersion: 'RecoveryOptimizer-v3.1',
      reasoning: 'Debtor accounts receivable surge detected; 89% probability of closing within 5 days.',
      advisoryFlag: true,
    },
    authoritativeState: {
      currentStage: 'Pre-Legal Demand Notice',
      decisionMaker: 'Officer #402',
    },
    lastActivity: '2026-08-31 18:24 UTC',
  },
  {
    id: 'case-02',
    accountNumber: 'ACC-9923-810',
    debtorName: 'Marcus Sterling',
    principalAmount: 6420.5,
    daysPastDue: 45,
    status: 'EXECUTING',
    aiRecommendation: {
      action: 'Execute Auto-Debit Installment ($535/mo)',
      confidence: 0.96,
      modelVersion: 'AutodebitPolicy-v1.4',
      reasoning: 'Payment agreement signed; recurring ACH triggered via gateway.',
      advisoryFlag: false,
    },
    authoritativeState: {
      currentStage: 'Structured Installment Plan',
      ledgerHash: 'ACH-BATCH-9941',
    },
    lastActivity: '2026-08-31 20:10 UTC',
  },
  {
    id: 'case-03',
    accountNumber: 'ACC-7741-002',
    debtorName: 'Kallisto Technologies Inc.',
    principalAmount: 182300.0,
    daysPastDue: 185,
    status: 'VERIFYING',
    aiRecommendation: {
      action: 'Escalate to Regional Legal Counsel',
      confidence: 0.94,
      modelVersion: 'LitigationRisk-v2.0',
      reasoning: 'Commercial asset search verified unencumbered collateral in jurisdiction.',
      advisoryFlag: true,
    },
    authoritativeState: {
      currentStage: 'Court Filing Verification',
      ledgerHash: 'DOCKET-2026-CV-98',
    },
    lastActivity: '2026-08-31 19:45 UTC',
  },
  {
    id: 'case-04',
    accountNumber: 'ACC-4412-983',
    debtorName: 'Elena Rostova',
    principalAmount: 12800.0,
    daysPastDue: 92,
    status: 'EXECUTED_VERIFIED',
    aiRecommendation: {
      action: 'Full Satisfaction Receipt Issuance',
      confidence: 1.0,
      modelVersion: 'Settlement-RuleEngine',
      reasoning: 'Wire transfer of $12,800 cleared Fedwire counterparty rails.',
      advisoryFlag: false,
    },
    authoritativeState: {
      currentStage: 'Satisfied / Closed',
      ledgerHash: 'FEDWIRE-0x98b7...21c4',
    },
    lastActivity: '2026-08-31 16:30 UTC',
  },
  {
    id: 'case-05',
    accountNumber: 'ACC-3310-771',
    debtorName: 'Vanguard Freight Corp',
    principalAmount: 31900.0,
    daysPastDue: 140,
    status: 'EXECUTION_FAILED',
    aiRecommendation: {
      action: 'Re-queue Payment with Secondary Card',
      confidence: 0.72,
      modelVersion: 'GatewayRetry-v1.1',
      reasoning: 'Primary ACH returned R01 (NSF). Secondary instrument available.',
      advisoryFlag: true,
    },
    authoritativeState: {
      currentStage: 'Payment Exception Hold',
      decisionMaker: 'ERR_ACH_R01',
    },
    lastActivity: '2026-08-31 14:15 UTC',
  },
];

interface DataDensitySectionProps {
  onInspectAI?: (item: DebtCaseSample) => void;
  onOpenConfirmationModal?: (item: DebtCaseSample) => void;
}

export const DataDensitySection: React.FC<DataDensitySectionProps> = ({
  onInspectAI,
  onOpenConfirmationModal,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['case-01']);
  const [activeTab, setActiveTab] = useState('all_cases');
  const [segmentedTab, setSegmentedTab] = useState('active_queue');
  const [density, setDensity] = useState<'compact' | 'standard'>('standard');

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === SAMPLE_DEBT_CASES.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(SAMPLE_DEBT_CASES.map((c) => c.id));
    }
  };

  const handleAction = (actionId: string, item: DebtCaseSample) => {
    if (actionId === 'inspect_ai' && onInspectAI) {
      onInspectAI(item);
    } else if (actionId === 'execute_action' && onOpenConfirmationModal) {
      onOpenConfirmationModal(item);
    }
  };

  return (
    <div className="space-y-10">
      {/* 1. Tab Bar Navigation & Segmented Switches */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Navigation Tabs & Segmented Operational Switchers
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-6 shadow-2xs">
          {/* Underline Tabs */}
          <div>
            <div className="text-xs font-bold text-slate-900 mb-2">
              Primary Portfolio Navigation (Underline Mode)
            </div>
            <Tabs
              activeTab={activeTab}
              onChange={setActiveTab}
              tabs={[
                { id: 'all_cases', label: 'All Debt Placements', count: 1240 },
                { id: 'human_review', label: 'Requires Confirmation Gate', count: 18 },
                { id: 'ai_advisories', label: 'High-Confidence AI Strategies', count: 42 },
                { id: 'litigation', label: 'Legal & Court Docket', count: 8 },
                { id: 'reconciled', label: 'Reconciled Ground Truth', count: 890 },
              ]}
            />
          </div>

          {/* Segmented Dense Tabs */}
          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900 mb-1.5">
                Segmented Density Controls
              </div>
              <Tabs
                variant="segmented"
                activeTab={segmentedTab}
                onChange={setSegmentedTab}
                tabs={[
                  { id: 'active_queue', label: 'Active Pipeline', count: 34 },
                  { id: 'batch_runs', label: 'Scheduled ACH Batches', count: 3 },
                  { id: 'exceptions', label: 'Exceptions (Rollback)', count: 2 },
                ]}
              />
            </div>

            {/* Density Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Table Density:</span>
              <div className="inline-flex rounded-md bg-slate-100 p-0.5 border border-slate-200 text-xs">
                <button
                  onClick={() => setDensity('standard')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    density === 'standard'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Standard (36px)
                </button>
                <button
                  onClick={() => setDensity('compact')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    density === 'compact'
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Compact (28px)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. High-Density Financial Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Operations Table: AI Recommendation vs Authoritative State
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">
              {selectedIds.length} of {SAMPLE_DEBT_CASES.length} selected
            </span>
            {selectedIds.length > 0 && (
              <Button
                variant="authoritative-confirm"
                size="xs"
                onClick={() => onOpenConfirmationModal && onOpenConfirmationModal(SAMPLE_DEBT_CASES[0])}
              >
                Authorize Selected ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {/* The Live Table */}
        <OperationsTable
          data={SAMPLE_DEBT_CASES}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          onInspectAI={(item) => onInspectAI && onInspectAI(item)}
          onRowClick={(item) => onInspectAI && onInspectAI(item)}
          onAction={handleAction}
          density={density}
        />
      </div>

      {/* 3. Badges, Priority Tags & Financial Metadata Chips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Tag className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Badges, Risk Tiers & Metadata Indicators
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Risk Tiers */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">Portfolio Risk Tiers</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="danger" isMono>
                  Tier 1: Legal Immediate
                </Badge>
                <Badge variant="warning" isMono>
                  Tier 2: Escalated DPD
                </Badge>
                <Badge variant="primary" isMono>
                  Tier 3: Early Default
                </Badge>
                <Badge variant="success" isMono>
                  Tier 4: Performing Plan
                </Badge>
              </div>
            </div>

            {/* AI Weights */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">AI Model Weights</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="purple" isMono icon={<Sparkles className="w-3 h-3 text-indigo-600" />}>
                  96% Settlement Propensity
                </Badge>
                <Badge variant="purple" isMono>
                  Solvency Index: 8.4/10
                </Badge>
              </div>
            </div>

            {/* Financial Ledger Seals */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900">Financial Balances</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="currency" isMono>
                  $182,300.00 USD
                </Badge>
                <Badge variant="outline" isMono>
                  ACH Cleared #9941
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
