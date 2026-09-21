import { GoogleGenAI, Type } from '@google/genai';
import { AIProviderConfig, TestConnectionResponse } from '../src/types/ai';
import { PipelineFormat, SingleConversionResult } from '../src/types/pipeline';
import { getFilenameForFormat, fallbackConvertPipeline } from './converter';
import { extractCleanErrorMessage } from './errorUtils';

// Robust JSON extractor that handles markdown wrappers (```json ... ```) or conversational wrappers
function parseModelJsonResponse(rawText: string): any {
  if (!rawText) throw new Error('Empty response received from AI model');
  const cleaned = rawText.trim();
  
  // Try extracting from ```json ... ``` or ``` ... ```
  const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // Fall through to brace extraction
    }
  }

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Try finding the outermost '{' and '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
    }
    throw new Error('Unable to extract valid JSON payload from AI response');
  }
}

// Prompt generator for a single target format
function buildSinglePrompt(sourceCode: string, sourceFormat: PipelineFormat, targetFormat: PipelineFormat): string {
  return `You are a Senior Principal DevOps & Platform Engineer specializing in CI/CD migrations.
Convert the following ${sourceFormat.toUpperCase()} pipeline code into idiomatic, modern, production-grade ${targetFormat.toUpperCase()} pipeline format.

Source Pipeline Format: ${sourceFormat}
Target Pipeline Format: ${targetFormat}
Target filename: ${getFilenameForFormat(targetFormat)}

SOURCE CODE:
\`\`\`
${sourceCode}
\`\`\`

Strict Requirements:
1. Converted code must adhere to current official best practices for ${targetFormat}:
   - For GitHub Actions: Pin major action versions (actions/checkout@v4, actions/upload-artifact@v4, actions/cache@v4), define workflow name, on triggers, permissions, jobs, runs-on, steps.
   - For GitLab CI/CD: Valid .gitlab-ci.yml with stages, jobs with stage, script, before_script, image, artifacts, rules/only.
   - For AWS CodeBuild: Valid buildspec.yml v0.2 with phases (install, pre_build, build, post_build), env vars, artifacts.
   - For GCP Cloud Build: Valid cloudbuild.yaml with steps and official cloud builder images.
   - For Azure DevOps: Valid azure-pipelines.yml with trigger, pool (vmImage), variables, stages/jobs/steps.
   - For Jenkins: Valid Declarative Pipeline syntax with pipeline { agent, environment, stages, steps, post }.
2. Map environment variables and secrets accurately to the target system.
3. Identify any unsupported plugins, legacy constructs, or manual steps needed as migration warnings.
4. Provide a step-by-step equivalence mapping.
5. Provide an objective complexity score (Low, Medium, High, Complex).

You MUST respond ONLY with a raw JSON object (no markdown quotes outside JSON, no commentary) matching this schema:
{
  "convertedCode": "string (the complete converted pipeline file)",
  "filename": "string (e.g. .github/workflows/pipeline.yml, buildspec.yml, Jenkinsfile, etc.)",
  "explanation": "string (architectural overview)",
  "envVarMappings": [
    { "sourceVar": "string", "targetVar": "string", "notes": "string" }
  ],
  "secretMappings": [
    { "sourceSecret": "string", "targetMechanism": "string", "setupInstructions": "string" }
  ],
  "migrationWarnings": [
    { "level": "info|warning|critical", "title": "string", "detail": "string", "actionRequired": "string" }
  ],
  "stepMappings": [
    { "originalStep": "string", "convertedStep": "string", "targetSyntaxNotes": "string" }
  ],
  "complexityScore": "Low|Medium|High|Complex"
}`;
}

// Prompt generator for converting to multiple target formats in one batch
function buildBatchPrompt(sourceCode: string, sourceFormat: PipelineFormat, targetFormats: PipelineFormat[]): string {
  return `You are a Senior Principal DevOps & Platform Engineer specializing in CI/CD migrations.
Translate the following ${sourceFormat.toUpperCase()} pipeline code into multiple target formats in a single pass: ${targetFormats.map((f) => f.toUpperCase()).join(', ')}.

Source Pipeline Format: ${sourceFormat}
Target Formats: ${targetFormats.join(', ')}

SOURCE CODE:
\`\`\`
${sourceCode}
\`\`\`

You MUST respond ONLY with a raw JSON object (no markdown quotes outside JSON, no commentary) matching this schema:
{
  "conversions": {
    ${targetFormats.map((tf) => `"${tf}": {
      "convertedCode": "string",
      "filename": "string",
      "explanation": "string",
      "envVarMappings": [{ "sourceVar": "string", "targetVar": "string", "notes": "string" }],
      "secretMappings": [{ "sourceSecret": "string", "targetMechanism": "string", "setupInstructions": "string" }],
      "migrationWarnings": [{ "level": "info|warning|critical", "title": "string", "detail": "string", "actionRequired": "string" }],
      "stepMappings": [{ "originalStep": "string", "convertedStep": "string", "targetSyntaxNotes": "string" }],
      "complexityScore": "Low|Medium|High|Complex"
    }`).join(',\n    ')}
  }
}`;
}

