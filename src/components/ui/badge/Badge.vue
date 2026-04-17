<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
})

const variants: Record<string, string> = {
  default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive:
    'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  outline: 'text-foreground',
  success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
  warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
}
</script>

<template>
  <div
    :class="
      cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        variants[variant],
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
