<template>
  <div class="space-y-6 p-6">
    <section class="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div class="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div class="space-y-3">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <FolderTree class="h-3.5 w-3.5" />
            TreeTable Demo
          </div>

          <div>
            <h1 class="text-3xl font-semibold tracking-tight">Menu Tree Table</h1>
            <p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              This page demonstrates a ready-to-use tree table with config-driven tree mode,
              selection, and pagination.
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <Button variant="outline" @click="handleReset">Reset data</Button>
          <Button variant="outline" @click="handleExport">Export JSON</Button>
          <Button @click="handleAddRoot">
            <Plus class="mr-2 h-4 w-4" />
            Add root
          </Button>
        </div>
      </div>

      <div class="mt-6 grid gap-4 lg:grid-cols-4">
        <div class="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted-foreground">Total nodes</div>
          <div class="mt-2 text-2xl font-semibold">{{ totalCount }}</div>
        </div>
        <div class="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Filtered nodes
          </div>
          <div class="mt-2 text-2xl font-semibold">{{ filteredCount }}</div>
        </div>
        <div class="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted-foreground">Selected</div>
          <div class="mt-2 text-2xl font-semibold">{{ selectedKeys.length }}</div>
        </div>
        <div class="rounded-2xl border border-border/60 bg-background/70 p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted-foreground">Mode</div>
          <div class="mt-2 text-sm font-semibold">
            {{ treeEnabled ? 'Tree table enabled' : 'Flat table mode' }}
          </div>
        </div>
      </div>
    </section>

    <section class="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div class="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div class="space-y-4">
          <div class="flex flex-col gap-4 lg:flex-row">
            <div class="relative flex-1">
              <Search
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                v-model="keyword"
                class="pl-9"
                placeholder="Search by name, path, or action key"
              />
            </div>

            <select
              v-model="selectedType"
              class="h-9 min-w-[180px] rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="all">All types</option>
              <option v-for="item in typeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <!--
            Demo wiring:
            1. treeConfig decides whether tree features are enabled
            2. selectionConfig controls checkbox mode
            3. paginationConfig enables built-in pagination
            4. toolbarConfig enables the component toolbar
          -->
          <TreeTable
            :data="filteredMenus"
            :columns="columns"
            :tree-config="treeConfig"
            :selection-config="selectionConfig"
            :pagination-config="paginationConfig"
            :toolbar-config="toolbarConfig"
            empty-text="No matching menu nodes"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
          >
            <!-- Custom node cell -->
            <template #name="{ row }">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-xs font-semibold text-foreground"
                >
                  {{ getNodeAvatar(row) }}
                </div>

                <div class="min-w-0">
                  <div class="truncate font-medium text-foreground">
                    {{ row.name }}
                  </div>
                  <div class="truncate text-xs text-muted-foreground">ID: {{ row.id }}</div>
                </div>
              </div>
            </template>

            <!-- Custom type badge -->
            <template #type="{ row }">
              <Badge :variant="getTypeVariant(row.type)">
                {{ getTypeLabel(row.type) }}
              </Badge>
            </template>

            <!-- Path or action key -->
            <template #target="{ row }">
              <div class="space-y-1 text-xs">
                <div class="truncate font-mono text-foreground">
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
                <Badge v-if="row.hidden" variant="outline">Hidden</Badge>
                <Badge v-if="row.disabled" variant="warning">Disabled</Badge>
                <Badge v-if="!row.hidden && !row.disabled" variant="secondary">Normal</Badge>
              </div>
            </template>

            <!-- Demo actions -->
            <template #actions="{ row }">
              <div class="flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" @click.stop="handleAddChild(row)">Child</Button>
                <Button size="sm" variant="outline" @click.stop="handleEdit(row)">Edit</Button>
                <Button size="sm" variant="destructive" @click.stop="handleDelete(row)">
                  Delete
                </Button>
              </div>
            </template>
          </TreeTable>
        </div>

        <!-- Right panel: every switch updates the config passed into the tree table -->
        <aside class="space-y-4 rounded-2xl border border-border/60 bg-background/70 p-5">
          <div>
            <h2 class="text-base font-semibold">Config Panel</h2>
            <p class="mt-1 text-sm text-muted-foreground">
              These switches update the config object passed to the component.
            </p>
          </div>

          <div class="space-y-4">
            <div
              class="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
            >
              <div>
                <div class="text-sm font-medium">Enable tree mode</div>
                <div class="text-xs text-muted-foreground">Fallback to flat table when off</div>
              </div>
              <Switch v-model="treeEnabled" />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
            >
              <div>
                <div class="text-sm font-medium">Default expand all</div>
                <div class="text-xs text-muted-foreground">Useful for admin pages</div>
              </div>
              <Switch v-model="defaultExpandAll" />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
            >
              <div>
                <div class="text-sm font-medium">Expand on row click</div>
                <div class="text-xs text-muted-foreground">Clicking the row toggles the node</div>
              </div>
              <Switch v-model="expandOnRowClick" />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
            >
              <div>
                <div class="text-sm font-medium">Enable selection</div>
                <div class="text-xs text-muted-foreground">Show checkbox column</div>
              </div>
              <Switch v-model="selectionEnabled" />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
            >
              <div>
                <div class="text-sm font-medium">Strict selection</div>
                <div class="text-xs text-muted-foreground">Parent and child do not cascade</div>
              </div>
              <Switch v-model="checkStrictly" />
            </div>

            <div
              class="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
            >
              <div>
                <div class="text-sm font-medium">Enable pagination</div>
                <div class="text-xs text-muted-foreground">Use the built-in pager</div>
              </div>
              <Switch v-model="paginationEnabled" />
            </div>

            <div class="rounded-xl border border-border/60 px-4 py-3">
              <div class="text-sm font-medium">Page size</div>
              <div class="mt-2 text-xs text-muted-foreground">
                Controls how many rendered rows each page shows.
              </div>
              <select
                v-model="pageSize"
                class="mt-3 h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none"
              >
                <option :value="5">5</option>
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
              </select>
            </div>
          </div>

          <div class="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
            <div class="text-sm font-medium">Config preview</div>
            <pre class="mt-3 overflow-auto text-xs leading-6 text-muted-foreground">{{
              configPreview
            }}</pre>
          </div>

          <div v-if="activeRow" class="rounded-xl border border-border/60 bg-card p-4">
            <div class="text-sm font-medium">Active row</div>
            <div class="mt-2 text-sm text-muted-foreground">
              {{ activeRow.name }} / {{ activeRow.id }}
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { FolderTree, Plus, Search } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import TreeTable from '@/components/ui/tree-table-bak/index.vue'
import type {
  TreeTableColumn,
  TreeTableConfig,
  TreeTableNode,
  TreeTablePaginationConfig,
  TreeTableSelectionConfig,
  TreeTableToolbarConfig,
} from '@/components/ui/tree-table-bak/types'
import type { MenuNode, MenuNodeType } from '@/types/menu'
import { DEFAULT_MENU } from '@/views/home/data/MenuData'
import { ElMessage, ElMessageBox } from '@/utils/message'

