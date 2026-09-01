import React from 'react';
import { PortfolioItem } from '../../types/portfolio';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';

interface PortfolioPerformanceTabProps {
  portfolio: PortfolioItem;
}

export const PortfolioPerformanceTab: React.FC<PortfolioPerformanceTabProps> = ({
  portfolio,
}) => {
  const { performanceHistory, balance, client, collectors } = portfolio;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Liquidation Yield & Vintage Recovery Curve
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cumulative cash collections against target SLA benchmarks established in {client.name} Master Services Agreement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={balance.recoveryRatePct >= balance.targetRecoveryPct ? 'success' : 'warning'}
            size="sm"
          >
            {balance.recoveryRatePct >= balance.targetRecoveryPct
              ? `Pacing +${(balance.recoveryRatePct - balance.targetRecoveryPct).toFixed(1)}% Above Target`
              : `Pacing ${(balance.targetRecoveryPct - balance.recoveryRatePct).toFixed(1)}% Behind Target`}
          </Badge>
        </div>
      </div>

      {/* Performance History Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Monthly Recovery Benchmark Ledger
          </h3>
          <span className="text-xs font-mono text-slate-500">
            Origination Vintage: {portfolio.originationVintage}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 font-mono text-[11px] uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-4">Period / Vintage</th>
                <th className="py-2.5 px-4">Target Recovery</th>
                <th className="py-2.5 px-4">Actual Collected</th>
                <th className="py-2.5 px-4">Target Cumulative %</th>
                <th className="py-2.5 px-4">Actual Cumulative %</th>
                <th className="py-2.5 px-4">Cases Settled</th>
                <th className="py-2.5 px-4">Broken PTPs</th>
                <th className="py-2.5 px-4 text-right">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {performanceHistory.map((item, idx) => {
                const variance = item.actualLiquidationPct - item.targetLiquidationPct;
                const isPositive = variance >= 0;
                return (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.period}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatCurrency(item.targetRecoveryAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {formatCurrency(item.actualRecoveryAmount)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {item.targetLiquidationPct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                      {item.actualLiquidationPct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-700 font-semibold">
                      {item.accountsSettled} accounts
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-700 font-semibold">
                      {item.brokenPtpCount}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {isPositive ? `+${variance.toFixed(2)}%` : `${variance.toFixed(2)}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two-Column Split: Payment Rail Breakdown & Top Collectors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Clearing Channel Mix */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              <span>Settlement Clearing Rail Mix</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Total: {formatCurrency(balance.collectedAmount)}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>ACH Direct Debit Clearing</span>
                <span className="font-mono text-slate-900">54% ({formatCurrency(balance.collectedAmount * 0.54)})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '54%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>FedWire / Same-Day Bank Transfer</span>
                <span className="font-mono text-slate-900">26% ({formatCurrency(balance.collectedAmount * 0.26)})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '26%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Debit Card / Instant Portal Checkout</span>
                <span className="font-mono text-slate-900">14% ({formatCurrency(balance.collectedAmount * 0.14)})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '14%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-semibold text-slate-700 mb-1">
                <span>Attorney Escrow / Certified Trust Check</span>
                <span className="font-mono text-slate-900">6% ({formatCurrency(balance.collectedAmount * 0.06)})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-slate-500 h-2 rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Top Collector Ranking inside Portfolio */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Top Operator Recovery Yield</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-500">Portfolio Leaderboard</span>
          </div>

          <div className="space-y-3">
            {collectors.map((c, i) => (
              <div
                key={c.id}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-200 font-mono font-bold text-[10px] text-slate-700 flex items-center justify-center">
                    #{i + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {c.operatorId} • {c.role}
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-emerald-700 text-sm">
                    {c.resolutionRatePct.toFixed(1)}% yield
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {c.ptpAdherenceRatePct.toFixed(1)}% PTP kept
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
