import type { MenuNode } from '@/types/menu'

/**
 * 表单初始值
 */
export const initialFormState: Omit<MenuNode, 'id' | 'children'> = {
  name: '',
  type: 'route',
  icon: '',
  path: '',
  actionKey: '',
  order: 0,
  hidden: false,
  disabled: false,
}

/**
 * 表单字段配置
 */
export const formFields = [
  {
    key: 'name',
    label: '节点名称',
    type: 'text',
    placeholder: '请输入节点名称',
    required: true,
  },
  //'button' | 'route' | 'dropdown' | 'list' | 'list-item'
  {
    key: 'type',
    label: '节点类型',
    type: 'select',
    options: [
      { value: 'route', label: '路由' },
      { value: 'button', label: '按钮' },
      { value: 'dropdown', label: '下拉菜单' },
      { value: 'list', label: '列表' },
      { value: 'list-item', label: '列表项' },
    ],
  },
  {
    key: 'icon',
    label: '图标',
    type: 'icon-picker',
    placeholder: '选择图标',
  },
  {
    key: 'path',
    label: '路由路径',
    type: 'text',
    placeholder: '/example/path',
    showWhen: (formData: Record<string, unknown>) => formData.type === 'route',
  },
  {
    key: 'actionKey',
    label: '动作Key',
    type: 'text',
    placeholder: '例: menu-toggle-theme',
    showWhen: (formData: Record<string, unknown>) => formData.type === 'button',
  },
  {
    key: 'order',
    label: '排序',
    type: 'number',
    placeholder: '0',
    min: 0,
  },
]
