<template>
  <div class="container mx-auto p-6 space-y-8">
    <!-- 页面标题 -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-foreground">TreeTable 使用示例</h1>
      <p class="text-muted-foreground">展示树形表格组件的各种功能和配置</p>
    </div>

    <!-- 示例 1: 基本树形表格 -->
    <Card>
      <CardHeader>
        <CardTitle>基本树形表格</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable :data="basicData" :columns="basicColumns" />
      </CardContent>
    </Card>

    <!-- 示例 2: 带行选择的树形表格 -->
    <Card>
      <CardHeader>
        <CardTitle>带行选择功能</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable
          :data="selectionData"
          :columns="selectionColumns"
          :selection-config="{ enabled: true, checkStrictly: false }"
          @selection-change="handleSelectionChange"
        />
        <div v-if="selectedRows.length > 0" class="mt-4 p-3 rounded-lg bg-muted">
          <p class="text-sm font-medium">已选择 {{ selectedRows.length }} 行：</p>
          <ul class="mt-2 text-sm text-muted-foreground">
            <li v-for="row in selectedRows" :key="String(row.id)">
              - {{ row.name }} (ID: {{ row.id }})
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>

    <!-- 示例 3: 带分页的树形表格 -->
    <Card>
      <CardHeader>
        <CardTitle>带分页功能</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable
          :data="paginationData"
          :columns="paginationColumns"
          :pagination-config="{
            enabled: true,
            page: 1,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
          }"
          @page-change="handlePageChange"
        />
      </CardContent>
    </Card>

    <!-- 示例 4: 懒加载树形表格 -->
    <Card>
      <CardHeader>
        <CardTitle>懒加载子节点</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable :data="lazyLoadData" :columns="lazyLoadColumns" :load-children="loadChildren" />
      </CardContent>
    </Card>

    <!-- 示例 5: 自定义单元格内容 -->
    <Card>
      <CardHeader>
        <CardTitle>自定义单元格渲染</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable :data="customData" :columns="customColumns">
          <!-- 自定义状态列 -->
          <template #cell-status="{ value }">
            <Badge :variant="value === 'active' ? 'default' : 'secondary'">
              {{ value === 'active' ? '活跃' : '禁用' }}
            </Badge>
          </template>

          <!-- 自定义操作列 -->
          <template #cell-actions="{ row }">
            <div class="flex gap-2">
              <BaseButton size="sm" variant="outline" @click.stop="handleEdit(row)">
                编辑
              </BaseButton>
              <BaseButton size="sm" variant="destructive" @click.stop="handleDelete(row)">
                删除
              </BaseButton>
            </div>
          </template>
        </TreeTable>
      </CardContent>
    </Card>

    <!-- 示例 6: 完整配置的树形表格 -->
    <Card>
      <CardHeader>
        <CardTitle>完整配置示例</CardTitle>
      </CardHeader>
      <CardContent>
        <TreeTable
          :data="fullConfigData"
          :columns="fullConfigColumns"
          :tree-config="{
            enabled: true,
            defaultExpandAll: false,
            expandOnRowClick: true,
            indent: 24,
          }"
          :selection-config="{
            enabled: true,
            checkStrictly: false,
            defaultSelectedKeys: ['1', '3'],
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
          }"
          @toggle="handleToggle"
          @row-click="handleRowClick"
          @selection-change="handleFullSelectionChange"
        />
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner'
import TreeTable from '@/components/ui/tree-table/index.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import BaseButton from '@/components/base/button/BaseButton.vue'
import { Badge } from '@/components/ui/badge'
import type { TreeTableNode, TreeTableColumn } from '@/components/ui/tree-table/types.ts'

// ==================== 示例 1: 基本树形表格 ====================
const basicColumns: TreeTableColumn[] = [
  { key: 'name', title: '名称', width: '300px' },
  { key: 'type', title: '类型' },
  { key: 'size', title: '大小' },
]

