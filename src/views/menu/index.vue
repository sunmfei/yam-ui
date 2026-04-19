<template>
  <BaseTable
    title="菜单管理"
    :subtitle="`展示配置驱动的树形表格功能，包括树形模式、多选、分页等特性。`"
    :data="filteredMenus as unknown as TreeTableNode[]"
    :columns="columns"
    searchable
    search-placeholder="搜索名称、路径或操作键"
    :filters="typeFilterOptions"
    :actions="headerActions"
    configurable
    @filter="handleFilter"
    @selection-change="handleSelectionChange"
    @row-click="handleRowClick"
  >
    <!-- 面包屑导航 -->
    <template #toolbar-left>
      <SunBreadcrumb
        :items="[
          { title: '首页', href: '/' },
          { title: '系统管理' },
          { title: '菜单管理', isCurrent: true },
        ]"
      />
    </template>

    <template #name="{ row }">
      <div v-if="row" class="flex min-w-0 items-center gap-3 transition-all hover:gap-4">
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary shadow-sm transition-all hover:scale-110 hover:shadow-md"
        >
          {{ getNodeAvatar(row) }}
        </div>
        <div class="min-w-0">
          <div class="truncate font-semibold text-foreground transition-colors hover:text-primary">
            {{ row.name }}
          </div>
          <div class="truncate text-xs text-muted-foreground">ID: {{ row.id }}</div>
        </div>
      </div>
    </template>

    <template #type="{ row }">
      <Badge
        :variant="getTypeVariant(row.type)"
        class="transition-all hover:scale-105 hover:shadow-sm"
      >
        {{ getTypeLabel(row.type) }}
      </Badge>
    </template>

    <template #target="{ row }">
      <div class="space-y-1.5 text-xs">
        <div class="truncate font-mono font-medium text-foreground">
          {{ row.path || row.actionKey || '--' }}
        </div>
        <div
          v-if="row.getSelectedLabelKey || row.onItemClickKey"
          class="truncate text-muted-foreground"
        >
          {{ row.getSelectedLabelKey || row.onItemClickKey }}
        </div>
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
          :disabled="row.type !== 'menu' && row.type !== 'select'"
          class="gap-1.5 transition-all hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          @click.stop="handleAddChild(row)"
        >
          <Plus class="h-3.5 w-3.5" />
          添加子节点
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          :disabled="crud.isHardcodedNode(row.id ?? '')"
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
  <MenuDialog
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
import { SunBreadcrumb } from '@/components/business/sun-breadcrumb'
import { BaseTable } from '@/components/modules/table'
import type { TreeTableNode } from '@/components/ui/tree-table/types'
import type { MenuNode } from '@/types'
import { DEFAULT_MENU } from '@/views/home/data/MenuData'
import { SunMessage } from '@/utils/message'
import MenuDialog from './components/MenuDialog.vue'
import { useMenuData } from './composables/useMenuData'
import { useMenuCRUD } from './composables/useMenuCRUD'
import { exportMenuData, importMenuData } from './utils/menuImportExport'
import {
  menuColumns,
  typeFilterOptions,
  typeLabelMap,
  typeVariantMap,
} from './data/menu.table.data'

// =============================================
// Composables
// =============================================
const { menus, loadMenuData, saveMenuData, resetToDefault } = useMenuData()
const crud = useMenuCRUD(menus, saveMenuData)

// 递归收集所有硬编码节点的 ID（包括子节点）
function collectAllIds(nodes: MenuNode[]): string[] {
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
const HARDCODED_MENU_IDS = new Set(collectAllIds(DEFAULT_MENU))
crud.setHardcodedIds(HARDCODED_MENU_IDS)

const columns = menuColumns

// =============================================
// 状态
// =============================================
const selectedType = ref('all')

// 编辑对话框状态
const showEditDialog = ref(false)
const isEditMode = ref(false)
const editingNode = ref<MenuNode | null>(null)
const editForm = ref<Omit<MenuNode, 'id' | 'children'>>({
  name: '',
  type: 'route',
  icon: '',
  path: '',
  actionKey: '',
  order: 0,
  hidden: false,
  disabled: false,
})

// 文件输入引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// =============================================
// 计算属性
// =============================================
const filteredMenus = computed(() => filterMenus(menus.value, '', selectedType.value))

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
function filterMenus(nodes: MenuNode[], _keyword: string, typeValue: string): MenuNode[] {
  return nodes.reduce<MenuNode[]>((result, node) => {
    const children = node.children ? filterMenus(node.children, _keyword, typeValue) : []
    const matchesType = typeValue === 'all' || node.type === typeValue
    if (matchesType || children.length > 0) {
      result.push({ ...node, children } as MenuNode)
    }
    return result
  }, [])
}

function getTypeLabel(type: unknown) {
  return typeLabelMap[String(type)] ?? String(type)
}

function getTypeVariant(type: unknown) {
  return typeVariantMap[String(type)] ?? 'secondary'
}

function getNodeAvatar(row: TreeTableNode) {
  const name = typeof row.name === 'string' ? row.name : '?'
  return name.slice(0, 1).toUpperCase()
}

// =============================================
// 事件处理
// =============================================
function handleSelectionChange(_rows: TreeTableNode[], keys: Array<string | number>) {
  crud.selectedKeys.value = keys
}

function handleRowClick(row: TreeTableNode) {
  console.log('点击行:', row.name)
}

function handleFilter(value: string) {
  selectedType.value = value
}

async function handleRefresh() {
  SunMessage.info('正在从后端同步数据...')
  try {
    await loadMenuData()
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
    ? crud.findNodeById(menus.value, String(parentNode.id ?? ''))
    : null

  editForm.value = {
    name: '',
    type: 'route',
    icon: '',
    path: '',
    actionKey: '',
    order: 0,
    hidden: false,
    disabled: false,
  }

  showEditDialog.value = true
}

function openEditDialog(row: TreeTableNode) {
  const sourceNode = crud.findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  if (crud.isHardcodedNode(sourceNode.id)) {
    SunMessage.warning('默认菜单数据不允许修改')
    return
  }

  isEditMode.value = true
  editingNode.value = sourceNode

  editForm.value = {
    id: sourceNode.id,
    name: sourceNode.name || '',
    type: sourceNode.type || 'route',
    icon: sourceNode.icon || '',
    path: sourceNode.path || '',
    actionKey: sourceNode.actionKey || '',
    order: sourceNode.order || 0,
    hidden: sourceNode.hidden || false,
    disabled: sourceNode.disabled || false,
  }

  showEditDialog.value = true
}

function handleFormSubmit(formData: Omit<MenuNode, 'id' | 'children'>) {
  if (!formData.name.trim()) {
    SunMessage.warning('请输入节点名称')
    return
  }

  // 编辑模式下，再次验证是否为硬编码节点
  if (isEditMode.value && editingNode.value) {
    if (crud.isHardcodedNode(editingNode.value.id)) {
      SunMessage.error('默认菜单数据不允许修改')
      closeDialog()
      return
    }
    crud.updateNode(editingNode.value, formData)
  } else {
    // 新增模式下，生成新的 ID
    const newNode: MenuNode = {
      id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  exportMenuData(menus.value)
}

function triggerImport() {
  fileInputRef.value?.click()
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    menus.value = await importMenuData(file)
    saveMenuData()
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
  loadMenuData()
})
</script>
