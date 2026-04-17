<template>
  <div class="flex h-full flex-col space-y-4">
    <div
      v-if="mergedToolbarConfig.enabled"
      class="flex shrink-0 flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 md:flex-row md:items-center md:justify-between"
    >
      <!-- 左侧插槽 -->
      <slot name="toolbar-left">
        <div class="space-y-1">
          <div v-if="mergedToolbarConfig.title" class="text-sm font-semibold text-foreground">
            {{ mergedToolbarConfig.title }}
          </div>
          <div v-if="mergedToolbarConfig.description" class="text-sm text-muted-foreground">
            {{ mergedToolbarConfig.description }}
          </div>
        </div>
      </slot>

      <!-- 右侧插槽 -->
      <slot name="toolbar-right">
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

          <Button
            v-if="mergedToolbarConfig.showConfigToggle"
            size="sm"
            variant="outline"
            class="gap-1.5"
            @click="emit('configToggle')"
          >
            <PanelLeftClose class="h-4 w-4" />
            隐藏配置
          </Button>
        </div>
      </slot>
    </div>

    <div
      class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
    >
      <div class="shrink-0 overflow-x-auto">
        <Table>
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
        </Table>
      </div>

      <div class="min-h-0 flex-1 overflow-auto">
        <Table>
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
                  <div
                    class="flex flex-col items-center justify-center gap-3 text-muted-foreground"
                  >
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

                    <span
                      v-else-if="mergedTreeConfig.enabled"
                      class="inline-block h-7 w-7 shrink-0"
                    />

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
      </div>
    </div>

    <div
      v-if="mergedPaginationConfig.enabled && totalRows > 0"
      class="shrink-0 flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 md:flex-row md:items-center md:justify-between"
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

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronRight, Loader2, Minus, PanelLeftClose, SquareCheckBig } from 'lucide-vue-next'
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

/**
 * 树表格组件
 *
 * 一个功能强大的表格组件，支持树形结构、行选择、分页和可自定义的工具栏。
 *
 * 组件功能：
 * - 树形展开/折叠，支持懒加载
 * - 行选择（严格模式/级联模式）
 * - 扁平化树行的分页
 * - 可自定义的工具栏，包含展开/选择操作
 * - 基于插槽的单元格自定义
 *
 * 使用方法：
 *
 * 1. 引入组件：
 *    import { TreeTable } from '@/components/ui/tree-table-1'
 *
 * 2. 基本使用示例：
 *    <TreeTable
 *      :data="treeData"
 *      :columns="columns"
 *      :tree-config="{ enabled: true }"
 *      :selection-config="{ enabled: true }"
 *      @selection-change="handleSelectionChange"
 *    />
 *
 * 3. Props说明：
 *    - data: 树形数据数组，每个节点需包含唯一标识符（默认'id'字段）
 *    - columns: 列配置数组，定义每列的显示和行为
 *    - treeConfig: 树形配置，控制展开/折叠行为
 *    - selectionConfig: 选择配置，控制行选择行为
 *    - toolbarConfig: 工具栏配置，控制工具栏显示内容
 *    - paginationConfig: 分页配置，控制分页行为
 *    - loadChildren: 懒加载函数，用于动态加载子节点
 *
 * 4. 事件说明：
 *    - toggle: 节点展开/折叠时触发
 *    - rowClick: 行点击时触发
 *    - selectionChange: 选择状态变化时触发
 *    - pageChange: 分页变化时触发
 *
 * 5. 插槽使用：
 *    每列可通过slot属性定义自定义插槽，插槽名称为 `cell-{column.key}`
 *    插槽参数：{ row, column, value, level, expanded, selected }
 */

/**
 * 扁平化行表示，用于渲染
 *
 * 将树形节点扁平化为适合表格渲染的格式，同时保留层级信息
 */
interface FlattenedRow {
  /** 原始树节点 */
  node: TreeTableNode
  /** 嵌套层级（0表示根节点） */
  level: number
}

