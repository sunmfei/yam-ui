<script setup lang="ts">
/**
 * 功能：页面入口
 * 结果：整合所有模块
 * 设计目的：统一状态管理
 */

import { ref, computed } from 'vue'
import NavHeader from './components/NavHeader.vue'
import SearchBox from './components/SearchBox.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import NavigationGrid from './components/NavigationGrid.vue'
import { navigationList } from './data/navigation.data'

const activeCategory = ref('全部')

// 计算分类列表
const categoryList = computed(() => {
  const set = new Set(navigationList.map((i) => i.category))
  return ['全部', ...Array.from(set)]
})

// 计算过滤后的列表
const filterList = computed(() => {
  if (activeCategory.value === '全部') return navigationList
  return navigationList.filter((i) => i.category === activeCategory.value)
})
</script>

<template>
  <div class="p-6 space-y-6 max-w-7xl mx-auto">
    <NavHeader />

    <SearchBox />

    <CategoryTabs v-model="activeCategory" :list="categoryList" />

    <NavigationGrid :list="filterList" />
  </div>
</template>
