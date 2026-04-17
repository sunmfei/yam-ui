<template>
  <!-- 主容器 -->
  <div
    class="flex h-screen flex-col space-y-6 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 p-6"
  >
    <!-- =============================================
         页面标题区域
         ============================================= -->
    <section
      class="relative overflow-hidden rounded-3xl border border-border/50 bg-card shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
    >
      <!-- 装饰性背景 -->
      <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <!-- 标签 + 标题描述 -->
        <div class="space-y-4">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary shadow-sm"
          >
            <FolderTree class="h-3.5 w-3.5" />
            TreeTable 演示
          </div>

          <div>
            <h1
              class="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              菜单树形表格
            </h1>
            <p class="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
              展示配置驱动的树形表格功能，包括树形模式、多选、分页等特性。
            </p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex flex-wrap gap-2">
          <Button
            variant="outline"
            class="gap-2 transition-all hover:scale-105"
            @click="handleReset"
          >
            <RefreshCw class="h-4 w-4" />
            重置数据
          </Button>
          <Button
            variant="outline"
            class="gap-2 transition-all hover:scale-105"
            @click="handleExport"
          >
            <Download class="h-4 w-4" />
            导出 JSON
          </Button>
          <Button
            class="gap-2 shadow-md transition-all hover:scale-105 hover:shadow-lg"
            @click="handleAddRoot"
          >
            <Plus class="h-4 w-4" />
            添加根节点
          </Button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="relative mt-8 grid gap-4 lg:grid-cols-4">
        <div
          class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-primary/5 transition-all group-hover:bg-primary/10"
          ></div>
          <div class="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            节点总数
          </div>
          <div class="mt-3 text-3xl font-bold text-primary">{{ totalCount }}</div>
        </div>
        <div
          class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-blue-500/5 transition-all group-hover:bg-blue-500/10"
          ></div>
          <div class="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            过滤后节点
          </div>
          <div class="mt-3 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {{ filteredCount }}
          </div>
        </div>
        <div
          class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-green-500/5 transition-all group-hover:bg-green-500/10"
          ></div>
          <div class="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            已选中
          </div>
          <div class="mt-3 text-3xl font-bold text-green-600 dark:text-green-400">
            {{ selectedKeys.length }}
          </div>
        </div>
        <div
          class="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/30 p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div
            class="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-purple-500/5 transition-all group-hover:bg-purple-500/10"
          ></div>
          <div class="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            模式
          </div>
          <div class="mt-3 text-sm font-semibold text-purple-600 dark:text-purple-400">
            {{ treeEnabled ? '🌳 树形表格' : '📊 扁平表格' }}
          </div>
        </div>
      </div>
    </section>

    <!-- =============================================
         表格区域 + 右侧配置面板
         ============================================= -->
    <section
      class="flex-1 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
    >
      <div
        class="grid h-full gap-6 transition-all"
        :class="configPanelVisible ? 'xl:grid-cols-[minmax(0,1fr)_380px]' : 'grid-cols-1'"
      >
        <!-- 左侧：表格区域 -->
        <div class="flex min-h-0 flex-col space-y-5">
          <!-- 搜索过滤栏 -->
          <div
            class="flex flex-col gap-3 rounded-2xl border border-border/50 bg-muted/20 p-4 lg:flex-row"
          >
            <!-- 关键词搜索 -->
            <div class="relative flex-1">
              <Search
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                v-model="keyword"
                class="pl-9 transition-all focus-visible:ring-2"
                placeholder="🔍 搜索名称、路径或操作键"
              />
            </div>

            <!-- 类型筛选 -->
            <select
              v-model="selectedType"
              class="h-10 min-w-45 cursor-pointer rounded-xl border border-input bg-background px-4 text-sm outline-none transition-all hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              <option value="all">🎯 全部类型</option>
              <option v-for="item in typeOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </option>
            </select>
          </div>

          <!--
            TreeTable 组件使用说明：
            1. treeConfig - 控制树形功能开关
            2. selectionConfig - 控制复选框多选
            3. paginationConfig - 启用内置分页
            4. toolbarConfig - 显示组件工具栏
          -->
          <!-- TreeTable 组件 -->
          <div class="flex-1 overflow-auto rounded-2xl border border-border/50 bg-background">
            <TreeTable
              :data="filteredMenus"
              :columns="columns"
              :tree-config="treeConfig"
              :selection-config="selectionConfig"
              :pagination-config="paginationConfig"
              :toolbar-config="toolbarConfig"
              empty-text="暂无匹配的菜单节点"
              @selection-change="handleSelectionChange"
              @row-click="handleRowClick"
              @config-toggle="configPanelVisible = !configPanelVisible"
            >
              <!-- 自定义节点列（头像 + 名称 + ID） -->
              <template #name="{ row }">
                <div class="flex min-w-0 items-center gap-3 transition-all hover:gap-4">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 text-xs font-bold text-primary shadow-sm transition-all hover:scale-110 hover:shadow-md"
                  >
                    {{ getNodeAvatar(row) }}
                  </div>

                  <div class="min-w-0">
                    <div
                      class="truncate font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {{ row.name }}
                    </div>
                    <div class="truncate text-xs text-muted-foreground">ID: {{ row.id }}</div>
                  </div>
                </div>
              </template>

              <!-- 自定义类型列（Badge 展示） -->
              <template #type="{ row }">
                <Badge
                  :variant="getTypeVariant(row.type)"
                  class="transition-all hover:scale-105 hover:shadow-sm"
                >
                  {{ getTypeLabel(row.type) }}
                </Badge>
              </template>

              <!-- 自定义路径/操作列 -->
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

              <!-- 自定义状态列 -->
              <template #status="{ row }">
                <div class="flex flex-wrap gap-2">
                  <Badge v-if="row.hidden" variant="outline" class="transition-all hover:scale-105">
                    隐藏
                  </Badge>
                  <Badge
                    v-if="row.disabled"
                    variant="warning"
                    class="transition-all hover:scale-105"
                  >
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

              <!-- 自定义操作列 -->
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
            </TreeTable>
          </div>
        </div>

        <!-- =============================================
             右侧配置面板
             通过修改下方的开关来控制 TreeTable 组件的行为
             ============================================= -->
        <aside
          v-if="configPanelVisible"
          class="sticky top-6 flex min-h-0 flex-col space-y-5 overflow-auto rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/20 p-6 shadow-sm backdrop-blur-sm"
        >
          <div>
            <h2 class="flex items-center gap-2 text-lg font-bold">
              <Settings class="h-5 w-5 text-primary" />
              配置面板
            </h2>
            <p class="mt-2 text-sm text-muted-foreground">修改下方开关可实时更新组件配置</p>
          </div>

          <!-- 功能开关列表 -->
          <div class="space-y-3">
            <!-- 树形模式开关 -->
            <div
              class="group flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div class="text-sm font-semibold">🌳 启用树形模式</div>
                <div class="mt-1 text-xs text-muted-foreground">关闭后显示为扁平表格</div>
              </div>
              <Switch v-model="treeEnabled" class="data-[state=checked]:bg-primary" />
            </div>

            <!-- 默认展开全部开关 -->
            <div
              class="group flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div class="text-sm font-semibold">📂 默认展开全部</div>
                <div class="mt-1 text-xs text-muted-foreground">页面加载时展开所有节点</div>
              </div>
              <Switch v-model="defaultExpandAll" class="data-[state=checked]:bg-primary" />
            </div>

            <!-- 点击行展开开关 -->
            <div
              class="group flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div class="text-sm font-semibold">👆 点击行展开</div>
                <div class="mt-1 text-xs text-muted-foreground">点击整行触发展开/收起</div>
              </div>
              <Switch v-model="expandOnRowClick" class="data-[state=checked]:bg-primary" />
            </div>

            <!-- 多选开关 -->
            <div
              class="group flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div class="text-sm font-semibold">☑️ 启用多选</div>
                <div class="mt-1 text-xs text-muted-foreground">显示复选框列</div>
              </div>
              <Switch v-model="selectionEnabled" class="data-[state=checked]:bg-primary" />
            </div>

            <!-- 严格选择开关 -->
            <div
              class="group flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div class="text-sm font-semibold">🔒 严格选择模式</div>
                <div class="mt-1 text-xs text-muted-foreground">父子节点不联动选择</div>
              </div>
              <Switch v-model="checkStrictly" class="data-[state=checked]:bg-primary" />
            </div>

            <!-- 分页开关 -->
            <div
              class="group flex items-center justify-between rounded-xl border border-border/50 bg-background/80 px-4 py-3.5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div>
                <div class="text-sm font-semibold">📄 启用分页</div>
                <div class="mt-1 text-xs text-muted-foreground">使用内置分页器</div>
              </div>
              <Switch v-model="paginationEnabled" class="data-[state=checked]:bg-primary" />
            </div>

            <!-- 页大小选择 -->
            <div class="rounded-xl border border-border/50 bg-background/80 px-4 py-4 shadow-sm">
              <div class="text-sm font-semibold">📏 每页条数</div>
              <div class="mt-2 text-xs text-muted-foreground">控制每页显示的行数</div>
              <select
                v-model="pageSize"
                class="mt-3 h-10 w-full cursor-pointer rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option :value="5">5 条/页</option>
                <option :value="10">10 条/页</option>
                <option :value="20">20 条/页</option>
                <option :value="50">50 条/页</option>
              </select>
            </div>
          </div>

          <!-- 配置预览 -->
          <div
            class="overflow-hidden rounded-xl border border-dashed border-border/50 bg-muted/20 p-4"
          >
            <div class="text-sm font-semibold">⚙️ 配置预览</div>
            <pre
              class="mt-3 max-h-48 overflow-auto rounded-lg bg-background/50 p-3 text-xs leading-relaxed text-muted-foreground"
              >{{ configPreview }}</pre
            >
          </div>

          <!-- 当前激活行 -->
          <div
            v-if="activeRow"
            class="animate-in fade-in slide-in-from-bottom-2 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm"
          >
            <div class="text-sm font-semibold text-primary">✨ 当前激活行</div>
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
/**
 * TreeTable 菜单树形表格 Demo 页面
 *
 * 功能演示：
 * 1. 树形表格基础功能 - 展开/收起节点
 * 2. 多选功能 - 支持级联选择和非级联选择
 * 3. 分页功能 - 内置分页器
 * 4. 搜索过滤 - 关键词和类型筛选
 * 5. 自定义插槽 - 各列支持自定义渲染
 * 6. 工具栏 - 内置工具栏展示选中数量和展开操作
 */
