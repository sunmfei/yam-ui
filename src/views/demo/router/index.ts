import { treeTableDemoRoutes } from '@/views/demo/tree-table-demo/router'
import { menuRoutes } from '@/views/menu/router'

/**
 * 所有本地路由（按顺序合并）
 * 系统路由在前，业务模块路由在后
 */
export const demoRoutes = [...treeTableDemoRoutes, ...menuRoutes]

// 为了兼容旧的导出名称
export const demoRouter = demoRoutes
