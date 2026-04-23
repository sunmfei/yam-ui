<script setup lang="ts">
/**
 * 功能：分类切换（动效版）
 * 结果：带动画的标签切换
 * 设计目的：使用 Inspira UI MorphingTabs 增强交互体验
 */

import { MorphingTabs } from '@/components/inspira'

defineProps<{
  list: string[]
}>()

const model = defineModel<string>()
</script>

<template>
  <div class="mb-6">
    <MorphingTabs :tabs="list" :active-tab="model || ''" @update:active-tab="model = $event" />
  </div>
</template>
