<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900"
  >
    <!-- 使用 BaseTable 组件，启用配置面板 -->
    <BaseTable
      title="响应式表格演示"
      subtitle="通过配置面板调整容器尺寸，支持小、中、大、全屏和自定义尺寸"
      :data="tableData"
      :columns="tableColumns"
      :configurable="true"
      container-size="medium"
      :searchable="true"
      search-placeholder="搜索部门或人员..."
      :actions="[
        { label: '刷新', onClick: handleRefresh },
        { label: '导出', onClick: handleExport },
      ]"
      @search="handleSearch"
    >
      <!-- 自定义工具栏左侧插槽 -->
      <template #toolbar-left>
        <div class="flex items-center gap-3">
          <Button variant="outline" size="sm" @click="handleAdd">
            <Plus class="mr-2 h-4 w-4" />
            新增
          </Button>
        </div>
      </template>

      <!-- 自定义状态列 -->
      <template #cell-status="{ value }">
        <Badge :variant="value === 'active' ? 'default' : 'secondary'">
          {{ value === 'active' ? '活跃' : '禁用' }}
        </Badge>
      </template>

      <!-- 自定义操作列 -->
      <template #cell-actions="{ row }">
        <div class="flex gap-2">
          <Button size="sm" variant="outline" @click.stop="handleEdit(row)">编辑</Button>
          <Button size="sm" variant="destructive" @click.stop="handleDelete(row)">删除</Button>
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import BaseTable from '@/components/table/BaseTable.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { TreeTableNode, TreeTableColumn } from '@/components/ui/tree-table/types'

// 表格列配置
const tableColumns: TreeTableColumn[] = [
  { key: 'name', title: '名称', width: '250px' },
  { key: 'department', title: '部门' },
  { key: 'role', title: '角色' },
  {
    key: 'status',
    title: '状态',
    slotName: 'status',
  },
  {
    key: 'actions',
    title: '操作',
    width: '180px',
    slotName: 'actions',
  },
]

// 表格数据
const tableData = ref<TreeTableNode[]>([
  {
    id: '1',
    name: '技术部',
    department: '研发中心',
    role: '部门',
    status: 'active',
    children: [
      {
        id: '1-1',
        name: '张三',
        department: '前端组',
        role: '高级工程师',
        status: 'active',
      },
      {
        id: '1-2',
        name: '李四',
        department: '后端组',
        role: '架构师',
        status: 'active',
      },
      {
        id: '1-3',
        name: '王五',
        department: '移动端组',
        role: '技术主管',
        status: 'inactive',
      },
    ],
  },
  {
    id: '2',
    name: '产品部',
    department: '产品中心',
    role: '部门',
    status: 'active',
    children: [
      {
        id: '2-1',
        name: '赵六',
        department: '产品设计',
        role: '产品经理',
        status: 'active',
      },
      {
        id: '2-2',
        name: '孙七',
        department: '用户研究',
        role: '研究员',
        status: 'active',
      },
    ],
  },
  {
    id: '3',
    name: '设计部',
    department: '设计中心',
    role: '部门',
    status: 'active',
    children: [
      {
        id: '3-1',
        name: '周八',
        department: 'UI设计',
        role: '设计师',
        status: 'active',
      },
      {
        id: '3-2',
        name: '吴九',
        department: 'UX设计',
        role: '高级设计师',
        status: 'inactive',
      },
    ],
  },
])

// 事件处理
function handleRefresh() {
  console.log('刷新数据')
}

function handleExport() {
  console.log('导出数据')
}

function handleAdd() {
  console.log('新增')
}

function handleEdit(row: TreeTableNode) {
  console.log('编辑:', row)
}

function handleDelete(row: TreeTableNode) {
  console.log('删除:', row)
}

function handleSearch(keyword: string) {
  console.log('搜索:', keyword)
}
</script>
