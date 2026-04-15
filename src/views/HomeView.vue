<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { NButton, NCard, NSpace, NTag, NSwitch, NSelect } from 'naive-ui'

const appStore = useAppStore()

// 背景类型选项
const backgroundOptions = [
  { label: '粒子效果', value: 'particles' },
  { label: '渐变光晕', value: 'gradient' },
  { label: '网格线条', value: 'grid' },
  { label: '波浪动画', value: 'wave' },
  { label: '🌾 自然风景', value: 'nature' },
  { label: '无背景', value: 'none' },
]
</script>

<template>
  <div class="min-h-screen bg-transparent">
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
    </div>

    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
      <h2 class="mb-8 text-center text-3xl font-bold">Features</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <NCard title="🚀 Fast" hoverable>
          <p class="text-gray-600 dark:text-gray-400">
            Built with Vite for lightning-fast development and builds
          </p>
          <template #footer>
            <NSpace>
              <NTag type="success" size="small">Vite</NTag>
              <NTag type="info" size="small">Fast</NTag>
            </NSpace>
          </template>
        </NCard>
        <NCard title="🎨 Beautiful" hoverable>
          <p class="text-gray-600 dark:text-gray-400">
            Styled with TailwindCSS for modern, responsive designs
          </p>
          <template #footer>
            <NSpace>
              <NTag type="warning" size="small">TailwindCSS</NTag>
              <NTag type="info" size="small">Responsive</NTag>
            </NSpace>
          </template>
        </NCard>
        <NCard title="💪 Type Safe" hoverable>
          <p class="text-gray-600 dark:text-gray-400">
            Full TypeScript support for better developer experience
          </p>
          <template #footer>
            <NSpace>
              <NTag type="error" size="small">TypeScript</NTag>
              <NTag type="info" size="small">Safe</NTag>
            </NSpace>
          </template>
        </NCard>
      </div>

      <!-- Theme Demo Section -->
      <div class="mt-16">
        <h2 class="mb-8 text-center text-3xl font-bold">Theme & Background Demo</h2>
        <NCard title="Naive UI Integration" class="mx-auto max-w-2xl">
          <p class="mb-4 text-gray-600 dark:text-gray-400">
            Try switching the theme using the button in the navbar. All Naive UI components will
            automatically adapt to the current theme.
          </p>
          <NSpace vertical :size="16">
            <div class="flex items-center justify-between">
              <span>Current Theme:</span>
              <NTag :type="appStore.isDark ? 'info' : 'warning'">
                {{ appStore.isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️' }}
              </NTag>
            </div>
            <div class="flex items-center justify-between">
              <span>Toggle Theme:</span>
              <NSwitch v-model:value="appStore.isDark">
                <template #checked>🌙</template>
                <template #unchecked>☀️</template>
              </NSwitch>
            </div>
            <div class="flex items-center justify-between">
              <span>Background Type:</span>
              <NSelect
                v-model:value="appStore.backgroundType"
                :options="backgroundOptions"
                style="width: 150px"
              />
            </div>
            <NSpace>
              <NButton type="primary">Primary Button</NButton>
              <NButton type="success">Success Button</NButton>
              <NButton type="warning">Warning Button</NButton>
              <NButton type="error">Error Button</NButton>
            </NSpace>
          </NSpace>
        </NCard>
      </div>
    </div>
  </div>
</template>
