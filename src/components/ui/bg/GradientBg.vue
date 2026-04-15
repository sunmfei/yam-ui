<script setup lang="ts">
interface Props {
  class?: string
}

withDefaults(defineProps<Props>(), {
  class: '',
})
</script>

<template>
  <div
    :class="[
      'absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      $props.class,
    ]"
  >
    <!-- 渐变光晕效果 -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-300/30 blur-3xl dark:bg-purple-600/20"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-600/20"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/20 blur-3xl dark:bg-pink-600/10"
      ></div>
    </div>
  </div>
</template>
