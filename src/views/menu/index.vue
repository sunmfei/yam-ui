<template>
  <BaseTable
    title="菜单管理"
    :subtitle="`展示配置驱动的树形表格功能，包括树形模式、多选、分页等特性。`"
    :data="filteredMenus"
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
      <Breadcrumb
        :items="[{ title: '首页', path: '/' }, { title: '系统管理' }, { title: '菜单管理' }]"
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
        <Badge v-if="row.disabled" variant="warning" class="transition-all hover:scale-105">
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
          class="gap-1.5 transition-all hover:scale-105 hover:shadow-sm"
          @click.stop="handleAddChild(row)"
        >
          <Plus class="h-3.5 w-3.5" />
          添加子节点
        </BaseButton>
        <BaseButton
          size="sm"
          variant="outline"
          :disabled="isHardcodedNode(row.id ?? '')"
          class="transition-all hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          @click.stop="openEditDialog(row)"
        >
          编辑
        </BaseButton>
        <BaseButton
          size="sm"
          variant="destructive"
          :disabled="isHardcodedNode(row.id ?? '')"
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
    @update:form-data="handleFormUpdate"
    @confirm="saveForm"
  />

  <!-- 隐藏的文件输入 -->
  <input ref="fileInputRef" type="file" accept=".json" class="hidden" @change="handleImport" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Plus, Upload } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { BaseTable } from '@/components/modules/table'
import type { TreeTableNode } from '@/components/ui/tree-table/types'
import type { MenuNode } from '@/types/menu'
import { DEFAULT_MENU } from '@/views/home/data/MenuData'
import { SunMessage, SunMessageBox } from '@/utils/message'
import { localCache } from '@/utils/cache/localCache'
import { getMenus } from '@/api/menu'
import { LocalCacheKey } from '@/types/cache.ts'
import MenuDialog from './components/MenuDialog.vue'
import { menuColumns, typeFilterOptions as tableTypeFilterOptions } from './data/menu.table.data'

// =============================================
// 常量
// =============================================
const CACHE_KEY = LocalCacheKey.MENU_CONFIG

// 硬编码的默认数据 ID 列表（这些数据不允许被修改/删除）
const HARDCODED_MENU_IDS = new Set(DEFAULT_MENU.map((node) => node.id))

const typeFilterOptions = tableTypeFilterOptions

const columns = menuColumns

// =============================================
// 状态
// =============================================
const menus = ref<MenuNode[]>([])
const selectedKeys = ref<Array<string | number>>([])
const selectedType = ref('all')

// 编辑对话框状态
const showEditDialog = ref(false)
const isEditMode = ref(false) // true=编辑, false=新增
const editingNode = ref<MenuNode | null>(null)
const editForm = ref({
  id: '',
  name: '',
  type: 'route' as MenuNode['type'],
  icon: '',
  path: '',
  actionKey: '',
  order: 0,
  hidden: false,
  disabled: false,
})

// 文件输入引用
const fileInputRef = ref<HTMLInputElement | null>(null)

const headerActions = [
  { label: '刷新', onClick: handleRefresh, props: { variant: 'outline' as const } },
  { label: '重置', onClick: handleReset },
  { label: '导入', icon: Upload, onClick: triggerImport },
  { label: '导出', onClick: handleExport },
  { label: '批量删除', onClick: handleBatchDelete, props: { variant: 'destructive' as const } },
  { label: '添加根节点', onClick: handleAddRoot, props: { variant: 'default' as const } },
]

// =============================================
// 计算属性
// =============================================
const filteredMenus = computed(() => filterMenus(menus.value, '', selectedType.value))
//const _totalCount = computed(() => countNodes(menus.value))

// =============================================
// 工具函数
// =============================================
function cloneTree(data: MenuNode[]): MenuNode[] {
  return JSON.parse(JSON.stringify(data)) as MenuNode[]
}

// =============================================
// 数据持久化
// =============================================

