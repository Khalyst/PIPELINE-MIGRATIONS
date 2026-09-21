import React, { useRef } from 'react';
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  AlertCircle, 
  FileText, 
  Sparkles,
} from 'lucide-react';
import { PipelineFormat, SyntaxValidationIssue } from '../types/pipeline';
import { PIPELINE_FORMATS } from '../data/pipelineConstants';
import { useI18n } from '../i18n/I18nContext';

interface SourceEditorProps {
  sourceFormat: PipelineFormat;
  onChangeFormat: (format: PipelineFormat) => void;
  code: string;
  onChangeCode: (code: string) => void;
  validationIssues: SyntaxValidationIssue[];
  onLoadTemplate: () => void;
}

export const SourceEditor: React.FC<SourceEditorProps> = ({
  sourceFormat,
  onChangeFormat,
  code,
  onChangeCode,
  validationIssues,
  onLoadTemplate,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const meta = PIPELINE_FORMATS[sourceFormat];
  const formats: PipelineFormat[] = ['jenkins', 'gitlab', 'github-actions', 'aws', 'gcp', 'azure'];

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    onChangeCode('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Detect format from filename if possible
    const name = file.name.toLowerCase();
    if (name.includes('jenkinsfile')) {
      onChangeFormat('jenkins');
    } else if (name.includes('gitlab')) {
      onChangeFormat('gitlab');
    } else if (name.includes('buildspec')) {
      onChangeFormat('aws');
    } else if (name.includes('cloudbuild')) {
      onChangeFormat('gcp');
    } else if (name.includes('azure-pipelines')) {
      onChangeFormat('azure');
    } else if (name.endsWith('.yml') || name.endsWith('.yaml')) {
      // If currently not GHA, or is a workflow file
      if (sourceFormat === 'jenkins') {
        onChangeFormat('github-actions');
      }
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeCode(content);
      }
    };
    reader.readAsText(file);
  };

  const lineCount = code ? code.split('\n').length : 1;
  const errorCount = validationIssues.filter((i) => i.type === 'error').length;
  const warningCount = validationIssues.filter((i) => i.type === 'warning').length;

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
      {/* Top Header with Format Tabs */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {t.editor.sourcePipeline}:
          </span>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            {formats.map((fmt) => {
              const fMeta = PIPELINE_FORMATS[fmt];
              const isSelected = sourceFormat === fmt;
              return (
                <button
                  key={fmt}
                  id={`source-format-${fmt}`}
                  onClick={() => onChangeFormat(fmt)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {fMeta.shortName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".yml,.yaml,.groovy,text/*"
          />
          <button
            id="source-upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition flex items-center gap-1"
            title={t.editor.uploadTooltip}
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.editor.uploadFile}</span>
          </button>
          <button
            id="source-template-btn"
            onClick={onLoadTemplate}
            className="p-1.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-md transition flex items-center gap-1"
            title={t.editor.loadTemplatePrompt}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.nav.sampleTemplates}</span>
          </button>
          <button
            id="source-copy-btn"
            onClick={handleCopy}
            className="p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition"
            title={t.editor.copy}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            id="source-clear-btn"
            onClick={handleClear}
            className="p-1.5 text-xs text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition"
            title={t.editor.clear}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor File Spec Bar */}
      <div className="px-4 py-1.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono text-slate-300 font-medium">{meta.filename}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-mono">
            {meta.language}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>{lineCount} {t.editor.lines}</span>
          <span>{code.length} {t.editor.characters}</span>
          {errorCount > 0 ? (
            <span className="text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errorCount} {t.editor.syntaxIssues}
            </span>
          ) : warningCount > 0 ? (
            <span className="text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {warningCount} {t.editor.syntaxIssues}
            </span>
          ) : (
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              ✓ {t.editor.noIssues}
            </span>
          )}
        </div>
      </div>

      {/* Editor Textarea with line numbers */}
      <div className="relative flex-1 flex min-h-[420px] font-mono text-xs">
        {/* Line Numbers Sidebar */}
        <div className="w-12 bg-slate-950/80 py-3 text-right pr-3 select-none text-slate-600 border-r border-slate-800/60 font-mono text-[11px] leading-[20px]">
          {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          id="source-pipeline-editor"
          ref={textareaRef}
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          placeholder={`Paste your ${meta.name} code here, or click "${t.nav.sampleTemplates}" to load a pipeline...`}
          className="flex-1 bg-transparent text-slate-100 p-3 outline-none resize-none font-mono text-xs leading-[20px] placeholder:text-slate-600 focus:ring-0 overflow-y-auto"
          spellCheck={false}
        />
      </div>

      {/* Inline Validation Warnings / Issues if any */}
      {validationIssues.length > 0 && (
        <div className="bg-slate-950 border-t border-slate-800 p-2.5 max-h-28 overflow-y-auto text-xs">
          <div className="font-semibold text-slate-300 text-[11px] mb-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Syntax & Structure Analysis:
          </div>
          <div className="space-y-1">
            {validationIssues.map((issue, idx) => (
              <div
                key={idx}
                className={`text-[11px] flex items-start gap-1.5 ${
                  issue.type === 'error' ? 'text-red-400' : 'text-amber-300'
                }`}
              >
                <span className="font-mono text-[10px] px-1 rounded bg-slate-800 text-slate-400 shrink-0">
                  {issue.line ? `L${issue.line}` : issue.type.toUpperCase()}
                </span>
                <span>{issue.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