import { computed, ref } from 'vue'
import { Download, FolderTree, Plus, RefreshCw, Search, Settings } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { TreeTable } from '@/components/ui/tree-table'
import type {
  TreeTableColumn,
  TreeTableNode,
  TreeTableConfig,
  TreeTablePaginationConfig,
  TreeTableSelectionConfig,
  TreeTableToolbarConfig,
} from '@/components/ui/tree-table/types'
import type { MenuNode, MenuNodeType } from '@/types/menu'
import { DEFAULT_MENU } from '@/views/home/data/MenuData'
import { ElMessage, ElMessageBox } from '@/utils/message'

// =============================================
// 类型选项配置
// =============================================
const typeOptions: Array<{ value: MenuNodeType; label: string }> = [
  { value: 'route', label: '路由' },
  { value: 'button', label: '按钮' },
  { value: 'dropdown', label: '下拉菜单' },
  { value: 'list', label: '列表' },
  { value: 'list-item', label: '列表项' },
]

// =============================================
// 表格列配置
// =============================================
// 列配置说明：
// - key: 对应数据字段名
// - title: 表头显示文字
// - slot: 关联的插槽名称，用于自定义渲染
// - width: 列宽度
// - align: 文本对齐方式
const columns: TreeTableColumn[] = [
  { key: 'name', title: '节点', slot: 'name', width: '30%' },
  { key: 'type', title: '类型', slot: 'type', width: '12%' },
  { key: 'target', title: '路径/操作', slot: 'target', width: '28%' },
  { key: 'order', title: '排序', width: '10%', align: 'center' },
  { key: 'status', title: '状态', slot: 'status', width: '10%' },
  { key: 'actions', title: '操作', slot: 'actions', width: '20%', align: 'right' },
]