// ==========================================
// Provider Call Handlers
// ==========================================

async function callOpenAICompatible(
  endpointUrl: string,
  model: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey?: string,
  customHeaders: Record<string, string> = {},
  temperature: number = 0.1
): Promise<string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (apiKey && apiKey.trim()) {
    headers['Authorization'] = `Bearer ${apiKey.trim()}`;
  }

  const payload: any = {
    model: model || 'gpt-4o',
    temperature,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };

  // Enable JSON object response format where appropriate
  if (!endpointUrl.includes('ollama')) {
    payload.response_format = { type: 'json_object' };
  }

  const response = await fetch(endpointUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let msg = `HTTP ${response.status} from ${endpointUrl}`;
    try {
      const parsedErr = JSON.parse(errorBody);
      msg = parsedErr.error?.message || parsedErr.message || msg;
    } catch {
      msg = `${msg}: ${errorBody.slice(0, 160)}`;
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('No content returned in AI response choices');
  }

  return choice.message.content;
}

async function callAnthropic(
  model: string,
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  temperature: number = 0.1
): Promise<string> {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Anthropic API key is required. Please provide your API key in AI Engine settings.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'claude-3-7-sonnet-latest',
      max_tokens: 4096,
      temperature,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    let msg = `HTTP ${response.status} from Anthropic`;
    try {
      const parsed = JSON.parse(errText);
      msg = parsed.error?.message || msg;
    } catch {
      msg = `${msg}: ${errText.slice(0, 160)}`;
    }
    throw new Error(msg);
  }

  const data = await response.json();
  const textContent = data.content?.find((c: any) => c.type === 'text');
  if (!textContent?.text) {
    throw new Error('Anthropic returned an empty message block');
  }

  return textContent.text;
}

async function callGemini(
  model: string,
  prompt: string,
  customApiKey?: string
): Promise<string> {
  const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Gemini API key is not configured.');
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  const requestedModel = model || 'gemini-3.8-flash';

  try {
    const response = await ai.models.generateContent({
      model: requestedModel,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });
    return response.text || '{}';
  } catch (primaryErr: any) {
    const isRateLimit =
      primaryErr?.status === 429 ||
      String(primaryErr?.message || '').includes('429') ||
      String(primaryErr?.message || '').includes('quota') ||
      String(primaryErr?.message || '').includes('RESOURCE_EXHAUSTED');

    // If gemini-3.8-flash hits rate limits, try gemini-3.1-flash-lite which has separate quota pool
    if (isRateLimit && requestedModel !== 'gemini-3.1-flash-lite') {
      try {
        console.log(`[AI Dispatcher] Gemini '${requestedModel}' rate limited (429). Trying 'gemini-3.1-flash-lite'...`);
        const fallbackResp = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });
        return fallbackResp.text || '{}';
      } catch (secondaryErr: any) {
        throw secondaryErr;
      }
    }

    throw primaryErr;
  }
}

// ==========================================
// Test Connection Endpoint Handler
// ==========================================

