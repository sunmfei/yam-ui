<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { useNaiveTheme } from '@/config/theme'
import AppBackground from '@/components/ui/AppBackground.vue'

const { naiveTheme, themeOverrides } = useNaiveTheme()
</script>

<template>
  <NConfigProvider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <div class="relative min-h-screen w-full">
      <!-- 全局背景 -->
      <AppBackground />

      <!-- 内容区域 -->
      <div class="relative z-50">
        <!--        <AppNavbar />-->
        <main class="w-full">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </NConfigProvider>
</template>

<style>
/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
