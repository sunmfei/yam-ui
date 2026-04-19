/**
 * 缓存相关模型
 */

/**
 * 缓存选项
 */
export interface CacheOptions {
  /** 过期时间（毫秒），0 表示永不过期 */
  expire?: number
  /** 是否加密存储 */
  encrypt?: boolean
}

/**
 * 缓存项结构
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface CacheItem<T = any> {
  /** 数据 */
  data: T
  /** 创建时间戳 */
  timestamp: number
  /** 过期时间戳 */
  expireAt: number | null
}