const basicData: TreeTableNode[] = [
  {
    id: '1',
    name: 'src',
    type: '文件夹',
    size: '-',
    children: [
      {
        id: '1-1',
        name: 'components',
        type: '文件夹',
        size: '-',
        children: [
          { id: '1-1-1', name: 'Button.vue', type: '文件', size: '2.3 KB' },
          { id: '1-1-2', name: 'Card.vue', type: '文件', size: '1.8 KB' },
        ],
      },
      {
        id: '1-2',
        name: 'utils',
        type: '文件夹',
        size: '-',
        children: [{ id: '1-2-1', name: 'index.vue', type: '文件', size: '0.5 KB' }],
      },
    ],
  },
  {
    id: '2',
    name: 'package.json',
    type: '文件',
    size: '1.2 KB',
  },
]

// ==================== 示例 2: 带行选择 ====================
const selectionColumns: TreeTableColumn[] = [
  { key: 'name', title: '部门名称', width: '250px' },
  { key: 'manager', title: '负责人' },
  { key: 'memberCount', title: '人数' },
]

const selectionData: TreeTableNode[] = [
  {
    id: 'dept-1',
    name: '技术部',
    manager: '张三',
    memberCount: 50,
    children: [
      {
        id: 'dept-1-1',
        name: '前端组',
        manager: '李四',
        memberCount: 20,
        children: [
          { id: 'dept-1-1-1', name: 'React小组', manager: '王五', memberCount: 10 },
          { id: 'dept-1-1-2', name: 'Vue小组', manager: '赵六', memberCount: 10 },
        ],
      },
      {
        id: 'dept-1-2',
        name: '后端组',
        manager: '孙七',
        memberCount: 30,
      },
    ],
  },
  {
    id: 'dept-2',
    name: '产品部',
    manager: '周八',
    memberCount: 15,
  },
]

const selectedRows = ref<TreeTableNode[]>([])

function handleSelectionChange(rows: TreeTableNode[], keys: Array<string | number>) {
  selectedRows.value = rows
  console.log('选中的行:', rows)
  console.log('选中的键:', keys)
}

// ==================== 示例 3: 带分页 ====================
const paginationColumns: TreeTableColumn[] = [
  { key: 'name', title: '项目名称', width: '300px' },
  { key: 'status', title: '状态' },
  { key: 'progress', title: '进度' },
]

// 生成大量数据用于演示分页
const generatePaginationData = (): TreeTableNode[] => {
  const data: TreeTableNode[] = []
  for (let i = 1; i <= 30; i++) {
    data.push({
      id: `project-${i}`,
      name: `项目 ${i}`,
      status: i % 3 === 0 ? '已完成' : i % 3 === 1 ? '进行中' : '待开始',
      progress: `${Math.floor(Math.random() * 100)}%`,
      children:
        i % 2 === 0
          ? [
              {
                id: `project-${i}-1`,
                name: `子任务 ${i}-1`,
                status: '进行中',
                progress: `${Math.floor(Math.random() * 100)}%`,
              },
              {
                id: `project-${i}-2`,
                name: `子任务 ${i}-2`,
                status: '待开始',
                progress: '0%',
              },
            ]
          : [],
    })
  }
  return data
}

const paginationData = ref(generatePaginationData())

function handlePageChange(payload: { page: number; pageSize: number }) {
  console.log('页码变化:', payload)
  toast.info(`切换到第 ${payload.page} 页，每页 ${payload.pageSize} 条`)
}

// ==================== 示例 4: 懒加载 ====================
const lazyLoadColumns: TreeTableColumn[] = [
  { key: 'name', title: '分类名称', width: '300px' },
  { key: 'itemCount', title: '商品数量' },
]

const lazyLoadData: TreeTableNode[] = [
  {
    id: 'cat-1',
    name: '电子产品',
    itemCount: 0,
    hasChildren: true, // 标记为有子节点，但未加载
  },
  {
    id: 'cat-2',
    name: '服装',
    itemCount: 0,
    hasChildren: true,
  },
  {
    id: 'cat-3',
    name: '图书',
    itemCount: 150,
  },
]