export async function testAIConnection(config: AIProviderConfig): Promise<TestConnectionResponse> {
  const start = Date.now();
  const provider = config.provider || 'gemini';

  if (provider === 'ast-only') {
    return {
      success: true,
      latencyMs: 1,
      model: 'AST Deterministic Parser',
      message: 'Deterministic AST engine active. 100% offline, zero latency, zero API keys required.',
    };
  }

  try {
    if (provider === 'gemini') {
      const effectiveKey = (config.useCustomKey && config.apiKey?.trim()) || process.env.GEMINI_API_KEY;
      if (!effectiveKey || effectiveKey === 'MY_GEMINI_API_KEY') {
        return {
          success: false,
          error: 'No Gemini API key found. Enter a custom API key or configure GEMINI_API_KEY.',
        };
      }
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const requestedModel = config.model || 'gemini-3.8-flash';
      try {
        const resp = await ai.models.generateContent({
          model: requestedModel,
          contents: 'Respond with exactly: OK',
        });
        const latencyMs = Date.now() - start;
        return {
          success: true,
          latencyMs,
          model: requestedModel,
          message: `Successfully connected to Google Gemini (${latencyMs}ms). Response: ${resp.text?.trim()?.slice(0, 30)}`,
        };
      } catch (geminiErr: any) {
        const isQuota =
          geminiErr?.status === 429 ||
          String(geminiErr?.message || '').includes('429') ||
          String(geminiErr?.message || '').includes('RESOURCE_EXHAUSTED') ||
          String(geminiErr?.message || '').includes('Quota exceeded');

        if (isQuota && requestedModel !== 'gemini-3.1-flash-lite') {
          try {
            const resp = await ai.models.generateContent({
              model: 'gemini-3.1-flash-lite',
              contents: 'Respond with exactly: OK',
            });
            const latencyMs = Date.now() - start;
            return {
              success: true,
              latencyMs,
              model: 'gemini-3.1-flash-lite',
              message: `Connected via Gemini 3.1 Flash-Lite fallback (${latencyMs}ms). Primary model was rate-limited.`,
            };
          } catch (secondaryErr: any) {
            const clean = extractCleanErrorMessage(secondaryErr);
            return {
              success: false,
              latencyMs: Date.now() - start,
              error: clean.message,
            };
          }
        }
        const clean = extractCleanErrorMessage(geminiErr);
        return {
          success: false,
          latencyMs: Date.now() - start,
          error: clean.message,
        };
      }
    }

    if (provider === 'anthropic') {
      const key = config.apiKey?.trim() || process.env.ANTHROPIC_API_KEY;
      if (!key) {
        return { success: false, error: 'Anthropic API key is required. Please enter your API key.' };
      }
      const text = await callAnthropic(
        config.model || 'claude-3-7-sonnet-latest',
        'You are an API health checker.',
        'Respond with the single word: OK',
        key
      );
      const latencyMs = Date.now() - start;
      return {
        success: true,
        latencyMs,
        model: config.model || 'claude-3-7-sonnet-latest',
        message: `Successfully connected to Anthropic Claude (${latencyMs}ms).`,
      };
    }

    // OpenAI, Groq, DeepSeek, OpenRouter, Ollama, Custom
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let apiKey = config.apiKey?.trim();
    let customHeaders: Record<string, string> = {};

    switch (provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        apiKey = apiKey || process.env.OPENAI_API_KEY;
        if (!apiKey) return { success: false, error: 'OpenAI API key is required. Please enter your sk- key.' };
        break;
      case 'groq':
        endpoint = 'https://api.groq.com/openai/v1/chat/completions';
        apiKey = apiKey || process.env.GROQ_API_KEY;
        if (!apiKey) return { success: false, error: 'Groq API key is required. Please enter your gsk_ key.' };
        break;
      case 'deepseek':
        endpoint = (config.baseUrl || 'https://api.deepseek.com/v1').replace(/\/+$/, '') + '/chat/completions';
        if (!apiKey) return { success: false, error: 'DeepSeek API key is required.' };
        break;
      case 'openrouter':
        endpoint = (config.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '') + '/chat/completions';
        if (!apiKey) return { success: false, error: 'OpenRouter API key is required.' };
        customHeaders['HTTP-Referer'] = 'https://aistudio.google.com';
        customHeaders['X-Title'] = 'DevOps Pipeline Migrator';
        break;
      case 'ollama':
        endpoint = (config.baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '') + '/chat/completions';
        break;
      case 'custom':
        endpoint = (config.baseUrl || 'http://localhost:8000/v1').replace(/\/+$/, '') + '/chat/completions';
        break;
    }

    const text = await callOpenAICompatible(
      endpoint,
      config.model,
      'You are a ping health monitor.',
      'Respond with OK',
      apiKey,
      customHeaders,
      0.1
    );

    const latencyMs = Date.now() - start;
    return {
      success: true,
      latencyMs,
      model: config.model,
      message: `Successfully connected to ${provider.toUpperCase()} (${latencyMs}ms). Response: ${text.trim().slice(0, 30)}`,
    };
  } catch (err: any) {
    const clean = extractCleanErrorMessage(err);
    return {
      success: false,
      latencyMs: Date.now() - start,
      error: clean.message,
    };
  }
}

