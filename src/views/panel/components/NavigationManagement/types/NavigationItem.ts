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
import { ICON_POOL } from '@/config/types/icon.pool.ts'

/**
 * 子导航项类型（不包含 children，避免递归）
 */
export interface NavigationChild {
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
}

/**
 * 导航项类型（支持层级结构）
 */
export interface NavigationItem {
  /** 唯一标识 */
  id: string
  /** 导航标题 */
  title: string
  /** 导航图标（Lucide 图标名称） */
  icon?: string
  /** 跳转路径（分类节点可选） */
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
  /** 子导航项（仅一层） */
  children?: NavigationChild[]
  /** 扩展元数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>
}

export const demoData: NavigationItem[] = [
  {
    id: 'nav-home',
    title: '常用导航',
    icon: ICON_POOL.Adobe,
    description: '返回应用首页',
    order: 1,
    disabled: false,
    hidden: false,
    children: [
      {
        id: 'nav-home-1',
        title: '百度',
        icon: ICON_POOL.Eye,
        path: 'https://www.baidu.com',
        description: '百度一下，你就知道',
        order: 1,
      },
      {
        id: 'nav-home-2',
        title: 'Google',
        icon: ICON_POOL.Eye,
        path: 'https://www.google.com',
        description: '谷歌一下，你就知道',
        order: 2,
      },
    ],
  },
]
