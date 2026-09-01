import React from 'react';
import { Type, Layers, Box, Maximize2, Shield, Hash, Palette } from 'lucide-react';

export const DesignTokensSection: React.FC = () => {
  return (
    <div className="space-y-10">
      {/* Overview Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-600">
              Foundational Tokens
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Typography, Spatial Grid & Surface Architecture
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              StageFlow AI uses a controlled, high-density financial design system. Built on a strict 4px baseline,
              tabular monospace numerical representations for accounting precision, and clean, high-contrast light surfaces.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>WCAG AAA Compliant</span>
          </div>
        </div>
      </div>

      {/* 1. Typography & Hierarchy */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Type className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Typography Scale & Font Hierarchy
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Font Family pairing */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Dual Typeface Architecture</div>
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-900">Plus Jakarta Sans</span>
                  <span className="font-mono text-[11px] text-slate-400">UI Body & Interface Headers</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold tracking-tight">
                  Debt Collection Operations & Portfolio Recovery Workflow
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Optimized for dense screens, geometric clarity, and high legibility at 11–13px.
                </p>
              </div>

              <div className="p-3 rounded-md bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-900 font-mono">JetBrains Mono (Tabular)</span>
                  <span className="font-mono text-[11px] text-slate-400">Currencies, Codes, Hashes & SLAs</span>
                </div>
                <p className="text-sm text-indigo-700 font-mono font-bold">
                  $142,850.75 USD • DPD: 124d • TX# 0x8F9a4C2 • 94.2% Conf
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Strict tabular zero, equal width numerals for column alignment in ledgers and tables.
                </p>
              </div>
            </div>
          </div>

          {/* Heading and Scale Hierarchy */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Scale & Line Height Hierarchy</div>
            <div className="space-y-2 text-xs">
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">H1 Display (20px / 1.2)</span>
                <span className="font-mono text-[11px] text-slate-400">font-extrabold text-xl</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-base font-bold text-slate-900 tracking-tight">H2 Section Header (16px / 1.25)</span>
                <span className="font-mono text-[11px] text-slate-400">font-bold text-base</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-sm font-semibold text-slate-900">H3 Subsection (14px / 1.3)</span>
                <span className="font-mono text-[11px] text-slate-400">font-semibold text-sm</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Label / Table Header (11px / 1.4)</span>
                <span className="font-mono text-[11px] text-slate-400">text-[11px] uppercase tracking-wider</span>
              </div>
              <div className="flex items-baseline justify-between border-b border-slate-100 pb-1.5">
                <span className="text-xs text-slate-700 leading-relaxed font-medium">Body Standard (12px / 1.5)</span>
                <span className="font-mono text-[11px] text-slate-400">text-xs leading-relaxed</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[11px] text-slate-600 font-semibold">Metadata & Audit Lineage (11px / Mono)</span>
                <span className="font-mono text-[11px] text-slate-400">font-mono text-[11px]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Spacing & Spatial Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Maximize2 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            2. Spatial System & Density Scale (4px Base Grid)
          </h3>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-xs">
            {[
              { token: '4px (space-1)', label: 'Dense Gap', visual: 'w-1 h-8' },
              { token: '8px (space-2)', label: 'Standard Gap', visual: 'w-2 h-8' },
              { token: '12px (space-3)', label: 'Component Pad', visual: 'w-3 h-8' },
              { token: '16px (space-4)', label: 'Container Pad', visual: 'w-4 h-8' },
              { token: '20px (space-5)', label: 'Section Gap', visual: 'w-5 h-8' },
              { token: '24px (space-6)', label: 'Card Inset', visual: 'w-6 h-8' },
              { token: '32px (space-8)', label: 'Module Margin', visual: 'w-8 h-8' },
            ].map((s, idx) => (
              <div key={idx} className="p-2.5 rounded-md bg-slate-50 border border-slate-200 flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-indigo-700 font-bold">{s.token}</span>
                </div>
                <div className="flex items-center gap-1.5 my-1">
                  <div className={`bg-indigo-200 rounded-xs ${s.visual} border border-indigo-300`} />
                </div>
                <span className="text-[10px] text-slate-600 leading-none">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Border Radius, Borders & Shadows */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. Radius, Borders & Elevation Matrix
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Strict Radius */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Border Radius (Strictly Controlled)</div>
            <p className="text-[11px] text-slate-500">
              Excessive roundness is avoided. Flat, functional 2px to 8px radii reinforce clean modern precision.
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between p-2 rounded-xs bg-slate-50 border border-slate-200 text-xs">
                <span className="font-mono text-slate-800 font-medium">rounded-xs (2px)</span>
                <span className="text-[10px] text-slate-500">Badges & Tags</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-sm bg-slate-50 border border-slate-200 text-xs">
                <span className="font-mono text-slate-800 font-medium">rounded-sm (4px)</span>
                <span className="text-[10px] text-slate-500">Buttons & Inputs</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                <span className="font-mono text-slate-800 font-medium">rounded (6px)</span>
                <span className="text-[10px] text-slate-500">Cards & Tables</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-200 text-xs">
                <span className="font-mono text-slate-800 font-medium">rounded-md (8px)</span>
                <span className="text-[10px] text-slate-500">Modals & Drawers</span>
              </div>
            </div>
          </div>

          {/* Borders */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Border Types & Semantics</div>
            <p className="text-[11px] text-slate-500">
              Hairline 1px borders define structure without bulky shadows or visual noise.
            </p>
            <div className="space-y-2 pt-1">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 flex justify-between font-medium">
                <span>Standard Neutral</span>
                <span className="font-mono text-[10px] text-slate-500">border-slate-200</span>
              </div>
              <div className="p-2 rounded bg-indigo-50 border border-dashed border-indigo-300 text-xs text-indigo-900 flex justify-between font-medium">
                <span>AI Advisory Dashed</span>
                <span className="font-mono text-[10px] text-indigo-700">border-dashed border-indigo-300</span>
              </div>
              <div className="p-2 rounded bg-amber-50 border border-amber-300 text-xs text-amber-900 flex justify-between font-medium">
                <span>Human Review Gate</span>
                <span className="font-mono text-[10px] text-amber-700">border-amber-300</span>
              </div>
              <div className="p-2 rounded bg-emerald-50 border-2 border-emerald-400 text-xs text-emerald-900 flex justify-between font-medium">
                <span>Verified Ground Truth</span>
                <span className="font-mono text-[10px] text-emerald-700">border-2 border-emerald-400</span>
              </div>
            </div>
          </div>

          {/* Elevation & Shadows */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-slate-900">Shadows & Z-Elevation</div>
            <p className="text-[11px] text-slate-500">
              Light mode optical hierarchy relies on subtle 1px border edges and crisp elevation shadows.
            </p>
            <div className="space-y-2 pt-1">
              <div className="p-2 rounded bg-slate-50 border border-slate-200 shadow-none text-xs text-slate-600 flex justify-between">
                <span>Elevation 0 (Canvas)</span>
                <span className="font-mono text-[10px]">bg-[#F8FAFC]</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 shadow-xs text-xs text-slate-800 flex justify-between font-medium">
                <span>Elevation 1 (Panel / Card)</span>
                <span className="font-mono text-[10px]">shadow-xs</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 shadow-md text-xs text-slate-900 flex justify-between font-medium">
                <span>Elevation 2 (Dropdown/Popover)</span>
                <span className="font-mono text-[10px]">shadow-md</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200 shadow-xl text-xs text-slate-950 flex justify-between font-medium">
                <span>Elevation 3 (Modal / Drawer)</span>
                <span className="font-mono text-[10px]">shadow-xl</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
