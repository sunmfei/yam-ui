/**
 * Panel 模块路由配置
 *
 * 统一管理所有面板模块的路由
 */

import type { FrontendRoute } from '@/types'
import { settingsRoutes } from '@/views/panel/settings/router'

// 导出所有面板模块的路由
export const panelRoutes: FrontendRoute[] = [
  ...settingsRoutes,
  // 未来可以添加其他面板模块的路由
  // ...otherPanelRoutes,
]

// 默认导出
export default panelRoutes
