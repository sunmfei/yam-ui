<template>
  <!--
    搜索框外层：
    - 居中适配
    - 玻璃拟�?+ 发光边框
    - Motion 控制入场动画
  -->
  <Motion
    :initial="{ opacity: 0, y: 20, scale: 0.96 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :transition="{ duration: 0.5 }"
  >
    <div class="relative w-full max-w-2xl mx-auto">
      <!-- 外层光晕 -->
      <div
        class="absolute -inset-1 rounded-2xl blur-xl transition-all duration-300"
        :class="focus ? 'bg-gradient-to-r from-purple-500/40 to-blue-500/40' : 'bg-transparent'"
      />

      <!-- 主体搜索�?-->
      <div
        class="relative flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 transition-all duration-300"
        :class="focus ? 'scale-[1.02] border-purple-400/40 shadow-lg shadow-purple-500/20' : ''"
      >
        <!-- 搜索图标 -->
        <div class="text-white/60">🔍</div>

        <!-- 输入�?-->
        <input
          v-model="value"
          type="text"
          placeholder="搜索你想要的内容..."
          class="flex-1 bg-transparent outline-none text-white text-lg placeholder-white/40"
          @focus="focus = true"
          @blur="focus = false"
          @keyup.enter="handleSearch"
        />

        <!-- 清除按钮 -->
        <button v-if="value" class="text-white/60 hover:text-white transition" @click="clear">
          �?
        </button>

        <!-- 搜索按钮 -->
        <button
          class="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 active:scale-95 transition"
          @click="handleSearch"
        >
          搜索
        </button>
      </div>

      <!-- 输入提示光标动画 -->
      <Motion
        v-if="focus"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        class="absolute left-14 top-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div class="w-[2px] h-5 bg-purple-400 animate-pulse" />
      </Motion>
    </div>
  </Motion>
</template>

<script setup lang="ts">
/**
 * 搜索框逻辑说明�?
 * 1. value：输入内�?
 * 2. focus：控制动效状�?
 * 3. handleSearch：触发搜索事�?
 * 4. clear：清空输�?
 * 5. emit：向父组件抛�?searchBox 事件
 */

import { ref } from 'vue'
import { Motion } from 'motion-v'

const value = ref('')
const focus = ref(false)

const emit = defineEmits<{
  (e: 'search', value: string): void
}>()

/**
 * 执行搜索�?
 * - 空值不触发
 * - 向父组件抛出关键�?
 */
const handleSearch = () => {
  if (!value.value.trim()) return
  emit('search', value.value.trim())
}

/**
 * 清空输入�?
 */
const clear = () => {
  value.value = ''
}
</script>
