<script setup lang="ts">
import { SelectRoot, type SelectRootEmits, type SelectRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

const _props = defineProps<SelectRootProps & { class?: HTMLAttributes['class'] }>()

const _emits = defineEmits<SelectRootEmits>()
</script>

<template>
  <SelectRoot v-bind="_props" @update:model-value="_emits('update:modelValue', $event)">
    <slot />
  </SelectRoot>
</template>
