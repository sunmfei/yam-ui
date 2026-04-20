/**
 * Panel 模块路由配置
 *
 * 统一管理所有面板模块的路由
 */

import type { FrontendRoute } from '@/types'
import { adminRoutes } from '@/views/panel/admin/router'
import { menuRoutes } from '@/views/panel/components/MenuManagement/router'
import navigationRoutes from '@/views/panel/components/NavigationManagement/router'

// 导出所有面板模块的路由
export const panelRoutes: FrontendRoute[] = [
  ...adminRoutes,
  ...menuRoutes,
  ...navigationRoutes,
  // 未来可以添加其他面板模块的路由
  // ...otherPanelRoutes,
]

// 默认导出
export default panelRoutes
