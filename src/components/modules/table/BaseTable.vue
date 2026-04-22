<template>
  <!-- 背景容器 - 始终全屏固定 -->
  <div class="h-full min-h-0 w-full overflow-hidden p-6">
    <!-- 响应式内容容�?-->
    <BaseContainer
      size="custom"
      :custom-width="resolvedContainerWidth"
      :custom-height="resolvedContainerHeight"
      :fullscreen="isFullscreen"
      class="h-full min-h-0 space-y-16 overflow-hidden"
    >
      <!-- 头部区域 -->
      <section
        v-if="showHeader"
        class="relative mb-6 overflow-hidden rounded-3xl px-6 py-4 transition-all duration-300 hover:shadow-lg"
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
              <BaseButton
                v-for="(action, index) in actions"
                :key="index"
                variant="outline"
                class="gap-2 transition-all hover:scale-105"
                v-bind="action.props"
                @click="action.onClick"
              >
                {{ action.label }}
              </BaseButton>
            </slot>
          </div>
        </div>
      </section>

      <!-- 表格区域 + 配置面板 -->
      <section class="min-h-0 flex-1 overflow-hidden">
        <div
          class="grid h-full gap-6 transition-all"
          :class="
            configurable && showConfigPanel ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : 'grid-cols-1'
          "
        >
          <!-- 左侧：表格区�?-->
          <div class="flex min-h-0 flex-col space-y-5">
            <div
              class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl p-4 transition-all duration-300 hover:shadow-lg"
              :class="getGlassCardClass(isDark)"
            >
              <BaseTreeTable
                class="min-h-0 flex-1"
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
                        <BaseInput
                          v-model="searchKeyword"
                          class="pl-9 transition-all focus-visible:ring-2"
                          :placeholder="searchPlaceholder"
                        />
                      </div>

                      <BaseButton
                        v-if="searchable"
                        size="sm"
                        variant="outline"
                        class="gap-1.5"
                        @click="$emit('search', searchKeyword)"
                      >
                        <Search class="h-4 w-4" />
                        搜索
                      </BaseButton>

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
                      <BaseButton
                        v-if="configurable"
                        size="sm"
                        variant="outline"
                        class="gap-1.5"
                        @click="showConfigPanel = !showConfigPanel"
                      >
                        <BaseIcon :name="ICON_POOL.LayoutPanelLeft" />
                        {{ showConfigPanel ? '隐藏配置' : '显示配置' }}
                      </BaseButton>
                    </div>
                  </slot>
                </template>

                <!-- 透传其他列插�?-->
                <template v-for="(_, name) in $slots" :key="name" #[name]="slotData">
                  <slot :name="name" v-bind="slotData || {}"></slot>
                </template>
              </BaseTreeTable>
            </div>
          </div>

          <!-- 右侧：配置面�?-->
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
                <BaseSwitch v-model="localTreeEnabled" />
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
                    页面加载时展开所有节�?
                  </div>
                </div>
                <BaseSwitch v-model="localDefaultExpandAll" />
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
                <BaseSwitch v-model="localExpandOnRowClick" />
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
                    启用多�?
                  </div>
                  <div
                    class="mt-1 text-xs"
                    :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                  >
                    显示复选框�?
                  </div>
                </div>
                <BaseSwitch v-model="localSelectionEnabled" />
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
                <BaseSwitch v-model="localCheckStrictly" />
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
                    使用内置分页�?
                  </div>
                </div>
                <BaseSwitch v-model="localPaginationEnabled" />
              </div>

              <!-- 容器尺寸配置 -->
              <div
                class="rounded-2xl px-4 py-4 transition-all duration-300"
                :class="
                  isDark
                    ? 'border border-slate-700/20 bg-slate-800/10'
                    : 'border border-gray-200/40 bg-white/40'
                "
              >
                <div
                  class="mb-3 text-sm font-semibold"
                  :class="isDark ? 'text-slate-100' : 'text-foreground'"
                >
                  容器尺寸
                </div>
                <div
                  class="mb-3 text-xs"
                  :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                >
                  选择预设尺寸或自定义宽高
                </div>

                <!-- 预设尺寸按钮�?-->
                <div class="mb-4 grid grid-cols-2 gap-2">
                  <BaseButton
                    variant="outline"
                    size="sm"
                    :class="[
                      localContainerSize === 'small' ? 'border-primary bg-primary/10' : '',
                      'transition-all',
                    ]"
                    @click="setContainerSize('small')"
                  >
                    <Minimize2 class="mr-2 h-4 w-4" />
                    �?(70%)
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    :class="[
                      localContainerSize === 'medium' ? 'border-primary bg-primary/10' : '',
                      'transition-all',
                    ]"
                    @click="setContainerSize('medium')"
                  >
                    �?(85%)
                  </BaseButton>
                  <BaseButton
                    variant="outline"
                    size="sm"
                    :class="[
                      localContainerSize === 'large' ? 'border-primary bg-primary/10' : '',
                      'transition-all',
                    ]"
                    @click="setContainerSize('large')"
                  >
                    <Maximize2 class="mr-2 h-4 w-4" />
                    �?(100%)
                  </BaseButton>
                </div>

                <!-- 自定义尺寸滑�?-->
                <div v-if="localContainerSize === 'custom'" class="space-y-4">
                  <!-- 宽度滑块 -->
                  <div>
                    <div class="mb-2 flex items-center justify-between">
                      <label
                        class="text-xs font-medium"
                        :class="isDark ? 'text-slate-300' : 'text-foreground'"
                      >
                        宽度
                      </label>
                      <span
                        class="text-xs font-mono"
                        :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                      >
                        {{ widthPercentage }}%
                      </span>
                    </div>
                    <input
                      v-model="widthPercentage"
                      type="range"
                      min="50"
                      max="100"
                      step="1"
                      class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted transition-all hover:bg-muted/80 accent-primary"
                      @input="updateWidthFromSlider"
                    />
                    <div class="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <!-- 高度滑块 -->
                  <div>
                    <div class="mb-2 flex items-center justify-between">
                      <label
                        class="text-xs font-medium"
                        :class="isDark ? 'text-slate-300' : 'text-foreground'"
                      >
                        高度
                      </label>
                      <span
                        class="text-xs font-mono"
                        :class="isDark ? 'text-slate-400' : 'text-muted-foreground'"
                      >
                        {{ heightPercentage }}vh
                      </span>
                    </div>
                    <input
                      v-model="heightPercentage"
                      type="range"
                      min="50"
                      max="100"
                      step="1"
                      class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted transition-all hover:bg-muted/80 accent-primary"
                      @input="updateHeightFromSlider"
                    />
                    <div class="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>50vh</span>
                      <span>100vh</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 每页条数配置 -->
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
                  控制每页显示的行�?
                </div>
                <select
                  v-model="localPageSize"
                  class="mt-3 h-10 w-full cursor-pointer rounded-lg border bg-background px-4 text-sm outline-none transition-all hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  :class="isDark ? 'border-slate-600 bg-slate-900' : 'border-input'"
                >
                  <option :value="5">5 �?�?/option>
                  <option :value="10">10 �?�?/option>
                  <option :value="20">20 �?�?/option>
                  <option :value="50">50 �?�?/option>
                </select>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </BaseContainer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Maximize2, Minimize2, Search, Settings } from 'lucide-vue-next'
