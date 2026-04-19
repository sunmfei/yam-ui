/**
 * NavigationItem - 导航项类型定义
 *
 * 功能：
 * 定义用户自定义导航的数据结构
 *
 * 结果：
 * 支持在 localStorage 中持久化存储
 *
 * 设计目的：
 * 允许用户配置个性化快速导航
 */

export interface NavigationItem {
  /** 唯一标识 */
  id: string
  /** 导航标题 */
  title: string
  /** 导航图标（Lucide 图标名称） */
  icon?: string
  /** 跳转路径 */
  path: string
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
}
