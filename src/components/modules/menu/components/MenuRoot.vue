<script setup lang="ts">
/**
 * MenuRoot - 菜单根组件
 *
 * 菜单系统的容器组件,负责接收菜单数据并渲染
 * 类似 navbar/index.vue 的角色
 */

import { computed } from 'vue'
import { Menubar } from '@/components/ui/menubar'
import MenuRender from './MenuRender.vue'
import type { MenuNode } from '@/types'
import { useAppStore } from '@/stores'
import { MENU_THEMES, type MenuTheme, type MenuThemeConfig } from '../data/menu-themes'

/**
 * Props 定义
 */
interface MenuRootProps {
  /** 菜单节点数组 */
  menus: MenuNode[]
  /** 主题类型 */
  theme?: MenuTheme
  /** 自定义主题配置 */
  menuConfig?: Partial<MenuThemeConfig>
}

const props = withDefaults(defineProps<MenuRootProps>(), {
  theme: 'glass',
  menuConfig: undefined,
})

const appStore = useAppStore()

// 合并配置:自定义配置优先,否则使用主题配置
const finalConfig = computed<MenuThemeConfig>(() => {
  const themeConfig = MENU_THEMES[props.theme] ?? MENU_THEMES.glass
  if (props.menuConfig) {
    return {
      ...themeConfig,
      ...props.menuConfig,
    }
  }
  return themeConfig
})

// 动态计算菜单样式
const menuStyle = computed(() => ({
  background: appStore.isDark ? finalConfig.value.dark : finalConfig.value.light,
  backdropFilter: `blur(${finalConfig.value.blur})`,
  borderBottom: `1px solid ${appStore.isDark ? finalConfig.value.darkBorderColor : finalConfig.value.borderColor}`,
  padding: finalConfig.value.padding,
}))

function sortMenus(nodes: MenuNode[]) {
  return [...nodes]
    .filter((node) => !node.hidden)
    .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
}

const leftMenus = computed(() => sortMenus(props.menus.filter((node) => node.position !== 'right')))
const rightMenus = computed(() =>
  sortMenus(props.menus.filter((node) => node.position === 'right'))
)
</script>

<template>
  <!-- Menubar 容器 -->
  <Menubar class="menu-root" :style="menuStyle">
    <div class="flex min-w-0 items-center gap-1">
      <MenuRender v-for="node in leftMenus" :key="node.id" :node="node" />
    </div>

    <div class="flex-1" />

    <div class="flex min-w-0 items-center gap-1">
      <MenuRender v-for="node in rightMenus" :key="node.id" :node="node" />
    </div>
  </Menubar>
</template>

<style scoped>
.menu-root {
  display: flex;
  align-items: center;
  width: 100%;
  transition: all 0.3s ease;
}
</style>
