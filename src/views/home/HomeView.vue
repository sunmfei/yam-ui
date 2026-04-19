<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import BaseSwitch from '@/components/base/switch/BaseSwitch.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BACKGROUND_OPTIONS, LocalCacheKey } from '@/types'

import Search from '@/views/search/index.vue'
import AppNavbar from '@/components/modules/menu/index.vue'
import { type MenuNode } from '@/types'

import { DEFAULT_MENU } from './data/MenuData'
import LocalCache from '@/utils/cache/localCache.ts'

const menuNodes = ref<MenuNode[]>([])

onMounted(() => {
  menuNodes.value = getMenuData()
})

const getMenuData = () => {
  const localMenuData = LocalCache.get<MenuNode[]>(LocalCacheKey.MENU_CONFIG)
  // 优先使用缓存数据，如果缓存不存在则使用默认数据
  return localMenuData && localMenuData.length > 0 ? localMenuData : DEFAULT_MENU
}

const appStore = useAppStore()

// 使用共享的背景选项
const backgroundOptions = BACKGROUND_OPTIONS

// 图标选择器状态
const selectedIcon = ref('Home')
</script>

<template>
  <div class="min-h-screen bg-transparent overflow-hidden">
    <AppNavbar :menus="menuNodes" />
    <Search />
    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
      <h2 class="mb-8 text-center text-3xl font-bold">Features</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>🚀 Fast</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 dark:text-gray-400">
              Built with Vite for lightning-fast development and builds
            </p>
          </CardContent>
          <CardFooter>
            <div class="flex gap-2">
              <Badge variant="default">Vite</Badge>
              <Badge variant="secondary">Fast</Badge>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🎨 Beautiful</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 dark:text-gray-400">
              Styled with TailwindCSS for modern, responsive designs
            </p>
          </CardContent>
          <CardFooter>
            <div class="flex gap-2">
              <Badge variant="default">TailwindCSS</Badge>
              <Badge variant="secondary">Responsive</Badge>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>💪 Type Safe</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-gray-600 dark:text-gray-400">
              Full TypeScript support for better developer experience
            </p>
          </CardContent>
          <CardFooter>
            <div class="flex gap-2">
              <Badge variant="destructive">TypeScript</Badge>
              <Badge variant="secondary">Safe</Badge>
            </div>
          </CardFooter>
        </Card>
      </div>

      <!-- Theme Demo Section -->
      <div class="mt-16">
        <h2 class="mb-8 text-center text-3xl font-bold">Theme & Background Demo</h2>
        <Card class="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>shadcn-vue Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="mb-4 text-gray-600 dark:text-gray-400">
              Try switching the theme using the button in the navbar. All shadcn-vue components will
              automatically adapt to the current theme.
            </p>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span>Current Theme:</span>
                <Badge :variant="appStore.isDark ? 'secondary' : 'default'">
                  {{ appStore.isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️' }}
                </Badge>
              </div>
              <div class="flex items-center justify-between">
                <span>Toggle Theme:</span>
                <BaseSwitch v-model="appStore.isDark" />
              </div>
              <div class="flex items-center justify-between">
                <span>Background Type:</span>
                <Select v-model="appStore.backgroundType">
                  <SelectTrigger class="w-[150px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="item in backgroundOptions"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="flex gap-2">
                <BaseButton variant="default">Primary Button</BaseButton>
                <BaseButton variant="destructive">Error Button</BaseButton>
              </div>

              <!-- 图标选择器测试 -->
              <div class="pt-4 border-t">
                <h3 class="mb-3 text-lg font-semibold">Icon Picker Test</h3>
                <div class="flex items-center gap-3">
                  <SunIconPicker v-model="selectedIcon" />
                  <Badge variant="outline">{{ selectedIcon }}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
