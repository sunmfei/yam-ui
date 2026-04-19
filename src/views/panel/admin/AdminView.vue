<script setup lang="ts">
/**
 * AdminView - 管理后台页面
 *
 * 使用 BasePanel 组件实现侧边栏布局
 * 通过 componentPath 动态加载管理模块
 */
import { ref, computed } from 'vue'
import { BasePanel } from '@/components/modules/base-panel/index.ts'
import { adminSections } from '@/views/panel/admin/data/admin.data.ts'

// 当前激活的管理模块
const activeSection = ref('')

// 获取当前激活的标签
const activeLabel = computed(() => {
  return adminSections.find((s) => s.id === activeSection.value)?.label || '后端管理'
})
</script>

<template>
  <BasePanel
    :sections="adminSections"
    :active="activeSection"
    side="left"
    header-title="后端管理"
    sidebar-width="240px"
    @update:active="activeSection = $event"
  >
    <!-- 自定义头部 -->
    <template #header>
      {{ activeLabel }}
    </template>
  </BasePanel>
</template>
