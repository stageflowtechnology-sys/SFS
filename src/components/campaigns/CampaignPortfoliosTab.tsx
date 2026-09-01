import React, { useState } from 'react';
import { CampaignItem, CampaignPortfolioLink } from '../../types/campaign';
import {
  FolderTree,
  Search,
  Plus,
  TrendingUp,
  DollarSign,
  Building2,
  Calendar,
  CheckCircle2,
  Layers,
  ChevronRight,
  Trash2,
} from 'lucide-react';

interface CampaignPortfoliosTabProps {
  campaign: CampaignItem;
  onUpdateCampaign: (updated: CampaignItem) => void;
  showToast: (msg: string) => void;
}

export const CampaignPortfoliosTab: React.FC<CampaignPortfoliosTabProps> = ({
  campaign,
  onUpdateCampaign,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);

  const filteredPortfolios = campaign.portfolios.filter(
    (p) =>
      p.portfolioName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.portfolioCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDetachPortfolio = (portfolioId: string) => {
    const target = campaign.portfolios.find((p) => p.portfolioId === portfolioId);
    if (!target) return;

    const updatedPortfolios = campaign.portfolios.filter((p) => p.portfolioId !== portfolioId);
    const updatedCampaign: CampaignItem = {
      ...campaign,
      enrolledPortfoliosCount: updatedPortfolios.length,
      portfolios: updatedPortfolios,
      totalAccounts: Math.max(0, campaign.totalAccounts - target.enrolledAccounts),
      totalEnrolledBalance: Math.max(0, campaign.totalEnrolledBalance - target.enrolledBalance),
      totalCollectedBalance: Math.max(0, campaign.totalCollectedBalance - target.recoveredBalance),
      updatedAt: 'Just now',
    };

    onUpdateCampaign(updatedCampaign);
    showToast(`Detached portfolio "${target.portfolioName}" from campaign.`);
  };

  const handleAttachDemoPortfolio = () => {
    const newPortLink: CampaignPortfolioLink = {
      portfolioId: `PF-NEW-${Date.now()}`,
      portfolioName: 'Fifth Third Consumer Auto Delinquencies',
      portfolioCode: 'FITB-AUTO-2026',
      clientName: 'Fifth Third Bank',
      clientTier: 'Super-Regional Commercial',
      enrolledAccounts: 320,
      enrolledBalance: 980000,
      recoveredBalance: 125000,
      liquidationRatePct: 12.8,
      assetClass: 'Auto Loan Installment',
      attachedDate: '2026-03-01',
      dpdSummary: 'Weighted Avg: 52 DPD (31–60 Range)',
    };

    const updatedCampaign: CampaignItem = {
      ...campaign,
      enrolledPortfoliosCount: campaign.portfolios.length + 1,
      portfolios: [newPortLink, ...campaign.portfolios],
      totalAccounts: campaign.totalAccounts + newPortLink.enrolledAccounts,
      totalEnrolledBalance: campaign.totalEnrolledBalance + newPortLink.enrolledBalance,
      totalCollectedBalance: campaign.totalCollectedBalance + newPortLink.recoveredBalance,
      updatedAt: 'Just now',
    };

    onUpdateCampaign(updatedCampaign);
    setIsAttachModalOpen(false);
    showToast(`Attached "${newPortLink.portfolioName}" to campaign!`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-200 shrink-0">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Enrolled Portfolio Tranches ({campaign.portfolios.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Placements currently mapped to this automated campaign sequence and cadence guardrails.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAttachModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>Attach Portfolio</span>
          </button>
        </div>

        {/* Aggregate Rollup */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Enrolled AUM
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              ${campaign.totalEnrolledBalance.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Accounts
            </span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
              {campaign.totalAccounts.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Recovered Cash
            </span>
            <span className="text-sm font-bold text-emerald-600 mt-0.5 block">
              ${campaign.totalCollectedBalance.toLocaleString()}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Combined Liquidation
            </span>
            <span className="text-sm font-bold text-indigo-700 mt-0.5 block">
              {campaign.liquidationRatePct.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enrolled portfolios by name, code, or creditor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Portfolios Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Portfolio Name & Code</th>
                <th className="py-3 px-4">Creditor Client</th>
                <th className="py-3 px-4 text-right">Accounts</th>
                <th className="py-3 px-4 text-right">Enrolled Balance</th>
                <th className="py-3 px-4 text-right">Collected</th>
                <th className="py-3 px-4 text-center">Liquidation Yield</th>
                <th className="py-3 px-4">Aging / DPD Profile</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPortfolios.map((port) => (
                <tr key={port.portfolioId} className="hover:bg-slate-50/80 transition-colors">
                  {/* Name & Code */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-900">{port.portfolioName}</span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                        <span>{port.portfolioCode}</span>
                        <span>•</span>
                        <span className="text-slate-600">{port.assetClass}</span>
                      </div>
                    </div>
                  </td>

                  {/* Client */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{port.clientName}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{port.clientTier}</span>
                    </div>
                  </td>

                  {/* Accounts */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    {port.enrolledAccounts.toLocaleString()}
                  </td>

                  {/* Enrolled Balance */}
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                    ${port.enrolledBalance.toLocaleString()}
                  </td>

                  {/* Recovered */}
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-600">
                    ${port.recoveredBalance.toLocaleString()}
                  </td>

                  {/* Yield */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[11px] font-bold text-slate-800">
                        {port.liquidationRatePct.toFixed(1)}%
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-indigo-600"
                          style={{ width: `${Math.min(100, port.liquidationRatePct * 3)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* DPD Profile */}
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {port.dpdSummary}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleDetachPortfolio(port.portfolioId)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Detach portfolio from campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attach Modal */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-indigo-600" />
                Attach Portfolio Placement
              </h3>
              <button
                onClick={() => setIsAttachModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Select an available unassigned portfolio tranche to enroll into <strong>{campaign.name}</strong>. Enrolled accounts will immediately receive Stage 1 statutory notices.
            </p>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Fifth Third Consumer Auto Delinquencies</span>
                <span className="text-indigo-600">$980,000 AUM</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                320 Accounts • 31–60 DPD • Fifth Third Bank
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAttachModalOpen(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAttachDemoPortfolio}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                Confirm & Enroll Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
