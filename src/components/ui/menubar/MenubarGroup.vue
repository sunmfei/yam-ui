<script setup lang="ts">
import { MenubarGroup } from 'reka-ui'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <MenubarGroup :class="props.class">
    <slot />
  </MenubarGroup>
</template>
