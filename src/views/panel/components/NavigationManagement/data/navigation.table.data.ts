import type { TreeTableColumn } from '@/components/ui/tree-table/types'

/**
 * 导航管理表格列配置
 */
export const navigationColumns: TreeTableColumn[] = [
  { key: 'title', title: '标题', slot: 'title', width: '25%' },
  { key: 'icon', title: '图标', slot: 'icon', width: '10%', align: 'center' },
  { key: 'path', title: '路径', slot: 'path', width: '30%' },
  { key: 'order', title: '排序', width: '10%', align: 'center' },
  { key: 'status', title: '状态', slot: 'status', width: '10%' },
  { key: 'actions', title: '操作', slot: 'actions', width: '15%', align: 'right' },
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
  { label: '添加导航', key: 'addRoot', variant: 'default' as const },
]
