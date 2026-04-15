<template>
  <div class="flex items-center gap-4">
    <el-menu
      v-model:active="activeKey"
      mode="horizontal"
      :ellipsis="false"
      class="w-full transparent-menu"
    >
      <el-menu-item index="1" @click="toggleTheme">
        <el-icon><component :is="ThemeIcon" /></el-icon>
        <span>主题切换</span>
      </el-menu-item>
      <el-menu-item index="2" disabled>
        <el-icon><BookIcon /></el-icon>
        <span>1973年的弹珠玩具</span>
      </el-menu-item>
      <el-sub-menu index="3">
        <template #title>
          <el-icon><BookIcon /></el-icon>
          <span>{{ currentBackgroundLabel }}</span>
        </template>
        <el-menu-item v-for="item in backgroundOptions" :key="item.value" :index="item.value" @click="appStore.setBackgroundType(item.value)">
          {{ item.label }}
        </el-menu-item>

      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMenu, ElMenuItem, ElSubMenu, ElIcon } from 'element-plus'
import { Sunny, Moon, Reading } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { BACKGROUND_OPTIONS } from '@/types/background'

const appStore = useAppStore()

function toggleTheme() {
  appStore.toggleTheme()
}

// 主题图标
const ThemeIcon = computed(() => (appStore.isDark ? Sunny : Moon))
const BookIcon = Reading

const activeKey = ref('1')

// 使用共享的背景选项
const backgroundOptions = BACKGROUND_OPTIONS

// 获取当前背景的标签
const currentBackgroundLabel = computed(() => {
  const option = backgroundOptions.find(opt => opt.value === appStore.backgroundType)
  return option?.label || '选择背景'
})
</script>

<style scoped>
/* Element Plus 菜单透明背景 */
.transparent-menu {
  background-color: transparent !important;
  border-bottom: none !important;
}

.transparent-menu :deep(.el-menu-item),
.transparent-menu :deep(.el-sub-menu__title) {
  background-color: transparent !important;
  color: inherit;
}

.transparent-menu :deep(.el-menu-item:hover),
.transparent-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(128, 128, 128, 0.1) !important;
  backdrop-filter: blur(10px);
}

.transparent-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(128, 128, 128, 0.15) !important;
  backdrop-filter: blur(10px);
}

/* 下拉菜单透明背景 */
.transparent-menu :deep(.el-menu--popup) {
  background-color: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(12px);
}

.dark .transparent-menu :deep(.el-menu--popup) {
  background-color: rgba(30, 41, 59, 0.8) !important;
}
</style>
