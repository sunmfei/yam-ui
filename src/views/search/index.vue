<template>
  <SearchNavbar  />
  <div class="min-h-screen  flex items-center justify-center">

    <SearchBoxAI @search="handleSearch" />
  </div>


</template>


<script setup lang="ts">
import SearchBoxAI from '@/components/search/SearchEngineBox.vue'
import SearchNavbar from "@/views/search/components/SearchNavbar.vue";

/**
 * 接收搜索事件
 */
const handleSearch = (val: string) => {
  console.log('搜索关键词：', val)
  // 👉 这里跳转结果页
}
</script>
