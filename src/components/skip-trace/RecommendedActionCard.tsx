import React from 'react';
import { RecommendedAction, SkipTraceAccount } from '../../types/skipTrace';
import {
  Sparkles,
  PhoneCall,
  Mail,
  Send,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface RecommendedActionCardProps {
  action: RecommendedAction;
  account: SkipTraceAccount;
  onExecuteAction: (action: RecommendedAction) => void;
}

export const RecommendedActionCard: React.FC<RecommendedActionCardProps> = ({
  action,
  account,
  onExecuteAction,
}) => {
  const [executed, setExecuted] = React.useState(false);

  const handleAction = () => {
    setExecuted(true);
    onExecuteAction(action);
  };

  const getActionIcon = () => {
    switch (action.actionType) {
      case 'DIAL_PRIMARY_MOBILE':
        return PhoneCall;
      case 'SEND_STATUTORY_NOTICE':
        return Mail;
      case 'VERIFY_EMPLOYER_HR':
        return Building2;
      case 'UPDATE_MASTER_ADDRESS':
        return MapPin;
      default:
        return Send;
    }
  };

  const ActionIcon = getActionIcon();

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-xl p-6 shadow-md border border-indigo-900/50 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold block">
                Intelligence Engine Recommendation
              </span>
              <h3 className="text-base font-bold text-white tracking-tight">
                {action.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
              {action.confidenceScore}% Model Confidence
            </span>
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Priority {action.priority}
            </span>
          </div>
        </div>

        {/* Core Summary & Rationale */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <p className="text-sm text-slate-200 font-medium leading-relaxed">
              {action.summary}
            </p>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3 text-xs text-slate-300 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
                Investigation Rationale & Ground Truth
              </span>
              <p className="leading-normal text-slate-300">
                {action.rationale}
              </p>
            </div>

            {/* Target Value & Compliance Citation */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs pt-1">
              {action.suggestedWindow && (
                <div className="flex items-center gap-1.5 text-indigo-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Window: {action.suggestedWindow}</span>
                </div>
              )}
              {action.targetChannelValue && (
                <div className="flex items-center gap-1.5 text-emerald-300 font-mono">
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target: {action.targetChannelValue}</span>
                </div>
              )}
              {action.targetAddress && (
                <div className="flex items-center gap-1.5 text-sky-300 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>Address: {action.targetAddress}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Statutory Rule: {action.complianceRuleCitation}</span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="lg:col-span-4 flex flex-col items-end justify-center">
            {executed ? (
              <div className="w-full bg-emerald-950/80 border border-emerald-600/50 rounded-xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span>Action Executed</span>
                </div>
                <p className="text-[11px] text-emerald-400 font-mono">
                  Transferred to Dialing Queue & Servicing Ledger
                </p>
              </div>
            ) : (
              <button
                onClick={handleAction}
                id="btn-execute-recommended-action"
                className="w-full group bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm px-6 py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <ActionIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Execute Next Action</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <span className="text-[10px] text-slate-400 font-mono mt-2 text-center w-full">
              Requires Human Operator Confirmation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
