export function extractCleanErrorMessage(err: any): { isQuota: boolean; isAuth: boolean; message: string } {
  const raw = typeof err === 'string' ? err : err?.message || String(err || '');

  // Check if raw contains a JSON error object from GoogleGenAI / external API
  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (
        parsed.error?.code === 429 ||
        parsed.error?.status === 'RESOURCE_EXHAUSTED' ||
        parsed.error?.message?.includes('quota') ||
        parsed.error?.message?.includes('exceeded your current quota')
      ) {
        return {
          isQuota: true,
          isAuth: false,
          message: 'Gemini free tier request quota reached. Generated using offline AST Deterministic Engine.',
        };
      }
      if (parsed.error?.message) {
        const firstLine = parsed.error.message.split('\n')[0].trim();
        return {
          isQuota: false,
          isAuth: parsed.error?.code === 401 || parsed.error?.code === 403,
          message: firstLine.length > 120 ? firstLine.slice(0, 117) + '...' : firstLine,
        };
      }
    }
  } catch {
    // ignore parse failure
  }

  if (
    raw.includes('429') ||
    raw.includes('RESOURCE_EXHAUSTED') ||
    raw.includes('Quota exceeded') ||
    raw.includes('quota') ||
    raw.includes('rate limit')
  ) {
    return {
      isQuota: true,
      isAuth: false,
      message: 'API rate/quota limit reached. Generated using offline AST Deterministic Engine.',
    };
  }

  if (raw.includes('401') || raw.includes('403') || raw.includes('API key') || raw.includes('Unauthorized')) {
    return {
      isQuota: false,
      isAuth: true,
      message: 'API key not configured or unauthorized. Generated using offline AST Deterministic Engine.',
    };
  }

  const clean = raw.split('\n')[0].replace(/\{.*?\}/g, '').trim();
  return {
    isQuota: false,
    isAuth: false,
    message: clean.length > 120 ? clean.slice(0, 117) + '...' : clean || 'AI provider unavailable',
  };
}
