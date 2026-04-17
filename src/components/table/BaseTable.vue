<template>
  <!-- 背景容器 - 始终全屏 -->
  <div class="h-screen w-full overflow-hidden p-6">
    <!-- 内容容器 - 可配置宽高 -->
    <div class="mx-auto flex h-full flex-col space-y-6 overflow-hidden" :class="props.width">
      <!-- 头部区域 -->
      <section
        v-if="showHeader"
        class="relative overflow-hidden rounded-3xl px-6 py-4 transition-all duration-300 hover:shadow-lg"
        :class="getGlassCardClass(isDark)"
      >
        <div class="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div class="space-y-4">
            <div>
              <text
                class="h-1 text-4xl font-bold tracking-tight"
                :class="isDark ? 'text-slate-100' : 'text-slate-900'"
              >
                {{ title }}
              </text>
              <p
                v-if="subtitle"
                class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground"
              >
                {{ subtitle }}
              </p>
            </div>
          </div>

          <div v-if="hasActions" class="flex flex-wrap gap-2">
            <slot name="actions">
              <Button
                v-for="(action, index) in actions"
                :key="index"
                variant="outline"
                class="gap-2 transition-all hover:scale-105"
                v-bind="action.props"
                @click="action.onClick"
              >
                {{ action.label }}
              </Button>
            </slot>
          </div>
        </div>
      </section>

      <!-- 表格区域 + 配置面板 -->
      <section class="flex-1 overflow-hidden">
        <div
          class="grid h-full gap-6 transition-all"
          :class="
            configurable && showConfigPanel ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : 'grid-cols-1'
          "
        >
          <!-- 左侧：表格区域 -->
          <div class="flex min-h-0 flex-col space-y-5">
            <div
              class="flex-1 overflow-auto rounded-3xl p-4 transition-all duration-300 hover:shadow-lg"
              :class="getGlassCardClass(isDark)"
            >
              <TreeTable
                :data="tableData"
                :columns="tableColumns"
                :tree-config="resolvedTreeConfig"
                :selection-config="resolvedSelectionConfig"
                :pagination-config="resolvedPaginationConfig"
                :toolbar-config="tableToolbarConfig"
                empty-text="暂无数据"
                @selection-change="handleSelectionChange"
                @row-click="handleRowClick"
                @config-toggle="showConfigPanel = !showConfigPanel"
              >
                <!-- 左侧插槽：搜索栏 -->
                <template #toolbar-left>
                  <slot name="toolbar-left">
                    <div
                      v-if="searchable || (filters && filters.length > 0)"
                      class="flex items-center gap-3"
                    >
                      <div v-if="searchable" class="relative flex-1 max-w-md">
                        <Search
                          class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          v-model="searchKeyword"
                          class="pl-9 transition-all focus-visible:ring-2"
                          :placeholder="searchPlaceholder"
                        />
                      </div>

                      <Button
                        v-if="searchable"
                        size="sm"
                        variant="outline"
                        class="gap-1.5"
                        @click="$emit('search', searchKeyword)"
                      >
                        <Search class="h-4 w-4" />
                        搜索
                      </Button>

                      <select
                        v-if="filters && filters.length > 0"
                        v-model="activeFilter"
                        class="h-10 min-w-45 cursor-pointer rounded-xl border border-input bg-background px-4 text-sm outline-none transition-all hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                        @change="$emit('filter', activeFilter)"
                      >
                        <option value="">全部</option>
                        <option v-for="filter in filters" :key="filter.value" :value="filter.value">
                          {{ filter.label }}
                        </option>
                      </select>
                    </div>
                  </slot>
                </template>

                <!-- 右侧插槽：按钮组 -->
                <template #toolbar-right>
                  <slot name="toolbar-right">
                    <div class="flex flex-wrap items-center gap-2">
                      <Button
                        v-if="configurable"
                        size="sm"
                        variant="outline"
                        class="gap-1.5"
                        @click="showConfigPanel = !showConfigPanel"
                      >
                        <PanelLeftClose class="h-4 w-4" />
                        {{ showConfigPanel ? '隐藏配置' : '显示配置' }}
                      </Button>
                    </div>
                  </slot>
                </template>

                <!-- 透传其他列插槽 -->
                <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
                  <slot :name="name" v-bind="slotData || {}"></slot>
                </template>
              </TreeTable>
            </div>
          </div>

          <!-- 右侧：配置面板 -->
          <aside
            v-if="configurable && showConfigPanel"
            class="sticky top-6 flex min-h-0 flex-col space-y-5 overflow-auto rounded-3xl p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
            :class="getGlassCardClass(isDark)"
          >
            <div>
              <h2 class="flex items-center gap-2 text-lg font-bold">
                <Settings class="h-5 w-5 text-primary" />
                配置面板
              </h2>
              <p class="mt-2 text-sm" :class="isDark ? 'text-slate-400' : 'text-muted-foreground'">
                修改下方开关可实时更新组件配置
              </p>
            </div>

            <div class="space-y-3">
              <div
                class="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]'
                    : 'border border-gray-200/40 bg-white/40 hover:border-primary/20 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.08)]'
                "
              >
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-slate-100' : 'text-foreground'"
                  >
                    启用树形模式
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    关闭后显示为扁平表格
                  </div>
                </div>
                <Switch v-model="localTreeEnabled" />
              </div>

              <div
                class="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]'
                    : 'border border-gray-200/40 bg-white/40 hover:border-primary/20 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.08)]'
                "
              >
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-slate-100' : 'text-foreground'"
                  >
                    默认展开全部
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    页面加载时展开所有节点
                  </div>
                </div>
                <Switch v-model="localDefaultExpandAll" />
              </div>

              <div
                class="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]'
                    : 'border border-gray-200/40 bg-white/40 hover:border-primary/20 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.08)]'
                "
              >
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-slate-100' : 'text-foreground'"
                  >
                    点击行展开
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    点击整行触发展开/收起
                  </div>
                </div>
                <Switch v-model="localExpandOnRowClick" />
              </div>

              <div
                class="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]'
                    : 'border border-gray-200/40 bg-white/40 hover:border-primary/20 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.08)]'
                "
              >
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-slate-100' : 'text-foreground'"
                  >
                    启用多选
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    显示复选框列
                  </div>
                </div>
                <Switch v-model="localSelectionEnabled" />
              </div>

              <div
                class="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]'
                    : 'border border-gray-200/40 bg-white/40 hover:border-primary/20 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.08)]'
                "
              >
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-slate-100' : 'text-foreground'"
                  >
                    严格选择模式
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    父子节点不联动选择
                  </div>
                </div>
                <Switch v-model="localCheckStrictly" />
              </div>

              <div
                class="group flex items-center justify-between rounded-2xl px-4 py-3.5 transition-all duration-300 hover:shadow-md"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.2)]'
                    : 'border border-gray-200/40 bg-white/40 hover:border-primary/20 hover:shadow-[0_0_20px_-5px_rgba(0,0,0,0.08)]'
                "
              >
                <div>
                  <div
                    class="text-sm font-semibold"
                    :class="isDark ? 'text-slate-100' : 'text-foreground'"
                  >
                    启用分页
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    使用内置分页器
                  </div>
                </div>
                <Switch v-model="localPaginationEnabled" />
              </div>

              <div
                class="rounded-2xl px-4 py-4 transition-all duration-300"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10'
                    : 'border border-gray-200/40 bg-white/40'
                "
              >
                <div
                  class="text-sm font-semibold"
                  :class="isDark ? 'text-slate-100' : 'text-foreground'"
                >
                  每页条数
                </div>
                <div
                  class="mt-2 text-xs"
                  :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                >
                  控制每页显示的行数
                </div>
                <select
                  v-model="localPageSize"
                  class="mt-3 h-10 w-full cursor-pointer rounded-lg border bg-background px-4 text-sm outline-none transition-all hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  :class="isDark ? 'border-slate-600 bg-slate-900' : 'border-input'"
                >
                  <option :value="5">5 条/页</option>
                  <option :value="10">10 条/页</option>
                  <option :value="20">20 条/页</option>
                  <option :value="50">50 条/页</option>
                </select>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { PanelLeftClose, Search, Settings } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { TreeTable } from '@/components/ui/tree-table'
