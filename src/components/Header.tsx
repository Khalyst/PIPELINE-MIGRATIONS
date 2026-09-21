import React from 'react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  FileCode2, 
  Layers, 
  BookOpen, 
  Play, 
  Loader2
} from 'lucide-react';
import { PipelineFormat } from '../types/pipeline';
import { PIPELINE_FORMATS } from '../data/pipelineConstants';
import { LanguageSelector } from './LanguageSelector';
import { useI18n } from '../i18n/I18nContext';

interface HeaderProps {
  sourceFormat: PipelineFormat;
  targetFormat: PipelineFormat;
  isConverting: boolean;
  convertAllMode: boolean;
  onToggleConvertAll: (val: boolean) => void;
  onConvert: () => void;
  onReset: () => void;
  onOpenTemplates: () => void;
  onOpenCheatsheet: () => void;
  activeTab: 'workspace' | 'cheatsheet';
  setActiveTab: (tab: 'workspace' | 'cheatsheet') => void;
}

export const Header: React.FC<HeaderProps> = ({
  sourceFormat,
  targetFormat,
  isConverting,
  convertAllMode,
  onToggleConvertAll,
  onConvert,
  onReset,
  onOpenTemplates,
  onOpenCheatsheet,
  activeTab,
  setActiveTab,
}) => {
  const { t } = useI18n();
  const sourceMeta = PIPELINE_FORMATS[sourceFormat];
  const targetMeta = PIPELINE_FORMATS[targetFormat];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-inner font-mono font-bold text-lg">
            <ArrowRightLeft className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                {t.app.title}
              </h1>
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {t.app.subtitle}
            </p>
          </div>
        </div>

        {/* Center / Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            id="nav-workspace-tab"
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'workspace'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t.nav.studio}
          </button>
          <button
            id="nav-cheatsheet-tab"
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === 'cheatsheet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {t.nav.matrix}
          </button>
        </div>

        {/* Action Controls & Language Selector */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Templates button */}
          <button
            id="header-load-template-btn"
            onClick={onOpenTemplates}
            className="px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition flex items-center gap-1.5"
            title={t.nav.sampleTemplates}
          >
            <FileCode2 className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">{t.nav.sampleTemplates}</span>
          </button>

          {/* Convert all mode toggle */}
          <button
            id="header-convert-all-toggle"
            onClick={() => onToggleConvertAll(!convertAllMode)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition flex items-center gap-1.5 ${
              convertAllMode
                ? 'bg-indigo-950/80 text-indigo-300 border-indigo-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={t.nav.convertAll}
          >
            <div className={`w-2 h-2 rounded-full ${convertAllMode ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{t.nav.targetLabel} {convertAllMode ? t.nav.allFormats : targetMeta.shortName}</span>
          </button>

          {/* International Language Selector */}
          <LanguageSelector />

          {/* Convert Primary Button */}
          <button
            id="header-convert-btn"
            onClick={onConvert}
            disabled={isConverting}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md disabled:opacity-50 transition flex items-center gap-2"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t.nav.migrating}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-white" />
                <span>{t.nav.convertPipeline}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

