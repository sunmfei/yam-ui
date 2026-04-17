<script setup lang="ts">
import { MenubarSubTrigger } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-vue-next'

const _props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    inset?: boolean
  }>(),
  {
    inset: false,
  }
)
</script>

<template>
  <MenubarSubTrigger
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
        _props.inset && 'pl-8',
        _props.class
      )
    "
  >
    <slot />
    <ChevronRight class="ml-auto h-4 w-4" />
  </MenubarSubTrigger>
</template>
