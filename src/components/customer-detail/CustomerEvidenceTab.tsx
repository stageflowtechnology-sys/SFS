import React, { useState } from 'react';
import { CustomerEvidenceItem } from '../../types/customerDetail';
import { OriginBadge } from '../ui/OriginBadge';
import {
  FileText,
  ShieldCheck,
  Download,
  Eye,
  Copy,
  Check,
  Lock,
  FileCode,
  Music,
  Scale,
} from 'lucide-react';

interface CustomerEvidenceTabProps {
  evidence: CustomerEvidenceItem[];
}

export const CustomerEvidenceTab: React.FC<CustomerEvidenceTabProps> = ({
  evidence,
}) => {
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<CustomerEvidenceItem | null>(null);

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'RECORDING_AUDIO':
        return <Music className="w-4 h-4 text-purple-600" />;
      case 'CONTRACT_AGREEMENT':
      case 'DEBT_ORIGINATION':
        return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'TAX_DEED':
        return <Scale className="w-4 h-4 text-emerald-600" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div id="customer-evidence-tab" className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Certified Legal Evidence & Chain of Custody Repository
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tamper-evident evidentiary documents, master loan agreements, recordings, and statutory notices backed by SHA-256 cryptographic hashes.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Certified Exhibits: <span className="text-indigo-600 font-bold">{evidence.length}</span>
        </div>
      </div>

      {/* Evidence Document Cards */}
      <div className="grid grid-cols-1 gap-4">
        {evidence.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {getCategoryIcon(item.category)}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{item.title}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {item.documentRef} • {item.fileSize} • Uploaded {item.uploadDate} by {item.uploadedBy}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {item.verifiedByLegal && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified by Legal Counsel
                  </span>
                )}
                <OriginBadge origin={item.origin} size="sm" />
              </div>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              {item.description}
            </p>

            {/* Cryptographic SHA-256 Hash Seal */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 overflow-hidden">
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">SHA-256 Digest:</span>
                <span className="text-slate-800 text-[11px] truncate max-w-xs sm:max-w-md md:max-w-lg">
                  {item.sha256Hash}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyHash(item.sha256Hash, item.id)}
                  className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors inline-flex items-center gap-1 text-[11px]"
                  title="Copy SHA-256 Hash"
                >
                  {copiedHashId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold font-sans">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-sans">Copy Hash</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setPreviewDoc(item)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded border border-slate-300 transition-colors inline-flex items-center gap-1 font-sans"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preview Exhibit</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">File Ref:</span>
                <span className="font-bold text-slate-800">{previewDoc.documentRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Category:</span>
                <span className="text-slate-800">{previewDoc.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Uploaded By:</span>
                <span className="text-slate-800">{previewDoc.uploadedBy} on {previewDoc.uploadDate}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-700 font-sans leading-relaxed">
                {previewDoc.description}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
