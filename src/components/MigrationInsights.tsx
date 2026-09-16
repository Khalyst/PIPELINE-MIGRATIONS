import React, { useState } from 'react';
import { 
  KeyRound, 
  AlertTriangle, 
  ListTree, 
  Variable, 
  CheckCircle2, 
  Info, 
  HelpCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SingleConversionResult, PipelineFormat } from '../types/pipeline';
import { PIPELINE_FORMATS } from '../data/pipelineConstants';

interface MigrationInsightsProps {
  result: SingleConversionResult | null;
  sourceFormat: PipelineFormat;
  targetFormat: PipelineFormat;
}

export const MigrationInsights: React.FC<MigrationInsightsProps> = ({
  result,
  sourceFormat,
  targetFormat,
}) => {
  const [activeTab, setActiveTab] = useState<'vars' | 'secrets' | 'warnings' | 'steps'>('vars');

  if (!result) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-slate-500">
        <p className="text-xs">
          Run pipeline conversion to unlock deep migration diagnostics, credentials mappings, environment variables equivalence, and potential DevOps caveats.
        </p>
      </div>
    );
  }

  const { envVarMappings, secretMappings, migrationWarnings, stepMappings } = result;

  const warningCount = migrationWarnings.length;
  const criticalCount = migrationWarnings.filter(w => w.level === 'critical').length;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            id="insight-tab-vars"
            onClick={() => setActiveTab('vars')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'vars'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Variable className="w-3.5 h-3.5" />
            <span>Environment Variables ({envVarMappings.length})</span>
          </button>

          <button
            id="insight-tab-secrets"
            onClick={() => setActiveTab('secrets')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'secrets'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Secrets & Auth ({secretMappings.length})</span>
          </button>

          <button
            id="insight-tab-warnings"
            onClick={() => setActiveTab('warnings')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'warnings'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${criticalCount > 0 ? 'text-red-400' : 'text-amber-400'}`} />
            <span>Migration Gotchas ({warningCount})</span>
          </button>

          <button
            id="insight-tab-steps"
            onClick={() => setActiveTab('steps')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
              activeTab === 'steps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <ListTree className="w-3.5 h-3.5" />
            <span>Stage Equivalence ({stepMappings.length})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 font-mono">
          {PIPELINE_FORMATS[sourceFormat].shortName} → {PIPELINE_FORMATS[targetFormat].shortName} Migration Analysis
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="p-4 overflow-y-auto max-h-72">
        {/* Environment Variables Mapping */}
        {activeTab === 'vars' && (
          <div>
            {envVarMappings.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No explicit dynamic environment variables detected in source code. Standard built-ins are mapped automatically.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                      <th className="pb-2 font-semibold">Source Variable ({PIPELINE_FORMATS[sourceFormat].shortName})</th>
                      <th className="pb-2 font-semibold">Target Variable ({PIPELINE_FORMATS[targetFormat].shortName})</th>
                      <th className="pb-2 font-semibold">Behavior & Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {envVarMappings.map((mapping, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2.5 text-blue-400 pr-3 font-semibold">
                          {mapping.sourceVar}
                        </td>
                        <td className="py-2.5 text-emerald-400 pr-3 font-semibold">
                          {mapping.targetVar}
                        </td>
                        <td className="py-2.5 text-slate-300 font-sans text-xs">
                          {mapping.notes}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Secrets & Credentials Migration */}
        {activeTab === 'secrets' && (
          <div className="space-y-3">
            {secretMappings.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No embedded credentials or credential binding blocks identified. Ensure environment tokens are configured in your target provider settings.
              </p>
            ) : (
              secretMappings.map((sec, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-amber-400 font-semibold">
                      Source: {sec.sourceSecret}
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50">
                      Target: {sec.targetMechanism}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    <span className="font-semibold text-slate-200">DevOps Setup Guide: </span>
                    {sec.setupInstructions}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Warnings & Gotchas */}
        {activeTab === 'warnings' && (
          <div className="space-y-2.5">
            {migrationWarnings.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-emerald-400 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>No migration impediments detected! Clean direct syntax conversion.</span>
              </div>
            ) : (
              migrationWarnings.map((warn, idx) => {
                const isCrit = warn.level === 'critical';
                const isWarn = warn.level === 'warning';
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs ${
                      isCrit
                        ? 'bg-red-950/30 border-red-800/60 text-red-200'
                        : isWarn
                        ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                        : 'bg-blue-950/30 border-blue-800/60 text-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 font-semibold">
                      {isCrit ? (
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <span>{warn.title}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] mb-1.5 leading-relaxed">
                      {warn.detail}
                    </p>
                    <div className="text-[11px] font-medium text-slate-200 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                      <span className="text-indigo-300 font-semibold">Action Required: </span>
                      {warn.actionRequired}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Step Equivalence */}
        {activeTab === 'steps' && (
          <div className="space-y-2">
            {stepMappings.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                All steps were mapped directly into target job/phase declarations.
              </p>
            ) : (
              stepMappings.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-300 text-[11px] font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {step.originalStep}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-indigo-400 text-[11px] font-semibold">
                      {step.convertedStep}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {step.targetSyntaxNotes}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
