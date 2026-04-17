<script setup lang="ts">
import { MenubarRoot } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    modelValue?: string
    defaultValue?: string
  }>(),
  {
    modelValue: undefined,
    defaultValue: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <MenubarRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :class="
      cn(
        'flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm',
        props.class
      )
    "
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </MenubarRoot>
</template>
