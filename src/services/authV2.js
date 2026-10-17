/**
 * Login V2 — allauth headless (browser client) wrapper.
 * Contract: ~/domaap-tools/login_v2/ENDPOINTS.md (captured 17 Oct 2026).
 * Every call sends cookies; every write echoes the csrftoken cookie as X-CSRFToken.
 * Enabled per environment with NEXT_PUBLIC_LOGIN_V2=true; V1 is untouched when off.
 */
import api, { clearAdminCookies } from './api';
const { API_BASE_URL } = api;

const ALLAUTH_BASE = `${API_BASE_URL.replace(/\/api\/?$/, '')}/api/_allauth/browser/v1`;

export function isLoginV2Enabled() {
  return process.env.NEXT_PUBLIC_LOGIN_V2 === 'true';
}

function readCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

async function request(method, path, body) {
  const headers = { Accept: 'application/json' };
  if (method !== 'GET') {
    headers['Content-Type'] = 'application/json';
    headers['X-CSRFToken'] = readCookie('csrftoken') || '';
  }
  const res = await fetch(`${ALLAUTH_BASE}${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = null;
  try { json = await res.json(); } catch { /* 204 or non-JSON */ }
  return { status: res.status, body: json };
}

/** First GET also plants the csrftoken cookie, so call this before any POST on a fresh page. */
export async function getSession() {
  return request('GET', '/auth/session');
}

async function ensureCsrf() {
  if (!readCookie('csrftoken')) await getSession();
}

export async function login(email, password) {
  await ensureCsrf();
  return request('POST', '/auth/login', { email, password });
}

export async function authenticate2fa(code) {
  return request('POST', '/auth/2fa/authenticate', { code });
}

/** allauth answers logout with 401 ("now anonymous") — that is success. */
export async function logoutV2() {
  const res = await request('DELETE', '/auth/session');
  clearAdminCookies();
  return res.status === 401 || res.status === 200;
}

export async function getAuthenticators()  { return request('GET', '/account/authenticators'); }
export async function getTotp()            { return request('GET', '/account/authenticators/totp'); }
export async function activateTotp(code)   { return request('POST', '/account/authenticators/totp', { code }); }
export async function getRecoveryCodes()   { return request('GET', '/account/authenticators/recovery-codes'); }

/** True when the login POST says "password accepted, second step pending". */
export function isMfaPending(body) {
  return (body?.data?.flows || []).some((f) => f.id === 'mfa_authenticate' && f.is_pending);
}

/** allauth errors[] → { fieldName: message } for inline display. */
export function fieldErrors(body) {
  return (body?.errors || []).reduce((acc, e) => {
    acc[e.param || '_'] = e.message;
    return acc;
  }, {});
}
