/**
 * 菜单节点模型
 */
import type { MenuNodeType } from '@/types'

/**
 * 菜单节点
 */
export interface MenuNode {
  /** 唯一标识 */
  id: string
  /** 显示名称 */
  name: string
  /** 节点类型：action/route/menu/select/option */
  type: MenuNodeType

  /** 图标名称 */
  icon?: string
  /** 动态获取图标的 getter key */
  getIconKey?: string

  /** 路由路径（type=route 时使用） */
  path?: string
  /** 动作执行 key（type=action 时使用） */
  actionKey?: string
  /** 点击事件处理 key */
  onItemClickKey?: string

  /** 选项值（type=option 时使用） */
  value?: string | number
  /** 值变化时的 handler key（type=select 时使用） */
  onChangeKey?: string
  /** 获取当前值的 getter key（type=select 时使用） */
  getValueKey?: string
  /** 获取选中项标签的 getter key（type=select 时使用） */
  getSelectedLabelKey?: string

  /** 是否禁用 */
  disabled?: boolean
  /** 是否隐藏 */
  hidden?: boolean
  /** 排序权重 */
  order?: number
  /** 扩展元数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>

  /** 子节点 */
  children?: MenuNode[]
}
