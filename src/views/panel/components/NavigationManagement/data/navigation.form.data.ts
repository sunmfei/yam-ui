import type { NavigationItem } from '../types/NavigationItem'

/**
 * 表单初始值
 */
export const initialFormState: Omit<NavigationItem, 'id' | 'children'> = {
  title: '',
  icon: '',
  path: '',
  description: '',
  openInNewTab: true,
  order: 0,
  hidden: false,
  disabled: false,
}

/**
 * 表单字段配置
 */
export const formFields = [
  {
    key: 'title',
    label: '导航标题',
    type: 'text',
    placeholder: '请输入导航标题',
    required: true,
  },
  {
    key: 'icon',
    label: '图标',
    type: 'icon-picker',
    placeholder: '选择图标',
  },
  {
    key: 'path',
    label: '网站地址',
    type: 'text',
    placeholder: 'https://www.example.com',
    hint: '分类节点可不填，导航项必填（必须是完整 URL）',
  },
  {
    key: 'description',
    label: '描述',
    type: 'text',
    placeholder: '请输入描述信息',
  },
  {
    key: 'order',
    label: '排序',
    type: 'number',
    placeholder: '0',
    min: 0,
  },
]
