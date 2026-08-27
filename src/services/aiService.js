const AI_KEY = 'kifu.openai.apiKey';

export function getAiApiKey() {
  return typeof window === 'undefined' ? '' : window.localStorage.getItem(AI_KEY) || '';
}

export function saveAiApiKey(value) {
  if (typeof window !== 'undefined') window.localStorage.setItem(AI_KEY, value.trim());
}

export function clearAiApiKey() {
  if (typeof window !== 'undefined') window.localStorage.removeItem(AI_KEY);
}

export async function testAiConnection(value) {
  const response = await fetch('https://api.openai.com/v1/models', { headers: { Authorization: `Bearer ${value.trim()}` } });
  if (!response.ok) throw new Error(`AI connection failed (${response.status})`);
  return true;
}
