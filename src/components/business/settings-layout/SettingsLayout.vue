<script setup lang="ts">
/**
 * SettingsLayout - 设置页面布局组件
 *
 * 特性:
 * - 侧边栏支持左右方向切换
 * - 支持自定义侧边栏宽度
 * - 支持自定义头部标题
 * - 支持默认选中项
 * - 使用 shadcn-vue Sidebar 组件实现
 */
import { ref, computed } from 'vue'
import {
  SidebarProvider,
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'

export interface SettingsSection {
  id: string
  label: string
  icon: any
}

const props = withDefaults(
  defineProps<{
    /** 侧边栏位置：left | right */
    side?: 'left' | 'right'
    /** 是否可折叠 */
    collapsible?: boolean
    /** 默认选中的设置项 */
    defaultActive?: string
    /** 设置项配置列表 */
    sections: SettingsSection[]
    /** 头部标题 */
    headerTitle?: string
    /** 是否显示头部 */
    showHeader?: boolean
    /** 侧边栏背景样式（支持透明度配置） */
    sidebarBgClass?: string
    /** 内容区背景样式 */
    contentBgClass?: string
  }>(),
  {
    side: 'left',
    collapsible: true,
    defaultActive: '',
    headerTitle: '系统设置',
    showHeader: true,
    sidebarBgClass: 'bg-sidebar/80 backdrop-blur-xl',
    contentBgClass: 'bg-background/60 backdrop-blur-xl',
  }
)

const emit = defineEmits<{
  'update:active': [sectionId: string]
}>()

// 当前激活的设置项
const activeSection = ref(props.defaultActive || props.sections[0]?.id || '')

// 获取当前激活的标签
const activeLabel = computed(() => {
  return props.sections.find((s) => s.id === activeSection.value)?.label || props.headerTitle
})

// 切换设置项
const switchSection = (sectionId: string) => {
  activeSection.value = sectionId
  emit('update:active', sectionId)
}
</script>

<template>
  <SidebarProvider>
    <div class="flex h-screen w-full">
      <!-- 侧边栏 - 左侧 -->
      <Sidebar
        v-if="side === 'left'"
        :collapsible="collapsible ? 'icon' : 'none'"
        class="border-r !bg-transparent [&_[data-sidebar=sidebar]]:bg-transparent"
      >
        <div class="flex h-full w-full flex-col" :class="sidebarBgClass">
          <SidebarGroup>
            <SidebarGroupLabel>{{ headerTitle }}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="section in sections" :key="section.id">
                  <SidebarMenuButton
                    :data-active="activeSection === section.id"
                    @click="switchSection(section.id)"
                  >
                    <component :is="section.icon" class="h-4 w-4" />
                    <span>{{ section.label }}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
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
              <slot name="header" :active-label="activeLabel">
                {{ activeLabel }}
              </slot>
            </div>
            <slot name="header-actions" />
          </header>

          <!-- 设置内容区 -->
          <main class="flex-1 overflow-auto p-6">
            <slot :active-section="activeSection" />
          </main>
        </div>
      </SidebarInset>

      <!-- 侧边栏 - 右侧 -->
      <Sidebar
        v-if="side === 'right'"
        :collapsible="collapsible ? 'icon' : 'none'"
        class="border-l !bg-transparent [&_[data-sidebar=sidebar]]:bg-transparent"
      >
        <div class="flex h-full w-full flex-col" :class="sidebarBgClass">
          <SidebarGroup>
            <SidebarGroupLabel>{{ headerTitle }}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem v-for="section in sections" :key="section.id">
                  <SidebarMenuButton
                    :data-active="activeSection === section.id"
                    @click="switchSection(section.id)"
                  >
                    <component :is="section.icon" class="h-4 w-4" />
                    <span>{{ section.label }}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </Sidebar>
    </div>
  </SidebarProvider>
</template>
