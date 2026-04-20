import type { NavigationItem } from '../types/NavigationItem'
import { getAllCategories } from './category.dict'

/**
 * 表单初始值
 */
export const initialFormState: Omit<NavigationItem, 'id'> = {
  title: '',
  icon: '',
  url: '',
  description: '',
  category: '搜索引擎',
  order: 0,
}

/**
 * 分类选项（从字典获取）
 */
const categoryOptions = getAllCategories().map((cat) => ({
  label: cat.name,
  value: cat.code,
}))

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
    key: 'url',
    label: '网站地址',
    type: 'text',
    placeholder: 'https://www.example.com',
    hint: '必须是完整的 URL（以 http:// 或 https:// 开头）',
  },
  {
    key: 'category',
    label: '分类',
    type: 'select',
    placeholder: '请选择分类',
    required: true,
    options: categoryOptions,
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