import { useAppStore } from '@/stores/app.ts'
import BaseButton from '../../base/button/BaseButton.vue'
import BaseInput from '../../base/input/BaseInput.vue'
import BaseSwitch from '../../base/switch/BaseSwitch.vue'
import { BaseTreeTable, BaseIcon } from '@/components/base/ui-proxy.ts'
import BaseContainer from '../../base/container/BaseContainer.vue'
import type { ContainerSize } from '../../base/container/BaseContainer.vue'
import { getGlassCardClass } from '@/lib/glass-theme.ts'
import type {
  TreeTableColumn,
  TreeTableConfig,
  TreeTableNode,
  TreeTablePaginationConfig,
  TreeTableSelectionConfig,
  TreeTableToolbarConfig,
} from '@/components/ui/tree-table/types.ts'
import { ICON_POOL } from '@/config/types/icon.pool.ts'

/**
 * BaseTable - 基础表格组件
 *
 * 特性：
 * - 简洁的表格布局
 * - 内置搜索和筛�?
 * - 支持 TreeTable 所有功�?
 * - 可配置的树形、多选、分�?
 */
defineOptions({
  name: 'BaseTable',
})

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
  /** 副标�?*/
  subtitle?: string
  /** 表格数据 */
  data?: TreeTableNode[]
  /** 列配�?*/
  columns?: TreeTableColumn[]
  /** 是否显示头部 */
  showHeader?: boolean
  /** 是否显示工具�?*/
  showToolbar?: boolean
  /** 快捷操作按钮 */
  actions?: Action[]
  /** 是否启用搜索 */
  searchable?: boolean
  /** 搜索占位�?*/
  searchPlaceholder?: string
  /** 筛选项 */
  filters?: Filter[]
  /** 是否启用配置面板 */
  configurable?: boolean
  /** 容器宽度（已废弃，使�?containerSize�?*/
  width?: string
  /** 容器预设尺寸 */
  containerSize?: ContainerSize
  /** 自定义宽�?*/
  customWidth?: string
  /** 自定义高�?*/
  customHeight?: string
  /** 是否全屏 */
  fullscreen?: boolean
  /** 工具栏配�?*/
  toolbarConfig?: TreeTableToolbarConfig
  /** 树形配置 */
  treeConfig?: Partial<TreeTableConfig>
  /** 多选配�?*/
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
  containerSize: 'medium',
  customWidth: '85%',
  customHeight: 'auto',
  fullscreen: false,
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
// 内部状�?
// =============================================
const searchKeyword = ref('')
const activeFilter = ref('')
const showConfigPanel = ref(false)

