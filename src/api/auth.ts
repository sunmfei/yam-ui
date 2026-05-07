// 导入认证相关的配置和工具函数
import { AUTH_CONFIG, getAuthLoginUrl, getAuthRedirectUri, getAuthServiceUrl } from '@/config/auth'

// 定义认证令牌接口，包含访问令牌、刷新令牌等信息
export interface AuthTokens {
  accessToken: string // 访问令牌，用于API请求认证
  refreshToken?: string // 刷新令牌，用于获取新的访问令牌
  idToken?: string // ID令牌，包含用户身份信息
  tokenType?: string // 令牌类型，通常为"Bearer"
  scope?: string // 授权范围
  expiresIn?: number // 过期时间（秒）
  expiresAt?: number // 过期时间戳（毫秒）
}

// 定义OIDC用户信息接口，符合OpenID Connect标准
export interface OidcUserInfo {
  sub: string // 用户唯一标识符
  name?: string // 用户全名
  email?: string // 用户邮箱
  preferred_username?: string // 首选用户名
  picture?: string | null // 用户头像URL
  email_verified?: boolean // 邮箱是否已验证
  roles?: string[] // 用户角色列表
  permissions?: string[] // 用户权限列表
  [key: string]: unknown // 允许其他自定义属性
}

// 定义认证会话接口，包含令牌和用户信息
export interface AuthSession {
  tokens: AuthTokens // 认证令牌
  userInfo?: OidcUserInfo // 用户信息
}

// 定义登录请求载荷接口
export interface LoginPayload {
  username: string // 用户名
  password: string // 密码
}

// 定义回调请求载荷接口（用于OAuth2授权码交换）
interface CallbackPayload {
  code: string // 授权码
  redirectUri?: string // 重定向URI
}

// 定义刷新令牌请求载荷接口
interface RefreshPayload {
  refreshToken: string // 刷新令牌
}

/**
 * 返回第一个非undefined且非null的值
 * @param values - 要检查的值列表
 * @returns 第一个有效值或undefined
 */
function firstDefined<T>(...values: Array<T | undefined | null>): T | undefined {
  return values.find((value) => value !== undefined && value !== null)
}

/**
 * 标准化令牌数据，处理不同来源的令牌字段命名差异
 * @param payload - 原始令牌数据
 * @returns 标准化的AuthTokens对象
 */
function normalizeTokens(payload: Record<string, any>): AuthTokens {
  // 计算过期时间（秒）
  const expiresIn = Number(firstDefined(payload.expires_in, payload.expiresIn) || 0)
  // 计算明确的过期时间戳
  const explicitExpiresAt = Number(firstDefined(payload.expires_at, payload.expiresAt) || 0)

  return {
    // 访问令牌，支持多种可能的字段名
    accessToken: String(
      firstDefined(payload.access_token, payload.accessToken, payload.token, payload.jwt) || ''
    ),
    // 刷新令牌，支持多种可能的字段名
    refreshToken: firstDefined(payload.refresh_token, payload.refreshToken) || undefined,
    // ID令牌，支持多种可能的字段名
    idToken: firstDefined(payload.id_token, payload.idToken) || undefined,
    // 令牌类型，默认为Bearer
    tokenType: firstDefined(payload.token_type, payload.tokenType, 'Bearer') || 'Bearer',
    // 授权范围，支持多种可能的字段名
    scope: firstDefined(payload.scope, payload.scopes) || undefined,
    // 过期时间（秒），仅在大于0时设置
    expiresIn: expiresIn > 0 ? expiresIn : undefined,
    // 过期时间戳，优先使用明确的时间戳，否则根据expiresIn计算
    expiresAt:
      explicitExpiresAt > 0
        ? explicitExpiresAt
        : expiresIn > 0
          ? Date.now() + expiresIn * 1000
          : undefined,
  }
}

/**
 * 标准化认证会话数据，处理不同来源的会话字段命名差异
 * @param payload - 原始会话数据
 * @returns 标准化的AuthSession对象
 */
function normalizeSession(payload: any): AuthSession {
  // 获取数据源，可能是嵌套在data属性中或直接提供
  const raw = payload?.data ?? payload
  // 获取令牌源，可能是tokens、tokenSet或直接提供
  const tokenSource = raw?.tokens ?? raw?.tokenSet ?? raw
  // 标准化令牌数据
  const tokens = normalizeTokens(tokenSource)

  return {
    tokens,
    // 用户信息，支持多种可能的字段名
    userInfo: firstDefined(raw?.userInfo, raw?.userinfo, raw?.user, raw?.profile),
  }
}

/**
 * 读取JSON响应，处理解析失败的情况
 * @param response - Fetch API响应对象
 * @returns 解析后的JSON数据或null
 */
async function readJsonResponse(response: Response) {
  return response.json().catch(() => null)
}

/**
 * 检查状态码是否为成功状态（200）
 * @param code - 状态码
 * @returns 是否为成功状态
 */
function isSuccessCode(code: unknown) {
  return code === 200 || code === '200'
}

