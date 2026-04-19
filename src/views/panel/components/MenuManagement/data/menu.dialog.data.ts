import type { ContainerSize } from '@/components/base/container/BaseContainer.vue'

/**
 * 对话框配置
 */
export const dialogConfig = {
  size: 'medium' as ContainerSize,
  fullscreen: false,
  title: {
    edit: '编辑节点',
    add: '新增节点',
  },
  buttons: {
    cancel: {
      label: '取消',
      variant: 'outline' as const,
    },
    confirm: {
      label: {
        edit: '保存',
        add: '添加',
      },
      variant: 'default' as const,
    },
  },
}
