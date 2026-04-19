<script setup lang="ts">
/**
 * BasePanelRoot - 面板根组件（最终版）
 *
 * 功能：
 * 1. 管理菜单状态
 * 2. 动态加载组件
 * 3. 承载整体布局
 *
 * 执行结果：
 * 完整的配置驱动页面系统
 *
 * 设计目的：
 * 将菜单、行为、内容统一入口
 */

import { computed, defineAsyncComponent } from 'vue'
import {
  SidebarProvider,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

import PanelMenuRecursive from './PanelMenuRecursive.vue'
import type { PanelSection } from '@/types'
import { loadPanelComponent } from '@/components/modules/base-panel/composables/panel-component.loader.ts'

interface Props {
  sections: PanelSection[]
  active?: string
  side?: 'left' | 'right'
  collapsible?: boolean
  sidebarWidth?: string
  headerTitle?: string
  showHeader?: boolean
  sidebarBgClass?: string
  contentBgClass?: string
}

const props = withDefaults(defineProps<Props>(), {
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
  'update:active': [string]
}>()

/**
 * 查找节点
 */
const findNode = (list: PanelSection[], id?: string): PanelSection | null => {
  if (!id) return null
  for (const item of list) {
    if (item.id === id) return item
    if (item.children) {
      const res = findNode(item.children, id)
      if (res) return res
    }
  }
  return null
}

/**
 * 当前组件
 */
const activeComponent = computed(() => {
  const node = findNode(props.sections, props.active)
  const loader = loadPanelComponent(node?.componentPath)

  if (!loader) return null

  return defineAsyncComponent(loader as () => Promise<any>)
})

/**
 * 动态计算侧边栏样式
 */
const sidebarStyle = computed(() => ({
  '--sidebar-width': props.sidebarWidth,
}))

/**
 * 选择菜单
 */
const handleSelect = (id: string) => {
  emit('update:active', id)
}
</script>

<template>
  <SidebarProvider>
    <div class="flex h-screen w-full" :style="sidebarStyle">
      <!-- 侧边栏 - 左侧 -->
      <Sidebar
        :side="side"
        :collapsible="collapsible ? 'icon' : 'none'"
        class="border-r !bg-transparent [&_[data-sidebar=sidebar]]:bg-transparent"
      >
        <div class="flex h-full w-full flex-col" :class="sidebarBgClass">
          <SidebarGroup>
            <SidebarGroupLabel>{{ headerTitle }}</SidebarGroupLabel>

            <SidebarGroupContent>
              <PanelMenuRecursive :items="sections" :active="active" @select="handleSelect" />
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </Sidebar>

      <!-- 主内容区 -->
      <SidebarInset class="bg-transparent">
        <div class="flex h-full flex-col" :class="contentBgClass">
          <!-- 顶部工具栏 -->
          <header
            v-if="showHeader"
            class="flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear"
          >
            <SidebarTrigger :class="side === 'left' ? '-ml-1' : '-mr-1'" />
            <div class="flex-1 text-lg font-semibold">
              <slot name="header" />
            </div>
            <slot name="header-actions" />
          </header>

          <!-- 内容区 -->
          <main class="flex-1 overflow-auto p-6">
            <component :is="activeComponent" v-if="activeComponent" />
            <slot v-else />
          </main>
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>
