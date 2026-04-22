<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { glassSwitch } from '@/lib/glass-theme'

/**
 * BaseSwitch - 基础开关组�?
 *
 * 封装 ui/switch，提供统一的开关样�?
 * 禁止在业务代码中直接使用 ui/switch
 */
defineOptions({
  name: 'BaseSwitch',
})

interface Props {
  modelValue?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 检测是否为深色模式
const isDark = computed(() => document.documentElement.classList.contains('dark'))

// 根据主题和状态动态获取类�?
const switchClasses = computed(() => {
  const baseClasses =
    'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'
  const stateClasses = isChecked.value
    ? glassSwitch.checked
    : isDark.value
      ? glassSwitch.unchecked.dark
      : glassSwitch.unchecked.light
  return cn(baseClasses, stateClasses, props.class)
})

const knobClasses = computed(() => {
  const baseClasses =
    'pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-all duration-300'
  const stateClasses = isChecked.value
    ? 'translate-x-5 bg-primary'
    : 'translate-x-0 bg-gray-400 dark:bg-slate-500'
  return cn(baseClasses, stateClasses)
})
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="isChecked"
    :class="switchClasses"
    @click="isChecked = !isChecked"
  >
    <span :class="knobClasses" />
  </button>
</template>