/**
 * 组件属性定义
 *
 * 所有可配置的props，用于控制组件的行为和显示
 */
const props = withDefaults(
  defineProps<{
    /** 树形数据数组，每个节点应包含唯一标识符 */
    data: TreeTableNode[]
    /** 列配置数组，定义表格的列结构和行为 */
    columns: TreeTableColumn[]
    /** 是否显示加载状态 */
    loading?: boolean
    /** 数据为空时显示的文本 */
    emptyText?: string
    /** 树形结构配置，控制展开/折叠等行为 */
    treeConfig?: TreeTableConfig
    /** 行选择配置，控制选择行为和模式 */
    selectionConfig?: TreeTableSelectionConfig
    /** 工具栏配置，控制工具栏的显示和内容 */
    toolbarConfig?: TreeTableToolbarConfig
    /** 分页配置，控制分页行为和显示 */
    paginationConfig?: TreeTablePaginationConfig
    /**
     * 懒加载函数，用于动态加载子节点
     * @param node - 需要加载子节点的父节点
     * @returns 子节点数组的Promise
     */
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

/**
 * 组件事件定义
 *
 * 组件对外暴露的事件，用于父组件监听组件内部状态变化
 */
const emit = defineEmits<{
  /**
   * 节点展开/折叠状态变化时触发
   * @param payload - 包含节点和展开状态的对象
   */
  toggle: [payload: { row: TreeTableNode; expanded: boolean }]
  /**
   * 行被点击时触发（除非点击的是展开按钮或复选框）
   * @param row - 被点击的行数据
   */
  rowClick: [row: TreeTableNode]
  /**
   * 选择状态变化时触发
   * @param rows - 被选中的行数据数组
   * @param keys - 被选中的行键值数组
   */
  selectionChange: [rows: TreeTableNode[], keys: Array<string | number>]
  /**
   * 分页变化时触发（页码或每页行数变化）
   * @param payload - 包含新页码和每页行数的对象
   */
  pageChange: [payload: { page: number; pageSize: number }]
  /**
   * 配置面板切换按钮点击时触发
   */
  configToggle: []
}>()

/**
 * 合并配置计算属性
 *
 * 将外部传入的配置与默认值合并，确保组件在各种配置下都能正常工作
 */

/**
 * 合并后的树形配置
 *
 * 提供完整的树形功能配置，包含所有必需属性
 */
const mergedTreeConfig = computed<Required<TreeTableConfig>>(() => ({
  enabled: props.treeConfig?.enabled ?? true,
  rowKey: props.treeConfig?.rowKey ?? 'id',
  childrenKey: props.treeConfig?.childrenKey ?? 'children',
  indent: props.treeConfig?.indent ?? 18,
  expandOnRowClick: props.treeConfig?.expandOnRowClick ?? false,
  defaultExpandAll: props.treeConfig?.defaultExpandAll ?? false,
  defaultExpandedKeys: props.treeConfig?.defaultExpandedKeys ?? [],
}))

/**
 * 合并后的选择配置
 *
 * 提供完整的行选择功能配置
 */
const mergedSelectionConfig = computed<Required<TreeTableSelectionConfig>>(() => ({
  enabled: props.selectionConfig?.enabled ?? false,
  checkStrictly: props.selectionConfig?.checkStrictly ?? false,
  defaultSelectedKeys: props.selectionConfig?.defaultSelectedKeys ?? [],
}))

/**
 * 合并后的工具栏配置
 *
 * 提供完整的工具栏显示配置
 */
const mergedToolbarConfig = computed<Required<TreeTableToolbarConfig>>(() => ({
  enabled: props.toolbarConfig?.enabled ?? true,
  title: props.toolbarConfig?.title ?? '',
  description: props.toolbarConfig?.description ?? '',
  showExpandActions: props.toolbarConfig?.showExpandActions ?? true,
  showSelectionSummary: props.toolbarConfig?.showSelectionSummary ?? true,
  showConfigToggle: props.toolbarConfig?.showConfigToggle ?? false,
}))

/**
 * 合并后的分页配置
 *
 * 提供完整的分页功能配置
 */
const mergedPaginationConfig = computed<Required<TreeTablePaginationConfig>>(() => ({
  enabled: props.paginationConfig?.enabled ?? false,
  page: props.paginationConfig?.page ?? 1,
  pageSize: props.paginationConfig?.pageSize ?? 10,
  pageSizeOptions: props.paginationConfig?.pageSizeOptions ?? [10, 20, 50, 100],
}))

/**
 * 组件内部状态管理
 *
 * 跟踪树形展开、行选择、懒加载和分页状态
 */

/**
 * 已展开节点的键值集合
 *
 * 存储当前所有展开状态的节点键值
 */
const expandedKeys = ref(new Set<string | number>())

/**
 * 已选择节点的键值集合
 *
 * 存储当前所有被选中的节点键值
 */
const selectedKeys = ref(new Set<string | number>())

/**
 * 正在加载子节点的键值集合
 *
 * 用于懒加载场景，跟踪正在加载子节点的节点
 */
const loadingKeys = ref(new Set<string | number>())

/**
 * 内部分页状态
 *
 * 使组件可以在没有外部状态管理的情况下独立使用分页功能
 */

/**
 * 当前页码（1起始）
 */
const currentPage = ref(1)

/**
 * 当前每页显示行数
 */
const currentPageSize = ref(10)

/**
 * 获取节点的唯一键值
 *
 * 根据配置的rowKey属性从节点数据中提取唯一标识符
 *
 * @param row - 树节点数据
 * @returns 节点的唯一键值（字符串或数字）
 */
function getRowKey(row: TreeTableNode) {
  return row[mergedTreeConfig.value.rowKey] as string | number
}

/**
 * 获取节点的子节点数组
 *
 * 根据配置的childrenKey属性从节点数据中提取子节点列表
 *
 * @param row - 父节点数据
 * @returns 子节点数组（如果不存在或不是数组则返回空数组）
 */
function getChildren(row: TreeTableNode): TreeTableNode[] {
  const children = row[mergedTreeConfig.value.childrenKey]
  return Array.isArray(children) ? children : []
}

/**
 * 设置节点的子节点数组
 *
 * 根据配置的childrenKey属性将子节点列表设置到节点数据中
 *
 * @param row - 父节点数据
 * @param children - 子节点数组
 */
function setChildren(row: TreeTableNode, children: TreeTableNode[]) {
  row[mergedTreeConfig.value.childrenKey] = children
}

/**
 * 判断节点是否有子节点
 *
 * 检查节点是否实际包含子节点，或者通过hasChildren标记表示有子节点（用于懒加载）
 *
 * @param row - 节点数据
 * @returns 如果节点有子节点则返回true
 */
function hasChildren(row: TreeTableNode) {
  return getChildren(row).length > 0 || row.hasChildren === true
}

/**
 * 判断节点是否已展开
 *
 * 检查节点的键值是否在已展开键值集合中
 *
 * @param row - 节点数据
 * @returns 如果节点已展开则返回true
 */
function isExpanded(row: TreeTableNode) {
  return expandedKeys.value.has(getRowKey(row))
}

/**
 * 判断节点是否被选中
 *
 * 检查节点的键值是否在已选择键值集合中
 *
 * @param row - 节点数据
 * @returns 如果节点被选中则返回true
 */
function isSelected(row: TreeTableNode) {
  return selectedKeys.value.has(getRowKey(row))
}

/**
 * 判断节点是否正在加载子节点
 *
 * 检查节点的键值是否在正在加载键值集合中（用于懒加载场景）
 *
 * @param row - 节点数据
 * @returns 如果节点正在加载子节点则返回true
 */
function isLoading(row: TreeTableNode) {
  return loadingKeys.value.has(getRowKey(row))
}

/**
 * 收集所有可展开节点的键值
 *
 * 递归遍历树形数据，收集所有包含子节点的节点的键值
 * 用于"展开所有"功能
 *
 * @param rows - 树节点数组
 * @returns 所有可展开节点的键值数组
 */
function collectExpandableKeys(rows: TreeTableNode[]): Array<string | number> {
  return rows.flatMap((row) => {
    const current = hasChildren(row) ? [getRowKey(row)] : []
    return current.concat(collectExpandableKeys(getChildren(row)))
  })
}

/**
 * 监听数据变化和树形配置变化，更新展开状态
 *
 * 当数据或树形配置变化时：
 * 1. 如果配置了defaultExpandAll，则展开所有可展开节点
 * 2. 否则，使用defaultExpandedKeys配置的键值
 */
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

/**
 * 监听数据变化和选择配置变化，更新选择状态
 *
 * 当数据或选择配置变化时，使用defaultSelectedKeys配置初始化选择状态
 */
watch(
  [() => props.data, mergedSelectionConfig],
  () => {
    selectedKeys.value = new Set(mergedSelectionConfig.value.defaultSelectedKeys)
  },
  { immediate: true, deep: true }
)

/**
 * 监听分页配置变化，更新内部分页状态
 *
 * 当分页配置变化时，同步当前页码和每页行数，确保值合法（不小于1）
 */
watch(
  mergedPaginationConfig,
  (config) => {
    currentPage.value = Math.max(1, config.page)
    currentPageSize.value = Math.max(1, config.pageSize)
  },
  { immediate: true, deep: true }
)

/**
 * 将树形数据扁平化为行数组，根据展开状态决定是否包含子节点
 *
 * 递归遍历树形数据，生成适合表格渲染的扁平化行数组
 * 根据树形功能是否启用和节点的展开状态，决定是否包含子节点
 *
 * @param rows - 树节点数组
 * @param level - 当前嵌套层级（默认0，表示根层级）
 * @returns 扁平化的行数组，包含节点数据和层级信息
 */
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

/**
 * 扁平化后的行数据（计算属性）
 *
 * 基于当前数据和展开状态生成的扁平化行数组
 * 这是后续分页和显示的基础数据
 */
const flatRows = computed(() => flattenRows(props.data))
/**
 * 总行数（计算属性）
 *
 * 扁平化行数组的长度，表示当前可见的总行数
 */
const totalRows = computed(() => flatRows.value.length)
/**
 * 总页数（计算属性）
 *
 * 根据总行数和每页行数计算总页数
 * 如果分页未启用，则总页数为1
 */
const totalPages = computed(() => {
  if (!mergedPaginationConfig.value.enabled) return 1
  return Math.max(1, Math.ceil(totalRows.value / currentPageSize.value))
})

/**
 * 分页后的行数据（计算属性）
 *
 * 根据当前页码和每页行数，从扁平化行数组中切片出当前页的数据
 * 如果分页未启用，则返回所有扁平化行数据
 */
const pagedRows = computed(() => {
  if (!mergedPaginationConfig.value.enabled) return flatRows.value

  const start = (currentPage.value - 1) * currentPageSize.value
  return flatRows.value.slice(start, start + currentPageSize.value)
})

/**
 * 监听总页数和总行数变化，确保当前页码不超过总页数
 *
 * 当数据变化导致总页数减少时，自动调整当前页码使其合法
 */
watch(
  [totalPages, totalRows],
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
    }
  },
  { immediate: true }
)

