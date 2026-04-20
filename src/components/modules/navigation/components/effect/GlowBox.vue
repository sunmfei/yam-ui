<script setup lang="ts">
/**
 * 功能：hover发光效果
 * 结果：增强视觉层级
 * 设计目的：提升质感
 */
</script>

<template>
  <div class="relative group">
    <div
      class="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl"
    />
    <div class="relative">
      <slot />
    </div>
  </div>
</template>
