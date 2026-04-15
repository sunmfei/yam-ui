<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import {
  ElButton,
  ElCard,
  ElTag,
  ElSwitch,
  ElSelect,
  ElOption,
  ElSpace,
} from 'element-plus'
import { BACKGROUND_OPTIONS } from '@/types/background'

import Search from '@/views/search/index.vue'

const appStore = useAppStore()

// 使用共享的背景选项
const backgroundOptions = BACKGROUND_OPTIONS
</script>

<template>

  <div class="min-h-screen bg-transparent  overflow-hidden">
    <Search  />


    <!-- Features Section -->
    <div class="container mx-auto px-4 py-16">
      <h2 class="mb-8 text-center text-3xl font-bold">Features</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <ElCard title="🚀 Fast" shadow="hover">
          <p class="text-gray-600 dark:text-gray-400">
            Built with Vite for lightning-fast development and builds
          </p>
          <template #footer>
            <ElSpace>
              <ElTag type="success" size="small">Vite</ElTag>
              <ElTag type="info" size="small">Fast</ElTag>
            </ElSpace>
          </template>
        </ElCard>
        <ElCard title="🎨 Beautiful" shadow="hover">
          <p class="text-gray-600 dark:text-gray-400">
            Styled with TailwindCSS for modern, responsive designs
          </p>
          <template #footer>
            <ElSpace>
              <ElTag type="warning" size="small">TailwindCSS</ElTag>
              <ElTag type="info" size="small">Responsive</ElTag>
            </ElSpace>
          </template>
        </ElCard>
        <ElCard title="💪 Type Safe" shadow="hover">
          <p class="text-gray-600 dark:text-gray-400">
            Full TypeScript support for better developer experience
          </p>
          <template #footer>
            <ElSpace>
              <ElTag type="danger" size="small">TypeScript</ElTag>
              <ElTag type="info" size="small">Safe</ElTag>
            </ElSpace>
          </template>
        </ElCard>
      </div>

      <!-- Theme Demo Section -->
      <div class="mt-16">
        <h2 class="mb-8 text-center text-3xl font-bold">Theme & Background Demo</h2>
        <ElCard title="Element Plus Integration" class="mx-auto max-w-2xl">
          <p class="mb-4 text-gray-600 dark:text-gray-400">
            Try switching the theme using the button in the navbar. All Element Plus components will
            automatically adapt to the current theme.
          </p>
          <ElSpace direction="vertical" :size="16" style="width: 100%">
            <div class="flex items-center justify-between">
              <span>Current Theme:</span>
              <ElTag :type="appStore.isDark ? 'info' : 'warning'">
                {{ appStore.isDark ? 'Dark Mode 🌙' : 'Light Mode ☀️' }}
              </ElTag>
            </div>
            <div class="flex items-center justify-between">
              <span>Toggle Theme:</span>
              <ElSwitch v-model="appStore.isDark">
                <template #active-action>
                  <el-icon><moon /></el-icon>
                </template>
                <template #inactive-action>
                  <el-icon><sunny /></el-icon>
                </template>
              </ElSwitch>
            </div>
            <div class="flex items-center justify-between">
              <span>Background Type:</span>
              <ElSelect
                v-model="appStore.backgroundType"
                placeholder="Select"
                style="width: 150px"
              >
                <ElOption
                  v-for="item in backgroundOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </ElSelect>
            </div>
            <ElSpace>
              <ElButton type="primary">Primary Button</ElButton>
              <ElButton type="success">Success Button</ElButton>
              <ElButton type="warning">Warning Button</ElButton>
              <ElButton type="danger">Error Button</ElButton>
            </ElSpace>
          </ElSpace>
        </ElCard>
      </div>
    </div>
  </div>
</template>
