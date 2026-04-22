<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { ExternalLink, Globe } from 'lucide-vue-next'
import { LocalCacheKey } from '@/types'
import { useLocalStorage } from '@vueuse/core'
import { navigationList as DEFAULT_NAVIGATION_LIST } from '@/views/home/data/NavigationData'

/**
 * NavigationPage - 网址导航展示页面
 */
defineOptions({
  name: 'NavigationPage',
})

// 从 localStorage 读取导航数据
const storedNavigations = useLocalStorage<NavigationItem[]>(
  LocalCacheKey.NAVIGATION_CONFIG,
  DEFAULT_NAVIGATION_LIST
)

// 按分类分组
const groupedNavigations = computed(() => {
  const groups: Record<string, NavigationItem[]> = {}
  storedNavigations.value.forEach((item) => {
    const category = item.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
  })
  return groups
})

// 打开链接
function openLink(item: NavigationItem) {
  window.open(item.url, '_blank')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
    <div class="mx-auto max-w-7xl space-y-8">
      <!-- 页面标题 -->
      <div class="space-y-2 text-center">
        <div class="flex items-center justify-center gap-3">
          <Globe class="h-8 w-8 text-primary" />
          <h1 class="text-3xl font-bold tracking-tight">网址导航</h1>
        </div>
        <p class="text-muted-foreground">快速访问常用网站</p>
      </div>

      <!-- 导航卡片 -->
      <div class="space-y-6">
        <Card
          v-for="(items, category) in groupedNavigations"
          :key="category"
          class="transition-all hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              {{ category }}
              <Badge variant="secondary" class="ml-2">
                {{ items.length }}
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <BaseButton
                v-for="item in items"
                :key="item.id"
                variant="outline"
                class="h-auto flex-col items-start gap-3 p-5 transition-all hover:scale-105 hover:shadow-md"
                @click="openLink(item)"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span v-if="item.icon" class="text-2xl">{{ item.icon }}</span>
                    <span class="font-semibold">{{ item.title }}</span>
                  </div>
                  <ExternalLink class="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
                <p
                  v-if="item.description"
                  class="line-clamp-2 text-left text-xs text-muted-foreground"
                >
                  {{ item.description }}
                </p>
              </BaseButton>
            </div>

            <!-- 空状态 -->
            <div
              v-if="!items || items.length === 0"
              class="py-8 text-center text-muted-foreground"
            >
              暂无导航项
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 无数据状态 -->
      <div v-if="Object.keys(groupedNavigations).length === 0" class="py-20 text-center">
        <Globe class="mx-auto h-16 w-16 text-muted-foreground/50" />
        <p class="mt-4 text-lg text-muted-foreground">暂无导航数据</p>
        <p class="mt-2 text-sm text-muted-foreground">请在导航管理中添加导航项</p>
      </div>
    </div>
  </div>
</template>
