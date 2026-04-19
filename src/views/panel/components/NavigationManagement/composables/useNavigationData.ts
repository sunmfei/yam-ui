/**
 * useNavigationData - 菜单数据管理 Composable
 *
 * 负责菜单数据的加载、保存、合并等核心逻辑
 */
import { ref } from 'vue'
import type { NavigationItem } from '../types/NavigationItem'
import { DEFAULT_NAVIGATION } from '@/views/home/data/NavigationData'
import { localCache } from '@/utils/cache/localCache'
import { getNavigations } from '@/api/navigation'
import { LocalCacheKey } from '@/types'

export function useNavigationData() {
  const CACHE_KEY = LocalCacheKey.NAVIGATION_CONFIG
  const navigations = ref<NavigationItem[]>([])

  /**
   * 克隆树结构
   */
  function cloneTree(data: NavigationItem[]): NavigationItem[] {
    return JSON.parse(JSON.stringify(data)) as NavigationItem[]
  }

  /**
   * 从后端 API 获取菜单数据
   */
  async function fetchNavigationFromAPI(): Promise<NavigationItem[] | null> {
    try {
      const data = await getNavigations()
      return data.length > 0 ? data : null
    } catch (error) {
      console.error('API 请求失败:', error)
      throw error
    }
  }

  /**
   * 递归收集所有节点 ID
   */
  function collectAllIds(nodes: NavigationItem[], idSet: Set<string>): void {
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
  function mergeNavigationData(
    apiData: NavigationItem[],
    cachedData: NavigationItem[]
  ): NavigationItem[] {
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
  function saveNavigationData() {
    localCache.set(CACHE_KEY, navigations.value)
  }

  /**
   * 加载菜单数据（混合数据源策略）
   */
  async function loadNavigationData() {
    try {
      const apiData = await fetchNavigationFromAPI()

      if (apiData && apiData.length > 0) {
        const cachedData = localCache.get<NavigationItem[]>(CACHE_KEY)

        if (cachedData && cachedData.length > 0) {
          navigations.value = mergeNavigationData(apiData, cachedData)
        } else {
          navigations.value = apiData
        }

        return
      }
    } catch (error) {
      console.warn('⚠️ 后端 API 请求失败，使用本地缓存:', error)
    }

    // API 失败时的降级策略
    const cached = localCache.get<NavigationItem[]>(CACHE_KEY)

    if (cached && Array.isArray(cached) && cached.length > 0) {
      navigations.value = cached
    } else {
      navigations.value = cloneTree(DEFAULT_NAVIGATION)
      saveNavigationData()
    }
  }

  /**
   * 重置为默认菜单
   */
  function resetToDefault() {
    navigations.value = cloneTree(DEFAULT_NAVIGATION)
    saveNavigationData()
  }

  return {
    navigations,
    loadNavigationData,
    saveNavigationData,
    resetToDefault,
  }
}
