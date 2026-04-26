import { APP_CONFIG } from '@/config'

const DEFAULT_AUTH_ENTRY_URL = 'http://localhost:48081/auth'
const DEFAULT_SCOPES = ['openid', 'profile', 'email', 'read', 'write']

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

function toBrowserBaseUrl(entryUrl: string) {
  const normalized = trimTrailingSlash(entryUrl)

  if (normalized.startsWith('/')) {
    return normalized || '/auth'
  }

  try {
    const url = new URL(normalized)
    return trimTrailingSlash(url.pathname) || '/'
  } catch {
    return '/auth'
  }
}

const authEntryUrl = trimTrailingSlash(
  import.meta.env.VITE_AUTH_ENTRY_URL || import.meta.env.VITE_AUTH_ISSUER || DEFAULT_AUTH_ENTRY_URL
)

export const AUTH_CONFIG = {
  entryUrl: authEntryUrl,
  issuer: authEntryUrl,
  browserBaseUrl: toBrowserBaseUrl(authEntryUrl),
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID || 'web-app',
  scopes: (import.meta.env.VITE_AUTH_SCOPES || DEFAULT_SCOPES.join(' '))
    .split(/\s+/)
    .filter(Boolean),
  callbackPath: import.meta.env.VITE_AUTH_CALLBACK_PATH || '/callback',
  loginPath: import.meta.env.VITE_AUTH_LOGIN_PATH || '/login',
  refreshAheadMs: Number(import.meta.env.VITE_AUTH_REFRESH_AHEAD_MS || 5 * 60 * 1000),
  apiBaseUrl: APP_CONFIG.API_BASE_URL,
  endpoints: {
    login: import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/login',
    logout: import.meta.env.VITE_AUTH_SERVER_LOGOUT_ENDPOINT || '/logout',
    authorize: import.meta.env.VITE_AUTH_AUTHORIZE_ENDPOINT || '/oauth2/authorize',
    userinfo: import.meta.env.VITE_AUTH_USERINFO_ENDPOINT || '/me',
    callback: import.meta.env.VITE_AUTH_CALLBACK_ENDPOINT || '/callback',
    refresh: import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || '/refresh',
    sessionLogout: import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || '/session/logout',
  },
} as const

export function getAuthRedirectUri() {
  return `${window.location.origin}${AUTH_CONFIG.callbackPath}`
}

export function getAuthorizeUrl(state: string) {
  const search = new URLSearchParams({
    response_type: 'code',
    client_id: AUTH_CONFIG.clientId,
    redirect_uri: getAuthRedirectUri(),
    scope: AUTH_CONFIG.scopes.join(' '),
    state,
  })

  return `${AUTH_CONFIG.browserBaseUrl}${AUTH_CONFIG.endpoints.authorize}?${search.toString()}`
}

export function getAuthLoginUrl() {
  return `${AUTH_CONFIG.browserBaseUrl}${AUTH_CONFIG.endpoints.login}`
}

export function getAuthServiceUrl(path: string) {
  return `${AUTH_CONFIG.browserBaseUrl}${path}`
}