/**
 * 已选择行的键值数组（计算属性）
 *
 * 将Set类型的selectedKeys转换为数组形式，便于外部使用
 */
const selectedRowKeys = computed(() => Array.from(selectedKeys.value))
/**
 * 已选择行数（计算属性）
 *
 * 当前被选中的行数量，用于工具栏显示
 */
const selectedRowCount = computed(() => selectedRowKeys.value.length)
/**
 * 是否当前页所有行都被选中（计算属性）
 *
 * 用于表头复选框的indeterminate状态判断
 * 仅检查当前分页页面内的行，符合分页表格的常规行为
 */
const allVisibleSelected = computed(
  () =>
    pagedRows.value.length > 0 &&
    pagedRows.value.every((row) => selectedKeys.value.has(getRowKey(row.node)))
)

/**
 * 获取对齐方式的CSS类名
 *
 * 根据列配置的align属性返回对应的Tailwind CSS类名
 *
 * @param align - 对齐方式（'left'、'center'、'right'）
 * @returns 对应的CSS类名字符串
 */
function getAlignClass(align?: TreeTableColumn['align']) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

/**
 * 获取单元格的值
 *
 * 根据列配置的key属性从行数据中提取对应字段的值
 *
 * @param row - 行数据
 * @param column - 列配置
 * @returns 单元格的值
 */
