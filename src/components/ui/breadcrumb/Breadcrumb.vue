<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  title: string
  path?: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
  items?: BreadcrumbItem[]
}>()
</script>

<template>
  <nav
    aria-label="breadcrumb"
    data-slot="breadcrumb"
    :class="cn('flex items-center gap-2 text-sm text-muted-foreground', props.class)"
  >
    <template v-if="items && items.length > 0">
      <template v-for="(item, index) in items" :key="index">
        <template v-if="item.path && index < items.length - 1">
          <a :href="item.path" class="transition-colors hover:text-foreground">
            {{ item.title }}
          </a>
          <span class="text-muted-foreground">/</span>
        </template>
        <span v-else class="text-foreground font-medium">
          {{ item.title }}
        </span>
      </template>
    </template>
    <slot v-else />
  </nav>
</template>
