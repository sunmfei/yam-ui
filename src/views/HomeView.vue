<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import ParticlesBg from '@/components/ui/ParticlesBg.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div
      class="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden"
    >
      <span
        class="pointer-events-none bg-linear-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10"
      >
        Yam UI
      </span>
      <p class="mt-4 text-xl text-gray-600 dark:text-gray-400">A Modern Vue 3 Component Library</p>
      <ParticlesBg
        :key="appStore.isDark.toString()"
        class="absolute inset-0"
        :quantity="100"
        :ease="100"
        :color="appStore.isDark ? '#FFF' : '#000'"
        :staticity="10"
        refresh
      />
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
      <h2 class="mb-8 text-center text-3xl font-bold">Features</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="rounded-lg border p-6 shadow-sm">
          <h3 class="mb-2 text-xl font-semibold">🚀 Fast</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Built with Vite for lightning-fast development and builds
          </p>
        </div>
        <div class="rounded-lg border p-6 shadow-sm">
          <h3 class="mb-2 text-xl font-semibold">🎨 Beautiful</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Styled with TailwindCSS for modern, responsive designs
          </p>
        </div>
        <div class="rounded-lg border p-6 shadow-sm">
          <h3 class="mb-2 text-xl font-semibold">💪 Type Safe</h3>
          <p class="text-gray-600 dark:text-gray-400">
            Full TypeScript support for better developer experience
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
