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
import type { SearchEngine } from '@/types'

const props = defineProps<{
  engines?: SearchEngine[]
}>()

const keyword = ref('')
const engine = ref('google')

// 计算当前选中的标签名称
const engineLabel = computed(() => {
  return props.engines?.find((e) => e.id === engine.value)?.name || 'Google'
})

// 处理引擎切换
function handleEngineChange(label: string) {
  const e = props.engines?.find((item) => item.name === label)
  if (e) {
    engine.value = e.id
  }
}

function search() {
  if (!keyword.value.trim()) return

  const e = props.engines?.find((i) => i.id === engine.value)
  if (!e) return

  window.open(e.url + encodeURIComponent(keyword.value))
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 mb-8">
    <MorphingTabs
      v-if="engines && engines.length > 0"
      :tabs="engines.map((e) => e.name)"
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