function getCellValue(row: TreeTableNode, column: TreeTableColumn) {
  return row[column.key]
}

/**
 * 根据键值在树形数据中查找节点
 *
 * 递归遍历树形数据，查找具有指定键值的节点
 *
 * @param rows - 树节点数组
 * @param key - 要查找的键值
 * @returns 找到的节点，如果未找到则返回null
 */
function findRowByKey(rows: TreeTableNode[], key: string | number): TreeTableNode | null {
  for (const row of rows) {
    if (getRowKey(row) === key) return row

    const child = findRowByKey(getChildren(row), key)
    if (child) return child
  }

  return null
}

/**
 * 触发选择变化事件
 *
 * 将当前选中的键值转换为对应的行数据，并通过emit触发selectionChange事件
 * 供父组件监听选择状态变化
 */
function emitSelectionChange() {
  const rows = Array.from(selectedKeys.value)
    .map((key) => findRowByKey(props.data, key))
    .filter((row): row is TreeTableNode => Boolean(row))

  emit('selectionChange', rows, selectedRowKeys.value)
}

/**
 * 收集节点的所有后代节点键值
 *
 * 递归遍历节点的所有子节点和孙节点，收集它们的键值
 * 用于级联选择时选中/取消选中所有后代
 *
 * @param row - 父节点
 * @returns 所有后代节点的键值数组
 */
