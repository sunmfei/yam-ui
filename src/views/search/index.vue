<template>
  <div class="min-h-screen flex flex-col">
    <nav class="search-navbar">
      <SearchNavbar v-for="node in menuNodes" :key="node.id" :node="node" />
    </nav>
    <div class="flex-1 flex items-center justify-center">
      <SearchEngineBox @search="handleSearch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { MenuNode } from '@/types/menu'
import SearchEngineBox from '@/components/search/SearchEngineBox.vue'
import SearchNavbar from '@/views/search/components/SearchNavbar.vue'
import { DEFAULT_MENU } from './data/MenuData'

const menuNodes = ref<MenuNode[]>([])

onMounted(() => {
  menuNodes.value = DEFAULT_MENU
})

/**
 * 接收搜索事件
 */
const handleSearch = (val: string) => {
  console.log('搜索关键词：', val)
  // 👉 这里跳转结果页
}
</script>

<style scoped lang="scss">
.search-navbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  .dark & {
    background: rgba(30, 41, 59, 0.3);
    border-color: rgba(255, 255, 255, 0.05);
  }
}
</style>
