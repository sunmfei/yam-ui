<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem, ElAvatar } from 'element-plus'
import { computed } from 'vue'
import { Sunny, Moon } from '@element-plus/icons-vue'

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
const ThemeIcon = computed(() => (appStore.isDark ? Sunny : Moon))

// 用户下拉菜单选项
function handleUserMenuSelect(key: string) {
  if (key === 'logout') {
    userStore.logout()
  }
}
</script>

<template>
  <nav
    class="sticky top-0 z-50 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl transition-all duration-300 dark:border-gray-700/50 dark:bg-gray-900/70"
  >
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <!-- Logo -->
      <div class="flex items-center space-x-3">
        <div
          class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-transform hover:scale-105"
          @click="navigateTo('/')"
        >
          <span class="text-lg font-bold text-white">Sun</span>
        </div>
        <span
          class="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent transition-all hover:opacity-80 dark:from-blue-400 dark:to-purple-400"
          @click="navigateTo('/')"
        >
          MFei
        </span>
      </div>

      <!-- Navigation Links -->
      <div class="hidden space-x-2 md:flex">
        <ElButton
          text
          :class="[
            'relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
            route.path === '/'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
          ]"
          @click="navigateTo('/')"
        >
          Home
        </ElButton>
        <ElButton
          text
          :class="[
            'relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
            route.path === '/about'
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white',
          ]"
          @click="navigateTo('/about')"
        >
          About
        </ElButton>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <ElButton
          circle
          :title="appStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          class="transition-all duration-300 hover:scale-110 hover:shadow-lg"
          :class="
            appStore.isDark
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600'
              : 'bg-gray-100 text-orange-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
          "
          @click="toggleTheme"
        >
          <el-icon :size="20">
            <component :is="ThemeIcon" />
          </el-icon>
        </ElButton>

        <!-- User Info or Login -->
        <ElDropdown v-if="userStore.isLoggedIn" @command="handleUserMenuSelect">
          <ElButton text class="rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800">
            <div class="flex items-center gap-2">
              <ElAvatar
                v-if="userStore.userInfo?.avatar"
                :src="userStore.userInfo.avatar"
                :alt="userStore.userInfo.name"
                :size="32"
                class="border-2 border-gray-200 dark:border-gray-700"
              />
              <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ userStore.userInfo?.name }}
              </span>
            </div>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="profile">Profile</ElDropdownItem>
              <ElDropdownItem command="settings">Settings</ElDropdownItem>
              <ElDropdownItem divided command="logout">Logout</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>

        <ElButton
          v-else
          type="primary"
          class="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 font-medium transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg dark:from-blue-600 dark:to-purple-700 dark:hover:from-blue-700 dark:hover:to-purple-800"
          @click="navigateTo('/login')"
        >
          Login
        </ElButton>
      </div>
    </div>
  </nav>
</template>