const typeOptions: Array<{ value: MenuNodeType; label: string }> = [
  { value: 'route', label: 'Route' },
  { value: 'button', label: 'Button' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'list', label: 'List' },
  { value: 'list-item', label: 'List item' },
]

const columns: TreeTableColumn[] = [
  { key: 'name', title: 'Node', slot: 'name', width: '30%' },
  { key: 'type', title: 'Type', slot: 'type', width: '12%' },
  { key: 'target', title: 'Path / Action', slot: 'target', width: '28%' },
  { key: 'order', title: 'Order', width: '10%', align: 'center' },
  { key: 'status', title: 'Status', slot: 'status', width: '10%' },
  { key: 'actions', title: 'Actions', slot: 'actions', width: '20%', align: 'right' },
]

const menus = ref<MenuNode[]>(cloneTree(DEFAULT_MENU))
const keyword = ref('')
const selectedType = ref<'all' | MenuNodeType>('all')
const selectedKeys = ref<Array<string | number>>([])
const activeRowId = ref('')

// These switches intentionally map into config objects so the demo shows the intended usage pattern.
const treeEnabled = ref(true)
const defaultExpandAll = ref(true)
const expandOnRowClick = ref(false)
const selectionEnabled = ref(true)
const checkStrictly = ref(false)
const paginationEnabled = ref(true)
const pageSize = ref(10)

const treeConfig = computed<TreeTableConfig>(() => ({
  enabled: treeEnabled.value,
  rowKey: 'id',
  childrenKey: 'children',
  indent: 18,
  defaultExpandAll: defaultExpandAll.value,
  expandOnRowClick: expandOnRowClick.value,
}))

const selectionConfig = computed<TreeTableSelectionConfig>(() => ({
  enabled: selectionEnabled.value,
  checkStrictly: checkStrictly.value,
}))

const paginationConfig = computed<TreeTablePaginationConfig>(() => ({
  enabled: paginationEnabled.value,
  page: 1,
  pageSize: pageSize.value,
  pageSizeOptions: [5, 10, 20, 50],
}))

const toolbarConfig = computed<TreeTableToolbarConfig>(() => ({
  enabled: true,
  title: 'Menu Tree Table Demo',
  description:
    'Built-in toolbar, expand actions, selection summary, and pagination are provided by the component.',
  showExpandActions: true,
  showSelectionSummary: true,
}))

const filteredMenus = computed(() => filterMenus(menus.value, keyword.value, selectedType.value))