// ==========================================
// Pipeline Conversion Dispatcher (Single Target)
// ==========================================

export async function convertPipelineWithAnyAI(
  sourceCode: string,
  sourceFormat: PipelineFormat,
  targetFormat: PipelineFormat,
  config?: AIProviderConfig,
  options?: any
): Promise<SingleConversionResult> {
  const provider = config?.provider || 'gemini';

  // 1. If AST deterministic mode is selected
  if (provider === 'ast-only') {
    const res = fallbackConvertPipeline(sourceCode, sourceFormat, targetFormat, options);
    res.aiPowered = false;
    res.fallbackNotice = 'Converted with Deterministic AST Engine (Offline Mode)';
    return res;
  }

  const prompt = buildSinglePrompt(sourceCode, sourceFormat, targetFormat);

  try {
    let rawResponse = '';

    if (provider === 'gemini') {
      const customKey = config?.useCustomKey ? config.apiKey : undefined;
      rawResponse = await callGemini(config?.model || 'gemini-3.8-flash', prompt, customKey);
    } else if (provider === 'anthropic') {
      const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY || '';
      rawResponse = await callAnthropic(
        config?.model || 'claude-3-7-sonnet-latest',
        'You are an expert DevOps engineer who outputs only valid JSON without markdown fences.',
        prompt,
        apiKey,
        config?.temperature
      );
    } else {
      // OpenAI, Groq, DeepSeek, OpenRouter, Ollama, Custom
      let endpoint = 'https://api.openai.com/v1/chat/completions';
      let apiKey = config?.apiKey?.trim();
      let customHeaders: Record<string, string> = {};

      switch (provider) {
        case 'openai':
          endpoint = 'https://api.openai.com/v1/chat/completions';
          apiKey = apiKey || process.env.OPENAI_API_KEY;
          break;
        case 'groq':
          endpoint = 'https://api.groq.com/openai/v1/chat/completions';
          apiKey = apiKey || process.env.GROQ_API_KEY;
          break;
        case 'deepseek':
          endpoint = (config?.baseUrl || 'https://api.deepseek.com/v1').replace(/\/+$/, '') + '/chat/completions';
          break;
        case 'openrouter':
          endpoint = (config?.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '') + '/chat/completions';
          customHeaders['HTTP-Referer'] = 'https://aistudio.google.com';
          customHeaders['X-Title'] = 'DevOps Pipeline Migrator';
          break;
        case 'ollama':
          endpoint = (config?.baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '') + '/chat/completions';
          break;
        case 'custom':
          endpoint = (config?.baseUrl || 'http://localhost:8000/v1').replace(/\/+$/, '') + '/chat/completions';
          break;
      }

      rawResponse = await callOpenAICompatible(
        endpoint,
        config?.model || 'gpt-4o',
        'You are an expert DevOps engineer who outputs only valid JSON without markdown fences.',
        prompt,
        apiKey,
        customHeaders,
        config?.temperature
      );
    }

    const parsed = parseModelJsonResponse(rawResponse);
    return {
      targetFormat,
      filename: parsed.filename || getFilenameForFormat(targetFormat),
      convertedCode: parsed.convertedCode || '',
      explanation: parsed.explanation || '',
      envVarMappings: parsed.envVarMappings || [],
      secretMappings: parsed.secretMappings || [],
      migrationWarnings: parsed.migrationWarnings || [],
      stepMappings: parsed.stepMappings || [],
      complexityScore: parsed.complexityScore || 'Medium',
      aiPowered: true,
      fallbackNotice: undefined,
    };
  } catch (err: any) {
    const clean = extractCleanErrorMessage(err);
    console.log(`[AI Dispatcher] Notice for provider '${provider}': ${clean.message}. Converting with AST Deterministic Engine.`);
    const fallback = fallbackConvertPipeline(sourceCode, sourceFormat, targetFormat, options);
    fallback.aiPowered = false;
    fallback.fallbackNotice = clean.message;
    return fallback;
  }
}

// ==========================================
// Pipeline Conversion Dispatcher (Batch Multi-Target)
// ==========================================

