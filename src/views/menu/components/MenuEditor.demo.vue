<template>
  <div class="menu-editor-demo">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-semibold">菜单编辑器演示</span>
          <el-button type="primary" @click="showEditor = !showEditor">
            {{ showEditor ? '关闭编辑器' : '打开编辑器' }}
          </el-button>
        </div>
      </template>

      <!-- 当前菜单预览 -->
      <div class="mb-4">
        <h3 class="text-md font-medium mb-2">当前菜单结构：</h3>
        <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded text-sm overflow-auto max-h-60">{{
          JSON.stringify(currentMenu, null, 2)
        }}</pre>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-2 mb-4">
        <el-button size="small" @click="loadCurrentMenu">刷新菜单</el-button>
        <el-button size="small" type="warning" @click="clearUserMenu">清除用户配置</el-button>
      </div>

      <!-- 菜单编辑器 -->
      <MenuEditor v-if="showEditor" ref="menuEditorRef" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import MenuEditor from './MenuEditor.vue'
import { menuConfig } from '@/views/search/data/MenuData'
import type { MenuItem } from '@/types/menu'

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

<style scoped lang="scss">
.menu-editor-demo {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
