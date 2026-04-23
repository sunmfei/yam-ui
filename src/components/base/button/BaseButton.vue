<template>
  <button :class="cn(buttonVariants({ variant, size }), props.class)">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

/**
 * BaseButton - 基础按钮组件
 *
 * 封装 ui/button，提供统一的按钮样式和交互
 * 禁止在业务代码中直接使用 ui/button
 */
defineOptions({
  name: 'BaseButton',
})

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
    class?: HTMLAttributes['class']
  }>(),
  {
    variant: 'default',
    size: 'default',
  }
)
</script>
