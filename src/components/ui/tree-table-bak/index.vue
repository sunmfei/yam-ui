<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronRight, Loader2, Minus, SquareCheckBig } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type {
  TreeTableColumn,
  TreeTableConfig,
  TreeTableNode,
  TreeTablePaginationConfig,
  TreeTableSelectionConfig,
  TreeTableToolbarConfig,
} from './types'

interface FlattenedRow {
  node: TreeTableNode
  level: number
}

const props = withDefaults(
  defineProps<{
    data: TreeTableNode[]
    columns: TreeTableColumn[]
    loading?: boolean
    emptyText?: string
    treeConfig?: TreeTableConfig
    selectionConfig?: TreeTableSelectionConfig
    toolbarConfig?: TreeTableToolbarConfig
    paginationConfig?: TreeTablePaginationConfig
    loadChildren?: (node: TreeTableNode) => Promise<TreeTableNode[]>
  }>(),
  {
    loading: false,
    emptyText: 'No data',
    treeConfig: () => ({}),
    selectionConfig: () => ({}),
    toolbarConfig: () => ({}),
    paginationConfig: () => ({}),
  }
)

const emit = defineEmits<{
  toggle: [payload: { row: TreeTableNode; expanded: boolean }]
  rowClick: [row: TreeTableNode]
  selectionChange: [rows: TreeTableNode[], keys: Array<string | number>]
  pageChange: [payload: { page: number; pageSize: number }]
}>()

// Merge all external config with sensible defaults so the component works out of the box.
const mergedTreeConfig = computed<Required<TreeTableConfig>>(() => ({
  enabled: props.treeConfig?.enabled ?? true,
  rowKey: props.treeConfig?.rowKey ?? 'id',
  childrenKey: props.treeConfig?.childrenKey ?? 'children',
  indent: props.treeConfig?.indent ?? 18,
  expandOnRowClick: props.treeConfig?.expandOnRowClick ?? false,
  defaultExpandAll: props.treeConfig?.defaultExpandAll ?? false,
  defaultExpandedKeys: props.treeConfig?.defaultExpandedKeys ?? [],
}))

const mergedSelectionConfig = computed<Required<TreeTableSelectionConfig>>(() => ({
  enabled: props.selectionConfig?.enabled ?? false,
  checkStrictly: props.selectionConfig?.checkStrictly ?? false,
  defaultSelectedKeys: props.selectionConfig?.defaultSelectedKeys ?? [],
}))

const mergedToolbarConfig = computed<Required<TreeTableToolbarConfig>>(() => ({
  enabled: props.toolbarConfig?.enabled ?? true,
  title: props.toolbarConfig?.title ?? '',
  description: props.toolbarConfig?.description ?? '',
  showExpandActions: props.toolbarConfig?.showExpandActions ?? true,
  showSelectionSummary: props.toolbarConfig?.showSelectionSummary ?? true,
}))

const mergedPaginationConfig = computed<Required<TreeTablePaginationConfig>>(() => ({
  enabled: props.paginationConfig?.enabled ?? false,
  page: props.paginationConfig?.page ?? 1,
  pageSize: props.paginationConfig?.pageSize ?? 10,
  pageSizeOptions: props.paginationConfig?.pageSizeOptions ?? [10, 20, 50, 100],
}))

// Track tree expansion, row selection, and lazy-loading state independently.
const expandedKeys = ref(new Set<string | number>())
const selectedKeys = ref(new Set<string | number>())
const loadingKeys = ref(new Set<string | number>())

// Internal pagination state makes the component usable without external state management.
const currentPage = ref(1)
const currentPageSize = ref(10)

function getRowKey(row: TreeTableNode) {
  return row[mergedTreeConfig.value.rowKey] as string | number
}

function getChildren(row: TreeTableNode): TreeTableNode[] {
  const children = row[mergedTreeConfig.value.childrenKey]
  return Array.isArray(children) ? children : []
}

function setChildren(row: TreeTableNode, children: TreeTableNode[]) {
  row[mergedTreeConfig.value.childrenKey] = children
}

function hasChildren(row: TreeTableNode) {
  return getChildren(row).length > 0 || row.hasChildren === true
}

function isExpanded(row: TreeTableNode) {
  return expandedKeys.value.has(getRowKey(row))
}

function isSelected(row: TreeTableNode) {
  return selectedKeys.value.has(getRowKey(row))
}

function isLoading(row: TreeTableNode) {
  return loadingKeys.value.has(getRowKey(row))
}

function collectExpandableKeys(rows: TreeTableNode[]): Array<string | number> {
  return rows.flatMap((row) => {
    const current = hasChildren(row) ? [getRowKey(row)] : []
    return current.concat(collectExpandableKeys(getChildren(row)))
  })
}

