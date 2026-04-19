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

import { computed, defineAsyncComponent, watch } from 'vue'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'

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
 * 查找第一个可点击的节点（有 componentPath）
 */
const findFirstClickableNode = (list: PanelSection[]): string | null => {
  for (const item of list) {
    if (item.componentPath && !item.disabled) {
      return item.id
    }
    if (item.children) {
      const res = findFirstClickableNode(item.children)
      if (res) return res
    }
  }
  return null
}

/**
 * 初始化 active：如果为空，自动选中第一个可点击节点
 */
const initActive = () => {
  if (!props.active || props.active === '') {
    const firstId = findFirstClickableNode(props.sections)
    if (firstId) {
      emit('update:active', firstId)
    }
  }
}

// 监听 sections 变化，自动初始化
watch(
  () => props.sections,
  () => {
    initActive()
  },
  { immediate: true }
)

/**
 * 当前组件
 */
const activeComponent = computed(() => {
  const node = findNode(props.sections, props.active)

  if (!node) {
    console.warn('⚠️ 未找到 active 节点:', props.active)
    return null
  }

  const loader = loadPanelComponent(node?.componentPath)

  if (!loader) {
    console.warn('⚠️ 组件加载器为空:', node.componentPath)
    return null
  }

  return defineAsyncComponent(loader as () => Promise<unknown>)
})

/**
 * 侧边栏 Header 组件
 */
const sidebarHeaderComponent = computed(() => {
  // 查找第一个有 sidebarHeaderPath 的节点
  const findHeader = (list: PanelSection[]): string | null => {
    for (const item of list) {
      if (item.sidebarHeaderPath) return item.sidebarHeaderPath
      if (item.children) {
        const res = findHeader(item.children)
        if (res) return res
      }
    }
    return null
  }

  const headerPath = findHeader(props.sections)
  if (!headerPath) return null

  const loader = loadPanelComponent(headerPath)
  if (!loader) return null

  return defineAsyncComponent(loader as () => Promise<unknown>)
})

/**
 * 侧边栏 Footer 组件
 */
const sidebarFooterComponent = computed(() => {
  // 查找第一个有 sidebarFooterPath 的节点
  const findFooter = (list: PanelSection[]): string | null => {
    for (const item of list) {
      if (item.sidebarFooterPath) return item.sidebarFooterPath
      if (item.children) {
        const res = findFooter(item.children)
        if (res) return res
      }
    }
    return null
  }

  const footerPath = findFooter(props.sections)
  if (!footerPath) return null

  const loader = loadPanelComponent(footerPath)
  if (!loader) return null

  return defineAsyncComponent(loader as () => Promise<unknown>)
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
      <!-- 侧边栏 -->
      <Sidebar
        :side="side"
        :collapsible="collapsible ? 'icon' : 'none'"
        variant="sidebar"
        :class="[
          'border-r !bg-transparent [&_[data-sidebar=sidebar]]:bg-transparent',
          sidebarBgClass,
        ]"
      >
        <!-- Header -->
        <SidebarHeader>
          <slot name="sidebar-header">
            <component :is="sidebarHeaderComponent" v-if="sidebarHeaderComponent" />
            <div v-else-if="headerTitle" class="flex h-14 items-center gap-2 px-4">
              <span class="text-lg font-semibold">{{ headerTitle }}</span>
            </div>
          </slot>
        </SidebarHeader>

        <!-- Content -->
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <PanelMenuRecursive :items="sections" :active="active" @select="handleSelect" />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <!-- Footer -->
        <SidebarFooter>
          <slot name="sidebar-footer">
            <component :is="sidebarFooterComponent" v-if="sidebarFooterComponent" />
          </slot>
        </SidebarFooter>

        <!-- Rail -->
        <SidebarRail />
      </Sidebar>

      <!-- 主内容区 -->
      <SidebarInset class="bg-transparent">
        <div class="flex h-full flex-col" :class="contentBgClass">
          <!-- 顶部工具栏 -->
          <header
            v-if="showHeader"
            class="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
          >
            <div class="flex items-center gap-2 px-4">
              <SidebarTrigger :class="side === 'left' ? '-ml-1' : '-mr-1'" />
              <Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
              <div class="flex-1 text-lg font-semibold">
                <slot name="header" />
              </div>
              <slot name="header-actions" />
            </div>
          </header>

          <!-- 内容区 -->
          <main class="flex-1 overflow-auto">
            <div class="p-4 pt-0">
              <component :is="activeComponent" v-if="activeComponent" />
              <slot v-else />
            </div>
          </main>
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>
