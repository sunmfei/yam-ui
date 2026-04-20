<script setup lang="ts">
/**
 * 功能：导航卡片
 * 结果：展示网站信息
 * 设计目的：复用卡片结构
 */

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { NavigationItem } from '../data/navigation.data'
import * as Icons from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps<{
  item: NavigationItem
}>()

function open() {
  window.open(props.item.url, '_blank')
}

// 动态获取图标组件
const IconComponent = computed(() => {
  if (!props.item.icon) return null
  return (Icons as any)[props.item.icon] || null
})
</script>

<template>
  <Card
    class="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
    @click="open"
  >
    <CardContent class="p-4 space-y-3">
      <!-- 图标 -->
      <div
        v-if="IconComponent"
        class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
      >
        <component :is="IconComponent" class="w-5 h-5 text-primary" />
      </div>

      <!-- 标题 -->
      <div class="font-semibold truncate" :title="item.title">
        {{ item.title }}
      </div>

      <!-- 描述 -->
      <div class="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
        {{ item.description }}
      </div>

      <!-- 分类标签 -->
      <Badge variant="secondary" class="text-xs">
        {{ item.category }}
      </Badge>
    </CardContent>
  </Card>
</template>
