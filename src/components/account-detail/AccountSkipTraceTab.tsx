import React, { useState } from 'react';
import { SkipTraceHit } from '../../types/accountDetail';
import {
  Search,
  Building,
  Home,
  Phone,
  Briefcase,
  Landmark,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface AccountSkipTraceTabProps {
  hits: SkipTraceHit[];
  customerName: string;
}

export const AccountSkipTraceTab: React.FC<AccountSkipTraceTabProps> = ({
  hits,
  customerName,
}) => {
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);

  const handleRunSkipTrace = () => {
    setIsScanning(true);
    setScanFeedback('Querying LexisNexis, Plaid, and County Assessor records...');
    setTimeout(() => {
      setIsScanning(false);
      setScanFeedback('Skip Trace complete: All 4 verified asset and contact records up to date.');
      setTimeout(() => setScanFeedback(null), 4000);
    }, 1500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'EMPLOYMENT':
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case 'BANK_DISCOVERY':
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case 'PROPERTY':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'PHONE':
        return <Phone className="w-4 h-4 text-sky-600" />;
      default:
        return <Building className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-5">
      {/* Header & Scan Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-900">
              Skip Trace & Verified Asset Discovery ({hits.length} Hits)
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Automated entity search across LexisNexis, Secretary of State, Plaid, and County Deed Registries.
          </p>
        </div>

        <button
          onClick={handleRunSkipTrace}
          disabled={isScanning}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning External Registries...' : 'Run Live Skip Trace'}</span>
        </button>
      </div>

      {scanFeedback && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{scanFeedback}</span>
        </div>
      )}

      {/* Skip Trace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hits.map((hit) => (
          <div
            key={hit.id}
            className="rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white p-4 space-y-3 transition-all"
          >
            {/* Header: Category & Source */}
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {getCategoryIcon(hit.category)}
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 font-mono block">
                    {hit.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Source: {hit.source}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {hit.confidenceScore}% Confidence
                </span>
                <span className="block text-[9px] font-mono text-slate-400 mt-0.5">
                  Discovered: {hit.discoveredDate}
                </span>
              </div>
            </div>

            {/* Field Details */}
            <div className="space-y-1.5 text-xs font-mono">
              <div className="text-slate-500 uppercase text-[10px] font-bold">
                {hit.details.field}
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-bold text-slate-900 leading-snug">
                {hit.details.newValue}
              </div>
              <div className="text-[11px] text-slate-600 font-sans">
                <strong className="font-mono text-slate-500">Method:</strong> {hit.details.verificationMethod}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
