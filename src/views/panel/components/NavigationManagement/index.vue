<template>
  <div class="relative h-full min-h-0">
    <BaseTable
      class="absolute inset-0"
      title="导航管理"
      :subtitle="`管理用户自定义导航项，支持添加、编辑、删除操作。`"
      :data="navigations as unknown as any[]"
      :columns="columns"
      searchable
      search-placeholder="搜索标题或URL"
      :actions="headerActions"
      configurable
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
    >
      <template #title="{ row }">
        <div v-if="row" class="flex min-w-0 items-center gap-3 transition-all hover:gap-4">
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary shadow-sm transition-all hover:scale-110 hover:shadow-md"
          >
            {{ getNodeAvatar(row) }}
          </div>
          <div class="min-w-0">
            <div
              class="truncate font-semibold text-foreground transition-colors hover:text-primary"
            >
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

      <template #url="{ row }">
        <div class="truncate font-mono text-xs text-foreground">
          {{ row.url || '--' }}
        </div>
      </template>

      <template #category="{ row }">
        <Badge variant="outline" class="transition-all hover:scale-105">
          {{ formatCategory(row.category) }}
        </Badge>
      </template>

      <template #actions="{ row }">
        <div v-if="row" class="flex items-center justify-end gap-2">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Upload } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { BaseTable } from '@/components/modules/table'
import type { NavigationItem } from './types/NavigationItem'
import { SunMessage } from '@/utils/message'
import NavigationDialog from './components/NavigationDialog.vue'
import { useNavigationData } from './composables/useNavigationData'
import { exportNavigationData, importNavigationData } from './utils/navigationImportExport'
import { navigationColumns, formatCategory } from './data/navigation.table.data'

// =============================================
// Composables
// =============================================
const { navigations, loadNavigationData, saveNavigationData, resetToDefault } = useNavigationData()

const columns = navigationColumns

// =============================================
// 状态
// =============================================

// 编辑对话框状态
const showEditDialog = ref(false)
const isEditMode = ref(false)
const editingItem = ref<NavigationItem | null>(null)
const editForm = ref<Omit<NavigationItem, 'id'>>({
  title: '',
  icon: '',
  url: '',
  description: '',
  category: '',
  order: 0,
})

// 文件输入引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// =============================================
// 计算属性
// =============================================
const headerActions = [
  { label: '刷新', onClick: handleRefresh, props: { variant: 'outline' as const } },
  { label: '重置', onClick: handleReset },
  { label: '导入', icon: Upload, onClick: triggerImport },
  { label: '导出', onClick: handleExport },
  { label: '批量删除', onClick: handleBatchDelete, props: { variant: 'destructive' as const } },
  { label: '添加导航', onClick: handleAdd, props: { variant: 'default' as const } },
]

// =============================================
// 工具函数
// =============================================
function getNodeAvatar(row: NavigationItem) {
  const title = row.title || '?'
  return title.slice(0, 1).toUpperCase()
}

// =============================================
// 事件处理
// =============================================
const selectedKeys = ref<Array<string | number>>([])

function handleSelectionChange(_rows: any[], keys: Array<string | number>) {
  selectedKeys.value = keys
}

function handleRowClick(row: NavigationItem) {
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
  selectedKeys.value = []
  SunMessage.success('导航数据已重置')
}

function handleAdd() {
  openAddDialog()
}

// =============================================
// 编辑对话框管理
// =============================================
function openAddDialog() {
  isEditMode.value = false
  editingItem.value = null

  editForm.value = {
    title: '',
    icon: '',
    url: '',
    description: '',
    category: '',
    order: 0,
  }

  showEditDialog.value = true
}

function openEditDialog(row: NavigationItem) {
  isEditMode.value = true
  editingItem.value = row

  editForm.value = {
    title: row.title || '',
    icon: row.icon || '',
    url: row.url || '',
    description: row.description || '',
    category: row.category || '',
    order: row.order || 0,
  }

  showEditDialog.value = true
}

function handleFormSubmit(formData: Omit<NavigationItem, 'id'>) {
  if (!formData.title.trim()) {
    SunMessage.warning('请输入导航标题')
    return
  }

  if (!formData.url.trim()) {
    SunMessage.warning('请输入URL')
    return
  }

  if (!formData.category.trim()) {
    SunMessage.warning('请输入分类')
    return
  }

  if (isEditMode.value && editingItem.value) {
    // 编辑模式
    const index = navigations.value.findIndex((item) => item.id === editingItem.value!.id)
    if (index !== -1) {
      navigations.value[index] = {
        ...editingItem.value,
        ...formData,
      }
      saveNavigationData()
      SunMessage.success('更新成功')
    }
  } else {
    // 新增模式
    const newItem: NavigationItem = {
      id: `nav-${Date.now()}`,
      ...formData,
    }
    navigations.value.push(newItem)
    saveNavigationData()
    SunMessage.success('添加成功')
  }

  closeDialog()
}

function closeDialog() {
  showEditDialog.value = false
  editingItem.value = null
  isEditMode.value = false
}

async function handleDelete(row: NavigationItem) {
  const index = navigations.value.findIndex((item) => item.id === row.id)
  if (index !== -1) {
    navigations.value.splice(index, 1)
    saveNavigationData()
    SunMessage.success('删除成功')
  }
}

function handleBatchDelete() {
  if (selectedKeys.value.length === 0) {
    SunMessage.warning('请先选择要删除的项')
    return
  }

  navigations.value = navigations.value.filter((item) => !selectedKeys.value.includes(item.id))
  saveNavigationData()
  selectedKeys.value = []
  SunMessage.success(`已删除 ${selectedKeys.value.length} 项`)
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
