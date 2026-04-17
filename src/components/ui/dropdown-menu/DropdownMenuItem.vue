<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    :class="
      cn(
        'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0',
        props.class
      )
    "
    @select="emit('select')"
  >
    <slot />
  </DropdownMenuItem>
</template>
