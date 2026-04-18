import type { TreeTableColumn } from '@/components/ui/tree-table/types'

/**
 * 菜单管理表格列配置
 */
export const menuColumns: TreeTableColumn[] = [
  { key: 'name', title: '节点', slot: 'name', width: '30%' },
  { key: 'type', title: '类型', slot: 'type', width: '12%' },
  { key: 'target', title: '路径/操作', slot: 'target', width: '28%' },
  { key: 'order', title: '排序', width: '10%', align: 'center' },
  { key: 'status', title: '状态', slot: 'status', width: '10%' },
  { key: 'actions', title: '操作', slot: 'actions', width: '20%', align: 'right' },
]

/**
 * 表头操作按钮配置
 */
export const headerActions = [
  { label: '刷新', key: 'refresh', variant: 'outline' as const },
  { label: '重置', key: 'reset', variant: 'default' as const },
  { label: '导入', key: 'import', variant: 'default' as const, icon: 'Upload' },
  { label: '导出', key: 'export', variant: 'default' as const },
  { label: '批量删除', key: 'batchDelete', variant: 'destructive' as const },
  { label: '添加根节点', key: 'addRoot', variant: 'default' as const },
]

/**
 * 类型筛选选项
 */
export const typeFilterOptions = [
  { value: 'all', label: '全部类型' },
  { value: 'route', label: '路由' },
  { value: 'button', label: '按钮' },
  { value: 'dropdown', label: '下拉菜单' },
  { value: 'list', label: '列表' },
  { value: 'list-item', label: '列表项' },
]
