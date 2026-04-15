import BaseCache from './baseCache'

/**
 * 本地缓存管理器（用户行为数据）
 * 使用 localStorage 持久化存储
 * 所有 key 必须以 'local_' 开头
 */
class LocalCache extends BaseCache {
  constructor() {
    super('local')
  }

  protected storageSet(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  protected storageGet(key: string): string | null {
    return localStorage.getItem(key)
  }

  protected storageRemove(key: string): void {
    localStorage.removeItem(key)
  }

  protected storageKey(index: number): string | null {
    return localStorage.key(index)
  }

  protected get storageLength(): number {
    return localStorage.length
  }

  /**
   * 清理所有本地缓存
   */
  clearAll(): void {
    this.clear()
    console.log('✓ 本地缓存已清空')
  }

  /**
   * 清理指定的本地缓存（支持多个 key）
   */
  clearKeys(...keys: string[]): void {
    let clearedCount = 0
    keys.forEach((key) => {
      if (this.has(key)) {
        this.remove(key)
        clearedCount++
      }
    })
    console.log(`✓ 已清理 ${clearedCount} 个指定的本地缓存`)
  }
}

// 导出单例
export const localCache = new LocalCache()
export default localCache
