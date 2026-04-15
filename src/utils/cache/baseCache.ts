import type { CacheItem, CacheOptions } from '@/types/cache'

/**
 * 缓存类型枚举
 */
export const CacheType = {
  LOCAL: 'local',
  SYSTEM: 'sys',
} as const

export type CacheType = (typeof CacheType)[keyof typeof CacheType]

/**
 * 缓存管理器基类
 */
abstract class BaseCache {
  protected cacheType: CacheType
  protected keyPrefix: string

  constructor(cacheType: CacheType) {
    this.cacheType = cacheType
    this.keyPrefix = `${cacheType}_`
  }

  /**
   * 验证 key 是否符合命名规范
   */
  protected validateKey(key: string): void {
    if (!key.startsWith(this.keyPrefix)) {
      console.warn(
        `⚠️ Cache key "${key}" should start with "${this.keyPrefix}" for ${this.cacheType} cache`
      )
    }
  }

  /**
   * 构建完整的前缀（用于模糊匹配）
   */
  protected buildFullPrefix(prefix: string): string {
    return prefix.startsWith(this.keyPrefix) ? prefix : `${this.keyPrefix}${prefix}`
  }

  /**
   * 设置缓存
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    this.validateKey(key)

    const { expire = 0 } = options
    const now = Date.now()

    const cacheItem: CacheItem<T> = {
      data,
      timestamp: now,
      expireAt: expire > 0 ? now + expire : null,
    }

    try {
      const serialized = JSON.stringify(cacheItem)
      this.storageSet(key, serialized)
    } catch (error) {
      console.error(`Failed to set cache [${key}]:`, error)
    }
  }

  /**
   * 获取缓存
   */
  get<T>(key: string): T | null {
    this.validateKey(key)

    try {
      const serialized = this.storageGet(key)
      if (!serialized) return null

      const cacheItem: CacheItem<T> = JSON.parse(serialized)

      // 检查是否过期
      if (cacheItem.expireAt && Date.now() > cacheItem.expireAt) {
        this.remove(key)
        return null
      }

      return cacheItem.data
    } catch (error) {
      console.error(`Failed to get cache [${key}]:`, error)
      return null
    }
  }

  /**
   * 删除缓存
   */
  remove(key: string): void {
    this.validateKey(key)

    try {
      this.storageRemove(key)
    } catch (error) {
      console.error(`Failed to remove cache [${key}]:`, error)
    }
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    try {
      const keys = this.getAllKeys()
      keys.forEach((key) => {
        if (key.startsWith(this.keyPrefix)) {
          this.storageRemove(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear cache:', error)
    }
  }

  /**
   * 获取所有缓存键名
   */
  protected getAllKeys(): string[] {
    const keys: string[] = []
    for (let i = 0; i < this.storageLength; i++) {
      const key = this.storageKey(i)
      if (key) keys.push(key)
    }
    return keys
  }

  /**
   * 检查缓存是否存在
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { count: number; size: number } {
    const keys = this.getAllKeys().filter((key) => key.startsWith(this.keyPrefix))
    let totalSize = 0

    keys.forEach((key) => {
      const value = this.storageGet(key)
      if (value) {
        totalSize += new Blob([value]).size
      }
    })

    return {
      count: keys.length,
      size: totalSize,
    }
  }

  /**
   * 清理过期的缓存
   */
  clearExpired(): void {
    const keys = this.getAllKeys()
    let clearedCount = 0

    keys.forEach((key) => {
      if (key.startsWith(this.keyPrefix)) {
        try {
          const serialized = this.storageGet(key)
          if (serialized) {
            const cacheItem: CacheItem = JSON.parse(serialized)
            if (cacheItem.expireAt && Date.now() > cacheItem.expireAt) {
              this.storageRemove(key)
              clearedCount++
            }
          }
        } catch (error) {
          console.error(`Failed to check cache expiration [${key}]:`, error)
        }
      }
    })

    console.log(`✓ 已清理 ${clearedCount} 个过期的${this.cacheType}缓存`)
  }

  /**
   * 清理指定前缀的缓存
   */
  clearByPrefix(prefix: string): void {
    const keys = this.getAllKeys()
    let clearedCount = 0
    const fullPrefix = this.buildFullPrefix(prefix)

    keys.forEach((key) => {
      if (key.startsWith(fullPrefix)) {
        this.storageRemove(key)
        clearedCount++
      }
    })

    console.log(`✓ 已清理 ${clearedCount} 个前缀为 "${prefix}" 的${this.cacheType}缓存`)
  }

  /**
   * 清理匹配模式的缓存
   */
  clearByPattern(pattern: string): void {
    const keys = this.getAllKeys()
    let clearedCount = 0

    keys.forEach((key) => {
      if (key.startsWith(this.keyPrefix) && key.includes(pattern)) {
        this.storageRemove(key)
        clearedCount++
      }
    })

    console.log(`✓ 已清理 ${clearedCount} 个匹配 "${pattern}" 的${this.cacheType}缓存`)
  }

  /**
   * 获取所有缓存的 key 列表
   */
  getAllCacheKeys(): string[] {
    return this.getAllKeys().filter((key) => key.startsWith(this.keyPrefix))
  }

  // 抽象方法，由子类实现
  protected abstract storageSet(key: string, value: string): void
  protected abstract storageGet(key: string): string | null
  protected abstract storageRemove(key: string): void
  protected abstract storageKey(index: number): string | null
  protected abstract get storageLength(): number
}

export default BaseCache
