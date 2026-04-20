<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

/**
 * BaseContainer - 基础响应式容器组件
 *
 * 特性：
 * - 支持三种预设尺寸：small(70%), medium(85%), large(100%)
 * - 支持自定义宽高
 * - 响应式设计，自动适配屏幕
 */

defineOptions({
  name: 'BaseContainer',
})

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
  /** 背景透明度 (0-100) */
  bgOpacity?: number
  /** 额外的 class */
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  customWidth: undefined,
  customHeight: undefined,
  fullscreen: false,
  bgOpacity: 100,
})

// 计算容器的 class
const containerClass = computed(() => {
  const baseClasses = ['transition-all', 'duration-300', 'ease-in-out', 'relative']

  // 根据尺寸添加不同的类
  if (props.fullscreen) {
    // 全屏模式占满父容器
    baseClasses.push('w-full', 'h-full')
  } else {
    // 非全屏模式下，确保居中和正确的布局
    baseClasses.push('flex', 'flex-col', 'mx-auto')
  }

  return cn(baseClasses, props.class)
})

// 计算背景 class
const backgroundClass = computed(() => {
  if (props.bgOpacity >= 100) return ''

  // 映射常用的透明度值到 Tailwind class
  const opacityMap: Record<number, string> = {
    0: 'bg-background/0',
    10: 'bg-background/10',
    20: 'bg-background/20',
    30: 'bg-background/30',
    40: 'bg-background/40',
    50: 'bg-background/50',
    60: 'bg-background/60',
    70: 'bg-background/70',
    80: 'bg-background/80',
    90: 'bg-background/90',
  }

  // 找到最接近的值
  const closest = Object.keys(opacityMap)
    .map(Number)
    .reduce((prev, curr) =>
      Math.abs(curr - props.bgOpacity) < Math.abs(prev - props.bgOpacity) ? curr : prev
    )

  return opacityMap[closest] || 'bg-background/50'
})

// 计算容器样式
const containerStyle = computed(() => {
  if (props.fullscreen) {
    return {
      width: '100%',
      height: '100%',
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
      height = 'auto'
      break
    case 'large':
      width = '100%'
      height = '92vh' // 留出底部空间
      break
    case 'custom':
      width = props.customWidth || '85%'
      height = props.customHeight || '90vh'
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
</script>

<template>
  <div :class="containerClass" :style="containerStyle">
    <!-- 背景层 -->
    <div
      v-if="bgOpacity < 100"
      class="absolute inset-0 -z-10 pointer-events-none"
      :class="backgroundClass"
    />
    <!-- 内容层 -->
    <div class="relative z-10 h-full flex flex-col">
      <slot />
    </div>
  </div>
</template>