// 容器尺寸配置
const localContainerSize = ref<ContainerSize>(props.containerSize)
const localCustomWidth = ref(props.customWidth ?? '85%')
const localCustomHeight = ref(
  props.customHeight && props.customHeight !== 'auto' ? props.customHeight : '90vh'
)
const isFullscreen = ref(props.fullscreen)

// 树形配置
const localTreeEnabled = ref(props.treeConfig.enabled ?? true)
const localDefaultExpandAll = ref(props.treeConfig.defaultExpandAll ?? false)
const localExpandOnRowClick = ref(props.treeConfig.expandOnRowClick ?? false)

// 多选配�?
const localSelectionEnabled = ref(props.selectionConfig.enabled ?? true)
const localCheckStrictly = ref(props.selectionConfig.checkStrictly ?? false)

// 分页配置
const localPaginationEnabled = ref(props.paginationConfig.enabled ?? true)
const localPageSize = ref(props.paginationConfig.pageSize ?? 10)

// =============================================
// 计算属�?
// =============================================
const hasActions = computed(() => props.actions && props.actions.length > 0)

const tableData = computed(() => props.data)
const tableColumns = computed(() => props.columns)
const presetContainerWidthMap: Record<'small' | 'medium' | 'large', string> = {
  small: '70%',
  medium: '85%',
  large: '100%',
}

const resolvedContainerWidth = computed(() => {
  if (localContainerSize.value === 'custom') {
    return localCustomWidth.value || '85%'
  }

  return presetContainerWidthMap[localContainerSize.value]
})

const resolvedContainerHeight = computed(() => {
  if (localContainerSize.value === 'custom') {
    return localCustomHeight.value || '90vh'
  }

  if (props.customHeight && props.customHeight !== 'auto') {
    return props.customHeight
  }

  return '100%'
})

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
// 容器尺寸控制 - 滑块相关
// =============================================

// 解析宽度百分�?
const widthPercentage = computed({
  get: () => {
    const match = localCustomWidth.value?.match(/(\d+)%/)
    if (match && match[1]) {
      return parseInt(match[1])
    }
    return 85
  },
  set: (value: number) => {
    localCustomWidth.value = `${value}%`
  },
})

// 解析高度百分�?
const heightPercentage = computed({
  get: () => {
    const match = localCustomHeight.value?.match(/(\d+)vh/)
    if (match && match[1]) {
      return parseInt(match[1])
    }
    return 90
  },
  set: (value: number) => {
    localCustomHeight.value = `${value}vh`
  },
})

// 更新宽度
function updateWidthFromSlider() {
  // 计算属性会自动更新
}

// 更新高度
function updateHeightFromSlider() {
  // 计算属性会自动更新
}

// =============================================
// 容器尺寸控制方法
// =============================================
function setContainerSize(size: ContainerSize) {
  localContainerSize.value = size
  isFullscreen.value = false
}

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
