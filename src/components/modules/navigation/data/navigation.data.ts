/**
 * 功能：导航数据源
 * 结果：提供页面数据
 * 设计目的：数据驱动UI
 */

export interface NavigationItem {
  id: string
  title: string
  url: string
  description: string
  category: string
  icon?: string
}

export const navigationList: NavigationItem[] = [
  // 开发工具
  {
    id: '1',
    title: 'GitHub',
    url: 'https://github.com',
    description: '全球最大的代码托管平台',
    category: '开发',
    icon: 'Github',
  },
  {
    id: '2',
    title: 'Vue.js',
    url: 'https://vuejs.org',
    description: '渐进式 JavaScript 框架',
    category: '开发',
    icon: 'FileCode',
  },
  {
    id: '3',
    title: 'Vite',
    url: 'https://vitejs.dev',
    description: '下一代前端构建工具',
    category: '开发',
    icon: 'Zap',
  },
  {
    id: '4',
    title: 'TypeScript',
    url: 'https://www.typescriptlang.org',
    description: 'JavaScript 的超集',
    category: '开发',
    icon: 'FileType',
  },

  // 设计资源
  {
    id: '5',
    title: 'Figma',
    url: 'https://www.figma.com',
    description: '协作界面设计工具',
    category: '设计',
    icon: 'Palette',
  },
  {
    id: '6',
    title: 'Dribbble',
    url: 'https://dribbble.com',
    description: '设计师作品展示平台',
    category: '设计',
    icon: 'Image',
  },

  // 学习资源
  {
    id: '7',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Web 技术文档',
    category: '学习',
    icon: 'BookOpen',
  },
  {
    id: '8',
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: '开发者问答社区',
    category: '学习',
    icon: 'HelpCircle',
  },

  // 常用工具
  {
    id: '9',
    title: 'Google',
    url: 'https://www.google.com',
    description: '全球最大搜索引擎',
    category: '工具',
    icon: 'Search',
  },
  {
    id: '10',
    title: '百度',
    url: 'https://www.baidu.com',
    description: '中文搜索引擎',
    category: '工具',
    icon: 'Search',
  },
]