// =============================================
// 响应式状态
// =============================================

/** 菜单数据（响应式引用，便于后续操作） */
const menus = ref<MenuNode[]>(cloneTree(DEFAULT_MENU))

/** 搜索关键词 */
const keyword = ref('')

/** 选中的类型筛选 */
const selectedType = ref<'all' | MenuNodeType>('all')

/** 已选择的行 key 数组 */
const selectedKeys = ref<Array<string | number>>([])

/** 当前激活（点击）的行 ID */
const activeRowId = ref('')

// =============================================
// 功能开关配置（控制 TreeTable 行为）
// =============================================

/** 是否启用树形模式（关闭则显示为扁平表格） */
const treeEnabled = ref(true)

/** 是否默认全部展开 */
const defaultExpandAll = ref(true)

/** 是否点击整行展开/收起 */
const expandOnRowClick = ref(false)

/** 是否启用多选功能 */
const selectionEnabled = ref(true)

/** 是否严格选择（true: 父子不联动，false: 级联选择） */
const checkStrictly = ref(false)

/** 是否启用分页 */
const paginationEnabled = ref(true)

/** 每页显示条数 */
const pageSize = ref(10)

/** 配置面板是否可见 */
const configPanelVisible = ref(true)

// =============================================
// 配置对象（将开关映射为组件配置）
// =============================================

