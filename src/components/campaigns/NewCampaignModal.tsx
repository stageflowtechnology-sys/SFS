import React, { useState } from 'react';
import { CampaignItem, CampaignStatus, CampaignType, CampaignChannel } from '../../types/campaign';
import {
  X,
  Megaphone,
  Layers,
  Clock,
  ShieldCheck,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  FileText,
  DollarSign,
  FolderTree,
} from 'lucide-react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: Partial<CampaignItem>) => void;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<CampaignType>('VOICE_AI');
  const [initialStatus, setInitialStatus] = useState<CampaignStatus>('DRAFT');
  const [targetAudience, setTargetAudience] = useState('Prime Revolving Credit Card (31–90 DPD)');
  const [description, setDescription] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<CampaignChannel[]>([
    'VOICE',
    'SMS',
    'EMAIL',
  ]);
  const [settlementDiscountCap, setSettlementDiscountCap] = useState(20);

  if (!isOpen) return null;

  const toggleChannel = (ch: CampaignChannel) => {
    if (selectedChannels.includes(ch)) {
      if (selectedChannels.length > 1) {
        setSelectedChannels(selectedChannels.filter((c) => c !== ch));
      }
    } else {
      setSelectedChannels([...selectedChannels, ch]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      type,
      typeLabel:
        type === 'VOICE_AI'
          ? 'Autonomous Voice AI & Dynamic Settlement'
          : type === 'SMS_CADENCE'
          ? 'Interactive SMS Cadence & Fast Pay'
          : type === 'PRE_LEGAL_NOTICE'
          ? 'Commercial Pre-Litigation Notice Series'
          : 'Omnichannel Automated Cadence',
      status: initialStatus,
      description:
        description.trim() ||
        `Configured ${type.toLowerCase()} recovery cadence with ${selectedChannels.length} active channels and automated stage progression.`,
      targetAudience,
      channels: selectedChannels,
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Outreach Campaign</h2>
              <p className="text-xs text-slate-500">
                Configure sequence channels, automated stages, and regulatory compliance cadence.
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
          {/* Campaign Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Campaign Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Q2 High-Propensity Voice & SMS Settlement"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Type & Initial State Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Campaign Strategy Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="VOICE_AI">Voice AI & Dynamic Settlement</option>
                <option value="SMS_CADENCE">Interactive SMS Fast-Track</option>
                <option value="OMNICHANNEL">Omnichannel Comprehensive</option>
                <option value="PRE_LEGAL_NOTICE">Pre-Legal Certified Notice</option>
                <option value="SETTLEMENT_OFFER">Lump-Sum Settlement Special</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Initial State</label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="DRAFT">DRAFT (Review & configure stages)</option>
                <option value="ACTIVE">ACTIVE (Launch immediately)</option>
                <option value="PAUSED">PAUSED (Hold execution)</option>
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Target Audience / Cohort</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Revolving Credit 31–90 DPD, Propensity ≥ 60"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Channels Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700">Active Communication Channels</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { key: 'VOICE', label: 'Voice AI Dialing', icon: Phone },
                  { key: 'SMS', label: 'Interactive SMS', icon: MessageSquare },
                  { key: 'EMAIL', label: 'Email e-Notice', icon: Mail },
                  { key: 'AGENT', label: 'Collector Queue', icon: UserCheck },
                  { key: 'MAIL', label: 'Postal Mail', icon: FileText },
                ] as const
              ).map((ch) => {
                const Icon = ch.icon;
                const isSelected = selectedChannels.includes(ch.key as CampaignChannel);

                return (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => toggleChannel(ch.key as CampaignChannel)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-[11px]">{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Cadence Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe outreach strategy, frequency caps, or settlement parameters..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Compliance Callout */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-emerald-900 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>CFPB Reg-F Safeguards Enforced:</strong> 7-in-7 frequency limitations, TCPA debtor local calling windows, and mini-Miranda disclosures will be initialized automatically.
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
              Create Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