watch(
  [() => props.data, mergedTreeConfig],
  () => {
    if (mergedTreeConfig.value.defaultExpandAll) {
      expandedKeys.value = new Set(collectExpandableKeys(props.data))
      return
    }

    expandedKeys.value = new Set(mergedTreeConfig.value.defaultExpandedKeys)
  },
  { immediate: true, deep: true }
)

watch(
  [() => props.data, mergedSelectionConfig],
  () => {
    selectedKeys.value = new Set(mergedSelectionConfig.value.defaultSelectedKeys)
  },
  { immediate: true, deep: true }
)

watch(
  mergedPaginationConfig,
  (config) => {
    currentPage.value = Math.max(1, config.page)
    currentPageSize.value = Math.max(1, config.pageSize)
  },
  { immediate: true, deep: true }
)

// Flatten tree rows after expansion state is applied. Pagination runs on this flat list.
function flattenRows(rows: TreeTableNode[], level = 0): FlattenedRow[] {
  const flattened: FlattenedRow[] = []

  for (const row of rows) {
    flattened.push({ node: row, level: mergedTreeConfig.value.enabled ? level : 0 })

    const children = getChildren(row)
    if (children.length === 0) continue

    if (!mergedTreeConfig.value.enabled) {
      flattened.push(...flattenRows(children, 0))
      continue
    }

    if (isExpanded(row)) {
      flattened.push(...flattenRows(children, level + 1))
    }
  }

  return flattened
}

const flatRows = computed(() => flattenRows(props.data))
const totalRows = computed(() => flatRows.value.length)
const totalPages = computed(() => {
  if (!mergedPaginationConfig.value.enabled) return 1
  return Math.max(1, Math.ceil(totalRows.value / currentPageSize.value))
})

const pagedRows = computed(() => {
  if (!mergedPaginationConfig.value.enabled) return flatRows.value

  const start = (currentPage.value - 1) * currentPageSize.value
  return flatRows.value.slice(start, start + currentPageSize.value)
})

watch(
  [totalPages, totalRows],
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
  { immediate: true }
)

const selectedRowKeys = computed(() => Array.from(selectedKeys.value))
const selectedRowCount = computed(() => selectedRowKeys.value.length)
const allVisibleSelected = computed(
  () =>
    pagedRows.value.length > 0 &&
    pagedRows.value.every((row) => selectedKeys.value.has(getRowKey(row.node)))
)

function getAlignClass(align?: TreeTableColumn['align']) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

function getCellValue(row: TreeTableNode, column: TreeTableColumn) {
  return row[column.key]
}

function findRowByKey(rows: TreeTableNode[], key: string | number): TreeTableNode | null {
  for (const row of rows) {
    if (getRowKey(row) === key) return row

    const child = findRowByKey(getChildren(row), key)
    if (child) return child
  }

  return null
}

function emitSelectionChange() {
  const rows = Array.from(selectedKeys.value)
    .map((key) => findRowByKey(props.data, key))
    .filter((row): row is TreeTableNode => Boolean(row))

  emit('selectionChange', rows, selectedRowKeys.value)
}

function collectDescendantKeys(row: TreeTableNode): Array<string | number> {
  return getChildren(row).flatMap((child) => [getRowKey(child), ...collectDescendantKeys(child)])
}

function getNodeSelectionState(row: TreeTableNode): 'checked' | 'indeterminate' | 'unchecked' {
  if (isSelected(row)) return 'checked'

  const children = getChildren(row)
  if (children.length === 0) return 'unchecked'

  const states = children.map(getNodeSelectionState)
  if (states.every((state) => state === 'checked')) return 'checked'
  if (states.some((state) => state !== 'unchecked')) return 'indeterminate'
  return 'unchecked'
}

function syncAncestorSelection(targetRow: TreeTableNode, rows: TreeTableNode[]) {
  for (const row of rows) {
    const children = getChildren(row)
    const directChild = children.some((child) => getRowKey(child) === getRowKey(targetRow))

    if (directChild) {
      const states = children.map(getNodeSelectionState)

      if (states.every((state) => state === 'checked')) {
        selectedKeys.value.add(getRowKey(row))
      } else {
        selectedKeys.value.delete(getRowKey(row))
      }

      syncAncestorSelection(row, props.data)
      return
    }

    if (children.length > 0) {
      syncAncestorSelection(targetRow, children)
    }
  }
}

