<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NSpace, NIcon, NDropdown } from 'naive-ui'
import { computed, h } from 'vue'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

function navigateTo(path: string) {
  router.push(path)
}

function toggleTheme() {
  appStore.toggleTheme()
}

// 主题图标
const themeIcon = computed(() => {
  return h('span', { class: 'text-lg' }, appStore.isDark ? '🌙' : '☀️')
})

// 用户下拉菜单选项
const userOptions = computed(() => [
  {
    label: 'Profile',
    key: 'profile',
  },
  {
    label: 'Settings',
    key: 'settings',
  },
  {
    type: 'divider',
    key: 'd1',
  },
  {
    label: 'Logout',
    key: 'logout',
  },
])

function handleUserMenuSelect(key: string) {
  if (key === 'logout') {
    userStore.logout()
  }
}
</script>

<template>
  <nav class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <span class="cursor-pointer text-xl font-bold" @click="navigateTo('/')">Yam UI</span>
      </div>

      <!-- Navigation Links -->
      <div class="hidden space-x-6 md:flex">
        <NButton
          text
          :class="[
            'transition hover:text-blue-500',
            route.path === '/' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300',
          ]"
          @click="navigateTo('/')"
        >
          Home
        </NButton>
        <NButton
          text
          :class="[
            'transition hover:text-blue-500',
            route.path === '/about' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300',
          ]"
          @click="navigateTo('/about')"
        >
          About
        </NButton>
      </div>

      <!-- Actions -->
      <NSpace :size="12">
        <!-- Theme Toggle -->
        <NButton
          circle
          :title="appStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="toggleTheme"
        >
          <template #icon>
            <NIcon :component="themeIcon" />
          </template>
        </NButton>

        <!-- User Info or Login -->
        <NDropdown
          v-if="userStore.isLoggedIn"
          :options="userOptions"
          @select="handleUserMenuSelect"
        >
          <NButton quaternary>
            <NSpace align="center">
              <img
                v-if="userStore.userInfo?.avatar"
                :src="userStore.userInfo.avatar"
                :alt="userStore.userInfo.name"
                class="h-8 w-8 rounded-full"
              />
              <span class="text-sm">{{ userStore.userInfo?.name }}</span>
            </NSpace>
          </NButton>
        </NDropdown>
        <NButton v-else type="primary" @click="navigateTo('/login')">Login</NButton>
      </NSpace>
    </div>
  </nav>
</template>
