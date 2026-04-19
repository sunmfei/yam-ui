<template>
  <div class="menu-editor-demo p-4 max-w-[1200px] mx-auto">
    <div class="rounded-xl border bg-card p-6 shadow-sm">
      <div class="mb-4 flex items-center justify-between">
        <span class="text-lg font-semibold">菜单编辑器演示</span>
        <button
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          @click="showEditor = !showEditor"
        >
          {{ showEditor ? '关闭编辑器' : '打开编辑器' }}
        </button>
      </div>

      <!-- 当前菜单预览 -->
      <div class="mb-4">
        <h3 class="mb-2 text-md font-medium">当前菜单结构：</h3>
        <pre class="max-h-60 overflow-auto rounded bg-gray-100 p-4 text-sm dark:bg-gray-800">{{
          JSON.stringify(currentMenu, null, 2)
        }}</pre>
      </div>

      <!-- 操作按钮 -->
      <div class="mb-4 flex gap-2">
        <button
          class="rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          @click="loadCurrentMenu"
        >
          刷新菜单
        </button>
        <button
          class="rounded-lg border border-yellow-500 px-3 py-1.5 text-xs font-medium text-yellow-600 transition-colors hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
          @click="clearUserMenu"
        >
          清除用户配置
        </button>
      </div>

      <!-- 菜单编辑器 -->
      <MenuEditor v-if="showEditor" ref="menuEditorRef" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MenuEditor from './MenuEditor.vue'
import { menuConfig } from '@/views/search/data/MenuData'
import type { MenuItem } from '@/types'
import { ElMessage } from '@/utils/message'

const showEditor = ref(false)
const currentMenu = ref<MenuItem[]>([])

// 加载当前菜单
async function loadCurrentMenu() {
  currentMenu.value = await menuConfig.getMergedMenu()
  ElMessage.success('菜单已刷新')
}

// 清除用户菜单配置
function clearUserMenu() {
  menuConfig.clearUserMenu()
  loadCurrentMenu()
  ElMessage.success('用户配置已清除，已恢复默认菜单')
}

// 组件挂载时加载菜单
onMounted(() => {
  loadCurrentMenu()
})
</script>