function collectDescendantKeys(row: TreeTableNode): Array<string | number> {
  return getChildren(row).flatMap((child) => [getRowKey(child), ...collectDescendantKeys(child)])
}

/**
 * 获取节点的选择状态
 *
 * 根据节点自身及其子节点的选择状态，返回节点的综合选择状态
 * 用于级联选择时判断复选框的状态（选中/未选中/部分选中）
 *
 * @param row - 节点
 * @returns 节点的选择状态：'checked'（选中）、'indeterminate'（部分选中）、'unchecked'（未选中）
 */
function getNodeSelectionState(row: TreeTableNode): 'checked' | 'indeterminate' | 'unchecked' {
  if (isSelected(row)) return 'checked'

  const children = getChildren(row)
  if (children.length === 0) return 'unchecked'

  const states = children.map(getNodeSelectionState)
  if (states.every((state) => state === 'checked')) return 'checked'
  if (states.some((state) => state !== 'unchecked')) return 'indeterminate'
  return 'unchecked'
}

/**
 * 同步祖先节点的选择状态
 *
 * 当子节点选择状态变化时，递归更新父节点的选择状态
 * 用于级联选择时保持父子节点选择状态的一致性
 *
 * @param targetRow - 触发变化的子节点
 * @param rows - 要搜索的节点数组（通常是整个数据树）
 */
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

/**
 * 切换单行选择状态
 *
 * 根据checked参数添加或移除行的选择状态
 * 如果启用了级联选择（checkStrictly为false），则同时处理所有后代节点和祖先节点
 *
 * @param row - 要切换选择状态的行
 * @param checked - 是否选中该行
 */
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

