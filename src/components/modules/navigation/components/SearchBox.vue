<script setup lang="ts">
/**
 * 功能：搜索组件
 * 结果：支持搜索跳转
 * 设计目的：统一搜索入口
 */

import { ref, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { MorphingTabs } from '@/components/inspira'
import { Search as SearchIcon } from 'lucide-vue-next'

const keyword = ref('')
const engine = ref('google')

const engines = [
  { label: 'Google', value: 'google', url: 'https://www.google.com/search?q=' },
  { label: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=' },
  { label: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=' },
]

// 计算当前选中的标签名称
const engineLabel = computed(() => {
  return engines.find((e) => e.value === engine.value)?.label || 'Google'
})

// 处理引擎切换
function handleEngineChange(label: string) {
  const e = engines.find((item) => item.label === label)
  if (e) {
    engine.value = e.value
  }
}

function search() {
  if (!keyword.value.trim()) return

  const e = engines.find((i) => i.value === engine.value)
  if (!e) return

  window.open(e.url + encodeURIComponent(keyword.value))
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 mb-8">
    <MorphingTabs
      :tabs="engines.map((e) => e.label)"
      :active-tab="engineLabel"
      @update:active-tab="handleEngineChange"
    />

    <div class="flex w-full max-w-xl gap-2">
      <Input v-model="keyword" placeholder="输入搜索内容..." @keyup.enter="search">
        <template #prefix>
          <SearchIcon class="w-4 h-4 text-muted-foreground" />
        </template>
      </Input>
      <Button @click="search">搜索</Button>
    </div>
  </div>
</template>
