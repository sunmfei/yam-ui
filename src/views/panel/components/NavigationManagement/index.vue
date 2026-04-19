<template>
  <BaseTable
    title="导航管理"
    :subtitle="`管理用户自定义导航项，支持添加、编辑、删除操作。`"
    :data="filteredNavigations as unknown as TreeTableNode[]"
    :columns="columns"
    searchable
    search-placeholder="搜索标题或路径"
    :actions="headerActions"
    configurable
    @selection-change="handleSelectionChange"
    @row-click="handleRowClick"
  >
    <!-- 面包屑导航 -->
    <!--    <template #toolbar-left>
      <SunBreadcrumb
        :items="[
          { title: '首页', href: '/' },
          { title: '系统管理' },
          { title: '菜单管理', isCurrent: true },
        ]"
      />
    </template>-->

    <template #title="{ row }">
      <div v-if="row" class="flex min-w-0 items-center gap-3 transition-all hover:gap-4">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary shadow-sm transition-all hover:scale-110 hover:shadow-md"
        >
          {{ getNodeAvatar(row) }}
        </div>
        <div class="min-w-0">
          <div class="truncate font-semibold text-foreground transition-colors hover:text-primary">
            {{ row.title }}
          </div>
          <div class="truncate text-xs text-muted-foreground">ID: {{ row.id }}</div>
        </div>
      </div>
    </template>

    <template #icon="{ row }">
      <span v-if="row.icon" class="text-lg">{{ row.icon }}</span>
      <span v-else class="text-muted-foreground">-</span>
    </template>

    <template #path="{ row }">
      <div class="truncate font-mono text-xs text-foreground">
        {{ row.path || '--' }}
      </div>
    </template>

    <template #status="{ row }">
      <div class="flex flex-wrap gap-2">
        <Badge v-if="row.hidden" variant="outline" class="transition-all hover:scale-105">
          隐藏
        </Badge>
        <Badge v-if="row.disabled" variant="destructive" class="transition-all hover:scale-105">
          禁用
        </Badge>
        <Badge
          v-if="!row.hidden && !row.disabled"
          variant="secondary"
          class="transition-all hover:scale-105"
        >
          正常
        </Badge>
      </div>
    </template>

    <template #actions="{ row }">
      <div v-if="row" class="flex items-center justify-end gap-2">
        <BaseButton
          size="sm"
          variant="outline"
          :disabled="!row.children"
          class="gap-1.5 transition-all hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          @click.stop="handleAddChild(row)"
        >
          <Plus class="h-3.5 w-3.5" />
          添加子节点
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          class="transition-all hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          @click.stop="openEditDialog(row)"
        >
          编辑
        </BaseButton>
        <BaseButton
          size="sm"
          variant="destructive"
          :disabled="crud.isHardcodedNode(row.id ?? '')"
          class="transition-all hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          @click.stop="handleDelete(row)"
        >
          删除
        </BaseButton>
      </div>
    </template>
  </BaseTable>

  <!-- 编辑对话框 -->
  <NavigationDialog
    v-model:open="showEditDialog"
    :is-edit-mode="isEditMode"
    :form-data="editForm"
    @submit="handleFormSubmit"
  />

  <!-- 隐藏的文件输入 -->
  <input ref="fileInputRef" type="file" accept=".json" class="hidden" @change="handleImport" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, Upload } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { BaseTable } from '@/components/modules/table'
import type { TreeTableNode } from '@/components/ui/tree-table/types'
import type { NavigationItem } from '../types/NavigationItem'
import { DEFAULT_NAVIGATION } from '@/views/home/data/NavigationData'
import { SunMessage } from '@/utils/message'
import NavigationDialog from './components/NavigationDialog.vue'
import { useNavigationData } from './composables/useNavigationData'
import { useNavigationCRUD } from './composables/useNavigationCRUD'
import { exportNavigationData, importNavigationData } from './utils/navigationImportExport'
import { navigationColumns } from './data/navigation.table.data'

// =============================================
// Composables
// =============================================
const { navigations, loadNavigationData, saveNavigationData, resetToDefault } = useNavigationData()
const crud = useNavigationCRUD(navigations, saveNavigationData)

// 递归收集所有硬编码节点的 ID（包括子节点）
function collectAllIds(nodes: NavigationItem[]): string[] {
  const ids: string[] = []
  for (const node of nodes) {
    ids.push(node.id)
    if (node.children && node.children.length > 0) {
      ids.push(...collectAllIds(node.children))
    }
  }
  return ids
}

// 设置硬编码 ID（包含所有层级的节点）
const HARDCODED_MENU_IDS = new Set(collectAllIds(DEFAULT_NAVIGATION))
crud.setHardcodedIds(HARDCODED_MENU_IDS)

const columns = navigationColumns

