import React, { useState } from 'react';
import { CampaignItem, CampaignStage } from '../../types/campaign';
import { StageEditModal } from './StageEditModal';
import {
  Layers,
  Clock,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  UserCheck,
  FileText,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  LogIn,
  LogOut,
  Sparkles,
  Zap,
  Info,
  Check,
  Flag,
  RotateCcw,
  Sliders,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';

interface CampaignStageBuilderProps {
  campaign: CampaignItem;
  onUpdateCampaign?: (updated: CampaignItem) => void;
  showToast?: (msg: string) => void;
}

export const CampaignStageBuilder: React.FC<CampaignStageBuilderProps> = ({
  campaign,
  onUpdateCampaign,
  showToast,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>(
    campaign.stages[0]?.id || ''
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<CampaignStage | null>(null);
  const [isNewStage, setIsNewStage] = useState(false);

  // Ensure stages are sorted by their sequence order
  const sortedStages = [...campaign.stages].sort((a, b) => a.order - b.order);

  // Selected stage object
  const selectedStage =
    sortedStages.find((s) => s.id === selectedStageId) || sortedStages[0] || null;

  // Entry stage and exit stages
  const entryStage = sortedStages.find((s) => s.isEntryStage) || sortedStages[0];
  const exitStages = sortedStages.filter((s) => s.isExitStage);

  // Total dwell days
  const totalDwellDays = sortedStages.reduce((acc, s) => acc + s.dwellTimeDays, 0);

  // Helper to persist updated stages back to campaign
  const updateStagesList = (newStages: CampaignStage[], message: string) => {
    // Re-index orders strictly 1..N
    const reindexedStages = newStages.map((stg, idx) => ({
      ...stg,
      order: idx + 1,
    }));

    const updatedCampaign: CampaignItem = {
      ...campaign,
      stages: reindexedStages,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    if (onUpdateCampaign) {
      onUpdateCampaign(updatedCampaign);
    }
    if (showToast) {
      showToast(message);
    }
  };

  // Reorder: Move stage up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const newStages = [...sortedStages];
    const temp = newStages[index - 1];
    newStages[index - 1] = newStages[index];
    newStages[index] = temp;
    updateStagesList(newStages, `Moved "${newStages[index - 1].name}" to Order #${index}`);
  };

  // Reorder: Move stage down
  const handleMoveDown = (index: number) => {
    if (index >= sortedStages.length - 1) return;
    const newStages = [...sortedStages];
    const temp = newStages[index + 1];
    newStages[index + 1] = newStages[index];
    newStages[index] = temp;
    updateStagesList(newStages, `Moved "${newStages[index + 1].name}" to Order #${index + 2}`);
  };

  // Mark a stage as the Entry Stage (Single-entry constraint)
  const handleMarkEntry = (stageId: string) => {
    const newStages = sortedStages.map((stg) => ({
      ...stg,
      isEntryStage: stg.id === stageId,
    }));
    const targetStage = newStages.find((s) => s.id === stageId);
    updateStagesList(newStages, `Set "${targetStage?.name}" as the Campaign Entry Stage`);
  };

  // Toggle Mark as Exit Stage
  const handleToggleExit = (stageId: string) => {
    const newStages = sortedStages.map((stg) => {
      if (stg.id === stageId) {
        return {
          ...stg,
          isExitStage: !stg.isExitStage,
        };
      }
      return stg;
    });
    const target = newStages.find((s) => s.id === stageId);
    updateStagesList(
      newStages,
      target?.isExitStage
        ? `Marked "${target?.name}" as an Exit Stage`
        : `Removed Exit Stage flag from "${target?.name}"`
    );
  };

  // Status toggle
  const handleStatusChange = (stageId: string, newStatus: CampaignStage['status']) => {
    const newStages = sortedStages.map((stg) => {
      if (stg.id === stageId) {
        return {
          ...stg,
          status: newStatus,
        };
      }
      return stg;
    });
    updateStagesList(newStages, `Updated stage status to ${newStatus}`);
  };

  // Open Add Stage Modal
  const handleOpenAddModal = () => {
    setModalStage(null);
    setIsNewStage(true);
    setIsModalOpen(true);
  };

  // Open Edit Stage Modal
  const handleOpenEditModal = (stage: CampaignStage) => {
    setModalStage(stage);
    setIsNewStage(false);
    setIsModalOpen(true);
  };

  // Save Modal (Add or Edit)
  const handleSaveStage = (savedStage: CampaignStage) => {
    let newStages: CampaignStage[];
    if (isNewStage) {
      newStages = [...sortedStages, savedStage];
      // If marked as entry stage, ensure other stages are unmarked
      if (savedStage.isEntryStage) {
        newStages = newStages.map((s) => (s.id === savedStage.id ? s : { ...s, isEntryStage: false }));
      }
      setSelectedStageId(savedStage.id);
      updateStagesList(newStages, `Added new collection stage "${savedStage.name}"`);
    } else {
      newStages = sortedStages.map((s) => (s.id === savedStage.id ? savedStage : s));
      // If marked as entry stage, ensure other stages are unmarked
      if (savedStage.isEntryStage) {
        newStages = newStages.map((s) => (s.id === savedStage.id ? s : { ...s, isEntryStage: false }));
      }
      updateStagesList(newStages, `Updated configuration for "${savedStage.name}"`);
    }
    setIsModalOpen(false);
  };

  // Delete Stage
  const handleDeleteStage = (stageId: string) => {
    if (sortedStages.length <= 1) {
      if (showToast) showToast('Campaign must contain at least one configured stage.');
      return;
    }
    const stageToDelete = sortedStages.find((s) => s.id === stageId);
    const newStages = sortedStages.filter((s) => s.id !== stageId);
    
    // If we deleted the entry stage, assign entry to the first remaining stage
    if (stageToDelete?.isEntryStage && newStages.length > 0) {
      newStages[0].isEntryStage = true;
    }

    if (selectedStageId === stageId) {
      setSelectedStageId(newStages[0]?.id || '');
    }
    updateStagesList(newStages, `Deleted stage "${stageToDelete?.name}"`);
  };

  const renderChannelIcon = (ch: CampaignStage['channel']) => {
    switch (ch) {
      case 'VOICE_AI':
        return <Phone className="w-3.5 h-3.5 text-indigo-600" />;
      case 'SMS':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />;
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-blue-600" />;
      case 'POSTAL_MAIL':
        return <FileText className="w-3.5 h-3.5 text-rose-600" />;
      case 'COLLECTOR_QUEUE':
        return <UserCheck className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const renderStatusPill = (status: CampaignStage['status']) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ACTIVE
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            PENDING
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            INACTIVE
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            COMPLETED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Stage Lifecycle Visual Pipeline: Stage → Stage → Stage → Exit */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0 shadow-2xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Campaign Stage Builder
                </h2>
                <span className="font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {sortedStages.length} Ordered Stages
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure collection lifecycle stages, order sequence, entry triggers, and terminal exit states.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Stage</span>
            </button>
          </div>
        </div>

        {/* Visual Lifecycle Ribbon: Stage → Stage → Stage → Exit */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Visual Lifecycle Flow:
              </span>
              <span className="font-mono text-xs font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                Stage → Stage → Stage → Exit
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
              <span>{totalDwellDays} Days Total Cadence Dwell</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">1 Entry Stage</span>
              <span>•</span>
              <span className="text-purple-700 font-semibold">{exitStages.length || 1} Exit Stage(s)</span>
            </div>
          </div>

          {/* Lifecycle Horizontal Flow Diagram */}
          <div className="overflow-x-auto pb-2 pt-1">
            <div className="flex items-stretch gap-2.5 min-w-[820px]">
              {sortedStages.map((stg, idx) => {
                const isSelected = stg.id === selectedStageId;
                const isLast = idx === sortedStages.length - 1;
                const isFirst = idx === 0;
                const isEntry = !!stg.isEntryStage || (isFirst && !sortedStages.some(s => s.isEntryStage));
                const isExit = !!stg.isExitStage || (isLast && !sortedStages.some(s => s.isExitStage));

                return (
                  <React.Fragment key={stg.id}>
                    {/* Visual Stage Card Node */}
                    <div
                      onClick={() => setSelectedStageId(stg.id)}
                      className={`flex-1 p-3.5 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      {/* Top Bar: Order & Entry/Exit Badges */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span
                          className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white shadow-2xs'
                              : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                          }`}
                        >
                          #{stg.order}
                        </span>

                        <div className="flex items-center gap-1">
                          {isEntry && (
                            <span
                              title="Designated Entry Stage (Initial Ingestion)"
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5 shadow-2xs"
                            >
                              <LogIn className="w-2.5 h-2.5" />
                              Entry
                            </span>
                          )}

                          {isExit && (
                            <span
                              title="Designated Exit Stage (Terminal Outcome)"
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-0.5 shadow-2xs"
                            >
                              <LogOut className="w-2.5 h-2.5" />
                              Exit
                            </span>
                          )}

                          <div className="p-1 rounded bg-white border border-slate-200/80 shadow-2xs">
                            {renderChannelIcon(stg.channel)}
                          </div>
                        </div>
                      </div>

                      {/* Stage Name & Code */}
                      <div className="space-y-0.5 my-1">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600">
                          {stg.name.split(':')[1]?.trim() || stg.name}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono font-semibold">{stg.code}</p>
                      </div>

                      {/* Description Excerpt */}
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mt-1">
                        {stg.description}
                      </p>

                      {/* Footer Info: Dwell & Status */}
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-2.5 border-t border-slate-100 mt-2.5">
                        <span className="text-indigo-600 font-mono font-bold">{stg.dwellTimeDays}d dwell</span>
                        {renderStatusPill(stg.status)}
                      </div>
                    </div>

                    {/* Flow Arrow to next stage or exit */}
                    {!isLast && (
                      <div className="flex items-center justify-center text-slate-300 shrink-0 px-0.5">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Ordered Stages Management Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-4.5 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Configured Collection Stages
            </h3>
            <span className="text-xs text-slate-500 font-mono">({sortedStages.length} total)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-mono">
            <span className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 text-emerald-800 font-semibold">
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              Entry: {entryStage?.name.split(':')[0] || 'Stage 1'}
            </span>
            <span className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded border border-purple-200 text-purple-800 font-semibold">
              <LogOut className="w-3.5 h-3.5 text-purple-600" />
              Exit: {exitStages.map((s) => s.name.split(':')[0]).join(', ') || 'Stage ' + sortedStages.length}
            </span>
          </div>
        </div>

        {/* Stages Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                <th className="py-3 px-3 text-center w-20">Order</th>
                <th className="py-3 px-4">Stage Name</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-3 text-center">Lifecycle Role</th>
                <th className="py-3 px-3 text-center">Channel & Dwell</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {sortedStages.map((stg, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === sortedStages.length - 1;
                const isSelected = stg.id === selectedStageId;
                const isEntry = !!stg.isEntryStage || (isFirst && !sortedStages.some(s => s.isEntryStage));
                const isExit = !!stg.isExitStage || (isLast && !sortedStages.some(s => s.isExitStage));

                return (
                  <tr
                    key={stg.id}
                    onClick={() => setSelectedStageId(stg.id)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-indigo-50/40' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Order & Reorder Buttons */}
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold font-mono text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                          {stg.order}
                        </span>

                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveUp(idx)}
                            title="Move Stage Up in Order"
                            className={`p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer ${
                              isFirst ? 'opacity-20 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveDown(idx)}
                            title="Move Stage Down in Order"
                            className={`p-1 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer ${
                              isLast ? 'opacity-20 cursor-not-allowed' : ''
                            }`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Stage Name & Code */}
                    <td className="py-3.5 px-4 min-w-[220px]">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block group-hover:text-indigo-600">
                          {stg.name}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200 inline-block">
                          {stg.code}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                        {stg.description}
                      </p>
                    </td>

                    {/* Entry / Exit Role Badges & Quick Markers */}
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex flex-col items-center gap-1.5">
                        {/* Entry Stage Badge / Button */}
                        {isEntry ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                            <LogIn className="w-3 h-3 text-emerald-600" />
                            ENTRY STAGE
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMarkEntry(stg.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 transition-colors cursor-pointer"
                          >
                            Mark Entry
                          </button>
                        )}

                        {/* Exit Stage Badge / Button */}
                        {isExit ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-purple-50 text-purple-800 border border-purple-300 flex items-center gap-1 shadow-2xs">
                            <LogOut className="w-3 h-3 text-purple-600" />
                            EXIT STAGE
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleExit(stg.id)}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold text-slate-500 hover:text-purple-700 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer"
                          >
                            Mark Exit
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Channel & Dwell Time */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                          {renderChannelIcon(stg.channel)}
                          <span>{stg.channelLabel.split('&')[0]}</span>
                        </div>
                        <p className="text-[10px] font-mono text-indigo-700 font-bold">
                          {stg.dwellTimeDays} Days Dwell
                        </p>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={stg.status}
                        onChange={(e) =>
                          handleStatusChange(stg.id, e.target.value as CampaignStage['status'])
                        }
                        className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-2xs"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(stg)}
                          title="Edit Stage Properties"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-transparent hover:border-indigo-200 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteStage(stg.id)}
                          title="Delete Stage"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Deep Inspector for Selected Stage */}
      {selectedStage && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:p-6 shadow-xs space-y-5">
          {/* Header of Inspector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold font-mono flex items-center justify-center text-sm shadow-xs shrink-0 mt-0.5">
                #{selectedStage.order}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedStage.name}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                    {selectedStage.code}
                  </span>
                  {selectedStage.isEntryStage && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                      <LogIn className="w-3 h-3 text-emerald-600" /> ENTRY STAGE
                    </span>
                  )}
                  {selectedStage.isExitStage && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-50 text-purple-800 border border-purple-300 flex items-center gap-1 shadow-2xs">
                      <LogOut className="w-3 h-3 text-purple-600" /> EXIT STAGE
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">{selectedStage.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEditModal(selectedStage)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Edit Stage</span>
              </button>
            </div>
          </div>

          {/* 3-Column Inspector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Column 1: Order & Channel */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Cadence & Channel Execution
              </span>
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-mono">Order Position:</span>
                  <span className="font-bold text-slate-900 font-mono">Sequence #{selectedStage.order}</span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-mono">Primary Channel:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    {renderChannelIcon(selectedStage.channel)}
                    {selectedStage.channelLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <span className="text-slate-500 font-mono">Configured Dwell:</span>
                  <span className="font-bold font-mono text-indigo-700">{selectedStage.dwellTimeDays} Days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-mono">Stage Status:</span>
                  {renderStatusPill(selectedStage.status)}
                </div>
              </div>
            </div>

            {/* Column 2: Exit & Progression Criteria */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Advancement & Exit Criteria
              </span>
              <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed text-xs">
                {selectedStage.exitConditionSummary || 'Configured completion criteria satisfied before advancing.'}
              </p>
              {selectedStage.skipConditionSummary && (
                <p className="text-[11px] text-purple-700 font-mono">
                  <strong>Fast-Track:</strong> {selectedStage.skipConditionSummary}
                </p>
              )}
            </div>

            {/* Column 3: Statutory Compliance Guardrails */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Statutory Compliance
              </span>
              <p className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 leading-relaxed text-xs">
                {selectedStage.complianceNotes || 'Full compliance with fair debt collection rules and contact frequency caps.'}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Audited for regulatory compliance & contact frequency</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage Edit / Add Modal */}
      <StageEditModal
        isOpen={isModalOpen}
        stage={modalStage}
        isNew={isNewStage}
        existingStagesCount={sortedStages.length}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStage}
      />
    </div>
  );
};

