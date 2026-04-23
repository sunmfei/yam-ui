/**
 * 功能：导航页面数据管理
 * 结果：提供响应式导航数据和分类过滤
 * 设计目的：分离数据逻辑与视图
 */

import { computed } from 'vue'
import type { NavigationItem } from '../data/navigation.type'
import { navigationList } from '@/components/modules'

export function useNavigationData() {
  // 使用默认导航数据
  const navigationListRef = navigationList

  // 计算分类列表
  const categoryList = computed(() => {
    const set = new Set(navigationListRef.map((item: NavigationItem) => item.category || ''))
    return ['全部', ...Array.from(set).filter(Boolean)]
  })

  // 根据分类过滤
  const getFilteredList = (category: string) => {
    if (category === '全部') return navigationListRef
    return navigationListRef.filter((item: NavigationItem) => item.category === category)
  }

  return {
    navigationList: navigationListRef,
    categoryList,
    getFilteredList,
  }
}
