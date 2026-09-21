export type AIProviderId =
  | 'gemini'
  | 'openai'
  | 'anthropic'
  | 'groq'
  | 'deepseek'
  | 'openrouter'
  | 'ollama'
  | 'custom'
  | 'ast-only';

export interface AIProviderConfig {
  provider: AIProviderId;
  model: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  useCustomKey?: boolean;
}

export interface ModelOption {
  id: string;
  label: string;
  tag?: string;
  description?: string;
}

export interface AIProviderPreset {
  id: AIProviderId;
  name: string;
  company: string;
  badge?: string;
  description: string;
  defaultModel: string;
  availableModels: ModelOption[];
  requiresApiKey: boolean;
  canUseBuiltinKey?: boolean;
  defaultBaseUrl?: string;
  keyPlaceholder?: string;
  docUrl?: string;
}

export interface TestConnectionResponse {
  success: boolean;
  message?: string;
  latencyMs?: number;
  model?: string;
  error?: string;
}
