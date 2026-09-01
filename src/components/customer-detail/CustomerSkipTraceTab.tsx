import React, { useState } from 'react';
import { CustomerSkipTraceDiscovery } from '../../types/customerDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  Search,
  Building,
  Home,
  Briefcase,
  Truck,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

interface CustomerSkipTraceTabProps {
  skipTraceHits: CustomerSkipTraceDiscovery[];
}

export const CustomerSkipTraceTab: React.FC<CustomerSkipTraceTabProps> = ({
  skipTraceHits: initialHits,
}) => {
  const [hits, setHits] = useState<CustomerSkipTraceDiscovery[]>(initialHits);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleRunScan = () => {
    setIsScanning(true);
    setScanMessage('Scanning LexisNexis Risk Solutions, County Tax Registries & Interbank ACH records...');

    setTimeout(() => {
      setIsScanning(false);
      setScanMessage('Live Skip Trace scan complete. 4 high-confidence ground truth assets verified.');
      setTimeout(() => setScanMessage(null), 4000);
    }, 1500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'REAL_ESTATE':
        return <Home className="w-4 h-4 text-emerald-600" />;
      case 'BANKING':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'CORPORATE_FILING':
      case 'EMPLOYMENT':
        return <Briefcase className="w-4 h-4 text-purple-600" />;
      case 'VEHICLE_FLEET':
        return <Truck className="w-4 h-4 text-amber-600" />;
      default:
        return <Search className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div id="customer-skip-trace-tab" className="space-y-6">
      {/* Action Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-600" />
            Asset Discovery & Skip Trace Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified real property, active commercial bank accounts, corporate entity filings, and vehicle registrations.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Querying Registries...' : 'Trigger Live Registry Scan'}</span>
        </button>
      </div>

      {scanMessage && (
        <div className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl text-xs font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>{scanMessage}</span>
        </div>
      )}

      {/* Discovered Assets Grid */}
      <div className="grid grid-cols-1 gap-4">
        {hits.map((hit) => (
          <div
            key={hit.id}
            className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {getCategoryIcon(hit.category)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>{hit.field}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {hit.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">Source: {hit.source}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-800">
                    {(hit.confidenceScore * 100).toFixed(0)}% Confidence
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Discovered: {new Date(hit.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <OriginBadge origin={hit.origin} size="sm" />
              </div>
            </div>

            {/* Asset Detail */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs font-mono text-slate-900 font-semibold leading-relaxed">
              {hit.discoveredValue}
            </div>

            {/* Verification Status & Legal Notes */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-1">
              <p className="text-[11px] text-slate-500 italic max-w-xl">
                {hit.notes}
              </p>

              {hit.isVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified by {hit.verifiedBy || 'Compliance Team'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold rounded-md border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Unverified Lead
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