// =============================================
// 状态
// =============================================

// 编辑对话框状态
const showEditDialog = ref(false)
const isEditMode = ref(false)
const editingNode = ref<NavigationItem | null>(null)
const editForm = ref<Omit<NavigationItem, 'id' | 'children'>>({
  title: '',
  icon: '',
  path: '',
  description: '',
  openInNewTab: true,
  order: 0,
  hidden: false,
  disabled: false,
})

// 文件输入引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// =============================================
// 计算属性
// =============================================
const filteredNavigations = computed(() => navigations.value)

const headerActions = [
  { label: '刷新', onClick: handleRefresh, props: { variant: 'outline' as const } },
  { label: '重置', onClick: handleReset },
  { label: '导入', icon: Upload, onClick: triggerImport },
  { label: '导出', onClick: handleExport },
  { label: '批量删除', onClick: crud.batchDelete, props: { variant: 'destructive' as const } },
  { label: '添加根节点', onClick: handleAddRoot, props: { variant: 'default' as const } },
]

// =============================================
// 工具函数
// =============================================
function getNodeAvatar(row: TreeTableNode) {
  const title = typeof row.title === 'string' ? row.title : '?'
  return title.slice(0, 1).toUpperCase()
}

// =============================================
// 事件处理
// =============================================
function handleSelectionChange(_rows: TreeTableNode[], keys: Array<string | number>) {
  crud.selectedKeys.value = keys
}

function handleRowClick(row: TreeTableNode) {
  console.log('点击行:', row.title)
}

async function handleRefresh() {
  SunMessage.info('正在从后端同步数据...')
  try {
    await loadNavigationData()
    SunMessage.success('数据同步完成')
  } catch (error) {
    SunMessage.error('数据同步失败')
    console.error('同步错误:', error)
  }
}

function handleReset() {
  resetToDefault()
  crud.selectedKeys.value = []
  SunMessage.success('菜单数据已重置')
}

function handleAddRoot() {
  openAddDialog(null)
}

function handleAddChild(row: TreeTableNode) {
  openAddDialog(row)
}

// =============================================
// 编辑对话框管理
// =============================================
function openAddDialog(parentNode: TreeTableNode | null) {
  isEditMode.value = false
  editingNode.value = parentNode
    ? crud.findNodeById(navigations.value, String(parentNode.id ?? ''))
    : null

  editForm.value = {
    title: '',
    icon: '',
    path: '',
    description: '',
    openInNewTab: true,
    order: 0,
    hidden: false,
    disabled: false,
  }

  showEditDialog.value = true
}

function openEditDialog(row: TreeTableNode) {
  const sourceNode = crud.findNodeById(navigations.value, String(row.id ?? ''))
  if (!sourceNode) return
  /*
  if (crud.isHardcodedNode(sourceNode.id)) {
    SunMessage.warning('默认导航数据不允许修改')
    return
  }*/

  isEditMode.value = true
  editingNode.value = sourceNode

  editForm.value = {
    id: sourceNode.id,
    title: sourceNode.title || '',
    icon: sourceNode.icon || '',
    path: sourceNode.path || '',
    description: sourceNode.description || '',
    openInNewTab: sourceNode.openInNewTab ?? true,
    order: sourceNode.order || 0,
    hidden: sourceNode.hidden || false,
    disabled: sourceNode.disabled || false,
  }

  showEditDialog.value = true
}

function handleFormSubmit(formData: Omit<NavigationItem, 'id' | 'children'>) {
  if (!formData.title.trim()) {
    SunMessage.warning('请输入导航标题')
    return
  }

  // 编辑模式下，再次验证是否为硬编码节点
  if (isEditMode.value && editingNode.value) {
    if (crud.isHardcodedNode(editingNode.value.id)) {
      SunMessage.error('默认导航数据不允许修改')
      closeDialog()
      return
    }
    crud.updateNode(editingNode.value, formData)
  } else {
    // 新增模式下，生成新的 ID
    const newNode: NavigationItem = {
      id: `navigation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
    }
    crud.addNode(newNode, editingNode.value)
  }

  closeDialog()
}

function closeDialog() {
  showEditDialog.value = false
  editingNode.value = null
  isEditMode.value = false
}

async function handleDelete(row: TreeTableNode) {
  await crud.deleteNode(row)
}

function handleExport() {
  exportNavigationData(navigations.value)
}

function triggerImport() {
  fileInputRef.value?.click()
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    navigations.value = await importNavigationData(file)
    saveNavigationData()
    SunMessage.success('导入成功')
  } catch (error) {
    SunMessage.error(error instanceof Error ? error.message : '导入失败')
  } finally {
    target.value = ''
  }
}

// =============================================
// 生命周期
// =============================================
onMounted(() => {
  loadNavigationData()
})
</script>