function toggleSelectRow(row: TreeTableNode, checked: boolean) {
  const key = getRowKey(row)

  if (checked) {
    selectedKeys.value.add(key)
  } else {
    selectedKeys.value.delete(key)
  }

  if (!mergedSelectionConfig.value.checkStrictly) {
    for (const descendantKey of collectDescendantKeys(row)) {
      if (checked) {
        selectedKeys.value.add(descendantKey)
      } else {
        selectedKeys.value.delete(descendantKey)
      }
    }

    syncAncestorSelection(row, props.data)
  }

  emitSelectionChange()
}

// Header checkbox only affects the current page, which is the expected paged-table behavior.
function toggleSelectAll(checked: boolean) {
  if (checked) {
    for (const row of pagedRows.value) {
      selectedKeys.value.add(getRowKey(row.node))
    }
  } else {
    for (const row of pagedRows.value) {
      selectedKeys.value.delete(getRowKey(row.node))
    }
  }

  emitSelectionChange()
}

function setCheckboxState(
  element: HTMLInputElement | null,
  state: 'checked' | 'indeterminate' | 'unchecked'
) {
  if (!element) return
  element.indeterminate = state === 'indeterminate'
}

function bindRowCheckbox(element: unknown, row: TreeTableNode) {
  if (element instanceof HTMLInputElement) {
    setCheckboxState(element, getNodeSelectionState(row))
  }
}

function handleHeaderCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement
  toggleSelectAll(target.checked)
}

function handleRowCheckboxChange(row: TreeTableNode, event: Event) {
  const target = event.target as HTMLInputElement
  toggleSelectRow(row, target.checked)
}

async function toggleRow(row: TreeTableNode) {
  const key = getRowKey(row)

  if (expandedKeys.value.has(key)) {
    expandedKeys.value.delete(key)
    emit('toggle', { row, expanded: false })
    return
  }

  const needsLazyLoad = props.loadChildren && row.hasChildren && getChildren(row).length === 0
  if (needsLazyLoad) {
    loadingKeys.value.add(key)
    try {
      const children = await props.loadChildren(row)
      setChildren(row, children ?? [])
    } finally {
      loadingKeys.value.delete(key)
    }
  }

  expandedKeys.value.add(key)
  emit('toggle', { row, expanded: true })
}

function expandAll() {
  expandedKeys.value = new Set(collectExpandableKeys(props.data))
}

function collapseAll() {
  expandedKeys.value.clear()
}

function handleRowClick(row: TreeTableNode) {
  if (
    mergedTreeConfig.value.enabled &&
    mergedTreeConfig.value.expandOnRowClick &&
    hasChildren(row)
  ) {
    toggleRow(row)
  }

  emit('rowClick', row)
}

function emitPageChange() {
  emit('pageChange', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
  })
}

function goToPage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value)
  if (nextPage === currentPage.value) return

  currentPage.value = nextPage
  emitPageChange()
}

function handlePageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const nextPageSize = Number(target.value) || currentPageSize.value

  currentPageSize.value = nextPageSize
  currentPage.value = 1
  emitPageChange()
}
</script>

