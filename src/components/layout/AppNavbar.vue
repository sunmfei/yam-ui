<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'

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
</script>

<template>
  <nav class="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <span class="text-xl font-bold" @click="navigateTo('/')">Yam UI</span>
      </div>

      <!-- Navigation Links -->
      <div class="hidden space-x-6 md:flex">
        <button
          @click="navigateTo('/')"
          :class="[
            'transition hover:text-blue-500',
            route.path === '/' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300',
          ]"
        >
          Home
        </button>
        <button
          @click="navigateTo('/about')"
          :class="[
            'transition hover:text-blue-500',
            route.path === '/about' ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300',
          ]"
        >
          About
        </button>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-4">
        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-gray-800"
          :title="appStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <span v-if="appStore.isDark">🌙</span>
          <span v-else>☀️</span>
        </button>

        <!-- User Info or Login -->
        <div v-if="userStore.isLoggedIn" class="flex items-center space-x-2">
          <img
            v-if="userStore.userInfo?.avatar"
            :src="userStore.userInfo.avatar"
            :alt="userStore.userInfo.name"
            class="h-8 w-8 rounded-full"
          />
          <span class="text-sm">{{ userStore.userInfo?.name }}</span>
          <button @click="userStore.logout()" class="text-sm text-red-500 hover:text-red-600">
            Logout
          </button>
        </div>
        <button
          v-else
          @click="navigateTo('/login')"
          class="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Login
        </button>
      </div>
    </div>
  </nav>
</template>
