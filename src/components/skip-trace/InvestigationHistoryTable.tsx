import React from 'react';
import { InvestigationRun } from '../../types/skipTrace';
import { IdentityBandBadge } from './IdentityBandBadge';
import {
  History,
  Clock,
  User,
  Zap,
  CheckCircle,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface InvestigationHistoryTableProps {
  history: InvestigationRun[];
}

export const InvestigationHistoryTable: React.FC<InvestigationHistoryTableProps> = ({
  history,
}) => {
  const [expandedRunId, setExpandedRunId] = React.useState<string | null>(null);

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'MANUAL_COLLECTOR':
        return { label: 'Manual Specialist Run', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'BROKEN_PTP_TRIGGER':
        return { label: 'Broken PTP Auto-Trigger', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'AUTOMATED_WATERFALL':
        return { label: 'Automated 90-Day Batch', color: 'bg-slate-100 text-slate-800 border-slate-200' };
      case 'SCHEDULED_REFRESH':
        return { label: 'Scheduled Bureau Refresh', color: 'bg-sky-50 text-sky-800 border-sky-200' };
      default:
        return { label: 'System Waterfall', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Investigation Audit History
            </h3>
            <p className="text-[11px] text-slate-500">
              Immutable record of all skip trace executions, queries, and broker waterfall hits
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          {history.length} Historical Inquiries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
              <th className="py-2.5 px-3">Run ID & Date</th>
              <th className="py-2.5 px-3">Trigger / Investigator</th>
              <th className="py-2.5 px-3">Sources Queried</th>
              <th className="py-2.5 px-3">Evidence Found</th>
              <th className="py-2.5 px-3">Resulting Band</th>
              <th className="py-2.5 px-3 text-right">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((run) => {
              const trigger = getTriggerLabel(run.triggerType);
              const isExpanded = expandedRunId === run.id;

              return (
                <React.Fragment key={run.id}>
                  <tr
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-slate-50' : ''
                    }`}
                    onClick={() => setExpandedRunId(isExpanded ? null : run.id)}
                  >
                    {/* Run ID & Date */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-bold text-slate-900">
                        {run.runNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {run.relativeTime} • {run.timestamp.split(' ')[0]}
                      </div>
                    </td>

                    {/* Trigger & Investigator */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border mb-1 ${trigger.color}`}
                      >
                        {trigger.label}
                      </span>
                      <div className="text-slate-700 font-medium text-[11px] flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{run.investigatorName}</span>
                      </div>
                    </td>

                    {/* Sources Queried */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {run.sourcesQueried.slice(0, 2).map((src, i) => (
                          <span
                            key={i}
                            className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono truncate"
                          >
                            {src}
                          </span>
                        ))}
                        {run.sourcesQueried.length > 2 && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            +{run.sourcesQueried.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Evidence Found */}
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {run.evidenceDiscoveredCount} Artifacts
                      <div className="text-[10px] text-slate-400 font-normal">
                        in {run.executionDurationSeconds}s
                      </div>
                    </td>

                    {/* Resulting Band */}
                    <td className="py-3 px-3">
                      <IdentityBandBadge band={run.identityBand} size="sm" />
                    </td>

                    {/* Expand Details Icon */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRunId(isExpanded ? null : run.id);
                        }}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Run Detail Drawer */}
                  {isExpanded && (
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <td colSpan={6} className="p-4 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                            <span className="font-bold text-slate-900">
                              Run Execution Summary ({run.runNumber})
                            </span>
                            <span className="font-mono text-slate-500 text-[11px]">
                              Execution Timestamp: {run.timestamp}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <span className="font-semibold text-slate-700 text-[11px]">
                              Broker Sources Queried in Waterfall:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {run.sourcesQueried.map((src, i) => (
                                <span
                                  key={i}
                                  className="bg-indigo-50 text-indigo-800 border border-indigo-200 text-[10px] px-2 py-0.5 rounded font-mono"
                                >
                                  {src}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-slate-700 text-[11px]">
                              Operator / Log Notes:
                            </span>
                            <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-2 rounded text-[11px]">
                              {run.notes}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
