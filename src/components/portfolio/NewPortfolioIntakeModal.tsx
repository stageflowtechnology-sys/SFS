import React, { useState } from 'react';
import { PortfolioItem, AssetClass } from '../../types/portfolio';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import {
  FolderPlus,
  Building,
  DollarSign,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface NewPortfolioIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPortfolio: Partial<PortfolioItem>) => void;
}

export const NewPortfolioIntakeModal: React.FC<NewPortfolioIntakeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [portfolioName, setPortfolioName] = useState('Wells Fargo Consumer Credit 2026-Q2');
  const [clientName, setClientName] = useState('Wells Fargo & Company');
  const [assetClass, setAssetClass] = useState<AssetClass>('CREDIT_CARD');
  const [faceValue, setFaceValue] = useState('3500000');
  const [accountCount, setAccountCount] = useState('950');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSuccess({
        name: portfolioName,
        assetClass,
        balance: {
          originalFaceValue: Number(faceValue) || 3500000,
          currentActiveBalance: Number(faceValue) || 3500000,
          collectedAmount: 0,
          recoveryRatePct: 0,
          targetRecoveryPct: 35.0,
          avgAccountBalance: Math.round((Number(faceValue) || 3500000) / (Number(accountCount) || 950)),
          currency: 'USD',
        },
        accountCount: {
          total: Number(accountCount) || 950,
          active: Number(accountCount) || 950,
          resolved: 0,
          inPtp: 0,
          inLegal: 0,
          disputed: 0,
        },
      });
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ingest New Portfolio Tranche Placement"
      subtitle="FDCPA Reg-F Cryptographic Ingestion & Verification"
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs disabled:opacity-50"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Ingesting Tranche...' : 'Verify & Load Placement'}</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-xs font-bold text-slate-900 mb-1">
            Portfolio Tranche Name
          </label>
          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Client / Originator
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Asset Class
            </label>
            <select
              value={assetClass}
              onChange={(e) => setAssetClass(e.target.value as AssetClass)}
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="CREDIT_CARD">Prime Credit Card</option>
              <option value="AUTO_LOAN">Secured Auto Loan</option>
              <option value="PERSONAL_INSTALLMENT">Personal Term Installment</option>
              <option value="MEDICAL_HEALTHCARE">Healthcare AR</option>
              <option value="COMMERCIAL_SMB">Commercial & SMB</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Total Face Value ($ USD)
            </label>
            <input
              type="number"
              value={faceValue}
              onChange={(e) => setFaceValue(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 font-mono font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Account Placement Count
            </label>
            <input
              type="number"
              value={accountCount}
              onChange={(e) => setAccountCount(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-900 font-mono font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
              required
            />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2 text-emerald-900 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong>Compliance Check:</strong> Ingestion engine automatically validates debt validation notices (Mini-Miranda), statute of limitations check, and active bankruptcy registry before enrolling in queues.
          </span>
        </div>
      </form>
    </Modal>
  );
};
