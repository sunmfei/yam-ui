<script setup lang="ts">
import { useElementTheme } from '@/config/element-theme'
import BaseBackground from '@/components/base/background/BaseBackground.vue'
import { Toaster } from '@/components/ui/sonner'

const { customProperties } = useElementTheme()
</script>

<template>
  <div class="relative min-h-screen w-full" :style="customProperties">
    <!-- 全局背景 -->
    <BaseBackground />
    <!-- 内容区域 -->
    <div class="relative z-50">
      <!--        <AppNavbar />-->
      <main class="w-full">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <div :key="$route.fullPath" class="h-full">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </main>
    </div>
    <!-- Toast 通知 - 最高层级 -->
    <div class="fixed inset-0 pointer-events-none z-[99999]">
      <Toaster position="top-center" :duration="3000" />
    </div>
  </div>
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
