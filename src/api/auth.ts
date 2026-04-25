import { AUTH_CONFIG, getAuthLoginUrl, getAuthRedirectUri, getAuthServiceUrl } from '@/config/auth'

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  idToken?: string
  tokenType?: string
  scope?: string
  expiresIn?: number
  expiresAt?: number
}

export interface OidcUserInfo {
  sub: string
  name?: string
  email?: string
  preferred_username?: string
  picture?: string | null
  email_verified?: boolean
  roles?: string[]
  permissions?: string[]
  [key: string]: unknown
}

export interface AuthSession {
  tokens: AuthTokens
  userInfo?: OidcUserInfo
}

export interface LoginPayload {
  username: string
  password: string
}

interface CallbackPayload {
  code: string
  redirectUri?: string
}

interface RefreshPayload {
  refreshToken: string
}

function firstDefined<T>(...values: Array<T | undefined | null>): T | undefined {
  return values.find((value) => value !== undefined && value !== null)
}

function normalizeTokens(payload: Record<string, any>): AuthTokens {
  const expiresIn = Number(firstDefined(payload.expires_in, payload.expiresIn) || 0)
  const explicitExpiresAt = Number(firstDefined(payload.expires_at, payload.expiresAt) || 0)

  return {
    accessToken: String(
      firstDefined(payload.access_token, payload.accessToken, payload.token, payload.jwt) || ''
    ),
    refreshToken: firstDefined(payload.refresh_token, payload.refreshToken) || undefined,
    idToken: firstDefined(payload.id_token, payload.idToken) || undefined,
    tokenType: firstDefined(payload.token_type, payload.tokenType, 'Bearer') || 'Bearer',
    scope: firstDefined(payload.scope, payload.scopes) || undefined,
    expiresIn: expiresIn > 0 ? expiresIn : undefined,
    expiresAt:
      explicitExpiresAt > 0
        ? explicitExpiresAt
        : expiresIn > 0
          ? Date.now() + expiresIn * 1000
          : undefined,
  }
}

function normalizeSession(payload: any): AuthSession {
  const raw = payload?.data ?? payload
  const tokenSource = raw?.tokens ?? raw?.tokenSet ?? raw
  const tokens = normalizeTokens(tokenSource)

  return {
    tokens,
    userInfo: firstDefined(raw?.userInfo, raw?.userinfo, raw?.user, raw?.profile),
  }
}

async function readJsonResponse(response: Response) {
  return response.json().catch(() => null)
}

function isSuccessCode(code: unknown) {
  return code === 200 || code === '200'
}

async function postAuthJson<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(getAuthServiceUrl(path), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const result = await readJsonResponse(response)

  if (!response.ok || (result?.code !== undefined && !isSuccessCode(result.code))) {
    throw new Error(result?.message || '认证请求失败')
  }

  return (result?.data ?? result) as T
}

export const authApi = {
  async login(payload: LoginPayload): Promise<void> {
    const body = new URLSearchParams({
      username: payload.username,
      password: payload.password,
    })

    const response = await fetch(getAuthLoginUrl(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const result = await response.json().catch(() => null)

    if (!response.ok || !isSuccessCode(result?.code)) {
      throw new Error(result?.message || '登录失败，请检查用户名和密码')
    }
  },

  async exchangeCode(payload: CallbackPayload): Promise<AuthSession> {
    const response = await postAuthJson<AuthSession>(AUTH_CONFIG.endpoints.callback, {
      code: payload.code,
      redirect_uri: payload.redirectUri || getAuthRedirectUri(),
      redirectUri: payload.redirectUri || getAuthRedirectUri(),
    })

    return normalizeSession(response)
  },

  async refreshToken(payload: RefreshPayload): Promise<AuthSession> {
    const response = await postAuthJson<AuthSession>(AUTH_CONFIG.endpoints.refresh, {
      refresh_token: payload.refreshToken,
      refreshToken: payload.refreshToken,
    })

    return normalizeSession(response)
  },

  async getUserInfo(accessToken?: string): Promise<OidcUserInfo> {
    const response = await fetch(getAuthServiceUrl(AUTH_CONFIG.endpoints.userinfo), {
      method: 'GET',
      credentials: 'include',
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    })

    const result = await readJsonResponse(response)

    if (!response.ok || (result?.code !== undefined && !isSuccessCode(result.code))) {
      throw new Error(result?.message || '获取用户信息失败')
    }

    return (result?.data ?? result) as OidcUserInfo
  },

  async logout(refreshToken?: string, idToken?: string): Promise<void> {
    await postAuthJson(AUTH_CONFIG.endpoints.sessionLogout, {
      refresh_token: refreshToken,
      refreshToken,
      id_token: idToken,
      idToken,
    })
  },
}
