<script setup lang="ts">
import { MenubarSub } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

// Sub
defineProps<{
  class?: HTMLAttributes['class']
}>()

defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <MenubarSub>
    <slot />
  </MenubarSub>
</template>
