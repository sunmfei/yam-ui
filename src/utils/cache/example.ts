/**
 * 缓存使用示例
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { localCache, systemCache, LocalCacheKey, SystemCacheKey, getAllCacheKeys } from '@/utils/cache'

// ==================== 本地缓存示例（用户行为数据）====================

/**
 * 保存搜索历史
 */
export function saveSearchHistory(keyword: string): void {
  const history = localCache.get<string[]>(LocalCacheKey.SEARCH_HISTORY) || []
  history.unshift(keyword)
  // 只保留最近 20 条
  if (history.length > 20) {
    history.pop()
  }
  localCache.set(LocalCacheKey.SEARCH_HISTORY, history)
}

/**
 * 获取搜索历史
 */
export function getSearchHistory(): string[] {
  return localCache.get<string[]>(LocalCacheKey.SEARCH_HISTORY) || []
}

/**
 * 清空搜索历史
 */
export function clearSearchHistory(): void {
  localCache.remove(LocalCacheKey.SEARCH_HISTORY)
}

/**
 * 保存用户偏好设置
 */
export function saveUserPreferences(preferences: Record<string, any>): void {
  // 过期时间：30 天
  localCache.set(LocalCacheKey.USER_PREFERENCES, preferences, {
    expire: 30 * 24 * 60 * 60 * 1000,
  })
}

/**
 * 获取用户偏好设置
 */
export function getUserPreferences(): Record<string, any> | null {
  return localCache.get<Record<string, any>>(LocalCacheKey.USER_PREFERENCES)
}

// ==================== 系统缓存示例（服务器数据）====================

/**
 * 保存用户信息
 */
export function saveUserInfo(userInfo: any): void {
  // 过期时间：24 小时
  systemCache.set(SystemCacheKey.USER_INFO, userInfo, {
    expire: 24 * 60 * 60 * 1000,
  })
}

/**
 * 获取用户信息
 */
export function getUserInfo(): any | null {
  return systemCache.get(SystemCacheKey.USER_INFO)
}

/**
 * 保存认证 Token
 */
export function saveToken(token: string): void {
  // 过期时间：7 天
  systemCache.set(SystemCacheKey.TOKEN, token, {
    expire: 7 * 24 * 60 * 60 * 1000,
  })
}

/**
 * 获取认证 Token
 */
export function getToken(): string | null {
  return systemCache.get<string>(SystemCacheKey.TOKEN)
}

/**
 * 保存 API 响应数据
 */
export function saveApiData(key: string, data: any, expireMinutes: number = 5): void {
  systemCache.set(`${SystemCacheKey.API_DATA}:${key}`, data, {
    expire: expireMinutes * 60 * 1000,
  })
}

/**
 * 获取 API 响应数据
 */
export function getApiData(key: string): any | null {
  return systemCache.get(`${SystemCacheKey.API_DATA}:${key}`)
}

/**
 * 登出时清理认证相关缓存
 */
export function logout(): void {
  systemCache.clearAuth()
  console.log('✓ 已登出，认证缓存已清理')
}

// ==================== 缓存清理示例 ====================

/**
 * 清理指定的缓存（推荐使用）
 */
export function clearSpecificCache(): void {
  // 清理本地缓存的指定 key
  localCache.clearKeys(
    LocalCacheKey.SEARCH_HISTORY,
    LocalCacheKey.USER_PREFERENCES
  )

  // 清理系统缓存的指定 key
  systemCache.clearKeys(
    SystemCacheKey.API_DATA,
    SystemCacheKey.DICTIONARY
  )
}

/**
 * 根据前缀清理缓存
 */
export function clearCacheByPrefixExample(): void {
  // 清理所有 API 数据缓存
  systemCache.clearByPrefix('sys_apiData')
  
  // 清理所有用户相关缓存
  localCache.clearByPrefix('local_user')
}

/**
 * 定期清理过期缓存（建议在应用启动时调用）
 */
export function cleanupExpiredCache(): void {
  localCache.clearExpired()
  systemCache.clearExpired()
}

/**
 * 清理所有缓存（谨慎使用）
 */
export function clearAllCache(): void {
  localCache.clearAll()
  systemCache.clearAll()
}

/**
 * 查看所有缓存的 key
 */
export function viewAllCacheKeys(): void {
  const keys = getAllCacheKeys()
  console.log('📋 本地缓存 Keys:', keys.local)
  console.log('📋 系统缓存 Keys:', keys.system)
}

/**
 * 获取缓存统计信息
 */
export function getCacheInfo(): void {
  const localStats = localCache.getStats()
  const systemStats = systemCache.getStats()

  console.log('📊 缓存统计信息：')
  console.log(`  本地缓存: ${localStats.count} 项, ${formatBytes(localStats.size)}`)
  console.log(`  系统缓存: ${systemStats.count} 项, ${formatBytes(systemStats.size)}`)
  console.log(
    `  总计: ${localStats.count + systemStats.count} 项, ${formatBytes(localStats.size + systemStats.size)}`
  )
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}
