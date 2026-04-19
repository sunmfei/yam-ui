<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LocalCacheKey } from '@/types'

import { type MenuNode } from '@/types'

import { DEFAULT_MENU } from './data/MenuData'
import LocalCache from '@/utils/cache/localCache.ts'
import AppMenubar from '@/components/modules/menu/index.vue'

import SearchBox from '@/views/searchBox/index.vue'

const menuNodes = ref<MenuNode[]>([])

onMounted(() => {
  menuNodes.value = getMenuData()
})

const getMenuData = () => {
  const localMenuData = LocalCache.get<MenuNode[]>(LocalCacheKey.MENU_CONFIG)
  // 优先使用缓存数据，如果缓存不存在则使用默认数据
  return localMenuData && localMenuData.length > 0 ? localMenuData : DEFAULT_MENU
}
</script>
<template>
  <div class="h-screen w-full overflow-hidden bg-transparent">
    <AppMenubar :menus="menuNodes" />
    <SearchBox />
  </div>
</template>
