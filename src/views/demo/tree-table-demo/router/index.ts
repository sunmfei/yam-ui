import type { RouteRecordRaw } from 'vue-router'

export const treeTableDemoRoutes: RouteRecordRaw[] = [
  {
    path: '/tree-table-demo',
    name: 'TreeTableDemo',
    component: () => import('@/views/demo/tree-table-demo/index.vue'),
    meta: {
      title: 'TreeTable 使用示例',
      requiresAuth: false, // 开发测试时不需要登录
    },
  },
]

export default treeTableDemoRoutes
