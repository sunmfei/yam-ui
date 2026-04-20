/**
 * NavigationItem - 导航项类型定义（扁平结构）
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
 * 导航项类型（扁平结构，无 children）
 */
export interface NavigationItem {
  /** 唯一标识 */
  id: string
  /** 导航标题 */
  title: string
  /** 导航图标（Lucide 图标名称） */
  icon?: string
  /** 跳转路径/URL */
  url: string
  /** 描述信息 */
  description?: string
  /** 分类 */
  category: string
  /** 排序权重 */
  order?: number
  /** 扩展元数据 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: Record<string, any>
}

export const demoData: NavigationItem[] = [
  {
    id: 'nav-baidu',
    title: '百度',
    icon: ICON_POOL.Eye,
    url: 'https://www.baidu.com',
    description: '百度一下，你就知道',
    category: '搜索引擎',
    order: 1,
  },
  {
    id: 'nav-google',
    title: 'Google',
    icon: ICON_POOL.Eye,
    url: 'https://www.google.com',
    description: '谷歌搜索',
    category: '搜索引擎',
    order: 2,
  },
  {
    id: 'nav-github',
    title: 'GitHub',
    icon: ICON_POOL.Adobe,
    url: 'https://github.com',
    description: '代码托管平台',
    category: '开发工具',
    order: 3,
  },
]
