<script setup lang="ts">
/**
 * 功能：页面入口
 * 结果：整合所有模块
 * 设计目的：统一状态管理
 */

import { ref, computed } from 'vue'
import MotionWrapper from './components/effect/MotionWrapper.vue'
import NavHeader from './components/NavHeader.vue'
import SearchBox from './components/SearchBox.vue'
import CategoryTabs from './components/CategoryTabs.vue'
import NavigationGrid from './components/NavigationGrid.vue'
import { useNavigationData } from './composables/useNavigationData'

const activeCategory = ref('全部')

// 使用导航数据管理
const { categoryList, getFilteredList } = useNavigationData()

// 计算过滤后的列表
const filterList = computed(() => getFilteredList(activeCategory.value))
</script>

<template>
  <MotionWrapper>
    <div class="h-screen flex flex-col bg-background/30">
      <!-- 固定区域 -->
      <div class="flex-shrink-0 p-6 space-y-6">
        <NavHeader />
        <SearchBox />
        <CategoryTabs v-model="activeCategory" :list="categoryList" />
      </div>

      <!-- 可滚动区域 -->
      <div class="flex-1 overflow-y-auto px-6 pb-32">
        <NavigationGrid :list="filterList" />
      </div>
    </div>
  </MotionWrapper>
</template>