import { getGlassCardClass } from '@/lib/glass-theme'
import type {
  TreeTableColumn,
  TreeTableConfig,
  TreeTableNode,
  TreeTablePaginationConfig,
  TreeTableSelectionConfig,
  TreeTableToolbarConfig,
} from '@/components/ui/tree-table/types'

/**
 * BaseTable - 基础表格组件
 *
 * 特性：
 * - 简洁的表格布局
 * - 内置搜索和筛选
 * - 支持 TreeTable 所有功能
 * - 可配置的树形、多选、分页
 */

interface Action {
  label: string
  onClick?: () => void
  props?: Record<string, any>
}

interface Filter {
  label: string
  value: string
}

interface Props {
  /** 页面标题 */
  title?: string
  /** 副标题 */
  subtitle?: string
  /** 表格数据 */
  data?: TreeTableNode[]
  /** 列配置 */
  columns?: TreeTableColumn[]
  /** 是否显示头部 */
  showHeader?: boolean
  /** 是否显示工具栏 */
  showToolbar?: boolean
  /** 快捷操作按钮 */
  actions?: Action[]
  /** 是否启用搜索 */
  searchable?: boolean
  /** 搜索占位符 */
  searchPlaceholder?: string
  /** 筛选项 */
  filters?: Filter[]
  /** 是否启用配置面板 */
  configurable?: boolean
  /** 容器宽度 */
  width?: string
  /** 工具栏配置 */
  toolbarConfig?: TreeTableToolbarConfig
  /** 树形配置 */
  treeConfig?: Partial<TreeTableConfig>
  /** 多选配置 */
  selectionConfig?: Partial<TreeTableSelectionConfig>
  /** 分页配置 */
  paginationConfig?: Partial<TreeTablePaginationConfig>
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  data: () => [],
  columns: () => [],
  showHeader: true,
  showToolbar: true,
  actions: () => [],
  searchable: false,
  searchPlaceholder: '搜索...',
  filters: () => [],
  configurable: false,
  width: 'w-[80%]',
  toolbarConfig: () => ({
    enabled: true,
    showExpandActions: true,
    showSelectionSummary: true,
    showConfigToggle: true,
  }),
  treeConfig: () => ({}),
  selectionConfig: () => ({}),
  paginationConfig: () => ({}),
})

