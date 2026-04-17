export interface TreeTableColumn {
  key: string
  title: string
  width?: string
  align?: 'left' | 'center' | 'right'
  slot?: string
  headerClass?: string
  cellClass?: string
}

export interface TreeTableNode {
  [key: string]: unknown
  children?: TreeTableNode[]
  hasChildren?: boolean
  disabled?: boolean
}

export interface TreeTableConfig {
  enabled?: boolean
  rowKey?: string
  childrenKey?: string
  indent?: number
  expandOnRowClick?: boolean
  defaultExpandAll?: boolean
  defaultExpandedKeys?: Array<string | number>
}

export interface TreeTableSelectionConfig {
  enabled?: boolean
  checkStrictly?: boolean
  defaultSelectedKeys?: Array<string | number>
}

export interface TreeTableToolbarConfig {
  enabled?: boolean
  title?: string
  description?: string
  showExpandActions?: boolean
  showSelectionSummary?: boolean
}

export interface TreeTablePaginationConfig {
  enabled?: boolean
  page?: number
  pageSize?: number
  pageSizeOptions?: number[]
}
