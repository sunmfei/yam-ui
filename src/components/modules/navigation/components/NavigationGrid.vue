<script setup lang="ts">
/**
 * 功能：网格布局
 * 结果：展示卡片列表
 * 设计目的：统一布局结构
 */

import type { NavigationItem } from '../data/navigation.data'
import NavigationCard from './NavigationCard.vue'

defineProps<{
  list: NavigationItem[]
}>()
</script>

<template>
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
    <NavigationCard v-for="item in list" :key="item.id" :item="item" />
  </div>
</template>
