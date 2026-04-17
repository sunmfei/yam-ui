<template>
  <div class="menu-tree-table">
    <el-table-v2
      v-model:expanded-row-keys="expandedRowKeys"
      :columns="columns"
      :data="treeData"
      :width="920"
      :height="600"
      expand-column-key="name"
      fixed
      @row-click="handleRowClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { Column } from 'element-plus'
import type { MenuNode } from '@/types/menu'
import { DEFAULT_MENU } from '@/views/search/data/MenuData'

/**
 * 展开节点
 */
const expandedRowKeys = ref<string[]>([])

/**
 * 表格列（直接绑定 MenuNode）
 */
const columns: Column<MenuNode>[] = [
  {
    key: 'name',
    dataKey: 'name',
    title: '菜单名称',
    width: 260,
  },
  {
    key: 'type',
    dataKey: 'type',
    title: '类型',
    width: 140,
  },
  {
    key: 'path',
    dataKey: 'path',
    title: '路由',
    width: 260,
  },
  {
    key: 'actionKey',
    dataKey: 'actionKey',
    title: 'ActionKey',
    width: 200,
  },
  {
    key: 'order',
    dataKey: 'order',
    title: '排序',
    width: 100,
  },
]

/**
 * 递归构建树（仅保证 children 安全）
 */
function buildTree(list: MenuNode[]): MenuNode[] {
  return list.map((item) => ({
    ...item,
    children: Array.isArray(item.children) ? buildTree(item.children) : undefined,
  }))
}

/**
 * 树数据
 */
const treeData = computed(() => buildTree(DEFAULT_MENU))

/**
 * 点击行
 */
function handleRowClick({ rowData }: { rowData: MenuNode }) {
  ElMessage.success(`点击: ${rowData.name}`)
}
</script>

<style scoped>
.menu-tree-table {
  padding: 16px;
  border-radius: 12px;
  background: var(--el-bg-color);
}
</style>
