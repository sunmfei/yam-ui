<script setup lang="ts">
import { computed } from 'vue'
import type { NavigationItem } from '@/components/modules/navigation/data/navigation.type'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { ExternalLink, Globe } from 'lucide-vue-next'
import { LocalCacheKey } from '@/types'
import { useLocalStorage } from '@vueuse/core'
import { DEFAULT_NAVIGATION } from '@/views/home/data/NavigationData'

/**
 * NavigationPage - 网址导航展示页面
 */
defineOptions({
  name: 'NavigationPage',
})

// 从 localStorage 读取导航数据
const storedNavigations = useLocalStorage<NavigationItem[]>(
  LocalCacheKey.NAVIGATION_CONFIG,
  DEFAULT_NAVIGATION
)

// 过滤掉隐藏的导航项和分类
const visibleNavigations = computed(() => {
  return storedNavigations.value
    .filter((nav: NavigationItem) => !nav.hidden)
    .map((nav: NavigationItem) => ({
      ...nav,
      children: nav.children?.filter((child) => !child.hidden),
    }))
    .filter((nav: NavigationItem) => nav.children && nav.children.length > 0)
})

// 打开链接
function openLink(child: NavigationItem) {
  if (child.disabled) return

  const url = child.path
  const target = child.openInNewTab ? '_blank' : '_self'

  window.open(url, target)
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
          v-for="category in visibleNavigations"
          :key="category.id"
          class="transition-all hover:shadow-lg"
        >
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <span v-if="category.icon" class="text-2xl">{{ category.icon }}</span>
              {{ category.title }}
              <Badge v-if="category.children" variant="secondary" class="ml-2">
                {{ category.children.length }}
              </Badge>
            </CardTitle>
            <p v-if="category.description" class="text-sm text-muted-foreground">
              {{ category.description }}
            </p>
          </CardHeader>

          <CardContent>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <BaseButton
                v-for="child in category.children"
                :key="child.id"
                variant="outline"
                :disabled="child.disabled"
                class="h-auto flex-col items-start gap-3 p-5 transition-all hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                @click="openLink(child)"
              >
                <div class="flex w-full items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span v-if="child.icon" class="text-2xl">{{ child.icon }}</span>
                    <span class="font-semibold">{{ child.title }}</span>
                  </div>
                  <ExternalLink
                    v-if="child.openInNewTab"
                    class="h-4 w-4 shrink-0 text-muted-foreground"
                  />
                </div>
                <p
                  v-if="child.description"
                  class="line-clamp-2 text-left text-xs text-muted-foreground"
                >
                  {{ child.description }}
                </p>
              </BaseButton>
            </div>

            <!-- 空状态 -->
            <div
              v-if="!category.children || category.children.length === 0"
              class="py-8 text-center text-muted-foreground"
            >
              暂无导航项
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- 无数据状态 -->
      <div v-if="visibleNavigations.length === 0" class="py-20 text-center">
        <Globe class="mx-auto h-16 w-16 text-muted-foreground/50" />
        <p class="mt-4 text-lg text-muted-foreground">暂无导航数据</p>
        <p class="mt-2 text-sm text-muted-foreground">请在导航管理中添加导航项</p>
      </div>
    </div>
  </div>
</template>
