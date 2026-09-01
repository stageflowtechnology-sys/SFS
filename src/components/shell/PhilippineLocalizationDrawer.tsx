import React, { useState } from 'react';
import {
  X,
  Languages,
  ShieldCheck,
  Building2,
  BookOpen,
  MapPin,
  MessageSquare,
  FileSpreadsheet,
  AlertTriangle,
  Scale,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  PhoneCall,
  Users,
} from 'lucide-react';
import { usePhilippineLocalization } from '../../context/PhilippineLocalizationContext';
import {
  CommunicationLanguage,
  PHILIPPINE_COLLECTIONS_GLOSSARY,
  PHILIPPINE_COMMUNICATION_TEMPLATES,
  formatPHP,
} from '../../services/philippineCollections';

export const PhilippineLocalizationDrawer: React.FC = () => {
  const {
    communicationLanguage,
    setCommunicationLanguage,
    clientConfig,
    setClientConfig,
    isLocalizationDrawerOpen,
    setIsLocalizationDrawerOpen,
    regulatoryDisclaimer,
  } = usePhilippineLocalization();

  const [activeTab, setActiveTab] = useState<'SCRIPTS' | 'GLOSSARY' | 'LIFECYCLE' | 'COMPLIANCE'>('SCRIPTS');
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(PHILIPPINE_COMMUNICATION_TEMPLATES[0].key);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isLocalizationDrawerOpen) return null;

  const activeTemplate = PHILIPPINE_COMMUNICATION_TEMPLATES.find((t) => t.key === selectedTemplateKey) || PHILIPPINE_COMMUNICATION_TEMPLATES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sampleParameters: Record<string, string> = {
    'Customer Name': 'Juan Carlos M. Santos Jr.',
    'Collector Name': 'Armando Santiago',
    'Agency/Bank Name': 'PrimeCollect ECA / BDO Unibank',
    'Bank/Fintech': 'BDO Unibank',
    'Creditor': 'BDO Unibank',
    Amount: '48,500.00',
    DPD: '142',
    Date: 'Friday, Sept 5, 2026',
    Months: '6',
    'Phone Number': '(02) 8891-2400 / 0917-555-0184',
    Phone: '(02) 8891-2400',
    'Agency Name': 'PrimeCollect Recovery Services Inc.',
    'Barangay, City': 'Brgy. San Antonio, Pasig City',
    'Payment Channel, e.g. GCash, Maya, 7-Eleven, or BDO/BPI Over-the-Counter': 'BDO Bills Payment, GCash, or Maya',
  };

  const renderSampleText = (rawText: string) => {
    let replaced = rawText;
    Object.entries(sampleParameters).forEach(([key, val]) => {
      replaced = replaced.replace(new RegExp(`\\[${key}\\]`, 'g'), val);
    });
    return replaced;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in-0 duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Philippine Collections Localization</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                  PH-PROD
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Tailored for Philippine banking, fintech, lending & ECA/ACA recovery operations
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLocalizationDrawerOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Language Quick Selector Bar */}
        <div className="bg-indigo-50/80 border-b border-indigo-100 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-950">Active Customer Communication Language:</span>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-indigo-200 shadow-2xs">
            {(['ENGLISH', 'TAGLISH', 'FILIPINO'] as CommunicationLanguage[]).map((lang) => {
              const isSelected = communicationLanguage === lang;
              return (
                <button
                  key={lang}
                  onClick={() => setCommunicationLanguage(lang)}
                  className={`px-3 py-1 text-xs font-bold rounded transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'ENGLISH' && 'English'}
                  {lang === 'TAGLISH' && 'Taglish (Standard)'}
                  {lang === 'FILIPINO' && 'Filipino (Formal)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-1 shrink-0 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('SCRIPTS')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'SCRIPTS'
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Multi-Lingual Scripts</span>
          </button>
          <button
            onClick={() => setActiveTab('GLOSSARY')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'GLOSSARY'
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Terminology Glossary</span>
          </button>
          <button
            onClick={() => setActiveTab('LIFECYCLE')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'LIFECYCLE'
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>ECA / PH Operations</span>
          </button>
          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`py-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'COMPLIANCE'
                ? 'border-indigo-600 text-indigo-700 bg-white font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Regulatory Safeguards</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'SCRIPTS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Select Interaction Scenario:
                </span>
                <span className="text-xs text-indigo-600 font-semibold">
                  Preview in: {communicationLanguage}
                </span>
              </div>

              {/* Scenario Selector */}
              <div className="grid grid-cols-1 gap-1.5">
                {PHILIPPINE_COMMUNICATION_TEMPLATES.map((tmpl) => {
                  const isSelected = tmpl.key === selectedTemplateKey;
                  return (
                    <button
                      key={tmpl.key}
                      onClick={() => setSelectedTemplateKey(tmpl.key)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{tmpl.title}</span>
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                          {tmpl.complianceTag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {tmpl.scenario}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Live Script Viewer & Comparator */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Active Script Preview: {activeTemplate.title}
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        renderSampleText(
                          communicationLanguage === 'TAGLISH'
                            ? activeTemplate.taglish
                            : communicationLanguage === 'FILIPINO'
                            ? activeTemplate.filipino
                            : activeTemplate.english
                        ),
                        'active-script'
                      )
                    }
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    {copiedKey === 'active-script' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Script Display */}
                <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans shadow-2xs">
                  {renderSampleText(
                    communicationLanguage === 'TAGLISH'
                      ? activeTemplate.taglish
                      : communicationLanguage === 'FILIPINO'
                      ? activeTemplate.filipino
                      : activeTemplate.english
                  )}
                </div>

                {/* Cultural & Linguistic Markers Note */}
                <div className="rounded-lg bg-amber-50/70 border border-amber-200 p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Philippine Cultural Markers: </span>
                    Uses respectful honorifics (<em>"po/opo", "Ma'am/Sir"</em>), polite code-switching, empathetic listening, and non-confrontational phrasing to protect customer dignity while maintaining firm recovery resolve.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'GLOSSARY' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 leading-relaxed">
                Standardized Philippine banking and collections operational vocabulary mapped against generic legacy CRM terms:
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                {PHILIPPINE_COLLECTIONS_GLOSSARY.map((item, idx) => (
                  <div key={idx} className="p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.term}</span>
                      <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Replaces generic: <span className="line-through text-slate-400">{item.replacementOf}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'LIFECYCLE' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Philippine Collection Lifecycle (Endorsement to Resolution)
                </h3>

                <div className="space-y-2">
                  {[
                    { step: '1. Account Endorsement', desc: 'Excel batch ingestion from Universal Bank / Fintech to ECA with master debtor balance & DPD.' },
                    { step: '2. Account Validation & Scrubbing', desc: 'Cross-reference against do-not-call lists, bankruptcy registries, and active dispute tags.' },
                    { step: '3. Tele-Collector Allocation', desc: 'Account distribution to specialized recovery tiers based on DPD (1-30 DPD, 31-90 DPD, 91-180 DPD, 180+ Write-off).' },
                    { step: '4. Right Party Contact (RPC) Negotiation', desc: 'Multi-channel engagement (Phone, SMS, Viber, Email) offering restructured payment arrangements.' },
                    { step: '5. Promise to Pay (PTP) Lock & Monitoring', desc: 'Payment date, amount, and clearing rail tracking (GCash, Maya, Bayad Center, OTC Bank Transfer).' },
                    { step: '6. Field Visit & Barangay Ocular', desc: 'Dispatched for uncontactable or broken PTP debtors with respectful barangay protocol delivery.' },
                    { step: '7. Pre-Legal & Small Claims Escalation', desc: 'Final demand issuance prior to external legal counsel endorsement under court rules.' },
                    { step: '8. Settlement & Certificate of Full Payment', desc: 'Reconciliation of cleared funds, fee waiver endorsement, and formal clearance certificate.' },
                  ].map((flow, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{flow.step}</div>
                        <div className="text-slate-600 text-[11px] leading-relaxed mt-0.5">{flow.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Philippine Regulatory Guardrails</span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  StageFlow strictly enforces compliance with Philippine debt collection regulations across all automated and collector-assisted touchpoints.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>BSP Circular No. 454 (Series of 2004)</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">Bangko Sentral</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Mandates fair and ethical debt collection practices by banks and their subsidiary/outsourced collection agencies. Prohibits harassment, profane language, false representation, and calling at unreasonable hours (allowed window: 6:00 AM to 10:00 PM).
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>SEC Memorandum Circular No. 18 (Series of 2019)</span>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">SEC Philippines</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Strictly prohibits unfair debt collection practices for financing and lending companies, including contacting phone contacts not listed as co-makers or guarantors, threats of legal action when none will be taken, and public shaming.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-1.5 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>National Privacy Commission (NPC) RA 10173</span>
                    <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">Data Privacy Act</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Protects personal and sensitive debtor information. Strictly limits third-party disclosure during collection calls — no disclosure of debt amount, default status, or creditor details to relatives, employers, or co-workers.
                  </p>
                </div>
              </div>

              {/* Mandatory Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[11px] leading-relaxed">
                <span className="font-bold text-slate-700">Notice: </span>
                {regulatoryDisclaimer}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs font-mono text-slate-500">
            Timezone: <span className="font-bold text-slate-800">Asia/Manila (PHT)</span> • Currency: <span className="font-bold text-slate-800">PHP (₱)</span>
          </div>

          <button
            onClick={() => setIsLocalizationDrawerOpen(false)}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
