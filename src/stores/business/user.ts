// 导入Vue和Pinia相关功能
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

// 导入认证API和类型定义
import { authApi, type AuthSession, type AuthTokens, type OidcUserInfo } from '@/api/auth'

// 导入认证配置和工具函数
import { AUTH_CONFIG, getAuthRedirectUri, getAuthorizeUrl } from '@/config/auth'

// 导入系统缓存键和缓存工具
import { SystemCacheKey } from '@/types'
import { systemCache } from '@/utils/cache'

// 定义用户信息接口，扩展OIDC用户信息
export interface UserInfo {
  id: string // 用户唯一标识符
  sub?: string // OIDC主题标识符
  name: string // 用户显示名称
  avatar?: string // 用户头像URL
  email?: string // 用户邮箱
  preferredUsername?: string // 首选用户名
  emailVerified?: boolean // 邮箱是否已验证
  roles?: string[] // 用户角色列表
  permissions?: string[] // 用户权限列表
  raw?: OidcUserInfo // 原始OIDC用户信息
}

/**
 * 标准化用户信息，将OIDC用户信息转换为应用内部使用的格式
 * @param userInfo - 原始OIDC用户信息
 * @returns 标准化的UserInfo对象
 */
function normalizeUserInfo(userInfo: OidcUserInfo): UserInfo {
  return {
    // 使用sub作为主要ID，如果没有则使用preferred_username或email
    id: userInfo.sub || userInfo.preferred_username || userInfo.email || 'unknown',
    sub: userInfo.sub,
    // 使用name作为显示名称，如果没有则使用preferred_username或email
    name: userInfo.name || userInfo.preferred_username || userInfo.email || '未命名用户',
    // 头像URL，如果不存在则设为undefined
    avatar: userInfo.picture || undefined,
    email: userInfo.email,
    preferredUsername: userInfo.preferred_username,
    emailVerified: userInfo.email_verified,
    // 确保roles是数组，如果不是则设为空数组
    roles: Array.isArray(userInfo.roles) ? userInfo.roles : [],
    // 确保permissions是数组，如果不是则设为空数组
    permissions: Array.isArray(userInfo.permissions) ? userInfo.permissions : [],
    raw: userInfo,
  }
}

/**
 * 生成随机状态字符串，用于OAuth2流程中的CSRF保护
 * @param length - 状态字符串长度，默认32
 * @returns 随机状态字符串
 */
function randomState(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (value) => chars[value % chars.length]).join('')
}

