<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import ExpandableGallery from '@/components/inspira/expandable-gallery/ExpandableGallery.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Props {
  items: NavigationItem[]
}

const props = defineProps<Props>()

// 过滤可见的分�?
const visibleItems = computed(() => {
  return props.items.filter((item) => !item.hidden && item.children && item.children.length > 0)
})
</script>

<template>
  <div class="mx-auto w-[85%] space-y-8">
    <Card
      v-for="category in visibleItems"
      :key="category.id"
      class="overflow-hidden border-0 bg-white/10 shadow-2xl backdrop-blur-xl transition-all hover:shadow-3xl dark:bg-black/10"
    >
      <!-- 卡片头部 -->
      <CardHeader
        class="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-muted/10"
      >
        <!-- 装饰性背�?-->
        <div class="pointer-events-none absolute inset-0">
          <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <div class="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
        </div>

        <div class="relative z-10">
          <CardTitle class="flex items-center gap-3">
            <span v-if="category.icon" class="text-3xl">{{ category.icon }}</span>
            <span>{{ category.title }}</span>
            <Badge variant="secondary" class="ml-2">{{ category.children?.length }} 个网址</Badge>
          </CardTitle>
          <p v-if="category.description" class="mt-2 text-sm text-muted-foreground">
            {{ category.description }}
          </p>
        </div>
      </CardHeader>

      <!-- 卡片内容 - Expandable Gallery -->
      <CardContent class="p-6">
        <div class="h-[125px]">
          <ExpandableGallery :items="category.children?.filter((c: NavigationItem) => !c.hidden) || []" />
        </div>
      </CardContent>
    </Card>

    <!-- 空状态 -->
    <div v-if="visibleItems.length === 0" class="py-20 text-center">
      <p class="text-lg text-muted-foreground">暂无导航数据</p>
      <p class="mt-2 text-sm text-muted-foreground">请在导航管理中添加导航项</p>
    </div>
  </div>
</template>

<style scoped>
/* 液态玻璃脉动动�?*/
@keyframes liquid-pulse {
  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.animate-pulse {
  animation: liquid-pulse 4s ease-in-out infinite;
}
</style>
