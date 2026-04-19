<script setup lang="ts">
/**
 * BasePanel 模块主组件
 *
 * 侧边栏布局系统的统一入口
 * 支持动态配置侧边栏方向、宽度、样式等
 */

import BasePanelRoot from './components/BasePanelRoot.vue'
import type { PanelSection } from '@/types'

/**
 * Props 定义
 */
interface BasePanelProps {
  /** 设置项配置列表 */
  sections: PanelSection[]
  /** 当前激活的设置项 */
  active?: string
  /** 侧边栏位置：left | right */
  side?: 'left' | 'right'
  /** 是否可折叠 */
  collapsible?: boolean
  /** 侧边栏宽度 */
  sidebarWidth?: string
  /** 头部标题 */
  headerTitle?: string
  /** 是否显示头部 */
  showHeader?: boolean
  /** 侧边栏背景样式（支持透明度配置） */
  sidebarBgClass?: string
  /** 内容区背景样式 */
  contentBgClass?: string
}

withDefaults(defineProps<BasePanelProps>(), {
  active: '',
  side: 'left',
  collapsible: true,
  sidebarWidth: '240px',
  headerTitle: '设置',
  showHeader: true,
  sidebarBgClass: 'bg-sidebar/80 backdrop-blur-xl',
  contentBgClass: 'bg-background/60 backdrop-blur-xl',
})

const emit = defineEmits<{
  'update:active': [sectionId: string]
}>()
</script>

<template>
  <!-- 面板根组件 -->
  <BasePanelRoot
    :sections="sections"
    :active="active"
    :side="side"
    :collapsible="collapsible"
    :sidebar-width="sidebarWidth"
    :header-title="headerTitle"
    :show-header="showHeader"
    :sidebar-bg-class="sidebarBgClass"
    :content-bg-class="contentBgClass"
    @update:active="emit('update:active', $event)"
  >
    <slot />
  </BasePanelRoot>
</template>
