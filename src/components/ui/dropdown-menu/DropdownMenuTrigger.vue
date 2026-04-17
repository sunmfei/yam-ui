<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui'

const props = defineProps<{
  asChild?: boolean
}>()
</script>

<template>
  <DropdownMenuTrigger v-bind="props">
    <slot />
  </DropdownMenuTrigger>
</template>
