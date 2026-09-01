import React from 'react';
import { SkipTraceSummary } from '../../types/skipTrace';
import { IdentityBandBadge } from './IdentityBandBadge';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  Briefcase,
  Globe2,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Building,
  Home,
  Check,
  TrendingUp,
  Radio,
  FileCheck,
  Landmark,
} from 'lucide-react';

interface SkipTraceSummaryGridProps {
  summary: SkipTraceSummary;
  onFilterEvidence?: (category: string) => void;
}

export const SkipTraceSummaryGrid: React.FC<SkipTraceSummaryGridProps> = ({
  summary,
  onFilterEvidence,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          Investigation Summary Matrix
        </h2>
        <span className="text-xs text-slate-500 font-mono">
          7 Core Investigation Dimensions
        </span>
      </div>

      {/* Top 2 Primary Cards: Identity Confidence & Contactability */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 1. Identity Confidence Card (5 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Identity Confidence</h3>
                <p className="text-[11px] text-slate-500">Public registry & credit header cross-reference</p>
              </div>
            </div>
            <IdentityBandBadge band={summary.identityConfidence.band} size="md" />
          </div>

          {/* Score & Concordance Gauge */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-100 mb-4 bg-slate-50/70 rounded-lg px-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Match Index</span>
              <div className="text-2xl font-black font-mono text-slate-900 flex items-baseline gap-1">
                {summary.identityConfidence.score}%
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    summary.identityConfidence.score >= 85
                      ? 'bg-emerald-500'
                      : summary.identityConfidence.score >= 60
                      ? 'bg-indigo-500'
                      : summary.identityConfidence.score >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${summary.identityConfidence.score}%` }}
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Signals Found</span>
              <div className="text-2xl font-black font-mono text-emerald-700">
                {summary.identityConfidence.corroboratingSignalsCount}
              </div>
              <span className="text-[10px] text-slate-500">Public sources concordant</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Discrepancies</span>
              <div
                className={`text-2xl font-black font-mono ${
                  summary.identityConfidence.discrepancyCount > 0 ? 'text-rose-600' : 'text-slate-500'
                }`}
              >
                {summary.identityConfidence.discrepancyCount}
              </div>
              <span className="text-[10px] text-slate-500">Contradictions flagged</span>
            </div>
          </div>

          {/* Identity Sub-Signals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200/80">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-600 truncate">SSN: {summary.identityConfidence.ssnMatchStatus.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200/80">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-600 truncate">DOB: {summary.identityConfidence.dobMatchStatus.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200/80">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-slate-600 truncate">Name: {summary.identityConfidence.nameConcordance.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        {/* 2. Contactability Card (6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Contactability Score</h3>
                <p className="text-[11px] text-slate-500">Reachability grade & optimal window</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-indigo-900 text-white font-mono font-black text-sm rounded-lg shadow-xs">
              Grade {summary.contactability.grade}
            </span>
          </div>

          {/* Reachability & Window */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 mb-4 bg-slate-50/70 rounded-lg px-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Reachability Score</span>
              <div className="text-2xl font-black font-mono text-indigo-950">
                {summary.contactability.overallScore} / 100
              </div>
              <span className="text-[10px] text-slate-500">
                {summary.contactability.activeChannelsCount} Active Verified Channels
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Best Contact Window</span>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>{summary.contactability.bestContactWindow}</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">
                {summary.contactability.fdcpaStatus === 'IN_CALL_WINDOW' ? '✓ FDCPA Permissible Hours Active' : '⚠ Outreach Hold Active'}
              </span>
            </div>
          </div>

          {/* Preferred Channel */}
          <div className="flex items-center justify-between text-xs bg-indigo-50/60 border border-indigo-100 px-3 py-2 rounded-lg">
            <span className="text-slate-600 font-medium">Preferred Channel:</span>
            <span className="font-bold text-indigo-900">{summary.contactability.preferredChannel}</span>
          </div>
        </div>
      </div>

      {/* Bottom 5 Grid Cards: Phone, Email, Professional, Social, Geographic */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 3. Phone Card */}
        <div
          onClick={() => onFilterEvidence && onFilterEvidence('PHONE')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 group-hover:bg-sky-100 transition-colors">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                {summary.phone.totalDiscovered} Lines
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Phone Discovery</h4>
            <div className="mt-2 text-xs font-mono font-bold text-slate-900 truncate">
              {summary.phone.topReachableNumber}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              {summary.phone.topCarrier}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            {summary.phone.activeMobileCount} Mobile • {summary.phone.activeLandlineCount} Wireline
          </div>
        </div>

        {/* 4. Email Card */}
        <div
          onClick={() => onFilterEvidence && onFilterEvidence('EMAIL')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 group-hover:bg-purple-100 transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                {summary.email.totalDiscovered} Discovered
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Email & Deliverability</h4>
            <div className="mt-2 text-xs font-mono font-semibold text-slate-900 truncate">
              {summary.email.primaryWorkEmail || summary.email.primaryPersonalEmail || 'No Active Mailbox'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {summary.email.validDeliverableCount} MX Validated Deliverable
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-emerald-600 font-medium">
            Electronic 1692g Notice Ready
          </div>
        </div>

        {/* 5. Professional Card */}
        <div
          onClick={() => onFilterEvidence && onFilterEvidence('PROFESSIONAL')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:bg-amber-100 transition-colors">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded truncate max-w-[85px]">
                {summary.professional.employmentStatus === 'CURRENT_ACTIVE' ? 'Active TWN' : 'Historical'}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Professional & Payroll</h4>
            <div className="mt-2 text-xs font-bold text-slate-900 truncate">
              {summary.professional.employerName}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {summary.professional.jobTitle}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono truncate">
            Est: {summary.professional.estimatedIncomeRange}
          </div>
        </div>

        {/* 6. Social / Public Registry Card */}
        <div
          onClick={() => onFilterEvidence && onFilterEvidence('SOCIAL')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-100 transition-colors">
                <Globe2 className="w-4 h-4" />
              </div>
              <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                {summary.social.publicProfilesCount} Profiles
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Public Professional Directory</h4>
            <div className="mt-2 text-xs font-medium text-slate-800 line-clamp-2">
              {summary.social.primaryProfessionalRegistry}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              Ind: {summary.social.verifiedIndustry}
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
            {summary.social.publicEntityFilingsCount} Public Business Filings
          </div>
        </div>

        {/* 7. Geographic Card */}
        <div
          onClick={() => onFilterEvidence && onFilterEvidence('GEOGRAPHIC')}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded truncate max-w-[85px]">
                {summary.geographic.residenceType.replace(/_/g, ' ')}
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Geographic & Property</h4>
            <div className="mt-2 text-xs font-medium text-slate-900 truncate">
              {summary.geographic.primaryAddress}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-mono">
              Tenure: {summary.geographic.tenureYears} yrs
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-mono truncate">
            {summary.geographic.assessedPropertyValue || 'Tax records indexed'}
          </div>
        </div>
      </div>
    </div>
  );
};
