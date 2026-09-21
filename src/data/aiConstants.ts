import { AIProviderConfig, AIProviderPreset } from '../types/ai';

export const AI_PROVIDER_PRESETS: AIProviderPreset[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    company: 'Google',
    badge: 'Default / Fast',
    description: 'Native Google AI with high-speed reasoning, 1M+ token context, and strict schema adherence.',
    defaultModel: 'gemini-3.8-flash',
    canUseBuiltinKey: true,
    requiresApiKey: false,
    keyPlaceholder: 'AIzaSy... (Leave empty to use built-in system key)',
    docUrl: 'https://aistudio.google.com/app/apikey',
    availableModels: [
      { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', tag: 'Recommended', description: 'Lowest latency, high code comprehension' },
      { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite', tag: 'High Quota', description: 'Extremely lightweight, resilient to rate limits' },
      { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro', tag: 'Deep Logic', description: 'Advanced reasoning for complex legacy pipelines' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    company: 'OpenAI',
    badge: 'Industry Standard',
    description: 'GPT-4o, GPT-4o-mini, and o-series reasoning models for state-of-the-art software translation.',
    defaultModel: 'gpt-4o',
    requiresApiKey: true,
    keyPlaceholder: 'sk-proj-...',
    docUrl: 'https://platform.openai.com/api-keys',
    availableModels: [
      { id: 'gpt-4o', label: 'GPT-4o', tag: 'Flagship', description: 'Omni model with deep DevOps understanding' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', tag: 'Fast & Cheap', description: 'Ultra-fast, cost-effective for CI/CD syntax' },
      { id: 'o3-mini', label: 'o3-mini', tag: 'Reasoning', description: 'High-speed reasoning for intricate pipeline graphs' },
      { id: 'o1', label: 'o1', tag: 'Deep Research', description: 'Advanced step-by-step logic for legacy Groovy & Jenkins' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    company: 'Anthropic',
    badge: 'Code Specialist',
    description: 'Claude 3.7 Sonnet & 3.5 Sonnet known for exceptional code generation and syntactic precision.',
    defaultModel: 'claude-3-7-sonnet-latest',
    requiresApiKey: true,
    keyPlaceholder: 'sk-ant-api03-...',
    docUrl: 'https://console.anthropic.com/settings/keys',
    availableModels: [
      { id: 'claude-3-7-sonnet-latest', label: 'Claude 3.7 Sonnet', tag: 'Latest', description: 'Hybrid thinking model with premier coding prowess' },
      { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet', tag: 'Industry Lead', description: 'Standard benchmark for code refactoring and AST parity' },
      { id: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku', tag: 'Ultra-Fast', description: 'Sub-second translation speed' },
      { id: 'claude-3-opus-latest', label: 'Claude 3 Opus', tag: 'Deep Analysis', description: 'Exhaustive verification of security & env vars' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq Cloud',
    company: 'Groq',
    badge: '800+ tokens/sec',
    description: 'LPU inference engine delivering lightning-fast turnaround times on open-weights models.',
    defaultModel: 'llama-3.3-70b-versatile',
    requiresApiKey: true,
    keyPlaceholder: 'gsk_...',
    docUrl: 'https://console.groq.com/keys',
    availableModels: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', tag: 'Best Quality', description: 'Meta Llama 3.3 with 128k context' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', tag: 'Instantaneous', description: 'Blazing speed under 200ms' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', tag: 'MoE', description: 'High-throughput mixture of experts' },
    ],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    company: 'DeepSeek',
    badge: 'Top Coding Tier',
    description: 'DeepSeek V3 and R1 reasoning engines built specifically for code comprehension and math.',
    defaultModel: 'deepseek-chat',
    requiresApiKey: true,
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    keyPlaceholder: 'sk-...',
    docUrl: 'https://platform.deepseek.com/api_keys',
    availableModels: [
      { id: 'deepseek-chat', label: 'DeepSeek V3 (Chat)', tag: 'Recommended', description: 'Top coding benchmarks and YAML generation' },
      { id: 'deepseek-reasoner', label: 'DeepSeek R1 (Reasoner)', tag: 'Chain of Thought', description: 'Explains complex pipeline stage migrations' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    company: 'OpenRouter',
    badge: 'Multi-Model Hub',
    description: 'Access 200+ models with one unified API key across all global AI providers.',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    requiresApiKey: true,
    defaultBaseUrl: 'https://openrouter.ai/api/v1',
    keyPlaceholder: 'sk-or-v1-...',
    docUrl: 'https://openrouter.ai/keys',
    availableModels: [
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet (via OpenRouter)', tag: 'Premium' },
      { id: 'openai/gpt-4o', label: 'OpenAI GPT-4o (via OpenRouter)', tag: 'Standard' },
      { id: 'deepseek/deepseek-r1', label: 'DeepSeek R1 (via OpenRouter)', tag: 'Reasoner' },
      { id: 'meta-llama/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (via OpenRouter)', tag: 'Fast' },
      { id: 'google/gemini-2.5-pro', label: 'Gemini 2.5 Pro (via OpenRouter)', tag: 'Deep Logic' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama / Local LLM',
    company: 'Local Self-Hosted',
    badge: '100% Private / Offline',
    description: 'Run completely on your local workstation or company network with zero external data sharing.',
    defaultModel: 'deepseek-r1',
    requiresApiKey: false,
    defaultBaseUrl: 'http://localhost:11434/v1',
    keyPlaceholder: 'Optional (Bearer token if reverse proxy is used)',
    docUrl: 'https://ollama.com/',
    availableModels: [
      { id: 'deepseek-r1', label: 'deepseek-r1', tag: 'Local Reasoning' },
      { id: 'qwen2.5-coder:7b', label: 'qwen2.5-coder:7b', tag: 'DevOps & Code' },
      { id: 'llama3.3', label: 'llama3.3', tag: 'General' },
      { id: 'mistral', label: 'mistral', tag: 'Compact' },
      { id: 'custom', label: 'Custom Installed Model...', tag: 'Manual Input' },
    ],
  },
  {
    id: 'custom',
    name: 'Custom OpenAI-Compatible API',
    company: 'Enterprise / Custom',
    badge: 'vLLM / LM Studio / Azure',
    description: 'Connect any enterprise gateway, internal proxy, LM Studio, vLLM, or Azure OpenAI endpoint.',
    defaultModel: 'custom-model',
    requiresApiKey: false,
    defaultBaseUrl: 'http://localhost:8000/v1',
    keyPlaceholder: 'Bearer token or custom API key (optional)',
    availableModels: [
      { id: 'custom-model', label: 'Custom Model ID', tag: 'Configurable' },
    ],
  },
  {
    id: 'ast-only',
    name: 'Deterministic AST Engine',
    company: 'Built-in Rules Engine',
    badge: 'No AI / Instantaneous',
    description: 'Deterministic grammar & syntax tree translation without any neural network or network calls.',
    defaultModel: 'ast-parser-v2',
    requiresApiKey: false,
    availableModels: [
      { id: 'ast-parser-v2', label: 'AST High-Fidelity Rule Parser', tag: 'Zero Latency' },
    ],
  },
];

const LOCAL_STORAGE_AI_KEY = 'devops_migrator_ai_config_v1';

export const DEFAULT_AI_CONFIG: AIProviderConfig = {
  provider: 'gemini',
  model: 'gemini-3.8-flash',
  temperature: 0.1,
  useCustomKey: false,
};

export function loadSavedAIConfig(): AIProviderConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AI_KEY);
    if (!raw) return DEFAULT_AI_CONFIG;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_AI_CONFIG, ...parsed };
  } catch {
    return DEFAULT_AI_CONFIG;
  }
}

export function saveAIConfig(config: AIProviderConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_AI_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save AI configuration:', err);
  }
}
