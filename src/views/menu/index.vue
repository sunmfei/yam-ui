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
    <template #name="{ row }">
      <div class="flex min-w-0 items-center gap-3 transition-all hover:gap-4">
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
      <div class="flex items-center justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          class="gap-1.5 transition-all hover:scale-105 hover:shadow-sm"
          @click.stop="handleAddChild(row)"
        >
          <Plus class="h-3.5 w-3.5" />
          添加子节点
        </Button>
        <Button
          size="sm"
          variant="outline"
          class="transition-all hover:scale-105 hover:shadow-sm"
          @click.stop="handleEdit(row)"
        >
          编辑
        </Button>
        <Button
          size="sm"
          variant="destructive"
          class="transition-all hover:scale-105 hover:shadow-sm"
          @click.stop="handleDelete(row)"
        >
          删除
        </Button>
      </div>
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BaseTable } from '@/components/table'
import type { TreeTableColumn, TreeTableNode } from '@/components/ui/tree-table/types'
import type { MenuNode } from '@/types/menu'
import { DEFAULT_MENU } from '@/views/home/data/MenuData'
import { ElMessage, ElMessageBox } from '@/utils/message'

// =============================================
// 配置
// =============================================
const typeFilterOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'route', label: '路由' },
  { value: 'button', label: '按钮' },
  { value: 'dropdown', label: '下拉菜单' },
  { value: 'list', label: '列表' },
  { value: 'list-item', label: '列表项' },
]

const columns: TreeTableColumn[] = [
  { key: 'name', title: '节点', slot: 'name', width: '30%' },
  { key: 'type', title: '类型', slot: 'type', width: '12%' },
  { key: 'target', title: '路径/操作', slot: 'target', width: '28%' },
  { key: 'order', title: '排序', width: '10%', align: 'center' },
  { key: 'status', title: '状态', slot: 'status', width: '10%' },
  { key: 'actions', title: '操作', slot: 'actions', width: '20%', align: 'right' },
]

// =============================================
// 状态
// =============================================
const menus = ref<MenuNode[]>(cloneTree(DEFAULT_MENU))
const selectedKeys = ref<Array<string | number>>([])
const selectedType = ref('all')

const headerActions = [
  { label: '重置', onClick: handleReset },
  { label: '导出', onClick: handleExport },
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

function handleReset() {
  menus.value = cloneTree(DEFAULT_MENU)
  selectedKeys.value = []
  ElMessage.success('菜单数据已重置')
}

function handleAddRoot() {
  const id = `menu-${Date.now()}`
  menus.value = [
    ...menus.value,
    {
      id,
      name: '新根节点',
      type: 'route',
      icon: 'Menu',
      path: `/demo/${id}`,
      order: menus.value.length + 1,
    },
  ]
  ElMessage.success('根节点已添加')
}

function handleAddChild(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  const child: MenuNode = {
    id: `${sourceNode.id}-${Date.now()}`,
    name: `${sourceNode.name} 子节点`,
    type: 'button',
    icon: 'Plus',
    actionKey: `action-${Date.now()}`,
    order: (sourceNode.children?.length ?? 0) + 1,
  }

  if (!sourceNode.children) sourceNode.children = []
  sourceNode.children.push(child)
  ElMessage.success(`子节点已添加到 ${sourceNode.name}`)
}

function handleEdit(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return
  ElMessage.info(`编辑：${sourceNode.name}`)
}

async function handleDelete(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  try {
    await ElMessageBox.confirm(`确定删除节点 "${sourceNode.name}" 吗？`, '删除确认', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }

  const removedIds = collectIds(sourceNode)
  menus.value = removeNode(menus.value, String(sourceNode.id))
  selectedKeys.value = selectedKeys.value.filter((key) => !removedIds.includes(key))
  ElMessage.success('节点已删除')
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
  ElMessage.success('导出完成')
}
</script>