/**
 * 加载菜单数据（混合数据源策略）
 *
 * 优先级：
 * 1. 尝试从后端 API 获取最新数据
 * 2. 如果 API 失败，使用本地缓存
 * 3. 如果缓存也不存在，使用默认数据
 *
 * 数据合并策略：
 * - 后端数据为主（权威数据源）
 * - 本地缓存为辅（离线/临时数据）
 * - 合并时以后端数据为准，缓存中独有的数据保留
 */
async function loadMenuData() {
  console.log('🔄 开始加载菜单数据...')

  try {
    // 第一步：尝试从后端 API 获取数据
    const apiData = await fetchMenuFromAPI()

    if (apiData && apiData.length > 0) {
      console.log('✓ 从后端 API 获取到数据:', apiData.length, '个节点')

      // 第二步：获取本地缓存数据
      const cachedData = localCache.get<MenuNode[]>(CACHE_KEY)

      // 第三步：合并数据（后端数据 + 缓存中的新增数据）
      if (cachedData && cachedData.length > 0) {
        menus.value = mergeMenuData(apiData, cachedData)
        console.log('✓ 数据合并完成')
      } else {
        menus.value = apiData
      }

      // 第四步：保存合并后的数据到缓存
      saveMenuData()
      return
    }
  } catch (error) {
    console.warn('⚠️ 后端 API 请求失败，使用本地缓存:', error)
  }

  // API 失败时的降级策略
  console.log('📦 尝试从本地缓存加载...')
  const cached = localCache.get<MenuNode[]>(CACHE_KEY)

  if (cached && Array.isArray(cached) && cached.length > 0) {
    menus.value = cached
    console.log('✓ 从缓存加载菜单数据:', cached.length, '个节点')
  } else {
    menus.value = cloneTree(DEFAULT_MENU)
    saveMenuData()
    console.log('✓ 使用默认菜单数据:', DEFAULT_MENU.length, '个节点')
  }
}

/**
 * 从后端 API 获取菜单数据
 */
async function fetchMenuFromAPI(): Promise<MenuNode[] | null> {
  try {
    const data = await getMenus()
    return data.length > 0 ? data : null
  } catch (error) {
    console.error('API 请求失败:', error)
    throw error
  }
}

/**
 * 合并菜单数据
 *
 * 策略：
 * - 以后端数据为基础
 * - 找出缓存中存在但后端不存在的节点（用户新增的临时数据）
 * - 将这些节点添加到后端数据中
 *
 * @param apiData 后端数据（权威数据源）
 * @param cachedData 缓存数据（补充数据源）
 * @returns 合并后的数据
 */
function mergeMenuData(apiData: MenuNode[], cachedData: MenuNode[]): MenuNode[] {
  // 收集后端数据中所有的 ID
  const apiIds = new Set<string>()
  collectAllIds(apiData, apiIds)

  // 找出缓存中独有的节点（不在后端数据中）
  const uniqueCachedNodes = cachedData.filter((node) => !apiIds.has(node.id))

  if (uniqueCachedNodes.length === 0) {
    console.log('ℹ️ 没有需要合并的缓存数据')
    return apiData
  }

  console.log('🔀 合并', uniqueCachedNodes.length, '个缓存中的独有节点')

  // 将缓存中的独有节点添加到后端数据中
  return [...apiData, ...uniqueCachedNodes]
}

/**
 * 递归收集所有节点 ID
 */
function collectAllIds(nodes: MenuNode[], idSet: Set<string>): void {
  for (const node of nodes) {
    idSet.add(node.id)
    if (node.children && node.children.length > 0) {
      collectAllIds(node.children, idSet)
    }
  }
}

/**
 * 检查节点是否为硬编码数据（不允许修改/删除）
 */
function isHardcodedNode(nodeId: string | number): boolean {
  return HARDCODED_MENU_IDS.has(String(nodeId))
}

/**
 * 保存菜单数据到本地缓存
 */
function saveMenuData() {
  localCache.set(CACHE_KEY, menus.value)
  console.log('💾 菜单数据已保存到缓存:', menus.value.length, '个节点')
}