const emit = defineEmits<{
  search: [keyword: string]
  filter: [value: string]
  selectionChange: [rows: any[], keys: Array<string | number>]
  rowClick: [row: any]
  configToggle: []
}>()

// =============================================
// 主题适配
// =============================================
const appStore = useAppStore()
const isDark = computed(() => appStore.isDark)

// =============================================
// 内部状态
// =============================================
const searchKeyword = ref('')
const activeFilter = ref('')
const showConfigPanel = ref(false)

// 树形配置
const localTreeEnabled = ref(props.treeConfig.enabled ?? true)
const localDefaultExpandAll = ref(props.treeConfig.defaultExpandAll ?? true)
const localExpandOnRowClick = ref(props.treeConfig.expandOnRowClick ?? false)

// 多选配置
const localSelectionEnabled = ref(props.selectionConfig.enabled ?? true)
const localCheckStrictly = ref(props.selectionConfig.checkStrictly ?? false)

// 分页配置
const localPaginationEnabled = ref(props.paginationConfig.enabled ?? true)
const localPageSize = ref(props.paginationConfig.pageSize ?? 10)

// =============================================
// 计算属性
// =============================================
const hasActions = computed(() => props.actions && props.actions.length > 0)

const tableData = computed(() => props.data)
const tableColumns = computed(() => props.columns)

const tableToolbarConfig = computed<TreeTableToolbarConfig>(() => ({
  enabled: true,
  showExpandActions: true,
  showSelectionSummary: true,
  ...props.toolbarConfig,
}))

const resolvedTreeConfig = computed<TreeTableConfig>(() => ({
  enabled: localTreeEnabled.value,
  rowKey: 'id',
  childrenKey: 'children',
  indent: 18,
  defaultExpandAll: localDefaultExpandAll.value,
  expandOnRowClick: localExpandOnRowClick.value,
}))

const resolvedSelectionConfig = computed<TreeTableSelectionConfig>(() => ({
  enabled: localSelectionEnabled.value,
  checkStrictly: localCheckStrictly.value,
}))

const resolvedPaginationConfig = computed<TreeTablePaginationConfig>(() => ({
  enabled: localPaginationEnabled.value,
  page: 1,
  pageSize: localPageSize.value,
  pageSizeOptions: [5, 10, 20, 50],
}))

// =============================================
// 事件处理
// =============================================
function handleSelectionChange(rows: TreeTableNode[], keys: Array<string | number>) {
  emit('selectionChange', rows, keys)
}

function handleRowClick(row: TreeTableNode) {
  emit('rowClick', row)
}
</script>
