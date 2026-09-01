import React, { useState } from 'react';
import {
  MousePointer,
  Sparkles,
  CheckCheck,
  Trash2,
  Download,
  Filter,
  Plus,
  ArrowRight,
  Shield,
  HelpCircle,
  Clock,
  Send,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Checkbox, Switch } from '../ui/Input';
import { SearchInput, Dropdown } from '../ui/SearchInput';
import { Tooltip } from '../ui/Tooltip';
import { Badge } from '../ui/Badge';

export const ButtonsAndFormsSection: React.FC = () => {
  // Interactive state demos
  const [searchValue, setSearchValue] = useState('');
  const [currencyVal, setCurrencyVal] = useState('24500.00');
  const [selectedDisposition, setSelectedDisposition] = useState('PROMISE_TO_PAY');
  const [requireHumanSignOff, setRequireHumanSignOff] = useState(true);
  const [autoSmsEnabled, setAutoSmsEnabled] = useState(false);
  const [checkboxState, setCheckboxState] = useState({
    legalReview: true,
    bureauReport: false,
    skipTrace: true,
  });
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const simulateLoading = () => {
    setIsLoadingBtn(true);
    setTimeout(() => setIsLoadingBtn(false), 2000);
  };

  return (
    <div className="space-y-10">
      {/* 1. Buttons & Action Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <MousePointer className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Button Hierarchy & Operational Actions
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-6 shadow-2xs">
          {/* Main Action Matrix */}
          <div>
            <div className="text-xs font-bold text-slate-900 mb-3">Semantic Variants</div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary (Default)</Button>
              <Button variant="outline">Outline Neutral</Button>
              <Button variant="ghost">Ghost Action</Button>
              <Button variant="ai-action">
                AI Recommendation Action
              </Button>
              <Button variant="authoritative-confirm">
                Authoritative Sign-off
              </Button>
              <Button variant="destructive" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                Write-Off Debt
              </Button>
              <Button
                variant="secondary"
                isLoading={isLoadingBtn}
                onClick={simulateLoading}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                {isLoadingBtn ? 'Executing Sync...' : 'Test Async Action'}
              </Button>
            </div>
          </div>

          {/* Size Scale */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-900 mb-3">
              Operational Density Size Scale (Height / Padding)
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Button size="xs" variant="secondary">
                  Dense Table (h-7 / 28px)
                </Button>
                <span className="font-mono text-[10px] text-slate-400">size="xs"</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="secondary">
                  Standard Ops (h-8 / 32px)
                </Button>
                <span className="font-mono text-[10px] text-slate-400">size="sm" (default)</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="md" variant="secondary">
                  Modal Action (h-9 / 36px)
                </Button>
                <span className="font-mono text-[10px] text-slate-400">size="md"</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="lg" variant="primary">
                  Header CTA (h-10 / 40px)
                </Button>
                <span className="font-mono text-[10px] text-slate-400">size="lg"</span>
              </div>
            </div>
          </div>

          {/* Icon & Special Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-3 flex-wrap">
            <Button variant="secondary" size="xs" leftIcon={<Download className="w-3 h-3" />}>
              Export Ledger CSV
            </Button>
            <Button variant="ai-action" size="xs" rightIcon={<ArrowRight className="w-3 h-3" />}>
              Apply Strategy v3.4
            </Button>
            <Button variant="outline" size="xs" disabled>
              Disabled Action
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Form Controls & High-Density Financial Inputs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Form Controls, Currency Numerics & Validation
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-6 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Standard Text Input */}
            <Input
              label="Debtor SSN / National Tax ID"
              helperText="Encrypted at rest"
              placeholder="XXX-XX-8941"
              isMono
            />

            {/* Currency Input with Prefix & Suffix */}
            <Input
              label="Settlement Settlement Ceiling"
              prefixText="$"
              suffixText="USD"
              value={currencyVal}
              onChange={(e) => setCurrencyVal(e.target.value)}
              isMono
              helperText="Strict tabular numerical figure"
            />

            {/* Select Control */}
            <Select
              label="Legal Recovery Stage"
              value={selectedDisposition}
              onChange={(e) => setSelectedDisposition(e.target.value)}
              options={[
                { value: 'PROMISE_TO_PAY', label: 'Stage 1: Promise to Pay' },
                { value: 'PRE_LEGAL_DEMAND', label: 'Stage 2: Pre-Legal Demand Notice' },
                { value: 'LITIGATION_FILED', label: 'Stage 3: Active Litigation Filed' },
                { value: 'JUDGMENT_ENFORCEMENT', label: 'Stage 4: Judgment Enforcement' },
                { value: 'WRITE_OFF', label: 'Stage 5: Uncollectible Write-Off' },
              ]}
            />
          </div>

          {/* Validation & Error States */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Input
              label="Required Account Reference"
              placeholder="e.g. ACC-2024-998"
              error="Account number format must match ACC-YYYY-XXXXX"
              defaultValue="INVALID_REF_99"
              isMono
            />

            <Input
              label="Interest Rate Adjustment"
              prefixText="%"
              suffixText="p.a."
              defaultValue="8.45"
              isMono
            />

            <Input
              label="Disabled Control"
              defaultValue="AUTO_LOCKED_BY_POLICY"
              disabled
              isMono
              helperText="Locked during in-flight batch cycle"
            />
          </div>

          {/* Switches & Checkboxes */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900">Boolean Operational Gates</div>
              <div className="space-y-3">
                <Switch
                  checked={requireHumanSignOff}
                  onChange={setRequireHumanSignOff}
                  label="Enforce Human Sign-off Threshold (> $10,000)"
                  description="When active, AI cannot autonomously trigger ACH debit without licensed officer review."
                />
                <Switch
                  checked={autoSmsEnabled}
                  onChange={setAutoSmsEnabled}
                  label="Automated TCPA-Compliant SMS Reminder Cadence"
                  description="Dispatches reminder 48h prior to installment due date."
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-900">Compliance & Regulatory Checkboxes</div>
              <div className="space-y-2">
                <Checkbox
                  checked={checkboxState.legalReview}
                  onChange={(e) =>
                    setCheckboxState({ ...checkboxState, legalReview: e.target.checked })
                  }
                  label="FCRA / FDCPA Disclosure Form Sent"
                  description="Validated against debtor state statutory requirements."
                />
                <Checkbox
                  checked={checkboxState.bureauReport}
                  onChange={(e) =>
                    setCheckboxState({ ...checkboxState, bureauReport: e.target.checked })
                  }
                  label="Credit Bureau Derogatory Reporting Scheduled"
                  description="Queues Metro 2 transmission for next monthly cycle."
                />
                <Checkbox
                  checked={checkboxState.skipTrace}
                  onChange={(e) =>
                    setCheckboxState({ ...checkboxState, skipTrace: e.target.checked })
                  }
                  label="Continuous Skip-Tracing Active"
                  description="Auto-updates postal and employer records via credit header sync."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Search, Filters & Dropdowns */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Search, Facet Filters & Tooltips
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search portfolio by debtor name, SSN, case #, or ledger hash..."
            />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500 font-medium">Quick Facets:</span>
              <Badge variant="purple" size="sm">
                AI Confidence &gt; 85%
              </Badge>
              <Badge variant="warning" size="sm">
                DPD &gt; 90 Days
              </Badge>
              <Badge variant="danger" size="sm">
                Failed Webhooks (3)
              </Badge>
              <Badge variant="success" size="sm">
                Reconciled Today
              </Badge>
            </div>
          </div>

          {/* Tooltips & Data Lineage In Place */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-6 flex-wrap text-xs text-slate-500">
            <span>Hover for data lineage:</span>

            <Tooltip
              content="Calculated based on 14-day payroll cadence and verified direct deposit history."
              lineageInfo={{
                source: 'Payroll & Banking Feed',
                modelOrSystem: 'Settlement-Predictor v2.4',
                confidenceOrAudit: '89.4% Probability',
              }}
              shortcut="⇧⌥D"
            >
              <span className="inline-flex items-center gap-1 font-mono text-indigo-700 font-medium underline decoration-dashed cursor-help">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                Suggested Settlement: $12,400.00
              </span>
            </Tooltip>

            <Tooltip
              content="Immutable cryptographic receipt verified against ACH clearinghouse settlement batch."
              lineageInfo={{
                source: 'Federal Clearinghouse Rail',
                modelOrSystem: 'Core Banking API v3',
                confidenceOrAudit: '100% Reconciled',
              }}
            >
              <span className="inline-flex items-center gap-1 font-mono text-emerald-700 font-medium underline decoration-dashed cursor-help">
                <Shield className="w-3 h-3 text-emerald-600" />
                Ledger Ref: 0x8849...32AC
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
};
