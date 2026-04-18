<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

/**
 * Container - 响应式容器组件
 *
 * 特性：
 * - 支持三种预设尺寸：small(70%), medium(85%), large(100%)
 * - 支持自定义宽高
 * - 响应式设计，自动适配屏幕
 */

export type ContainerSize = 'small' | 'medium' | 'large' | 'custom'

interface Props {
  /** 预设尺寸 */
  size?: ContainerSize
  /** 自定义宽度（仅在 size='custom' 时生效） */
  customWidth?: string
  /** 自定义高度（仅在 size='custom' 时生效） */
  customHeight?: string
  /** 是否全屏显示 */
  fullscreen?: boolean
  /** 额外的 class */
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  customWidth: '85%',
  customHeight: 'auto',
  fullscreen: false,
})

// 计算容器样式
const containerStyle = computed(() => {
  if (props.fullscreen) {
    return {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
    }
  }

  let width: string
  let height: string

  switch (props.size) {
    case 'small':
      width = '70%'
      height = '80vh'
      break
    case 'medium':
      width = '85%'
      height = '90vh'
      break
    case 'large':
      width = '100%'
      height = '92vh' // 留出底部空间
      break
    case 'custom':
      width = props.customWidth
      height = props.customHeight
      break
    default:
      width = '85%'
      height = '90vh'
  }

  return {
    width,
    height,
    maxWidth: '100vw',
    maxHeight: '100vh',
  }
})

// 计算容器的 class
const containerClass = computed(() => {
  const baseClasses = ['transition-all', 'duration-300', 'ease-in-out']

  // 根据尺寸添加不同的类
  if (props.fullscreen) {
    // 只占满父容器，不脱离布局
    baseClasses.push('w-full', 'h-full')
    // baseClasses.push('fixed', 'inset-0', 'z-50')
  } else {
    // 非全屏模式下，确保居中和正确的布局
    // mx-auto 必须在最后，以确保它不被覆盖
    baseClasses.push('relative', 'flex', 'flex-col', 'mx-auto')
  }

  return cn(baseClasses, props.class)
})
</script>

<template>
  <div :class="containerClass" :style="containerStyle">
    <slot />
  </div>
</template>
