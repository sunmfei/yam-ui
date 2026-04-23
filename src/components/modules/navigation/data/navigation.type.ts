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
  meta?: Record<string, any> // 树形结构使用
  children?: NavigationItem[] // 树形结构使用
}

// 从 DEFAULT_NAVIGATION 转换而来的扁平数据
export const navigationList: NavigationItem[] = [
  // 搜索引擎
  {
    id: 'nav-baidu',
    title: '百度',
    url: 'https://www.baidu.com',
    description: '百度搜索',
    category: '搜索引擎',
    icon: 'Search',
  },
  {
    id: 'nav-google',
    title: 'Google',
    url: 'https://www.google.com',
    description: '谷歌搜索',
    category: '搜索引擎',
    icon: 'Globe',
  },
  {
    id: 'nav-bing',
    title: 'Bing',
    url: 'https://www.bing.com',
    description: '必应搜索',
    category: '搜索引擎',
    icon: 'Compass',
  },
  {
    id: 'nav-so-gou',
    title: 'SouGou',
    url: 'https://www.sougou.com',
    description: '搜狗搜索',
    category: '搜索引擎',
    icon: 'Compass',
  },

  // 开发工具
  {
    id: 'nav-github',
    title: 'GitHub',
    url: 'https://github.com',
    description: '代码托管平台',
    category: '开发工具',
    icon: 'Github',
  },
  {
    id: 'nav-stackoverflow',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: '技术问答社区',
    category: '开发工具',
    icon: 'HelpCircle',
  },
  {
    id: 'nav-mdn',
    title: 'MDN',
    url: 'https://developer.mozilla.org',
    description: 'Web 技术文档',
    category: '开发工具',
    icon: 'FileText',
  },

  // 购物网站
  {
    id: 'nav-taobao',
    title: '淘宝',
    url: 'https://www.taobao.com',
    description: '淘宝网',
    category: '购物网站',
    icon: 'ShoppingBag',
  },
  {
    id: 'nav-jd',
    title: '京东',
    url: 'https://www.jd.com',
    description: '京东商城',
    category: '购物网站',
    icon: 'Package',
  },

  // 社交媒体
  {
    id: 'nav-weibo',
    title: '微博',
    url: 'https://weibo.com',
    description: '新浪微博',
    category: '社交媒体',
    icon: 'MessageCircle',
  },
  {
    id: 'nav-zhihu',
    title: '知乎',
    url: 'https://www.zhihu.com',
    description: '知乎社区',
    category: '社交媒体',
    icon: 'BookOpen',
  },
]