/**
 * 切换当前页所有行的选择状态
 *
 * 表头复选框仅影响当前分页页面内的所有行，这是分页表格的预期行为
 *
 * @param checked - 是否选中当前页所有行
 */
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

/**
 * 设置复选框的视觉状态
 *
 * 根据选择状态设置复选框的indeterminate属性
 * 用于显示部分选中状态（indeterminate）
 *
 * @param element - HTML复选框元素
 * @param state - 复选框状态：'checked'、'indeterminate'、'unchecked'
 */
function setCheckboxState(
  element: HTMLInputElement | null,
  state: 'checked' | 'indeterminate' | 'unchecked'
) {
  if (!element) return
  element.indeterminate = state === 'indeterminate'
}

/**
 * 绑定行复选框的ref回调函数
 *
 * 在复选框元素挂载时，根据节点的选择状态设置其视觉状态
 * 用于Vue的ref绑定，确保复选框正确显示选中/部分选中状态
 *
 * @param element - 通过ref传递的元素
 * @param row - 对应的行数据
 */
function bindRowCheckbox(element: unknown, row: TreeTableNode) {
  if (element instanceof HTMLInputElement) {
    setCheckboxState(element, getNodeSelectionState(row))
  }
}

/**
 * 处理表头复选框变化事件
 *
 * 当表头复选框状态变化时，切换当前页所有行的选择状态
 *
 * @param event - 复选框change事件
 */
function handleHeaderCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement
  toggleSelectAll(target.checked)
}

/**
 * 处理行复选框变化事件
 *
 * 当行复选框状态变化时，切换该行的选择状态
 *
 * @param row - 对应的行数据
 * @param event - 复选框change事件
 */
function handleRowCheckboxChange(row: TreeTableNode, event: Event) {
  const target = event.target as HTMLInputElement
  toggleSelectRow(row, target.checked)
}

/**
 * 切换树节点的展开/折叠状态
 *
 * 如果节点已展开则折叠，如果已折叠则展开
 * 支持懒加载：如果节点标记为有子节点但实际没有，则调用loadChildren函数加载
 *
 * @param row - 要切换展开状态的节点
 */
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

/**
 * 展开所有可展开的节点
 *
 * 收集所有有子节点的节点的键值，并设置为展开状态
 * 用于工具栏的"展开所有"按钮
 */
function expandAll() {
  expandedKeys.value = new Set(collectExpandableKeys(props.data))
}

/**
 * 折叠所有节点
 *
 * 清空所有展开状态的节点
 * 用于工具栏的"折叠所有"按钮
 */
function collapseAll() {
  expandedKeys.value.clear()
}

/**
 * 处理行点击事件
 *
 * 当点击行时，如果启用了expandOnRowClick且该行有子节点，则切换展开状态
 * 无论如何都会触发rowClick事件，供父组件监听
 *
 * @param row - 被点击的行数据
 */
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

/**
 * 触发分页变化事件
 *
 * 将当前页码和每页行数通过emit触发pageChange事件
 * 供父组件监听分页状态变化
 */
function emitPageChange() {
  emit('pageChange', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
  })
}

/**
 * 跳转到指定页码
 *
 * 确保目标页码在合法范围内（1到总页数之间）
 * 如果页码没有实际变化，则不触发事件
 *
 * @param page - 目标页码
 */
function goToPage(page: number) {
  const nextPage = Math.min(Math.max(1, page), totalPages.value)
  if (nextPage === currentPage.value) return

  currentPage.value = nextPage
  emitPageChange()
}

/**
 * 处理每页行数变化事件
 *
 * 当用户改变每页显示行数时，更新currentPageSize
 * 同时重置到第一页，并触发分页变化事件
 *
 * @param event - 下拉选择框change事件
 */
function handlePageSizeChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const nextPageSize = Number(target.value) || currentPageSize.value

  currentPageSize.value = nextPageSize
  currentPage.value = 1
  emitPageChange()
}
</script>