const totalCount = computed(() => countNodes(menus.value))
const filteredCount = computed(() => countNodes(filteredMenus.value))
const activeRow = computed(() => findNodeById(menus.value, activeRowId.value))

const configPreview = computed(() =>
  JSON.stringify(
    {
      treeConfig: treeConfig.value,
      selectionConfig: selectionConfig.value,
      paginationConfig: paginationConfig.value,
      toolbarConfig: toolbarConfig.value,
    },
    null,
    2
  )
)

function cloneTree(data: MenuNode[]): MenuNode[] {
  return JSON.parse(JSON.stringify(data)) as MenuNode[]
}

// Keep filtering at the tree level so parent-child structure is preserved after search.
function filterMenus(nodes: MenuNode[], keywordValue: string, typeValue: string): MenuNode[] {
  const normalizedKeyword = keywordValue.trim().toLowerCase()

  return nodes.reduce<MenuNode[]>((result, node) => {
    const children = node.children ? filterMenus(node.children, keywordValue, typeValue) : []
    const matchesKeyword =
      !normalizedKeyword ||
      node.name.toLowerCase().includes(normalizedKeyword) ||
      node.id.toLowerCase().includes(normalizedKeyword) ||
      node.path?.toLowerCase().includes(normalizedKeyword) ||
      node.actionKey?.toLowerCase().includes(normalizedKeyword)

    const matchesType = typeValue === 'all' || node.type === typeValue

    if ((matchesKeyword && matchesType) || children.length > 0) {
      result.push({
        ...node,
        children,
      })
    }

    return result
  }, [])
}

function countNodes(nodes: MenuNode[]): number {
  return nodes.reduce((count, node) => count + 1 + countNodes(node.children ?? []), 0)
}

function findNodeById(nodes: MenuNode[], id: string): MenuNode | null {
  for (const node of nodes) {
    if (node.id === id) return node

    const child = findNodeById(node.children ?? [], id)
    if (child) return child
  }

  return null
}

function getTypeLabel(type: string) {
  const labelMap: Record<MenuNodeType, string> = {
    route: 'Route',
    button: 'Button',
    dropdown: 'Dropdown',
    list: 'List',
    'list-item': 'List item',
  }

  return labelMap[type as MenuNodeType] ?? type
}

function getTypeVariant(type: string) {
  const variantMap: Record<MenuNodeType, 'default' | 'secondary' | 'outline' | 'success'> = {
    route: 'default',
    button: 'secondary',
    dropdown: 'outline',
    list: 'success',
    'list-item': 'secondary',
  }

  return variantMap[type as MenuNodeType] ?? 'secondary'
}

function getNodeAvatar(row: TreeTableNode) {
  const name = typeof row.name === 'string' ? row.name : '?'
  return name.slice(0, 1).toUpperCase()
}

function handleSelectionChange(_rows: TreeTableNode[], keys: Array<string | number>) {
  selectedKeys.value = keys
}

function handleRowClick(row: TreeTableNode) {
  activeRowId.value = String(row.id ?? '')
}

function handleReset() {
  menus.value = cloneTree(DEFAULT_MENU)
  selectedKeys.value = []
  activeRowId.value = ''
  ElMessage.success('Menu data reset')
}

function handleAddRoot() {
  const id = `menu-${Date.now()}`

  menus.value = [
    ...menus.value,
    {
      id,
      name: 'New root',
      type: 'route',
      icon: 'Menu',
      path: `/demo/${id}`,
      order: menus.value.length + 1,
    },
  ]

  ElMessage.success('Root node added')
}

function handleAddChild(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  const child: MenuNode = {
    id: `${sourceNode.id}-${Date.now()}`,
    name: `${sourceNode.name} child`,
    type: 'button',
    icon: 'Plus',
    actionKey: `action-${Date.now()}`,
    order: (sourceNode.children?.length ?? 0) + 1,
  }

  if (!sourceNode.children) {
    sourceNode.children = []
  }

  sourceNode.children.push(child)
  ElMessage.success(`Child node added to ${sourceNode.name}`)
}

function handleEdit(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  ElMessage.info(`Edit dialog can be connected here for ${sourceNode.name}`)
}

async function handleDelete(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  try {
    await ElMessageBox.confirm(`Delete node "${sourceNode.name}"?`, 'Delete confirmation', {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    })
  } catch {
    return
  }

  const removedIds = collectIds(sourceNode)
  menus.value = removeNode(menus.value, sourceNode.id)
  selectedKeys.value = selectedKeys.value.filter((key) => !removedIds.includes(key))

  if (activeRowId.value && removedIds.includes(activeRowId.value)) {
    activeRowId.value = ''
  }

  ElMessage.success('Node deleted')
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
  const blob = new Blob([JSON.stringify(menus.value, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `menu-tree-demo-${Date.now()}.json`
  link.click()

  URL.revokeObjectURL(url)
  ElMessage.success('Export complete')
}
</script>
