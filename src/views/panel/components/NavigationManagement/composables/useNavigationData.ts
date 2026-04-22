/**
 * useNavigationData - 导航数据管理 Composable
 *
 * 负责导航数据的加载、保存、合并等核心逻辑（扁平结构）
 */
import { ref } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import { navigationList as DEFAULT_NAVIGATION_LIST } from '@/views/home/data/NavigationData'
import { localCache } from '@/utils/cache/localCache'
import { getNavigations } from '@/api/navigation'
import { LocalCacheKey } from '@/types'

export function useNavigationData() {
  const CACHE_KEY = LocalCacheKey.NAVIGATION_CONFIG
  const navigations = ref<NavigationItem[]>([])

  /**
   * 克隆数组
   */
  function cloneList(data: NavigationItem[]): NavigationItem[] {
    return JSON.parse(JSON.stringify(data)) as NavigationItem[]
  }

  /**
   * 从后端 API 获取导航数据
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
   * 合并导航数据
   */
  function mergeNavigationData(
    apiData: NavigationItem[],
    cachedData: NavigationItem[]
  ): NavigationItem[] {
    const apiIds = new Set(apiData.map((item) => item.id))
    const uniqueCachedItems = cachedData.filter((item) => !apiIds.has(item.id))

    if (uniqueCachedItems.length === 0) {
      return apiData
    }

    return [...apiData, ...uniqueCachedItems]
  }

  /**
   * 保存导航数据到本地缓存
   */
  function saveNavigationData() {
    localCache.set(CACHE_KEY, navigations.value)
  }

  /**
   * 加载导航数据（混合数据源策略）
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
      // 将默认数据转换为扁平结构
      navigations.value = cloneList(DEFAULT_NAVIGATION_LIST)
      saveNavigationData()
    }
  }

  /**
   * 重置为默认导航
   */
  function resetToDefault() {
    navigations.value = cloneList(DEFAULT_NAVIGATION_LIST)
    saveNavigationData()
  }

  return {
    navigations,
    loadNavigationData,
    saveNavigationData,
    resetToDefault,
  }
}