/** 树形配置 - 控制树形表格的核心行为 */
const treeConfig = computed<TreeTableConfig>(() => ({
  enabled: treeEnabled.value, // 是否启用树形模式
  rowKey: 'id', // 行数据的唯一标识字段
  childrenKey: 'children', // 子节点字段名
  indent: 18, // 缩进像素值
  defaultExpandAll: defaultExpandAll.value, // 是否默认全部展开
  expandOnRowClick: expandOnRowClick.value, // 点击行是否展开
}))

/** 多选配置 - 控制复选框行为 */
const selectionConfig = computed<TreeTableSelectionConfig>(() => ({
  enabled: selectionEnabled.value, // 是否显示复选框
  checkStrictly: checkStrictly.value, // true: 独立选择，false: 级联选择
}))

/** 分页配置 - 控制分页器行为 */
const paginationConfig = computed<TreeTablePaginationConfig>(() => ({
  enabled: paginationEnabled.value, // 是否启用分页
  page: 1, // 当前页码
  pageSize: pageSize.value, // 每页条数
  pageSizeOptions: [5, 10, 20, 50], // 可选的页大小列表
}))

/** 工具栏配置 - 控制顶部工具栏的显示 */
const toolbarConfig = computed<TreeTableToolbarConfig>(() => ({
  enabled: true, // 是否显示工具栏
  title: '菜单树形表格演示', // 工具栏标题
  description: '内置工具栏、展开操作、选中统计和分页功能', // 工具栏描述
  showExpandActions: true, // 是否显示展开/折叠按钮
  showSelectionSummary: true, // 是否显示选中统计
  showConfigToggle: true, // 是否显示配置面板切换按钮
}))

// =============================================
// 计算属性
// =============================================

/** 过滤后的菜单数据（搜索 + 类型筛选） */
const filteredMenus = computed(() => filterMenus(menus.value, keyword.value, selectedType.value))

/** 菜单节点总数 */
const totalCount = computed(() => countNodes(menus.value))

/** 过滤后节点数 */
const filteredCount = computed(() => countNodes(filteredMenus.value))

/** 当前激活的行数据 */
const activeRow = computed(() => findNodeById(menus.value, activeRowId.value))

/** 配置预览 JSON（用于右侧面板展示） */
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

// =============================================
// 工具函数
// =============================================

/**
 * 深拷贝树形数据（避免直接修改原数据）
 * @param data - 原始数据
 * @returns 拷贝后的数据
 */
function cloneTree(data: MenuNode[]): MenuNode[] {
  return JSON.parse(JSON.stringify(data)) as MenuNode[]
}

/**
 * 递归过滤菜单节点
 * - 保留匹配关键词或类型的节点
 * - 同时保留有匹配子节点的父节点
 *
 * @param nodes - 节点数组
 * @param keywordValue - 搜索关键词
 * @param typeValue - 类型筛选值
 * @returns 过滤后的节点数组
 */
function filterMenus(nodes: MenuNode[], keywordValue: string, typeValue: string): MenuNode[] {
  const normalizedKeyword = keywordValue.trim().toLowerCase()

  return nodes.reduce<MenuNode[]>((result, node) => {
    // 递归过滤子节点
    const children = node.children ? filterMenus(node.children, keywordValue, typeValue) : []

    // 检查关键词匹配（名称、ID、路径、动作键）
    const matchesKeyword =
      !normalizedKeyword ||
      node.name.toLowerCase().includes(normalizedKeyword) ||
      node.id.toLowerCase().includes(normalizedKeyword) ||
      node.path?.toLowerCase().includes(normalizedKeyword) ||
      node.actionKey?.toLowerCase().includes(normalizedKeyword)

    // 检查类型匹配
    const matchesType = typeValue === 'all' || node.type === typeValue

    // 条件：自身匹配 或 有匹配的子节点
    if ((matchesKeyword && matchesType) || children.length > 0) {
      result.push({
        ...node,
        children,
      })
    }

    return result
  }, [])
}

/**
 * 递归统计节点总数
 * @param nodes - 节点数组
 * @returns 节点总数（含子节点）
 */
