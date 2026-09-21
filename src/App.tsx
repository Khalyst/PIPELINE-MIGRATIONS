/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SourceEditor } from './components/SourceEditor';
import { TargetViewer } from './components/TargetViewer';
import { MigrationInsights } from './components/MigrationInsights';
import { EnvVarCheatsheet } from './components/EnvVarCheatsheet';
import { TemplateModal } from './components/TemplateModal';
import { PipelineFormat, SingleConversionResult, SyntaxValidationIssue, PipelineTemplate } from './types/pipeline';
import { PIPELINE_TEMPLATES, PIPELINE_FORMATS } from './data/pipelineConstants';
import { ArrowRightLeft, Sparkles, Layers, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from './i18n/I18nContext';

export default function App() {
  const { t } = useI18n();
  const defaultTemplate = PIPELINE_TEMPLATES[0]; // Jenkins Node + Docker CI/CD

  const [sourceFormat, setSourceFormat] = useState<PipelineFormat>('jenkins');
  const [targetFormat, setTargetFormat] = useState<PipelineFormat>('github-actions');
  const [sourceCode, setSourceCode] = useState<string>(defaultTemplate.code);

  const [activeNavTab, setActiveNavTab] = useState<'workspace' | 'cheatsheet'>('workspace');
  const [convertAllMode, setConvertAllMode] = useState<boolean>(true);
  const [isConverting, setIsConverting] = useState<boolean>(false);

  const [singleResult, setSingleResult] = useState<SingleConversionResult | null>(null);
  const [multiResults, setMultiResults] = useState<Record<PipelineFormat, SingleConversionResult> | null>(null);

  const [validationIssues, setValidationIssues] = useState<SyntaxValidationIssue[]>([]);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Validate pipeline code on change with light debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!sourceCode.trim()) {
        setValidationIssues([]);
        return;
      }
      try {
        const res = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: sourceCode, format: sourceFormat }),
        });
        if (res.ok) {
          const data = await res.json();
          setValidationIssues(data.issues || []);
        }
      } catch (err) {
        console.error('Validation error:', err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [sourceCode, sourceFormat]);

  // Main conversion runner
  const handleConvert = useCallback(async () => {
    if (!sourceCode.trim()) {
      setStatusMessage({ type: 'error', text: t.app.pleaseEnterCode });
      return;
    }

    setIsConverting(true);
    setStatusMessage(null);

    try {
      if (convertAllMode) {
        const res = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceCode,
            sourceFormat,
            convertAll: true,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Conversion request failed');
        }

        const data = await res.json();
        setMultiResults(data.results);
        // Also set singleResult for current active target tab
        if (data.results && data.results[targetFormat]) {
          setSingleResult(data.results[targetFormat]);
        }
        setStatusMessage({
          type: 'success',
          text: `${t.app.convertedAllSuccess} (${Object.keys(data.results).map(f => PIPELINE_FORMATS[f as PipelineFormat]?.shortName).join(', ')})!`,
        });
      } else {
        const res = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceCode,
            sourceFormat,
            targetFormat,
            convertAll: false,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Conversion request failed');
        }

        const data = await res.json();
        setSingleResult(data.result);
        setStatusMessage({
          type: 'success',
          text: `${t.app.convertedSuccess} ${PIPELINE_FORMATS[targetFormat].name} (${data.result.aiPowered ? t.viewer.aiOptimized : t.viewer.astTranslated}).`,
        });
      }
    } catch (error: any) {
      console.error('Conversion error:', error);
      setStatusMessage({
        type: 'error',
        text: `${t.app.conversionFailed}: ${error.message || 'Error executing translation'}.`,
      });
    } finally {
      setIsConverting(false);
    }
  }, [sourceCode, sourceFormat, targetFormat, convertAllMode, t]);

  // Convert on initial mount once so user immediately sees live conversion result
  useEffect(() => {
    handleConvert();
  }, []);

  const handleSourceFormatChange = (newFormat: PipelineFormat) => {
    setSourceFormat(newFormat);
    // If target equals new source format, pick first alternative
    if (targetFormat === newFormat) {
      const alternatives: PipelineFormat[] = (['jenkins', 'gitlab', 'github-actions', 'aws', 'gcp', 'azure'] as PipelineFormat[]).filter(
        (f) => f !== newFormat
      );
      setTargetFormat(alternatives[0]);
    }
  };

  const handleTargetFormatChange = (newTarget: PipelineFormat) => {
    setTargetFormat(newTarget);
    if (multiResults && multiResults[newTarget]) {
      setSingleResult(multiResults[newTarget]);
    }
  };

  const handleSelectTemplate = (template: PipelineTemplate) => {
    setSourceFormat(template.format);
    setSourceCode(template.code);
    const alternatives: PipelineFormat[] = (['jenkins', 'gitlab', 'github-actions', 'aws', 'gcp', 'azure'] as PipelineFormat[]).filter(
      (f) => f !== template.format
    );
    setTargetFormat(alternatives[0]);
    setStatusMessage({
      type: 'info',
      text: `${t.app.templateLoaded} "${template.title}".`,
    });
  };

  const handleReset = () => {
    setSourceCode('');
    setSingleResult(null);
    setMultiResults(null);
    setStatusMessage(null);
  };

  // Active result object
  const activeResult = convertAllMode && multiResults ? multiResults[targetFormat] : singleResult;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation */}
      <Header
        sourceFormat={sourceFormat}
        targetFormat={targetFormat}
        isConverting={isConverting}
        convertAllMode={convertAllMode}
        onToggleConvertAll={(val) => setConvertAllMode(val)}
        onConvert={handleConvert}
        onReset={handleReset}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenCheatsheet={() => setActiveNavTab('cheatsheet')}
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-5">
        {/* Status / Alert Banner if present */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center justify-between gap-3 border transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                : statusMessage.type === 'error'
                ? 'bg-red-950/40 border-red-800/60 text-red-200'
                : 'bg-blue-950/40 border-blue-800/60 text-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-900/60"
            >
              {t.app.dismiss}
            </button>
          </div>
        )}

        {/* View Switcher: Migration Studio vs. Cheatsheet Matrix */}
        {activeNavTab === 'workspace' ? (
          <div className="space-y-5">
            {/* Quick Context Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-300">{t.app.activeMigrationPath}</span>
                <span className="px-2 py-0.5 rounded font-mono font-medium bg-red-950/60 text-red-300 border border-red-800/40">
                  {PIPELINE_FORMATS[sourceFormat].name}
                </span>
                <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                <span className="px-2 py-0.5 rounded font-mono font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/40">
                  {convertAllMode ? t.app.allOtherPlatforms : PIPELINE_FORMATS[targetFormat].name}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-slate-400">
                  {convertAllMode ? t.app.multiTargetActive : t.app.singleTargetActive}
                </span>
              </div>
            </div>

            {/* Split Screen Editors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch min-h-[480px]">
              {/* Left Column: Source Pipeline Editor */}
              <SourceEditor
                sourceFormat={sourceFormat}
                onChangeFormat={handleSourceFormatChange}
                code={sourceCode}
                onChangeCode={setSourceCode}
                validationIssues={validationIssues}
                onLoadTemplate={() => setIsTemplateModalOpen(true)}
              />

              {/* Right Column: Converted Target Pipeline Viewer */}
              <TargetViewer
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                onChangeTargetFormat={handleTargetFormatChange}
                result={singleResult}
                multiResults={multiResults}
                convertAllMode={convertAllMode}
                isConverting={isConverting}
                onConvertSingle={handleConvert}
              />
            </div>

            {/* Migration Diagnostics, Security, Environment Variables & Gotchas Panel */}
            <MigrationInsights
              result={activeResult}
              sourceFormat={sourceFormat}
              targetFormat={targetFormat}
            />
          </div>
        ) : (
          /* Cheatsheet / Matrix View */
          <EnvVarCheatsheet />
        )}
      </main>

      {/* Templates Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentFormat={sourceFormat}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 text-slate-500 text-xs py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div>
            {t.app.footerText}
          </div>
          <div className="text-[11px] text-slate-400">
            {t.app.poweredBy}
          </div>
        </div>
      </footer>
    </div>
  );
}
