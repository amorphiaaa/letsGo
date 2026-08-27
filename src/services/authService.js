const ACCOUNTS_KEY = 'kifu.accounts';
const SESSION_KEY = 'kifu.session';

function readAccounts() {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch { return []; }
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function registerAccount(nickname, password) {
  const normalized = nickname.trim().toLowerCase();
  const accounts = readAccounts();
  if (accounts.some((account) => account.nickname === normalized)) throw new Error('nickname_taken');
  const profile = { nickname: nickname.trim(), passwordHash: await hashPassword(password), createdAt: new Date().toISOString() };
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, { nickname: normalized, nicknameDisplay: profile.nickname, passwordHash: profile.passwordHash, createdAt: profile.createdAt }]));
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ nickname: profile.nickname, createdAt: profile.createdAt }));
  return profile;
}

export async function loginAccount(nickname, password) {
  const normalized = nickname.trim().toLowerCase();
  const account = readAccounts().find((entry) => entry.nickname === normalized);
  if (!account || account.passwordHash !== await hashPassword(password)) throw new Error('invalid_credentials');
  const session = { nickname: account.nicknameDisplay || nickname.trim(), createdAt: account.createdAt };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function getSession() {
  if (typeof window === 'undefined') return null;
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; }
}

export function clearSession() { if (typeof window !== 'undefined') window.localStorage.removeItem(SESSION_KEY); }
