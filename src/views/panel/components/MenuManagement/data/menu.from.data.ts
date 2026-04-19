import type { MenuNode } from '@/types'

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
  {
    key: 'type',
    label: '节点类型',
    type: 'select',
    options: [
      { value: 'route', label: '路由' },
      { value: 'action', label: '动作' },
      { value: 'menu', label: '菜单' },
      { value: 'select', label: '选择器' },
      { value: 'option', label: '选项' },
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
    showWhen: (formData: Record<string, unknown>) => formData.type === 'action',
  },
  {
    key: 'order',
    label: '排序',
    type: 'number',
    placeholder: '0',
    min: 0,
  },
]
