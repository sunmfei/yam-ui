# TreeTable 组件使用指南

## 简介

TreeTable 是一个功能强大的树形表格组件，支持以下特性：

- ✅ 树形结构展示（展开/折叠）
- ✅ 行选择（单选/多选/级联选择）
- ✅ 分页功能
- ✅ 懒加载子节点
- ✅ 自定义单元格渲染
- ✅ 可配置的工具栏
- ✅ 响应式设计

## 快速开始

### 1. 基本用法

```vue
<template>
  <TreeTable :data="treeData" :columns="columns" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TreeTable from '@/components/ui/tree-table/index.vue'
import type { TreeTableNode } from '@/components/ui/tree-table/data'

const columns = [
  { key: 'name', title: '名称', width: '300px' },
  { key: 'type', title: '类型' },
  { key: 'size', title: '大小' },
]

const treeData: TreeTableNode[] = [
  {
    id: '1',
    name: '文件夹 A',
    type: '文件夹',
    size: '-',
    children: [
      { id: '1-1', name: '文件 1.txt', type: '文件', size: '2.3 KB' },
      { id: '1-2', name: '文件 2.txt', type: '文件', size: '1.8 KB' },
    ],
  },
  {
    id: '2',
    name: '文件 B.txt',
    type: '文件',
    size: '5.6 KB',
  },
]
</script>
```

### 2. 启用行选择

```vue
<TreeTable
  :data="treeData"
  :columns="columns"
  :selection-config="{ enabled: true, checkStrictly: false }"
  @selection-change="handleSelectionChange"
/>

<script setup lang="ts">
function handleSelectionChange(rows, keys) {
  console.log('选中的行:', rows)
  console.log('选中的键:', keys)
}
</script>
```

**选择模式说明：**
- `checkStrictly: false` - 级联选择（选中父节点会自动选中所有子节点）
- `checkStrictly: true` - 严格模式（父子节点选择互不影响）

### 3. 启用分页

```vue
<TreeTable
  :data="treeData"
  :columns="columns"
  :pagination-config="{
    enabled: true,
    page: 1,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
  }"
  @page-change="handlePageChange"
/>

<script setup lang="ts">
function handlePageChange({ page, pageSize }) {
  console.log('当前页:', page, '每页条数:', pageSize)
}
</script>
```

### 4. 懒加载子节点

```vue
<TreeTable
  :data="treeData"
  :columns="columns"
  :load-children="loadChildren"
/>

<script setup lang="ts">
async function loadChildren(node) {
  // 模拟异步请求
  const response = await fetch(`/api/children/${node.id}`)
  return await response.json()
}
</script>
```

**注意：** 需要在数据中标记 `hasChildren: true` 来提示该节点有子节点但未加载。

### 5. 自定义单元格渲染

```vue
<TreeTable :data="treeData" :columns="columns">
  <!-- 自定义状态列 -->
  <template #cell-status="{ value }">
    <Badge :variant="value === 'active' ? 'default' : 'secondary'">
      {{ value === 'active' ? '活跃' : '禁用' }}
    </Badge>
  </template>

  <!-- 自定义操作列 -->
  <template #cell-actions="{ row }">
    <Button @click.stop="handleEdit(row)">编辑</Button>
    <Button @click.stop="handleDelete(row)">删除</Button>
  </template>
</TreeTable>

<script setup lang="ts">
const columns = [
  { key: 'name', title: '名称' },
  { key: 'status', title: '状态', slot: 'cell-status' },
  { key: 'actions', title: '操作', slot: 'cell-actions' },
]
</script>
```

**插槽参数：**
- `row` - 当前行数据
- `column` - 列配置
- `value` - 单元格值
- `level` - 嵌套层级
- `expanded` - 是否展开
- `selected` - 是否选中

### 6. 完整配置示例

```vue
<TreeTable
  :data="treeData"
  :columns="columns"
  :tree-config="{
    enabled: true,
    rowKey: 'id',
    childrenKey: 'children',
    indent: 24,
    expandOnRowClick: true,
    defaultExpandAll: false,
    defaultExpandedKeys: ['1', '2'],
  }"
  :selection-config="{
    enabled: true,
    checkStrictly: false,
    defaultSelectedKeys: ['1-1'],
  }"
  :toolbar-config="{
    enabled: true,
    title: '部门管理',
    description: '管理和查看组织架构信息',
    showExpandActions: true,
    showSelectionSummary: true,
  }"
  :pagination-config="{
    enabled: true,
    page: 1,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
  }"
  :load-children="loadChildren"
  @toggle="handleToggle"
  @row-click="handleRowClick"
  @selection-change="handleSelectionChange"
  @page-change="handlePageChange"
/>
```

## Props 详细说明

### data
- **类型:** `TreeTableNode[]`
- **必需:** 是
- **说明:** 树形数据数组

### columns
- **类型:** `TreeTableColumn[]`
- **必需:** 是
- **说明:** 列配置数组

**列配置属性：**
```typescript
interface TreeTableColumn {
  key: string              // 列的唯一标识（对应数据字段名）
  title: string            // 列标题
  width?: string           // 列宽度（如 '100px', '20%'）
  align?: 'left' | 'center' | 'right'  // 对齐方式
  slot?: string            // 自定义插槽名称
  headerClass?: string     // 表头 CSS 类
  cellClass?: string       // 单元格 CSS 类
}
```

