<script setup lang="ts">
import type { DialogRootEmits, DialogRootProps } from 'reka-ui'
import { DialogRoot, useForwardPropsEmits } from 'reka-ui'

/**
 * BaseModal - 基础模态框组件
 *
 * 封装 reka-ui DialogRoot，提供统一的模态框接口
 * 禁止在业务代码中直接使用 ui/dialog
 */
defineOptions({
  name: 'BaseModal',
})

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-slot="slotProps" data-slot="dialog" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </DialogRoot>
</template>
