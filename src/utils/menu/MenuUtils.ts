import { localCache, LocalCacheKey } from '@/utils/cache'
import type { MenuNode } from '@/types'
import { convertDatabaseMenus } from '@/utils/menu/menuConverter.ts'

/**
 * 菜单配置管理器（升级版）
 *
 * 职责：
 * 1. 管理三种菜单来源
 * 2. 统一输出 MenuNode
 * 3. 提供最终菜单入口
 */
class MenuConfigManager {
  private staticMenu: MenuNode[] = []

  /**
   * 设置静态菜单
   */
  setStaticMenu(menuData: MenuNode[]): void {
    this.staticMenu = menuData
  }

  /**
   * 获取静态菜单
   */
  getStaticMenu(): MenuNode[] {
    return this.staticMenu
  }

  /**
   * 获取用户自定义菜单（本地缓存）
   */
  getUserMenu(): MenuNode[] {
    const cached = localCache.get<any[]>(LocalCacheKey.MENU_CONFIG)

    if (!cached) return []

    // ⚠️ 关键：如果本地是 DB JSON，需要转换
    return convertDatabaseMenus(cached)
  }

  /**
   * 保存用户菜单（存的是 DB JSON）
   */
  saveUserMenu(menu: any[]): void {
    localCache.set(LocalCacheKey.MENU_CONFIG, menu)
    console.log('✓ 用户菜单已保存')
  }

  /**
   * 后端菜单
   */
  async fetchApiMenu(): Promise<MenuNode[]> {
    try {
      console.warn('⚠️ API 未接入')
      return []
    } catch (e) {
      console.error('API菜单失败', e)
      return []
    }
  }

  /**
   * 🎯 最终统一入口（重点）
   *
   * 优先级：
   * 1. 用户菜单
   * 2. API菜单
   * 3. 静态菜单
   */
  async getMenu(): Promise<MenuNode[]> {
    const userMenu = this.getUserMenu()
    if (userMenu.length > 0) {
      return userMenu
    }

    const apiMenu = await this.fetchApiMenu()
    if (apiMenu.length > 0) {
      return apiMenu
    }

    return this.staticMenu
  }

  /**
   * 重置
   */
  resetToDefault(): void {
    localCache.remove(LocalCacheKey.MENU_CONFIG)
    console.log('✓ 已重置菜单')
  }
}

export const menuConfig = new MenuConfigManager()
export default menuConfig
