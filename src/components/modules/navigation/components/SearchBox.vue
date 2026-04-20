<script setup lang="ts">
/**
 * 功能：搜索组件
 * 结果：支持搜索跳转
 * 设计目的：统一搜索入口
 */

import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search as SearchIcon } from 'lucide-vue-next'

const keyword = ref('')
const engine = ref('google')

const engines = [
  { label: 'Google', value: 'google', url: 'https://www.google.com/search?q=' },
  { label: '百度', value: 'baidu', url: 'https://www.baidu.com/s?wd=' },
  { label: 'Bing', value: 'bing', url: 'https://www.bing.com/search?q=' },
]

function search() {
  if (!keyword.value.trim()) return

  const e = engines.find((i) => i.value === engine.value)
  if (!e) return

  window.open(e.url + encodeURIComponent(keyword.value))
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 mb-8">
    <Tabs v-model="engine">
      <TabsList>
        <TabsTrigger v-for="item in engines" :key="item.value" :value="item.value">
          {{ item.label }}
        </TabsTrigger>
      </TabsList>
    </Tabs>

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
