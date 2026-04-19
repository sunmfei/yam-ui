<script setup lang="ts">
/**
 * 页面搜索处理
 * 功能：执行跳转
 * 结果：打开新页面
 * 设计目的：业务与组件解耦
 */
import { ref } from 'vue'

const engines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=' },
]

const keyword = ref('')

const handleSearch = (kw: string, engine: any) => {
  window.open(engine.url + encodeURIComponent(kw), '_blank')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
    <ModernSearch v-model="keyword" :engines="engines" @search="handleSearch" />
  </div>
</template>
