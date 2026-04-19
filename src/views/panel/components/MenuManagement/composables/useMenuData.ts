/**
 * useMenuData - 菜单数据管理 Composable
 *
 * 负责菜单数据的加载、保存、合并等核心逻辑
 */
import { ref } from 'vue'
import type { MenuNode } from '@/types'
import { DEFAULT_MENU } from '@/views/home/data/MenuData'
import { localCache } from '@/utils/cache/localCache'
import { getMenus } from '@/api/menu'
import { LocalCacheKey } from '@/types'

export function useMenuData() {
  const CACHE_KEY = LocalCacheKey.MENU_CONFIG
  const menus = ref<MenuNode[]>([])

  /**
   * 克隆树结构
   */
  function cloneTree(data: MenuNode[]): MenuNode[] {
    return JSON.parse(JSON.stringify(data)) as MenuNode[]
  }

  /**
   * 从后端 API 获取菜单数据
   */
  async function fetchMenuFromAPI(): Promise<MenuNode[] | null> {
    try {
      const data = await getMenus()
      return data.length > 0 ? data : null
    } catch (error) {
      console.error('API 请求失败:', error)
      throw error
    }
  }

  /**
   * 递归收集所有节点 ID
   */
  function collectAllIds(nodes: MenuNode[], idSet: Set<string>): void {
    for (const node of nodes) {
      idSet.add(node.id)
      if (node.children && node.children.length > 0) {
        collectAllIds(node.children, idSet)
      }
    }
  }

  /**
   * 合并菜单数据
   */
  function mergeMenuData(apiData: MenuNode[], cachedData: MenuNode[]): MenuNode[] {
    const apiIds = new Set<string>()
    collectAllIds(apiData, apiIds)

    const uniqueCachedNodes = cachedData.filter((node) => !apiIds.has(node.id))

    if (uniqueCachedNodes.length === 0) {
      return apiData
    }

    return [...apiData, ...uniqueCachedNodes]
  }

  /**
   * 保存菜单数据到本地缓存
   */
  function saveMenuData() {
    localCache.set(CACHE_KEY, menus.value)
  }

  /**
   * 加载菜单数据（混合数据源策略）
   */
  async function loadMenuData() {
    try {
      const apiData = await fetchMenuFromAPI()

      if (apiData && apiData.length > 0) {
        const cachedData = localCache.get<MenuNode[]>(CACHE_KEY)

        if (cachedData && cachedData.length > 0) {
          menus.value = mergeMenuData(apiData, cachedData)
        } else {
          menus.value = apiData
        }

        return
      }
    } catch (error) {
      console.warn('⚠️ 后端 API 请求失败，使用本地缓存:', error)
    }

    // API 失败时的降级策略
    const cached = localCache.get<MenuNode[]>(CACHE_KEY)

    if (cached && Array.isArray(cached) && cached.length > 0) {
      menus.value = cached
    } else {
      menus.value = cloneTree(DEFAULT_MENU)
      saveMenuData()
    }
  }

  /**
   * 重置为默认菜单
   */
  function resetToDefault() {
    menus.value = cloneTree(DEFAULT_MENU)
    saveMenuData()
  }

  return {
    menus,
    loadMenuData,
    saveMenuData,
    resetToDefault,
  }
}
