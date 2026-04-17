/**
 * 树表格列配置
 */
export interface TreeTableColumn {
  /** 列的唯一标识符 */
  key: string
  /** 列标题显示文本 */
  title: string
  /** CSS宽度值（例如：'100px'、'20%'） */
  width?: string
  /** 列内文本对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 自定义插槽名称，用于渲染单元格内容 */
  slot?: string
  /** 列标题的额外CSS类 */
  headerClass?: string
  /** 列单元格的额外CSS类 */
  cellClass?: string
}

/**
 * 树表格节点数据结构
 */
export interface TreeTableNode {
  [key: string]: unknown
  /** 子节点（如果有） */
  children?: TreeTableNode[]
  /** 节点是否有子节点（用于懒加载） */
  hasChildren?: boolean
  /** 节点是否禁用（不可交互） */
  disabled?: boolean
}

/**
 * 树形结构配置（展开/折叠行为）
 */
export interface TreeTableConfig {
  /** 启用树形功能 */
  enabled?: boolean
  /** 用作唯一行键的属性名（默认：'id'） */
  rowKey?: string
  /** 子节点属性名（默认：'children'） */
  childrenKey?: string
  /** 每级缩进像素数（默认：18） */
  indent?: number
  /** 点击行任意位置时展开/折叠 */
  expandOnRowClick?: boolean
  /** 默认展开所有节点 */
  defaultExpandAll?: boolean
  /** 默认展开的键值数组 */
  defaultExpandedKeys?: Array<string | number>
}

/**
 * 行选择配置
 */
export interface TreeTableSelectionConfig {
  /** 启用行选择功能 */
  enabled?: boolean
  /** 如果为true，选择不会级联到子节点/父节点 */
  checkStrictly?: boolean
  /** 默认选中的键值数组 */
  defaultSelectedKeys?: Array<string | number>
}

/**
 * 工具栏配置
 */
export interface TreeTableToolbarConfig {
  /** 启用工具栏 */
  enabled?: boolean
  /** 工具栏显示的标题 */
  title?: string
  /** 标题下方的描述文本 */
  description?: string
  /** 显示展开/折叠所有按钮 */
  showExpandActions?: boolean
  /** 显示已选择行数摘要 */
  showSelectionSummary?: boolean
  /** 显示配置面板切换按钮 */
  showConfigToggle?: boolean
}

/**
 * 分页配置
 */
export interface TreeTablePaginationConfig {
  /** 启用分页功能 */
  enabled?: boolean
  /** 当前页码（从1开始） */
  page?: number
  /** 每页显示行数 */
  pageSize?: number
  /** 可用的每页行数选项 */
  pageSizeOptions?: number[]
}
