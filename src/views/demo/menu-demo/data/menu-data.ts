// ==================== 表格列定义 ====================

export const tableColumns = [
  {
    key: 'name',
    dataKey: 'name',
    title: '菜单名称',
    width: 250,
  },
  {
    key: 'type',
    dataKey: 'type',
    title: '类型',
    width: 120,
  },
  {
    key: 'path',
    dataKey: 'path',
    title: '路径/动作',
    width: 200,
    cellRenderer: ({ rowData }: any) => {
      if (rowData.path) {
        return rowData.path
      }
      if (rowData.hasAction) {
        return '🔧 自定义动作'
      }
      return '-'
    },
  },
  {
    key: 'order',
    dataKey: 'order',
    title: '排序',
    width: 80,
  },
  {
    key: 'action',
    dataKey: 'action',
    title: '操作',
    width: 150,
    align: 'center',
  },
]
