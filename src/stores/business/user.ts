import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authApi, type AuthSession, type AuthTokens, type OidcUserInfo } from '@/api/auth'
import { AUTH_CONFIG, getAuthRedirectUri, getAuthorizeUrl } from '@/config/auth'
import { SystemCacheKey } from '@/types'
import { systemCache } from '@/utils/cache'

export interface UserInfo {
  id: string
  sub?: string
  name: string
  avatar?: string
  email?: string
  preferredUsername?: string
  emailVerified?: boolean
  roles?: string[]
  permissions?: string[]
  raw?: OidcUserInfo
}

function normalizeUserInfo(userInfo: OidcUserInfo): UserInfo {
  return {
    id: userInfo.sub || userInfo.preferred_username || userInfo.email || 'unknown',
    sub: userInfo.sub,
    name: userInfo.name || userInfo.preferred_username || userInfo.email || '未命名用户',
    avatar: userInfo.picture || undefined,
    email: userInfo.email,
    preferredUsername: userInfo.preferred_username,
    emailVerified: userInfo.email_verified,
    roles: Array.isArray(userInfo.roles) ? userInfo.roles : [],
    permissions: Array.isArray(userInfo.permissions) ? userInfo.permissions : [],
    raw: userInfo,
  }
}

function randomState(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (value) => chars[value % chars.length]).join('')
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const token = ref('')
  const refreshToken = ref('')
  const idToken = ref('')
  const tokenExpiresAt = ref<number | null>(null)
  const refreshPromise = ref<Promise<string> | null>(null)

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  const userName = computed(() => userInfo.value?.name || '')
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  const userRoles = computed(() => userInfo.value?.roles || [])
  const userPermissions = computed(() => userInfo.value?.permissions || [])
  const shouldRefreshToken = computed(() => {
    if (!tokenExpiresAt.value) {
      return false
    }

    return tokenExpiresAt.value - Date.now() <= AUTH_CONFIG.refreshAheadMs
  })

  function applyTokens(tokens: AuthTokens) {
    token.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken || ''
    idToken.value = tokens.idToken || ''
    tokenExpiresAt.value = tokens.expiresAt || null

    systemCache.set(SystemCacheKey.TOKEN, token.value)

    if (refreshToken.value) {
      systemCache.set(SystemCacheKey.REFRESH_TOKEN, refreshToken.value)
    } else {
      systemCache.remove(SystemCacheKey.REFRESH_TOKEN)
    }

    if (idToken.value) {
      systemCache.set(SystemCacheKey.ID_TOKEN, idToken.value)
    } else {
      systemCache.remove(SystemCacheKey.ID_TOKEN)
    }

    if (tokenExpiresAt.value) {
      systemCache.set(SystemCacheKey.TOKEN_EXPIRES_AT, tokenExpiresAt.value)
    } else {
      systemCache.remove(SystemCacheKey.TOKEN_EXPIRES_AT)
    }
  }

  function applyUserInfo(profile: OidcUserInfo) {
    userInfo.value = normalizeUserInfo(profile)
    systemCache.set(SystemCacheKey.USER_INFO, userInfo.value)
  }

  async function syncSession(session: AuthSession) {
    applyTokens(session.tokens)

    const hasUsableUserInfo =
      !!session.userInfo &&
      !!(session.userInfo.name || session.userInfo.preferred_username || session.userInfo.email)

    if (hasUsableUserInfo) {
      applyUserInfo(session.userInfo)
      return
    }

    const profile = await authApi.getUserInfo(session.tokens.accessToken)
    applyUserInfo(profile)
  }

  function initFromStorage() {
    token.value = systemCache.get<string>(SystemCacheKey.TOKEN) || ''
    refreshToken.value = systemCache.get<string>(SystemCacheKey.REFRESH_TOKEN) || ''
    idToken.value = systemCache.get<string>(SystemCacheKey.ID_TOKEN) || ''
    tokenExpiresAt.value = systemCache.get<number>(SystemCacheKey.TOKEN_EXPIRES_AT)
    userInfo.value = systemCache.get<UserInfo>(SystemCacheKey.USER_INFO)
  }

  async function startLogin(payload: { username: string; password: string; redirect?: string }) {
    const state = randomState()
    const redirect = payload.redirect || '/'

    systemCache.set(SystemCacheKey.OIDC_STATE, state, { expire: 10 * 60 * 1000 })
    systemCache.set(SystemCacheKey.OIDC_REDIRECT, redirect, { expire: 10 * 60 * 1000 })

    await authApi.login({
      username: payload.username,
      password: payload.password,
    })

    window.location.href = getAuthorizeUrl(state)
  }

  async function handleCallback(code: string, state: string) {
    const cachedState = systemCache.get<string>(SystemCacheKey.OIDC_STATE)
    const redirect = systemCache.get<string>(SystemCacheKey.OIDC_REDIRECT) || '/'

    if (!cachedState || cachedState !== state) {
      throw new Error('登录状态校验失败，请重新发起登录')
    }

    const session = await authApi.exchangeCode({
      code,
      redirectUri: getAuthRedirectUri(),
    })

    await syncSession(session)

    systemCache.remove(SystemCacheKey.OIDC_STATE)
    systemCache.remove(SystemCacheKey.OIDC_REDIRECT)

    return redirect
  }

  async function refreshAccessToken(force = false) {
    if (!refreshToken.value) {
      throw new Error('缺少 refresh token，无法刷新登录状态')
    }

    if (!force && !shouldRefreshToken.value && token.value) {
      return token.value
    }

    if (refreshPromise.value) {
      return refreshPromise.value
    }

    refreshPromise.value = authApi
      .refreshToken({ refreshToken: refreshToken.value })
      .then(async (session) => {
        await syncSession(session)
        return token.value
      })
      .finally(() => {
        refreshPromise.value = null
      })

    return refreshPromise.value
  }

  async function fetchUserInfo() {
    const profile = await authApi.getUserInfo()
    applyUserInfo(profile)
    return userInfo.value
  }

  function clearSession() {
    userInfo.value = null
    token.value = ''
    refreshToken.value = ''
    idToken.value = ''
    tokenExpiresAt.value = null
    refreshPromise.value = null
    systemCache.clearAuth()
  }

  async function logout(options: { redirectToLogin?: boolean; callApi?: boolean } = {}) {
    const { redirectToLogin = false, callApi = true } = options

    try {
      if (callApi && (refreshToken.value || idToken.value)) {
        await authApi.logout(refreshToken.value || undefined, idToken.value || undefined)
      }
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      clearSession()
    }

    if (redirectToLogin) {
      const currentPath = window.location.pathname + window.location.search
      const target = `${AUTH_CONFIG.loginPath}?redirect=${encodeURIComponent(currentPath || '/')}`
      window.location.href = target
    }
  }

  function hasPermission(permission: string) {
    return userPermissions.value.includes(permission)
  }

  function hasRole(role: string) {
    return userRoles.value.includes(role)
  }

  return {
    userInfo,
    token,
    refreshToken,
    idToken,
    tokenExpiresAt,
    isLoggedIn,
    userName,
    userAvatar,
    userRoles,
    userPermissions,
    shouldRefreshToken,
    initFromStorage,
    startLogin,
    handleCallback,
    refreshAccessToken,
    fetchUserInfo,
    logout,
    clearSession,
    hasPermission,
    hasRole,
  }
})
