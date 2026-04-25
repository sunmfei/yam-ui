import BaseCache from './baseCache'

/**
 * 系统缓存管理器（服务器数据）
 * 使用 sessionStorage 临时存储，关闭浏览器后自动清除
 * 所有 key 必须以 'sys_' 开头
 */
class SystemCache extends BaseCache {
  constructor() {
    super('sys')
  }

  protected storageSet(key: string, value: string): void {
    sessionStorage.setItem(key, value)
  }

  protected storageGet(key: string): string | null {
    return sessionStorage.getItem(key)
  }

  protected storageRemove(key: string): void {
    sessionStorage.removeItem(key)
  }

  protected storageKey(index: number): string | null {
    return sessionStorage.key(index)
  }

  protected get storageLength(): number {
    return sessionStorage.length
  }

  /**
   * 清理所有系统缓存
   */
  clearAll(): void {
    this.clear()
    console.log('✓ 系统缓存已清空')
  }

  /**
   * 清理指定的系统缓存（支持多个 key）
   */
  clearKeys(...keys: string[]): void {
    let clearedCount = 0
    keys.forEach((key) => {
      if (this.has(key)) {
        this.remove(key)
        clearedCount++
      }
    })
    console.log(`✓ 已清理 ${clearedCount} 个指定的系统缓存`)
  }

  /**
   * 清理认证相关缓存（登出时调用）
   */
  clearAuth(): void {
    this.clearKeys(
      'sys_token',
      'sys_userInfo',
      'sys_refreshToken',
      'sys_idToken',
      'sys_tokenExpiresAt',
      'sys_oidcState',
      'sys_oidcRedirect'
    )
    console.log('✓ 认证缓存已清空')
  }
}

// 导出单例
export const systemCache = new SystemCache()
export default systemCache