### treeConfig
- **类型:** `TreeTableConfig`
- **默认:** `{ enabled: true }`

**配置项：**
```typescript
interface TreeTableConfig {
  enabled?: boolean                    // 是否启用树形功能
  rowKey?: string                      // 唯一键字段名（默认 'id'）
  childrenKey?: string                 // 子节点字段名（默认 'children'）
  indent?: number                      // 每级缩进像素（默认 18）
  expandOnRowClick?: boolean           // 点击行展开/折叠（默认 false）
  defaultExpandAll?: boolean           // 默认展开所有（默认 false）
  defaultExpandedKeys?: (string|number)[]  // 默认展开的键值
}
```

### selectionConfig
- **类型:** `TreeTableSelectionConfig`
- **默认:** `{ enabled: false }`

**配置项：**
```typescript
interface TreeTableSelectionConfig {
  enabled?: boolean                    // 是否启用行选择
  checkStrictly?: boolean              // 严格模式（默认 false）
  defaultSelectedKeys?: (string|number)[]  // 默认选中的键值
}
```

### toolbarConfig
- **类型:** `TreeTableToolbarConfig`
- **默认:** `{ enabled: true }`

**配置项：**
```typescript
interface TreeTableToolbarConfig {
  enabled?: boolean          // 是否启用工具栏
  title?: string             // 工具栏标题
  description?: string       // 工具栏描述
  showExpandActions?: boolean    // 显示展开/折叠按钮
  showSelectionSummary?: boolean // 显示选择摘要
}
```

### paginationConfig
- **类型:** `TreeTablePaginationConfig`
- **默认:** `{ enabled: false }`

**配置项：**
```typescript
interface TreeTablePaginationConfig {
  enabled?: boolean          // 是否启用分页
  page?: number              // 当前页码（从 1 开始）
  pageSize?: number          // 每页条数
  pageSizeOptions?: number[] // 可选的每页条数
}
```

### loadChildren
- **类型:** `(node: TreeTableNode) => Promise<TreeTableNode[]>`
- **说明:** 懒加载函数，用于动态加载子节点

## Events 详细说明

### toggle
- **触发时机:** 节点展开/折叠时
- **参数:** `{ row: TreeTableNode, expanded: boolean }`

### rowClick
- **触发时机:** 行被点击时
- **参数:** `row: TreeTableNode`

### selectionChange
- **触发时机:** 选择状态变化时
- **参数:** `(rows: TreeTableNode[], keys: Array<string | number>)`

### pageChange
- **触发时机:** 分页变化时
- **参数:** `{ page: number, pageSize: number }`

## 数据格式

### TreeTableNode
```typescript
interface TreeTableNode {
  [key: string]: unknown     // 任意自定义字段
  id: string | number        // 唯一标识（或使用 rowKey 指定的字段）
  children?: TreeTableNode[] // 子节点数组
  hasChildren?: boolean      // 是否有子节点（用于懒加载）
  disabled?: boolean         // 是否禁用
}
```

**示例数据：**
```typescript
const data: TreeTableNode[] = [
  {
    id: '1',
    name: '根节点',
    type: 'folder',
    hasChildren: true,  // 标记为有子节点，但未加载
  },
  {
    id: '2',
    name: '叶子节点',
    type: 'file',
    size: '1.2 KB',
  },
]
```

## 常见场景

### 场景 1: 文件浏览器
```vue
<TreeTable
  :data="files"
  :columns="[
    { key: 'name', title: '文件名', width: '300px' },
    { key: 'type', title: '类型' },
    { key: 'size', title: '大小' },
    { key: 'modified', title: '修改时间' },
  ]"
  :tree-config="{ expandOnRowClick: true }"
/>
```

### 场景 2: 组织架构
```vue
<TreeTable
  :data="departments"
  :columns="[
    { key: 'name', title: '部门名称' },
    { key: 'manager', title: '负责人' },
    { key: 'memberCount', title: '人数', align: 'center' },
  ]"
  :selection-config="{ enabled: true }"
  :toolbar-config="{ title: '组织架构' }"
/>
```

### 场景 3: 分类管理
```vue
<TreeTable
  :data="categories"
  :columns="[
    { key: 'name', title: '分类名称' },
    { key: 'itemCount', title: '商品数' },
    { key: 'status', title: '状态', slot: 'cell-status' },
    { key: 'actions', title: '操作', slot: 'cell-actions' },
  ]"
  :load-children="loadSubCategories"
/>
```

## 查看完整示例

运行项目后访问 `/tree-table-demo` 路径查看完整的交互式示例，包含：
- 基本树形表格
- 带行选择的树形表格
- 带分页的树形表格
- 懒加载子节点
- 自定义单元格渲染
- 完整配置示例

## 注意事项

1. **唯一键值：** 确保每个节点都有唯一的 `id`（或 `rowKey` 指定的字段）
2. **懒加载：** 使用懒加载时，需要设置 `hasChildren: true` 标记
3. **分页：** 分页是对扁平化后的可见行进行分页，不是对原始树形数据分页
4. **事件冒泡：** 在自定义单元格中使用按钮时，记得添加 `.stop` 修饰符防止触发行点击
5. **性能：** 对于大数据量，建议使用懒加载和分页来提升性能

## 技术支持

如有问题或建议，请查看组件源码或联系开发团队。
