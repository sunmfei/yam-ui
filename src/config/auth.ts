// 导入应用配置
import { APP_CONFIG } from '@/config'

// 默认认证入口URL
const DEFAULT_AUTH_ENTRY_URL = '/auth'
// 默认授权范围，包含OpenID Connect标准范围和自定义范围
const DEFAULT_SCOPES = ['openid', 'profile', 'email', 'read', 'write']

/**
 * 去除字符串末尾的斜杠
 * @param value - 需要处理的字符串
 * @returns 去除末尾斜杠后的字符串
 */
const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

/**
 * 将认证入口URL转换为浏览器基础路径
 * @param entryUrl - 认证入口URL
 * @returns 浏览器基础路径
 */
function toBrowserBaseUrl(entryUrl: string) {
  // 标准化URL，去除末尾斜杠
  const normalized = trimTrailingSlash(entryUrl)

  // 如果是相对路径（以/开头），直接返回或返回默认值
  if (normalized.startsWith('/')) {
    return normalized || '/auth'
  }

  try {
    // 尝试解析为完整URL，提取路径部分
    const url = new URL(normalized)
    return trimTrailingSlash(url.pathname) || '/'
  } catch {
    // 如果解析失败，返回默认值
    return '/auth'
  }
}

// 获取认证入口URL，优先使用环境变量，否则使用默认值
const authEntryUrl = trimTrailingSlash(
  import.meta.env.VITE_AUTH_ENTRY_URL || import.meta.env.VITE_AUTH_ISSUER || DEFAULT_AUTH_ENTRY_URL
)

// 导出认证配置常量对象
export const AUTH_CONFIG = {
  entryUrl: authEntryUrl, // 认证入口URL
  issuer: authEntryUrl, // OIDC发行者URL
  browserBaseUrl: toBrowserBaseUrl(authEntryUrl), // 浏览器基础路径
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID || 'web-app', // 客户端ID
  // 授权范围，从环境变量获取或拆分默认范围字符串
  scopes: (import.meta.env.VITE_AUTH_SCOPES || DEFAULT_SCOPES.join(' '))
    .split(/\s+/)
    .filter(Boolean),
  callbackPath: import.meta.env.VITE_AUTH_CALLBACK_PATH || '/callback', // 回调路径
  loginPath: import.meta.env.VITE_AUTH_LOGIN_PATH || '/login', // 登录路径
  refreshAheadMs: Number(import.meta.env.VITE_AUTH_REFRESH_AHEAD_MS || 5 * 60 * 1000), // 提前刷新时间（毫秒）
  apiBaseUrl: APP_CONFIG.API_BASE_URL, // API基础URL

  // 认证端点配置
  endpoints: {
    login: import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/api/auth/login', // 登录端点
    logout: import.meta.env.VITE_AUTH_SERVER_LOGOUT_ENDPOINT || '/logout', // 服务端登出端点
    authorize: import.meta.env.VITE_AUTH_AUTHORIZE_ENDPOINT || '/oauth2/authorize', // 授权端点
    userinfo: import.meta.env.VITE_AUTH_USERINFO_ENDPOINT || '/me', // 用户信息端点
    callback: import.meta.env.VITE_AUTH_CALLBACK_ENDPOINT || '/callback', // 回调端点
    refresh: import.meta.env.VITE_AUTH_REFRESH_ENDPOINT || '/refresh', // 刷新令牌端点
    sessionLogout: import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || '/session/logout', // 会话登出端点
  },
} as const

/**
 * 获取认证重定向URI
 * @returns 完整的重定向URI
 */
export function getAuthRedirectUri() {
  // 构造完整的回调URL
  return `${window.location.origin}${AUTH_CONFIG.callbackPath}`
}

/**
 * 获取授权URL，用于OAuth2授权码流程
 * @param state - 状态参数，用于CSRF保护
 * @returns 完整的授权URL
 */
export function getAuthorizeUrl(state: string) {
  // 构造授权请求参数
  const search = new URLSearchParams({
    response_type: 'code', // 响应类型为授权码
    client_id: AUTH_CONFIG.clientId, // 客户端ID
    redirect_uri: getAuthRedirectUri(), // 重定向URI
    scope: AUTH_CONFIG.scopes.join(' '), // 授权范围
    state, // 状态参数
  })

  // 构造完整的授权URL
  return `${AUTH_CONFIG.browserBaseUrl}${AUTH_CONFIG.endpoints.authorize}?${search.toString()}`
}

/**
 * 获取登录URL
 * @returns 完整的登录URL
 */
export function getAuthLoginUrl() {
  return `${AUTH_CONFIG.browserBaseUrl}${AUTH_CONFIG.endpoints.login}`
}

/**
 * 获取认证服务完整URL
 * @param path - 端点路径
 * @returns 完整的认证服务URL
 */
export function getAuthServiceUrl(path: string) {
  return `${AUTH_CONFIG.browserBaseUrl}${path}`
}
