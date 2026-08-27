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

export async function analyzeMoveWithAi({ board, size, move, captured }) {
  const key = getAiApiKey();
  if (!key) return null;
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-5.4',
      store: false,
      instructions: 'You are a friendly Go teacher. Explain one move in plain English in no more than two short sentences. Do not invent a best move or numeric evaluation. Focus on liberties, captures, shape, and the next reading question.',
      input: `Board size: ${size}x${size}. Board array, row-major, null/black/white: ${JSON.stringify(board)}. Move played: ${move.player} at intersection index ${move.index}. Captured stones: ${captured.length}. Explain what the learner should notice next.`,
      text: { verbosity: 'low' }
    })
  });
  if (!response.ok) throw new Error(`AI analysis failed (${response.status})`);
  const data = await response.json();
  return data.output_text || data.output?.flatMap((item) => item.content || []).find((part) => part.type === 'output_text')?.text || null;
}
