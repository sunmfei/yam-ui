<script setup lang="ts">
import { MenubarSeparator } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <MenubarSeparator :class="cn('-mx-1 my-1 h-px bg-muted', props.class)" />
</template>