<template>
  <div class="space-y-4">
    <div
      v-if="mergedToolbarConfig.enabled"
      class="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 md:flex-row md:items-center md:justify-between"
    >
      <div class="space-y-1">
        <div v-if="mergedToolbarConfig.title" class="text-sm font-semibold text-foreground">
          {{ mergedToolbarConfig.title }}
        </div>
        <div v-if="mergedToolbarConfig.description" class="text-sm text-muted-foreground">
          {{ mergedToolbarConfig.description }}
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <div
          v-if="mergedSelectionConfig.enabled && mergedToolbarConfig.showSelectionSummary"
          class="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
        >
          <SquareCheckBig class="h-4 w-4" />
          Selected {{ selectedRowCount }}
        </div>

        <Separator
          v-if="mergedTreeConfig.enabled && mergedToolbarConfig.showExpandActions"
          orientation="vertical"
          class="hidden h-6 md:block"
        />

        <template v-if="mergedTreeConfig.enabled && mergedToolbarConfig.showExpandActions">
          <Button size="sm" variant="outline" @click="expandAll">Expand all</Button>
          <Button size="sm" variant="outline" @click="collapseAll">Collapse all</Button>
        </template>
      </div>
    </div>

    <Table class="rounded-2xl border border-border/60 bg-card">
      <TableHeader>
        <TableRow class="hover:bg-transparent">
          <TableHead v-if="mergedSelectionConfig.enabled" class="w-14 text-center">
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-input accent-primary"
              :checked="allVisibleSelected"
              @change="handleHeaderCheckboxChange"
            />
          </TableHead>

          <TableHead
            v-for="(column, index) in columns"
            :key="column.key"
            :style="{ width: column.width }"
            :class="[
              'h-12 bg-muted/40 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground',
              getAlignClass(column.align),
              column.headerClass,
              index === 0 ? 'pl-4' : '',
            ]"
          >
            {{ column.title }}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <template v-if="loading">
          <TableRow class="hover:bg-transparent">
            <TableCell
              :colspan="columns.length + (mergedSelectionConfig.enabled ? 1 : 0)"
              class="h-48"
            >
              <div class="flex items-center justify-center gap-3 text-muted-foreground">
                <Loader2 class="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="flatRows.length === 0">
          <TableRow class="hover:bg-transparent">
            <TableCell
              :colspan="columns.length + (mergedSelectionConfig.enabled ? 1 : 0)"
              class="h-48"
            >
              <div class="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed"
                >
                  <Minus class="h-5 w-5" />
                </div>
                <span>{{ emptyText }}</span>
              </div>
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow
            v-for="row in pagedRows"
            :key="getRowKey(row.node)"
            :class="row.node.disabled ? 'opacity-60' : ''"
            @click="handleRowClick(row.node)"
          >
            <TableCell v-if="mergedSelectionConfig.enabled" class="w-14 text-center">
              <input
                :ref="(element) => bindRowCheckbox(element, row.node)"
                type="checkbox"
                class="h-4 w-4 rounded border-input accent-primary"
                :checked="getNodeSelectionState(row.node) === 'checked'"
                @click.stop
                @change="handleRowCheckboxChange(row.node, $event)"
              />
            </TableCell>

            <TableCell
              v-for="(column, index) in columns"
              :key="column.key"
              :class="[
                'h-12 align-middle',
                getAlignClass(column.align),
                column.cellClass,
                index === 0 ? 'pl-4' : '',
              ]"
            >
              <div
                v-if="index === 0"
                class="flex min-w-0 items-center gap-2"
                :style="{ paddingLeft: `${row.level * mergedTreeConfig.indent}px` }"
              >
                <button
                  v-if="mergedTreeConfig.enabled && hasChildren(row.node)"
                  type="button"
                  class="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-transparent text-muted-foreground transition hover:border-border hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                  :disabled="isLoading(row.node)"
                  @click.stop="toggleRow(row.node)"
                >
                  <Loader2 v-if="isLoading(row.node)" class="h-4 w-4 animate-spin" />
                  <ChevronRight
                    v-else
                    class="h-4 w-4 transition-transform"
                    :class="isExpanded(row.node) ? 'rotate-90' : ''"
                  />
                </button>

                <span v-else-if="mergedTreeConfig.enabled" class="inline-block h-7 w-7 shrink-0" />

                <div class="min-w-0 flex-1">
                  <slot
                    :name="column.slot ?? `cell-${column.key}`"
                    :row="row.node"
                    :column="column"
                    :value="getCellValue(row.node, column)"
                    :level="row.level"
                    :expanded="isExpanded(row.node)"
                    :selected="isSelected(row.node)"
                  >
                    <div class="truncate font-medium text-foreground">
                      {{ getCellValue(row.node, column) ?? '-' }}
                    </div>
                  </slot>
                </div>
              </div>

              <slot
                v-else
                :name="column.slot ?? `cell-${column.key}`"
                :row="row.node"
                :column="column"
                :value="getCellValue(row.node, column)"
                :level="row.level"
                :expanded="isExpanded(row.node)"
                :selected="isSelected(row.node)"
              >
                <div class="truncate text-muted-foreground">
                  {{ getCellValue(row.node, column) ?? '-' }}
                </div>
              </slot>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>

    <div
      v-if="mergedPaginationConfig.enabled && totalRows > 0"
      class="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 md:flex-row md:items-center md:justify-between"
    >
      <div class="text-sm text-muted-foreground">
        Showing
        <span class="font-medium text-foreground">
          {{ (currentPage - 1) * currentPageSize + 1 }}
        </span>
        -
        <span class="font-medium text-foreground">
          {{ Math.min(currentPage * currentPageSize, totalRows) }}
        </span>
        of
        <span class="font-medium text-foreground">{{ totalRows }}</span>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label class="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Page size</span>
          <select
            class="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none"
            :value="currentPageSize"
            @change="handlePageSizeChange"
          >
            <option
              v-for="size in mergedPaginationConfig.pageSizeOptions"
              :key="size"
              :value="size"
            >
              {{ size }}
            </option>
          </select>
        </label>

        <div class="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            Prev
          </Button>
          <div class="min-w-24 text-center text-sm text-muted-foreground">
            Page {{ currentPage }} / {{ totalPages }}
          </div>
          <Button
            size="sm"
            variant="outline"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
