/**
 * UI 相关模型
 */
import type { BackgroundType } from '../enums/BackgroundType'

/**
 * 背景选项接口
 */
export interface BackgroundOption {
  label: string
  value: BackgroundType
}

/**
 * 背景选项列表
 */
export const BACKGROUND_OPTIONS: BackgroundOption[] = [
  { label: '粒子效果', value: 'particles' },
  { label: '渐变光晕', value: 'gradient' },
  { label: '网格线条', value: 'grid' },
  { label: '波浪动画', value: 'wave' },
  { label: '自然风景', value: 'nature' },
  { label: '樱花飘落', value: 'sakura' },
  { label: '无背景', value: 'none' },
]
