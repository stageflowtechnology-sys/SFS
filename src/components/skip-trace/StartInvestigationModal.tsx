import React from 'react';
import { SkipTraceAccount } from '../../types/skipTrace';
import {
  Search,
  Play,
  CheckCircle2,
  AlertCircle,
  Database,
  Building,
  MapPin,
  PhoneCall,
  Lock,
  Layers,
  X,
  Sparkles,
} from 'lucide-react';

interface StartInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: SkipTraceAccount;
  onCompleteInvestigation: () => void;
}

export const StartInvestigationModal: React.FC<StartInvestigationModalProps> = ({
  isOpen,
  onClose,
  account,
  onCompleteInvestigation,
}) => {
  const [step, setStep] = React.useState<'CONFIG' | 'RUNNING' | 'FINISHED'>('CONFIG');
  const [progress, setProgress] = React.useState(0);
  const [activeLog, setActiveLog] = React.useState<string>('');
  const [logs, setLogs] = React.useState<string[]>([]);

  // Toggles for waterfall sources
  const [sources, setSources] = React.useState({
    creditHeader: true,
    uspsNcoa: true,
    publicDeeds: true,
    stateBusiness: true,
    telcoHlr: true,
  });

  React.useEffect(() => {
    if (!isOpen) {
      setStep('CONFIG');
      setProgress(0);
      setLogs([]);
      setActiveLog('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartWaterfall = () => {
    setStep('RUNNING');
    setProgress(10);
    setLogs(['Initiating FDCPA §804 compliant public records query...']);
    setActiveLog('Connecting to Equifax & TransUnion Credit Header Feeds...');

    setTimeout(() => {
      setProgress(30);
      setLogs((prev) => [...prev, '✓ Credit Header matched SSN last-4 and DOB record']);
      setActiveLog('Querying USPS NCOA 48-Month Change-of-Address Database...');
    }, 900);

    setTimeout(() => {
      setProgress(55);
      setLogs((prev) => [...prev, '✓ USPS NCOA confirmed address residency concordance']);
      setActiveLog('Scrubbing County Tax Assessor & Deed Recorder Indexes...');
    }, 1800);

    setTimeout(() => {
      setProgress(75);
      setLogs((prev) => [...prev, '✓ Assessor deed recorded with single-family parcel equity']);
      setActiveLog('Executing Carrier HLR Telco Ping & Number Portability Check...');
    }, 2700);

    setTimeout(() => {
      setProgress(95);
      setLogs((prev) => [...prev, '✓ HLR Carrier ping active on primary wireless mobile line']);
      setActiveLog('Synthesizing 7-pillar investigation confidence model...');
    }, 3500);

    setTimeout(() => {
      setProgress(100);
      setLogs((prev) => [...prev, '✓ Multi-Source Waterfall Run Completed Successfully']);
      setActiveLog('Investigation Completed');
      setStep('FINISHED');
    }, 4200);
  };

  const handleFinish = () => {
    onCompleteInvestigation();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Multi-Source Skip Trace Investigation
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {account.customerName} • {account.accountNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={step === 'RUNNING'}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {step === 'CONFIG' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  This investigation queries legally accessible statutory sources and first-party master files under <strong>FDCPA §804</strong> and <strong>FCRA permissible purpose</strong>. No private accounts are queried and real-time tracking is strictly prohibited.
                </p>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono block mb-2">
                  Select Public & Bureau Data Tiers
                </span>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Database className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div className="font-bold text-slate-900">Credit Header & Identity Scrub</div>
                        <div className="text-[11px] text-slate-500">Equifax & TransUnion demographic headers</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sources.creditHeader}
                      onChange={(e) => setSources({ ...sources, creditHeader: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="font-bold text-slate-900">USPS NCOA 48-Month Move Registry</div>
                        <div className="text-[11px] text-slate-500">National change-of-address and CASS coding</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sources.uspsNcoa}
                      onChange={(e) => setSources({ ...sources, uspsNcoa: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-amber-600" />
                      <div>
                        <div className="font-bold text-slate-900">County Deeds & Assessor Records</div>
                        <div className="text-[11px] text-slate-500">Real estate title, deed registry & tax assessment</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sources.publicDeeds}
                      onChange={(e) => setSources({ ...sources, publicDeeds: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <PhoneCall className="w-4 h-4 text-sky-600" />
                      <div>
                        <div className="font-bold text-slate-900">Carrier HLR Ping & Portability Check</div>
                        <div className="text-[11px] text-slate-500">Active line subscriber validation and TCPA status</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={sources.telcoHlr}
                      onChange={(e) => setSources({ ...sources, telcoHlr: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 'RUNNING' && (
            <div className="space-y-4 py-3">
              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-slate-700 mb-1.5">
                  <span>Executing Data Waterfall</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-4 rounded-xl space-y-1.5 h-44 overflow-y-auto border border-slate-800">
                <div className="text-slate-400 text-[10px] pb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>LIVE EXECUTION STREAM</span>
                  <span className="animate-pulse text-indigo-400">QUERYING BROKERS...</span>
                </div>
                {logs.map((log, i) => (
                  <div key={i} className="text-[11px] leading-relaxed">
                    {log}
                  </div>
                ))}
                {activeLog && (
                  <div className="text-[11px] text-amber-300 animate-pulse">
                    &gt; {activeLog}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 'FINISHED' && (
            <div className="space-y-4 py-2 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Investigation Waterfall Complete
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Refreshed 6 evidence artifacts and recalculated 7-pillar contactability metrics for {account.customerName}.
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-mono text-left space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Identity Band: {account.summary.identityConfidence.band} ({account.summary.identityConfidence.score}%)</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  Active Phone Lines: {account.summary.phone.totalDiscovered} Discovered • Top Carrier: {account.summary.phone.topCarrier}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-mono">
            {step === 'RUNNING' ? 'Running async queries...' : 'StageFlow Skip Engine v4.2'}
          </span>

          <div className="flex items-center gap-2">
            {step === 'CONFIG' && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartWaterfall}
                  id="btn-run-waterfall-confirm"
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute Investigation</span>
                </button>
              </>
            )}

            {step === 'FINISHED' && (
              <button
                onClick={handleFinish}
                id="btn-apply-investigation-results"
                className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply Results to Overview</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
