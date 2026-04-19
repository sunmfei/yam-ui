/**
 * PanelSection - 面板配置结构（路径版）
 *
 * 功能：
 * 使用组件路径进行动态加载
 *
 * 结果：
 * 后端完全控制页面结构
 *
 * 设计目的：
 * 消除组件注册表维护成本
 */
export interface PanelSection {
  id: string
  label: string
  icon?: string

  /** 组件路径（关键） */
  componentPath?: string

  getter?: string

  /** 动作执行 key（type=action 时使用） */
  actionKey?: string
  /** 点击事件处理 key */
  onItemClickKey?: string

  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 排序权重 */
  order?: number
  /** 扩展元数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>

  children?: PanelSection[]

  /** 侧边栏头部组件路径 */
  sidebarHeaderPath?: string
  /** 侧边栏底部组件路径 */
  sidebarFooterPath?: string
}