function countNodes(nodes: MenuNode[]): number {
  return nodes.reduce((count, node) => count + 1 + countNodes(node.children ?? []), 0)
}

/**
 * 根据 ID 查找节点（递归）
 * @param nodes - 节点数组
 * @param id - 目标 ID
 * @returns 找到的节点或 null
 */
function findNodeById(nodes: MenuNode[], id: string): MenuNode | null {
  for (const node of nodes) {
    if (node.id === id) return node

    const child = findNodeById(node.children ?? [], id)
    if (child) return child
  }

  return null
}

/**
 * 获取类型显示标签
 * @param type - 类型值（unknown 类型）
 * @returns 中文标签
 */
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

/**
 * 获取类型的 Badge 样式变体
 * @param type - 类型值（unknown 类型）
 * @returns Badge 变体类型
 */
function getTypeVariant(type: unknown) {
  const variantMap: Record<string, 'default' | 'secondary' | 'outline' | 'success'> = {
    route: 'default', // 路由 - 默认样式
    button: 'secondary', // 按钮 - 次要样式
    dropdown: 'outline', // 下拉 - 边框样式
    list: 'success', // 列表 - 成功样式
    'list-item': 'secondary', // 列表项 - 次要样式
  }

  return variantMap[String(type)] ?? 'secondary'
}

/**
 * 获取节点首字母（用于头像显示）
 * @param row - 行数据
 * @returns 首字母大写
 */
function getNodeAvatar(row: TreeTableNode) {
  const name = typeof row.name === 'string' ? row.name : '?'
  return name.slice(0, 1).toUpperCase()
}

// =============================================
// 事件处理函数
// =============================================

/**
 * 选择变化回调
 * @param _rows - 选中的行数据数组
 * @param keys - 选中的 key 数组
 */
function handleSelectionChange(_rows: TreeTableNode[], keys: Array<string | number>) {
  selectedKeys.value = keys
}

/**
 * 行点击回调
 * @param row - 点击的行数据
 */
function handleRowClick(row: TreeTableNode) {
  activeRowId.value = String(row.id ?? '')
}

/**
 * 重置数据到默认状态
 */
function handleReset() {
  menus.value = cloneTree(DEFAULT_MENU)
  selectedKeys.value = []
  activeRowId.value = ''
  ElMessage.success('菜单数据已重置')
}

/**
 * 添加根节点
 */
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

/**
 * 添加子节点
 * @param row - 当前行数据
 */
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

  if (!sourceNode.children) {
    sourceNode.children = []
  }

  sourceNode.children.push(child)
  ElMessage.success(`子节点已添加到 ${sourceNode.name}`)
}

/**
 * 编辑节点（预留接口）
 * @param row - 当前行数据
 */
function handleEdit(row: TreeTableNode) {
  const sourceNode = findNodeById(menus.value, String(row.id ?? ''))
  if (!sourceNode) return

  ElMessage.info(`可在此处打开编辑对话框：${sourceNode.name}`)
}

/**
 * 删除节点（支持递归删除子节点）
 * @param row - 当前行数据
 */
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

  // 收集待删除的 ID 列表（含子节点）
  const removedIds = collectIds(sourceNode)
  menus.value = removeNode(menus.value, String(sourceNode.id))

  // 清理已选中列表中的待删除 ID
  selectedKeys.value = selectedKeys.value.filter((key) => !removedIds.includes(key))

  // 清理激活行（如果被删除则清空）
  if (activeRowId.value && removedIds.includes(activeRowId.value)) {
    activeRowId.value = ''
  }

  ElMessage.success('节点已删除')
}

/**
 * 递归收集节点及子节点的 ID
 * @param node - 节点
 * @returns ID 数组
 */
function collectIds(node: MenuNode | null): Array<string | number> {
  if (!node) return []
  return [node.id, ...(node.children ?? []).flatMap((child) => collectIds(child))]
}

/**
 * 递归删除指定节点
 * @param nodes - 节点数组
 * @param targetId - 目标 ID
 * @returns 删除后的节点数组
 */
function removeNode(nodes: MenuNode[], targetId: string): MenuNode[] {
  return nodes
    .filter((node) => node.id !== targetId)
    .map((node) => ({
      ...node,
      children: node.children ? removeNode(node.children, targetId) : undefined,
    }))
}

/**
 * 导出数据为 JSON 文件
 */
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
  ElMessage.success('导出完成')
}
</script>
