<template>
  <component :is="props.name" :style="style" />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: '5',
  },
  width: {
    type: String,
    default: '5',
  },
})

const style = computed(() => {
  return {
    height: props.height,
    width: props.width,
  }
})
</script>