function filterMenus(nodes: MenuNode[], _keyword: string, typeValue: string): MenuNode[] {
  return nodes.reduce<MenuNode[]>((result, node) => {
    const children = node.children ? filterMenus(node.children, _keyword, typeValue) : []
    const matchesType = typeValue === 'all' || node.type === typeValue
    if (matchesType || children.length > 0) {
      result.push({ ...node, children })
    }
    return result
  }, [])
}

/*function countNodes(nodes: MenuNode[]): number {
  return nodes.reduce((count, node) => count + 1 + countNodes(node.children ?? []), 0)
}*/

function findNodeById(nodes: MenuNode[], id: string): MenuNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const child = findNodeById(node.children ?? [], id)
    if (child) return child
  }
  return null
}

function getTypeLabel(type: unknown) {
  const labelMap: Record<string, string> = {
    route: '路由',
    button: '按钮',
    dropdown: '下拉菜单',
    list: '列表',
    'list-item': '列表项',
  }
  return labelMap[String(type)] ?? String(type)
}

function getTypeVariant(type: unknown) {
  const variantMap: Record<string, 'default' | 'secondary' | 'outline' | 'success'> = {
    route: 'default',
    button: 'secondary',
    dropdown: 'outline',
    list: 'success',
    'list-item': 'secondary',
  }
  return variantMap[String(type)] ?? 'secondary'
}

function getNodeAvatar(row: TreeTableNode) {
  const name = typeof row.name === 'string' ? row.name : '?'
  return name.slice(0, 1).toUpperCase()
}

// =============================================
// 事件处理
// =============================================
function handleSelectionChange(_rows: TreeTableNode[], keys: Array<string | number>) {
  selectedKeys.value = keys
}

function handleRowClick(row: TreeTableNode) {
  console.log('点击行:', row.name)
}

function handleFilter(value: string) {
  selectedType.value = value
}

/**
 * 手动刷新数据（从后端重新同步）
 */
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
  SunMessageBox.confirm('确定要重置为默认菜单吗？当前数据将丢失。', '重置确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      menus.value = cloneTree(DEFAULT_MENU)
      selectedKeys.value = []
      saveMenuData()
      SunMessage.success('菜单数据已重置')
    })
    .catch(() => {
      // 用户取消
    })
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
  // 如果是添加子节点，需要通过 ID 找到真实的节点引用
  if (parentNode) {
    editingNode.value = findNodeById(menus.value, String(parentNode.id ?? ''))
  } else {
    editingNode.value = null
  }

  // 重置表单
  editForm.value = {
    id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  // 检查是否为硬编码数据
  if (isHardcodedNode(sourceNode.id)) {
    SunMessage.warning('默认菜单数据不允许修改')
    return
  }

  isEditMode.value = true
  editingNode.value = sourceNode

  // 填充表单
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

function saveForm() {
  if (!editForm.value.name.trim()) {
    SunMessage.warning('请输入节点名称')
    return
  }

  if (isEditMode.value && editingNode.value) {
    // 编辑模式：更新现有节点
    Object.assign(editingNode.value, {
      name: editForm.value.name,
      type: editForm.value.type,
      icon: editForm.value.icon,
      path: editForm.value.path,
      actionKey: editForm.value.actionKey,
      order: editForm.value.order,
      hidden: editForm.value.hidden,
      disabled: editForm.value.disabled,
    })
    SunMessage.success('节点已更新')
  } else {
    // 新增模式
    const newNode: MenuNode = {
      id: editForm.value.id,
      name: editForm.value.name,
      type: editForm.value.type,
      icon: editForm.value.icon,
      path: editForm.value.path,
      actionKey: editForm.value.actionKey,
      order: editForm.value.order,
      hidden: editForm.value.hidden,
      disabled: editForm.value.disabled,
    }

    if (editingNode.value) {
      // 添加子节点
      const children = editingNode.value.children || []
      children.push(newNode)
      editingNode.value.children = children
      SunMessage.success(`子节点已添加到 ${editingNode.value.name}`)
    } else {
      // 添加根节点
      menus.value.push(newNode)
      SunMessage.success('根节点已添加')
    }
  }

  // 保存数据到缓存
  saveMenuData()
  closeDialog()
}

function closeDialog() {
  showEditDialog.value = false
  editingNode.value = null
  isEditMode.value = false
}

function handleFormUpdate(newFormData: Omit<MenuNode, 'id' | 'children'>) {
  editForm.value = { ...editForm.value, ...newFormData }
}

async function handleDelete(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  // 检查是否为硬编码数据
  if (isHardcodedNode(sourceNode.id)) {
    SunMessage.warning('默认菜单数据不允许删除')
    return
  }

  try {
    await SunMessageBox.confirm(
      `确定删除节点 "${sourceNode.name}" 及其所有子节点吗？`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  } catch {
    return
  }

  const removedIds = collectIds(sourceNode)
  menus.value = removeNode(menus.value, String(sourceNode.id))
  selectedKeys.value = selectedKeys.value.filter((key) => !removedIds.includes(key))

  // 保存数据到缓存
  saveMenuData()
  SunMessage.success('节点已删除')
}

function collectIds(node: MenuNode | null): Array<string | number> {
  if (!node) return []
  return [node.id, ...(node.children ?? []).flatMap((child) => collectIds(child))]
}

function removeNode(nodes: MenuNode[], targetId: string): MenuNode[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, targetId) : undefined,
    }))
}

