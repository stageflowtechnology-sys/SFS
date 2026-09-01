import React, { useState } from 'react';
import { PortfolioItem, PortfolioCollectorSummary } from '../../types/portfolio';
import { MOCK_ALL_COLLECTORS } from '../../data/portfolioMockData';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import {
  Users,
  Check,
  Plus,
  Trash2,
  SlidersHorizontal,
  Crown,
  ShieldCheck,
} from 'lucide-react';

interface AssignCollectorsModalProps {
  portfolio: PortfolioItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (collectors: PortfolioCollectorSummary[]) => void;
}

export const AssignCollectorsModal: React.FC<AssignCollectorsModalProps> = ({
  portfolio,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedCollectors, setSelectedCollectors] = useState<PortfolioCollectorSummary[]>(
    portfolio.collectors
  );
  const [strategy, setStrategy] = useState<'EQUAL' | 'BALANCE_WEIGHTED' | 'PROPENSITY'>('EQUAL');

  const availableCollectors = MOCK_ALL_COLLECTORS.filter(
    (c) => !selectedCollectors.some((sc) => sc.operatorId === c.operatorId)
  );

  const handleAddCollector = (collector: typeof MOCK_ALL_COLLECTORS[0]) => {
    const newEntry: PortfolioCollectorSummary = {
      id: collector.id,
      operatorId: collector.operatorId,
      name: collector.name,
      avatarInitials: collector.avatarInitials,
      role: collector.role,
      assignedAccounts: Math.round(portfolio.accountCount.active / (selectedCollectors.length + 1)),
      assignedBalance: Math.round(portfolio.balance.currentActiveBalance / (selectedCollectors.length + 1)),
      capacityUtilizationPct: 75,
      resolutionRatePct: 38.0,
      ptpAdherenceRatePct: 88.0,
      isTeamLead: false,
    };
    setSelectedCollectors([...selectedCollectors, newEntry]);
  };

  const handleRemoveCollector = (operatorId: string) => {
    if (selectedCollectors.length <= 1) return;
    setSelectedCollectors(selectedCollectors.filter((c) => c.operatorId !== operatorId));
  };

  const handleToggleLead = (operatorId: string) => {
    setSelectedCollectors(
      selectedCollectors.map((c) => ({
        ...c,
        isTeamLead: c.operatorId === operatorId,
      }))
    );
  };

  const handleSave = () => {
    onSave(selectedCollectors);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Assigned Operator Roster"
      subtitle={`Portfolio: ${portfolio.name} (${portfolio.code})`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs"
          >
            Apply Roster Allocations
          </button>
        </div>
      }
    >
      <div className="space-y-5 text-xs">
        {/* Strategy Selector */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <span className="font-bold text-slate-900 block">Workload Distribution Strategy</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setStrategy('EQUAL')}
              className={`p-2.5 rounded border text-left transition-all ${
                strategy === 'EQUAL'
                  ? 'bg-white border-indigo-600 text-slate-900 shadow-xs ring-1 ring-indigo-600'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <div className="font-bold text-xs">Equal Round-Robin</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Even account volume</div>
            </button>
            <button
              onClick={() => setStrategy('BALANCE_WEIGHTED')}
              className={`p-2.5 rounded border text-left transition-all ${
                strategy === 'BALANCE_WEIGHTED'
                  ? 'bg-white border-indigo-600 text-slate-900 shadow-xs ring-1 ring-indigo-600'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <div className="font-bold text-xs">Balance-Weighted</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Dollar-equalized desk queue</div>
            </button>
            <button
              onClick={() => setStrategy('PROPENSITY')}
              className={`p-2.5 rounded border text-left transition-all ${
                strategy === 'PROPENSITY'
                  ? 'bg-white border-indigo-600 text-slate-900 shadow-xs ring-1 ring-indigo-600'
                  : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
              }`}
            >
              <div className="font-bold text-xs">AI Propensity Matched</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Senior agents get complex tier</div>
            </button>
          </div>
        </div>

        {/* Current Assigned Roster */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">
              Active Assigned Collectors ({selectedCollectors.length})
            </span>
            <span className="text-slate-500 text-[11px] font-mono">
              Total Queue: {portfolio.accountCount.active} accounts
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {selectedCollectors.map((collector) => (
              <div
                key={collector.operatorId}
                className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {collector.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{collector.name}</span>
                      {collector.isTeamLead && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {collector.operatorId} • {collector.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleLead(collector.operatorId)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                      collector.isTeamLead
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'text-slate-500 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    Set Lead
                  </button>
                  <button
                    onClick={() => handleRemoveCollector(collector.operatorId)}
                    disabled={selectedCollectors.length <= 1}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Remove from roster"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add from Available Pool */}
        {availableCollectors.length > 0 && (
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">
              Add Available Licensed Collectors ({availableCollectors.length})
            </span>
            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
              {availableCollectors.map((ac) => (
                <button
                  key={ac.operatorId}
                  onClick={() => handleAddCollector(ac)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{ac.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{ac.operatorId}</div>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-indigo-600" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
