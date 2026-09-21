import React from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  ExternalLink, 
  Sparkles, 
  Cpu, 
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { PipelineFormat, SingleConversionResult } from '../types/pipeline';
import { AIProviderConfig } from '../types/ai';
import { AI_PROVIDER_PRESETS } from '../data/aiConstants';
import { PIPELINE_FORMATS } from '../data/pipelineConstants';
import { useI18n } from '../i18n/I18nContext';

interface TargetViewerProps {
  sourceFormat: PipelineFormat;
  targetFormat: PipelineFormat;
  onChangeTargetFormat: (format: PipelineFormat) => void;
  result: SingleConversionResult | null;
  multiResults: Record<PipelineFormat, SingleConversionResult> | null;
  convertAllMode: boolean;
  isConverting: boolean;
  onConvertSingle: (format: PipelineFormat) => void;
  aiConfig?: AIProviderConfig;
}

export const TargetViewer: React.FC<TargetViewerProps> = ({
  sourceFormat,
  targetFormat,
  onChangeTargetFormat,
  result,
  multiResults,
  convertAllMode,
  isConverting,
  onConvertSingle,
  aiConfig,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);

  const currentPreset = aiConfig ? AI_PROVIDER_PRESETS.find((p) => p.id === aiConfig.provider) : undefined;
  const activeModelTag = aiConfig?.model || currentPreset?.name || 'AI';

  const availableTargets: PipelineFormat[] = (['jenkins', 'gitlab', 'github-actions', 'aws', 'gcp', 'azure'] as PipelineFormat[]).filter(
    (f) => f !== sourceFormat
  );

  // Active result either from multiResults or single result
  const activeResult: SingleConversionResult | null = convertAllMode && multiResults
    ? multiResults[targetFormat] || null
    : result;

  const meta = PIPELINE_FORMATS[targetFormat];
  const convertedCode = activeResult?.convertedCode || '';
  const lineCount = convertedCode ? convertedCode.split('\n').length : 1;

  const handleCopy = () => {
    if (!convertedCode) return;
    navigator.clipboard.writeText(convertedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!convertedCode) return;
    const filename = activeResult?.filename || meta.filename;
    const blob = new Blob([convertedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.split('/').pop() || filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const complexityColor = (score?: string) => {
    switch (score) {
      case 'Low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'Medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'High': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Complex': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
      {/* Top Header with Target Tabs */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.viewer.targetPipeline}:
          </span>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {availableTargets.map((fmt) => {
              const fMeta = PIPELINE_FORMATS[fmt];
              const isSelected = targetFormat === fmt;
              const hasMultiResult = multiResults && multiResults[fmt];
              return (
                <button
                  key={fmt}
                  id={`target-format-${fmt}`}
                  onClick={() => onChangeTargetFormat(fmt)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <span>{fMeta.shortName}</span>
                  {hasMultiResult && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {activeResult?.aiPowered ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-mono">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>{activeModelTag}</span>
            </span>
          ) : activeResult ? (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono"
              title={activeResult.fallbackNotice || t.viewer.astTranslated}
            >
              <Cpu className="w-3 h-3 text-emerald-400" /> {t.viewer.astTranslated}
            </span>
          ) : null}
          {activeResult?.complexityScore && (
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${complexityColor(activeResult.complexityScore)}`}>
              {activeResult.complexityScore} {t.viewer.complexity}
            </span>
          )}
          <button
            id="target-copy-btn"
            onClick={handleCopy}
            disabled={!convertedCode}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition disabled:opacity-40 flex items-center gap-1"
            title={t.viewer.copyCode}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{t.viewer.copyCode}</span>
          </button>
          <button
            id="target-download-btn"
            onClick={handleDownload}
            disabled={!convertedCode}
            className="p-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-md transition disabled:opacity-40 flex items-center gap-1"
            title={`${t.viewer.downloadFile} ${activeResult?.filename || meta.filename}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.viewer.downloadFile}</span>
          </button>
        </div>
      </div>

      {/* Fallback Notice Banner if quota reached */}
      {activeResult?.fallbackNotice && (
        <div className="px-4 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{activeResult.fallbackNotice}</span>
        </div>
      )}

      {/* Target Spec Bar */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-mono text-slate-300 font-medium">
            {activeResult?.filename || meta.filename}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
            {meta.language}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {convertedCode ? (
            <>
              <span>{lineCount} {t.editor.lines}</span>
              <a
                href={meta.officialDocUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </>
          ) : (
            <span className="text-slate-500">{t.viewer.waitingPrompt}</span>
          )}
        </div>
      </div>

      {/* Code Viewer */}
      <div className="relative flex-1 flex min-h-[420px] font-mono text-xs overflow-hidden">
        {convertedCode ? (
          <>
            {/* Line Numbers */}
            <div className="w-12 bg-slate-950/80 py-3 text-right pr-3 select-none text-slate-600 border-r border-slate-800/60 font-mono text-[11px] leading-[20px]">
              {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Readonly Code Block */}
            <pre className="flex-1 bg-transparent text-emerald-300/90 p-3 outline-none font-mono text-xs leading-[20px] overflow-auto select-text">
              <code>{convertedCode}</code>
            </pre>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-950/40">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-3 text-slate-400 border border-slate-800">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-300 mb-1">
              {meta.name}
            </p>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {t.viewer.waitingPrompt}
            </p>
            <button
              id="empty-state-convert-btn"
              onClick={() => onConvertSingle(targetFormat)}
              disabled={isConverting}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm flex items-center gap-1.5 transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{t.viewer.convertNow}</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Summary Bar */}
      {activeResult?.explanation && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-2.5 text-xs text-slate-400 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="line-clamp-2 text-slate-300 text-[11px] leading-relaxed">
            {activeResult.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