// 定义用户Store，管理用户认证状态和相关操作
export const useUserStore = defineStore('user', () => {
  // 响应式状态：用户信息
  const userInfo = ref<UserInfo | null>(null)
  // 响应式状态：访问令牌
  const token = ref('')
  // 响应式状态：刷新令牌
  const refreshToken = ref('')
  // 响应式状态：ID令牌
  const idToken = ref('')
  // 响应式状态：令牌过期时间戳
  const tokenExpiresAt = ref<number | null>(null)
  // 响应式状态：刷新令牌的Promise，用于防止重复刷新
  const refreshPromise = ref<Promise<string> | null>(null)

  // 计算属性：用户是否已登录
  const isLoggedIn = computed(() => !!userInfo.value)
  // 计算属性：用户名称
  const userName = computed(() => userInfo.value?.name || '')
  // 计算属性：用户头像
  const userAvatar = computed(() => userInfo.value?.avatar || '')
  // 计算属性：用户角色列表
  const userRoles = computed(() => userInfo.value?.roles || [])
  // 计算属性：用户权限列表
  const userPermissions = computed(() => userInfo.value?.permissions || [])
  // 计算属性：是否应该刷新令牌（在过期前一定时间内）
  const shouldRefreshToken = computed(() => {
    if (!tokenExpiresAt.value) {
      return false
    }

    // 如果距离过期时间小于配置的提前刷新时间，则需要刷新
    return tokenExpiresAt.value - Date.now() <= AUTH_CONFIG.refreshAheadMs
  })

  /**
   * 应用令牌到Store和缓存中
   * @param tokens - 认证令牌对象
   */
  function applyTokens(tokens: AuthTokens) {
    // 更新Store中的令牌状态
    token.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken || ''
    idToken.value = tokens.idToken || ''
    tokenExpiresAt.value = tokens.expiresAt || null

    // 将访问令牌保存到系统缓存
    systemCache.set(SystemCacheKey.TOKEN, token.value)

    // 根据是否有刷新令牌，决定保存或删除缓存
    if (refreshToken.value) {
      systemCache.set(SystemCacheKey.REFRESH_TOKEN, refreshToken.value)
    } else {
      systemCache.remove(SystemCacheKey.REFRESH_TOKEN)
    }

    // 根据是否有ID令牌，决定保存或删除缓存
    if (idToken.value) {
      systemCache.set(SystemCacheKey.ID_TOKEN, idToken.value)
    } else {
      systemCache.remove(SystemCacheKey.ID_TOKEN)
    }

    // 根据是否有过期时间，决定保存或删除缓存
    if (tokenExpiresAt.value) {
      systemCache.set(SystemCacheKey.TOKEN_EXPIRES_AT, tokenExpiresAt.value)
    } else {
      systemCache.remove(SystemCacheKey.TOKEN_EXPIRES_AT)
    }
  }

  /**
   * 应用用户信息到Store和缓存中
   * @param profile - OIDC用户信息
   */
  function applyUserInfo(profile: OidcUserInfo) {
    // 标准化用户信息并更新Store
    userInfo.value = normalizeUserInfo(profile)
    // 将用户信息保存到系统缓存
    systemCache.set(SystemCacheKey.USER_INFO, userInfo.value)
  }

  /**
   * 同步认证会话，包括令牌和用户信息
   * @param session - 认证会话对象
   */
  async function syncSession(session: AuthSession) {
    // 首先应用令牌
    applyTokens(session.tokens)

    // 检查是否已有可用的用户信息
    const hasUsableUserInfo =
      !!session.userInfo &&
      !!(session.userInfo.name || session.userInfo.preferred_username || session.userInfo.email)

    // 如果有可用的用户信息，直接应用
    if (hasUsableUserInfo && session.userInfo) {
      applyUserInfo(session.userInfo)
      return
    }

    // 否则，从服务器获取用户信息
    const profile = await authApi.getUserInfo(session.tokens.accessToken)
    applyUserInfo(profile)
  }

  /**
   * 从本地存储初始化用户状态
   */
  function initFromStorage() {
    // 从系统缓存中恢复各种令牌和状态
    token.value = systemCache.get<string>(SystemCacheKey.TOKEN) || ''
    refreshToken.value = systemCache.get<string>(SystemCacheKey.REFRESH_TOKEN) || ''
    idToken.value = systemCache.get<string>(SystemCacheKey.ID_TOKEN) || ''
    tokenExpiresAt.value = systemCache.get<number>(SystemCacheKey.TOKEN_EXPIRES_AT)
    userInfo.value = systemCache.get<UserInfo>(SystemCacheKey.USER_INFO)
  }

  /**
   * 从服务器获取用户信息以补充会话数据
   * @returns 用户信息或null
   */
  async function hydrateSessionUser() {
    // 如果已有用户信息，直接返回
    if (userInfo.value) {
      return userInfo.value
    }

    try {
      // 从服务器获取用户信息
      const profile = await authApi.getUserInfo()
      applyUserInfo(profile)
      return userInfo.value
    } catch {
      // 如果获取失败，返回null
      return null
    }
  }

  /**
   * 开始登录流程（用户名密码方式）
   * @param payload - 包含用户名、密码和重定向路径的载荷
   */
  async function startLogin(payload: { username: string; password: string; redirect?: string }) {
    // 生成随机状态字符串用于CSRF保护
    const state = randomState()
    // 确定登录成功后的重定向路径
    const redirect = payload.redirect || '/'

    // 将状态和重定向路径保存到缓存，设置10分钟过期
    systemCache.set(SystemCacheKey.OIDC_STATE, state, { expire: 10 * 60 * 1000 })
    systemCache.set(SystemCacheKey.OIDC_REDIRECT, redirect, { expire: 10 * 60 * 1000 })

    // 调用认证API进行登录
    await authApi.login({
      username: payload.username,
      password: payload.password,
    })

    // 跳转到授权URL，携带状态参数
    window.location.href = getAuthorizeUrl(state)
  }

  /**
   * 处理OAuth2回调，交换授权码获取令牌
   * @param code - 授权码
   * @param state - 状态参数
   * @returns 重定向路径
   */
  async function handleCallback(code: string, state: string) {
    // 从缓存中获取之前保存的状态和重定向路径
    const cachedState = systemCache.get<string>(SystemCacheKey.OIDC_STATE)
    const redirect = systemCache.get<string>(SystemCacheKey.OIDC_REDIRECT) || '/'

    // 验证状态参数，防止CSRF攻击
    if (!cachedState || cachedState !== state) {
      throw new Error('登录状态校验失败，请重新发起登录')
    }

    // 使用授权码交换令牌
    const session = await authApi.exchangeCode({
      code,
      redirectUri: getAuthRedirectUri(),
    })

    // 同步会话信息
    await syncSession(session)

    // 清除临时存储的状态和重定向路径
    systemCache.remove(SystemCacheKey.OIDC_STATE)
    systemCache.remove(SystemCacheKey.OIDC_REDIRECT)

    // 返回重定向路径
    return redirect
  }

  /**
   * 刷新访问令牌
   * @param force - 是否强制刷新，忽略提前刷新策略
   * @returns 新的访问令牌
   */
  async function refreshAccessToken(force = false) {
    // 检查是否有刷新令牌
    if (!refreshToken.value) {
      throw new Error('缺少 refresh token，无法刷新登录状态')
    }

    // 如果不是强制刷新且不需要刷新，直接返回当前令牌
    if (!force && !shouldRefreshToken.value && token.value) {
      return token.value
    }

    // 如果已有正在进行的刷新请求，返回该Promise以避免重复请求
    if (refreshPromise.value) {
      return refreshPromise.value
    }

    // 创建刷新令牌的Promise
    refreshPromise.value = authApi
      .refreshToken({ refreshToken: refreshToken.value })
      .then(async (session) => {
        // 刷新成功后同步会话
        await syncSession(session)
        return token.value
      })
      .finally(() => {
        // 无论成功或失败，都清除refreshPromise
        refreshPromise.value = null
      })

    return refreshPromise.value
  }

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  async function fetchUserInfo() {
    // 从服务器获取用户信息
    const profile = await authApi.getUserInfo()
    applyUserInfo(profile)
    return userInfo.value
  }

  /**
   * 清除会话数据
   */
  function clearSession() {
    // 重置所有响应式状态
    userInfo.value = null
    token.value = ''
    refreshToken.value = ''
    idToken.value = ''
    tokenExpiresAt.value = null
    refreshPromise.value = null
    // 清除系统缓存中的认证相关数据
    systemCache.clearAuth()
  }

  /**
   * 用户登出
   * @param options - 登出选项，包括是否重定向到登录页和是否调用API
   */
  async function logout(options: { redirectToLogin?: boolean; callApi?: boolean } = {}) {
    // 解构选项，设置默认值
    const { redirectToLogin = false, callApi = true } = options

    try {
      // 如果需要调用API且有刷新令牌或ID令牌，则调用登出API
      if (callApi && (refreshToken.value || idToken.value)) {
        await authApi.logout(refreshToken.value || undefined, idToken.value || undefined)
      }
    } catch (error) {
      // 记录登出请求失败的错误
      console.error('Logout request failed:', error)
    } finally {
      // 无论API调用是否成功，都清除本地会话
      clearSession()
    }

    // 如果需要重定向到登录页
    if (redirectToLogin) {
      // 构造带当前路径的重定向URL
      const currentPath = window.location.pathname + window.location.search
      const target = `${AUTH_CONFIG.loginPath}?redirect=${encodeURIComponent(currentPath || '/')}`
      // 跳转到登录页
      window.location.href = target
    }
  }

  /**
   * 检查用户是否具有指定权限
   * @param permission - 权限字符串
   * @returns 是否具有该权限
   */
  function hasPermission(permission: string) {
    return userPermissions.value.includes(permission)
  }

  /**
   * 检查用户是否具有指定角色
   * @param role - 角色字符串
   * @returns 是否具有该角色
   */
  function hasRole(role: string) {
    return userRoles.value.includes(role)
  }

  // 返回Store的所有公共属性和方法
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
    hydrateSessionUser,
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
