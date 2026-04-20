<script setup lang="ts">
/**
 * 功能：分类切换
 * 结果：控制数据过滤
 * 设计目的：统一分类入口
 */

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

defineProps<{
  list: string[]
}>()

const model = defineModel<string>()
</script>

<template>
  <Tabs v-model="model" class="mb-6">
    <TabsList class="w-full justify-start overflow-x-auto">
      <TabsTrigger v-for="item in list" :key="item" :value="item">
        {{ item }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
