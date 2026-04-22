/**
 * Modules 层组件统一导出
 *
 * 模块组件层：复杂业务模块，保持语义化命名
 */

export {
  NavigationPage,
  NavHeader,
  SearchBox,
  CategoryTabs,
  NavigationGrid,
  NavigationCard,
} from './navigation'

export type { NavigationItem } from './navigation'
// export { navigationList } from './navigation' // 数据来自 @/views/home/data/NavigationData

// export { default as MenuTree } from './menu/MenuTree.vue'
// export { default as NavbarMain } from './navbar/NavbarMain.vue'
// export { default as SearchModule } from './searchBox/SearchModule.vue'