function handleExport() {
  const blob = new Blob([JSON.stringify(menus.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `menu-tree-demo-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
  SunMessage.success('导出完成')
}

function triggerImport() {
  fileInputRef.value?.click()
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const text = await file.text()
    const data = JSON.parse(text)

    if (!Array.isArray(data)) {
      throw new Error('文件格式错误：必须是数组格式')
    }

    // 验证数据结构
    validateMenuData(data)

    menus.value = data
    SunMessage.success('导入成功')
  } catch (error) {
    SunMessage.error(`导入失败：${error instanceof Error ? error.message : '未知错误'}`)
  } finally {
    // 清空文件输入，允许重复选择同一文件
    target.value = ''
  }
}

function validateMenuData(data: unknown[]): void {
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (typeof item !== 'object' || item === null) {
      throw new Error(`第 ${i + 1} 个节点格式错误`)
    }
    const node = item as Record<string, unknown>
    if (!node.id || !node.name || !node.type) {
      throw new Error(`第 ${i + 1} 个节点缺少必要字段（id、name、type）`)
    }
    if (node.children && Array.isArray(node.children)) {
      validateMenuData(node.children as unknown[])
    }
  }
}

async function handleBatchDelete() {
  if (selectedKeys.value.length === 0) {
    SunMessage.warning('请先选择要删除的节点')
    return
  }

  // 过滤掉硬编码数据的 ID
  const deletableKeys = selectedKeys.value.filter((key) => !isHardcodedNode(key))

  if (deletableKeys.length === 0) {
    SunMessage.warning('选中的节点都是默认数据，不允许删除')
    return
  }

  // 如果有部分节点是硬编码的，给出提示
  if (deletableKeys.length < selectedKeys.value.length) {
    const skippedCount = selectedKeys.value.length - deletableKeys.length
    SunMessage.info(`已跳过 ${skippedCount} 个默认数据节点`)
  }

  try {
    await SunMessageBox.confirm(
      `确定删除选中的 ${deletableKeys.length} 个节点及其子节点吗？`,
      '批量删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  } catch {
    return
  }

  const keysToDelete = new Set(deletableKeys.map(String))
  menus.value = batchRemoveNodes(menus.value, keysToDelete)
  selectedKeys.value = []

  // 保存数据到缓存
  saveMenuData()
  SunMessage.success(`已删除 ${keysToDelete.size} 个节点`)
}

function batchRemoveNodes(nodes: MenuNode[], keysToDelete: Set<string>): MenuNode[] {
  return nodes
    .filter((node) => !keysToDelete.has(String(node.id)))
    .map((node) => ({
      ...node,
      children: node.children ? batchRemoveNodes(node.children, keysToDelete) : undefined,
    }))
}

// =============================================
// 生命周期
// =============================================
onMounted(() => {
  loadMenuData()
})
</script>
