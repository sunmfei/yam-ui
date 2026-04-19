<script setup lang="ts">
/**
 * SettingsView - 系统设置页面
 *
 * 使用 BasePanel 组件实现侧边栏布局
 * 通过 componentPath 动态加载面板组件
 */
import { ref, computed } from 'vue'
import { BasePanel } from '@/components/modules/base-panel/index.ts'
import type { PanelSection } from '@/types'

// 当前激活的设置项
const activeSection = ref('appearance')

// 设置项配置（使用 componentPath 动态加载）
const settingsSections: PanelSection[] = [
  {
    id: 'appearance',
    label: '外观设置',
    icon: 'Palette',
    componentPath: 'settings/components/AppearancePanel',
    order: 1,
  },
  {
    id: 'cache',
    label: '缓存管理',
    icon: 'Database',
    componentPath: 'settings/components/CachePanel',
    order: 2,
  },
  {
    id: 'menu',
    label: '菜单配置',
    icon: 'Menu',
    componentPath: 'settings/components/MenuPanel',
    order: 3,
  },
]

// 获取当前激活的标签
const activeLabel = computed(() => {
  return settingsSections.find((s) => s.id === activeSection.value)?.label || '系统设置'
})
</script>

<template>
  <BasePanel
    :sections="settingsSections"
    :active="activeSection"
    side="left"
    header-title="系统设置"
    sidebar-width="240px"
    @update:active="activeSection = $event"
  >
    <!-- 自定义头部 -->
    <template #header>
      {{ activeLabel }}
    </template>
  </BasePanel>
</template>
