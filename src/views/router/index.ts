/**
 * 本地路由汇总
 * 收集所有模块的路由配置
 */
import { systemRoutes } from '@/views/home/router'
import { searchRoutes } from '@/views/searchBox/router'
import { demoRouter } from '@/views/demo/router'
import { panelRoutes } from '@/views/panel/router'

// 在这里添加新模块的路由
// import { dashboardRoutes } from '@/views/dashboard/router'
// import { userRoutes } from '@/views/user/router'

/**
 * 所有本地路由（按顺序合并）
 * 系统路由在前，业务模块路由在后
 */
export const localRoutes = [
  ...systemRoutes,
  ...searchRoutes,
  ...demoRouter,
  ...panelRoutes,
  // ...dashboardRoutes,
  // ...userRoutes,
]

// 为了兼容旧的导出名称
export const localRouter = localRoutes
