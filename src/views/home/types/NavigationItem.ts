/**
 * NavigationItem - 导航项类型定义
 */

export interface NavigationItem {
  /** 唯一标识 */
  id: string
  /** 导航标题 */
  title: string
  /** 导航图标（Lucide 图标名称） */
  icon?: string
  /** 跳转路径 */
  path?: string
  /** 描述信息 */
  description?: string
  /** 是否在新窗口打开 */
  openInNewTab?: boolean
  /** 排序权重 */
  order?: number
  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 扩展元数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>
  /** 子导航项 */
  children?: NavigationItem[]
}