// 模拟异步加载子节点
async function loadChildren(node: TreeTableNode): Promise<TreeTableNode[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 800))

  const nodeId = node.id as string

  if (nodeId === 'cat-1') {
    return [
      { id: 'cat-1-1', name: '手机', itemCount: 45 },
      { id: 'cat-1-2', name: '电脑', itemCount: 30 },
      { id: 'cat-1-3', name: '平板', itemCount: 20, hasChildren: true },
    ]
  } else if (nodeId === 'cat-2') {
    return [
      { id: 'cat-2-1', name: '男装', itemCount: 60 },
      { id: 'cat-2-2', name: '女装', itemCount: 80 },
    ]
  } else if (nodeId === 'cat-1-3') {
    return [
      { id: 'cat-1-3-1', name: 'iPad', itemCount: 10 },
      { id: 'cat-1-3-2', name: 'Android平板', itemCount: 10 },
    ]
  }

  return []
}

// ==================== 示例 5: 自定义单元格 ====================
const customColumns: TreeTableColumn[] = [
  { key: 'name', title: '用户名', width: '200px' },
  { key: 'email', title: '邮箱' },
  { key: 'role', title: '角色' },
  { key: 'status', title: '状态', slot: 'cell-status' },
  { key: 'actions', title: '操作', slot: 'cell-actions', align: 'right' },
]

const customData: TreeTableNode[] = [
  {
    id: 'user-1',
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    status: 'active',
    children: [
      {
        id: 'user-1-1',
        name: '张小三',
        email: 'xiaozhang@example.com',
        role: '用户',
        status: 'active',
      },
    ],
  },
  {
    id: 'user-2',
    name: '李四',
    email: 'lisi@example.com',
    role: '编辑',
    status: 'inactive',
  },
]

function handleEdit(row: TreeTableNode) {
  toast.success(`编辑用户: ${row.name}`)
}

function handleDelete(row: TreeTableNode) {
  toast.warning(`删除用户: ${row.name}`)
}

// ==================== 示例 6: 完整配置 ====================
const fullConfigColumns: TreeTableColumn[] = [
  { key: 'name', title: '部门名称', width: '250px' },
  { key: 'code', title: '部门编码' },
  { key: 'manager', title: '负责人' },
  { key: 'memberCount', title: '人数', align: 'center' },
]

const fullConfigData: TreeTableNode[] = [
  {
    id: '1',
    name: '研发中心',
    code: 'RD001',
    manager: '张总',
    memberCount: 120,
    children: [
      {
        id: '1-1',
        name: '前端团队',
        code: 'RD001-FE',
        manager: '李经理',
        memberCount: 40,
        children: [
          {
            id: '1-1-1',
            name: 'Web开发组',
            code: 'RD001-FE-WEB',
            manager: '王组长',
            memberCount: 20,
          },
          {
            id: '1-1-2',
            name: '移动端组',
            code: 'RD001-FE-MOBILE',
            manager: '赵组长',
            memberCount: 20,
          },
        ],
      },
      {
        id: '1-2',
        name: '后端团队',
        code: 'RD001-BE',
        manager: '孙经理',
        memberCount: 50,
      },
      {
        id: '1-3',
        name: '测试团队',
        code: 'RD001-QA',
        manager: '周经理',
        memberCount: 30,
      },
    ],
  },
  {
    id: '2',
    name: '产品中心',
    code: 'PD001',
    manager: '吴总',
    memberCount: 30,
    children: [
      { id: '2-1', name: '产品设计', code: 'PD001-DESIGN', manager: '郑主管', memberCount: 15 },
      { id: '2-2', name: '用户研究', code: 'PD001-UX', manager: '钱主管', memberCount: 15 },
    ],
  },
  {
    id: '3',
    name: '运营中心',
    code: 'OP001',
    manager: '冯总',
    memberCount: 45,
  },
]

function handleToggle(payload: { row: TreeTableNode; expanded: boolean }) {
  console.log('节点展开/折叠:', payload.row.name, payload.expanded ? '展开' : '折叠')
}

function handleRowClick(row: TreeTableNode) {
  console.log('点击行:', row.name)
}

function handleFullSelectionChange(rows: TreeTableNode[], _keys: Array<string | number>) {
  console.log('选择变化:', rows.length, '行被选中')
}
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
