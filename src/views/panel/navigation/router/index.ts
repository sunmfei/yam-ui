/**
 * navigation/router/index.ts - 导航管理路由配置
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/navigation',
    name: 'NavigationManagement',
    component: () => import('@/views/panel/components/NavigationManagement/index.vue'),
    meta: {
      title: '导航管理',
      icon: 'Compass',
    },
  },
]

export default routes