/**
 * 发送POST请求到认证服务，处理JSON数据
 * @param path - 请求路径
 * @param payload - 请求载荷
 * @returns 解析后的响应数据
 */
async function postAuthJson<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  // 发送POST请求到认证服务
  const response = await fetch(getAuthServiceUrl(path), {
    method: 'POST',
    credentials: 'include', // 包含凭证（cookies）
    headers: {
      'Content-Type': 'application/json', // JSON内容类型
    },
    body: JSON.stringify(payload), // 序列化请求体
  })

  // 读取JSON响应
  const result = await readJsonResponse(response)

  // 检查响应状态和业务状态码
  if (!response.ok || (result?.code !== undefined && !isSuccessCode(result.code))) {
    throw new Error(result?.message || '认证请求失败')
  }

  // 返回数据，优先返回data字段，否则返回整个结果
  return (result?.data ?? result) as T
}

// 导出认证API对象，包含各种认证相关的方法
export const authApi = {
  /**
   * 用户登录方法
   * @param payload - 登录凭据（用户名和密码）
   * @returns Promise<void>
   */
  async login(payload: LoginPayload): Promise<void> {
    // 发送登录请求到认证服务（JSON 格式）
    const response = await fetch(getAuthLoginUrl(), {
      method: 'POST',
      redirect: 'manual', // 手动处理重定向
      credentials: 'include', // 包含凭证
      headers: {
        'Content-Type': 'application/json', // JSON 格式
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    })

    // 如果是不透明重定向，直接返回
    if (response.type === 'opaqueredirect') {
      return
    }

    // 获取重定向位置
    const location = response.headers.get('Location') || response.headers.get('location') || ''

    // 如果是重定向响应
    if (response.status >= 300 && response.status < 400) {
      // 如果重定向URL包含错误参数，抛出错误
      if (location.includes('error')) {
        throw new Error('登录失败，请检查用户名和密码')
      }
      return
    }

    // 尝试解析JSON响应
    const result = await response.json().catch(() => null)

    // 检查响应状态和业务状态码
    if (!response.ok || (result?.code !== undefined && !isSuccessCode(result.code))) {
      throw new Error(result?.message || '登录失败，请检查用户名和密码')
    }
  },

  /**
   * 交换授权码获取访问令牌（OAuth2授权码流程）
   * @param payload - 包含授权码和重定向URI的载荷
   * @returns Promise<AuthSession> 认证会话信息
   */
  async exchangeCode(payload: CallbackPayload): Promise<AuthSession> {
    // 发送授权码交换请求
    const response = await postAuthJson<AuthSession>(AUTH_CONFIG.endpoints.callback, {
      code: payload.code,
      redirect_uri: payload.redirectUri || getAuthRedirectUri(), // 兼容snake_case格式
      redirectUri: payload.redirectUri || getAuthRedirectUri(), // 兼容camelCase格式
    })

    // 标准化并返回会话信息
    return normalizeSession(response)
  },

  /**
   * 使用刷新令牌获取新的访问令牌
   * @param payload - 包含刷新令牌的载荷
   * @returns Promise<AuthSession> 新的认证会话信息
   */
  async refreshToken(payload: RefreshPayload): Promise<AuthSession> {
    // 发送刷新令牌请求
    const response = await postAuthJson<AuthSession>(AUTH_CONFIG.endpoints.refresh, {
      refresh_token: payload.refreshToken, // 兼容snake_case格式
      refreshToken: payload.refreshToken, // 兼容camelCase格式
    })

    // 标准化并返回会话信息
    return normalizeSession(response)
  },

  /**
   * 获取用户信息
   * @param accessToken - 可选的访问令牌，如果不提供则使用cookie认证
   * @returns Promise<OidcUserInfo> 用户信息
   */
  async getUserInfo(accessToken?: string): Promise<OidcUserInfo> {
    // 发送获取用户信息请求
    const response = await fetch(getAuthServiceUrl(AUTH_CONFIG.endpoints.userinfo), {
      method: 'GET',
      credentials: 'include', // 包含凭证
      // 如果提供了访问令牌，则添加到Authorization头
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : {},
    })

    // 读取JSON响应
    const result = await readJsonResponse(response)

    // 检查响应状态和业务状态码
    if (!response.ok || (result?.code !== undefined && !isSuccessCode(result.code))) {
      throw new Error(result?.message || '获取用户信息失败')
    }

    // 返回用户信息，优先返回data字段，否则返回整个结果
    return (result?.data ?? result) as OidcUserInfo
  },

  /**
   * 用户登出
   * @param refreshToken - 可选的刷新令牌
   * @param idToken - 可选的ID令牌
   * @returns Promise<void>
   */
  async logout(refreshToken?: string, idToken?: string): Promise<void> {
    // 发送登出请求
    await postAuthJson(AUTH_CONFIG.endpoints.sessionLogout, {
      refresh_token: refreshToken, // 兼容snake_case格式
      refreshToken, // 兼容camelCase格式
      id_token: idToken, // 兼容snake_case格式
      idToken, // 兼容camelCase格式
    })
  },
}
