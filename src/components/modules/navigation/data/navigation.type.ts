/**
 * 功能：导航数据源
 * 结果：提供页面数据
 * 设计目的：数据驱动UI
 */

export interface NavigationItem {
  id: string
  title: string
  url?: string // 扁平结构使用
  path?: string // 树形结构使用
  description?: string
  category?: string // 扁平结构使用
  icon?: string
  openInNewTab?: boolean // 树形结构使用
  order?: number // 树形结构使用
  disabled?: boolean // 树形结构使用
  hidden?: boolean // 树形结构使用
  meta?: Record<string, unknown> // 树形结构使用
  children?: NavigationItem[] // 树形结构使用
  enablePreview?: boolean // 是否启用网站预览功能
}

// 从 DEFAULT_NAVIGATION 转换而来的扁平数据
export const navigationList: NavigationItem[] = [
  // 搜索引擎
  {
    id: 'nav-pmp',
    title: '项目管理平台',
    url: 'http://10.1.109.82:9527/#/login',
    description: 'sit登录',
    category: 'sit',
    icon: 'Search',
    enablePreview: true, // 启用预览功能
  },
  {
    id: 'nav-coding',
    title: 'coding',
    url: 'http://xjnx.code.mgr.xjrccb.com/',
    description: 'coding',
    category: 'system',
    icon: 'Globe',
    enablePreview: false, // 不启用预览
  },
  {
    id: 'nav-mgr',
    title: '统一身份认证',
    url: 'http://uim.mgr.xjrccb.com/apphub/',
    description: '统一身份认证',
    category: 'system',
    icon: 'Compass',
    enablePreview: true, // 启用预览功能
  },
]
