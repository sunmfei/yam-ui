<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useElementTheme } from '@/config/element-theme'
import BaseBackground from '@/components/base/background/BaseBackground.vue'

const appStore = useAppStore()
const { customProperties } = useElementTheme()

// 监听主题变化，更新 Element Plus 的深色模式和自定义样式
watch(
  () => appStore.isDark,
  (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  },
  { immediate: true }
)
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
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
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
