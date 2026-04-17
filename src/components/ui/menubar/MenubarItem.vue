<script setup lang="ts">
import { MenubarItem } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    disabled?: boolean
    inset?: boolean
  }>(),
  {
    disabled: false,
    inset: false,
  }
)

const emit = defineEmits<{
  select: [event: globalThis.Event]
}>()
</script>

<template>
  <MenubarItem
    :disabled="disabled"
    :class="
      cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        inset && 'pl-8',
        props.class
      )
    "
    @select="emit('select', $event)"
  >
    <slot />
  </MenubarItem>
</template>
