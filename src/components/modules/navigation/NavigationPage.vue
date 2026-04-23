<script setup lang="ts">
/**
 * 功能：页面入口
 * 结果：整合所有模块
 * 设计目的：统一状态管理
 */

import { ref, computed, type PropType } from 'vue'
import type { NavigationItem } from '@/components/modules'
import MotionWrapper from './components/effect/MotionWrapper.vue'
import NavHeader from './components/NavHeader.vue'
import SearchBox from './components/SearchBox.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import NavigationGrid from './components/NavigationGrid.vue'
import { useNavigationData } from './composables/useNavigationData'
import { useCacheStore } from '@/stores'
import { LocalCacheKey, type SearchEngine } from '@/types'

const props = defineProps({
  data: {
    type: Array as PropType<NavigationItem[]>,
    default: () => [],
  },
  engines: {
    type: Array as PropType<SearchEngine[]>,
    default: () => [],
  },
})

// 使用缓存 store
const cacheStore = useCacheStore()

// 合并缓存数据
const mergeData = computed(() => {
  const cachedData = cacheStore.getLocalCache<NavigationItem[]>(LocalCacheKey.NAVIGATION_CONFIG)
  if (cachedData && cachedData.length > 0) {
    return cachedData
  }
  return props.data || []
})

const activeCategory = ref('全部')

// 使用导航数据管理，传入合并后的数据
const { categoryList, getFilteredList } = useNavigationData(mergeData.value)

// 计算过滤后的列表
const filterList = computed(() => {
  const result = getFilteredList(activeCategory.value)
  return (Array.isArray(result) ? result : []) as NavigationItem[]
})
</script>

<template>
  <MotionWrapper>
    <div class="h-screen flex flex-col bg-background/30">
      <!-- 固定区域 -->
      <div class="flex-shrink-0 p-6 space-y-6">
        <NavHeader />
        <SearchBox :engines="engines" />
        <CategoryTabs v-model="activeCategory" :list="categoryList" />
      </div>

      <!-- 可滚动区域 -->
      <div class="flex-1 overflow-y-auto px-6 pb-32">
        <NavigationGrid :list="filterList" />
      </div>
    </div>
  </MotionWrapper>
</template>
