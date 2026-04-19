<script setup lang="ts">
/**
 * MenuRoot - 菜单根组件
 *
 * 菜单系统的容器组件，负责接收菜单数据并渲染
 * 类似 navbar/index.vue 的角色
 */

import { Menubar } from '@/components/ui/menubar'
import MenuRender from './MenuRender.vue'
import type { MenuNode } from '@/types'

/**
 * Props 定义
 */
interface MenuRootProps {
  /** 菜单节点数组 */
  menus: MenuNode[]
}

defineProps<MenuRootProps>()
</script>

<template>
  <!-- Menubar 容器 -->
  <Menubar class="menu-root">
    <!-- 递归渲染每个顶级菜单项 -->
    <MenuRender v-for="node in menus" :key="node.id" :node="node" />
  </Menubar>
</template>

<style scoped>
/* 可以在这里添加自定义样式 */
</style>
