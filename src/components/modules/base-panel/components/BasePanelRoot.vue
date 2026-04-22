<script setup lang="ts">
/**
 * BasePanelRoot - 闈㈡澘鏍圭粍浠讹紙鏈€缁堢増锛?
 *
 * 鍔熻兘锛?
 * 1. 绠＄悊鑿滃崟鐘舵€?
 * 2. 鍔ㄦ€佸姞杞界粍浠?
 * 3. 鎵胯浇鏁翠綋甯冨眬
 *
 * 鎵ц�缁撴灉锛?
 * 瀹屾暣鐨勯厤缃�┍鍔ㄩ〉闈㈢郴缁?
 *
 * 璁捐�鐩�殑锛?
 * 灏嗚彍鍗曘€佽�涓恒€佸唴瀹圭粺涓€鍏ュ彛
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
  headerTitle: '璁剧疆',
  showHeader: true,
  sidebarBgClass: 'bg-sidebar/80 backdrop-blur-xl',
  contentBgClass: 'bg-background/60 backdrop-blur-xl',
})

const emit = defineEmits<{
  'update:active': [string]
}>()

/**
 * 鏌ユ壘鑺傜偣
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
 * 鏌ユ壘绗�竴涓�彲鐐瑰嚮鐨勮妭鐐癸紙鏈?componentPath锛?
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
 * 鍒濆�鍖?active锛氬�鏋滀负绌猴紝鑷�姩閫変腑绗�竴涓�彲鐐瑰嚮鑺傜偣
 */
const initActive = () => {
  if (!props.active || props.active === '') {
    const firstId = findFirstClickableNode(props.sections)
    if (firstId) {
      emit('update:active', firstId)
    }
  }
}

// 鐩戝惉 sections 鍙樺寲锛岃嚜鍔ㄥ垵濮嬪寲
watch(
  () => props.sections,
  () => {
    initActive()
  },
  { immediate: true }
)

/**
 * 褰撳墠缁勪欢
 */
const activeComponent = computed(() => {
  const node = findNode(props.sections, props.active)

  if (!node) {
    console.warn('鈿狅笍 鏈�壘鍒?active 鑺傜偣:', props.active)
    return null
  }

  const loader = loadPanelComponent(node?.componentPath)

  if (!loader) {
    console.warn('鈿狅笍 缁勪欢鍔犺浇鍣ㄤ负绌?', node.componentPath)
    return null
  }

  return defineAsyncComponent(loader as any)
})

/**
 * 渚ц竟鏍?Header 缁勪欢
 */
const sidebarHeaderComponent = computed(() => {
  // 鏌ユ壘绗�竴涓�湁 sidebarHeaderPath 鐨勮妭鐐?
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

  return defineAsyncComponent(loader as any)
})

/**
 * 渚ц竟鏍?Footer 缁勪欢
 */
const sidebarFooterComponent = computed(() => {
  // 鏌ユ壘绗�竴涓�湁 sidebarFooterPath 鐨勮妭鐐?
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

  return defineAsyncComponent(loader as any)
})

/**
 * 鍔ㄦ€佽�绠椾晶杈规爮鏍峰紡
 */
const sidebarStyle = computed(() => ({
  '--sidebar-width': props.sidebarWidth,
}))

/**
 * 閫夋嫨鑿滃崟
 */
const handleSelect = (id: string) => {
  emit('update:active', id)
}
</script>

<template>
  <SidebarProvider>
    <div class="flex h-screen w-full" :style="sidebarStyle">
      <!-- 渚ц竟鏍?-->
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

      <!-- 涓诲唴瀹瑰尯 -->
      <SidebarInset class="bg-transparent">
        <div class="flex h-full flex-col" :class="contentBgClass">
          <!-- 椤堕儴宸ュ叿鏍?-->
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

          <!-- 鍐呭�鍖?-->
          <main class="min-h-0 flex-1 overflow-auto">
            <div class="relative h-full min-h-0 p-4 pt-0">
              <component :is="activeComponent" v-if="activeComponent" />
              <slot v-else />
            </div>
          </main>
        </div>
      </SidebarInset>
    </div>
  </SidebarProvider>
</template>
