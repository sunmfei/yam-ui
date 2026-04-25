<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { LocalCacheKey, type MenuNode } from '@/types'
import { getDefaultMenu } from './data/MenuData'
import LocalCache from '@/utils/cache/localCache.ts'
import AppMenubar from '@/components/modules/menu/index.vue'
import SearchBox from '@/views/searchBox/index.vue'
import { Globe, Search } from 'lucide-vue-next'
import { Dock } from '@/components/inspira'
import {
  type NavigationItem,
  navigationList,
  NavigationPage,
} from '@/components/modules/navigation'
import { useUserStore } from '@/stores'

const menuNodes = ref<MenuNode[]>([])
const navigationItem = ref<NavigationItem[]>([])
const currentPage = ref(0) // 0: 搜索页, 1: 导航页
const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  menuNodes.value = getMenuData()
  navigationItem.value = getNavigationData()
})

const getMenuData = () => {
  const localMenuData = LocalCache.get<MenuNode[]>(LocalCacheKey.MENU_CONFIG)
  return localMenuData && localMenuData.length > 0 ? localMenuData : getDefaultMenu()
}

const getNavigationData = () => {
  const localNavigationData = LocalCache.get<NavigationItem[]>(LocalCacheKey.NAVIGATION_CONFIG)
  return localNavigationData && localNavigationData.length > 0
    ? localNavigationData
    : navigationList
}

const displayMenus = computed<MenuNode[]>(() => {
  const dynamicMenus = menuNodes.value.map((node) => {
    // 如果是认证菜单，根据登录状态动态更新
    if (node.actionKey === 'menu-auth-action') {
      return {
        ...node,
        id: userStore.isLoggedIn ? 'auth-logout' : 'auth-login',
        name: userStore.isLoggedIn ? '退出' : '登录',
        icon: userStore.isLoggedIn ? 'LogOut' : 'LogIn',
      }
    }
    return { ...node }
  })
  return dynamicMenus
})

const engines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=' },
  { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=' },
]

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
    <AppMenubar :menus="displayMenus" />

    <!-- 页面内容容器 -->
    <div class="relative h-[calc(100vh-64px)] overflow-hidden">
      <!-- 第一页：搜索 -->
      <Transition name="page-slide" mode="out-in">
        <div v-if="currentPage === 0" key="search" class="absolute inset-0">
          <SearchBox :engines="engines" />
        </div>
      </Transition>

      <!-- 第二页：导航 -->
      <Transition name="page-slide" mode="out-in">
        <div v-if="currentPage === 1" key="navigation" class="absolute inset-0">
          <NavigationPage :data="navigationItem" :engines="engines" />
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

/* 隐藏滚动条 */
.overflow-y-auto {
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-y-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
