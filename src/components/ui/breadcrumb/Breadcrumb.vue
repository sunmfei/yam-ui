<template>
  <nav class="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
    <template v-for="(item, index) in items" :key="index">
      <!-- 分隔符 -->
      <ChevronRight v-if="index > 0" class="h-4 w-4 text-muted-foreground" />

      <!-- 面包屑项 -->
      <component
        :is="item.path ? 'router-link' : 'span'"
        v-bind="
          item.path
            ? {
                to: item.path,
                class: 'text-muted-foreground hover:text-foreground transition-colors',
              }
            : { class: 'text-foreground font-medium' }
        "
        @click="item.onClick"
      >
        {{ item.title }}
      </component>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next'

export interface BreadcrumbItem {
  /** 显示文本 */
  title: string
  /** 路由路径（可选） */
  path?: string
  /** 点击回调（可选） */
  onClick?: () => void
}

interface Props {
  /** 面包屑项列表 */
  items: BreadcrumbItem[]
}

defineProps<Props>()
</script>
