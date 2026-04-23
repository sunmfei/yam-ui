import { defineStore } from 'pinia'
import { computed } from 'vue'
import { localCache, systemCache } from '@/utils/cache'
import type { CacheOptions } from '@/types'
import { LocalCacheKey, SystemCacheKey } from '@/types'

export const useCacheStore = defineStore('cache', () => {
  // Getters - 获取缓存统计信息
  const cacheStats = computed(() => {
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
  })

  const localCacheKeys = computed(() => localCache.getAllCacheKeys())
  const systemCacheKeys = computed(() => systemCache.getAllCacheKeys())

  // Actions - 本地缓存操作
  function setLocalCache<T>(key: string, data: T, options?: CacheOptions) {
    localCache.set(key, data, options)
  }

  function getLocalCache<T>(key: string): T | null {
    return localCache.get<T>(key)
  }

  function removeLocalCache(key: string) {
    localCache.remove(key)
  }

  function clearLocalCache() {
    localCache.clearAll()
  }

  function clearLocalCacheByPrefix(prefix: string) {
    localCache.clearByPrefix(prefix)
  }

  function clearLocalCacheByPattern(pattern: string) {
    localCache.clearByPattern(pattern)
  }

  function clearLocalExpiredCache() {
    localCache.clearExpired()
  }

  // Actions - 系统缓存操作
  function setSystemCache<T>(key: string, data: T, options?: CacheOptions) {
    systemCache.set(key, data, options)
  }

  function getSystemCache<T>(key: string): T | null {
    return systemCache.get<T>(key)
  }

  function removeSystemCache(key: string) {
    systemCache.remove(key)
  }

  function clearSystemCache() {
    systemCache.clearAll()
  }

  function clearSystemCacheByPrefix(prefix: string) {
    systemCache.clearByPrefix(prefix)
  }

  function clearSystemCacheByPattern(pattern: string) {
    systemCache.clearByPattern(pattern)
  }

  function clearSystemExpiredCache() {
    systemCache.clearExpired()
  }

  // Actions - 综合操作
  function clearAllCache() {
    clearLocalCache()
    clearSystemCache()
  }

  function clearExpiredCache() {
    clearLocalExpiredCache()
    clearSystemExpiredCache()
  }

  function clearCacheByKeys(localKeys: string[] = [], systemKeys: string[] = []) {
    if (localKeys.length > 0) {
      localKeys.forEach((key) => localCache.remove(key))
    }
    if (systemKeys.length > 0) {
      systemKeys.forEach((key) => systemCache.remove(key))
    }
  }

  // 便捷方法：使用预定义的缓存键
  function setSearchHistory(history: string[]) {
    localCache.set(LocalCacheKey.SEARCH_HISTORY, history)
  }

  function getSearchHistory(): string[] {
    return localCache.get<string[]>(LocalCacheKey.SEARCH_HISTORY) || []
  }

  function setUserPreferences(preferences: Record<string, unknown>) {
    localCache.set(LocalCacheKey.USER_PREFERENCES, preferences)
  }

  function getUserPreferences(): Record<string, unknown> | null {
    return localCache.get<Record<string, unknown>>(LocalCacheKey.USER_PREFERENCES)
  }

  function setUserInfo(userInfo: unknown) {
    systemCache.set(SystemCacheKey.USER_INFO, userInfo)
  }

  function getUserInfo(): unknown | null {
    return systemCache.get(SystemCacheKey.USER_INFO)
  }

  function setToken(token: string) {
    systemCache.set(SystemCacheKey.TOKEN, token)
  }

  function getToken(): string | null {
    return systemCache.get<string>(SystemCacheKey.TOKEN)
  }

  function setApiData(key: string, data: unknown) {
    systemCache.set(`${SystemCacheKey.API_DATA}:${key}`, data)
  }

  function getApiData(key: string): unknown | null {
    return systemCache.get(`${SystemCacheKey.API_DATA}:${key}`)
  }

  return {
    // Getters
    cacheStats,
    localCacheKeys,
    systemCacheKeys,
    // Local Cache Actions
    setLocalCache,
    getLocalCache,
    removeLocalCache,
    clearLocalCache,
    clearLocalCacheByPrefix,
    clearLocalCacheByPattern,
    clearLocalExpiredCache,
    // System Cache Actions
    setSystemCache,
    getSystemCache,
    removeSystemCache,
    clearSystemCache,
    clearSystemCacheByPrefix,
    clearSystemCacheByPattern,
    clearSystemExpiredCache,
    // Combined Actions
    clearAllCache,
    clearExpiredCache,
    clearCacheByKeys,
    // Convenience Methods
    setSearchHistory,
    getSearchHistory,
    setUserPreferences,
    getUserPreferences,
    setUserInfo,
    getUserInfo,
    setToken,
    getToken,
    setApiData,
    getApiData,
  }
})
