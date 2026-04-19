<script setup lang="ts">
/**
 * Menu 模块主组件
 *
 * 动态菜单系统的统一入口
 * 支持多种菜单类型：ACTION、ROUTE、MENU、SELECT
 *
 * 设计参考：navbar/index.vue
 */

import { computed } from 'vue'
import { localCache, LocalCacheKey } from '@/utils/cache'
import type { MenuNode } from '@/types'
import MenuRoot from './components/MenuRoot.vue'

/**
 * Props 定义
 */
interface MenuProps {
  /** 自定义菜单数据（可选，默认使用 DEFAULT_MENU） */
  menus?: MenuNode[]
}

const props = withDefaults(defineProps<MenuProps>(), {
  menus: undefined,
})

/**
 * 获取菜单数据
 * 优先级：props.menus > localStorage > DEFAULT_MENU
 */
const menuData = computed<MenuNode[]>(() => {
  // 1. 如果传入了自定义菜单，直接使用
  if (props.menus) {
    return props.menus
  }

  /*  // 2. 尝试从本地缓存读取
  const cached = localCache.get<MenuNode[]>(LocalCacheKey.MENU_CONFIG)
  if (cached && cached.length > 0) {
    return cached
  }*/

  // 3. 使用默认菜单
  return []
})

/**
 * 保存菜单到本地缓存
 * @param menus - 菜单数据
 */
function saveMenus(menus: MenuNode[]) {
  localCache.set(LocalCacheKey.MENU_CONFIG, menus)
}

/**
 * 重置菜单为默认值
 */
function resetMenus() {
  localCache.remove(LocalCacheKey.MENU_CONFIG)
}

// 暴露方法供外部调用
defineExpose({
  saveMenus,
  resetMenus,
  menuData,
})
</script>

<template>
  <!-- 菜单根组件 -->
  <MenuRoot :menus="menuData" />
</template>
