import React from 'react';
import { EvidenceCategory, EvidenceItem } from '../../types/skipTrace';
import { IdentityBandBadge } from './IdentityBandBadge';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  PhoneCall,
  Mail,
  MapPin,
  Globe2,
  Landmark,
  Scale,
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Tag,
} from 'lucide-react';

interface EvidenceDiscoveredPanelProps {
  evidenceList: EvidenceItem[];
  selectedCategoryFilter?: string | null;
  onSelectCategoryFilter?: (cat: string | null) => void;
  onPromoteEvidence: (item: EvidenceItem) => void;
}

export const EvidenceDiscoveredPanel: React.FC<EvidenceDiscoveredPanelProps> = ({
  evidenceList,
  selectedCategoryFilter = null,
  onSelectCategoryFilter,
  onPromoteEvidence,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(selectedCategoryFilter || null);
  const [expandedItemId, setExpandedItemId] = React.useState<string | null>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedCategoryFilter !== undefined) {
      setCategoryFilter(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: EvidenceCategory) => {
    switch (category) {
      case 'PHONE':
        return PhoneCall;
      case 'EMAIL':
        return Mail;
      case 'PROFESSIONAL':
        return Building2;
      case 'SOCIAL':
        return Globe2;
      case 'GEOGRAPHIC':
        return MapPin;
      case 'ASSET':
        return Landmark;
      case 'LEGAL_ENTITY':
        return Scale;
      default:
        return Tag;
    }
  };

  const categories: { id: string | null; label: string; count: number }[] = [
    { id: null, label: 'All Evidence', count: evidenceList.length },
    { id: 'PHONE', label: 'Phone', count: evidenceList.filter((e) => e.category === 'PHONE').length },
    { id: 'EMAIL', label: 'Email', count: evidenceList.filter((e) => e.category === 'EMAIL').length },
    { id: 'PROFESSIONAL', label: 'Professional', count: evidenceList.filter((e) => e.category === 'PROFESSIONAL').length },
    { id: 'SOCIAL', label: 'Social & Registry', count: evidenceList.filter((e) => e.category === 'SOCIAL').length },
    { id: 'GEOGRAPHIC', label: 'Geographic', count: evidenceList.filter((e) => e.category === 'GEOGRAPHIC').length },
    { id: 'LEGAL_ENTITY', label: 'Entity & Discrepancies', count: evidenceList.filter((e) => e.category === 'LEGAL_ENTITY' || e.category === 'ASSET').length },
  ];

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesCategory =
      !categoryFilter ||
      item.category === categoryFilter ||
      (categoryFilter === 'LEGAL_ENTITY' && item.category === 'ASSET');

    const matchesSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            Evidence Discovered
          </h3>
          <p className="text-[11px] text-slate-500">
            Cross-referenced artifacts from statutory public registries & bureau headers
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter evidence by keyword..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-slate-100">
        {categories.map((cat) => {
          if (cat.id !== null && cat.count === 0) return null;
          const isActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.label}
              onClick={() => {
                setCategoryFilter(cat.id);
                if (onSelectCategoryFilter) onSelectCategoryFilter(cat.id);
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Evidence Items List */}
      {filteredEvidence.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No evidence matched your filter</p>
          <p className="text-[11px] text-slate-400 mt-1">Try clearing search terms or switching categories</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEvidence.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category);
            const isExpanded = expandedItemId === item.id;

            return (
              <div
                key={item.id}
                id={`evidence-item-${item.id}`}
                className="border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-all overflow-hidden"
              >
                {/* Main Evidence Summary Row */}
                <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Column: Icon, Title & Value */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                      <CategoryIcon className="w-4 h-4" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.title}</span>
                        <IdentityBandBadge band={item.identityBand} size="sm" />
                        {item.promotedToMaster && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                            <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                            Promoted to Master File
                          </span>
                        )}
                      </div>

                      {/* Discovered Value */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-bold text-slate-900">
                          {item.value}
                        </span>
                        <button
                          onClick={() => handleCopy(item.id, item.value)}
                          title="Copy value"
                          className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Source & Sub-value */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        {item.subValue && (
                          <span className="text-slate-600 font-medium">{item.subValue}</span>
                        )}
                        <span className="text-slate-300">•</span>
                        <span>Source: <strong className="text-slate-700">{item.source}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span className="font-mono text-[11px] text-slate-400">Discovered {item.discoveredDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Score, Master Promotion & Details Toggle */}
                  <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Confidence Score Pill */}
                    <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 min-w-[70px]">
                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">Confidence</span>
                      <span className="text-xs font-black font-mono text-slate-900">{item.confidenceScore}%</span>
                    </div>

                    {/* Promotion Action */}
                    {!item.promotedToMaster && item.verificationStatus !== 'DISPUTED_CONTRADICTED' && item.verificationStatus !== 'INVALID_DISCONNECTED' && (
                      <button
                        onClick={() => onPromoteEvidence(item)}
                        className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                        <span>Promote to Master</span>
                      </button>
                    )}

                    {/* Expand Details Button */}
                    <button
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Inspect evidence details"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="bg-slate-50 border-t border-slate-200 p-4 text-xs text-slate-700 space-y-3 animate-in fade-in duration-150">
                    {item.notes && (
                      <div>
                        <span className="font-bold text-slate-900 block mb-0.5">Investigator / System Audit Notes:</span>
                        <p className="text-slate-600 leading-relaxed bg-white p-2.5 rounded border border-slate-200/80">
                          {item.notes}
                        </p>
                      </div>
                    )}

                    {/* Metadata Grid */}
                    {item.metadata && Object.keys(item.metadata).length > 0 && (
                      <div>
                        <span className="font-bold text-slate-900 block mb-1.5">Parsed Metadata Attributes:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                          {Object.entries(item.metadata).map(([key, val]) => (
                            <div key={key} className="bg-white p-2 rounded border border-slate-200/80">
                              <span className="text-slate-400 uppercase text-[9px] block">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="font-semibold text-slate-800 truncate block">
                                {typeof val === 'boolean' ? (val ? 'TRUE (Verified)' : 'FALSE') : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Source Type & Compliance Classification */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
                      <span>Source Engine: <strong>{item.sourceType}</strong></span>
                      <span>Verification State: <strong>{item.verificationStatus.replace(/_/g, ' ')}</strong></span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
