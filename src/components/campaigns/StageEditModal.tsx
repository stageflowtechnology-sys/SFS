import React, { useState, useEffect } from 'react';
import { CampaignStage } from '../../types/campaign';
import {
  X,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  FileText,
  Sparkles,
  LogIn,
  LogOut,
  AlertCircle,
} from 'lucide-react';

interface StageEditModalProps {
  isOpen: boolean;
  stage: CampaignStage | null;
  isNew: boolean;
  existingStagesCount: number;
  onClose: () => void;
  onSave: (stageData: CampaignStage) => void;
}

export const StageEditModal: React.FC<StageEditModalProps> = ({
  isOpen,
  stage,
  isNew,
  existingStagesCount,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<CampaignStage['channel']>('VOICE_AI');
  const [dwellTimeDays, setDwellTimeDays] = useState(5);
  const [status, setStatus] = useState<CampaignStage['status']>('ACTIVE');
  const [isEntryStage, setIsEntryStage] = useState(false);
  const [isExitStage, setIsExitStage] = useState(false);
  const [exitConditionSummary, setExitConditionSummary] = useState('');
  const [complianceNotes, setComplianceNotes] = useState('');

  useEffect(() => {
    if (stage && !isNew) {
      setName(stage.name);
      setCode(stage.code);
      setDescription(stage.description);
      setChannel(stage.channel);
      setDwellTimeDays(stage.dwellTimeDays);
      setStatus(stage.status);
      setIsEntryStage(!!stage.isEntryStage);
      setIsExitStage(!!stage.isExitStage);
      setExitConditionSummary(stage.exitConditionSummary || '');
      setComplianceNotes(stage.complianceNotes || '');
    } else if (isNew) {
      const nextOrder = existingStagesCount + 1;
      setName(`Stage ${nextOrder}: New Engagement Cadence`);
      setCode(`STG-0${nextOrder}-OUTREACH`);
      setDescription('Configured automated outreach stage for debtor portfolio engagement.');
      setChannel('VOICE_AI');
      setDwellTimeDays(5);
      setStatus('ACTIVE');
      setIsEntryStage(existingStagesCount === 0);
      setIsExitStage(false);
      setExitConditionSummary('Debtor establishes contact or dwell period elapses.');
      setComplianceNotes('CFPB Reg-F contact frequency caps strictly enforced.');
    }
  }, [stage, isNew, existingStagesCount, isOpen]);

  if (!isOpen) return null;

  const getChannelLabel = (ch: CampaignStage['channel']) => {
    switch (ch) {
      case 'VOICE_AI':
        return 'Autonomous Voice AI';
      case 'SMS':
        return 'Interactive SMS Portal';
      case 'EMAIL':
        return 'Email & SMS e-Notice';
      case 'COLLECTOR_QUEUE':
        return 'Senior Collector Queue';
      case 'POSTAL_MAIL':
        return 'Certified Postal Mail';
      default:
        return 'Omnichannel Touch';
    }
  };

  const getColorTheme = (ch: CampaignStage['channel']) => {
    switch (ch) {
      case 'VOICE_AI':
        return 'indigo';
      case 'SMS':
        return 'emerald';
      case 'EMAIL':
        return 'blue';
      case 'POSTAL_MAIL':
        return 'rose';
      case 'COLLECTOR_QUEUE':
        return 'amber';
      default:
        return 'purple';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const baseStage: CampaignStage = stage && !isNew
      ? { ...stage }
      : {
          id: `stg-${Date.now()}`,
          order: existingStagesCount + 1,
          activeAccountsCount: 0,
          completedAccountsCount: 0,
          progressedRatePct: 0,
          type: channel === 'VOICE_AI' ? 'VOICE_AI' : channel === 'SMS' ? 'SETTLEMENT_PROPOSAL' : 'NOTIFICATION',
          colorTheme: getColorTheme(channel),
          name: '',
          code: '',
          description: '',
          channel: 'VOICE_AI',
          channelLabel: '',
          dwellTimeDays: 5,
          exitConditionSummary: '',
          complianceNotes: '',
          status: 'ACTIVE',
        };

    const updatedStage: CampaignStage = {
      ...baseStage,
      name: name.trim(),
      code: code.trim().toUpperCase() || `STG-0${baseStage.order}`,
      description: description.trim(),
      channel,
      channelLabel: getChannelLabel(channel),
      colorTheme: getColorTheme(channel),
      dwellTimeDays: Number(dwellTimeDays) || 1,
      status,
      isEntryStage,
      isExitStage,
      exitConditionSummary: exitConditionSummary.trim() || 'Stage completion criteria satisfied.',
      complianceNotes: complianceNotes.trim() || 'Compliant with CFPB Regulation F and TCPA rules.',
    };

    onSave(updatedStage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isNew ? 'Configure New Collection Stage' : `Edit Stage: ${stage?.name || ''}`}
              </h2>
              <p className="text-xs text-slate-500">
                Define stage metadata, lifecycle role (Entry/Exit), channel, and cadence dwell duration.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Stage Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-semibold text-slate-700">Stage Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Stage 2: Autonomous Voice AI Outreach"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Stage Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. STG-02-VOICE"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Stage Description *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the operational purpose, outreach mechanisms, or debtor interaction flow..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Lifecycle Role (Entry / Exit Stage Badges) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Lifecycle Stage Classification
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Entry Stage Checkbox */}
              <label
                className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                  isEntryStage
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isEntryStage}
                  onChange={(e) => setIsEntryStage(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="space-y-0.5">
                  <span className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                    <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                    Entry Stage
                  </span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Designate this stage as the onboarding entry point for new debtor claims enrolled in this campaign.
                  </p>
                </div>
              </label>

              {/* Exit Stage Checkbox */}
              <label
                className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-all ${
                  isExitStage
                    ? 'border-purple-500 bg-purple-50/70 text-purple-900 ring-1 ring-purple-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isExitStage}
                  onChange={(e) => setIsExitStage(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div className="space-y-0.5">
                  <span className="font-bold flex items-center gap-1.5 text-xs text-purple-800">
                    <LogOut className="w-3.5 h-3.5 text-purple-600" />
                    Exit Stage
                  </span>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Designate this stage as a terminal/exit point (e.g. final legal placement, paid in full, or write-off).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Channel, Dwell Days & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Outreach Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="VOICE_AI">Voice AI Dialing</option>
                <option value="SMS">Interactive SMS</option>
                <option value="EMAIL">Email e-Notice</option>
                <option value="COLLECTOR_QUEUE">Collector Queue</option>
                <option value="POSTAL_MAIL">Postal Mail Demand</option>
                <option value="OMNICHANNEL">Omnichannel</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Dwell Cadence (Days)</label>
              <input
                type="number"
                min={1}
                max={90}
                required
                value={dwellTimeDays}
                onChange={(e) => setDwellTimeDays(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Stage Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="PENDING">PENDING</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {/* Exit Condition & Compliance Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Exit / Progression Summary</label>
              <input
                type="text"
                value={exitConditionSummary}
                onChange={(e) => setExitConditionSummary(e.target.value)}
                placeholder="e.g. 3-day validation window expires without dispute"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Compliance & Safeguards</label>
              <input
                type="text"
                value={complianceNotes}
                onChange={(e) => setComplianceNotes(e.target.value)}
                placeholder="e.g. FDCPA § 809 validation notice enforced"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              {isNew ? 'Add Stage' : 'Save Stage Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