export async function convertAllPipelinesWithAnyAI(
  sourceCode: string,
  sourceFormat: PipelineFormat,
  targetFormats: PipelineFormat[],
  config?: AIProviderConfig,
  options?: any
): Promise<Record<string, SingleConversionResult>> {
  const results: Record<string, SingleConversionResult> = {};
  const provider = config?.provider || 'gemini';

  // 1. If AST deterministic mode is selected
  if (provider === 'ast-only') {
    targetFormats.forEach((tf) => {
      const res = fallbackConvertPipeline(sourceCode, sourceFormat, tf, options);
      res.aiPowered = false;
      res.fallbackNotice = 'Converted with Deterministic AST Engine (Offline Mode)';
      results[tf] = res;
    });
    return results;
  }

  const prompt = buildBatchPrompt(sourceCode, sourceFormat, targetFormats);

  try {
    let rawResponse = '';

    if (provider === 'gemini') {
      const customKey = config?.useCustomKey ? config.apiKey : undefined;
      rawResponse = await callGemini(config?.model || 'gemini-3.8-flash', prompt, customKey);
    } else if (provider === 'anthropic') {
      const apiKey = config?.apiKey || process.env.ANTHROPIC_API_KEY || '';
      rawResponse = await callAnthropic(
        config?.model || 'claude-3-7-sonnet-latest',
        'You are an expert DevOps engineer who outputs only valid JSON without markdown fences.',
        prompt,
        apiKey,
        config?.temperature
      );
    } else {
      let endpoint = 'https://api.openai.com/v1/chat/completions';
      let apiKey = config?.apiKey?.trim();
      let customHeaders: Record<string, string> = {};

      switch (provider) {
        case 'openai':
          endpoint = 'https://api.openai.com/v1/chat/completions';
          apiKey = apiKey || process.env.OPENAI_API_KEY;
          break;
        case 'groq':
          endpoint = 'https://api.groq.com/openai/v1/chat/completions';
          apiKey = apiKey || process.env.GROQ_API_KEY;
          break;
        case 'deepseek':
          endpoint = (config?.baseUrl || 'https://api.deepseek.com/v1').replace(/\/+$/, '') + '/chat/completions';
          break;
        case 'openrouter':
          endpoint = (config?.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, '') + '/chat/completions';
          customHeaders['HTTP-Referer'] = 'https://aistudio.google.com';
          customHeaders['X-Title'] = 'DevOps Pipeline Migrator';
          break;
        case 'ollama':
          endpoint = (config?.baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '') + '/chat/completions';
          break;
        case 'custom':
          endpoint = (config?.baseUrl || 'http://localhost:8000/v1').replace(/\/+$/, '') + '/chat/completions';
          break;
      }

      rawResponse = await callOpenAICompatible(
        endpoint,
        config?.model || 'gpt-4o',
        'You are an expert DevOps engineer who outputs only valid JSON without markdown fences.',
        prompt,
        apiKey,
        customHeaders,
        config?.temperature
      );
    }

    const parsed = parseModelJsonResponse(rawResponse);
    const conversions = parsed.conversions || {};

    targetFormats.forEach((tf) => {
      if (conversions[tf] && conversions[tf].convertedCode) {
        const item = conversions[tf];
        results[tf] = {
          targetFormat: tf,
          filename: item.filename || getFilenameForFormat(tf),
          convertedCode: item.convertedCode,
          explanation: item.explanation || '',
          envVarMappings: item.envVarMappings || [],
          secretMappings: item.secretMappings || [],
          migrationWarnings: item.migrationWarnings || [],
          stepMappings: item.stepMappings || [],
          complexityScore: item.complexityScore || 'Medium',
          aiPowered: true,
          fallbackNotice: undefined,
        };
      } else {
        const fb = fallbackConvertPipeline(sourceCode, sourceFormat, tf, options);
        fb.fallbackNotice = `Batch format ${tf} generated via AST converter.`;
        results[tf] = fb;
      }
    });

    return results;
  } catch (err: any) {
    const clean = extractCleanErrorMessage(err);
    console.log(`[AI Dispatcher] Batch conversion notice for '${provider}': ${clean.message}. Converting all targets via AST Deterministic Engine.`);
    targetFormats.forEach((tf) => {
      const fb = fallbackConvertPipeline(sourceCode, sourceFormat, tf, options);
      fb.aiPowered = false;
      fb.fallbackNotice = clean.message;
      results[tf] = fb;
    });
    return results;
  }
}
