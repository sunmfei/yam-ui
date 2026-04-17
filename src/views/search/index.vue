<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1 flex items-center justify-center">
      <SearchEngineBox @search="handleSearch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchEngineBox from '@/components/search/SearchEngineBox.vue'

/**
 * 接收搜索事件
 */
const handleSearch = (val: string) => {
  console.log('搜索关键词：', val)
  // 👉 这里跳转结果页
}
</script>
