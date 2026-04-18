<script setup lang="ts">
import { SelectRoot, type SelectRootEmits, type SelectRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

/**
 * BaseSelect - 基础选择器组件
 *
 * 封装 reka-ui SelectRoot，提供统一的选择器接口
 * 禁止在业务代码中直接使用 ui/select
 */
defineOptions({
  name: 'BaseSelect',
})

const _props = defineProps<SelectRootProps & { class?: HTMLAttributes['class'] }>()

const _emits = defineEmits<SelectRootEmits>()
</script>

<template>
  <SelectRoot v-bind="_props" @update:model-value="_emits('update:modelValue', $event)">
    <slot />
  </SelectRoot>
</template>
