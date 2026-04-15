/**
 * 缓存管理统一出口
 */

export { localCache } from './localCache'
export { systemCache } from './systemCache'
export { CacheType } from './baseCache'
export type { CacheOptions } from '@/types/cache'
export { LocalCacheKey, SystemCacheKey } from '@/types/cache'

// 便捷清理函数
import { localCache } from './localCache'
import { systemCache } from './systemCache'

/**
 * 清理所有缓存（本地 + 系统）
 */
export function clearAllCache(): void {
  localCache.clearAll()
  systemCache.clearAll()
  console.log('✓ 所有缓存已清空')
}

/**
 * 清理指定的缓存（支持多个 key）
 */
export function clearCacheKeys(
  localKeys: string[] = [],
  systemKeys: string[] = []
): void {
  if (localKeys.length > 0) {
    localCache.clearKeys(...localKeys)
  }
  if (systemKeys.length > 0) {
    systemCache.clearKeys(...systemKeys)
  }
  console.log('✓ 指定缓存已清理')
}

/**
 * 清理所有过期缓存
 */
export function clearExpiredCache(): void {
  localCache.clearExpired()
  systemCache.clearExpired()
  console.log('✓ 所有过期缓存已清理')
}

/**
 * 根据前缀清理缓存
 */
export function clearCacheByPrefix(
  localPrefix?: string,
  systemPrefix?: string
): void {
  if (localPrefix) {
    localCache.clearByPrefix(localPrefix)
  }
  if (systemPrefix) {
    systemCache.clearByPrefix(systemPrefix)
  }
}

/**
 * 根据模式清理缓存
 */
export function clearCacheByPattern(
  localPattern?: string,
  systemPattern?: string
): void {
  if (localPattern) {
    localCache.clearByPattern(localPattern)
  }
  if (systemPattern) {
    systemCache.clearByPattern(systemPattern)
  }
}

/**
 * 获取所有缓存的 key 列表
 */
export function getAllCacheKeys(): {
  local: string[]
  system: string[]
} {
  return {
    local: localCache.getAllCacheKeys(),
    system: systemCache.getAllCacheKeys(),
  }
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): {
  local: { count: number; size: number }
  system: { count: number; size: number }
  total: { count: number; size: number }
} {
  const local = localCache.getStats()
  const system = systemCache.getStats()

  return {
    local,
    system,
    total: {
      count: local.count + system.count,
      size: local.size + system.size,
    },
  }
}

/**
 * 格式化字节大小
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
