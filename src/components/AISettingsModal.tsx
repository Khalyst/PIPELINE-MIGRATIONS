import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Cpu,
  Check,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Server,
  Zap,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { AIProviderConfig, AIProviderId, TestConnectionResponse } from '../types/ai';
import { AI_PROVIDER_PRESETS, DEFAULT_AI_CONFIG, saveAIConfig } from '../data/aiConstants';
import { useI18n } from '../i18n/I18nContext';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AIProviderConfig;
  onSaveConfig: (newConfig: AIProviderConfig) => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const { t } = useI18n();

  // Local draft state
  const [provider, setProvider] = useState<AIProviderId>(config.provider);
  const [model, setModel] = useState<string>(config.model);
  const [customModel, setCustomModel] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>(config.apiKey || '');
  const [baseUrl, setBaseUrl] = useState<string>(config.baseUrl || '');
  const [useCustomKey, setUseCustomKey] = useState<boolean>(!!config.useCustomKey);
  const [temperature, setTemperature] = useState<number>(config.temperature ?? 0.1);

  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<TestConnectionResponse | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!isOpen) return null;

  const currentPreset = AI_PROVIDER_PRESETS.find((p) => p.id === provider) || AI_PROVIDER_PRESETS[0];

  const handleSelectProvider = (newProvider: AIProviderId) => {
    setProvider(newProvider);
    const preset = AI_PROVIDER_PRESETS.find((p) => p.id === newProvider) || AI_PROVIDER_PRESETS[0];
    setModel(preset.defaultModel);
    setCustomModel('');
    setBaseUrl(preset.defaultBaseUrl || '');
    if (newProvider === 'gemini') {
      setUseCustomKey(false);
    } else if (preset.requiresApiKey) {
      setUseCustomKey(true);
    }
    setTestResult(null);
  };

  const effectiveModel = model === 'custom' ? customModel.trim() || 'default-model' : model;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const testPayload: AIProviderConfig = {
      provider,
      model: effectiveModel,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim() || undefined,
      temperature,
      useCustomKey,
    };

    try {
      const resp = await fetch('/api/test-ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload),
      });
      const data: TestConnectionResponse = await resp.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Failed to reach server backend test endpoint',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const newConfig: AIProviderConfig = {
      provider,
      model: effectiveModel,
      apiKey: apiKey.trim() || undefined,
      baseUrl: baseUrl.trim() || undefined,
      temperature,
      useCustomKey,
    };

    saveAIConfig(newConfig);
    onSaveConfig(newConfig);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleResetDefaults = () => {
    setProvider(DEFAULT_AI_CONFIG.provider);
    setModel(DEFAULT_AI_CONFIG.model);
    setCustomModel('');
    setApiKey('');
    setBaseUrl('');
    setUseCustomKey(false);
    setTemperature(DEFAULT_AI_CONFIG.temperature ?? 0.1);
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        id="ai-settings-modal"
        className="w-full max-w-3xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                {t.aiSettings.modalTitle}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Universal AI
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.aiSettings.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            id="close-ai-settings-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Provider Grid */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">
              {t.aiSettings.selectProvider}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {AI_PROVIDER_PRESETS.map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    id={`ai-provider-card-${p.id}`}
                    type="button"
                    onClick={() => handleSelectProvider(p.id)}
                    className={`relative p-3 rounded-xl border text-left transition flex flex-col justify-between h-24 ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-md ring-1 ring-indigo-500/40'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800/80 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-semibold truncate text-slate-100">
                          {p.name}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {p.company}
                      </p>
                    </div>
                    {p.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 w-fit border border-slate-700/60 truncate">
                        {p.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Description & Info Banner */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-200">{currentPreset.name}</span>
                {currentPreset.docUrl && (
                  <a
                    href={currentPreset.docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <span>Get API Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-slate-400 text-[11px] mt-1">
                {currentPreset.description}
              </p>
            </div>
          </div>

          {/* Configuration Form for Active Provider */}
          <div className="space-y-4 pt-1">
            {/* If Gemini: Choose between Built-in Key and Custom Key */}
            {provider === 'gemini' && (
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Authentication Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setUseCustomKey(false)}
                    className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
                      !useCustomKey
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                    <div>
                      <div className="font-medium text-slate-200">{t.aiSettings.useBuiltInKey}</div>
                      <div className="text-[10px] text-slate-400">Zero configuration needed</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUseCustomKey(true)}
                    className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
                      useCustomKey
                        ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Zap className="w-4 h-4 shrink-0 text-indigo-400" />
                    <div>
                      <div className="font-medium text-slate-200">{t.aiSettings.enterCustomKey}</div>
                      <div className="text-[10px] text-slate-400">Higher quota & personal billing</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* API Key Input (if required or custom key active) */}
            {(provider !== 'ast-only' && (currentPreset.requiresApiKey || (provider === 'gemini' && useCustomKey) || provider === 'ollama' || provider === 'custom')) && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300">
                    {t.aiSettings.apiKeyLabel}
                    {currentPreset.requiresApiKey && <span className="text-rose-400 ml-1">*</span>}
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Stored strictly in browser local storage
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="ai-api-key-input"
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={currentPreset.keyPlaceholder || 'Enter your API key...'}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t.aiSettings.apiKeyHelp}
                </p>
              </div>
            )}

            {/* Base URL Input (for DeepSeek, OpenRouter, Ollama, Custom) */}
            {(provider === 'deepseek' || provider === 'openrouter' || provider === 'ollama' || provider === 'custom') && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-400" />
                  {t.aiSettings.baseUrlLabel}
                </label>
                <input
                  id="ai-base-url-input"
                  type="text"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  placeholder={currentPreset.defaultBaseUrl || 'http://localhost:11434/v1'}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
                {provider === 'ollama' && (
                  <div className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2 font-mono">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Run local: <code className="text-emerald-300">ollama run deepseek-r1</code></span>
                  </div>
                )}
              </div>
            )}

            {/* Model Selection */}
            {provider !== 'ast-only' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  {t.aiSettings.modelLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentPreset.availableModels.map((m) => {
                    const isSelected = model === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setModel(m.id)}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 font-medium'
                            : 'bg-slate-950/50 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-semibold text-slate-200 truncate">{m.label}</div>
                          {m.description && (
                            <div className="text-[10px] text-slate-400 truncate">{m.description}</div>
                          )}
                        </div>
                        {m.tag && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-500/20 shrink-0 font-mono">
                            {m.tag}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Custom model input if 'custom' selected or for custom provider */}
                {(model === 'custom' || provider === 'custom') && (
                  <div className="pt-2">
                    <input
                      id="custom-model-input"
                      type="text"
                      value={customModel}
                      onChange={(e) => setCustomModel(e.target.value)}
                      placeholder={t.aiSettings.customModelPlaceholder}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Offline AST Engine Notice */}
            {provider === 'ast-only' && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {t.aiSettings.offlineModeNotice}
                </div>
                <p className="text-[11px] text-emerald-400/80 leading-relaxed">
                  Converts pipeline syntax using deterministic AST grammar parsers, variable mapping tables, and equivalence matrices without making any external network or AI model calls.
                </p>
              </div>
            )}

            {/* Advanced Settings Accordion */}
            {provider !== 'ast-only' && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium transition"
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Advanced Parameters</span>
                  <span className="text-[10px] text-slate-500">
                    ({showAdvanced ? 'Hide' : 'Temperature & Prompt tuning'})
                  </span>
                </button>

                {showAdvanced && (
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3 animate-in fade-in duration-150">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <label className="text-slate-300 font-medium">{t.aiSettings.temperatureLabel}</label>
                        <span className="font-mono text-indigo-400 text-xs font-semibold">{temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        {t.aiSettings.temperatureHelp}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Test Connection Banner */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in duration-200 ${
                  testResult.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-slate-200">
                    {testResult.success ? 'Connection Verified' : 'Connection Error'}
                  </div>
                  <p className="text-[11px] mt-0.5 leading-relaxed">
                    {testResult.message || testResult.error}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="reset-ai-config-btn"
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-3 py-2 rounded-xl transition"
            >
              {t.aiSettings.resetDefaults}
            </button>
            <button
              id="test-ai-connection-btn"
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="text-xs text-indigo-300 hover:text-indigo-200 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? t.aiSettings.testing : t.aiSettings.testConnection}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="cancel-ai-settings-btn"
              type="button"
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              id="save-ai-settings-btn"
              type="button"
              onClick={handleSave}
              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-5 py-2 rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>{t.aiSettings.savedNotice}</span>
                </>
              ) : (
                <span>{t.aiSettings.saveConfig}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
