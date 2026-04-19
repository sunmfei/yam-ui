<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { LocalCacheKey, type MenuNode, type NavigationItem } from '@/types'
import { DEFAULT_MENU } from './data/MenuData'
import { DEFAULT_NAVIGATION } from './data/NavigationData'
import LocalCache from '@/utils/cache/localCache.ts'
import AppMenubar from '@/components/modules/menu/index.vue'
import SearchBox from '@/views/searchBox/index.vue'
import { Globe, Search } from 'lucide-vue-next'
import { Dock } from '@/components/inspira'
import { SunNavigationCarousel } from '@/components/business'

const menuNodes = ref<MenuNode[]>([])
const navigationItems = ref<NavigationItem[]>([])
const currentPage = ref(0) // 0: 搜索页, 1: 导航页

onMounted(() => {
  menuNodes.value = getMenuData()
  navigationItems.value = getNavigationData()
})

const getMenuData = () => {
  const localMenuData = LocalCache.get<MenuNode[]>(LocalCacheKey.MENU_CONFIG)
  return localMenuData && localMenuData.length > 0 ? localMenuData : DEFAULT_MENU
}

const getNavigationData = () => {
  const localNavData = LocalCache.get<NavigationItem[]>(LocalCacheKey.NAVIGATION_CONFIG)
  return localNavData && localNavData.length > 0 ? localNavData : DEFAULT_NAVIGATION || []
}

// 切换到指定页面
function goToPage(page: number) {
  currentPage.value = page
}

// Dock 菜单项
const dockItems = computed(() => [
  {
    icon: Search,
    label: '搜索',
    onClick: () => goToPage(0),
  },
  {
    icon: Globe,
    label: '导航',
    onClick: () => goToPage(1),
  },
])
</script>

<template>
  <div class="relative h-screen w-full overflow-hidden to-muted/20">
    <!-- 顶部菜单栏 -->
    <AppMenubar :menus="menuNodes" />

    <!-- 页面内容容器 -->
    <div class="relative h-[calc(100vh-64px)] overflow-hidden">
      <!-- 第一页：搜索 -->
      <Transition name="page-slide" mode="out-in">
        <div v-if="currentPage === 0" key="search" class="absolute inset-0">
          <SearchBox />
        </div>
      </Transition>

      <!-- 第二页：导航 -->
      <Transition name="page-slide" mode="out-in">
        <div v-if="currentPage === 1" key="navigation" class="absolute inset-0 overflow-y-auto p-6">
          <div class="mx-auto max-w-6xl">
            <!-- 页面标题 -->
            <div class="mb-8 text-center">
              <div class="flex items-center justify-center gap-3">
                <Globe class="h-8 w-8 text-primary" />
                <h1 class="text-3xl font-bold tracking-tight">网址导航</h1>
              </div>
              <p class="mt-2 text-muted-foreground">快速访问常用网站</p>
            </div>

            <!-- Sun Navigation Carousel with Expandable Gallery -->
            <SunNavigationCarousel :items="navigationItems" />
          </div>
        </div>
      </Transition>
    </div>

    <!-- Dock 导航 -->
    <div class="fixed bottom-8 left-1/2 z-50 -translate-x-1/2">
      <Dock :items="dockItems" :magnification="60" :distance="140" />
    </div>
  </div>
</template>

<style scoped>
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.98);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.98);
}
</style>
